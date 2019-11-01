/*
 * @Descripttion: 证照维护
 * @Author: ppfei
 * @Date: 2019-08-05 20:08:21
 * @LastEditors: ppfei
 */

import request from '@/utils/request'

// 获取证照编目分页信息
export function catalogStopUsing(data) {
  return request.postJson('/catalogApi/catalogStopUsing', data)
}
