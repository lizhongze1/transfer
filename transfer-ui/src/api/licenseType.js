import request from '@/utils/request'

// 分页信息
export function getCheckData(params) {
  return request.get('/licence/type/getCheckData', params)
}

// 查询部门行业信息
export function getCertificateIndustryInfo(params) {
  return request.get('/licence/type/getCertificateIndustryInfo', params)
}

// 查询国家级证照类型
export function getCountryCertificateTypeInfo(params) {
  return request.get('/licence/type/getCountryCertificateTypeInfo', params)
}

// 查询定义机构信息
export function getEertificateDefineAuthortiy(params) {
  return request.get('/licence/type/getEertificateDefineAuthortiy', params)
}

// 证照类型编辑接口
export function certificateTypeEdit(data) {
  return request.postJson('/licence/type/certificateTypeEdit', data)
}

// 删除
export function batchDelete(params) {
  return request.get('/licence/type/batchDelete', params)
}

// 校验有效期
export function validityDate(params) {
  return request.get('/licence/type/validityDate', params)
}
