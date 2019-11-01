import request from '@/utils/request'

// 采集和推送监控数据
export function getCollectionMonitorData(params) {
  return request.get('/licenceCollectionApi/getCollectionMonitorData', params)
}

// 签章队列
export function getSignatureQueue(params) {
  return request.get('/licenceUtils/getSignatureQueue', params)
}
