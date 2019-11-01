/*
 * @Descripttion:
 * @Author: lip
 * @Date: 2019-08-16 11:03:10
 * @LastEditors: lip
 * @LastEditTime: 2019-08-19 14:03:43
 */

import request from '@/utils/request'

// 获取数据审核--分页查询信息
export function getPageData(params) {
  return request.get('/licenceApi/getCheckData', params)
}

// 批量审核（驳回或通过)
export function batchCheck(params) {
  return request.get('/licenceApi/batchCheck', params)
}

// 证照预览
export function certificateView(params) {
  return request.get('/certificateUtils/certificateView', params)
}

// 获取模板
export function getMouleView(params) {
  return request.get('/templateUtils/mouleView', params)
}
