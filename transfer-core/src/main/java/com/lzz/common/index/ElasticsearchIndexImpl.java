package com.lzz.common.index;


import com.lzz.common.enums.MongoDdl;

import com.lzz.common.utils.IndexTools;
import com.lzz.common.utils.MetaData;
import lombok.extern.log4j.Log4j2;
import org.bson.Document;
import org.elasticsearch.ElasticsearchException;
import org.elasticsearch.action.DocWriteResponse;
import org.elasticsearch.action.admin.indices.create.CreateIndexRequest;
import org.elasticsearch.action.admin.indices.create.CreateIndexResponse;
import org.elasticsearch.action.admin.indices.delete.DeleteIndexRequest;
import org.elasticsearch.action.admin.indices.get.GetIndexRequest;
import org.elasticsearch.action.delete.DeleteRequest;
import org.elasticsearch.action.delete.DeleteResponse;
import org.elasticsearch.action.get.GetRequest;
import org.elasticsearch.action.get.GetResponse;
import org.elasticsearch.action.index.IndexRequest;
import org.elasticsearch.action.index.IndexResponse;
import org.elasticsearch.action.support.master.AcknowledgedResponse;
import org.elasticsearch.action.support.replication.ReplicationResponse;
import org.elasticsearch.client.RequestOptions;
import org.elasticsearch.client.RestHighLevelClient;
import org.elasticsearch.common.settings.Settings;
import org.elasticsearch.common.xcontent.XContentType;
import org.elasticsearch.rest.RestStatus;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import com.lzz.common.utils.MappingData;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;
import java.util.Objects;
/* /**
　　* @description: es增删改查实现类
　　* @param ${tags}
　　* @return ${return_type}
　　* @throws
　　* @author lizz
　　* @date 2019/10/27 23:33
　　*/
@Component
@Log4j2
public class ElasticsearchIndexImpl<T> implements ElasticsearchIndex<T> {
    @Autowired
    RestHighLevelClient client;
/*    @Autowired
    private com.lzz.common.repository.ElasticsearchTemplate<T,String> elasticsearchTemplate;*/


    @Override
    public void createIndex(Class<T> clazz) throws Exception{
        MetaData metaData = IndexTools.getMetaData(clazz);
        CreateIndexRequest request = new CreateIndexRequest(metaData.getIndexname());

        StringBuffer source = new StringBuffer();
        source.append("  {\n" +
                "    \""+metaData.getIndextype()+"\": {\n" +
                "      \"properties\": {\n");
        MappingData[] mappingDataList = IndexTools.getMappingData(clazz);

        boolean isAutocomplete = false;
        for (int i = 0; i < mappingDataList.length; i++) {
            MappingData mappingData = mappingDataList[i];
            if(mappingData == null || mappingData.getField_name() == null){
                continue;
            }
            source.append(" \""+mappingData.getField_name()+"\": {\n");
            source.append(" \"type\": \""+mappingData.getDatatype()+"\"\n");
            if(!StringUtils.isEmpty(mappingData.getCopy_to())){
                source.append(" ,\"copy_to\": \""+mappingData.getCopy_to()+"\"\n");
            }
            if(!mappingData.isAllow_search()){
                source.append(" ,\"index\": false\n");
            }
            if(mappingData.isAutocomplete() && (mappingData.getDatatype().equals("text") || mappingData.getDatatype().equals("keyword"))){
                source.append(" ,\"analyzer\": \"autocomplete\"\n");
                source.append(" ,\"search_analyzer\": \"standard\"\n");
                isAutocomplete = true;
            }else if(mappingData.getDatatype().equals("text")){
                source.append(" ,\"analyzer\": \"" + mappingData.getAnalyzer() + "\"\n");
                source.append(" ,\"search_analyzer\": \"" + mappingData.getSearch_analyzer() + "\"\n");
            }
            if(mappingData.isKeyword() && !mappingData.getDatatype().equals("keyword")){
                source.append(" \n");
                source.append(" ,\"fields\": {\n");
                source.append(" \"keyword\": {\n");
                source.append(" \"type\": \"keyword\",\n");
                source.append(" \"ignore_above\": "+mappingData.getIgnore_above());
                source.append(" }\n");
                source.append(" }\n");
            }else if(mappingData.isSuggest()){
                source.append(" \n");
                source.append(" ,\"fields\": {\n");
                source.append(" \"suggest\": {\n");
                source.append(" \"type\": \"completion\",\n");
                source.append(" \"analyzer\": \""+mappingData.getAnalyzer()+"\",\n");
                source.append(" }\n");
                source.append(" }\n");
            }
            if(i == mappingDataList.length - 1){
                source.append(" }\n");
            }else{
                source.append(" },\n");
            }
        }
        source.append(" }\n");
        source.append(" }\n");
        source.append(" }\n");

        if(isAutocomplete){
            request.settings(Settings.builder()
                    .put("index.number_of_shards", metaData.getNumber_of_shards())
                    .put("index.number_of_replicas", metaData.getNumber_of_replicas())
                    .put("analysis.filter.autocomplete_filter.type","edge_ngram")
                    .put("analysis.filter.autocomplete_filter.min_gram",1)
                    .put("analysis.filter.autocomplete_filter.max_gram",20)
                    .put("analysis.analyzer.autocomplete.type","custom")
                    .put("analysis.analyzer.autocomplete.tokenizer","standard")
                    .putList("analysis.analyzer.autocomplete.filter",new String[]{"lowercase","autocomplete_filter"})
            );
        }else{
            request.settings(Settings.builder()
                    .put("index.number_of_shards", metaData.getNumber_of_shards())
                    .put("index.number_of_replicas", metaData.getNumber_of_replicas())
            );
        }

        request.mapping(metaData.getIndextype(),//类型定义
                source.toString(),//类型映射，需要的是一个JSON字符串
                XContentType.JSON);
        try {
            CreateIndexResponse createIndexResponse = client.indices().create(request, RequestOptions.DEFAULT);
            //返回的CreateIndexResponse允许检索有关执行的操作的信息，如下所示：
            boolean acknowledged = createIndexResponse.isAcknowledged();//指示是否所有节点都已确认请求
            System.out.println(acknowledged);
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    @Override
    public void dropIndex(Class<T> clazz) throws Exception {
        MetaData metaData = IndexTools.getIndexType(clazz);
        String indexname = metaData.getIndexname();
        DeleteIndexRequest request = new DeleteIndexRequest(indexname);
        client.indices().delete(request, RequestOptions.DEFAULT);
    }

    @Override
    public boolean exists(Class<T> clazz) throws Exception{
        MetaData metaData = IndexTools.getIndexType(clazz);
        String indexname = metaData.getIndexname();
        String indextype = metaData.getIndextype();
        GetIndexRequest request = new GetIndexRequest();
        request.indices(indexname);
        request.types(indextype);
        boolean exists = client.indices().exists(request, RequestOptions.DEFAULT);
        return exists;
    }



    /**
     * 验证索引是否存在
     *
     * @param index
     *            索引名称
     * @return
     * @throws Exception
     */
    public static boolean indexExists(RestHighLevelClient client, String index) throws Exception {
        GetIndexRequest request = new GetIndexRequest();
        request.indices(index);
        request.local(false);
        request.humanReadable(true);

        boolean exists = client.indices().exists(request, RequestOptions.DEFAULT);
        return exists;
    }

    /**
     *
     * @param index
     * @param indexType
     * @param properties
     *            结构: {name:{type:text}} {age:{type:integer}}
     * @return
     * @throws Exception
     */
    public static boolean indexCreate(RestHighLevelClient client, String index, String indexType, Map<String, Object> properties) throws Exception {

        if (indexExists(client, index)) {
            return true;
        }
        CreateIndexRequest request = new CreateIndexRequest(index);
        request.settings(Settings.builder().put("index.number_of_shards", 3).put("index.number_of_replicas", 2));

        Map<Object, Object> jsonMap = new HashMap<>();
        Map<Object, Object> mapping = new HashMap<>();
        mapping.put("properties", properties);
        jsonMap.put(indexType, mapping);
        request.mapping(indexType, jsonMap);

        CreateIndexResponse createIndexResponse = client.indices().create(request, RequestOptions.DEFAULT);
        boolean acknowledged = createIndexResponse.isAcknowledged();
        return acknowledged;
    }

    /**
     * 删除索引
     *
     * @param index
     * @return
     * @throws Exception
     */
    public static boolean indexDelete(RestHighLevelClient client, String index) throws Exception {
        try {
            DeleteIndexRequest request = new DeleteIndexRequest("does_not_exist");
            AcknowledgedResponse deleteIndexResponse = client.indices().delete(request, RequestOptions.DEFAULT);
            return deleteIndexResponse.isAcknowledged();
        } catch (ElasticsearchException exception) {
            if (exception.status() == RestStatus.NOT_FOUND) {
                return true;
            } else {
                return false;
            }
        }
    }

    /**
     * 创建更新文档
     *
     * @param index
     * @param indexType
     * @param documentId
     * @param josonStr
     * @return
     * @throws Exception
     */
    public static boolean documentCreate(RestHighLevelClient client, String index, String indexType, String documentId, String josonStr) throws Exception {
        IndexRequest request = new IndexRequest(index, indexType, documentId);

        request.source(josonStr, XContentType.JSON);
        IndexResponse indexResponse = client.index(request, RequestOptions.DEFAULT);

        if (indexResponse.getResult() == DocWriteResponse.Result.CREATED || indexResponse.getResult() == DocWriteResponse.Result.UPDATED) {
            return true;
        }
        ReplicationResponse.ShardInfo shardInfo = indexResponse.getShardInfo();
        if (shardInfo.getTotal() != shardInfo.getSuccessful()) {
            return true;
        }
        if (shardInfo.getFailed() > 0) {
            for (ReplicationResponse.ShardInfo.Failure failure : shardInfo.getFailures()) {
                throw new Exception(failure.reason());
            }
        }
        return false;
    }



    public  boolean documentDelete(String index, String indexType, String documentId) throws Exception {
        DeleteRequest request = new DeleteRequest(index, indexType, documentId);
        DeleteResponse deleteResponse = client.delete(request, RequestOptions.DEFAULT);
        if (deleteResponse.getResult() == DocWriteResponse.Result.NOT_FOUND) {
            return true;
        }
        ReplicationResponse.ShardInfo shardInfo = deleteResponse.getShardInfo();
        if (shardInfo.getTotal() != shardInfo.getSuccessful()) {
            return true;
        }
        if (shardInfo.getFailed() > 0) {
            for (ReplicationResponse.ShardInfo.Failure failure : shardInfo.getFailures()) {
                throw new Exception(failure.reason());
            }
        }
        return false;
    }

    public void screenMongoDmlEs(Document document) {

        final String operation = document.getString("op"); // get type of CRUD operation
        final Document o = (Document) document.get("o"); // this is where object lives
        final String ns = (String) document.get("ns");

        String[] arr = ns.split("\\.");
        String index = arr[0];
        String mapping = arr[1];
        MongoDdl ddl = MongoDdl.valueOf(operation);
//            String batchId = String.valueOf(o.get("batchId"));
        String _id = String.valueOf(o.get("_id"));
        //主键_id与elasticsearch _id冲突
        o.remove("_id"); // 会自动转换成对象id
        o.remove("_class");
        //index = String.format("%s_%s", index, mapping) ;
        try {
            //如果是修改，调用的是O2 内容存在o中
            if (MongoDdl.u == ddl){
                final Document o2 = (Document) document.get("o2");
                _id = String.valueOf(o2.get("_id"));
            }
            //log.info("operation to elasticsearch ddl = {}, index = {}, table = {}", ddl.getName(), index, mapping);
            elasticsearchDdl(ddl, index, mapping, _id, o);
        }catch (Exception e){
            log.error(" operation to elasticsearch error send mail manager ...ddl = {}, index = {}, table = {}, id = {}", ddl.getName(), index, mapping, _id);
            e.printStackTrace();
        }

    }


    /**
     *  新增，修改文档
     * @param indexName  索引
     * @param type mapping type
     * @param id 文档id
     * @param jsonStr 文档数据
     */
    public void addData(String indexName,String type ,String id,String jsonStr) {
        try {
            // 1、创建索引请求  //索引  // mapping type  //文档id
            IndexRequest request = new IndexRequest(indexName, type, id);     //文档id
            // 2、准备文档数据
            // 直接给JSON串
            request.source(jsonStr, XContentType.JSON);
            //4、发送请求
            IndexResponse indexResponse = null;
            try {
                // 同步方式
                indexResponse = client.index(request);
            } catch (ElasticsearchException e) {
                // 捕获，并处理异常
                //判断是否版本冲突、create但文档已存在冲突
                if (e.status() == RestStatus.CONFLICT) {
                    System.out.println("冲突了，请在此写冲突处理逻辑！" + e.getDetailedMessage());
                }
            }
            //5、处理响应
            if (indexResponse != null) {
                String index1 = indexResponse.getIndex();
                String type1 = indexResponse.getType();
                String id1 = indexResponse.getId();
                long version1 = indexResponse.getVersion();
                if (indexResponse.getResult() == DocWriteResponse.Result.CREATED) {
                    System.out.println("新增文档成功!" + index1 + type1 + id1 + version1);
                } else if (indexResponse.getResult() == DocWriteResponse.Result.UPDATED) {
                    System.out.println("修改文档成功!");
                }
                // 分片处理信息
                ReplicationResponse.ShardInfo shardInfo = indexResponse.getShardInfo();
                if (shardInfo.getTotal() != shardInfo.getSuccessful()) {
                    System.out.println("分片处理信息.....");
                }
                // 如果有分片副本失败，可以获得失败原因信息
                if (shardInfo.getFailed() > 0) {
                    for (ReplicationResponse.ShardInfo.Failure failure : shardInfo.getFailures()) {
                        String reason = failure.reason();
                        System.out.println("副本失败原因：" + reason);
                    }
                }
            }

        } catch (Exception e) {
            e.printStackTrace();
        }
    }


    /**
     * 查找文档
     *
     * @param index
     * @param type
     * @param id
     * @return
     * @throws IOException
     */
    public  Map<String, Object> getDocument( String index, String type, String id) throws IOException {
        Map<String, Object> resultMap = new HashMap<>();
        GetRequest request = new GetRequest(index, type, id);
        // 实时(否)
        request.realtime(false);
        // 检索之前执行刷新(是)
        request.refresh(true);

        GetResponse response = null;
        try {
            response = client.get(request, RequestOptions.DEFAULT);
        } catch (ElasticsearchException e) {
            if (e.status() == RestStatus.NOT_FOUND) {
                log.error("文档未找到，请检查参数！");
            }
            if (e.status() == RestStatus.CONFLICT) {
                log.error("版本冲突！");
            }
            log.error("查找失败！");
        }

        if (Objects.nonNull(response)) {
            if (response.isExists()) { // 文档存在
                resultMap = response.getSourceAsMap();
            } else {
                // 处理未找到文档的方案。 请注意，虽然返回的响应具有404状态代码，但仍返回有效的GetResponse而不是抛出异常。
                // 此时此类响应不持有任何源文档，并且其isExists方法返回false。
                log.error("文档未找到，请检查参数！");
            }
        }
        return resultMap;
    }






    public boolean elasticsearchDdl(MongoDdl ddl, String index, String mapping, String id, Document document) throws Exception {
        switch (ddl) {
            case i: // insert operation
/*                elasticsearchTemplate.prepareIndex(index, mapping, id)
                        .setSource(document).get();*/
/*try {
    this.createIndex(T);
}catch (Exception e){

}
         */
                this.addData(index,mapping,id,document.toJson());

                return true;
            case u: // update opertaion
                //此处一定要先查，在覆盖, 如果使用update查询很艰难
                Document updateSet = (Document)document.get("$set");
                Document document1 = elasticsearchSelect(index, mapping, id);
                if (document1 == null){
                    log.info("not fund index = {}, mapping = {}, id = {} update error", index, mapping, id);
                    return false;
                }
                document1.putAll(updateSet);
                this.addData(index,mapping,id,document.toJson());
                return true;
            case d: // delete operation
                //transportClient.prepareDelete(index, mapping, id).get();
                this.documentDelete(index,mapping,id);

                return true;
        }
        return false;
    }
    private Document elasticsearchSelect(String index, String mapping, String id) {
        GetResponse getFields = null;
        Map<String, Object> res=null;
        try{
            //getFields = transportClient.prepareGet(index, mapping, id).get();
            res= getDocument(index, mapping, id);
        }catch (Exception e){
            log.error("error not fund index = {}, mapping = {}, id = {}, e = {}", index, mapping, id, e.getMessage());
            try {
                //getFields = transportClient.prepareGet(index, mapping, id).get();
                res= getDocument(index, mapping, id);
            }catch (Exception e1){
                return null;
            }
        }
 /*       if (!getFields.isExists()){
            return  null;
        }*/
        if(res==null){
            return  null;
        }
/*        Map<String, Object> sourceAsMap = getFields.getSourceAsMap();*/
        Document document = new Document();
        document.putAll(res);
        return document;
    }




}
