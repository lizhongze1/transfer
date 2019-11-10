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
  </div>
</template>

<script>
import { getList } from '@/api/task'
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
