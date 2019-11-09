import request from '@/utils/request'

export function getList(params) {
  return request({
    url: '/jobinfo/pageList',
    method: 'post',
    params
  })
}
