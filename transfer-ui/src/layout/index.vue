<template>
  <div :class="classObj" class="app-wrapper">
    <div v-if="device==='mobile'&&sidebar.opened" class="drawer-bg" @click="handleClickOutside" />
    <sidebar class="sidebar-container" />
    <div class="main-container">
      <div :class="{'fixed-header':fixedHeader}">
        <navbar />
      </div>
      <app-main />
    </div>
  </div>
</template>

<script>
import { Navbar, Sidebar, AppMain } from './components'
import ResizeMixin from './mixin/ResizeHandler'
import { getBacklogData } from '@/api/index'
import { setInterval } from 'timers'

export default {
  name: 'Layout',
  components: {
    Navbar,
    Sidebar,
    AppMain
  },
  mixins: [ResizeMixin],
  computed: {
    sidebar() {
      return this.$store.state.app.sidebar
    },
    device() {
      return this.$store.state.app.device
    },
    fixedHeader() {
      return this.$store.state.settings.fixedHeader
    },
    classObj() {
      return {
        hideSidebar: !this.sidebar.opened,
        openSidebar: this.sidebar.opened,
        withoutAnimation: this.sidebar.withoutAnimation,
        mobile: this.device === 'mobile'
      }
    }
  },
  mounted() {
    this.getTodoList()
    setInterval(() => {
      getBacklogData().then(res => {
        var roleType = JSON.parse(localStorage.userInfoJson).roleType
        if (roleType === '1' && res.data.data.data.catalogCount !== 0 && res.data.data.data.licenceCount !== 0) {
          this.$notify.info({
            title: '待办事项',
            position: 'bottom-right',
            dangerouslyUseHTMLString: true,
            message: '待审核目录数' + res.data.data.data.catalogCount + '</br>' + '待审核证照数' + res.data.data.data.licenceCount
          })
        }
      })
    }, 600000)
  },
  methods: {
    handleClickOutside() {
      this.$store.dispatch('app/closeSideBar', { withoutAnimation: false })
    },
    // 获取待办事项
    getTodoList() {
      getBacklogData({ ifFirst: true }).then(res => {
        var roleType = JSON.parse(localStorage.userInfoJson).roleType
        if (roleType === '1' && res.data.data.data.catalogCount !== 0 && res.data.data.data.licenceCount !== 0) {
          this.$notify.info({
            title: '待办事项',
            position: 'bottom-right',
            dangerouslyUseHTMLString: true,
            message: '待审核目录数' + res.data.data.data.catalogCount + '</br>' + '待审核证照数' + res.data.data.data.licenceCount
          })
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "~@/styles/mixin.scss";
  @import "~@/styles/variables.scss";

  .app-wrapper {
    @include clearfix;
    position: relative;
    height: 100%;
    width: 100%;
    &.mobile.openSidebar{
      position: fixed;
      top: 0;
    }
  }
  .drawer-bg {
    background: #000;
    opacity: 0.3;
    width: 100%;
    top: 0;
    height: 100%;
    position: absolute;
    z-index: 999;
  }

  .fixed-header {
    position: fixed;
    top: 0;
    right: 0;
    z-index: 9;
    width: calc(100% - #{$sideBarWidth});
    transition: width 0.28s;
  }

  .hideSidebar .fixed-header {
    width: calc(100% - 54px)
  }

  .mobile .fixed-header {
    width: 100%;
  }
</style>
