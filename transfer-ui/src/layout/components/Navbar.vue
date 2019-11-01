<!--
 * @Descripttion:
 * @Author: lip
 * @Date: 2019-08-09 13:19:34
 * @LastEditors: lip
 * @LastEditTime: 2019-08-27 11:30:42
 -->
<template>
  <div class="navbar">
    <hamburger :is-active="sidebar.opened" class="hamburger-container" @toggleClick="toggleSideBar" />

    <breadcrumb class="breadcrumb-container" />
    <div class="right-user-info">
      <a><i class="iconfont el-iconfont-yonghu" />{{ orgName }}—{{ userName }}</a>
      <el-dropdown>
        <a class="el-dropdown-link"><i class="iconfont el-iconfont-bangzhu" />帮助</a>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item><a @click="getHelp">操作指南</a> </el-dropdown-item>
          <!-- <el-dropdown-item> <a @click="getPlugin">插件下载</a></el-dropdown-item> -->
          <el-dropdown-item> <a @click="concatUS">联系我们</a>  </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <a @click="logout"><i class="iconfont el-iconfont-tuichu" />退出</a>
    </div>
    <el-dialog
      title="联系我们"
      :visible.sync="concatVisible"
      :close-on-click-modal="false"
      append-to-body
      width="400px"
    >
      <el-row class="rowStyle" style="margin-top:0;font-size:18px;font-weight:600">
        <el-col :span="24" align="center">
          山东亿云信息技术有限公司
        </el-col>
      </el-row>
      <el-row class="rowStyle">
        <el-col :span="24" align="center">
          邮箱：evay@sdas.org
        </el-col>
      </el-row>
      <!-- <el-row class="rowStyle">
        <el-col :span="24" align="left">
          邮编：250014
        </el-col>
      </el-row> -->
      <el-row class="rowStyle" style="margin-bottom:20px">
        <el-col :span="24" align="center">
          电话：0531-82600056
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'
import config from '@/../public/staticConfig'
export default {
  components: {
    Breadcrumb,
    Hamburger
  },
  data() {
    return {
      userName: '',
      orgName: '',
      concatVisible: false
    }
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'avatar'
    ])
  },
  mounted() {
    var temp = JSON.parse(localStorage.userInfoJson)
    this.orgName = temp.orgName
    this.userName = temp.empName
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    },
    logout() {
      // TODO 后期做成可配置
      // var temp = encodeURIComponent(window.location.href)
      var temp = encodeURIComponent(config.config.NGINXURL + '/#/index')
      var codeUrl = config.config.AUTHURL + '/logout' + '?redirectUri=' + temp
      window.location = codeUrl
    },
    getHelp() {
      var url = config.config.NGINXURL + '/电子证照综合管理系统操作手册.pdf'
      window.open(url, '_blank')
    },
    // getPlugin() {
    //   var url = config.config.NGINXURL + '/signplugin_setup.exe'
    //   window.open(url, '_blank')
    // },
    concatUS() {
      this.concatVisible = true
    }

  }
}
</script>

<style lang="scss" scoped>
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0,21,41,.08);

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background .3s;
    -webkit-tap-highlight-color:transparent;

    &:hover {
      background: rgba(0, 0, 0, .025)
    }
  }

  .breadcrumb-container {
    float: left;
  }
  .right-user-info{
    float: right;
    line-height:43px;
    margin-right: 30px;
  }
  .right-menu {
    float: right;
    height: 100%;
    line-height: 50px;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background .3s;

        &:hover {
          background: rgba(0, 0, 0, .025)
        }
      }
    }

    .avatar-container {
      margin-right: 30px;

      .avatar-wrapper {
        margin-top: 5px;
        position: relative;

        .user-avatar {
          cursor: pointer;
          width: 40px;
          height: 40px;
          border-radius: 10px;
        }

        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
  }
}
</style>
<style  scoped>
  .right-user-info a {
    margin-right: 10px;
    font-size:14px;
    color:#303133
  }
  .right-user-info a i{
    font-size: 20px;
    margin-right: 6px;
    position: relative;
    color:#000;
    top:3px
  }
  .rowStyle{
    font-size: 16px;
    margin-top: 20px;
  }
</style>
