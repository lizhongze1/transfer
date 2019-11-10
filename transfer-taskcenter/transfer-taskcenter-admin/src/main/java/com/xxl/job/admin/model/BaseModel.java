package com.xxl.job.admin.model;
/**
 *
 * 　  * @className: BaseModel
 *
 * @description TODO
 * 　　* @param
 * 　　* @return
 * 　　* @throws
 * 　　* @author lizz
 * 　　* @date  15:36
 *
 */
public class BaseModel<T> {

    private Integer status = 200;
    private String  message;
    private T       data;

    public Integer getStatus() {
        return status;
    }

    public void setStatus(Integer status) {
        this.status = status;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public T getData() {
        return data;
    }

    public void setData(T data) {
        this.data = data;
    }

    public static <T> BaseModel<T> getInstance(T data) {
        BaseModel<T> baseModel = new BaseModel<>();
        baseModel.data = data;
        return baseModel;
    }
}
