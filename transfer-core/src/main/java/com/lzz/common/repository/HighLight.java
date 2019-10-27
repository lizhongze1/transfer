package com.lzz.common.repository;

import java.util.ArrayList;
import java.util.List;

/* /**
　　* @description: 高亮对象封装
　　* @param ${tags}
　　* @return ${return_type}
　　* @throws
　　* @author lizz
　　* @date 2019/10/27 23:34
　　*/
public class HighLight {
    private String preTag = "";
    private String postTag = "";
    private List<String> highLightList = null;

    public HighLight(){
        highLightList = new ArrayList<>();
    }

    public HighLight field(String fieldValue){
        highLightList.add(fieldValue);
        return this;
    }

    public List<String> getHighLightList(){
        return highLightList;
    }

    public String getPreTag() {
        return preTag;
    }

    public void setPreTag(String preTag) {
        this.preTag = preTag;
    }

    public String getPostTag() {
        return postTag;
    }

    public void setPostTag(String postTag) {
        this.postTag = postTag;
    }
}
