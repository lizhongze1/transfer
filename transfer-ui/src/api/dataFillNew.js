/*
 * @Descripttion:
 * @Author: lip
 * @Date: 2019-08-02 19:34:52
 * @LastEditors: lip
 * @LastEditTime: 2019-08-22 18:38:15
 */
import request from '@/utils/request'

// 获取数据填报分页信息
export function getProvidedPageData(params) {
  return request.get('/licenceApi/getPageData', params)
}

// 获取模板
export function getMouleView(params) {
  return request.get('/templateUtils/mouleView', params)
}

// 批量取回操作
export function batchRetrieve(params) {
  return request.get('/licenceApi/batchRetrieve', params)
}

// 批量删除
export function batchDelete(params) {
  return request.get('/licenceApi/batchDelete', params)
}

// 数据批量提交
export function batchSubmit(params) {
  return request.get('/licenceApi/batchSubmit', params)
}

// 获取所有目录信息
export function getCatalogInfo() {
  return request.get('/licenceExcelApi/getCatalogInfo')
}

// 获取模板号信息
export function getTemplateBasicDataByCatalogId(params) {
  return request.get('/licenceExcelApi/getTemplateBasicDataByCatalogId', params)
}

// 模板下载接口
export function exportDynamicExcelTemplate(params) {
  return request.get('/licenceExcelApi/exportDynamicExcelTemplate', params)
}

// 数据填报目录查询接口
export function dataFilling(params) {
  return request.get('/licenceApi/dataFilling', params)
}

// 新增获取接口方式
export function getCatalogCertificateTemplateInfo(params) {
  return request.get('/licenceApi/getCatalogCertificateTemplateInfo', params)
}

// 保存接口
export function saveElectronicInfo(params) {
  return request.postJson('/licenceApi/saveElectronicInfo', params)
}

// 证照预览
export function certificateView(params) {
  return request.get('/certificateUtils/certificateView', params)
}

// 文件上传接口
export function fastDFSUpload(params) {
  return request.postJson('/fileService/fastDFSUpload', params)
}
// 多文件上传
export function fastDFSFilesUpload(params) {
  return request.postJson('/fileService/fastDFSFilesUpload', params)
}
// 获取模板七个固定字段
export function getOriginalData(params) {
  return request.get('/templateApi/getOriginalData', params)
}

// 根据字典编码获取字典数据
export function queryDictItemsByTypeCode(params) {
  return request.get('/catalogApi/queryDictItemsByTypeCode', params)
}

// 数据采集接口
export function startTask(params) {
  return request.postJson('/licenceApi/startTask', params)
}
