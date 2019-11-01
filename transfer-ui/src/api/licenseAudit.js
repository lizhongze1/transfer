import request from '@/utils/request'

// 获取分页数据
export function getProcessPageData(params) {
  return request.get('/licenceMaintenlApi/getProcessPageData', params)
}

// 获取单条数据的操作记录
export function getCertificateProcess(params) {
  return request.get('/licenceApi/getCertificateProcess', params)
}
