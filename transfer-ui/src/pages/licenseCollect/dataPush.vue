<template>
  <div class="app-container">
    <div class="button-container">
      <el-input v-model="listQuery.cataVal" clearable placeholder="请输入证照名称" style="width: 15%" />
      <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
      <el-button type="primary" icon="el-icon-edit" @click="handleEdit">编辑</el-button>
      <el-button type="primary" icon="el-icon-plus" @click="handleAdd">新增</el-button>
      <el-button type="danger" icon="el-icon-delete" @click="handleDelete">删除 </el-button>
    </div>
    <el-table
      :data="list"
      border
      fit
      highlight-current-row
      stripe
      style="margin: 16px 0"
      @selection-change="hanldeSelectionChange"
    >
      <el-table-column type="selection" align="center" width="50" />
      <el-table-column type="index" label="序号" width="50" align="center" />
      <el-table-column label="证照目录" align="center">
        <template slot-scope="scope">
          <a class="link-type" @click="handleView(scope.row)">{{ scope.row.certificateName }}</a>
        </template>
      </el-table-column>
      <el-table-column label="模板版本" prop="templateEdition" align="center" />
      <el-table-column label="URL" prop="url" show-overflow-tooltip align="center" />
      <el-table-column label="推送节点" align="center">
        <template slot-scope="scope">
          <template v-if="scope.row.pushNode ==='0'">
            送签章
          </template>
          <template v-if="scope.row.pushNode ==='1'">
            送审
          </template>
          <template v-if="scope.row.pushNode ==='2'">
            入库
          </template>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" prop="createTime" align="center" />
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" plain @click="handlePush(scope.row)">推送</el-button>
        </template>
        <!-- <template slot-scope="scope">
          <el-button v-if="scope.row.ifStop === 'N'" size="mini" type="danger" plain>停止</el-button>
          <el-button v-if="scope.row.ifStop === 'Y'" size="mini" type="primary" plain>执行</el-button>
        </template> -->
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.rows" @pagination="fetchData" />
    <el-dialog
      width="60%"
      :visible.sync="dialogVisible"
      :title="dialogTitle"
      :close-on-click-modal="false"
    >
      <el-form ref="ruleForm" :disabled="operatorStatus==='view'" :model="ruleForm" label-position="top" :rules="firstRules">
        <el-row :gutter="64">
          <el-col :span="12">
            <el-form-item prop="catalogId" label="证照名称：">
              <el-select v-model="ruleForm.catalogId" style="width:100%" clearable filterable placeholder="请选择证照目录" @change="fetchTemplate(ruleForm.catalogId)">
                <el-option v-for="(item,index) in cataOption" :key="index" :label="item.certificateName" :value="item.catalogId" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item prop="templateId" label="模板版本：">
              <el-select v-model="ruleForm.templateId" style="width:100%" clearable filterable placeholder="请选择模板版本">
                <el-option v-for="(item,index) in templateOption" :key="index" :label="item.templateYear+' V'+item.currentEdition" :value="item.templateId" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item prop="url" label="url：">
              <el-input v-model="ruleForm.url" clearable placeholder="请输入url" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item prop="token" label="token：">
              <el-input v-model="ruleForm.token" clearable placeholder="请输入token" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item prop="pushNode" label="推送节点：">
              <el-radio-group v-model="ruleForm.pushNode">
                <!-- <el-radio label="0">送签章</el-radio> -->
                <el-radio label="1">送审</el-radio>
                <!-- <el-radio label="2">入库</el-radio> -->
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <el-row>
        <el-col :span="24">
          <el-button v-if="operatorStatus !== 'view'" type="primary" @click="handleApiTest">接口测试</el-button>
          <el-button v-if="operatorStatus !== 'view'" type="primary" @click="showExample">接口返回示例</el-button>
          <el-button :disabled="operatorStatus==='view'" type="primary" @click="handleSave">保存</el-button>
          <el-button type="warning" @click="dialogVisible = false">取消</el-button>
        </el-col>
      </el-row>
    </el-dialog>
    <el-dialog
      width="40%"
      title="接口返回示例"
      :close-on-click-modal="false"
      :visible.sync="exampleVisible"
    >
      <el-row>
        <el-col :span="24">
          <span style="margin-right:10px;font-weight:600;font-size:15px">code:</span> {{ exampleData.code }}
        </el-col>
        <el-col :span="24">
          <span style="margin-right:10px;font-weight:600;font-size:15px">msg:</span> {{ exampleData.code }}
        </el-col>
        <el-col :span="24">
          <span style="margin-right:10px;font-weight:600;font-size:15px">result:</span> {{ exampleData.result }}
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>
<script>
import Pagination from '@/components/Pagination'
import { getPageApiPushData, dataFilling, getTemplateBasicDataByCatalogId, insertApiPushData, getStandardData, delApiPushData, implementPush, apiTest } from '@/api/dataPush'
export default {
  components: {
    Pagination
  },
  data() {
    return {
      total: 0,
      list: [],
      listQuery: {
        page: 0,
        rows: 10,
        cataVal: ''
      },
      // 多选数据
      multipleSelection: [],
      // dialog 是否显示开关
      dialogVisible: false,
      dialogTitle: '新增',
      // 表单 和 表单验证规则
      ruleForm: {
        catalogId: '',
        templateId: '',
        url: '',
        token: '',
        pushNode: ''
      },
      // 第一步规则
      firstRules: {
        catalogId: [
          { required: true, message: '请选择证照名称', trigger: 'change' }
        ],
        templateId: [
          { required: true, message: '请选择模板版本', trigger: 'change' }
        ],
        url: [
          { required: true, message: '请输入url', trigger: 'blur' }
        ],
        // token: [
        //   { required: true, message: '请输入token', trigger: 'blur' }
        // ],
        pushNode: [
          { required: true, message: '请选择推送节点', trigger: 'change' }
        ]
      },
      // 证照名称下拉框内容
      cataOption: [],
      // 版本号下拉内容框
      templateOption: [],
      operatorStatus: 'add',
      // 接口返回示例弹框
      exampleVisible: false,
      exampleData: {},
      // 编辑时候传入apiID
      editApiId: ''
    }
  },
  mounted() {
    this.fetchData()
  },
  methods: {
    // 获取数据
    fetchData() {
      getPageApiPushData(this.listQuery).then(res => {
        if (res.data.data.status) {
          this.total = res.data.data.data.total
          this.list = res.data.data.data.list
        } else {
          this.$message({
            message: res.data.data.message,
            type: 'warning'
          })
        }
      })
    },
    // 多选操作
    hanldeSelectionChange(val) {
      this.multipleSelection = val
    },
    // 搜索操作
    handleSearch() {
      this.listQuery.page = 1
      this.fetchData()
    },
    // 获取证照名称option
    fetchCata() {
      dataFilling({ id: '' }).then(res => {
        this.cataOption = res.data.data.data.catalogInfo
      })
    },
    // 获取版本号
    fetchTemplate(id) {
      this.ruleForm.templateId = ''
      getTemplateBasicDataByCatalogId({ catalogId: id }).then(res => {
        this.templateOption = res.data.data.data
      })
    },
    // 新增弹出框
    handleAdd() {
      this.$nextTick(() => {
        this.$refs['ruleForm'].clearValidate()
      })
      this.operatorStatus = 'add'
      this.ruleForm = {
        catalogId: '',
        templateId: '',
        url: '',
        token: '',
        pushNode: ''
      }
      this.dialogVisible = true
      this.dialogTitle = '新增'
      this.fetchCata()
    },
    // 保存
    handleSave() {
      this.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          if (this.operatorStatus === 'edit') {
            this.ruleForm.apiId = this.editApiId
          }
          insertApiPushData(this.ruleForm).then(res => {
            if (res.data.data.status) {
              this.$message({
                message: res.data.data.message,
                type: 'success'
              })
              this.dialogVisible = false
              this.fetchData()
            } else {
              this.$message({
                message: res.data.data.message,
                type: 'warning'
              })
            }
          })
        } else {
          this.$message({
            message: '请先完善信息',
            type: 'warning'
          })
        }
      })
    },
    // 推送
    handlePush(row) {
      implementPush({ apiId: row.apiId }).then(res => {
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
    },
    handleEdit() {
      this.operatorStatus = 'edit'
      if (this.multipleSelection.length === 0) {
        this.$message({
          message: '请先选择要编辑的数据',
          type: 'warning'
        })
      } else if (this.multipleSelection.length > 1) {
        this.$message({
          message: '一次只能编辑一条数据',
          type: 'warning'
        })
      } else {
        this.fetchCata()
        this.dialogTitle = '编辑'
        var row = this.multipleSelection[0]
        console.log(row)
        this.editApiId = row.apiId
        this.ruleForm.catalogId = row.catalogId
        this.fetchTemplate(this.ruleForm.catalogId)
        this.ruleForm.templateId = row.templateId
        this.ruleForm.url = row.url
        this.ruleForm.token = row.token
        this.ruleForm.pushNode = row.pushNode
        this.dialogVisible = true
        this.fetchData()
      }
    },
    handleView(row) {
      this.operatorStatus = 'view'
      this.fetchCata()
      this.ruleForm.catalogId = row.catalogId
      this.fetchTemplate(this.ruleForm.catalogId)
      this.ruleForm.templateId = row.templateId
      this.ruleForm.url = row.url
      this.ruleForm.token = row.token
      this.ruleForm.pushNode = row.pushNode

      this.dialogVisible = true
    },
    // 接口返回示例
    showExample() {
      if (this.ruleForm.templateId === '') {
        this.$message({
          message: '清先选择相应的版本号',
          type: 'warning'
        })
      } else {
        getStandardData({ templateId: this.ruleForm.templateId }).then(res => {
          if (res.data.data.status) {
            this.exampleData = res.data.data.data
            this.exampleVisible = true
          } else {
            this.$message({
              message: res.data.data.message,
              type: 'warning'
            })
          }
        })
      }
    },
    handleDelete() {
      if (this.multipleSelection.length === 0) {
        this.$message({
          message: '请选择要删除的数据',
          type: 'warning'
        })
      } else {
        this.$confirm('您确定要删除吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          var temp = []
          for (var i = 0; i < this.multipleSelection.length; i++) {
            temp.push(this.multipleSelection[i].apiId)
          }
          var val = temp.join(',')
          delApiPushData({ apiIds: val }).then(res => {
            if (res.data.data.status) {
              this.$message({
                message: res.data.data.message,
                type: 'success'
              })
              this.fetchData()
            } else {
              this.$message({
                message: res.data.data.message,
                type: 'warning'
              })
            }
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
      }
    },
    handleApiTest() {
      this.$refs['ruleForm'].validate(valid => {
        if (valid) {
          apiTest(this.ruleForm).then(res => {
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
        } else {
          this.$message({
            message: '请先完善信息',
            type: 'warning'
          })
        }
      })
    }

  }
}
</script>
