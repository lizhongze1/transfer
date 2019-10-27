package com.lzz.common.annotation;

import java.lang.annotation.*;

/* /**
　　* @description: es索引元数据的注解，在es entity class上添加
　　* @param ${tags}
　　* @return ${return_type}
　　* @throws
　　* @author lizz
　　* @date 2019/10/27 23:29
　　*/
@Retention(RetentionPolicy.RUNTIME)
@Target({ElementType.TYPE})
@Documented
public @interface ESMetaData {
    /**
     * 索引名称，必须配置
     */
    String indexName();
    /**
     * 索引类型，必须配置，墙裂建议每个index下只有一个type
     */
    String indexType();
    /**
     * 主分片数量
     * @return
     */
    int number_of_shards() default 5;
    /**
     * 备份分片数量
     * @return
     */
    int number_of_replicas() default 1;

    /**
     * 是否打印日志
     * @return
     */
    boolean printLog() default false;
}
