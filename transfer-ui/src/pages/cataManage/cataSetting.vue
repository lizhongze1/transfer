<!--
 * @Descripttion: 证照配置
 * @Author: ppfei
 * @Date: 2019-08-06 16:05:41
 -->

<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.certificateName" placeholder="请输入证照名称" style="width: 15%" clearable />
      <el-select v-model="listQuery.isConfiguration" placeholder="配置情况" clearable style="width: 15%" class="filter-item">
        <el-option label="未配置" value="1" />
        <el-option label="已配置" value="2" />
      </el-select>
      <el-button v-waves type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
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
      <!-- <el-table-column align="center" label="签章方式" width="100">
        <template slot-scope="scope">
          <span v-if="scope.row.signatureType == '1'">手动签章</span>
          <span v-if="scope.row.signatureType == '2'">自动签章</span>
        </template>
      </el-table-column> -->
      <el-table-column align="center" label="配置情况">
        <template slot-scope="scope">
          <span v-if="scope.row.isConfiguration == '1'">未配置</span>
          <span v-if="scope.row.isConfiguration == '2'">已配置</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" plain @click="onHandleSetting(row.catalogId)">
            配置
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.rows" @pagination="fetchData" />

    <el-dialog :visible.sync="dialogVisible" title="签章配置" :close-on-click-modal="false" width="60%">
      <!-- <el-tabs type="border-card"> -->
      <!-- <el-tab-pane label="基本配置">
          <el-form ref="basicSetting" :model="basicSetting" label-position="top" :rules="rules">
            <el-form-item label="证照审核" prop="isChneck">
              <el-select v-model="basicSetting.isChneck" placeholder="请选择证照审核" clearable style="width: 50%" class="filter-item">
                <el-option label="是" value="Y" />
                <el-option label="否" value="N" />
              </el-select>
            </el-form-item>
            <el-form-item label="联合签章" prop="jointSignature">
              <el-select v-model="basicSetting.jointSignature" placeholder="请选择联合签章" clearable style="width: 50%" class="filter-item">
                <el-option label="是" value="Y" />
                <el-option label="否" value="N" />
              </el-select>
            </el-form-item>
            <el-form-item label="签章方式" prop="signatureType">
              <el-select v-model="basicSetting.signatureType" placeholder="请选择签章方式" clearable style="width: 50%" class="filter-item">
                <el-option label="手动签章" value="1" />
                <el-option label="自动签章" value="2" />
              </el-select>
            </el-form-item>
          </el-form>
          <div class="dialog-footer">
            <el-button @click="dialogVisible = false">
              取消
            </el-button>
            <el-button type="primary" @click="saveBasic('basicSetting')">
              保存
            </el-button>
          </div>
        </el-tab-pane> -->
      <!-- <el-tab-pane label="签章配置"> -->
      <el-table
        :data="templateInfoList"
        border
        fit
        stripe
        highlight-current-row
        style="margin-top: 16px"
      >
        <el-table-column label="版本号" align="center">
          <template slot-scope="scope">
            <span class="link-type">{{ scope.row.CURRENT_EDITION }}</span>
          </template>
        </el-table-column>
        <el-table-column label="模板状态" align="center">
          <template slot-scope="scope">
            {{ scope.row.TEMPLATE_STATUS }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="签章服务器地址">
          <template slot-scope="scope">
            <span>{{ scope.row.SERVER_ADRESS }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="用户名">
          <template slot-scope="scope">
            <span>{{ scope.row.USERNAME }}</span>
          </template>
        </el-table-column>
        <!-- <el-table-column align="center" label="颁发章个数">
          <template slot-scope="scope">
            <span>{{ scope.row.ISSUE_SEAL_NUM }}</span>
          </template>
        </el-table-column> -->
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
          <template slot-scope="{row}">
            <el-button type="primary" size="mini" plain @click="onHandleSignSetting(row.TEMPLATE_ID)">
              配置
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- </el-tab-pane> -->
      <!-- </el-tabs> -->
    </el-dialog>

    <el-dialog :visible.sync="signSetting" title="签章配置" :close-on-click-modal="false" width="60%">
      <el-form ref="signForm" :rules="signRules" :model="signFormData">
        <el-row :gutter="64">
          <el-col :span="8">
            <el-form-item label="连接地址：" prop="serverAdress">
              <el-input v-model.trim="signFormData.serverAdress" maxlength="100" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="用户名" prop="username">
              <el-input v-model.trim="signFormData.username" maxlength="20" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="密码" prop="password">
              <el-input v-model.trim="signFormData.password" maxlength="20" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="签章类型：" prop="signatureType">
          <el-radio-group v-model="signFormData.signatureType">
            <el-radio label="1">颁发章签章</el-radio>
            <!-- <el-radio label="2" disabled>关键字签章</el-radio> -->
          </el-radio-group>
        </el-form-item>
      </el-form>
      <el-button v-if="signFormData.signatureType" type="primary" @click="addRow(signFormData.signatureType)">增加</el-button>
      <el-table
        v-if="signFormData.signatureType == 1"
        :data="certificateIssueSeal"
        border
        fit
        stripe
        highlight-current-row
        style="margin: 16px 0"
      >
        <el-table-column label="序号" type="index" width="50" align="center" />
        <el-table-column label="颁发章唯一值" align="center">
          <template slot-scope="{row}">
            <el-input v-model="row.issueSealUniqueValue" maxlength="255" />
          </template>
        </el-table-column>
        <el-table-column label="密码" align="center">
          <template slot-scope="{row}">
            <el-input v-model="row.issueSealPassword" maxlength="255" />
          </template>
        </el-table-column>
        <el-table-column label="X坐标" align="center">
          <template slot-scope="{row}">
            <el-input v-model="row.coordinateX" maxlength="255" />
          </template>
        </el-table-column>
        <el-table-column label="Y坐标" align="center">
          <template slot-scope="{row}">
            <el-input v-model="row.coordinateY" maxlength="255" />
          </template>
        </el-table-column>

        <el-table-column label="签章页码" align="center">
          <template slot-scope="{row}">
            <el-input v-model="row.sealPagenumber" maxlength="11" />
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <!-- <el-input v-model="row.sealType" /> -->
            <el-button @click="deleteData(scope.$index,scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-table
        v-if="signFormData.signatureType == 2"
        :data="certificateKeywordSealList"
        border
        fit
        stripe
        style="margin: 16px 0"
      >
        <el-table-column label="序号" type="index" width="50" align="center" />
        <el-table-column label="颁发章唯一值" align="center">
          <template>
            <el-input />
          </template>
        </el-table-column>
        <el-table-column label="关键字" align="center">
          <template>
            <el-input />
          </template>
        </el-table-column>
        <el-table-column label="关键字顺序" align="center">
          <template>
            <el-input />
          </template>
        </el-table-column>
        <el-table-column label="签章类型" align="center">
          <template>
            <el-input />
          </template>
        </el-table-column>
      </el-table>
      <div>
        <el-button type="primary" @click="saveSign('signForm')">保存</el-button>
      </div>
    </el-dialog>

  </div>
</template>
<script>
import Pagination from '@/components/Pagination'
import waves from '@/directive/waves' // waves directive
import { getConfigurationPageData, catalogConfigurationEdit, catalogAndTemplateInfo, signConfigurationInfo, signConfigurationEdit } from '@/api/cataSetting'

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
        certificateName: '',
        status: '',
        isConfiguration: ''
      },
      dialogVisible: false,
      basicSetting: {
        id: '',
        isChneck: '',
        catalogId: '',
        jointSignature: '',
        signatureType: ''
      },
      rules: {
        isChneck: [
          { required: true, message: '请选择证照审核类型', trigger: 'change' }
          // { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        jointSignature: [
          { required: true, message: '请选择联合签章类型', trigger: 'change' }
          // { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        signatureType: [
          { required: true, message: '请选择签章方式', trigger: 'change' }
          // { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ]
      },
      templateInfoList: null,
      // 签章配置
      signSetting: false,
      //
      signFormData: {
        serverAdress: '',
        username: '',
        password: '',
        signatureType: '',
        templateId: ''
      },
      signRules: {
        serverAdress: [
          { required: true, message: '请输入服务器地址', trigger: 'blur' }
        ],
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' }
        ],
        signatureType: [
          { required: true, message: '请选择签章类型', trigger: 'change' }
        ]
      },
      certificateIssueSeal: [],
      certificateSignatureConfigurationId: '',
      certificateKeywordSealList: []
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    // 获取编目分页信息
    fetchData() {
      getConfigurationPageData(this.listQuery).then(response => {
        response = response.data.data.data
        this.list = response.list
        this.total = response.total
      })
    },
    handleSearch() {
      this.listQuery.page = 1
      this.fetchData()
    },
    onHandleSetting(catalogId) {
      this.dialogVisible = true
      this.basicSetting.catalogId = catalogId
      this.fetchTempInfo(catalogId)
    },
    saveBasic(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          catalogConfigurationEdit(this.basicSetting).then(response => {
            if (response.status === 200) {
              this.$message({
                message: response.data.msg,
                type: 'success'
              })
            }
          })
        }
      })
    },
    fetchTempInfo(catalogId) {
      catalogAndTemplateInfo({ catalogId: catalogId }).then(response => {
        response = response.data.data
        this.templateInfoList = response.templateInfoList
        this.basicSetting = {
          id: response.id,
          catalogId: catalogId,
          isChneck: response.isChneck,
          jointSignature: response.jointSignature,
          signatureType: response.signatureType
        }
      })
    },
    onHandleSignSetting(templateId) {
      this.signFormData.templateId = templateId
      signConfigurationInfo({ templateId: templateId }).then(response => {
        response = response.data.data
        if (typeof (response) !== 'undefined' && Object.keys(response).length !== 0) {
          this.certificateIssueSeal = response.certificateIssueSeal
          this.certificateKeywordSealList = response.certificateKeywordSealList
          this.signFormData = response.signFormData
          this.certificateSignatureConfigurationId = response.signFormData.id
        } else {
          this.certificateIssueSeal = []
          this.certificateKeywordSealList = []
          this.signFormData = {
            serverAdress: '',
            username: '',
            password: '',
            signatureType: '',
            templateId: templateId
          }
        }
      })
      this.signSetting = true
    },
    saveSign(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          var data = {
            certificateIssueSeal: this.certificateIssueSeal,
            certificateKeywordSealList: this.certificateKeywordSealList,
            signFormData: this.signFormData
          }
          signConfigurationEdit(data).then(response => {
            if (response.data.code === '200') {
              this.$message({
                message: response.data.msg,
                type: 'success'
              })
              this.dialogVisible = false
              this.signSetting = false
              this.fetchData()
            } else {
              this.$message({
                message: response.data.msg,
                type: 'warning'
              })
            }
          })
        }
      })
    },
    addRow(type) {
      if (type === '1') {
        var list = {
          certificateSignatureConfigurationId: this.certificateSignatureConfigurationId
        }
        console.log(list)
        this.certificateIssueSeal.push(list)
      } else {
        // var list = {
        //   // templateStatus: templateStatus,
        //   // templateId: this.TEMPLATE_ID,
        //   // sort: this.sort++
        // }
        // this.certificateKeywordSealList.push(list)
      }
    },
    deleteData(index) {
      this.certificateIssueSeal.splice(index, 1)
    }

  }
}
</script>
<style scoped>
.form-main{
  padding: 0 24px;
}
</style>
