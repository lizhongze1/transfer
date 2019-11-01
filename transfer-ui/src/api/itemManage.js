
import request from '@/utils/request'

// 获取事项分页接口
export function SelectDic(params) {
  return request.get('/ItemManageApi/SelectDic', params)
}

// 新增接口
export function InsertDic(params) {
  return request.get('/ItemManageApi/InsertDic', params)
}

// 编辑接口
export function UpdateDic(params) {
  return request.get('/ItemManageApi/UpdateDic', params)
}

// 删除接口
export function DeleteDic(params) {
  return request.get('/ItemManageApi/DeleteDic', params)
}
