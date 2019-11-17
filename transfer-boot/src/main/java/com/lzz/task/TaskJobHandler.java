package com.lzz.task;

import com.alibaba.fastjson.JSONObject;
import com.lzz.common.index.ElasticsearchIndexImpl;
import com.lzz.connector.ConnectorFrom;
import com.lzz.entity.ConnTypeInfo;
import com.lzz.enums.ConType;
import com.lzz.strategy.ConnFromServiceContext;
import com.xxl.job.core.biz.model.ReturnT;
import com.xxl.job.core.handler.IJobHandler;
import com.xxl.job.core.handler.annotation.JobHandler;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;


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
public class TaskJobHandler extends IJobHandler {
	@Autowired
	private ElasticsearchIndexImpl<String> elasticsearchService;
	@Autowired
	ConnFromServiceContext connFromServiceContext;
	@Override
	public ReturnT<String> execute(String param) throws Exception {
		//mongb
		ConnTypeInfo messageInfo = new ConnTypeInfo(ConType.MONGO.code,  JSONObject.parseObject(param));
		ConnectorFrom ConnectorFrom = connFromServiceContext.getConnectorService(messageInfo.getType());
		ConnectorFrom.handle(messageInfo);
		return SUCCESS;
	}


}
