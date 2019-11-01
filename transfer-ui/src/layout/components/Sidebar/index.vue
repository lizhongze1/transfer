<!--
 * @Descripttion:
 * @Author: lip
 * @Date: 2019-08-06 16:09:38
 * @LastEditors: lip
 * @LastEditTime: 2019-08-20 14:45:42
 -->
<template>
  <div :class="{'has-logo':showLogo}">
    <logo v-if="showLogo" :collapse="isCollapse" />
    <el-scrollbar wrap-class="scrollbar-wrapper">
      <el-menu
        :default-active="activeMenu"
        :collapse="isCollapse"
        :background-color="variables.menuBg"
        :text-color="variables.menuText"
        :unique-opened="false"
        :active-text-color="variables.menuActiveText"
        :collapse-transition="false"
        mode="vertical"
      >
        <!-- <sidebar-item v-for="route in routes" :key="route.path" :item="route" :base-path="route.path" /> -->
        <!-- 打开下面开启动态路由表 -->
        <sidebar-item v-for="route in myRoute" :key="route.path" :item="route" :base-path="route.path" />
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Logo from './Logo'
import SidebarItem from './SidebarItem'
import variables from '@/styles/variables.scss'
import { getRoute } from '@/api/getRoute'
export default {
  components: { SidebarItem, Logo },
  data() {
    return {
      tableRoute: [],
      myRoute: [],
      // yy
      roleId: ''
    }
  },
  computed: {
    ...mapGetters([
      'sidebar'
    ]),
    routes() {
      return this.$router.options.routes
    },
    activeMenu() {
      const route = this.$route
      const { meta, path } = route
      // if set path, the sidebar will highlight the path you set
      if (meta.activeMenu) {
        return meta.activeMenu
      }
      return path
    },
    showLogo() {
      return this.$store.state.settings.sidebarLogo
    },
    variables() {
      return variables
    },
    isCollapse() {
      return !this.sidebar.opened
    }
  },
  mounted() {
    this.roleId = JSON.parse(localStorage.userInfoJson).roleId
    this.getRuotes()
  },
  methods: {
    getRuotes() {
      getRoute({ roleId: this.roleId }).then(response => {
        this.tableRoute = JSON.parse(response.data.data.data.data)
        this.tableRoute = this.tableRoute.filter(function(item) {
          return item.platformId === 'dzzz'
        })
        this.tableRoute = this.tableRoute[0].menu
        var routeItem = []
        for (var i = 0; i < this.tableRoute.length; i++) {
          // 第一层过滤得到根路径相同的
          var obj = this.routes.filter((item) => {
            return item.path === this.tableRoute[i].url
          })
          // console.log(obj[0])
          var childTemp = []
          if (obj.length !== 0 && obj[0].children !== undefined) {
            for (var j = 0; j < this.tableRoute[i].children.length; j++) {
              if (obj[0].children !== undefined) {
                var child = obj[0].children.filter((item) => {
                  return item.path === this.tableRoute[i].children[j].url
                })
              }
              // console.log(child[0])
              if (child.length !== 0 && child[0] !== undefined) {
                childTemp.push(child[0])
              }
            }
            if (obj[0] !== undefined) {
              obj[0].children = childTemp
            }
          }
          if (obj[0] !== undefined) {
            routeItem.push(obj[0])
          }
        }
        this.myRoute = routeItem
        var indexPage =
           {
             path: '/',
             redirect: '/index',
             name: '首页',
             meta: {
               title: '首页',
               icon: 'index',
               breadcrumb: false
             }
           }
        this.myRoute.unshift(indexPage)
        // this.myRoute.push(sharePage)
      })
    }
  }

}
</script>
