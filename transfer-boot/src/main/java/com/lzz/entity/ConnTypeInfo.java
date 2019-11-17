package com.lzz.entity;

import com.alibaba.fastjson.JSONObject;
import groovy.util.logging.Log4j;
import groovy.util.logging.Log4j2;
import lombok.AllArgsConstructor;
import lombok.Data;

/**
 *
 * 　  * @className: ConnTypeInfo
 *
 * @description TODO
 * 　　* @param
 * 　　* @return
 * 　　* @throws
 * 　　* @author lizz
 * 　　* @date 2019  11 17 13:43
 *
 */
@Data
@AllArgsConstructor
public class ConnTypeInfo {
    // 消息类型
    private Integer type;
    // 消息内容
    private JSONObject content;

}
