package com.lzz.common.repository;

/* /**
　　* @description: 分页+高亮对象封装
　　* @param ${tags}
　　* @return ${return_type}
　　* @throws
　　* @author lizz
　　* @date 2019/10/27 23:35
　　*/
public class PageSortHighLight {
    private int currentPage;
    private int pageSize;
    Sort sort = new Sort();
    private HighLight highLight = new HighLight();

    public PageSortHighLight(int currentPage, int pageSize) {
        this.currentPage = currentPage;
        this.pageSize = pageSize;
    }

    public PageSortHighLight(int currentPage, int pageSize, Sort sort) {
        this.currentPage = currentPage;
        this.pageSize = pageSize;
        this.sort = sort;
    }

    public int getCurrentPage() {
        return currentPage;
    }

    public void setCurrentPage(int currentPage) {
        this.currentPage = currentPage;
    }

    public int getPageSize() {
        return pageSize;
    }

    public void setPageSize(int pageSize) {
        this.pageSize = pageSize;
    }

    public Sort getSort() {
        return sort;
    }

    public void setSort(Sort sort) {
        this.sort = sort;
    }

    public HighLight getHighLight() {
        return highLight;
    }

    public void setHighLight(HighLight highLight) {
        this.highLight = highLight;
    }
}
