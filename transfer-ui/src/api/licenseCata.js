/*
 * @Description: 证照编目api对应
 * @Author: ppfei
 * @Date: 2019-07-24 10:28:25
 */

import request from '@/utils/request'

// 获取证照编目分页信息
export function getCatalogPageData(params) {
  return request.get('/catalogApi/getCatalogPageData', params)
}

// 根据字典编码获取字典数据
export function queryDictItemsByTypeCode(params) {
  return request.get('/catalogApi/queryDictItemsByTypeCode', params)
}

// 批量删除
export function ordDelete(params) {
  return request.get('/catalogApi/ordDelete', params)
}

// 批量取回
export function batchReturn(params) {
  return request.get('/catalogApi/batchReturn', params)
}

// 根据目录类别获取证照类型
export function getCertificateTypeData(params) {
  return request.get('/catalogApi/getCertificateTypeData', params)
}

// 新增证照
export function catalogInfoInsert(data) {
  return request.postJson('/catalogApi/catalogInfoInsert', data)
}

// 目录审核
// 3是驳回 4是通过
export function auditCatalog(params) {
  return request.get('/catalogApi/auditCatalog', params)
}

// 目录提交
export function catalogSub(params) {
  return request.get('/catalogApi/catalogSub', params)
}

// 获取部门信息
export function getOrgDataList(params) {
  return request.get('/catalogApi/getOrgDataList', params)
}

// 目录批量提交
export function catalogBatchSub(params) {
  return request.get('/catalogApi/catalogBatchSub', params)
}
