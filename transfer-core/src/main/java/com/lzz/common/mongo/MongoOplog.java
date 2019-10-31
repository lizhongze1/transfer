package com.lzz.common.mongo;
import com.lzz.common.index.ElasticsearchIndexImpl;
import com.mongodb.*;
import com.google.common.base.Charsets;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.stream.JsonReader;
import com.mongodb.BasicDBObject;
import com.mongodb.BasicDBObjectBuilder;
import com.mongodb.MongoClientURI;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoCursor;
import com.mongodb.client.model.UpdateOptions;
import lombok.extern.log4j.Log4j2;
import org.apache.commons.io.output.FileWriterWithEncoding;
import org.bson.BsonTimestamp;
import org.bson.Document;
import org.bson.conversions.Bson;
import org.bson.types.BSONTimestamp;
import org.springframework.beans.factory.InitializingBean;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

import java.io.File;
import java.io.FileReader;
import java.io.IOException;
import java.io.Writer;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.atomic.AtomicBoolean;

/* /**
　　* @description: mongoplog监控
　　* @param ${tags}
　　* @return ${return_type}
　　* @throws
　　* @author lizz
　　* @date 2019/10/26 21:06
　　*/
@Component
@Log4j2
public class MongoOplog implements InitializingBean {

    private BSONTimestamp lastTimeStamp = null;

    private MongoClient mongoClient = null;

    @Value("${mg.mongodb.tables}")
    private String mongodbTables;

    @Value("${spring.data.mongodb.uri}")
    private String mongodbUri;

    @Value("${spring.data.mongodb.log-date-path}")
    private String logDatePath;

    @Autowired
    private ElasticsearchIndexImpl<String> elasticsearchService;

    private AtomicBoolean running = new AtomicBoolean(true);

    private void persistTimeStamp(BSONTimestamp timestamp) throws IOException {
        try (final Writer writer = new FileWriterWithEncoding(logDatePath, Charsets.UTF_8)) {
            Gson gson = new GsonBuilder().create();
            gson.toJson(timestamp, writer);
            writer.flush();
        }
    }

    private BasicDBObject getTimeQuery() {
        final BasicDBObject timeQuery = new BasicDBObject();
        if (lastTimeStamp != null) {
            timeQuery.put("ts", BasicDBObjectBuilder.start("$gt", lastTimeStamp).get());
        }
        return timeQuery;
    }

    private BSONTimestamp readTimestamp() throws IOException {
        final BSONTimestamp noPreviousTimestamp = null;
        final File file = new File(logDatePath);
        if (file.exists()) {
            try (FileReader fileReader = new FileReader(file)) {
                final JsonReader reader = new JsonReader(fileReader);
                Gson gson = new GsonBuilder().create();
                final BSONTimestamp lastTimeStamp = gson.fromJson(reader, BSONTimestamp.class);
                return lastTimeStamp != null ? lastTimeStamp : noPreviousTimestamp;
            }
        }
        return noPreviousTimestamp;
    }

    //初始化 readTimestamp 配置文件
    @Override
    public void afterPropertiesSet() throws Exception {
        lastTimeStamp = readTimestamp();
        MongoClientURI connectionUri = new MongoClientURI(mongodbUri);
        mongoClient = new MongoClient(connectionUri);   //连接对象
    }


    public boolean run() {
        log.info("mongo sync elasticsearch start ...");
        final MongoCollection<Document> fromCollection = mongoClient.getDatabase("local").getCollection("oplog.rs");
        final BasicDBObject timeQuery = getTimeQuery();
        BsonTimestamp lastReadTimestamp = new BsonTimestamp(1489568405, 34);
/*        Bson filter = new Document("$gt", lastReadTimestamp);*/

/*        MongoCursor<Document>  oplogCursor =
                fromCollection
                        .find(new Document("ts", filter))
                        .cursorType(CursorType.TailableAwait)
                        .noCursorTimeout(true)
                        .batchSize(1000)
                        .iterator();*/
        MongoCursor<Document> opCursor = fromCollection.find(timeQuery)
                .sort(new BasicDBObject("$natural", 1))
                .cursorType(CursorType.TailableAwait)
                .noCursorTimeout(true).iterator();
        while (running.get()) {
            try {
                if (opCursor != null && opCursor.hasNext()){
                    final Document document = opCursor.next();
                    final String ns = (String) document.get("ns");
                    if (StringUtils.isEmpty(ns)){
                        //log.info("this is index.mapping information. usually looks like is null");
                        continue;
                    }
                    // this is index.mapping information. usually looks like "index.mapping"
                    final String mapping = ns.split("\\.")[1];
                    if (StringUtils.isEmpty(mapping) || !mongodbTables.contains(mapping)) {
                        //log.info("We are not supporting other mappings than supportedMappings Requested mapping name is: {}", mapping);
                        continue;
                    }
                    BsonTimestamp ts = (BsonTimestamp) document.get("ts");
                    lastTimeStamp = new BSONTimestamp(ts.getTime(), ts.getInc());
                    UpdateOptions updateOptions = new UpdateOptions();
                    updateOptions.upsert(true);
                    try {
                        persistTimeStamp(lastTimeStamp);
                    } catch (IOException e) {
                        e.printStackTrace();
                    }
                   elasticsearchService.screenMongoDmlEs(document);
/*                    CompletableFuture.runAsync(()->
                            elasticsearchService.screenMongoDmlEs(document)
                    );*/
                }else {
                    log.info("sleep  5s");
                    Thread.sleep(5000);
                }
            }catch (Exception e){
                e.printStackTrace();
            }
        }
        return true;
    }
}
