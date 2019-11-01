/*
 * @Descripttion:
 * @Author: lip
 * @Date: 2019-08-08 17:03:19
 * @LastEditors: lip
 * @LastEditTime: 2019-08-27 14:50:11
 */
import Vue from 'vue'
import Router from 'vue-router'
import Layout from '@/layout'
// 登陆页面
const login = r => require.ensure([], () => r(require('@/pages/login/index')), 'login')
// 首页
const index = r => require.ensure([], () => r(require('@/pages/index/index')), 'index')
// 404 页面
const page404 = r => require.ensure([], () => r(require('@/pages/404/404')), 'page404')
// 目录管理相关界面
const cataAudit = r => require.ensure([], () => r(require('@/pages/cataManage/cataAudit')), 'cataManage')
const cataExamine = r => require.ensure([], () => r(require('@/pages/cataManage/cataExamine')), 'cataManage')
const licenseCata = r => require.ensure([], () => r(require('@/pages/cataManage/licenseCata')), 'cataManage')
const licenseType = r => require.ensure([], () => r(require('@/pages/cataManage/licenseType')), 'cataManage')
const itemManage = r => require.ensure([], () => r(require('@/pages/cataManage/itemManage')), 'cataManage')
// 证照归集相关页面
const dataExamine = r => require.ensure([], () => r(require('@/pages/licenseCollect/dataExamine')), 'licenseCollect')
const dataFillNew = r => require.ensure([], () => r(require('@/pages/licenseCollect/dataFillNew')), 'licenseCollect')
const licenseDefend = r => require.ensure([], () => r(require('@/pages/licenseCollect/licenseDefend')), 'licenseCollect')
const licenseSign = r => require.ensure([], () => r(require('@/pages/licenseCollect/licenseSign')), 'licenseCollect')
const licenseExpire = r => require.ensure([], () => r(require('@/pages/licenseCollect/licenseExpire')), 'licenseCollect')
const licenseAudit = r => require.ensure([], () => r(require('@/pages/licenseCollect/licenseAudit')), 'licenseCollect')
const dataCollection = r => require.ensure([], () => r(require('@/pages/licenseCollect/dataCollection')), 'licenseCollect')
const licenseMonitor = r => require.ensure([], () => r(require('@/pages/licenseCollect/licenseMonitor')), 'licenseCollect')
const dataPush = r => require.ensure([], () => r(require('@/pages/licenseCollect/dataPush')), 'licenseCollect')

// 静态路由表
export const constantRoutes = [
  {
    path: '/login',
    component: login,
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    redirect: '/index',
    children: [{
      path: '/index',
      component: index,
      name: '首页',
      meta: {
        title: '首页',
        icon: 'index',
        breadcrumb: false
      }
    }]

  },
  {
    path: '/404',
    component: page404,
    name: '404',
    hidden: true,
    meta: {
      title: '404'
    }
  },
  {
    path: '/cataManage',
    component: Layout,
    name: '证照目录',
    meta: {
      title: '证照目录',
      icon: 'mlgl'
    },
    children: [
      {
        path: '/cataManage/licenseCata',
        name: '证照编目',
        component: licenseCata,
        meta: {
          title: '证照编目',
          icon: 'zzbm'
        }
      },
      {
        path: '/cataManage/itemManage',
        name: '事项管理',
        component: itemManage,
        meta: {
          title: '事项管理',
          icon: 'sxgl'
        }
      },
      {
        path: '/cataManage/cataExamine',
        name: '目录审核',
        component: cataExamine,
        meta: {
          title: '目录审核',
          icon: 'bmsh'
        }
      },
      {
        path: '/cataManage/cataMaintain',
        name: '目录维护',
        component: () => import('@/pages/cataManage/cataMaintain'),
        meta: {
          title: '目录维护',
          icon: 'zzpz'
        }
      },
      {
        path: '/cataManage/licenseCata/licenseTemp',
        name: '证照模板',
        component: () => import('@/pages/cataManage/licenseTemplate/index_copy'),
        meta: {
          title: '证照模板',
          icon: 'zzbm'
        },
        hidden: true
      },
      {
        path: '/cataManage/licenseType',
        name: '证照类型',
        component: licenseType,
        meta: {
          title: '证照类型',
          icon: 'zzlx'
        }
      },
      {
        path: '/cataManage/cataSetting',
        name: '签章配置',
        component: () => import('@/pages/cataManage/cataSetting'),
        meta: {
          title: '签章配置',
          icon: 'zzpz'
        }
      },
      {
        path: '/cataManage/cataAudit',
        name: '目录审计',
        component: cataAudit,
        meta: {
          title: '目录审计',
          icon: 'mlsj'
        }
      }

    ]
  },
  {
    path: '/licenseCollect',
    component: Layout,
    name: '证照归集',
    meta: {
      title: '证照归集',
      icon: 'zzgj'
    },
    children: [
      {
        path: '/licenseCollect/dataFillNew',
        name: '数据归集',
        component: dataFillNew,
        meta: {
          title: '数据归集',
          icon: 'sjtb'
        }
      },
      {
        path: '/licenseCollect/dataExamine',
        name: '数据审核',
        component: dataExamine,
        meta: {
          title: '数据审核',
          icon: 'sjsh'
        }
      },
      {
        path: '/licenseCollect/licenseSign',
        name: '证照签章',
        component: licenseSign,
        meta: {
          title: '证照签章',
          icon: 'zzqz'
        }
      },
      {
        path: '/licenseCollect/licenseExpire',
        name: '过期提醒',
        component: licenseExpire,
        meta: {
          title: '过期提醒',
          icon: 'gqtx'
        }
      },
      {
        path: '/licenseCollect/licenseDefend',
        name: '证照维护',
        component: licenseDefend,
        meta: {
          title: '证照维护',
          icon: 'zzwh'
        }
      },
      {
        path: '/licenseCollect/licenseAudit',
        name: '证照审计',
        component: licenseAudit,
        meta: {
          title: '证照审计',
          icon: 'mlsj'
        }
      },
      {
        path: '/licenseCollect/dataCollection',
        name: '数据采集',
        component: dataCollection,
        meta: {
          title: '数据采集',
          icon: 'sjcj'
        }
      },
      {
        path: '/licenseCollect/licenseMonitor',
        name: '数据监控',
        component: licenseMonitor,
        meta: {
          title: '数据监控',
          icon: 'sjjk'
        }
      },
      {
        path: '/licenseCollect/dataPush',
        name: '数据推送',
        component: dataPush,
        meta: {
          title: '数据推送',
          icon: 'sjts'
        }
      }
    ]
  },
  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]
Vue.use(Router)

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
