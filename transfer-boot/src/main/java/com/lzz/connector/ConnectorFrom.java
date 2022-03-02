package com.lzz.connector;

import com.alibaba.fastjson.JSONObject;
import com.lzz.entity.ConnTypeInfo;

import java.io.IOException;

/**
 *
 * 　  * @className: ConnectorFrom
 *
 * @description TODO
 * 　　* @param
 * 　　* @return
 * 　　* @throws
 * 　　* @author lizz
 * 　　* @date 2019  11 17  12:57
 *
 */
public interface ConnectorFrom {
    void handle(ConnTypeInfo connTypeInfo) throws IOException;
}
