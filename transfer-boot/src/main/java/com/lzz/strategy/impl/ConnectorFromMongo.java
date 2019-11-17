package com.lzz.strategy.impl;

import com.alibaba.fastjson.JSONObject;
import com.lzz.connector.ConnectorFrom;
import com.lzz.entity.ConnTypeInfo;
import com.lzz.enums.ConType;
import org.springframework.stereotype.Service;
import com.lzz.aop.annotation.*;


/**
 *
 * 　  * @className: ConnectorFromImp
 *
 * @description mongodbe连接开始逻辑
 * 　　* @param
 * 　　* @return
 * 　　* @throws
 * 　　* @author lizz
 * 　　* @date 2019  11 17  13:01
 *
 */
@Service
@ConnFromTypeHandler(value = ConType.MONGO)
public class ConnectorFromMongo implements ConnectorFrom {
    @Override
    public void handle(ConnTypeInfo connTypeInfo){
    }
}
