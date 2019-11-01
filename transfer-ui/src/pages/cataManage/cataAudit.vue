<!--
 * @Descripttion: 操作日志
 * @Author: ppfei
 * @Date: 2019-08-07 16:06:51
 -->

<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.all" placeholder="请输入名称或编码" style="width: 15%" clearable />
      <el-select v-model="listQuery.status" clearable placeholder="目录状态" style="width: 15%">
        <el-option v-for="(item,index) in statusOption" :key="index" :label="item.label" :value="item.value" />
      </el-select>
      <el-button v-waves type="primary" icon="el-icon-search" @click="onHandleSearch()">搜索</el-button>
    </div>
    <el-table
      :data="list"
      border
      fit
      stripe
      style="margin-top: 16px"
    >
      <el-table-column label="序号" width="50" align="center" type="index" />
      <el-table-column label="证照名称" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.certificateName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="颁发单位" align="center">
        <template slot-scope="scope">
          {{ scope.row.orgName }}
        </template>
      </el-table-column>
      <!-- <el-table-column align="center" label="有效期">
        <template slot-scope="scope">
          <span>{{ scope.row.termOfValidity }}</span>
        </template>
      </el-table-column> -->
      <el-table-column align="center" label="证照编码">
        <template slot-scope="scope">
          <span>{{ scope.row.certificateCode }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="目录状态">
        <template slot-scope="scope">
          <span v-if="scope.row.catalogStatus == '2'">待审核</span>
          <span v-if="scope.row.catalogStatus == '3'">审核退回</span>
          <span v-if="scope.row.catalogStatus == '4'">审核通过</span>
          <span v-if="scope.row.catalogStatus == '5'">停用</span>
          <span v-if="scope.row.catalogStatus == '6'">维护中</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="创建时间">
        <template slot-scope="scope">
          <span>{{ scope.row.createrTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="100" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button type="primary" plain size="mini" @click="onHandleView(row.catalogId)">查看</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.rows" @pagination="fetchData" />

    <el-dialog :visible.sync="dialogVisible" title="查看" :close-on-click-modal="false" width="60%">
      <el-table
        :data="processList"
        border
        fit
        stripe
        style="margin-top: 16px"
      >
        <el-table-column label="序号" width="100px" align="center" type="index" />
        <el-table-column label="目录名称" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.certificateName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作者" align="center">
          <template slot-scope="scope">
            {{ scope.row.empName }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作类型" width="150">
          <template slot-scope="scope">
            <span>{{ scope.row.checkOperateType | type }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作时间" width="200">
          <template slot-scope="scope">
            <span>{{ scope.row.checkTime }}</span>
          </template>
        </el-table-column>
      </el-table>

      <pagination v-show="processTotal>0" :total="processTotal" :page.sync="processDetail.page" :limit.sync="processDetail.rows" @pagination="getProcess" />
    </el-dialog>
  </div>
</template>
<script>
import Pagination from '@/components/Pagination'
import { getCatalogPageData } from '@/api/licenseCata'
import { getCatalogProcessDetail } from '@/api/cataAudit'
import waves from '@/directive/waves' // waves directive
export default {
  components: { Pagination },
  directives: { waves },
  filters: {
    type(val) {
      switch (val) {
        case '1': return '提交'
        case '2': return '待审核'
        case '3': return '审核退回'
        case '4': return '审核通过'
        case '5': return '停用'
        case '6': return '维护中'
        case '7': return '删除'
      }
    }
  },
  data() {
    return {
      list: null,
      total: 1,
      listQuery: {
        page: 1,
        rows: 10,
        status: '2,3,4,5,6',
        certificateName: '',
        all: ''
      },
      statusOption: [
        {
          label: '全部',
          value: '2,3,4,5,6'
        },
        {
          label: '待审核',
          value: '2'
        },
        {
          label: '审核退回',
          value: '3'
        },
        {
          label: '审核通过',
          value: '4'
        },
        {
          label: '停用',
          value: '5'
        },
        {
          label: '维护中',
          value: '6'
        }
      ],
      dialogVisible: false,
      processDetail: {
        page: 1,
        rows: 10,
        catalogId: ''
      },
      processList: null,
      processTotal: 1,
      catalogId: ''
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      getCatalogPageData(this.listQuery).then(response => {
        response = response.data.data.data
        this.list = response.list
        this.total = parseInt(response.total)
      })
    },
    // 搜索
    onHandleSearch() {
      if (this.listQuery.status === null) {
        this.listQuery.status = '2,3,4,5,6'
      }
      this.listQuery.page = 1
      this.fetchData()
    },
    onHandleView(catalogId) {
      this.dialogVisible = true
      this.catalogId = catalogId
      this.getProcess()
    },
    getProcess() {
      this.processDetail.catalogId = this.catalogId
      getCatalogProcessDetail(this.processDetail).then(response => {
        response = response.data.data.data
        this.processList = response.list
        this.processTotal = parseInt(response.total)
      })
    }
  }
}
</script>
<style scoped>

</style>
