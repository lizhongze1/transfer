package com.lzz.common.config;

import com.lzz.common.annotation.ESMetaData;
import org.springframework.beans.factory.annotation.AnnotatedBeanDefinition;
import org.springframework.beans.factory.config.BeanDefinitionHolder;
import org.springframework.beans.factory.support.BeanDefinitionRegistry;
import org.springframework.context.annotation.ClassPathBeanDefinitionScanner;
import org.springframework.core.type.filter.AnnotationTypeFilter;


import java.util.Set;

/* /**
　　* @description: 扫描ESMetaData的注解的bean（就是es数据结构的实体类）给spring管理
　　* @param ${tags}
　　* @return ${return_type}
　　* @throws
　　* @author lizz
　　* @date 2019/10/27 23:31
　　*/
public class ESEntityScanner extends ClassPathBeanDefinitionScanner {
    public ESEntityScanner(BeanDefinitionRegistry registry) {
        super(registry);
    }

    public void registerDefaultFilters() {
        this.addIncludeFilter(new AnnotationTypeFilter(ESMetaData.class));
    }

    public Set<BeanDefinitionHolder> doScan(String... basePackages) {
        Set<BeanDefinitionHolder> beanDefinitions = super.doScan(basePackages);
        return beanDefinitions;
    }

    public boolean isCandidateComponent(AnnotatedBeanDefinition beanDefinition) {
        return super.isCandidateComponent(beanDefinition) && beanDefinition.getMetadata()
                .hasAnnotation(ESMetaData.class.getName());
    }
}
