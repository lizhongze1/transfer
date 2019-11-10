package com.xxl.job.admin.handler;


import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.ResponseStatus;
import com.xxl.job.admin.model.BaseModel;
import com.xxl.job.admin.exception.ServiceException;
/**
 * @Description:mvc 异常拦截器
 * @Author: lizz
 * @Date: 2019/11/10 18:30


 **/

@ControllerAdvice(annotations = ResponseBody.class)
public class CustomExceptionHandler {

    private static Logger logger = LoggerFactory.getLogger(CustomExceptionHandler.class);

/*
     * 通用异常处理
     *
     * @param e 异常
     * @return
*/

    @ResponseBody
    @ResponseStatus(HttpStatus.OK)
    @ExceptionHandler(value = Exception.class)
    public BaseModel commonExceptionHandle(Exception e) {
        if (e instanceof ServiceException) {
            logger.error(e.getMessage());
        } else {
            logger.error(e.getMessage(), e);
        }
        BaseModel res = new BaseModel();
        res.setStatus(50000);
        res.setMessage(e.getMessage());
        return res;
    }
}
