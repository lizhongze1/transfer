import request from '@/utils/request'

export function getPageData(params) {
  return request.get('/licenceUtils/getCheckData', params)
}
export function signature(params) {
  return request.get('/licenceUtils/signature', params)
}
export function sealLicence(params) {
  return request.get('/licenceUtils/sealLicence', params)
}
// 证照查看接口
export function readerLicence(params) {
  return request.get('/licenceUtils/readerBeforeSignLicence', params)
}
