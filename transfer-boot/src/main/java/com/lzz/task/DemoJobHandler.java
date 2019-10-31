package com.lzz.task;

import com.lzz.common.index.ElasticsearchIndexImpl;
import com.mongodb.BasicDBObject;
import com.mongodb.CursorType;
import com.mongodb.MongoClient;
import com.mongodb.MongoClientURI;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoCursor;
import com.mongodb.client.model.UpdateOptions;
import com.xxl.job.core.biz.model.ReturnT;
import com.xxl.job.core.handler.IJobHandler;
import com.xxl.job.core.handler.annotation.JobHandler;
import com.xxl.job.core.log.XxlJobLogger;
import org.bson.BsonTimestamp;
import org.bson.Document;
import org.bson.types.BSONTimestamp;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

import java.io.IOException;


/**
 * 任务Handler示例（Bean模式）
 *
 * 开发步骤：
 * 1、继承"IJobHandler"：“com.xxl.job.core.handler.IJobHandler”；
 * 2、注册到Spring容器：添加“@Component”注解，被Spring容器扫描为Bean实例；
 * 3、注册到执行器工厂：添加“@JobHandler(value="自定义jobhandler名称")”注解，注解value值对应的是调度中心新建任务的JobHandler属性的值。
 * 4、执行日志：需要通过 "XxlJobLogger.log" 打印执行日志；
 *
 * @author xuxueli 2015-12-19 19:43:36
 */
@JobHandler(value="demoJobHandler1")
@Component
public class DemoJobHandler extends IJobHandler {
	@Autowired
	private ElasticsearchIndexImpl<String> elasticsearchService;
	private MongoClient mongoClient = null;
	@Override
	public ReturnT<String> execute(String param) throws Exception {
		XxlJobLogger.log("XXL-JOB, Hello World.");
		XxlJobLogger.log("--------------"+param);
		 String mongodbUri="mongodb://10.20.12.32:27018,10.20.12.32:27017,10.20.12.32:27019/test?slaveOk=false&replicaSet=rs0&connectTimeoutMS=30000";
		MongoClientURI connectionUri = new MongoClientURI(mongodbUri);
		mongoClient = new MongoClient(connectionUri);   //连接对象
		final MongoCollection<Document> fromCollection = mongoClient.getDatabase("local").getCollection("oplog.rs");

/*		MongoCursor<Document> opCursor = fromCollection.find(timeQuery)
				.sort(new BasicDBObject("$natural", 1))
				.cursorType(CursorType.TailableAwait)
				.noCursorTimeout(true).iterator();*/
		return SUCCESS;
	}

	/*public boolean run() {
		log.info("mongo sync elasticsearch start ...");
		final MongoCollection<Document> fromCollection = mongoClient.getDatabase("local").getCollection("oplog.rs");
		final BasicDBObject timeQuery = getTimeQuery();
		BsonTimestamp lastReadTimestamp = new BsonTimestamp(1489568405, 34);
		*//*        Bson filter = new Document("$gt", lastReadTimestamp);*//*

*//*        MongoCursor<Document>  oplogCursor =
                fromCollection
                        .find(new Document("ts", filter))
                        .cursorType(CursorType.TailableAwait)
                        .noCursorTimeout(true)
                        .batchSize(1000)
                        .iterator();*//*
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
*//*                    CompletableFuture.runAsync(()->
                            elasticsearchService.screenMongoDmlEs(document)
                    );*//*
				}else {
					log.info("sleep  5s");
					Thread.sleep(5000);
				}
			}catch (Exception e){
				e.printStackTrace();
			}
		}
		return true;
	}*/

}
