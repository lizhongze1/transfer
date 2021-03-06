package com.lzz.strategy.impl;

import com.lzz.aop.annotation.ConnFromTypeHandler;
import com.lzz.connector.ConnectorFrom;
import com.lzz.entity.ConnTypeInfo;
import com.lzz.enums.ConType;
import org.springframework.stereotype.Service;


/**
 *
 * 　  * @className: ConnectorFromImp
 *
 * @description ORACLE连接开始逻辑
 * 　　* @param
 * 　　* @return
 * 　　* @throws
 * 　　* @author lizz
 * 　　* @date 2019  11 17  13:01
 *
 */
@Service
@ConnFromTypeHandler(value = ConType.ORACLE)
public class ConnectorFromOracle implements ConnectorFrom {
    @Override
    public void handle(ConnTypeInfo connTypeInfo){
    }
}
