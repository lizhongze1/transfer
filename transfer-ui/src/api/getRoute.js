/*
 * @Descripttion:
 * @Author: lip
 * @Date: 2019-07-31 11:03:31
 * @LastEditors: lip
 * @LastEditTime: 2019-08-13 10:31:46
 */
import request from '@/utils/request'

export function getRoute(params) {
  return request.get('/getRouteTable', params)
}
