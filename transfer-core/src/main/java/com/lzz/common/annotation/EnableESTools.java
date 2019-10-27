package com.lzz.common.annotation;

import com.lzz.common.config.ElasticSearchConfiguration;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Import;


import java.lang.annotation.*;

/* /**
　　* @description: 引入自动配置的restHighLevelClient 配置entityPath以识别es entity自动创建索引以及mapping（如果不配置，则按照Main方法的路径包进行扫描）
　　* @param ${tags}
　　* @return ${return_type}
　　* @throws
　　* @author lizz
　　* @date 2019/10/27 23:27
　　*/
@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
@Documented
@Inherited
//@Import(ElasticsearchScannerRegistrar.class)
@Import(ElasticSearchConfiguration.class)
@ComponentScan("com.lzz.common")
public @interface EnableESTools {

    /**
     * 配置repository包路径,如果不配置，则按照Main方法的路径包进行扫描
     * @return
     */
    String[] basePackages() default {};
    /**
     * 配置repository包路径,如果不配置，则按照Main方法的路径包进行扫描
     * @return
             */
    String[] value() default {};
    /**
     * entity路径配置,如果不配置，则按照Main方法的路径包进行扫描
     */
    String[] entityPath() default {};
}
