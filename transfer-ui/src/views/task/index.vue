<template>
  <div class="app-container">

<!--    <el-select v-model="listQuery.jobGroup" placeholder="表名" class="filter-item">

      <el-option v-for="item in taskInfos" :key="item.jobGroup" :label="item.jobGroup" :value="item.jobGroup" />
    </el-select>-->

    <el-button class="filter-item" type="primary" @click="handleCreate()">新建</el-button>
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
    >
      <el-table-column align="center" label="序号" width="95">
        <template slot-scope="scope">
          {{ scope.$index }}
        </template>
      </el-table-column>
      <el-table-column label="appName" >
        <template slot-scope="scope">
          {{ scope.row.appName }}
        </template>
      </el-table-column>
      <el-table-column label="名称" width="110" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.title }}</span>
        </template>
      </el-table-column>
      <el-table-column label="机器地址" width="200" align="center">
        <template slot-scope="scope">

          {{scope.row.addressList}}
        </template>
      </el-table-column>
      <el-table-column class-name="注册方式" label="Status" width="110" align="center">
        <template slot-scope="scope">
<!--          <el-tag :type="scope.row.addressType | statusFilter">{{ scope.row.addressType }}</el-tag>-->
          <span v-if="scope.row.addressType == '1'" class="el-button el-button--success el-button--mini">自动注册</span>
          <span v-else-if="scope.row.addressType == '0'" class="el-button el-button--gray el-button--mini">手动录入</span>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="created_at" label="操作" width="200">
        <template slot-scope="scope">
          <el-dropdown trigger="click">
            <el-button type="primary" size="mini">
              操作<i class="el-icon-arrow-down el-icon--right" />
            </el-button>
            <el-dropdown-menu slot="dropdown">
<!--              <el-dropdown-item @click.native="handleConfig(scope.row)">停止</el-dropdown-item>-->
              <el-dropdown-item @click.native="handleUpdate(scope.row)">编辑</el-dropdown-item>
<!--              <el-dropdown-item @click.native="handleDelete(scope.row)">删除</el-dropdown-item>
              <el-dropdown-item @click.native="handleView(scope.row)">查看日志</el-dropdown-item>-->
            </el-dropdown-menu>
          </el-dropdown>
        </template>
      </el-table-column>
    </el-table>
    <!--<pagination v-show="count>0" :total="count" :page.sync="listQuery.page" :limit.sync="listQuery.length" @pagination="fetchData()" />-->
    <el-dialog :visible.sync="dialogFormVisible" :title="textMap[dialogStatus]" width="600px">
      <el-form ref="dataForm" :rules="rules" :model="taskInfo" label-position="left" label-width="120px" style="width: 400px; margin-left:30px;">
        <el-form-item label="名称" prop="name">
          <el-input v-model="taskInfo.title" />
        </el-form-item>
        <el-form-item label="app名称" prop="appName">
          <el-input v-model="taskInfo.appName" />
        </el-form-item>
        <el-form-item label="注册地址" prop="addressList">
          <el-input v-model="taskInfo.addressList" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="dataOperation()">确定</el-button>
      </div>
    </el-dialog>


  </div>
</template>

<script>
import { getList ,addtaskInfo,updatetaskInfo} from '@/api/task'
import Pagination from '@/components/Pagination'
export default {
    components: { Pagination },
  filters: {
      formatDate: function (value) {// 时间戳转换日期格式方法
          if (value == null) {
              return '';
          } else {
              let date = new Date(value);
              let y = date.getFullYear();// 年
              let MM = date.getMonth() + 1;// 月
              MM = MM < 10 ? ('0' + MM) : MM;
              let d = date.getDate();// 日
              d = d < 10 ? ('0' + d) : d;
              let h = date.getHours();// 时
              h = h < 10 ? ('0' + h) : h;
              let m = date.getMinutes();// 分
              m = m < 10 ? ('0' + m) : m;
              let s = date.getSeconds();// 秒
              s = s < 10 ? ('0' + s) : s;
              return y + '-' + MM + '-' + d + ' ' + h + ':' + m + ':' + s;
          }
          },

    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'gray',
        deleted: 'danger'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      list: null,
      listLoading: true,
        count: 0,
        dialogFormVisible: false,
        textMap: {
            create: '新建',
            update: '修改'
        },
        taskInfo: {
            id: null,
            title: null,
            appName: null,
            addressList:null
        },
        dialogStatus: 'create',
        rules: {
            title: [{ required: true, message: '名称不能为空', trigger: 'change' }],
            appName: [{ required: true, message: 'app名不能为空', trigger: 'change' }],
            addressList: [{ required: true, message: '注册地址不能为空', trigger: 'change' }]

        },
        listQuery: {
            jobGroup: 1,
            triggerStatus: -1,
            clusterId: null,
            start: 0,
            length: 10
        },
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.listLoading = true
      getList(this.listQuery).then(response => {
          console.log(response.data)
          this.count=response.recordsTotal
        this.list = response.data
        this.listLoading = false
      })
    },
      handleCreate() {
          this.resetModel()
          this.dialogStatus = 'create'
          this.dialogFormVisible = true
          this.$nextTick(() => {
              this.$refs['dataForm'].clearValidate()
          })
      },
      dataOperation() {
          this.$refs['dataForm'].validate((valid) => {
              if (valid) {
                  if (this.dialogStatus === 'create') {
                      addtaskInfo(this.taskInfo).then(res => {
                          console.log("111111111111111||||"+res)

                          this.operationRes(res)
                      })
                  }
                  if (this.dialogStatus === 'update') {
                      updatetaskInfo(this.taskInfo).then(res => {
                          this.operationRes(res)
                      })
                  }
              }
          })
      },

      operationRes(res) {
          console.log("value================")
          console.log(res)
          //alert(res)
          if (res.data === 'success') {
              this.fetchData()
              this.dialogFormVisible = false
              this.$message({
                  message: this.textMap[this.dialogStatus] + '成功',
                  type: 'success'
              })
          } else {
              this.$message({
                  message: this.textMap[this.dialogStatus] + '失败',
                  type: 'error'
              })
          }
      },

      resetModel() {
          this.taskInfo = {
              id: null,
              name: null,
              appName: null,
              addressList:null
          }
      },
      handleUpdate(row) {
          this.resetModel()
          this.taskInfo = Object.assign({}, row)
          this.dialogStatus = 'update'
          this.dialogFormVisible = true
          this.$nextTick(() => {
              this.$refs['dataForm'].clearValidate()
          })
      },
      handleConfig(row) {
          this.$router.push('/canalServer/nodeServer/config?clusterId=' + row.id)
      },
  }
}
</script>
