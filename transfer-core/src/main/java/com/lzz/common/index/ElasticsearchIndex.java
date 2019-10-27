package com.lzz.common.index;

/* /**
　　* @description: 索引结构基础方法接口
　　* @param ${tags}
　　* @return ${return_type}
　　* @throws
　　* @author lizz
　　* @date 2019/10/27 23:33
　　*/
public interface ElasticsearchIndex<T> {
    /**
     * 创建索引
     * @param clazz
     * @throws Exception
     */
    public void createIndex(Class<T> clazz) throws Exception;
    /**
     * 删除索引
     * @param clazz
     * @throws Exception
     */
    public void dropIndex(Class<T> clazz) throws Exception;
    /**
     * 索引是否存在
     * @param clazz
     * @throws Exception
     */
    public boolean exists(Class<T> clazz) throws Exception;

}
