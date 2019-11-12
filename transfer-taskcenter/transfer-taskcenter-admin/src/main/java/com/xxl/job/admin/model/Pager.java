package com.xxl.job.admin.model;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;
/**
 * @Description:分页实体类
 * @Author: lizz
 * @Date: 2019/11/12 22:31


 **/
public class Pager<T> implements Serializable {

    private static final long serialVersionUID = -986577815091763517L;

    private Long              count            = 0L;
    private List<T>           items            = new ArrayList<T>();
    private Integer           page             = 1;
    private Integer           size             = 20;
    private int              offset           = 0;

    public Pager(){

    }

    public Pager(Integer page, Integer size){
        this.page = page;
        this.size = size;
    }

    public Pager(Long count, List<T> items){
        this.count = count;
        this.items = items;
    }

    public String toString() {
        return "PageResult[count=" + this.count + ", items=" + this.items + "]";
    }

    public Long getCount() {
        return this.count;
    }

    public void setCount(Long count) {
        this.count = count;
    }

    public List<T> getItems() {
        return items;
    }

    public void setItems(List<T> items) {
        this.items = items;
    }

    public Integer getPage() {
        if (page == null) {
            page = 1;
        }
        return page;
    }

    public void setPage(Integer page) {
        this.page = page;
    }

    public Integer getSize() {
        if (size == null) {
            size = 20;
        }
        return size;
    }

    public void setSize(Integer size) {
        this.size = size;
    }

    public int getOffset() {
        offset =  (getPage() - 1) * getSize();
        return offset;
    }

    public void setOffset(int offset) {
        this.offset = offset;
    }
}
