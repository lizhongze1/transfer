<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.templateName" placeholder="请输入模板名称" style="width: 15%" clearable />
      <el-button v-waves type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
      <el-button v-show="insertShow" type="primary" icon="el-icon-plus" @click="onHandleCreate()">新增模板</el-button>
      <el-button v-show="isShowCheck" type="success" icon="el-icon-check" @click="onHandleSubmit()">提交</el-button>
    </div>
    <el-table
      :data="list"
      border
      stripe
      fit
      style="margin-top: 16px;"
    >
      <el-table-column label="序号" width="50" align="center" type="index" />
      <el-table-column label="模板名称" align="center">
        <template slot-scope="{row}">
          <!-- <span class="link-type" @click="onHandleView(row)">{{ row.templateName }}</span> -->
          <a class="link-type" @click="onHandleView(row)">{{ row.templateName }}</a>
        </template>
      </el-table-column>
      <el-table-column label="模板版本号" align="center">
        <template slot-scope="{row}">
          <span>{{ row.templateVersionNumber }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center">
        <template slot-scope="{row}">
          <span v-if="row.status == '1'">待提交</span>
          <span v-if="row.status == '2'">待审核</span>
          <span v-if="row.status == '3'">退回</span>
          <span v-if="row.status == '4'">已发布</span>
          <span v-if="row.status == '5'">停用</span>
          <span v-if="row.status == '6'">维护中</span>
        </template>
      </el-table-column>
      <el-table-column label="创建人员" align="center">
        <template slot-scope="{row}">
          <span>{{ row.empName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" align="center">
        <template slot-scope="{row}">
          <span>{{ row.createrTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="是否在用" align="center">
        <template slot-scope="{row}">
          <span v-if="row.templateStatus == '0'">否</span>
          <span v-if="row.templateStatus == '1'">是</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="200">
        <template slot-scope="{row}">
          <!-- <template> -->
          <!-- <el-button type="primary" size="mini" plain @click="onHandleView(row)">
              查看
            </el-button> -->
          <!-- </template> -->
          <template>
            <el-button :disabled="!(row.status == '1'||row.status == '3')" type="primary" size="mini" plain @click="onHandleEdit(row)">
              编辑
            </el-button>
            <el-button :disabled="!(row.status == '1'||row.status == '3')" type="danger" size="mini" plain @click="onHandleDelete(row.templateId)">
              删除
            </el-button>
          </template>

        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.rows" @pagination="fetchData" />

    <el-dialog :visible.sync="dialogVisible" :title="titleMap[dialogStatus]" :close-on-click-modal="false" :lock-scroll="false" width="60%" @close="fetchData()">
      <el-tabs v-model="activeName" type="border-card">
        <el-tab-pane label="基本信息" name="first">
          <el-form ref="basicInfo" class="form-main" label-position="top" :model="basicInfo" :rules="rules" :disabled="disabled">
            <el-row :gutter="64">
              <el-col :span="12">
                <el-form-item label="模板名称：" prop="templateName">
                  <el-input v-model.trim="basicInfo.templateName " label="模板名称" clearable />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="模板状态：" prop="templateStatus">
                  <el-radio-group v-model="basicInfo.templateStatus" @change="changeStatus">
                    <el-radio label="0">历史模板</el-radio>
                    <el-radio label="1">在用模板</el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="64">
              <el-col :span="12">
                <el-form-item v-if="basicInfo.templateStatus == '1'" label="开始使用期限：" prop="startingDate">
                  <el-date-picker
                    v-model="basicInfo.startingDate"
                    type="date"
                    placeholder="开始日期"
                    value-format="yyyy-MM-dd"
                    style="width: 100%"
                    @change="selectDate"
                  />
                </el-form-item>
                <el-form-item v-else label="历史使用期限：" prop="closingDate">
                  <el-date-picker
                    v-model="basicInfo.closingDate"
                    type="daterange"
                    range-separator="-"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    unlink-panels
                    value-format="yyyy-MM-dd"
                    style="width: 100%"
                    @change="selectDate"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="模板年份：" prop="templateYear">
                  <el-input v-model="basicInfo.templateYear" disabled />
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
          <template v-if="dialogStatus == 'edit' || dialogStatus == 'create'">
            <el-button type="primary" @click="saveBasic('basicInfo')">保存</el-button>
          </template>
        </el-tab-pane>

        <el-tab-pane label="照面信息" :disabled="zmDisabled" name="second">
          <div v-if="dialogStatus == 'edit' || dialogStatus == 'create'">
            <el-button type="primary" @click="addRow('2')">增加</el-button>
          </div>
          <el-table
            :data="encounterInfoList"
            border
            fit
            highlight-current-row
            style="margin: 16px 0; width: 100%;"
            max-height="500"
          >
            <el-table-column label="序号" align="center" type="index" width="50" />
            <el-table-column label="中文名" align="center">
              <template slot-scope="scope">
                <span v-if="dialogStatus == 'view'">{{ scope.row.certificateTemplateName }}</span>
                <el-input v-else v-model="scope.row.certificateTemplateName" />
              </template>
            </el-table-column>
            <el-table-column label="类别" align="center">
              <template slot-scope="scope">
                <span v-if="dialogStatus == 'view'">{{ scope.row.certificateDataType | certType }}</span>
                <el-select v-else v-model="scope.row.certificateDataType" placeholder="请选择类别" :disabled="scope.row.sort >= 7? false:true">
                  <el-option
                    v-for="item in CERTIFICATE_DATA_TYPE"
                    :key="item.VALUE"
                    :value="item.VALUE"
                    :label="item.TEXT"
                  />
                </el-select>
              </template>
            </el-table-column>
            <el-table-column label="必填" align="center">
              <template slot-scope="scope">
                <span v-if="dialogStatus == 'view'">{{ scope.row.ifMustFill | YN }}</span>
                <el-select v-else v-model="scope.row.ifMustFill" placeholder="请选择是否必填" :disabled="scope.row.sort >= 7? false:true">
                  <el-option
                    v-for="item in IF_MUST_FILL"
                    :key="item.VALUE"
                    :value="item.VALUE"
                    :label="item.TEXT"
                  />
                </el-select>
              </template>
            </el-table-column>
            <el-table-column label="长度" align="center">
              <template slot-scope="scope">
                <span v-if="dialogStatus == 'view'">{{ scope.row.certificateDataLength }}</span>
                <el-input v-else v-model="scope.row.certificateDataLength" :disabled="scope.row.sort >= 7? false:true" />
              </template>
            </el-table-column>
            <el-table-column label="选项字典" align="center">
              <template slot-scope="scope">
                <span v-if="dialogStatus === 'view'">{{ scope.row.optionDictionary }}</span>
                <el-input v-else v-model="scope.row.optionDictionary" placeholder="字典中间以，拼接" />
              </template>
            </el-table-column>
            <el-table-column v-if="dialogStatus !== 'view'" label="操作" align="center">
              <template slot-scope="scope">
                <el-button type="danger" size="mini" plain :disabled="scope.row.sort >= 7? false:true" @click="deleteData(scope.$index,scope.row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>

          <template v-if="dialogStatus == 'edit' || dialogStatus == 'create'">
            <el-button type="primary" @click="saveEncounter()">保存</el-button>
          </template>
        </el-tab-pane>

        <el-tab-pane label="底板图片" :disabled="dbDisabled" name="third">
          <template v-if="dialogStatus == 'edit' || dialogStatus == 'create'">
            <el-upload
              ref="uploadImg"
              class="upload-demo"
              action=""
              :auto-upload="false"
              :limit="fileLimit"
              :file-list="fileListImg"
            >
              <el-button slot="trigger" plain size="small" type="primary">选取文件</el-button>
              <!-- 新增时候 -->
              <el-button style="margin-left: 10px;" size="small" plain type="success" @click="submitUploadImg('add')">上传到服务器</el-button>
              <div slot="tip" class="el-upload__tip">只能上传png/jpg文件，且一次只能上传一个文件</div>
            </el-upload>
          </template>
          <el-table
            :data="bgList"
            border
            fit
            stripe
            style="margin: 16px 0;"
          >
            <el-table-column label="序号" type="index" align="center" width="50" />
            <el-table-column label="底板名称" align="center">
              <template slot-scope="scope">
                {{ scope.row.templateBackgroundName.slice(0,scope.row.templateBackgroundName.length-4) }}
              </template>
            </el-table-column>
            <el-table-column label="创建时间" align="center">
              <template slot-scope="scope">
                {{ scope.row.templateBackgroundTime }}
              </template>
            </el-table-column>
            <el-table-column label="上传者" align="center">
              <template slot-scope="scope">
                {{ scope.row.templateBackgroundUploader }}
              </template>
            </el-table-column>
            <el-table-column label="操作" align="center">
              <template slot-scope="scope">
                <el-button type="primary" plain size="mini" @click="viewBg(scope.row.templateBackgroundUrl)">查看</el-button>
                <el-button :disabled="dialogStatus === 'view'" type="danger" plain size="mini" @click="deleteBg(scope.row.id)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>

        <el-tab-pane label="版面信息" :disabled="bmDisabled" name="forth">
          <div>
            <template v-if="dialogStatus == 'edit' || dialogStatus == 'create'">
              <el-button v-show="tempList.length == 0 ?true:false" @click="onHandleCreateTemp()">新建版面</el-button>
            </template>
          </div>
          <el-table
            :key="Math.random()"
            :data="tempList"
            border
            fit
            stripe
            style="margin: 16px 0;"
          >
            <el-table-column label="序号" type="index" align="center" width="50" />
            <el-table-column label="版本号" align="center">
              <template slot-scope="scope">
                {{ scope.row.templateVersion }}
              </template>
            </el-table-column>
            <el-table-column label="创建时间" align="center">
              <template slot-scope="scope">
                {{ scope.row.templateCreateTime }}
              </template>
            </el-table-column>
            <el-table-column label="操作" align="center">
              <template v-if="dialogStatus == 'view'">
                <el-button type="primary" plain size="mini" @click="onHandleCreateTemp()">查看</el-button>
              </template>
              <template v-if="dialogStatus == 'edit' || dialogStatus == 'create'">
                <el-button type="primary" plain size="mini" @click="onHandleCreateTemp()">编辑</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-dialog>
  </div>
</template>
<script>
import Pagination from '@/components/Pagination'
import waves from '@/directive/waves' // waves directive
import { getTemplatePageData, catalogSub, deleteTemplateData, addTemplateData, getOriginalData, addCatalogCertificateInfoData, getModelInfo, delFaceToFaceData, getInUseData, getIfShowInsert, getCheckShowSub, getPageTemplatebackgroundInfo, backGroundUpload, deleteBackGround } from '@/api/licenseTemplate'
import { queryDictItemsByTypeCode } from '@/api/licenseCata'
import config from '@/../public/staticConfig'
export default {
  components: { Pagination },
  directives: { waves },
  filters: {
    // 是否
    YN(val) {
      if (val === 'Y') {
        return '是'
      } else {
        return '否'
      }
    },
    // 照面信息类别
    certType(val) {
      switch (val) {
        case '1':
          return '字符串'
        case '2':
          return '日期'
        case '3':
          return '图片'
        case '4':
          return '固值'
        case '5':
          return '文本区域'
        case '6':
          return '文本编辑'
        case '7':
          return '颁证单位'
        case '8':
          return '单选'
        case '9':
          return '多选'
        case '10':
          return '下拉选'
        case '11':
          return '大写余额'
        case '12':
          return '二维码'
        case '13':
          return '条形码'
        case '14':
          return '总分页数'
        case '15':
          return '当前页数'
        case '16':
          return '金额'
        default:
          return '字符串'
      }
    }
  },
  data() {
    return {
      list: null,
      encounterInfoList: null,
      total: 1,
      listQuery: {
        page: 1,
        rows: 10,
        templateName: '',
        catalogId: this.$route.query.catalogId
      },
      dialogVisible: false,
      tempVisible: false,
      titleMap: {
        edit: '编辑',
        create: '新增',
        view: '查看'
      },
      // 基本信息
      basicInfo: {
        catalogId: this.$route.query.catalogId,
        // 模版简称
        templateName: '',
        // 模板状态
        templateStatus: '',
        // 模板年份
        templateYear: '',
        // 开始使用期限
        startingDate: '',
        // 历史使用期限 传输用 字符串
        // closingDateFormat: '',
        // 历史使用期限
        closingDate: ''
      },
      // 照面信息
      encounterInfo: null,
      // 记录templateId
      TEMPLATE_ID: '',
      // 照面类别
      CERTIFICATE_DATA_TYPE: '',
      // 是否必填
      IF_MUST_FILL: [
        {
          TEXT: '是',
          VALUE: 'Y'
        }, {
          TEXT: '否',
          VALUE: 'N'
        }
      ],
      // 是否敏感
      IF_SENSITIVE: [
        {
          TEXT: '是',
          VALUE: 'Y'
        }, {
          TEXT: '否',
          VALUE: 'N'
        }
      ],
      GROUP_NUMBER: [],
      // 表单操作禁用 基本信息
      disabled: false,
      // 照面信息禁用
      encounterDisabled: false,
      // 记录操作 编辑 edit  查看 view
      dialogStatus: this.$route.query.dialogStatus,
      // 存储排序
      sort: '',
      active: 0,
      rules: {
        templateName: [
          { required: true, message: '请输入模板名称', trigger: 'blur' }
        ],
        templateStatus: [
          { required: true, message: '请选择模板状态', trigger: 'change' }
        ],
        startingDate: [
          { required: true, message: '请选择时间范围', trigger: 'change' }
        ],
        closingDate: [
          { required: true, message: '请选择时间范围', trigger: 'change' }
        ]
      },
      tempList: [],
      insertShow: '',
      activeName: 'first',
      zmDisabled: true,
      dbDisabled: true,
      bmDisabled: true,
      // 底板信息 backgroundList
      bgList: null,
      fileLimit: 1,
      // 图片列表
      fileListImg: [],
      // 是否显示提交按钮
      isShowCheck: false
    }
  },
  created() {
    this.fetchData()
  },
  mounted() {
    // 获取照面类别
    queryDictItemsByTypeCode({ typeCode: 'CERTIFICATE_DATA_TYPE' }).then(response => {
      response = response.data.data.data
      this.CERTIFICATE_DATA_TYPE = response
    })
    // 构造分组编号
    for (var i = 0; i < 20; i++) {
      this.GROUP_NUMBER.push({ VALUE: i })
    }
    // 判断新增模板是否显示
    getIfShowInsert({ catalogId: this.$route.query.catalogId }).then(res => {
      this.insertShow = res.data.data.data
    })
    // 判断是否有提交按钮
    this.getIfCheck()
  },
  methods: {
    getIfCheck() {
      // 判断是否显示提交按钮
      getCheckShowSub({ catalogId: this.$route.query.catalogId }).then(res => {
        if (res.data.data.data === 'N') {
          this.isShowCheck = false
        } else {
          this.isShowCheck = true
        }
      })
    },
    handleSearch() {
      this.listQuery.page = 1
      this.fetchData()
    },
    fetchData() {
      getTemplatePageData(this.listQuery).then(response => {
        response = response.data.data.data
        this.list = response.list
        this.total = parseInt(response.total)
      })
    },
    onHandleCreate() {
      this.dialogVisible = true
      this.dialogStatus = 'create'
      this.disabled = false
      this.zmDisabled = true
      this.dbDisabled = true
      this.bmDisabled = true
      this.activeName = 'first'
      this.active = 0
      this.resetBasic()
      this.$nextTick(() => {
        this.$refs['basicInfo'].clearValidate()
      })
    },
    resetBasic() {
      // 基本信息
      this.basicInfo = {
        catalogId: this.$route.query.catalogId,
        // 模版简称
        templateName: '',
        // 模板状态
        templateStatus: '',
        // 模板年份
        templateYear: '',
        // 开始使用期限
        startingDate: '',
        // 历史使用期限 传输用 字符串
        // closingDateFormat: '',
        // 历史使用期限
        closingDate: ''
      }
    },
    onHandleDelete(templateId) {
      this.$confirm('您确定删除吗', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'error'
      }).then(() => {
        deleteTemplateData({ templateId: templateId }).then(res => {
          if (res.data.data.status) {
            this.fetchData()
            this.$message({
              message: res.data.data.message,
              type: 'success'
            })
            this.getIfCheck()
          } else {
            this.$message({
              message: res.data.data.message,
              type: 'success'
            })
          }
        })
      }).catch(() => {
        this.$message({
          message: '已取消删除',
          type: 'info'
        })
      })
    },
    // 模板年份
    selectDate(date) {
      if (date) {
        if (typeof (date) === 'string') {
          this.basicInfo.templateYear = date.substring(0, 4)
        } else {
          this.basicInfo.templateYear = date[0].substring(0, 4)
          // this.basicInfo.closingDate = date.join(',')
        }
      } else {
        this.basicInfo.templateYear = ''
      }
    },
    // 存储基本信息
    saveBasic(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.basicInfo.closingDate.length !== 0) {
            this.basicInfo.closingDate = this.basicInfo.closingDate.join(',')
          }
          addTemplateData(this.basicInfo).then(response => {
            response = response.data.data
            if (response.status) {
              // 基本信息添加成功，接收templateId
              this.TEMPLATE_ID = response.data
              this.$message({
                message: response.message,
                type: 'success'
              })
              this.basicInfo.closingDate = this.basicInfo.closingDate.split(',')
              this.getEncounterInfo(this.TEMPLATE_ID)
              this.zmDisabled = false
              this.activeName = 'second'
              this.getIfCheck()
            } else {
              this.$message({
                message: response.message,
                type: 'error'
              })
            }
          }).catch(error => {
            console.log(error)
            this.$message({
              message: '失败',
              type: 'error'
            })
          })
        } else {
          return false
        }
      })
    },
    // 获取照面信息
    getEncounterInfo(templateId) {
      // 编辑、查看状态
      if (this.dialogStatus === 'edit' || this.dialogStatus === 'view') {
        getOriginalData({ templateId: this.TEMPLATE_ID, templateStatus: '2' }).then(response => {
          response = response.data.data.data
          for (var i = 0; i < response.length; i++) {
            response[i].templateId = templateId
            response[i].templateStatus = '2'
          }
          if (response.length === 0) {
            getOriginalData({ templateId: '', templateStatus: '1' }).then(response => {
              response = response.data.data.data
              for (var i = 0; i < response.length; i++) {
                delete response[i].certificateTemplateId
                response[i].templateId = templateId
                response[i].templateStatus = '2'
              }
              this.encounterInfoList = response
              this.sort = response.length
            })
          } else {
            this.encounterInfoList = response
            this.sort = response.length
          }
        })
      }
      // 新增状态 templateId为空 状态为2
      if (this.dialogStatus === 'create') {
        getOriginalData({ templateId: '', templateStatus: '1' }).then(response => {
          response = response.data.data.data
          for (var i = 0; i < response.length; i++) {
            delete response[i].certificateTemplateId
            response[i].templateId = templateId
            response[i].templateStatus = '2'
          }
          this.encounterInfoList = response
          this.sort = response.length
        })
      }
    },
    addRow(templateStatus) {
      var list = {
        templateStatus: templateStatus,
        templateId: this.TEMPLATE_ID,
        sort: this.sort++
      }
      this.encounterInfoList.push(list)
    },
    // 存储照面信息
    saveEncounter() {
      addCatalogCertificateInfoData({ cerTemlist: this.encounterInfoList }).then(res => {
        if (res.data.data.status === true) {
          this.$message({
            message: res.data.data.message,
            type: 'success'
          })
          this.dbDisabled = false
          this.activeName = 'third'
          this.getBgList()
        } else {
          this.$message({
            message: res.data.data.message,
            type: 'error'
          })
          return false
        }
      })
    },
    // 删除照面信息 明细信息
    deleteData(index, row) {
      this.encounterInfoList.splice(index, 1)
      if (row.certificateTemplateId) {
        delFaceToFaceData({ certificateTemplateId: row.certificateTemplateId }).then(response => {
          this.$message({
            message: response.data.data.data,
            type: 'success'
          })
        })
      }
    },
    onHandleEdit(row) {
      this.dialogVisible = true
      this.basicInfo = Object.assign({}, row)
      this.TEMPLATE_ID = row.templateId
      this.basicInfo.closingDate = this.basicInfo.closingDate.split(',')
      this.zmDisabled = false
      this.dbDisabled = false
      this.bmDisabled = false
      this.dialogStatus = 'edit'

      this.activeName = 'first'
      this.getEncounterInfo(this.TEMPLATE_ID)
      this.getTempList()
      this.getBgList()
    },
    onHandleView(row) {
      this.TEMPLATE_ID = row.templateId
      this.dialogVisible = true
      this.disabled = true
      this.basicInfo = Object.assign({}, row)
      this.basicInfo.closingDate = this.basicInfo.closingDate.split(',')
      this.dialogStatus = 'view'
      this.zmDisabled = false
      this.dbDisabled = false
      this.bmDisabled = false
      this.activeName = 'first'
      this.getEncounterInfo(this.TEMPLATE_ID)
      this.getBgList()
      this.getTempList()
    },
    onHandleCreateTemp() {
      localStorage.templateId = this.TEMPLATE_ID
      if (this.dialogStatus === 'view') {
        window.open(config.config.NGINXURL + '/certView.html')
      } else {
        window.open(config.config.NGINXURL + '/demo.html')
      }
    },
    // 获取底板信息
    getBgList() {
      getPageTemplatebackgroundInfo({ templateId: this.TEMPLATE_ID, page: 1, rows: 10 }).then(response => {
        response = response.data.data.data
        this.bgList = response.list
      })
    },
    // 填报文件上传 img
    submitUploadImg() {
      if (this.$refs.uploadImg.uploadFiles.length === 0) {
        this.$message({
          message: '请先选择要上传的文件',
          type: 'warning'
        })
      } else {
        var str = this.$refs.uploadImg.uploadFiles[0].name
        var index = str.lastIndexOf('.')
        str = str.substring(index + 1)
        if (!(str === 'png' || str === 'jpg')) {
          this.$message({
            message: '只能上传png或jpg类型的文件',
            type: 'warning'
          })
          this.$refs.uploadImg.clearFiles()
        } else {
          var formData = new FormData()
          formData.append('file', this.$refs.uploadImg.uploadFiles[0].raw)
          formData.append('templateId', this.TEMPLATE_ID)
          formData.append('templatebackName', this.$refs.uploadImg.uploadFiles[0].name)
          backGroundUpload(formData).then(response => {
            if (response.data.data.status === false) {
              this.$message({
                message: '上传失败',
                type: 'error'
              })
              this.$refs.uploadImg.clearFiles()
            } else {
              this.$message({
                message: response.data.data.data,
                type: 'success'
              })
              this.$refs.uploadImg.clearFiles()
              this.getBgList()
              this.bmDisabled = false
              this.activeName = 'forth'
              this.getTempList()
            }
          })
        }
      }
    },
    // 查看底板图片
    viewBg(url) {
      window.open(url)
    },
    // 删除底板图片
    deleteBg(id) {
      this.$confirm('您确定删除吗', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'error'
      }).then(() => {
        deleteBackGround({ id: id }).then(res => {
          this.getBgList()
          this.$message({
            message: res.data.data.data,
            type: 'success'
          })
        })
      }).catch(() => {
        this.$message({
          message: '已取消删除',
          type: 'info'
        })
      })
    },
    getTempList() {
      this.tempList.length = 0
      getModelInfo({ templateId: this.TEMPLATE_ID }).then(response => {
        response = response.data.data
        if (response.data) {
          this.tempList.length = 0
          this.tempList.push(response.data)
        }
      })
    },
    // 改变模板状态
    changeStatus(val) {
      getInUseData({ catalogId: this.$route.query.catalogId }).then(response => {
        response = response.data.data.data
        if (response === '1' && val === response) {
          this.$confirm(
            '已存在在用模板，是否替换', '提示'
          )
        }
      })
    },
    // 提交
    onHandleSubmit() {
      catalogSub({ catalogId: this.$route.query.catalogId, catalogStatus: '6' }).then(res => {
        if (res.data.data.status) {
          this.$message({
            message: res.data.data.data,
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
    }
  }
}
</script>
<style scoped>

</style>

