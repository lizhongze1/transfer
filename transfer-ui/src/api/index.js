/*
 * @Descripttion:
 * @Author: lip
 * @Date: 2019-08-21 18:04:38
 * @LastEditors: lip
 * @LastEditTime: 2019-08-26 19:43:40
 */
import request from '@/utils/request'

// 获取30天过期提醒
export function getDatePage30() {
  return request.get('/certificateHomeApi/getDatePage30')
}

// 获取证照入库总数 和昨日入库总数
export function getCertificateStorageNum() {
  return request.get('/certificateHomeApi/getCertificateStorageNum')
}

// 不再提醒接口
export function editNoReminder(params) {
  return request.get('/certificateHomeApi/editNoReminder', params)
}

// 调用历史统计接口
export function getCallHistory() {
  return request.get('/certificateHomeApi/getCallHistory')
}

// 首页待审核证照
export function getCertificateCheck() {
  return request.get('/certificateHomeApi/getCertificateCheck')
}

// 获取接口调用次数
export function getInterfaceCalls() {
  return request.get('/certificateHomeApi/getInterfaceCalls')
}

// 获取top10
export function getLicenceTop(params) {
  return request.get('/certificateHomeApi/getLicenceTop', params)
}

// 部门入库统计
export function getOrgLibStatistics() {
  return request.get('/certificateHomeApi/getOrgLibStatistics')
}

// 部门调用统计
export function getOrgCallHistory() {
  return request.get('/certificateHomeApi/getOrgCallHistory')
}

// 部门目录入库数
export function getCertificateStorageData() {
  return request.get('/certificateHomeApi/getCertificateStorageData')
}

// 部门证照调用排名
export function getOrgLicenceTop() {
  return request.get('/certificateHomeApi/getOrgLicenceTop')
}

// 首页代办事项
export function getBacklogData(params) {
  return request.get('/certificateHomeApi/getBacklogData', params)
}
