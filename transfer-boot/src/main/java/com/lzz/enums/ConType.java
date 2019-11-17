package com.lzz.enums;

/**
 *
 * 　  * @className: CON_TYPE
 *
 * @description TODO
 * 　　* @param
 * 　　* @return
 * 　　* @throws
 * 　　* @author lizz
 * 　　* @date  13:07
 *
 */
public enum ConType {
    ES(1, "es"),
    MONGO(2, "mongo"),
    ORACLE(3, "mongo"),
    SQLSERVER(4, "mongo"),
    MYSQL(5, "mysql");
    public final int code;
    public final String name;

    ConType(int code, String name) {
        this.code = code;
        this.name = name;
    }
}
