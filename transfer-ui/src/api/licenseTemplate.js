import request from '@/utils/request'

// 模板数据分页信息
export function getTemplatePageData(params) {
  return request.get('/templateApi/getTemplatePageData', params)
}

// 模板删除
export function deleteTemplateData(params) {
  return request.get('/templateApi/deleteTemplateData', params)
}

// 模板基本信息提交
export function addTemplateData(data) {
  return request.postJson('/templateApi/addTemplateData', data)
}

// 获取照面信息数据
export function getOriginalData(params) {
  return request.get('/templateApi/getOriginalData', params)
}

// 保存照面信息
export function addCatalogCertificateInfoData(data) {
  return request.postJson('/templateApi/addCatalogCertificateInfoData', data)
}

// 获取证照模板编辑信息
export function getModelInfo(params) {
  return request.get('/templateApi/getModelInfo', params)
}

// 删除照面信息 明细信息
export function delFaceToFaceData(params) {
  return request.get('/templateApi/delFaceToFaceData', params)
}

// 获取此目录下是否存在在用模板
export function getInUseData(params) {
  return request.get('/templateApi/getInUseData', params)
}

// 判断是否显示新增按钮
export function getIfShowInsert(params) {
  return request.get('/templateApi/getIfShowInsert', params)
}

// 模板底板分页信息
export function getPageTemplatebackgroundInfo(params) {
  return request.get('/templateUtils/getPageTemplatebackgroundInfo', params)
}

// 模板底板删除
export function deleteBackGround(params) {
  return request.get('/templateUtils/deleteBackGround', params)
}

// 模板底板上传
export function backGroundUpload(data) {
  return request.postJson('/templateUtils/backGroundUpload', data)
}

// 提交按钮是否显示
export function getCheckShowSub(params) {
  return request.get('/catalogApi/getCheckShowSub', params)
}

// 目录提交
export function catalogSub(params) {
  return request.get('/catalogApi/catalogSub', params)
}
