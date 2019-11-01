import request from '@/utils/request'

// 获取不再提醒分页信息
export function getDatePageDates(params) {
  return request.get('/certificateHomeApi/getDatePageDates', params)
}

// 证照查看接口
export function readerLicence(params) {
  return request.get('/licenceUtils/readerLicence', params)
}

// 证照下载
export function downLoadLicence(params) {
  return request.get('/licenceUtils/downLoadLicence', params)
}

// 不再提醒接口
export function editNoReminder(params) {
  return request.get('/certificateHomeApi/editNoReminder', params)
}

// 发送提醒
export function sendMail(params) {
  return request.get('/certificateHomeApi/send', params)
}
