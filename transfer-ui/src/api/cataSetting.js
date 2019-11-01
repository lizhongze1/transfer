/*
 * @Description: 证照配置js
 * @Author: ppfei
 * @Date: 2019-08-06 16:31:22
 * @LastEditors: ppfei
 */
import request from '@/utils/request'

// 获取证照配置分页信息
export function getConfigurationPageData(params) {
  return request.get('/catalog/configuration/getConfigurationPageData', params)
}

// 获取证照配置分页信息
export function catalogConfigurationEdit(data) {
  return request.postJson('/catalog/configuration/catalogConfigurationEdit', data)
}

// 目录配置编辑接口
export function catalogAndTemplateInfo(params) {
  return request.get('/catalog/configuration/catalogAndTemplateInfo', params)
}

// 签章配置
export function signConfigurationInfo(params) {
  return request.get('/catalog/configuration/signConfigurationInfo', params)
}

// 签章配置保存
export function signConfigurationEdit(data) {
  return request.postJson('/catalog/configuration/signConfigurationEdit', data)
}
