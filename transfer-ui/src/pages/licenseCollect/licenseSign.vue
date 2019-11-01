<!--
 * @Descripttion: 证照签章页面
 * @Author: lip
 * @Date: 2019-07-24 10:42:22
 * @LastEditors: lip
 * @LastEditTime: 2019-08-27 13:49:16
 -->
<template>
  <div class="app-container">
    <div class="button-container">
      <el-input v-model="listQuery.globalSearch" clearable placeholder="请输入证照名称或证照编号" style="width: 18%" />
      <!-- <el-select v-model="listQuery.dataStatus" clearable placeholder="证照状态" style="width: 15%">
        <el-option v-for="(item,index) in licenceStatus" :key="index" :label="item.label" :value="item.value" />
      </el-select> -->
      <el-select v-model="listQuery.sourceOfCertificate" clearable placeholder="证照来源" style="width: 15%">
        <el-option v-for="(item,index) in licenceSource" :key="index" :label="item.label" :value="item.value" />
      </el-select>
      <el-button type="primary" icon="el-icon-search" style="margin-left:10px" @click="queryPage">搜索</el-button>
      <el-button type="primary" icon="el-icon-check" @click="sign">自动签章</el-button>
    </div>
    <el-table
      :data="list"
      border
      fit
      highlight-current-row
      stripe
      style="margin: 16px 0"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" align="center" />
      <el-table-column label="序号" width="50" align="center" type="index" />

      <el-table-column label="证照名称" align="center">
        <template slot-scope="scope">
          <a class="link-type" @click="handleEdit(scope.row)">{{ scope.row.certificate_name }}</a>
        </template>
      </el-table-column>
      <el-table-column label="持证主体" align="center">
        <template slot-scope="scope">
          <template v-for="item in scope.row.certificate_info">
            <template v-if="item.metadata === '5'">
              {{ item.value }}
            </template>
          </template>
        </template>
      </el-table-column>
      <el-table-column align="center" label="编号">
        <template slot-scope="scope">
          <template v-for="item in scope.row.certificate_info">
            <template v-if="item.metadata === '2'">
              {{ item.value }}
            </template>
          </template>
        </template>
      </el-table-column>

      <el-table-column align="center" label="颁发日期">
        <template slot-scope="scope">
          <template v-for="item in scope.row.certificate_info">
            <template v-if="item.metadata === '3'">
              {{ item.value }}
            </template>
          </template>
        </template>
      </el-table-column>
      <el-table-column prop="dataSouce" align="center" label="数据来源">
        <template slot-scope="scope">
          <span v-if="scope.row.sourceOfCertificate == '1'">采集</span>
          <span v-if="scope.row.sourceOfCertificate == '2'">填报</span>
          <span v-if="scope.row.sourceOfCertificate == '3'">导入</span>
        </template>
      </el-table-column>
      <!-- <el-table-column prop="status" align="center" label="状态">
          <template slot-scope="scope">
            <span v-if="scope.row.certificate_status == 'W'">签章中</span>
            <span v-if="scope.row.certificate_status == 'D'">待签章</span>
          </template>
        </el-table-column> -->

      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" plain @click="signSingle(row)"> 手动签章 </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.rows" @pagination="fetchData" />
  </div>
</template>
<script>
import Pagination from '@/components/Pagination'
import { getPageData, signature, sealLicence, readerLicence } from '@/api/licenceSign'
import config from '@/../public/staticConfig'
import { setTimeout } from 'timers'
export default {
  components: {
    Pagination
  },
  data() {
    return {
      list: [],
      // 分页查询
      listQuery: {
        page: 1,
        rows: 10,
        certificateTypeName: '',
        sourceOfCertificate: '',
        dataStatus: '',
        // 点击顶部审核 需要 的数据
        certificateIds: '',
        globalSearch: ''
      },
      // 证照状态属性
      licenceStatus: [
        { label: '签章中', value: 'w' },
        { label: '待签章', value: 'D' }
      ],
      // 证照来源
      licenceSource: [
        { label: '全部', value: '' },
        { label: '填报', value: '2' },
        { label: '采集', value: '1' },
        { label: '导入', value: '3' }
      ],
      // 表格多选
      multipleSelection: [],
      total: 10
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.fetchData()
    })
  },
  methods: {
    fetchData() {
      getPageData(this.listQuery).then(response => {
        response = response.data.data.data
        this.list = response.list
        this.total = response.total
      })
    },
    queryPage() {
      this.listQuery.page = 1
      this.fetchData()
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
      var certificateIdsArr = []
      for (var i = 0; i < val.length; i++) {
        certificateIdsArr.push(val[i].id)
      }
      this.certificateIds = certificateIdsArr.join(',')
    },
    // 点击顶部签章
    sign() {
      if (this.multipleSelection.length === 0) {
        this.$message({
          message: '请先勾选签章',
          type: 'warning'
        })
      } else {
        // 开启左侧菜单
        var obj = { certificateIds: this.certificateIds }
        signature(obj).then(response => {
          if (response.data.code === '200') {
            this.$message({
              message: response.data.msg,
              type: 'success'
            })
            this.fetchData()
          } else {
            this.$message({
              message: response.data.msg,
              type: 'warning'
            })
          }
        })
      }
    },
    // 点击右侧签章
    signSingle(row) {
      var obj1 = { certificateId: row.id }
      sealLicence(obj1).then(response => {
        if (response.data.data.data.isRefresh === 'true') {
          if (response.data.data.status) {
            localStorage.setItem('urlPath', response.data.data.data.filePath)
            localStorage.setItem('urlParams', response.data.data.data.certificateId)

            var url = config.config.NGINXURL + '/sk.html'
            setTimeout(() => {
              window.open(url, '_blank')
            }, 1000)
          } else {
            this.$message({
              message: '操作失败',
              type: 'error'
            })
          }
        } else {
          this.$alert('此证照已签章', '提示', {
            confirmButtonText: '确定',
            callback: action => {
              this.fetchData()
            }
          })
        }
      })
    },
    // 查看
    handleEdit(row) {
      readerLicence({ certificateId: row.id }).then(response => {
        if (response.data.code === '200') {
          window.open(response.data.data, '_blank')
        } else {
          this.$message({
            message: '操作失败',
            type: 'warning'
          })
        }
      })
    }
  }

}
</script>
<style scoped>

</style>
