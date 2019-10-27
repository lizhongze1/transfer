package com.lzz.common.annotation;

import java.lang.annotation.*;

/* /**
　　* @description:  ES entity 标识ID的注解,在es entity field上添加
　　* @param ${tags}
　　* @return ${return_type}
　　* @throws
　　* @author lizz
　　* @date 2019/10/27 23:29
　　*/
@Retention(RetentionPolicy.RUNTIME)
@Target({ElementType.FIELD})
@Documented
public @interface ESID {
}
