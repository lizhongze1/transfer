import request from '@/utils/request'

// 查询证照模板
export function dataFilling(params) {
  return request.get('/licenceApi/dataFilling', params)
}

// 获取模板号信息
export function getTemplateBasicDataByCatalogId(params) {
  return request.get('/licenceExcelApi/getTemplateBasicDataByCatalogId', params)
}

// 获取分页信息
export function getCollectionPageData(params) {
  return request.get('/licenceCollectionApi/getCollectionPageData', params)
}

// 根据字典编码获取字典数据  此页面为了获取数据库类型字典项
export function queryDictItemsByTypeCode(params) {
  return request.get('/catalogApi/queryDictItemsByTypeCode', params)
}

// 数据采集保存
export function collectionDbDataInsert(params) {
  return request.postJson('/licenceCollectionApi/collectionDbDataInsert', params)
}

// 数据采集测试连接
export function dbTest(params) {
  return request.postJson('/licenceCollectionApi/dbTest', params)
}

// 根据dbid 查询表字段
export function getTableData(params) {
  return request.get('/licenceCollectionApi/getTableData', params)
}

// 生成sql
export function generateSql(params) {
  return request.postJson('/licenceCollectionApi/generateSql', params)
}

// 第三步到第四步插入信息接口
export function collectionTabelRelationInsert(params) {
  return request.postJson('/licenceCollectionApi/collectionTabelRelationInsert', params)
}
// 采集信息插入
export function collectionConfigInsert(params) {
  return request.postJson('/licenceCollectionApi/collectionConfigInsert', params)
}
// 采集执行
export function implementCollection(params) {
  return request.get('/licenceCollectionApi/implementCollection', params)
}
// 批量删除
export function dbDatadeleteByPrimaryKey(params) {
  return request.get('/licenceCollectionApi/dbDatadeleteByPrimaryKey', params)
}
