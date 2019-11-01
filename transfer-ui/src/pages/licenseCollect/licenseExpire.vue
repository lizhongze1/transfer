<template>
  <div class="app-container">
    <div class="button-container">
      <el-input v-model="listQuery.Certificateholder" clearable placeholder="请输入持证主体" style="width:15%" />
      <el-select v-model="listQuery.status" placeholder="请选择状态" clearable style="width: 15%" class="filter-item">
        <el-option v-for="item in optionsState" :key="item.value" :label="item.label" :value="item.value" />
      </el-select>
      <el-date-picker
        v-model="listQuery.issueDate"
        type="daterange"
        range-separator="——"
        start-placeholder="颁发日期"
        end-placeholder="颁发日期"
        format="yyyy-MM-dd"
        value-format="yyyy-MM-dd"
        clearable
        style="width:30%"
      />
      <el-button type="primary" size="small" icon="el-icon-search" @click="handleSearch">搜索</el-button>
      <el-button type="warning" size="small" icon="el-icon-bell" @click="sendRemind">发送提醒</el-button>
      <el-button type="warning" size="small" icon="el-icon-error" @click="neverRemind">不再提醒</el-button>
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
      <el-table-column type="selection" align="center" width="50" />
      <el-table-column label="序号" align="center" type="index" width="50" />
      <el-table-column
        label="证照名称"
        align="center"
      >
        <template slot-scope="scope">
          <a class="link-type" @click="handleEdit(scope.row)">{{ scope.row.certificate_name }}</a>
        </template>
      </el-table-column>
      <el-table-column
        label="持证主体"
        align="center"
        prop="name"
      />
      <el-table-column
        label="编号"
        align="center"
        prop="number"
      />
      <el-table-column
        label="颁发日期"
        align="center"
        prop="certificationTime"
      />
      <el-table-column
        label="过期时间"
        align="center"
        prop="endTime"
      />
      <el-table-column
        label="状态"
        align="center"
      >
        <template slot-scope="scope">
          <span v-if="scope.row.status === '1'">有效</span>
          <!-- <span v-if="scope.row.status === 'T'">废止</span> -->
          <!-- <span v-if="scope.row.status === 'O'">已过期</span> -->
          <span v-if="scope.row.status === 'I'">年检中</span>
          <span v-if="scope.row.status === 'C'">变更中</span>
          <span v-if="scope.row.status === 'R'">挂失</span>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        align="center"
      >
        <template slot-scope="scope">
          <el-button type="primary" size="mini" plain @click="handleDownload(scope.row)">下载</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.rows" @pagination="fetchData" />
  </div>
</template>
<script>
import { getDatePageDates, readerLicence, editNoReminder, sendMail } from '@/api/licenseExpire'
import Pagination from '@/components/Pagination'
import config from '@/../public/staticConfig'
export default {
  components: {
    Pagination
  },
  data() {
    return {
      // 总数
      total: 0,
      listQuery: {
        page: 1,
        rows: 10,
        status: '',
        issueDate: '',
        Certificateholder: ''
      },
      // 填充el-table
      list: [],
      // 状态总数
      optionsState: [
        {
          label: '有效',
          value: '1'
        },
        // {
        //   label: '废止',
        //   value: 'T'
        // },
        // {
        //   label: '已过期',
        //   value: 'O'
        // },
        {
          label: '年检中',
          value: 'I'
        },
        {
          label: '变更中',
          value: 'C'
        },
        {
          label: '挂失',
          value: 'R'
        }
      ],
      // el-table 复选框
      multipleSelection: []
    }
  },
  mounted() {
    this.fetchData()
  },
  methods: {
    // 获取数据
    fetchData() {
      if (Array.isArray(this.listQuery.issueDate)) {
        this.listQuery.issueDate = this.listQuery.issueDate.join(',')
      }
      getDatePageDates(this.listQuery).then(res => {
        this.total = res.data.data.data.total
        this.list = res.data.data.data.list
        console.log(this.list)
        if (this.listQuery.issueDate) {
          this.listQuery.issueDate = this.listQuery.issueDate.split(',')
        }
      })
    },
    // el-table 选定操作
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    // 搜索操作
    handleSearch() {
      this.listQuery.page = 1
      if (this.listQuery.issueDate !== null && this.listQuery.issueDate.length > 0) {
        this.listQuery.issueDate = this.listQuery.issueDate.join(',')
      }
      this.fetchData()
    },
    // 下载操作
    handleDownload(row) {
      // var obj = { certificateId: row.certificateId }
      // console.log(row)
      // downLoadLicence(obj).then(response => {
      //   if (response.data.code === '200') {
      //     this.$message({
      //       message: '操作成功',
      //       type: 'success'
      //     })
      //     window.open(response.data.data, '_blank')
      //   } else {
      //     this.$message({
      //       message: '操作失败',
      //       type: 'error'
      //     })
      //   }
      // })
      window.open(config.config.BASE_URL + '/licenceUtils/downLoadLicence?certificateId=' + row.certificateId, '_blank')
    },
    // 查看
    handleEdit(row) {
      readerLicence({ certificateId: row.certificateId }).then(response => {
        if (response.data.code === '200') {
          localStorage.setItem('openPath', response.data.data)
          var url = config.config.NGINXURL + '/skView.html'
          setTimeout(() => {
            window.open(url, '_blank')
          }, 1000)
        } else {
          this.$message({
            message: '操作失败',
            type: 'warning'
          })
        }
      })
    },
    sendRemind() {
      if (this.multipleSelection.length === 0) {
        this.$message({
          message: '请先选择数据',
          type: 'warning'
        })
      } else {
        var temp = []
        for (var i = 0; i < this.multipleSelection.length; i++) {
          temp.push(this.multipleSelection[i].id)
        }
        var str = temp.join(',')
        sendMail({ ids: str }).then(res => {
          if (res.data.data.status) {
            this.$message({
              message: res.data.data.message,
              type: 'success'
            })
          } else {
            this.$message({
              message: res.data.data.message,
              type: 'warning'
            })
          }
        })
      }
    },
    // 不再提醒操作
    neverRemind() {
      if (this.multipleSelection.length === 0) {
        this.$message({
          message: '请先选择数据',
          type: 'warning'
        })
      } else {
        var temp = []
        for (var i = 0; i < this.multipleSelection.length; i++) {
          temp.push(this.multipleSelection[i].electronicId)
        }
        var str = temp.join(',')
        editNoReminder({ electronicIds: str }).then(response => {
          if (response.data.data.status) {
            this.$message({
              message: response.data.data.message,
              type: 'success'
            })
            this.fetchData()
          } else {
            this.$message({
              message: response.data.data.message,
              type: 'warning'
            })
          }
        })
      }
    }
  }
}
</script>
