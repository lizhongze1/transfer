<!--
 * @Description: 证照编目
 * @Author: ppfei
 * @Date: 2019-07-24 17:44:28
 -->

<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.all" placeholder="请输入名称或编码" style="width: 15%" clearable />
      <el-select v-model="listQuery.status" placeholder="目录状态" clearable style="width: 15%" class="filter-item">
        <el-option v-for="item in cataStatus" :key="item.value" :label="item.label" :value="item.value" />
      </el-select>
      <el-button v-waves type="primary" icon="el-icon-search" @click="onHandleSearch">搜索</el-button>
      <el-button type="primary" icon="el-icon-plus" @click="onHandleCreate">新增</el-button>
      <el-button type="success" icon="el-icon-check" @click="onHandleSubmit">提交</el-button>
      <el-button type="warning" icon="el-icon-back" @click="onHandlePull">取回</el-button>
      <el-button type="danger" icon="el-icon-minus" @click="onHandleDelete">删除</el-button>
    </div>
    <el-table
      :data="list"
      border
      fit
      stripe
      style="margin-top: 16px"
      @selection-change="hanldeSelectionChange"
    >
      <el-table-column type="selection" align="center" width="50" />
      <el-table-column label="序号" width="50" align="center" type="index" />
      <el-table-column label="证照名称" align="center">
        <template slot-scope="scope">
          <span class="link-type" @click="onHandleView(scope.row)">{{ scope.row.certificateName }}</span>
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
          <span v-if="scope.row.catalogStatus == '1'">待提交</span>
          <span v-if="scope.row.catalogStatus == '2'">待审核</span>
          <span v-if="scope.row.catalogStatus == '3'">退回</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="创建时间">
        <template slot-scope="scope">
          <span>{{ scope.row.createrTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="200" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <template v-if="row.catalogStatus == '1' || row.catalogStatus == '3'">
            <el-button type="primary" size="mini" plain @click="onHandleEdit(row)">
              编辑
            </el-button>
            <el-button type="primary" size="mini" plain @click="onHandleViewTemp(row.catalogId)">
              模板信息
            </el-button>
          </template>
          <template v-if="row.catalogStatus == '2'">
            <el-button type="primary" size="mini" plain @click="onHandlePullRow(row.catalogId)">
              取回
            </el-button>
          </template>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.rows" @pagination="fetchData" />

    <el-dialog :visible.sync="dialogVisible" :title="titleMap[dialogStatus]" :close-on-click-modal="false" width="60%">
      <el-form ref="ruleForm" :model="temp" label-position="top" :rules="rules" class="form-main" :disabled="disabled">
        <el-row :gutter="64">
          <el-col :span="12">
            <el-form-item label="证照名称：" prop="certificateName">
              <el-input v-model.trim="temp.certificateName" maxlength="30" show-word-limit clearable />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="证照编码：" prop="certificateCode">
              <el-input v-model.trim="temp.certificateCode" maxlength="30" show-word-limit clearable />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="64">
          <el-col :span="12">
            <el-form-item label="目录类别：" prop="catalogType">
              <el-radio-group v-model="temp.catalogType" @change="handleCatalogTypeChange(temp.catalogType)">
                <el-radio label="1">证照</el-radio>
                <el-radio label="2">批文</el-radio>
                <el-radio label="3">证明</el-radio>
                <el-radio label="4">材料</el-radio>
                <el-radio label="5">证件</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="证照类型：" prop="certificateTypeName">
              <el-select v-model="temp.certificateTypeName" placeholder="请选择" style="width: 100%" clearable @change="changeCertType">
                <el-option
                  v-for="item in certificateTypeName"
                  :key="item.id"
                  :label="item.certificateTypeName"
                  :value="item.certificateTypeName"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <!-- <el-row :gutter="64">
          <el-col :span="12">
            <el-form-item label="证照主体：" prop="certificateSubject">
              <el-radio-group v-model="temp.certificateSubject">
                <el-radio label="1">自然人</el-radio>
                <el-radio label="2">法人</el-radio>
                <el-radio label="3">自然人或法人</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="公开级别：" prop="openLevel">
              <el-select v-model="temp.openLevel" placeholder="请选择公开级别" style="width:100%">
                <el-option
                  v-for="item in OPEN_LEVEL"
                  :key="item.VALUE"
                  :value="item.VALUE"
                  :label="item.TEXT"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row> -->

        <el-row :gutter="64">
          <el-col :span="12">
            <el-form-item label="事项类型：" prop="matterType">
              <el-select v-model="temp.matterType" placeholder="请选择活动区域" style="width:100%" clearable>
                <el-option
                  v-for="item in MATTER_TYPE"
                  :key="item.VALUE"
                  :value="item.VALUE"
                  :label="item.TEXT"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="颁发单位：" prop="certificateIssuingAuthortiy">
              <el-select v-model="temp.certificateIssuingAuthortiy" placeholder="请选择颁发单位" style="width:100%" clearable>
                <el-option
                  v-for="item in orgList"
                  :key="item.ORG_ID"
                  :label="item.ORG_NAME"
                  :value="item.ORG_ID"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <!-- <el-row :gutter="64">
          <el-col :span="12">
            <el-form-item label="关联事项名称：" prop="relatedItemName">
              <el-input v-model="temp.relatedItemName" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="关联事项代码：" prop="relatedItemCode">
              <el-input v-model="temp.relatedItemCode" />
            </el-form-item>
          </el-col>
        </el-row> -->

        <el-row :gutter="64">
          <!-- <el-col :span="12">
            <el-form-item label="有效期：" prop="termOfValidityList">
              <el-select
                v-model="termOfValidityList"
                multiple
                filterable
                allow-create
                default-first-option
                placeholder="请输入有效期，按如下格式填写"
                style="width:100%"
              >
                <el-option
                  v-for="item in termOfValidityValue"
                  :key="item.value"
                  :label="item.value"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col> -->
          <el-col :span="12">
            <el-form-item label="是否需要年检：" prop="ifYearlyInspection">
              <el-radio-group v-model="temp.ifYearlyInspection">
                <el-radio label="0">是</el-radio>
                <el-radio label="1">否</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="是否含有附件：" prop="appendix">
              <el-radio-group v-model="temp.appendix">
                <el-radio label="0">是</el-radio>
                <el-radio label="1">否</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="64">
          <el-col :span="12">
            <el-form-item label="是否允许多人持有：" prop="ifManyPeopleHold">
              <el-radio-group v-model="temp.ifManyPeopleHold">
                <el-radio label="0">是</el-radio>
                <el-radio label="1">否</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col v-if="temp.ifManyPeopleHold === '0'" :span="12">
            <el-form-item label="照面展示方式" prop="certificateShowMode">
              <el-select v-model="temp.certificateShowMode" placeholder="多人持有的照面展示方式，AB代表具体的持有人名称" style="width:100%" clearable>
                <el-option label="A B" value="1" />
                <el-option label="A,B" value="2" />
                <el-option label="A、B" value="3" />
                <el-option label="A和B" value="4" />
                <el-option label="A^B" value="5" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <!-- lipAdd -->
        <el-row :gutter="64">
          <el-col :span="12">
            <el-form-item label="是否过期提醒：" prop="ifRemind">
              <el-radio-group v-model="temp.ifRemind">
                <el-radio label="0">是</el-radio>
                <el-radio label="1">否</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col v-if="temp.ifRemind === '0'" :span="12">
            <el-form-item label="过期天数" prop="remindDays">
              <el-input v-model="temp.remindDays" placeholder="请输入过期天数" clearable />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="64">
          <el-col :span="24">
            <el-form-item label="备注：" prop="remarks">
              <el-input v-model="temp.remarks" maxlength="300" show-word-limit type="textarea" />
            </el-form-item>
          </el-col>
        </el-row>

      </el-form>
      <div v-if="dialogStatus !== 'view'" slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="submitForm('ruleForm')">
          确定
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import Pagination from '@/components/Pagination'
import waves from '@/directive/waves' // waves directive
import { getCatalogPageData, queryDictItemsByTypeCode, ordDelete, batchReturn, getCertificateTypeData, catalogInfoInsert, catalogBatchSub, getOrgDataList } from '@/api/licenseCata'

export default {
  components: { Pagination },
  directives: { waves },
  data() {
    return {
      list: null,
      total: 1,
      listQuery: {
        page: 1,
        rows: 10,
        status: '',
        certificateName: '',
        all: ''
      },
      cataStatus: [{
        value: '1',
        label: '待提交'
      }, {
        value: '2',
        label: '待审核'
      }, {
        value: '3',
        label: '退回'
      }],
      dialogVisible: false,
      titleMap: {
        'create': '新增',
        'edit': '编辑',
        'view': '查看'
      },
      dialogStatus: '',
      // 有效期 页面查询用
      termOfValidityList: '',
      temp: {
        // 证照名称
        certificateName: '',
        // 事项名称
        matterType: '',
        // 目录类别
        catalogType: '',
        // 证照主体
        certificateSubject: '',
        // 证照编码
        certificateCode: '',
        // 关联事项名称
        relatedItemName: '',
        // 关联事项代码
        relatedItemCode: '',
        // 公开类别
        openLevel: '',
        // 颁发单位
        certificateIssuingAuthortiy: '',
        // 证照类型
        certificateTypeName: '',
        // 证照类型编码
        certificateTypeCode: '',
        // 是否年检
        ifYearlyInspection: '',
        // 附页附件
        appendix: '',
        // 是否多人持有
        ifManyPeopleHold: '',
        // 备注
        remarks: '',
        // 照面展示方式
        certificateShowMode: '',
        // 有效期字符串 传输用
        termOfValidity: '',
        // 是否过期提醒
        ifRemind: '',
        // 提醒天数
        remindDays: ''

      },
      // 事项名称
      MATTER_TYPE: null,
      // 公开级别
      OPEN_LEVEL: null,
      // 证照类型组
      certificateTypeName: null,
      // 有效期数组
      termOfValidityValue: [{
        value: '1天'
      }, {
        value: '1月'
      }, {
        value: '1年'
      }, {
        value: '长期有效'
      }],
      // 表单禁用功能
      disabled: false,
      // table多选
      multipleSelection: [],
      // ids 删除用
      ids: '',
      // 部门信息
      orgList: [],
      // 校验规则
      rules: {
        certificateName: [
          { required: true, message: '请输入证照名称', trigger: 'blur' }
        ],
        matterType: [
          { required: true, message: '请选择事项名称', trigger: 'change' }
        ],
        catalogType: [
          { required: true, message: '请选择目录类别', trigger: 'change' }
        ],
        certificateSubject: [
          { required: true, message: '请选择证照主体', trigger: 'change' }
        ],
        certificateCode: [
          { required: true, message: '请输入证照编码', trigger: 'blur' }
        ],
        openLevel: [
          { required: true, message: '请选择公开级别', trigger: 'change' }
        ],
        certificateIssuingAuthortiy: [
          { required: true, message: '请选择颁发单位', trigger: 'change' }
        ],
        certificateTypeName: [
          { required: true, message: '请选择证照类型', trigger: ['blur', 'change'] }
        ],
        // termOfValidityList: [
        //   { required: true, message: '请输入有效期', trigger: 'blur' }
        // ],
        ifYearlyInspection: [
          { required: true, message: '请选择是否年检', trigger: 'change' }
        ],
        appendix: [
          { required: true, message: '请选择是否有附页附件', trigger: 'change' }
        ],
        ifManyPeopleHold: [
          { required: true, message: '请选择是否多人持有', trigger: 'change' }
        ],
        certificateShowMode: [
          { required: true, message: '请选择照面展示方式', trigger: 'change' }
        ],
        ifRemind: [
          { required: true, message: '请选择是否过期提醒', trigger: 'change' }
        ],
        remindDays: [
          { required: true, message: '请输入过期天数', trigger: 'blur' },
          {
            validator(rule, value, callback) {
              if (Number.isInteger(Number(value)) && Number(value) > 0) {
                callback()
              } else {
                callback(new Error('请输入正整数'))
              }
            },
            trigger: 'blur'
          }
        ]
      }
    }
  },
  created() {
    this.fetchData()
    // 获取事项类型字典
    queryDictItemsByTypeCode({ typeCode: 'MATTER_TYPE' }).then(response => {
      response = response.data.data.data
      this.MATTER_TYPE = response
    })
    // 获取公开级别
    queryDictItemsByTypeCode({ typeCode: 'OPEN_LEVEL' }).then(response => {
      response = response.data.data.data
      this.OPEN_LEVEL = response
    })
    // 获取部门信息
    getOrgDataList({ orgId: '' }).then(response => {
      response = response.data.data.data
      this.orgList = response
    })
  },

  methods: {
    // 获取编目分页信息
    fetchData() {
      getCatalogPageData(this.listQuery).then(response => {
        response = response.data.data.data
        this.list = response.list
        this.total = parseInt(response.total)
      })
    },
    resetTemp() {
      this.temp = {
        // 证照名称
        certificateName: '',
        // 事项名称
        matterType: '',
        // 目录类别
        catalogType: '',
        // 证照主体
        certificateSubject: '',
        // 证照编码
        certificateCode: '',
        // 关联事项名称
        relatedItemName: '',
        // 关联事项代码
        relatedItemCode: '',
        // 公开类别
        openLevel: '',
        // 颁发单位
        certificateIssuingAuthortiy: '',
        // 证照类型
        certificateTypeName: '',
        // 证照类型编码
        certificateTypeCode: '',
        // 是否年检
        ifYearlyInspection: '',
        // 附页附件
        appendix: '',
        // 是否多人持有
        ifManyPeopleHold: '',
        // 备注
        remarks: '',
        // 照面展示方式
        certificateShowMode: '',
        // 有效期字符串 传输用
        termOfValidity: '',
        // 是否过期提醒
        ifRemind: '',
        // 提醒天数
        remindDays: ''
      }
    },
    // 按条件搜索
    onHandleSearch() {
      if (this.listQuery.status === null) {
        this.listQuery.status = ''
      }
      this.listQuery.page = 1
      this.fetchData()
    },
    // 处理表格selection变化
    hanldeSelectionChange(val) {
      this.multipleSelection = val
    },
    // 新增
    onHandleCreate() {
      this.disabled = false
      this.dialogVisible = true
      this.dialogStatus = 'create'
      this.resetTemp()
      this.termOfValidityList = []
      this.$nextTick(() => {
        this.$refs['ruleForm'].clearValidate()
      })
    },
    // 取回
    onHandlePull() {
      this.ids = ''
      for (var i = 0; i < this.multipleSelection.length; i++) {
        if (this.multipleSelection[i].catalogStatus === '2') {
          this.ids += this.multipleSelection[i].catalogId + ','
        } else {
          this.$message({
            message: '请选择待审核状态的证照',
            type: 'warning'
          })
          return
        }
      }

      if (this.ids !== '') {
        this.$confirm('您确定取回吗', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          batchReturn({ ids: this.ids }).then(res => {
            this.$message({
              message: res.data.data.message,
              type: 'success'
            })
            this.fetchData()
          })
        }).catch(() => {
          this.$message({
            message: '已取消取回',
            type: 'info'
          })
        })
      } else {
        this.$message({
          message: '请选择待审核状态的证照',
          type: 'warning'
        })
      }
    },
    // 取回单条
    onHandlePullRow(id) {
      if (id !== '') {
        this.$confirm('您确定取回吗', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          batchReturn({ ids: id }).then(res => {
            this.$message({
              message: res.data.data.message,
              type: 'success'
            })
            this.fetchData()
          })
        }).catch(() => {
          this.$message({
            message: '已取消取回',
            type: 'info'
          })
        })
      }
    },
    // 删除
    onHandleDelete() {
      this.ids = ''
      for (var i = 0; i < this.multipleSelection.length; i++) {
        if (this.multipleSelection[i].catalogStatus === '1' || this.multipleSelection[i].catalogStatus === '3') {
          this.ids += this.multipleSelection[i].catalogId + ','
        } else {
          this.$message({
            message: '请选择待提交和退回状态的证照',
            type: 'warning'
          })
          return
        }
      }
      if (this.ids !== '') {
        this.$confirm('您确定删除吗', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'error'
        }).then(() => {
          ordDelete({ ids: this.ids }).then(res => {
            this.fetchData()
            this.$message({
              message: '已成功删除',
              type: 'success'
            })
          })
        })
      } else {
        this.$message({
          message: '请选择待提交和退回状态的证照',
          type: 'warning'
        })
      }
    },
    // 处理目录类别切换 根据证照名称获取目录类别
    handleCatalogTypeChange(val) {
      getCertificateTypeData({ certificateCatalogType: val }).then(response => {
        response = response.data.data.data
        this.certificateTypeName = response
      })
      // this.temp.certificateTypeCode = ''
      this.$set(this.temp, 'certificateTypeName', '')
    },
    // 证照类型 传递code值
    changeCertType(val) {
      for (var i = 0; i < this.certificateTypeName.length; i++) {
        if (val === this.certificateTypeName[i].certificateTypeName) {
          this.temp.certificateTypeCode = this.certificateTypeName[i].certificateTypeCode
        }
      }
    },
    // 编辑
    onHandleEdit(row) {
      this.disabled = false
      this.dialogVisible = true
      this.dialogStatus = 'edit'
      this.temp = Object.assign({}, row)
      this.termOfValidityList = this.temp.termOfValidity.split(',')
      this.$nextTick(() => {
        this.$refs['ruleForm'].clearValidate()
      })
    },
    // 查看
    onHandleView(row) {
      this.disabled = true
      this.dialogVisible = true
      this.dialogStatus = 'view'
      this.temp = Object.assign({}, row)
      this.termOfValidityList = this.temp.termOfValidity.split(',')
    },
    // 查看模板跳转
    onHandleViewTemp(catalogId) {
      this.$router.push({ path: '/cataManage/licenseCata/licenseTemp', query: { catalogId: catalogId, dialogStatus: 'edit' }})
    },
    // 新增提交
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.temp.termOfValidity = this.termOfValidityList.join(',')
          if (this.temp.ifManyPeopleHold === '1') {
            this.temp.certificateShowMode = ''
          }
          catalogInfoInsert(this.temp).then(response => {
            this.dialogVisible = false
            if (!response.data.data.status) {
              this.$message({
                message: response.data.data.message,
                type: 'warning'
              })
            } else {
              if (this.dialogStatus === 'edit') {
                this.$message({
                  message: response.data.data.message,
                  type: 'success'
                })
              } else {
                this.$message({
                  message: response.data.data.message,
                  type: 'success'
                })
              }
              this.fetchData()
            }
          }).catch(error => {
            console.log(error)
            this.$message({
              message: '失败',
              type: 'success'
            })
          })
        } else {
          return false
        }
      })
    },
    // 提交目录
    onHandleSubmit(catalogId, catalogStatus) {
      this.ids = ''
      for (var i = 0; i < this.multipleSelection.length; i++) {
        if (this.multipleSelection[i].catalogStatus === '1' || this.multipleSelection[i].catalogStatus === '3') {
          this.ids += this.multipleSelection[i].catalogId + ','
        } else {
          this.$message({
            message: '请选择待提交和退回状态的证照',
            type: 'warning'
          })
          return
        }
        // this.ids += this.multipleSelection[i].catalogId + ','
      }

      if (this.ids !== '') {
        this.$confirm('您确定提交吗', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'success'
        }).then(() => {
          catalogBatchSub({ catalogIds: this.ids, catalogStatus: '2' }).then(response => {
            if (response.data.data.status === true) {
              this.$message({
                message: response.data.data.data,
                type: 'success'
              })
              this.fetchData()
            } else {
              this.$message({
                message: response.data.data.message,
                type: 'error'
              })
            }
          })
        }).catch(() => {
          this.$message({
            message: '已取消',
            type: 'info'
          })
        })
      } else {
        this.$message({
          message: '请选择待提交和退回状态的证照',
          type: 'warning'
        })
      }
    }
  }
}
</script>
<style scoped>
.form-main{
  padding: 0 24px;
}
</style>

