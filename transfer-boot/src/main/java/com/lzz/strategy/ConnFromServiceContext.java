package com.lzz.strategy;

import com.lzz.connector.ConnectorFrom;
import com.lzz.enums.ConType;
import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.Map;

/**
 *
 * 　  * @className: ConnFromServiceContext
 *
 * @description 转换类型获取
 * 　　* @param
 * 　　* @return
 * 　　* @throws
 * 　　* @author lizz
 * 　　* @date  2019  11 17  13:20
 *
 */
@Component
public class ConnFromServiceContext {


    private final Map<Integer, ConnectorFrom> handlerMap = new HashMap<>();

    public ConnectorFrom getConnectorService(Integer type) {
        return handlerMap.get(type);
    }

    public void putConnectorService(Integer code, ConnectorFrom connectorfrom) {
        handlerMap.put(code, connectorfrom);
    }

}
