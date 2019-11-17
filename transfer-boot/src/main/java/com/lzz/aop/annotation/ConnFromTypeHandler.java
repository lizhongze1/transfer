package com.lzz.aop.annotation;

import com.lzz.enums.ConType;

import java.lang.annotation.*;

/**
 *
 * 　  * @className: ConnTypeHandler
 *
 * @description TODO
 * 　　* @param
 * 　　* @return
 * 　　* @throws
 * 　　* @author lizz
 * 　　* @date 2019  11 17  13:03
 *
 */
@Documented
@Inherited
@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
public @interface ConnFromTypeHandler {
    ConType value();
}
