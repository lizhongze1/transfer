package com.lzz.common.enums;

import lombok.Getter;

/* /**
　　* @description: 增删改查枚举
　　* @param ${tags}
　　* @return ${return_type}
　　* @throws
　　* @author lizz
　　* @date 2019/10/27 11:32
　　*/

public enum MongoDdl {

    i("insert"),
    u("update"),
    d("delete");

    @Getter
    private String name;

    MongoDdl(String name){
        this.name = name;
    }
}
