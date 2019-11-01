/*
 * @Descripttion:
 * @Author: lth
 * @Date: 2019-07-28 19:55:16
 * @LastEditors: lip
 * @LastEditTime: 2019-07-30 14:00:06
 */
import Mock from 'mockjs'
var Random = Mock.Random

const List = []
const count = 15
for (var i = 0; i < count; i++) {
  List.push(Mock.mock({
    // 编号
    id: '@id',
    // 持证者
    holder: Random.cname(),
    // 名称
    'name': Random.sentence(3),
    // 颁发日期
    'certifiedTime': Mock.mock('@date'),
    // 编码/文号
    'serialNumber': /\d{5,10}/,
    // 数据来源
    'dataSouce|1': ['填报', '采集', '导入', '推送'],
    // 状态
    'status|1': ['正常有效', '审核中', '等待生成', '暂存草稿'],
    // addNewForm
    'valueState|1': ['测试', '测试修改1', '测试修改2'],
    'valueVersion|1': ['2019V1.0', '2019V2.0'],
    'templateName|1': ['测试', '测试修改1', '测试修改2'],
    'validTerm|1': ['1年', '2年', '长期有效'],
    'versionUnit': '@sentence(2, 3)',
    'validityPeriod': Mock.mock('@date'),
    'expiryDate': Mock.mock('@date'),
    'licenseNumber': /\d{5,10}/
  }))
}

export default [
  {
    url: '/dataFill/getList',
    type: 'get',
    response: config => {
      const { page = 1, limit = 10, licenseName, status } = config.query

      const mockList = List.filter(item => {
        if (licenseName && item.licenseName !== licenseName) return false
        if (status && item.status !== status) return false
        return true
      })

      const pageList = mockList.filter((item, index) => index < limit * page && index >= limit * (page - 1))

      console.log(pageList)

      return {
        code: 20000,
        data: {
          total: pageList.length,
          items: pageList
        }
      }
    }
  }
]
