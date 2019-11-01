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
      <el-table-column
        type="selection"
        width="50"
        align="center"
      />
      <el-table-column
        label="序号"
        type="index"
        width="50"
        align="center"
      />
      <el-table-column
        label="证照名称"
        align="center"
      >
        <template slot-scope="scope">
          <a class="link-type" @click="handleView(scope.row)">{{ scope.row.certificateName }}</a>
        </template>
      </el-table-column>
      <el-table-column
        label="模板版本"
        prop="templateEdition"
        align="center"
      />
      <el-table-column
        label="采集周期"
        align="center"
      >
        <template slot-scope="scope">
          {{ scope.row.collectionCycle }}天
        </template>
      </el-table-column>
      <el-table-column
        label="采集方式"
        align="center"
      >
        <template slot-scope="scope">
          <span v-if="scope.row.collectionType === '0'">全量</span>
          <span v-if="scope.row.collectionType === '1'">增量</span>
        </template>
      </el-table-column>
      <el-table-column
        label="创建时间"
        prop="dbCreateTime"
        align="center"
      />
      <el-table-column
        label="操作"
        align="center"
        width="300"
      >
        <template slot-scope="scope">
          <el-button v-if="scope.row.ifStop === 'N'" size="mini" type="danger" plain @click="handleOperator(scope.row,'Y')">停止</el-button>
          <el-button v-if="scope.row.ifStop === 'Y'" size="mini" type="primary" plain @click="handleOperator(scope.row,'N')">执行</el-button>
          <el-button size="mini" type="primary" plain @click="handleRun(scope.row)">采集一次</el-button>
        </template>

      </el-table-column>

    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.rows" @pagination="fetchData" />

    <!-- 修改 新增 查看 弹窗 -->
    <el-dialog
      width="60%"
      :visible.sync="dialogVisible"
      :title="dialogTitle"
      :close-on-click-modal="false"
    >
      <el-tabs v-model="activePane" type="border-card">
        <el-tab-pane name="firstPane" label="模板信息">
          <el-form ref="firstForm" :model="firstForm" label-position="top" :rules="firstRules">
            <el-row :gutter="64">
              <el-col :span="12">
                <el-form-item prop="cataId" label="证照名称：">
                  <el-select v-model="firstForm.cataId" :disabled="opeartorStatus === 'view'" style="width:100%" clearable filterable placeholder="请选择证照目录" @change="fetchTemplate(firstForm.cataId)">
                    <el-option v-for="(item,index) in cataOption" :key="index" :label="item.certificateName" :value="item.catalogId" />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item prop="templateId" label="模板版本：">
                  <el-select v-model="firstForm.templateId" :disabled="opeartorStatus === 'view'" style="width:100%" clearable filterable placeholder="请选择模板版本">
                    <el-option v-for="(item,index) in templateOption" :key="index" :label="item.templateYear+' V'+item.currentEdition" :value="item.templateId" />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-button type="primary" @click="nextSecond">下一步</el-button>
              </el-col>
            </el-row>
          </el-form>
        </el-tab-pane>
        <el-tab-pane name="secondPane" :disabled="secondPaneDisable" label="数据库连接">
          <el-form>
            <el-row :gutter="64">
              <el-col :span="12">
                <el-form-item label="数据库类型" class="is-required">
                  <el-select v-model="db_info.dbType" v-validate="'required'" :disabled="opeartorStatus === 'view'" clearable filterable style="width:100%" data-vv-scope="collect" name="dbType">
                    <el-option
                      v-for="item in dbTypeOption"
                      :key="item.label"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                  <span v-if="errors.has('collect.dbType')" v-cloak class="el-form-item__error"> 请选择数据库类型 </span>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="数据库url" class="is-required">
                  <el-input v-model="db_info.dbUrl" v-validate="'required'" :disabled="opeartorStatus === 'view'" clearable placeholder="jdbc:mysql://localhost:3306" data-vv-scope="collect" name="dbUrl" />
                  <span v-if="errors.has('collect.dbUrl')" v-cloak class="el-form-item__error"> 请填写数据库url </span>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="数据库连接名" class="is-required">
                  <el-input v-model="db_info.dbUsername" v-validate="'required'" :disabled="opeartorStatus === 'view'" clearable data-vv-scope="collect" name="dbUsername" />
                  <span v-if="errors.has('collect.dbUsername')" v-cloak class="el-form-item__error"> 请填写数据库连接名 </span>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="数据库连接密码" class="is-required">
                  <el-input v-model="db_info.dbPassword" v-validate="'required'" :disabled="opeartorStatus === 'view'" show-password clearable data-vv-scope="collect" name="dbPassword" />
                  <span v-if="errors.has('collect.dbPassword')" v-cloak class="el-form-item__error"> 请填写数据库密码 </span>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="数据库名" class="is-required">
                  <el-input v-model="db_info.databaseName" v-validate="'required'" :disabled="opeartorStatus === 'view'" clearable data-vv-scope="collect" name="databaseName" />
                  <span v-if="errors.has('collect.databaseName')" v-cloak class="el-form-item__error"> 请填写数据库名 </span>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="表名" class="is-required">
                  <el-input v-model="db_info.dbTablename" v-validate="'required'" :disabled="opeartorStatus === 'view'" clearable data-vv-scope="collect" name="dbTablename" />
                  <span v-if="errors.has('collect.dbTablename')" v-cloak class="el-form-item__error"> 请填写数据库表名 </span>
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-button type="primary" @click="testConnect">测试连接</el-button>
                <el-button v-if="opeartorStatus !== 'view'" type="primary" @click="nextThird">保存并下一步</el-button>
                <el-button type="primary" @click="preFirst">上一步</el-button>
                <el-button type="primary" @click="nextThirdStep">下一步</el-button>
              </el-col>
            </el-row>
          </el-form>
        </el-tab-pane>
        <el-tab-pane name="thirdPane" :disabled="thirdPaneDisable" label="字段对应关系">
          <el-table
            :data="cerList"
            border
            fit
            highlight-current-row
            stripe
            style="margin: 16px 0"
            :disabled="opeartorStatus === 'view'"
          >
            <el-table-column type="index" label="序号" width="50" align="center" />
            <el-table-column label="证照字段名" width="130" align="center">
              <template slot-scope="scope">
                {{ scope.row.certificateTemplateName }}
              </template>
            </el-table-column>
            <el-table-column
              label="证照字段类型"
              align="center"
              width="130"
            >
              <template slot-scope="scope">
                <template v-if=" scope.row.certificateDataType==='1'">
                  字符串
                </template>
                <template v-if=" scope.row.certificateDataType==='10'">
                  下拉选
                </template>
                <template v-if=" scope.row.certificateDataType==='11'">
                  大写余额
                </template>
                <template v-if=" scope.row.certificateDataType==='12'">
                  二维码
                </template>
                <template v-if=" scope.row.certificateDataType==='13'">
                  条形码
                </template>
                <template v-if=" scope.row.certificateDataType==='14'">
                  总分页数
                </template>
                <template v-if=" scope.row.certificateDataType==='15'">
                  当前页数
                </template>
                <template v-if=" scope.row.certificateDataType==='16'">
                  金额
                </template>
                <template v-if=" scope.row.certificateDataType==='2'">
                  日期
                </template>
                <template v-if=" scope.row.certificateDataType==='3'">
                  图片
                </template>
                <template v-if=" scope.row.certificateDataType==='4'">
                  固值
                </template>
                <template v-if=" scope.row.certificateDataType==='5'">
                  文本区域
                </template>
                <template v-if=" scope.row.certificateDataType==='6'">
                  文本编辑
                </template>
                <template v-if=" scope.row.certificateDataType==='7'">
                  颁证单位
                </template>
                <template v-if=" scope.row.certificateDataType==='8'">
                  单选
                </template>
                <template v-if=" scope.row.certificateDataType==='9'">
                  多选
                </template>
              </template>
            </el-table-column>
            <el-table-column label="对应表字段" align="center">
              <template slot-scope="scope">
                <el-form>
                  <el-form-item style="width:100%">
                    <el-select v-model="scope.row.targetColName" v-validate="'required'" :disabled="opeartorStatus === 'view'" style="width:100%" :name="scope.row.certificateTemplateId" clearable placeholder="请选择对应表字段" @change="handleSelectChange(scope.$index,scope.row.targetColName)">
                      <el-option v-for="(item,index) in conOption" :key="index" :label="item.name" :value="item.name" /></el-select>
                    <span v-if="errors.has(scope.row.certificateTemplateId)" v-cloak class="el-form-item__error"> 请选择对应表字段 </span>
                  </el-form-item>
                </el-form>
              </template>
            </el-table-column>
            <el-table-column label="对应表字段描述" width="130" align="center" prop="targetColNameDesc" />
            <el-table-column label="对应表字段类型" align="center" width="130" prop="targetColType" />
          </el-table>
          <el-row style="margin-top:12px">
            <el-input v-model="totalSql" :disabled="opeartorStatus === 'view'" type="textarea" placeholder="请输入sql语句" />
          </el-row>
          <el-row style="margin-top:12px">
            <el-button type="primary" @click="createSql">生成SQL</el-button>
            <el-button v-if="opeartorStatus !== 'view'" type="primary" @click="nextFourth">保存并下一步</el-button>
            <el-button type="primary" @click="preSecond">上一步</el-button>
            <el-button type="primary" @click="nextFourthStep">下一步</el-button>
          </el-row>
        </el-tab-pane>
        <el-tab-pane name="fourthPane" :disabled="fourthPaneDisable" label="采集规则">
          <el-row :gutter="64">
            <el-form label-position="top">
              <el-col :span="24">
                <el-form-item label="采集方式:">
                  <el-radio v-model="collectionType" :disabled="opeartorStatus === 'view'" label="0">全量</el-radio>
                  <el-radio v-model="collectionType" :disabled="opeartorStatus === 'view'" label="1">增量</el-radio>
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="采集周期:">
                  从 <el-date-picker
                    v-model="collectionStartTime"
                    :disabled="opeartorStatus === 'view'"
                    type="datetime"
                    placeholder="选择日期时间"
                    format="yyyy-MM-dd HH"
                    value-format="yyyy-MM-dd HH"
                  />
                  点开始,每隔
                  <el-input-number v-model="collectionCycle" :disabled="opeartorStatus === 'view'" :min="1" />
                  天执行一次
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-radio v-model="collectionCheckType" :disabled="opeartorStatus === 'view'" label="1">送审</el-radio>
                <!-- <el-radio v-model="collectionCheckType" :disabled="opeartorStatus === 'view'" label="0">送签章</el-radio> -->
              </el-col>
            </el-form>
            <el-col style="margin-top:12px" :span="24">
              <el-button v-if="opeartorStatus !== 'view'" type="primary" @click="handleSave('Y')">保存</el-button>
              <el-button v-if="opeartorStatus !== 'view'" type="primary" @click="handleSave('N')">保存并执行</el-button>
              <el-button v-if="opeartorStatus === 'view'" type="primary" @click="dialogVisible = false">关闭</el-button>
            </el-col>
          </el-row>
        </el-tab-pane>
      </el-tabs>
    </el-dialog>
  </div>
</template>
<script>
import Pagination from '@/components/Pagination'
import { dataFilling, getTemplateBasicDataByCatalogId, getCollectionPageData, queryDictItemsByTypeCode, collectionDbDataInsert, dbTest, getTableData, generateSql, collectionTabelRelationInsert, collectionConfigInsert, implementCollection, dbDatadeleteByPrimaryKey } from '@/api/dataCollection'
export default {
  components: {
    Pagination
  },
  data() {
    return {
      // 列表总数
      total: 0,
      // 表格数据
      list: [
      ],
      // 分页查询数据
      listQuery: {
        page: 1,
        rows: 10,
        // 证照名称
        cataVal: '',
        // 版本号
        templateVal: ''
      },
      // 多选框数据
      multipleSelection: [],
      // 证照名称下拉框内容
      cataOption: [],
      // 版本号下拉内容框
      templateOption: [],
      // 修改和新增弹框是否显示
      dialogVisible: false,
      dialogTitle: '新增',
      // 第二三四步是否可用
      secondPaneDisable: true,
      thirdPaneDisable: true,
      fourthPaneDisable: true,
      // 第一步form表单
      firstForm: {
        cataId: '',
        templateId: ''
      },
      // 第一步规则
      firstRules: {
        cataId: [
          { required: true, message: '请选择证照名称', trigger: 'change' }
        ],
        templateId: [
          { required: true, message: '请选择模板版本', trigger: 'change' }
        ]
      },
      // 当前标签页
      activePane: 'firstPane',
      // 数据库字典项列表
      dbTypeOption: [],
      // 数据库信息
      db_info: {

      },
      // 数据库id 用于查表
      dbId: '',
      // 第三步选择证照字段
      cerList: [],
      // 第三步 关联表的字段option
      conOption: [],
      // 完整的sql 语句
      totalSql: '',
      // 采集方式默认全量  0全量 1增量
      collectionType: '0',
      // 采集开始时间
      collectionStartTime: '',
      // 采集周期
      collectionCycle: '',
      // 送审还是送签章 1送审 0送签章
      collectionCheckType: '1',
      // 操作标示 若为view则不显示保存并下一步 页面不可操作
      opeartorStatus: 'edit'
    }
  },
  mounted() {
    this.fetchData()
  },
  methods: {
    // 获取数据
    fetchData() {
      getCollectionPageData(this.listQuery).then(res => {
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
    // 获取证照名称option
    fetchCata() {
      dataFilling({ id: '' }).then(res => {
        this.cataOption = res.data.data.data.catalogInfo
      })
    },
    // 处理表格复选框多选
    hanldeSelectionChange(val) {
      this.multipleSelection = val
    },
    // 新增操作
    handleAdd() {
      // 新增的时候设置dbId为空
      this.dialogTitle = '新增'
      this.opeartorStatus = 'add'
      this.activePane = 'firstPane'
      this.secondPaneDisable = true
      this.thirdPaneDisable = true
      this.fourthPaneDisable = true
      this.db_info.dbId = ''
      // 清空信息重新填写
      this.firstForm = {
        cataId: '',
        templateId: ''
      }
      this.db_info = {}
      this.dbId = ''
      this.cerList = []
      this.conOption = []
      this.totalSql = ''
      this.collectionType = '0'
      this.collectionStartTime = ''
      this.collectionCycle = ''
      this.collectionCheckType = '0'

      this.fetchCata()
      this.dialogVisible = true
    },
    // 获取版本号
    fetchTemplate(id) {
      this.firstForm.templateId = ''
      getTemplateBasicDataByCatalogId({ catalogId: id }).then(res => {
        this.templateOption = res.data.data.data
      })
    },
    // 获取数据库类型option
    fetchDbType() {
      // 获取 数据库字典项
      queryDictItemsByTypeCode({ typeCode: 'DB_TYPE' }).then(response => {
        var temp = response.data.data.data
        this.dbTypeOption = []
        for (var i = 0; i < temp.length; i++) {
          var obj = {
            value: temp[i].VALUE,
            label: temp[i].TEXT
          }
          this.dbTypeOption.push(obj)
        }
      })
    },
    // 获取表字段操作
    fetchTableData() {
      getTableData({ dbId: this.dbId }).then(res => {
        if (res.data.data.status) {
          this.cerList = res.data.data.data.licenceList
          this.conOption = res.data.data.data.tableList
        } else {
          this.$message({
            message: res.data.data.data.message,
            type: 'warning'
          })
        }
      })
    },
    // 及联选择器
    handleSelectChange(index, val) {
      const temp = this.conOption.filter(item => {
        return item.name === val
      })
      this.cerList[index].targetColNameDesc = temp[0].desc
      this.cerList[index].targetColType = temp[0].dataType
      this.totalSql = ''
    },
    // 编辑操作
    handleEdit() {
      if (this.multipleSelection.length === 0) {
        this.$message({
          message: '请选择要编辑的数据',
          type: 'warning'
        })
      } else if (this.multipleSelection.length > 1) {
        this.$message({
          message: '只能编辑一条',
          type: 'warning'
        })
      } else {
        this.opeartorStatus = 'edit'
        this.dialogTitle = '编辑'
        this.activePane = 'firstPane'
        this.secondPaneDisable = false
        this.thirdPaneDisable = false
        this.fourthPaneDisable = false
        var row = this.multipleSelection[0]
        var temp = JSON.parse(JSON.stringify(row))
        this.fetchCata()
        this.fetchTemplate(row.catalogId)
        this.firstForm = {
          cataId: temp.catalogId,
          templateId: temp.templateId
        }
        this.db_info = {
          dbType: temp.dbType,
          dbUrl: temp.dbUrl,
          dbUsername: temp.dbUsername,
          dbPassword: temp.dbPassword,
          databaseName: temp.dbSchema,
          dbTablename: temp.dbTablename,
          dbId: temp.dbId
        }
        this.totalSql = temp.dbSql
        this.collectionType = temp.collectionType
        this.collectionCycle = temp.collectionCycle
        this.collectionStartTime = temp.collectionStartTime
        this.collectionCycle = temp.collectionCycle
        this.collectionCheckType = temp.collectionCheckType
        getTableData({ dbId: temp.dbId }).then(res => {
          if (res.data.data.status) {
            this.cerList = res.data.data.data.CollectionTableRelationList
            this.conOption = res.data.data.data.tableList
          }
        })

        this.dialogVisible = true
      }
    },
    //  第一步到第二步保存
    nextSecond() {
      this.$refs['firstForm'].validate((valid) => {
        if (valid) {
          this.secondPaneDisable = false
          this.activePane = 'secondPane'
          this.fetchDbType()
        } else {
          this.$message({
            message: '请先完善信息',
            type: 'warning'
          })
        }
      })
    },
    // 第二步 到 第一步
    preFirst() {
      this.activePane = 'firstPane'
    },
    // 第二步到第三步 保存
    nextThird() {
      this.$validator.validateAll('collect').then(res => {
        if (res) {
          // 保存操作
          var obj = {
            catalogId: this.firstForm.cataId,
            templateId: this.firstForm.templateId,
            dbType: this.db_info.dbType,
            dbUrl: this.db_info.dbUrl,
            dbUsername: this.db_info.dbUsername,
            dbPassword: this.db_info.dbPassword,
            dbSchema: this.db_info.databaseName,
            dbTablename: this.db_info.dbTablename,
            dbId: this.db_info.dbId
          }
          collectionDbDataInsert(obj).then(res => {
            if (res.data.data.status) {
              this.dbId = res.data.data.data
              this.thirdPaneDisable = false
              this.activePane = 'thirdPane'
              this.fetchTableData()
            } else {
              this.$message({
                message: '连接不正确',
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
    // 第二步到第三步 下一步
    nextThirdStep() {
      this.$validator.validateAll('collect').then(res => {
        if (res) {
          this.thirdPaneDisable = false
          this.activePane = 'thirdPane'
        } else {
          this.$message({
            message: '请先完善信息',
            type: 'warning'
          })
        }
      })
    },
    // 测试连接操作
    testConnect() {
      var obj = {
        catalogId: this.firstForm.cataId,
        templateId: this.firstForm.templateId,
        dbType: this.db_info.dbType,
        dbUrl: this.db_info.dbUrl,
        dbUsername: this.db_info.dbUsername,
        dbPassword: this.db_info.dbPassword,
        dbSchema: this.db_info.databaseName,
        dbTablename: this.db_info.dbTablename,
        dbId: this.db_info.dbId
      }
      dbTest(obj).then(res => {
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
    // 生成sql 操作
    createSql() {
      this.$validator.validateAll().then(res => {
        if (res) {
          var tempList = []
          for (var i = 0; i < this.cerList.length; i++) {
            var extreList = this.conOption.filter(item => {
              return item.name === this.cerList[i].targetColName
            })
            var temp = {
              certificateTemplateId: this.cerList[i].certificateTemplateId,
              certificateTemplateName: this.cerList[i].certificateTemplateName,
              dbId: this.dbId,
              metadata: this.cerList[i].metadata,
              targetColName: this.cerList[i].targetColName,
              targetColNameDesc: extreList[0].desc
            }
            tempList.push(temp)
          }
          generateSql({ relationList: tempList }).then(res => {
            if (res.data.data.status) {
              this.totalSql = res.data.data.data
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
    // 第三步到第二步
    preSecond() {
      this.activePane = 'secondPane'
    },
    // 第三步到第四步
    nextFourth() {
      this.$validator.validateAll().then(res => {
        if (res) {
          if (this.totalSql) {
            var tempList = []
            for (var i = 0; i < this.cerList.length; i++) {
              var extreList = this.conOption.filter(item => {
                return item.name === this.cerList[i].targetColName
              })
              var temp = {
                certificateTemplateId: this.cerList[i].certificateTemplateId,
                certificateTemplateName: this.cerList[i].certificateTemplateName,
                certificateDataType: this.cerList[i].certificateDataType,
                dbId: this.dbId,
                metadata: this.cerList[i].metadata,
                targetColName: this.cerList[i].targetColName,
                targetColNameDesc: extreList[0].desc,
                targetColType: extreList[0].dataType,
                sql: this.totalSql
              }
              tempList.push(temp)
            }
            collectionTabelRelationInsert({ relationList: tempList }).then(res => {
              if (res.data.data.status) {
                this.activePane = 'fourthPane'
                this.fourthPaneDisable = false
              } else {
                this.$message({
                  message: res.data.data.message,
                  type: 'warning'
                })
              }
            })
          } else {
            this.$message({
              message: '请先生成sql',
              type: 'warning'
            })
          }
        } else {
          this.$message({
            message: '请先完善信息',
            type: 'warning'
          })
        }
      })
    },
    nextFourthStep() {
      this.$validator.validateAll().then(res => {
        if (res) {
          if (this.totalSql) {
            this.activePane = 'fourthPane'
            this.fourthPaneDisable = false
          } else {
            this.$message({
              message: '请先生成sql',
              type: 'warning'
            })
          }
        } else {
          this.$message({
            message: '请先完善信息',
            type: 'warning'
          })
        }
      })
    },
    // 最终保存
    handleSave(status) {
      if (this.collectionStartTime) {
        var obj = {
          collectionCheckType: this.collectionCheckType,
          collectionCycle: this.collectionCycle,
          collectionStartTime: this.collectionStartTime,
          collectionType: this.collectionType,
          dbId: this.dbId,
          ifStop: status
        }
        collectionConfigInsert(obj).then(res => {
          if (res.data.data.status) {
            this.$message({
              message: res.data.data.message,
              type: 'success'
            })
            this.fetchData()
            this.dialogVisible = false
          } else {
            this.$message({
              message: res.data.data.message,
              type: 'warning'
            })
          }
        })
      } else {
        this.$message({
          message: '请明确采集周期',
          type: 'warning'
        })
      }
    },
    // 启用和停用操作
    handleOperator(row, status) {
      var obj = {
        collectionId: row.collectionId,
        ifStop: status
      }
      collectionConfigInsert(obj).then(res => {
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
    },
    // 查看操作
    handleView(row) {
      this.opeartorStatus = 'view'
      this.dialogTitle = '查看'
      this.activePane = 'firstPane'
      this.secondPaneDisable = false
      this.thirdPaneDisable = false
      this.fourthPaneDisable = false
      var temp = JSON.parse(JSON.stringify(row))
      this.fetchCata()
      this.fetchTemplate(row.catalogId)
      this.firstForm = {
        cataId: temp.catalogId,
        templateId: temp.templateId
      }
      this.db_info = {
        dbType: temp.dbType,
        dbUrl: temp.dbUrl,
        dbUsername: temp.dbUsername,
        dbPassword: temp.dbPassword,
        databaseName: temp.dbSchema,
        dbTablename: temp.dbTablename,
        dbId: temp.dbId
      }
      this.totalSql = temp.dbSql
      this.collectionType = temp.collectionType
      this.collectionCycle = temp.collectionCycle
      this.collectionStartTime = temp.collectionStartTime
      this.collectionCycle = temp.collectionCycle
      this.collectionCheckType = temp.collectionCheckType
      getTableData({ dbId: temp.dbId }).then(res => {
        if (res.data.data.status) {
          this.cerList = res.data.data.data.CollectionTableRelationList
          this.conOption = res.data.data.data.tableList
        }
      })
      this.dialogVisible = true
    },
    // 采集一次操作
    handleRun(row) {
      implementCollection({ dbId: row.dbId }).then(res => {
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
    // 批量删除操作
    handleDelete() {
      if (this.multipleSelection.length === 0) {
        this.$message({
          message: '清先选择要删除的数据',
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
            temp.push(this.multipleSelection[i].dbId)
          }
          var val = temp.join(',')
          dbDatadeleteByPrimaryKey({ dbIds: val }).then(res => {
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
    // 搜索操作
    handleSearch() {
      this.listQuery.page = 1
      this.fetchData()
    }
  }
}
</script>
<style  scoped>
.el-input-group__prepend{
    width: 50%;
}
  .prependWidth{
    width:300px;
   overflow: hidden;
  text-overflow:ellipsis;
  white-space: nowrap;
  }
</style>
