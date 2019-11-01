<template>
  <div class="app-container">
    <div class="button-container">
      <el-input v-model="listQuery.globalSearch" clearable style="width:18%" placeholder="请输入证照名称或证照编号" />
      <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
    </div>
    <el-table
      :data="list"
      border
      fit
      highlight-current-row
      stripe
      style="margin: 16px 0"
    >
      <el-table-column
        label="序号"
        type="index"
        width="50"
        align="center"
      />
      <el-table-column
        label="证照名称"
        prop="certificate_name"
        align="center"
      />
      <el-table-column
        label="持证主体"
        align="center"
      >
        <template slot-scope="scope">
          <template v-for="item in scope.row.certificate_info">
            <template v-if="item.metadata === '5'">
              {{ item.value }}
            </template>
          </template>
        </template>
      </el-table-column>
      <el-table-column
        label="编号"
        align="center"
      >
        <template slot-scope="scope">
          <template v-for="item in scope.row.certificate_info">
            <template v-if="item.metadata === '2'">
              {{ item.value }}
            </template>
          </template>
        </template>
      </el-table-column>
      <el-table-column
        label="颁发时间"
        align="center"
      >
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
          <!-- <span v-if="scope.row.sourceOfCertificate == '4'">推送</span> -->
          <span v-if="scope.row.sourceOfCertificate == '5'">补录</span>
        </template>
      </el-table-column>
      <el-table-column
        label="状态"
        align="center"
      >
        <template slot-scope="scope">
          <span v-if="scope.row.certificate_status == 'P'">待审核</span>
          <span v-if="scope.row.certificate_status == '1'">有效</span>
          <span v-if="scope.row.certificate_status == 'T'">作废</span>
          <span v-if="scope.row.certificate_status == 'R'">退回</span>
          <span v-if="scope.row.certificate_status == 'W'">签章中</span>
          <span v-if="scope.row.certificate_status == 'D'">待签章</span>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        align="center"
      >
        <template slot-scope="scope">
          <el-button type="primary" size="mini" plain @click="handleView(scope.row)">查看</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.rows" @pagination="fetchData" />
    <el-dialog
      :visible.sync="dialogVisible"
      title="查看"
      :close-on-click-modal="false"
      width="60%"
    >
      <el-table
        :data="dialogList"
        border
        fit
        stripe
        style="margin-top: 16px"
      >
        <el-table-column
          type="index"
          label="序号"
          width="50"
        />
        <el-table-column
          label="操作者"
          prop="processCertificateOperator"
        />
        <el-table-column
          label="操作类型"
        >
          <template slot-scope="scope">
            <span v-if="scope.row.processCertificateStatus==='P'">提交</span>
            <span v-if="scope.row.processCertificateStatus==='D'">审核通过</span>
            <span v-if="scope.row.processCertificateStatus==='R'">审核退回</span>
            <span v-if="scope.row.processCertificateStatus==='1'">签章入库</span>
            <span v-if="scope.row.processCertificateStatus==='T'">吊销</span>
            <span v-if="scope.row.processCertificateStatus==='C'">变更</span>
            <span v-if="scope.row.processCertificateStatus==='I'">年检</span>
            <span v-if="scope.row.processCertificateStatus==='S'">保存</span>
          </template>
        </el-table-column>
        <el-table-column
          label="操作意见"
          prop="processCertificateOpnion"
        />
        <el-table-column
          label="操作时间"
          prop="processCertificateOperateTime"
        />
      </el-table>
    </el-dialog>
  </div>
</template>
<script>
import Pagination from '@/components/Pagination'
import { getProcessPageData, getCertificateProcess } from '@/api/licenseAudit'
export default {
  components: { Pagination },
  data() {
    return {
      total: 0,
      // 查询用
      listQuery: {
        page: 1,
        rows: 10,
        // 证照类型名称
        certificateTypeName: '',
        globalSearch: ''
      },
      // list 列表用
      list: [],
      // 查看弹框是否显示
      dialogVisible: false,
      dialogList: []
    }
  },
  mounted() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      getProcessPageData(this.listQuery).then(res => {
        this.total = res.data.data.data.total
        this.list = res.data.data.data.list
      })
    },
    // 搜索
    handleSearch() {
      this.listQuery.page = 1
      this.fetchData()
    },
    // 查看
    handleView(row) {
      getCertificateProcess({ id: row.id }).then(res => {
        console.log(res)
        if (res.data.data.status) {
          this.dialogList = res.data.data.data
          console.log(this.dialogList)
          this.dialogVisible = true
        } else {
          this.$message({
            message: res.data.data.message,
            type: 'warning'
          })
        }
      })
    }
  }
}
</script>
