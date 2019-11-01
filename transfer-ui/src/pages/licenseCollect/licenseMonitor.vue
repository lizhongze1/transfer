<template>
  <div class="app-container dashboard-container">
    <el-row :gutter="20">
      <el-col :span="8">
        <div class="my-card">
          <div class="card-title">签章队列</div>
          <div class="card-content" align="center">
            <div class="content-top">
              <i class="content-top-icon" />排队证照
            </div>
            <div class="content-middle">
              <table />
              <p class="middle-number">{{ queueData.allCount }}</p>
              <p class="middle-time">耗时</p>
              <p class="middle-time-data">{{ queueData.consumingTime }}</p>
              <div class="content-middle-img" />
            </div>
          </div>
          <el-row class="card-bottom" align="center">
            <el-col :span="12" class="has-border">
              <div align="center">
                <p class="bottom-data">{{ queueData.suc }}</p>
                <p class="bottom-title">签章成功</p>
              </div>
            </el-col>
            <el-col :span="12">
              <div align="center">
                <p class="bottom-data">{{ queueData.fail }}</p>
                <p class="bottom-title">签章失败</p>
              </div>
            </el-col>
          </el-row>
        </div>
      </el-col>
      <el-col :span="8">
        <div class="my-card">
          <div class="card-title">数据采集</div>
          <div class="card-content" align="center">
            <div class="content-top">
              <i class="content-top-icon content-top-icon1" />采集条数
            </div>
            <div class="content-middle">
              <table />
              <p class="middle-number">{{ collectData.allCount }}</p>
              <p class="middle-time">耗时</p>
              <p class="middle-time-data">{{ collectData.consuming }}</p>
              <div class="content-middle-img content-middle-img1" />
            </div>
          </div>
          <el-row class="card-bottom" align="center">
            <el-col :span="8" class="has-border">
              <div align="center">
                <p class="bottom-data">{{ collectData.staySignature }}</p>
                <p class="bottom-title">待签章</p>
              </div>
            </el-col>
            <el-col :span="8" class="has-border">
              <div align="center">
                <p class="bottom-data">{{ collectData.stayCheck }}</p>
                <p class="bottom-title">待审核</p>
              </div>
            </el-col>
            <el-col :span="8">
              <div align="center">
                <p class="bottom-data">{{ collectData.err }}</p>
                <p class="bottom-title">异常</p>
              </div>
            </el-col>
          </el-row>
        </div>
      </el-col>
      <el-col :span="8">
        <div class="my-card">
          <div class="card-title">数据推送</div>
          <div class="card-content" align="center">
            <div class="content-top">
              <i class="content-top-icon content-top-icon2" />数据推送
            </div>
            <div class="content-middle">
              <table />
              <p class="middle-number">{{ pushData.allCount }}</p>
              <p class="middle-time">耗时</p>
              <p class="middle-time-data">{{ pushData.consuming }}</p>
              <div class="content-middle-img content-middle-img2" />
            </div>
          </div>
          <el-row class="card-bottom" align="center">
            <el-col :span="6" class="has-border">
              <div align="center">
                <p class="bottom-data">{{ pushData.staySignature }}</p>
                <p class="bottom-title">待签章</p>
              </div>
            </el-col>
            <el-col :span="6" class="has-border">
              <div align="center">
                <p class="bottom-data">{{ pushData.stayCheck }}</p>
                <p class="bottom-title">待审核</p>
              </div>
            </el-col>
            <el-col :span="6" class="has-border">
              <div align="center">
                <p class="bottom-data">{{ pushData.library }}</p>
                <p class="bottom-title">已入库</p>
              </div>
            </el-col>
            <el-col :span="6">
              <div align="center">
                <p class="bottom-data">{{ pushData.err }}</p>
                <p class="bottom-title">异常</p>
              </div>
            </el-col>
          </el-row>
        </div>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import { getCollectionMonitorData, getSignatureQueue } from '@/api/licenseMonitor'
export default {
  data() {
    return {
      collectData: {
        allCount: '',
        consuming: '',
        staySignature: '',
        stayCheck: '',
        library: '',
        err: ''
      },
      pushData: {
        allCount: '',
        consuming: '',
        staySignature: '',
        stayCheck: '',
        library: '',
        err: ''
      },
      queueData: {

      }
    }
  },
  mounted() {
    this.fetchData()
    clearInterval(timer1)
    var timer1 = setInterval(() => {
      this.fetchData()
    }, 10000)
  },
  methods: {
    fetchData() {
      getCollectionMonitorData({ type: 1 }).then(res => {
        this.collectData = res.data.data.data
        this.collectData.consuming = this.getDuration(this.collectData.consuming)
      })
      getCollectionMonitorData({ type: 2 }).then(res => {
        this.pushData = res.data.data.data
        this.pushData.consuming = this.getDuration(this.pushData.consuming)
      })
      getSignatureQueue({}).then(res => {
        this.queueData = res.data.data.data.Statistics
        if (this.queueData.suc === undefined) {
          this.queueData.suc = 0
        }
        if (this.queueData.fail === undefined) {
          this.queueData.fail = 0
        }
        this.queueData.consumingTime = this.getDuration(this.queueData.consumingTime)
      })
    },
    getDuration(my_time) {
      var hours = my_time / 1000 / 60 / 60
      var hoursRound = Math.floor(hours)
      var minutes = my_time / 1000 / 60 - (60 * hoursRound)
      var minutesRound = Math.floor(minutes)
      var seconds = Math.floor(my_time / 1000 - (60 * 60 * hoursRound) - (60 * minutesRound))
      var time = hoursRound + ':' + minutesRound + ':' + seconds
      return time
    }
  }

}
</script>
<style scoped>
.dashboard-container{
  min-height: 100vh;
  background: #EAEDF2;
}
.my-card{
  height: 412px;
  box-shadow:0px 1px 1px 0px rgba(134,147,165,0.18);
  border-radius:3px;
  background: #fff;
  padding:0 24px
}
.card-title{
  font-size: 16px;
  color: #595959;
  border-bottom: 1px solid #ebebeb;
  height: 50px;
  line-height: 50px;
  font-weight: bold
}
.content-top{
  font-size: 14px;
  color: #595959;
  margin-top: 25px
}
.content-top-icon{
  font-size: 14px;
  display: inline-block;
  margin-right: 5px;
  font-style:normal;
  width: 14px;
  height: 14px;
  position: relative;
  top: 2px;
  /* ~ 是相对于下面的文件路径的意思 需要引入相对路径 */
  background-image: url('~@/assets/licenseMonitor/qianzhang.png');
}
/* 数据采集 */
.content-top-icon1{
  /* ~ 是相对于下面的文件路径的意思 需要引入相对路径 */
  background-image: url('~@/assets/licenseMonitor/caiji.png');
}
.content-top-icon2{
  /* ~ 是相对于下面的文件路径的意思 需要引入相对路径 */
  background-image: url('~@/assets/licenseMonitor/fabu.png');
}
.card-content{
  height: 262px;
  border-bottom: 1px solid #ebebeb;
}
.content-middle{
  margin-top: 25px;
  width: 182px;
  height: 182px;
  position: relative;
}
.content-middle-img{
  position: absolute;
  width: 182px;
  height: 182px;
  background-image: url('~@/assets/licenseMonitor/1.png');
  top: 0;
  left: 0;
}
.content-middle-img1{
  background-image: url('~@/assets/licenseMonitor/2.png');
}
.content-middle-img2{
  background-image: url('~@/assets/licenseMonitor/3.png');
}
.content-middle-img,.content-middle-img1,.content-middle-img2{
    -webkit-animation: rotate 5s linear infinite;
    -moz-animation: rotate 5s linear infinite;
    -o-animation: rotate 5s linear infinite;
    animation: rotate 5s linear infinite;
}
@-webkit-keyframes rotate{from{-webkit-transform: rotate(0deg)}
    to{-webkit-transform: rotate(360deg)}
}
@-moz-keyframes rotate{from{-moz-transform: rotate(0deg)}
    to{-moz-transform: rotate(359deg)}
}
@-o-keyframes rotate{from{-o-transform: rotate(0deg)}
    to{-o-transform: rotate(359deg)}
}
@keyframes rotate{from{transform: rotate(0deg)}
    to{transform: rotate(359deg)}
}
.middle-number{
  font-size: 30px;
  font-weight: bold;
  margin-top: 50px;
  color:#595959;
}
.middle-time{
  color: #595959;
  font-size: 14px;
  margin-top: 15px
}
.middle-time-data{
  color: #595959;
  font-size: 14px;
}
/* 下部 */
.card-bottom{
  padding: 12px 0
}
.bottom-data{
  font-size: 24px;
  font-weight: bold;
  color: #595959;
}
.bottom-title{
  font-size: 14px;
  color:#595959;
}
.has-border{
  border-right: 1px solid #ebebeb
}
</style>
