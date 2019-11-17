package com.lzz.listener;

import com.lzz.aop.annotation.ConnFromTypeHandler;
import com.lzz.connector.ConnectorFrom;
import com.lzz.strategy.ConnFromServiceContext;
import org.springframework.context.ApplicationListener;
import org.springframework.context.event.ContextRefreshedEvent;
import org.springframework.stereotype.Component;

import java.util.Map;

/**
 *
 * 　  * @className: ConnFromServiceListener
 *
 * @description 扫描累
 * 　　* @param
 * 　　* @return
 * 　　* @throws
 * 　　* @author lizz
 * 　　* @date 2019  11 17 13:27
 *
 */
@Component
public class ConnFromServiceListener implements ApplicationListener<ContextRefreshedEvent> {
    @Override
    public void onApplicationEvent(ContextRefreshedEvent event) {
        Map<String, Object> beans = event.getApplicationContext().getBeansWithAnnotation(ConnFromTypeHandler.class);
        ConnFromServiceContext ConnFromServiceContext = event.getApplicationContext().getBean(ConnFromServiceContext.class);
        beans.forEach((name, bean) -> {
            ConnFromTypeHandler typeHandler = bean.getClass().getAnnotation(ConnFromTypeHandler.class);
            ConnFromServiceContext.putConnectorService(typeHandler.value().code, (ConnectorFrom) bean);
        });
    }
}
