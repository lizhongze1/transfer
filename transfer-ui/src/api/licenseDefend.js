/*
 * @Descripttion:
 * @Author: lip
 * @Date: 2019-08-08 11:16:18
 * @LastEditors: lip
 * @LastEditTime: 2019-08-22 15:06:08
 */

import request from '@/utils/request'

// 获取证照编目分页信息
export function getPageData(params) {
  return request.get('/licenceMaintenlApi/getPageData', params)
}

// 取回操作
export function retrieve(params) {
  return request.get('/licenceMaintenlApi/retrieve', params)
}

// 文件上传接口
export function fastDFSUpload(params) {
  return request.postJson('/fileService/fastDFSUpload', params)
}

// 证照查看接口
export function readerLicence(params) {
  return request.get('/licenceUtils/readerLicence', params)
}

// 吊销接口
export function toVoid(params) {
  return request.get('/licenceMaintenlApi/toVoid', params)
}

// 加盖印章
export function recertification(params) {
  return request.get('/licenceMaintenlApi/recertification', params)
}

// 是否需要年检
export function getIsYear(params) {
  return request.get('/licenceMaintenlApi/getIsYear', params)
}

// 获取版本号信息
export function getTemplateBasicDataByCatalogId(params) {
  return request.get('/licenceExcelApi/getTemplateBasicDataByCatalogId', params)
}

// 证照下载
export function downLoadLicence(params) {
  return request.get('/licenceUtils/downLoadLicence', params)
}

// 根据证照id 查有效期数组
export function selectByPrimaryKey(params) {
  return request.get('licenceApi/selectByPrimaryKey', params)
}

// 获取照面信息
export function getCatalogCertificateTemplateInfo(params) {
  return request.get('/licenceApi/getCatalogCertificateTemplateInfo', params)
}

// 多文件上传
export function fastDFSFilesUpload(params) {
  return request.postJson('/fileService/fastDFSFilesUpload', params)
}

// 证照挂失
export function reportLoss(params) {
  return request.get('/licenceMaintenlApi/reportLoss', params)
}
