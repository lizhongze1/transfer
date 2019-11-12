import request from '@/utils/request'

export function getList(params) {
  return request({
    url: '/jobinfo/pageList',
    method: 'post',
    params
  })

}
export function getTaskGroup(params) {
  return request({
    url: '/jobgroup/getJobGroupList',
    method: 'post',
    params
  })

}
export function addtaskInfo(data) {
  return request({
    url: '/jobinfo/add',
    method: 'post',
    data
  })
}
export function updatetaskInfo(data) {
  return request({
    url: '/jobgroup/update',
    method: 'post',
    data
  })
}
