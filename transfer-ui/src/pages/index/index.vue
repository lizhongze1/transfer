<template>
  <div class="app-container dashboard-container">
    <el-row style="margin-right:0px" :gutter="30">
      <el-col :span="14">
        <el-row class="top-content">
          <el-col class="top-content-left" :span="10">
            <el-col :span="10" class="title-icon-bg">
              <i class="iconfont el-iconfont-ruku" />
            </el-col>
            <el-col style="padding-left:20px" class="top-content-data" :span="14">
              证照入库总数<br>
              <span style="font-weight:500">{{ CertificateStorageNum }}</span>
            </el-col>
          </el-col>
          <el-col :span="14">
            <div class="divide-div" />
            <el-carousel trigger="click" :interval="5000" height="150px" direction="vertical">
              <el-carousel-item v-for="(item,index) in cerResult" :key="index">
                <div class="top3">
                  <div v-for="item2 in item" :key="item2.certificate_name" class="top-content-data">
                    <el-tooltip :content="item2.certificate_name " placement="top">
                      <i>{{ item2.certificate_name }}</i>
                    </el-tooltip>
                    <br>
                    <span>{{ item2.libraryCount }}</span>
                  </div>
                </div>
              </el-carousel-item>
            </el-carousel>

          </el-col>
        </el-row>
        <el-row style="margin-top:15px" class="top-content">
          <el-col class="top-content-left" :span="10">
            <el-col :span="10" class="title-icon-bg title-icon-bg1">
              <i class="iconfont el-iconfont-jiekou" />
            </el-col>
            <el-col style="padding-left:20px" class="top-content-data" :span="14">
              接口调用次数<br>
              <span style="font-weight:500">{{ InterfaceNums }}</span>
            </el-col>
          </el-col>
          <el-col :span="14">
            <div class="divide-div" />
            <el-carousel trigger="click" :interval="5000" height="150px" direction="vertical">
              <el-carousel-item v-for="(item,index) in applyResult" :key="index">
                <div class="top3">
                  <div v-for="item2 in item" :key="item2.CATALOG_NAME" class="top-content-data">
                    <el-tooltip :content="item2.CATALOG_NAME " placement="top">
                      <i>{{ item2.CATALOG_NAME }}</i>
                    </el-tooltip>
                    <br>
                    <span>{{ item2.callCount }}</span>
                  </div>
                </div>
              </el-carousel-item>
            </el-carousel>
            <!-- <div class="top3">
              <div class="top-content-data">
                证照入库总数<br>
                <span>12390</span>
              </div>
              <div class="top-content-data">
                证照入库总数<br>
                <span>12390</span>
              </div>
              <div class="top-content-data">
                证照入库总数<br>
                <span>12390</span>
              </div>
            </div> -->
          </el-col>
        </el-row>
      </el-col>
      <el-col class="chart-div" :span="10">
        <div class="content-title">
          <i class="iconfont el-iconfont-lanbiao" /> 证照调用排名
        </div>
        <div>
          <barChart :height="height" />
        </div>
      </el-col>
    </el-row>
    <el-row v-if="roleType === '1'" class="overMindDiv">
      <div class="content-title">
        <i class="iconfont el-iconfont-lanbiao" /> 证照过期提醒
        <router-link to="/licenseCollect/licenseExpire">更多</router-link>
      </div>
      <el-table
        :data="overMindList"
        style="width: 100%"
        class="add-border-radius"
        :header-cell-style="{background:'#f3f5f8'}"
      >
        <el-table-column
          type="index"
          width="50"
          label="序号"
          align="center"
        />
        <el-table-column
          prop="name"
          label="持证者"
          align="center"
        />
        <el-table-column
          prop="certificate_name"
          label="证照名称"
          align="center"
        />
        <el-table-column
          prop="number"
          label="证照编号"
          align="center"
        />
        <el-table-column
          prop="endTime"
          label="过期时间"
          align="center"
        />
        <el-table-column
          label="操作"
          align="center"
        >
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="neverMind(scope.row.electronicId)">不再提醒</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-row>
    <el-row class="barDiv">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane id="tab-content" label="部门入库统计" name="first">
          <el-col id="parent1" :span="24">
            <dataZoomBar v-cloak id="barChart1" ref="child1" :height="zoomHeight" />
          </el-col>

        </el-tab-pane>
        <el-tab-pane label="部门调用统计" name="second">
          <!-- TODO没有接口 -->
          <el-col id="parent2" :span="24">
            <dataZoomBarApply v-cloak id="barChart2" ref="child2" :height="zoomHeight" />
          </el-col>
        </el-tab-pane>
      </el-tabs>
    </el-row>
  </div>
</template>
<script>
import barChart from './barChart'
import dataZoomBar from './dataZoomBar'
import dataZoomBarApply from './dataZoomBarApply'
import { getDatePage30, editNoReminder, getCertificateStorageNum, getInterfaceCalls, getCertificateStorageData, getOrgLicenceTop } from '@/api/index'
import { setTimeout } from 'timers'
export default {
  components: {
    barChart,
    dataZoomBar,
    dataZoomBarApply
  },
  data() {
    return {
      height: '265px',
      zoomHeight: '360px',
      // 过期时间提醒list
      overMindList: [],
      activeName: 'first',
      // 证照入库总数
      CertificateStorageNum: 0,
      // 接口调用总数
      InterfaceNums: 0,
      // 权限为1为审核
      roleType: '0',
      // 入库总数
      cerResult: [],
      applyResult: []
    }
  },
  computed: {
    isOpen() {
      return this.$store.state.app.sidebar.opened
    }
  },
  watch: {
    isOpen(newValue, oldValue) {
      this.$refs.child1.chartResize()
      this.$refs.child2.chartResize()
    }
  },
  mounted() {
    this.roleType = JSON.parse(localStorage.userInfoJson).roleType
    this.width = document.getElementsByClassName('barDiv')[0].clientWidth + 'px'
    this.getExpireList()
    this.getCertificateNum()
    this.getInterfaceCallsData()
    this.getCertificateData()
    this.getApplyData()
  },

  methods: {
    // 30天过期提醒
    getExpireList() {
      getDatePage30().then(response => {
        this.overMindList = response.data.data.data.list
      })
    },
    // 不再提醒操作
    neverMind(val) {
      editNoReminder({ electronicIds: val }).then(response => {
        if (response.data.data.status) {
          this.$message({
            message: response.data.data.message,
            type: 'success'
          })
          this.getExpireList()
        } else {
          this.$message({
            message: response.data.data.message,
            type: 'warning'
          })
        }
      })
    },
    // 获取证照入库数
    getCertificateNum() {
      getCertificateStorageNum().then((res) => {
        this.CertificateStorageNum = res.data.data.data.certificateStorageNumList.CertificateStorageNum
      })
    },
    // 获取接口调用总数
    getInterfaceCallsData() {
      getInterfaceCalls().then((res) => {
        this.InterfaceNums = res.data.data.data.InterfaceNums
      })
    },
    // 表单切换
    handleClick(tab) {
      if (tab.name === 'second') {
        setTimeout(() => {
          this.$refs.child2.chartResize()
        }, 500)
      } else {
        setTimeout(() => {
          this.$refs.child1.chartResize()
        }, 500)
      }
    },
    // 获取部门入库
    getCertificateData() {
      getCertificateStorageData().then(res => {
        this.cerResult = []
        for (var i = 0; i < res.data.data.data.length; i += 3) {
          this.cerResult.push(res.data.data.data.slice(i, i + 3))
        }
      })
    },
    // 获取调用总数
    getApplyData() {
      getOrgLicenceTop().then(res => {
        this.applyResult = []
        for (var i = 0; i < res.data.data.data.length; i += 3) {
          this.applyResult.push(res.data.data.data.slice(i, i + 3))
        }
      })
    }

  }
}
</script>
<style scoped>
.dashboard-container{
  min-height: 100vh;
  background: #EAEDF2;
}
.top-content{
  height: 150px;
  background: #fff;
  border-radius: 6px;
  box-shadow:0px 1px 1px 0px rgba(134,147,165,0.18);
}
.top-content-left{
  height: 100%;
  padding: 40px;
  padding-left: 30px;
  padding-right: 0px;
}
  /* 总览背景图 */
.title-icon-bg{
  width:70px;
  height: 70px;
  border-radius: 50%;
  background: #a08dee;
  text-align: center
}
.title-icon-bg1{
   background: #5db0e0
}
.title-icon-bg i{
  font-size: 36px;
  color: #fff;
  line-height: 70px;
  text-align: center
}
.top-content-data{
  font-size: 14px;
  color: #acacac;
  padding: 10px
}
.top-content-data i{
    display: inline-block;
    font-style: normal;
    width: 100px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;

}
.top-content-data span{
  font-size: 24px;
  color: #595959;
  line-height: 32px;
  font-weight: 400
}
.divide-div{
  width: 12px;
  height: 150px;
  background: -moz-linear-gradient( to right,  #f5f7fa 0%, #ffffff 100%);
  background: -webkit-linear-gradient(to right,  #000000 0%,#ffffff 100%);
  background: -o-linear-gradient(to right,  #f5f7fa 0%, #ffffff 100%);
  background: -ms-linear-gradient(to right,  #f5f7fa 0%, #ffffff 100%);
  background: linear-gradient(to right,  #f5f7fa 0%, #ffffff 100%);
  float: left;
}
.top3{
  display: flex;
  flex-direction: row;
  justify-content: center;
  padding: 40px 0;
}
.top3>div{
  width:100%;
  text-align: center
}
/* 证照调用排名外部div */
.chart-div{
  height: 315px;
  border-radius: 6px;
  background: #fff;
  padding: 0 24px;
}
/* 标题 */
.content-title{
  font-size: 18px;
  padding-top:15px;
  padding-bottom: 10px;
  border-bottom: 1px solid rgb(235, 235, 235)
}
.content-title i {
  color: #4a9cf1;
}
.content-title a{
  float: right;
  color: #3c8dbc;
  font-size: 14px
}
.content-title span{
  float: right;
  color: #3c8dbc;
  font-size: 14px
}
.overMindDiv{
  background: #fff;
  margin-top: 24px;
  box-shadow:0px 1px 1px 0px rgba(134,147,165,0.18);
  border-radius:6px;
  padding: 0 24px;
  padding-bottom: 24px;
}
.barDiv{
  height: 400px;
  background: #fff;
  margin-top: 24px;
  box-shadow:0px 1px 1px 0px rgba(134,147,165,0.18);
  border-radius:6px;
  padding: 0 24px
}
.el-tab-pane>div>div{
  width: 100%
}
.barChart{
  width: 100%
}
</style>
