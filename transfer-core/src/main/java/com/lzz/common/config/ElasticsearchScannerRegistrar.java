package com.lzz.common.config;

import org.springframework.beans.factory.support.BeanDefinitionRegistry;
import org.springframework.context.ResourceLoaderAware;
import org.springframework.context.annotation.ImportBeanDefinitionRegistrar;
import org.springframework.core.io.ResourceLoader;
import org.springframework.core.type.AnnotationMetadata;

/* /**
　　* @description: esSCANNER注册
　　* @param ${tags}
　　* @return ${return_type}
　　* @throws
　　* @author lizz
　　* @date 2019/10/27 23:30
　　*/
public class ElasticsearchScannerRegistrar implements ImportBeanDefinitionRegistrar, ResourceLoaderAware {

    private ResourceLoader resourceLoader;

    @Override
    public void setResourceLoader(ResourceLoader resourceLoader) {

    }

    @Override
    public void registerBeanDefinitions(AnnotationMetadata importingClassMetadata, BeanDefinitionRegistry registry) {
//        AnnotationAttributes annoAttrs = AnnotationAttributes.fromMap(importingClassMetadata.getAnnotationAttributes(ESMetaData.class.getName()));
//        ClassPathESScanner scanner = new ClassPathESScanner(registry);
//
//        // this check is needed in Spring 3.1
//        if (resourceLoader != null) {
//            scanner.setResourceLoader(resourceLoader);
//        }
//
//        List<String> basePackages = new ArrayList<String>();
//        for (String pkg : annoAttrs.getStringArray("value")) {
//            if (StringUtils.hasText(pkg)) {
//                basePackages.add(pkg);
//            }
//        }
//        for (String pkg : annoAttrs.getStringArray("basePackages")) {
//            if (StringUtils.hasText(pkg)) {
//                basePackages.add(pkg);
//            }
//        }
//        for (Class<?> clazz : annoAttrs.getClassArray("basePackageClasses")) {
//            basePackages.add(ClassUtils.getPackageName(clazz));
//        }
//        scanner.registerFilters();
//        scanner.doScan(StringUtils.toStringArray(basePackages));
    }
}
