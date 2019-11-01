import request from '@/utils/request'

// 获取数据推送分页信息
export function getPageApiPushData(params) {
  return request.get('/apiPush/getPageApiPushData', params)
}

// 查询证照模板
export function dataFilling(params) {
  return request.get('/licenceApi/dataFilling', params)
}

// 获取模板号信息
export function getTemplateBasicDataByCatalogId(params) {
  return request.get('/licenceExcelApi/getTemplateBasicDataByCatalogId', params)
}

// 数据推送保存
export function insertApiPushData(params) {
  return request.postJson('/apiPush/insertApiPushData', params)
}

// 接口返回规范
export function getStandardData(params) {
  return request.get('/apiPush/getStandardData', params)
}

// 批量删除
export function delApiPushData(params) {
  return request.get('/apiPush/delApiPushData', params)
}

// 执行推送
export function implementPush(params) {
  return request.get('/apiPush/implementPush', params)
}

// 接口测试
export function apiTest(params) {
  return request.postJson('/apiPush/apiTest', params)
}
