<!--
 * @Descripttion:
 * @Author: lip
 * @Date: 2019-07-26 16:49:40
 * @LastEditors: lip
 * @LastEditTime: 2019-08-23 16:34:29
 -->
<template>
  <div class="app-container dataFill">
    <div class="titleButton">
      <div class="filter-container">
        <el-input v-model="listQuery.globalSearch" clearable placeholder="请输入证照名称或证照编号" style="width: 18%" />
        <el-select v-model="listQuery.dataStatus" placeholder="请选择状态" clearable style="width: 15%" class="filter-item">
          <el-option v-for="item in optionsState" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
        <el-select v-model="listQuery.sourceOfCertificate" placeholder="请选择来源" clearable style="width: 15%" class="filter-item">
          <el-option v-for="item in optionsSource" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
        <el-button type="primary" icon="el-icon-search" @click="onHandleSearch">搜索</el-button>
        <el-button type="success" class="filter-item" icon="el-icon-check" @click="onHandleRejected('D')">通过</el-button>
        <el-button type="danger" class="filter-item" icon="el-icon-close" @click="onHandleRejected('R')">退回</el-button>
      </div>
    </div>
    <el-table
      :data="list"
      border
      fit
      stripe
      style="margin: 16px 0"
      @selection-change="hanldeSelectionChange"
    >
      <el-table-column type="selection" align="center" />
      <el-table-column label="序号" width="50" align="center" type="index" />

      <el-table-column label="证照名称" align="center">
        <template slot-scope="scope">
          <a class="link-type" @click="viewTemplate(scope.row)">  {{ scope.row.certificate_name }}</a>
        </template>
      </el-table-column>
      <el-table-column label="持证主体" align="center">
        <template slot-scope="scope">
          <template v-for="item in scope.row.certificate_info">
            <span v-if="item.metadata === '5'" :key="item.name">{{ item.value }}</span>
          </template>
        </template>
      </el-table-column>
      <el-table-column align="center" label="编号">
        <template slot-scope="scope">
          <template v-for="item in scope.row.certificate_info">
            <span v-if="item.metadata === '2'" :key="item.name">{{ item.value }}</span>
          </template>
        </template>
      </el-table-column>
      <el-table-column align="center" label="颁发日期">
        <template slot-scope="scope">
          <template v-for="item in scope.row.certificate_info">
            <span v-if="item.metadata === '3'" :key="item.name">{{ item.value }}</span>
          </template>
        </template>
      </el-table-column>
      <el-table-column prop="dataSouce" align="center" label="数据来源">
        <template slot-scope="scope">
          <span v-if="scope.row.sourceOfCertificate == '1'">采集</span>
          <span v-if="scope.row.sourceOfCertificate == '2'">填报</span>
          <span v-if="scope.row.sourceOfCertificate == '3'">导入</span>
          <span v-if="scope.row.sourceOfCertificate == '5'">补录</span>
        </template>
      </el-table-column>
      <el-table-column prop="status" align="center" label="状态">
        <template slot-scope="scope">
          <span v-if="scope.row.certificate_status == 'P'">待审核</span>
          <span v-if="scope.row.certificate_status == 'R'">退回</span>
          <span v-if="scope.row.certificate_status == 'W'">签章中</span>
          <span v-if="scope.row.certificate_status == 'D'">待签章</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <template v-if="row.certificate_status == 'P'">
            <el-button type="primary" size="mini" plain @click="onHandlePreviewEdit(row)"> 证照审核 </el-button>
          </template>
          <template v-else>
            <el-button type="primary" size="mini" plain @click="onHandlePreview(row)"> 证照预览 </el-button>
          </template>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.rows" @pagination="fetchData" />
    <!-- 点击查看弹出框 -->
    <el-dialog
      title="查看"
      :visible.sync="viewDialogVisible"
      :close-on-click-modal="false"
    >
      <el-row :gutter="65">
        <el-form :model="viewTemplateList">
          <el-col :span="12">
            <el-form-item label="证照名称">
              <el-input v-model="viewTemplateList.certificate_name" :disabled="true" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="版本号">
              <el-input v-model="viewTemplateList.version" :disabled="true" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="模板名称">
              <el-input v-model="viewTemplateList.templateName" :disabled="true" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="有效期限">
              <el-input v-model="templateTimeFormate" :disabled="true" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <template v-if="viewTemplateList.fileId">
              <el-form-item v-if="viewTemplateList.fileId.length!==0" label="下载文件">
                <template v-for="(item,index) in viewTemplateList.fileId">
                  <div :key="index" style="color:#409eff;width:100%;overflow: hidden;cursor:pointer;text-overflow: ellipsis;white-space: nowrap;" :title="item.FILE_NAME" @click="downloadFile(item.OPEN_FILE_URL)">{{ item.FILE_NAME }}</div>
                </template>
              </el-form-item>
            </template>
          </el-col>
          <el-col :span="12" />
          <template>
            <el-col v-for="(item,index) in viewTemplateList.certificate_info" :key="index" :span="12">
              <template v-if="item.certificateDataType=='3'">
                <el-form-item label="下载图片">
                  <a @click="downloadFile(item.value)"> 下载</a>
                </el-form-item>
              </template>
              <template v-else="">
                <el-form-item :label="item.label">
                  <el-input v-model="item.value" :disabled="true" />
                </el-form-item>
              </template>
            </el-col>
          </template>
        </el-form>
      </el-row>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="viewDialogVisible = false">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import Pagination from '@/components/Pagination'
import { getPageData, batchCheck, certificateView } from '@/api/dataExamine'
import config from '@/../public/staticConfig'
export default {
  components: { Pagination },
  data() {
    return {
      list: [],
      total: 1,
      listQuery: {
        page: 1,
        rows: 10,
        dataStatus: '',
        sourceOfCertificate: '',
        certificateTypeName: '',
        globalSearch: ''
      },
      // 选择状态
      optionsState: [
        {
          value: 'P',
          label: '待审核'
        }, {
          value: 'R',
          label: '退回'
        }, {
          value: 'W',
          label: '签章中'
        }, {
          value: 'D',
          label: '待签章'
        }],
      // 选择来源
      optionsSource: [
        {
          value: '1',
          label: '采集'
        }, {
          value: '2',
          label: '填报'
        }, {
          value: '3',
          label: '导入'
        }
      ],
      // table多选
      multipleSelection: [],
      // 查看时候获取的数据
      viewTemplateList: [],
      // 查看弹框是否显示开关
      viewDialogVisible: false,
      // 模板预览时间格式化之后的内容
      templateTimeFormate: '',
      // 证照预览模板html
      cerTemplateHtml: '',
      // 模板预览html
      templateHtml: ''
    }
  },
  mounted() {
    this.fetchData()
    localStorage.changeFlag = true
    window.addEventListener('storage', () => {
      this.fetchData()
    })
  },
  methods: {
    // 数据审核--分页查询信息
    fetchData() {
      getPageData(this.listQuery).then(response => {
        response = response.data.data.data
        this.list = response.list
        this.total = response.total
      })
    },
    hanldeSelectionChange(val) {
      this.multipleSelection = val
    },
    // 搜索
    onHandleSearch() {
      this.listQuery.page = 1
      this.fetchData()
    },
    // 批量驳回
    // 传递的参数为 通过D或者驳回R
    onHandleRejected(val) {
      if (this.multipleSelection.length === 0) {
        this.$message({
          message: '请先勾选证照',
          type: 'warning'
        })
      } else {
        // 设置标志 用于判断是否数据是否可以进行操作 只有待审核状态可以进行操作
        var doFlag = true
        this.multipleSelectionIds = []
        for (var i = 0; i < this.multipleSelection.length; i++) {
          if (val === 'R' && this.multipleSelection[i].certificate_status !== 'P') {
            doFlag = false
          }
          if (val === 'D' && this.multipleSelection[i].certificate_status !== 'P') {
            doFlag = false
          }
          this.multipleSelectionIds.push(this.multipleSelection[i].id)
        }
        if (doFlag) {
          var str = this.multipleSelectionIds.join(',')
          this.$prompt('请输入意见', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            inputPattern: /^[\s\S]*.*[^\s][\s\S]*$/,
            inputErrorMessage: '意见不能为空'
          }).then(({ value }) => {
            var obj = {
              ids: str,
              status: val,
              option: value
            }
            batchCheck(obj).then(response => {
              if (response.data.data.status) {
                this.$message({
                  message: response.data.data.data,
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
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '取消输入'
            })
          })
        } else {
          this.$message({
            message: '请检查勾选数据，只有待审核状态数据可以进行通过和退回！',
            type: 'warning'
          })
        }
      }
    },
    /** 弹窗部分 */
    // 查看操作
    viewTemplate(row) {
      // 获取数据展示
      console.log(row)
      this.viewTemplateList = row
      if (this.viewTemplateList.fileId !== '' && this.viewTemplateList.fileId !== undefined && !(Array.isArray(this.viewTemplateList.fileId))) {
        this.viewTemplateList.fileId = JSON.parse(this.viewTemplateList.fileId)
      }
      this.viewDialogVisible = true
      this.templateTimeFormate = this.timeFormate(row.termOfValidity)
    },
    // 有效期格式化
    timeFormate(str) {
      var arr = str.split(',')
      var str1 = ''
      switch (arr[1]) {
        case 'Y' : str1 = '年'
          break
        case 'M' : str1 = '月'
          break
        case 'D' : str1 = '日'
          break
        case 'L' : str1 = '长期有效'
      }
      if (str1 === '长期有效') {
        return str1
      } else {
        return (arr[0] + str1)
      }
    },
    // 有效期格式化 / 版本
    timeFormate1(str) {
      var arr = str.split('/')
      var str1 = ''
      switch (arr[1]) {
        case 'Y' : str1 = '年'
          break
        case 'M' : str1 = '月'
          break
        case 'D' : str1 = '日'
          break
        case 'L' : str1 = '长期有效'
      }
      if (str1 === '长期有效') {
        return str1
      } else {
        return (arr[0] + str1)
      }
    },
    // 下载文件
    downloadFile(url) {
      window.open(url, '_blank')
    },
    // 证照预览
    onHandlePreview(row) {
      certificateView({ certificateId: row.id }).then(response => {
        this.cerTemplateHtml = response.data.data.data.html
        localStorage.cerTemplateHtml = response.data.data.data.html
        window.open(config.config.NGINXURL + '/cataCertView.html', '_blank')
      })
    },
    // 证照审核
    onHandlePreviewEdit(row) {
      certificateView({ certificateId: row.id }).then(response => {
        this.cerTemplateHtml = response.data.data.data.html
        localStorage.cerTemplateHtml = response.data.data.data.html
        localStorage.cerId = row.id
        window.open(config.config.NGINXURL + '/cataCertViewEdit.html', '_blank')
      })
    }

  }
}
</script>

<style lang="scss">

</style>
