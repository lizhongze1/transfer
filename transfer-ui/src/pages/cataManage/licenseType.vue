<!--
 * @Descripttion: 证照类型
 * @Author: ppfei
 * @Date: 2019-08-07 16:06:26
 -->

<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.all" placeholder="请输入名称或编码" style="width: 15%" clearable />
      <el-select v-model="listQuery.certificateCatalogType" placeholder="目录类别" clearable style="width: 15%" class="filter-item">
        <el-option label="证照" value="1" />
        <el-option label="批文" value="2" />
        <el-option label="证明" value="3" />
        <el-option label="材料" value="4" />
        <el-option label="证件" value="5" />
      </el-select>
      <el-select v-model="listQuery.certificateDefineAuthortiyLevel" placeholder="证照定义机构级别" clearable style="width: 15%" class="filter-item">
        <el-option label="国家级" value="1" />
        <el-option label="省部级" value="2" />
        <el-option label="地市级" value="3" />
        <el-option label="区县级" value="4" />
        <el-option label="其他" value="5" />
      </el-select>
      <el-button v-waves type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
      <el-button v-waves type="primary" icon="el-icon-plus" @click="onHandleCreate()">新增</el-button>
      <el-button v-waves type="danger" icon="el-icon-minus" @click="onHandleDelete()">删除</el-button>
    </div>
    <el-table
      :data="list"
      border
      fit
      stripe
      style="margin-top: 16px"
      @selection-change="hanldeSelectionChange"
    >
      <el-table-column type="selection" align="center" />
      <el-table-column label="序号" width="50" align="center" type="index" />
      <el-table-column label="证照类型名称" align="center">
        <template slot-scope="{row}">
          <span class="link-type" @click="onHandleView(row)">{{ row.certificateTypeName }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="目录类别">
        <template slot-scope="scope">
          <span>{{ scope.row.certificateCatalogType | catalogType }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="定义机构">
        <template slot-scope="scope">
          <span>{{ scope.row.certificateDefineAuthortiyName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="证照定义机构级别" align="center">
        <template slot-scope="scope">
          {{ scope.row.certificateDefineAuthortiyLevel | type }}
        </template>
      </el-table-column>
      <!-- <el-table-column align="center" label="所属行业" width="100">
        <template slot-scope="scope">
          <span>{{ scope.row.belongToIndustryName }}</span>
        </template>
      </el-table-column> -->

      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button type="primary" plain @click="onHandleEdit(row)">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.rows" @pagination="fetchData" />

    <el-dialog :visible.sync="dialogVisible" :title="titleMap[dialogStatus]" :close-on-click-modal="false" width="60%">
      <el-form ref="ruleForm" :model="temp" label-position="top" :disabled="disabled" :rules="rules">
        <el-row :gutter="64">
          <el-col :span="12">
            <el-form-item label="证照类型名称：" prop="certificateTypeName">
              <el-input v-model.trim="temp.certificateTypeName" maxlength="30" show-word-limit clearable />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="证照类型代码：" prop="certificateTypeCode">
              <el-input v-model.trim="temp.certificateTypeCode" maxlength="21" show-word-limit clearable />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="64">

          <el-col :span="12">
            <el-form-item label="证照定义机构：" prop="certificateDefineAuthortiyName">
              <el-select v-model="temp.certificateDefineAuthortiyName" placeholder="请选择证照定义机构：" style="width:100%" @change="changeAuthority">
                <el-option
                  v-for="item in Define_Authortiy"
                  :key="item.ID"
                  :value="item.ORGAN_NAME"
                  :label="item.ORGAN_NAME"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="证照定义机构代码：" prop="certificateDefineAuthortiyCode">
              <el-input v-model="temp.certificateDefineAuthortiyCode" disabled clearable />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="64">
          <el-col :span="12">
            <el-form-item label="证照定义机构级别：" prop="certificateDefineAuthortiyLevel">
              <el-radio-group v-model="temp.certificateDefineAuthortiyLevel">
                <el-radio label="1">国家级</el-radio>
                <el-radio label="2">省部级</el-radio>
                <el-radio label="3">地市级</el-radio>
                <el-radio label="4">区县级</el-radio>
                <el-radio label="5">其他</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="持证主体类别：" prop="certificateHolderCategory">
              <el-select v-model="temp.certificateHolderCategory" style="width:100%">
                <el-option label="个人" value="1" />
                <el-option label="法人" value="2" />
              </el-select>
            </el-form-item>

          </el-col>
        </el-row>

        <el-row :gutter="64">
          <el-col :span="12">
            <el-form-item label="有效期范围：" prop="validityRange">
              <el-select
                v-model="temp.validityRange"
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
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="证照颁发机构级别：" prop="certificateIssuingAuthortiyLevel">
              <el-radio-group v-model="temp.certificateIssuingAuthortiyLevel">
                <el-radio label="1">国家级</el-radio>
                <el-radio label="2">省部级</el-radio>
                <el-radio label="3">地市级</el-radio>
                <el-radio label="4">区县级</el-radio>
                <el-radio label="5">其他</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="64">
          <el-col :span="12">
            <el-form-item label="证照目录类别：" prop="certificateCatalogType">
              <el-radio-group v-model="temp.certificateCatalogType">
                <el-radio label="1">证照</el-radio>
                <el-radio label="2">批文</el-radio>
                <el-radio label="3">证明</el-radio>
                <el-radio label="4">材料</el-radio>
                <el-radio label="5">证件</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <!-- <el-col :span="12">
            <el-form-item label="国家电子证照类型：" prop="countryLicenceTypeId">
              <el-select v-model="temp.countryLicenceTypeId" placeholder="请选择国家电子证照类型：" style="width:100%">
                <el-option
                  v-for="item in CERTIFICATE_TYPE_NAME"
                  :key="item.ID"
                  :value="item.ID"
                  :label="item.CERTIFICATE_TYPE_NAME"
                />
              </el-select>
            </el-form-item>
          </el-col> -->
        </el-row>

        <el-row :gutter="64">
          <el-col :span="12">
            <el-form-item label="关联事项名称：" prop="relatedItemName">
              <el-input v-model.trim="temp.relatedItemName" maxlength="30" show-word-limit clearable />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="关联事项代码：" prop="relatedItemCode">
              <el-input v-model.trim="temp.relatedItemCode" maxlength="12" clearable show-word-limit />
            </el-form-item>
          </el-col>
        </el-row>

        <!-- <el-row :gutter="64">
          <el-col :span="12">
            <el-form-item label="所属行业：" prop="belongToIndustryName">
              <el-select v-model="temp.belongToIndustryName" placeholder="请选择所属行业：" style="width:100%" @change="changeIndustry">
                <el-option
                  v-for="item in Industry_Name"
                  :key="item.id"
                  :value="item.industryName"
                  :label="item.industryName"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12"/>
        </el-row> -->
        <el-row>
          <el-form-item label="备注" prop="remarks">
            <el-input v-model.trim="temp.remarks" maxlength="255" show-word-limit type="textarea" />
          </el-form-item>
        </el-row>
      </el-form>
      <div v-if="dialogStatus !== 'view'" slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="submitForm('ruleForm')">
          保存
        </el-button>
      </div>
    </el-dialog>

  </div>
</template>
<script>
import Pagination from '@/components/Pagination'
import waves from '@/directive/waves' // waves directive
import { getCheckData, getCertificateIndustryInfo, getCountryCertificateTypeInfo, getEertificateDefineAuthortiy, certificateTypeEdit, batchDelete, validityDate } from '@/api/licenseType'
export default {
  components: { Pagination },
  directives: { waves },
  filters: {
    type(val) {
      switch (val) {
        case '1': return '国家级'
        case '2': return '省部级'
        case '3': return '地市级'
        case '4': return '区县级'
        case '5': return '其他'
      }
    },
    catalogType(val) {
      switch (val) {
        case '1': return '证照'
        case '2': return '批文'
        case '3': return '证明'
        case '4': return '材料'
        case '5': return '证件'
      }
    }

  },
  data() {
    var validateRange = (rule, value, callback) => {
      value = value.join('^')
      if (value === '') {
        callback(new Error('请输入有效期'))
      } else {
        validityDate({ DateArr: value }).then(response => {
          if (response.data.code === '300') {
            callback(new Error(response.data.msg))
          } else {
            callback()
          }
        })
      }
    }
    return {
      list: null,
      total: 1,
      listQuery: {
        page: 1,
        rows: 10,
        certificateTypeName: '',
        all: '',
        certificateCatalogType: '',
        certificateDefineAuthortiyLevel: ''
      },
      dialogVisible: false,
      temp: {},
      titleMap: {
        'create': '新增',
        'edit': '编辑',
        'view': '查看'
      },
      dialogStatus: '',
      Industry_Name: null,
      CERTIFICATE_TYPE_NAME: null,
      Define_Authortiy: null,
      disabled: false,

      rules: {
        certificateTypeName: [
          { required: true, message: '请输入证照类型名称', trigger: 'blur' }
        ],
        certificateCatalogType: [
          { required: true, message: '请选择证照目录类别', trigger: 'change' }
        ],
        certificateDefineAuthortiyName: [
          { required: true, message: '请选择证照定义机构', trigger: 'change' }
        ],
        certificateDefineAuthortiyCode: [
          { required: true, message: '请选择证照定义机构代码', trigger: 'blur' }
        ],
        certificateDefineAuthortiyLevel: [
          { required: true, message: '请选择证照定义机构级别', trigger: 'change' }
        ],
        certificateTypeCode: [
          { required: true, message: '请输入证照类型代码', trigger: 'blur' }
        ],
        certificateHolderCategory: [
          { required: true, message: '请选择持证主体类别', trigger: 'change' }
        ],
        belongToIndustryName: [
          { required: true, message: '请选择所属行业', trigger: 'change' }
        ],
        validityRange: [
          // { required: true, message: '请输入有效期范围', trigger: 'blur' }
          { required: true, validator: validateRange, trigger: ['blur', 'change'] }
        ],
        certificateIssuingAuthortiyLevel: [
          { required: true, message: '请选择证照颁发机构级别', trigger: 'change' }
        ]
      },
      belongToIndustryId: '',
      // id 主键
      id: '',
      multipleSelection: '',
      // ids 删除用
      ids: '',
      date: '',
      // 有效期数组
      termOfValidityValue: [{
        value: '1天'
      }, {
        value: '1月'
      }, {
        value: '1年'
      }, {
        value: '长期'
      }],
      // 有效期 页面查询用
      termOfValidityList: ''
    }
  },
  created() {
    this.fetchData()
    getCertificateIndustryInfo().then(response => {
      this.Industry_Name = response.data.data
    })

    getCountryCertificateTypeInfo().then(response => {
      this.CERTIFICATE_TYPE_NAME = response.data.data
    })

    getEertificateDefineAuthortiy().then(response => {
      this.Define_Authortiy = response.data.data
    })
  },
  methods: {
    fetchData() {
      getCheckData(this.listQuery).then(response => {
        response = response.data.data.data
        this.list = response.list
        this.total = parseInt(response.total)
      })
    },
    handleSearch() {
      this.listQuery.page = 1
      this.fetchData()
    },
    onHandleEdit(row) {
      this.dialogStatus = 'edit'
      this.dialogVisible = true
      this.disabled = false
      this.temp = Object.assign({}, row)
      this.temp.validityRange = this.temp.validityRange.split('^')
      this.id = this.temp.id
    },
    onHandleView(row) {
      this.dialogStatus = 'view'
      this.dialogVisible = true
      this.disabled = true
      this.temp = Object.assign({}, row)
      this.temp.validityRange = this.temp.validityRange.split('^')
    },
    onHandleCreate() {
      this.dialogStatus = 'create'
      this.dialogVisible = true
      this.disabled = false
      // this.termOfValidityList = []
      this.$nextTick(() => {
        this.$refs['ruleForm'].clearValidate()
      })
      this.temp = {}
      this.$set(this.temp, 'validityRange', [])
    },
    changeAuthority(val) {
      for (var i = 0; i < this.Define_Authortiy.length; i++) {
        if (val === this.Define_Authortiy[i].ORGAN_NAME) {
          this.temp.certificateDefineAuthortiyCode = this.Define_Authortiy[i].ORGAN_CODE
        }
      }
    },
    changeIndustry(val) {
      this.belongToIndustryId = val
      for (var i = 0; i < this.Industry_Name.length; i++) {
        if (val === this.Industry_Name[i].industryName) {
          this.belongToIndustryId = this.Industry_Name[i].id
        }
      }
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.dialogStatus === 'edit') {
            this.temp.id = this.id
          }
          this.temp.belongToIndustryId = this.belongToIndustryId
          this.temp.validityRange = this.temp.validityRange.join('^')
          certificateTypeEdit(this.temp).then(response => {
            this.dialogVisible = false
            this.fetchData()
          })
        }
      })
    },
    hanldeSelectionChange(val) {
      this.multipleSelection = val
    },
    onHandleDelete() {
      this.ids = ''
      for (var i = 0; i < this.multipleSelection.length; i++) {
        this.ids += this.multipleSelection[i].id + ','
      }
      if (this.ids !== '') {
        this.$confirm('您确定删除吗', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'error'
        }).then(() => {
          batchDelete({ ids: this.ids }).then(response => {
            if (response.status === 200) {
              this.$message({
                message: response.data.msg,
                type: 'success'
              })
              this.fetchData()
            }
          })
        }).catch(() => {
          this.$message({
            message: '已取消删除',
            type: 'info'
          })
        })
      } else {
        this.$message({
          message: '请选择需要删除的证照',
          type: 'warning'
        })
      }
    }
  }
}
</script>
<style scoped>

</style>
