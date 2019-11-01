/*
 * @Descripttion: 证照审计
 * @Author: ppfei
 * @Date: 2019-08-07 15:04:35
 * @LastEditors: ppfei
 */

import request from '@/utils/request'

// 获取证照编目分页信息
export function getCatalogProcessDetail(params) {
  return request.get('/catalogApi/getCatalogProcessDetail', params)
}
