<template>
  <div class="app-container">

<!--    <el-select v-model="listQuery.jobGroup" placeholder="表名" class="filter-item">

      <el-option v-for="item in canalClusters" :key="item.jobGroup" :label="item.jobGroup" :value="item.jobGroup" />
    </el-select>-->


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
      <el-table-column label="描述" >
        <template slot-scope="scope">
          {{ scope.row.jobDesc }}
        </template>
      </el-table-column>
      <el-table-column label="执行器" width="110" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.executorHandler }}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" width="200" align="center">
        <template slot-scope="scope">

          {{scope.row.addTime|formatDate}}
        </template>
      </el-table-column>
      <el-table-column class-name="状态" label="Status" width="110" align="center">
        <template slot-scope="scope">
<!--          <el-tag :type="scope.row.triggerStatus | statusFilter">{{ scope.row.triggerStatus }}</el-tag>-->
          <span v-if="scope.row.triggerStatus == '1'" class="el-button el-button--success el-button--mini">启动中</span>
          <span v-else-if="scope.row.triggerStatus == '0'" class="el-button el-button--danger el-button--mini">已停止</span>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="created_at" label="操作" width="200">
        <template slot-scope="scope">
          <el-dropdown trigger="click">
            <el-button type="primary" size="mini">
              操作<i class="el-icon-arrow-down el-icon--right" />
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item @click.native="handleConfig(scope.row)">停止</el-dropdown-item>
              <el-dropdown-item @click.native="handleUpdate(scope.row)">编辑</el-dropdown-item>
              <el-dropdown-item @click.native="handleDelete(scope.row)">删除</el-dropdown-item>
              <el-dropdown-item @click.native="handleView(scope.row)">查看日志</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="count>0" :total="count" :page.sync="listQuery.page" :limit.sync="listQuery.length" @pagination="fetchData()" />
 <!--   <el-dialog :visible.sync="dialogFormVisible" :title="textMap[dialogStatus]" width="600px">
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
    </el-dialog>-->



  </div>
</template>

<script>
import { getList } from '@/api/table'
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

      handleConfig(row) {
          this.$router.push('/canalServer/nodeServer/config?clusterId=' + row.id)
      },
  }
}
</script>
