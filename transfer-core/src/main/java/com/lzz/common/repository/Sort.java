package com.lzz.common.repository;


import org.elasticsearch.search.sort.SortOrder;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

/* /**
　　* @description: 排序对象封装
　　* @param ${tags}
　　* @return ${return_type}
　　* @throws
　　* @author lizz
　　* @date 2019/10/27 23:35
　　*/
public class Sort {
    private List<Order> orders = null;


    public List<Order> listOrders(){
        return orders;
    }


    public Sort(Sort.Order... ods) {
        orders = Arrays.asList(ods);
    }

    public Sort and(Sort sort) {
        if(orders == null){
            orders = new ArrayList<>();
        }
        orders.addAll(sort.orders);
        return this;
    }

    public static class Order implements Serializable {
        private final SortOrder direction;
        private final String property;

        public Order(SortOrder direction,String property){
            this.direction = direction;
            this.property = property;
        }

        public SortOrder getDirection() {
            return direction;
        }

        public String getProperty() {
            return property;
        }
    }
}
