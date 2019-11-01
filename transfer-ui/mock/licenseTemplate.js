import Mock from 'mockjs'

const List = []
const count = 15
for (var i = 0; i < count; i++) {
  List.push(Mock.mock({
    id: '@id',
    // 模板名称
    tempName: 'sentence(1,4)',
    // 模板版本号
    tempCode: '',
    // 状态
    status: '',
    // 创建人员
    creator: '',
    // 创建时间
    createTime: '@datetime',
    // 是否在用
    'ifUse|1': ['是', '否']
  }))
}

export default [
  {
    url: '/licenseTemplate/getList',
    type: 'get',
    response: config => {
      const { page = 1, limit = 10, tempName, status } = config.query

      const mockList = List.filter(item => {
        if (tempName && item.tempName !== tempName) return false
        if (status && item.status !== status) return false
        return true
      })

      const pageList = mockList.filter((item, index) => index < limit * page && index >= limit * (page - 1))

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
