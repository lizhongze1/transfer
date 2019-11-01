import Mock from 'mockjs'

const List = []
const count = 15
for (var i = 0; i < count; i++) {
  List.push(Mock.mock({
    id: '@id',
    // 证照名称
    licenseName: '@sentence(3, 5)',
    // 事项类型
    'itemType|1': ['行政许可', '非行政许可'],
    // 目录类别
    'cataType|1': ['证照', '批文'],
    // 证照主体
    'licenseBody|1': ['自然人', '法人', '自然人或法人'],
    // 关联事项名称：
    relatedItem: '@sentence(1,2)',
    // 关联事项代码：
    relatedCode: '@sentence(1,2)',
    // 证照编码：
    licenseCode: '@sentence(1,2)',
    // 公开级别：
    'publicLevel|1': ['隐私证照，不在互联网查询', '公开证照，开在互联网查询'],
    // 颁发单位
    'awardDept|1': ['公安局', '民政局'],
    // 证照类型：
    licenseType: '@sentence(1,2)',
    // 有效期
    'expiryDate|1': ['1年', '2年', '长期有效'],
    // 是否年检：
    'yearInspection|1': ['是', '否'],
    // 附页附件：
    'enclosure|1': ['是', '否'],
    // 是否需要多人持有：
    'multiHolding|1': ['是', '否'],
    // 备注
    remarks: '@id',
    'status|1': ['待审核', '已发布', '待提交'],
    createTime: '@datetime'
  }))
}

export default [
  {
    url: '/licenseCata/getList',
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
