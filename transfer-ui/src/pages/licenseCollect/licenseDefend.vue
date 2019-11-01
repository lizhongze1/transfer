<!--
 * @Descripttion:
 * @Author: lip
 * @Date: 2019-08-06 10:15:03
 * @LastEditors: lip
 -->
<template>
  <div class="app-container">
    <div class="button-container">
      <el-input v-model="listQuery.globalSearch" clearable placeholder="请输入证照名称或证照编号" style="width:15%" />
      <el-select v-model="listQuery.MainStatus" placeholder="请选择状态" clearable style="width: 10%" class="filter-item">
        <el-option v-for="item in optionsState" :key="item.value" :label="item.label" :value="item.value" />
      </el-select>
      <el-date-picker
        v-model="listQuery.CreateTime"
        type="daterange"
        range-separator="——"
        start-placeholder="颁发日期"
        end-placeholder="颁发日期"
        format="yyyy-MM-dd"
        value-format="yyyy-MM-dd"
        clearable
        style="width:28%"
      />
      <el-button type="primary" size="small" icon="el-icon-search" @click="handleSearch">搜索</el-button>
      <el-button v-popover:popover5 type="success" size="small" icon="el-icon-document">年检</el-button>
      <el-button type="warning" size="small" class="filter-item" icon="el-icon-document" @click="changeLicence('C')">变更</el-button>
      <el-button type="warning" size="small" class="filter-item" icon="el-icon-plus" @click="revokeLicense">吊销</el-button>
      <el-button type="warning" size="small" icon="el-icon-back" class="filter-item" @click="retrieveData">取回</el-button>
      <el-button type="warning" size="small" icon="el-icon-sold-out" class="filter-item" @click="lossData">挂失</el-button>
      <el-popover
        ref="popover5"
        placement="bottom"
        trigger="hover"
        width="200"
      >
        <el-row>
          <el-col :span="24" align="center">
            <el-button type="text" @click="changeSeal()">加盖印章</el-button>
            <el-button type="text" @click="changeLicence('I')">换发新证</el-button>
          </el-col>
        </el-row>
      </el-popover>
    </div>
    <el-table
      ref="table"
      :data="list"
      border
      fit
      highlight-current-row
      stripe
      style="margin: 16px 0"
      :header-cell-style="rowClass"
      :header-cell-class-name="addClass"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" align="center" />
      <el-table-column label="序号" width="100" align="center" type="index" />
      <el-table-column label="证照名称" align="center">
        <template slot-scope="scope">
          <a class="link-type" @click="handleEdit(scope.row)">{{ scope.row.certificate_name }}</a>
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
      <el-table-column align="center" label="数据来源" width="100">
        <template slot-scope="scope">
          <span v-if="scope.row.sourceOfCertificate === '1'">采集</span>
          <span v-if="scope.row.sourceOfCertificate == '2'">填报</span>
          <span v-if="scope.row.sourceOfCertificate == '3'">导入</span>
          <span v-if="scope.row.sourceOfCertificate == '5'">补录</span>
        </template>
      </el-table-column>
      <el-table-column prop="certificate_status" align="center" width="100" label="状态">
        <template slot-scope="scope">
          <span v-if="scope.row.maintenance_status === '1'">有效</span>
          <span v-if="scope.row.maintenance_status === 'T'">废止</span>
          <span v-if="scope.row.maintenance_status === 'O'">已过期</span>
          <span v-if="scope.row.maintenance_status === 'I'">年检中</span>
          <span v-if="scope.row.maintenance_status === 'C'">变更中</span>
          <span v-if="scope.row.maintenance_status === 'R'">挂失</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding ">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="primary"
            plain
            @click="handleDowload(scope.$index, scope.row)"
          >下载</el-button>
          <template v-if="scope.row.maintenance_status==='C'||scope.row.maintenance_status==='I'" />
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.rows" @pagination="fetchData" />
    <!-- 吊销弹出框 -->
    <el-dialog
      :visible.sync="revokeVisible"
      title="吊销证照"
      :close-on-click-modal="false"
      width="60%"
    >
      <el-row>
        <el-form label-position="left" label-width="80px">
          <el-col :span="24">
            <el-form-item label="证照信息">
              <el-input v-model="revokeDialogData.certificate_name" :disabled="true" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="文件上传">
              <el-upload
                ref="upload"
                class="upload-demo"
                action=""
                :auto-upload="false"
                :limit="fileLimit"
                :file-list="revokeFileList"
              >
                <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
                <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload()">上传到服务器</el-button>
                <div slot="tip" class="el-upload__tip">只能上传一个文件</div>
              </el-upload>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="备注">
              <el-input
                v-model="remarks"
                type="textarea"
                clearable
                :rows="2"
                placeholder="请输入内容"
              />
            </el-form-item>
          </el-col>
        </el-form>
        <el-col>
          <el-button type="primary" size="small" @click="doRevoke">吊销</el-button>
          <el-button type="warning" size="small" @click="revokeVisible=false">取消</el-button>
        </el-col>
      </el-row>
    </el-dialog>
    <!-- 变更弹出框 -->
    <el-dialog
      :visible.sync="changeVisible"
      :title="dialogTitle"
      :close-on-click-modal="false"
      width="60%"
    >
      <el-row :gutter="65">
        <el-form label-position="top">
          <el-col :span="12">
            <el-form-item label="证照名称" class="is-required">
              <el-input v-model="changeLicenceData.certificate_name" v-validate="'required'" name="templateName" :disabled="true" />
              <span v-cloak v-show="errors.has('templateName')" class="el-form-item__error"> 请输入证照名称 </span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="版本号" class="is-required">
              <el-select v-cloak v-model="editionVal" v-validate="'required'" style="width:100%" clearable="" name="templateId" @change="selectTemplate(editionVal)">
                <el-option v-for="(item,index) in editionOption" :key="index" :label="item.templateYear+' V'+item.currentEdition" :value="item.templateId" />
              </el-select>
              <span v-cloak v-show="errors.has('templateId')" class="el-form-item__error"> 请选择版本号 </span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item v-cloak label="有效期" class="is-required">
              <el-select v-model="valVal" v-validate="'required'" clearable style="width:100%" name="termOfValidity" @change="getEndTime">
                <el-option v-for="(item,index) in valOption" :key="index" :label="item.label" :value="item.value" />
              </el-select>
              <span v-cloak v-show="errors.has('termOfValidity')" class="el-form-item__error"> 请选择有效期 </span>
            </el-form-item>
          </el-col>
          <el-col v-if="changeLicenceDataInfo && editionVal" class="my-tab-content">
            <el-tabs type="border-card">
              <el-tab-pane label="照面信息">
                <template v-if="changeLicenceDataInfo">
                  <template v-for="(item,index) in changeLicenceDataInfo">
                    <template v-if="item.certificateDataType==='3'">
                      <el-col :key="index" :span="12">
                        <el-form-item :label="item.label">
                          <el-upload
                            ref="uploadImg"
                            class="upload-demo"
                            action=""
                            :auto-upload="false"
                            :limit="fileLimit"
                            :file-list="fileListImg"
                          >
                            <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
                            <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUploadImg(index)">上传到服务器</el-button>
                            <div slot="tip" class="el-upload__tip">只能上传png/jpg文件，且一次只能上传一个文件</div>
                          </el-upload>
                        </el-form-item>
                      </el-col>
                    </template>

                    <template v-else-if="item.certificateDataType==='2'">
                      <template v-if="item.label==='有效期（起始）'">
                        <el-col :key="index" :span="12">
                          <el-form-item style="width:100%" class="is-required" :label="item.label">
                            <el-date-picker
                              v-cloak
                              ref="beginTime"
                              v-model="item.value"
                              v-validate="'required'"
                              type="date"
                              placeholder="选择时间"
                              format="yyyy-MM-dd"
                              style="width:100%"
                              value-format="yyyy-MM-dd"
                              :name="item.name"
                              @change="getEndTime"
                            />
                            <span v-show="errors.has(item.name)" v-cloak class="el-form-item__error"> 请输入{{ item.label }} </span>
                          </el-form-item>
                        </el-col>
                      </template>
                      <template v-else-if="item.label === '有效期（截止）'">
                        <el-col v-if="isShowEndTime" :key="index" :span="12">
                          <el-form-item style="width:100%" class="is-required" :label="item.label">
                            <el-date-picker
                              v-cloak
                              ref="endTime"
                              v-model="item.value"
                              v-validate="'required|date_format:yyyy-MM-dd|after:beginTime'"
                              type="date"
                              placeholder="选择时间"
                              format="yyyy-MM-dd"
                              style="width:100%"
                              value-format="yyyy-MM-dd"
                              name="endTime"
                            />
                            <span v-show="errors.has('endTime')" v-cloak class="el-form-item__error"> {{ errors.first('endTime') }}</span>
                          </el-form-item>
                        </el-col>
                      </template>
                      <template v-else="">
                        <el-col :key="index" :span="12">
                          <el-form-item style="width:100%" class="is-required" :label="item.label">
                            <el-date-picker
                              v-cloak
                              v-model="item.value"
                              v-validate="'required'"
                              format="yyyy-MM-dd"
                              type="date"
                              placeholder="选择时间"
                              style="width:100%"
                              value-format="yyyy-MM-dd"
                              :name="item.name"
                            />
                            <span v-show="errors.has(item.name)" v-cloak class="el-form-item__error"> 请选择{{ item.label }} </span>
                          </el-form-item>
                        </el-col>
                      </template>
                    </template>

                    <template v-else-if="item.certificate_status === '10'">
                      <el-col :key="index" :span="12">
                        <el-form-item style="width:100%" :label="item.label" class="is-required">
                          <el-select v-cloak v-model="item.value" v-validate="'required'" style="width:100%" :name="item.name">
                            <el-option v-for="(item2,index2) in item.option" :key="index2" :label="item2.label" :value="item2.value" />
                          </el-select>
                          <span v-show="errors.has(item.name)" class="el-form-item__error"> 请选择{{ item.label }} </span>
                        </el-form-item>
                      </el-col>
                    </template>
                    <template v-else="">
                      <template v-if="item.label === '证件号码'&&holdType==='个人'">
                        <el-col :key="index" :span="12">
                          <el-form-item class="is-required" :label="item.label">
                            <el-input v-model="item.value" v-validate="'required|IDCard'" :maxlength="item.length" show-word-limit :name="item.name" clearable />
                            <span v-if="errors.has(item.name)" v-cloak class="el-form-item__error"> 请填写正确的证件信息 </span>
                          </el-form-item>
                        </el-col>
                      </template>
                      <template v-else-if="item.label === '证件号码'&& holdType==='法人'">
                        <el-col :key="index" :span="12">
                          <el-form-item class="is-required" :label="item.label">
                            <el-input v-model="item.value" v-validate="'required|SocCard'" :maxlength="item.length" show-word-limit :name="item.name" clearable />
                            <span v-show="errors.has(item.name)" v-cloak class="el-form-item__error"> 请填写正确的社会统一信用代码 </span>
                          </el-form-item>
                        </el-col>
                      </template>
                      <template v-else-if="item.label === '颁证单位'">
                        <el-col :key="index" :span="12">
                          <el-form-item :label="item.label" class="is-required">
                            <el-input v-model="firstVal" v-validate="'required'" :disabled="true" :name="item.name" clearable />
                            <span v-show="errors.has(item.name)" :name="item.name" class="el-form-item__error"> 请输入{{ item.label }} </span>
                          </el-form-item>
                        </el-col>
                      </template>
                      <template v-else-if="item.metadata === '2'">
                        <el-col :key="index" :span="12">
                          <el-form-item :label="item.label" class="is-required">
                            <el-input v-model="secondVal" v-validate="'required'" :disabled="true" :name="item.name" clearable />
                            <span v-show="errors.has(item.name)" :name="item.name" class="el-form-item__error"> 请输入{{ item.label }} </span>
                          </el-form-item>
                        </el-col>
                      </template>
                      <template v-else="">
                        <el-col :key="index" :span="12">
                          <el-form-item :label="item.label" class="is-required">
                            <el-input v-model="item.value" v-validate="'required'" :maxlength="item.length" show-word-limit :name="item.name" clearable />
                            <span v-show="errors.has(item.name)" :name="item.name" class="el-form-item__error"> 请输入{{ item.label }} </span>
                          </el-form-item>
                        </el-col>
                      </template>

                    </template>
                  </template>
                </template>
                <el-col :span="24">

                  <el-form-item v-if="changeLicenceData.fileId !=='[]'">
                    <el-upload
                      ref="uploadPdf"
                      class="upload-demo"
                      action=""
                      :auto-upload="false"
                      :file-list="fileList"
                      :multiple="true"
                    >
                      <label class="el-form-item__label" style="float:left"> 附件上传</label>
                      <el-button slot="trigger" style="margin-left: 10px;" type="text">选取文件</el-button>
                      <el-button style="margin-left: 10px;" type="text" @click="submitUploadPdf">上传</el-button>
                    </el-upload>
                  </el-form-item>

                </el-col>
              </el-tab-pane>
            </el-tabs>
          </el-col>

          <el-col style="margin-top:20px">
            <template v-if="dialogTitle ==='证照变更'">
              <el-button type="primary" size="small" @click="templateSave('C')">
                保存
              </el-button>
            </template>
            <template v-if="dialogTitle ==='换发新证'">
              <el-button type="primary" size="small" @click="templateSave('I')">
                保存
              </el-button>
            </template>
            <el-button type="warning" size="small" @click="changeVisible=false">
              取消
            </el-button>
          </el-col>
        </el-form>
      </el-row>
    </el-dialog>
  </div>
</template>
<script>
import Pagination from '@/components/Pagination'
import { getPageData, retrieve, fastDFSUpload, readerLicence, toVoid, recertification, getIsYear, getTemplateBasicDataByCatalogId, selectByPrimaryKey, getCatalogCertificateTemplateInfo, fastDFSFilesUpload, reportLoss } from '@/api/licenseDefend'
import config from '@/../public/staticConfig'
import request from '@/utils/request'
export default {
  components: {
    Pagination
  },
  data() {
    return {
      // 变更年检标题控制
      dialogTitle: '',
      // 控制证照变更是否显示
      changeVisible: false,
      total: 0,
      listQuery: {
        page: 1,
        rows: 10,
        MainStatus: '',
        CreateTime: '',
        certificateTypeName: '',
        certificateHolder: '',
        globalSearch: ''
      },
      // 变更时数据
      changeLicenceData: {},
      changeLicenceDataInfo: [],
      optionsState: [
        {
          label: '有效',
          value: '1'
        },
        {
          label: '废止',
          value: 'T'
        },
        {
          label: '已过期',
          value: 'O'
        },
        {
          label: '年检中',
          value: 'I'
        },
        {
          label: '变更中',
          value: 'C'
        },
        {
          label: '挂失',
          value: 'R'
        }

      ],
      // 展示时候用到的list
      list: [],
      multipleSelection: '',
      // 是否显示吊销弹出框
      revokeVisible: false,
      // 吊销弹框
      revokeDialogData: '',
      // 上传限制
      fileLimit: 1,
      fileList: [],
      fileListImg: [],
      // 储存上传文件的id
      fileId: '',
      // 备注信息
      remarks: '',
      // 是否需要年检
      isYear: false,
      // 版本号的值
      editionVal: '',
      // 版本号option
      editionOption: [],
      // 有效期option
      valOption: [],
      // 有效期
      valVal: '',
      // 是否显示过期时间截止
      isShowEndTime: false,
      // 获取持证主体的类型
      holdType: '',
      // 颁证单位的值
      firstVal: '',
      // 证照编号的值
      secondVal: '',
      // 吊销文件列表
      revokeFileList: []
    }
  },
  mounted() {
    this.fetchData()
  },
  methods: {
    // 修改样式
    rowClass({ row, column, rowIndex, columnIndex }) {
      if (rowIndex === 0 && columnIndex === 0) { // 指定坐标
        return '.cell{display:none}'
      } else {
        return ''
      }
    },
    fetchData() {
      if (Array.isArray(this.listQuery.CreateTime)) {
        this.listQuery.CreateTime = this.listQuery.CreateTime.join(',')
      }
      getPageData(this.listQuery).then(response => {
        this.total = response.data.data.data.total
        this.list = response.data.data.data.list
        if (this.listQuery.CreateTime) {
          this.listQuery.CreateTime = this.listQuery.CreateTime.split(',')
        }
      })
    },
    // 获取版本号
    getEdition(id) {
      // 获取 版本号
      this.editionVal = ''
      getTemplateBasicDataByCatalogId({ catalogId: id }).then(response => {
        this.editionOption = response.data.data.data
      })
    },
    // 搜索操作
    handleSearch() {
      this.listQuery.page = 1
      if (this.listQuery.CreateTime !== null && this.listQuery.CreateTime.length > 0) {
        this.listQuery.CreateTime = this.listQuery.CreateTime.join(',')
      }
      this.fetchData()
    },
    // 时间戳转化为日期参数
    timestampToTime(timestamp) {
      var date = new Date(timestamp)// 时间戳为10位需*1000，时间戳为13位的话不需乘1000
      var Y = date.getFullYear() + '-'
      var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-'
      var D = date.getDate()
      return Y + M + D
    },
    // 查看
    handleEdit(row) {
      readerLicence({ certificateId: row.electroniId }).then(response => {
        if (response.data.code === '200') {
          localStorage.setItem('openPath', response.data.data)
          var url = config.config.NGINXURL + '/skView.html'
          setTimeout(() => {
            window.open(url, '_blank')
          }, 1000)
          // window.open(response.data.data, '_blank')
        } else {
          this.$message({
            message: '操作失败',
            type: 'warning'
          })
        }
      })
    },
    // 单选
    handleSelectionChange(val) {
      this.multipleSelection = val
      if (val.length > 1) {
        this.$refs.table.clearSelection()
        this.$refs.table.toggleRowSelection(val.pop())
      } else {
        //
      }
    },
    // 吊销
    revokeLicense() {
      this.remarks = ''
      if (!this.multipleSelection) {
        this.$message({
          message: '请先勾选相应的数据',
          type: 'warning'
        })
      } else if (this.multipleSelection.length > 1) {
        this.$message({
          message: '只能选择一个进行操作',
          type: 'warning'
        })
      } else if (this.multipleSelection[0].maintenance_status !== '1') {
        this.$message({
          message: '只有正常状态证照才可吊销',
          type: 'warning'
        })
      } else {
        this.revokeFileList = []
        this.revokeDialogData = this.multipleSelection[0]
        this.revokeVisible = true
      }
    },
    // 执行吊销操作
    doRevoke() {
      var obj = {
        licence_id: this.multipleSelection[0].id,
        electroniId: this.multipleSelection[0].electroniId,
        fileId: this.fileId,
        remarks: this.re
      }
      toVoid(obj).then(response => {
        if (response.data.data.status) {
          this.$message({
            message: response.data.data.data,
            type: 'success'
          })
          this.revokeVisible = false
          this.fetchData()
        } else {
          this.$message({
            message: response.data.data.message,
            type: 'warning'
          })
        }
      })
    },
    // 取回操作
    retrieveData() {
      if (this.multipleSelection.length === 0) {
        this.$message({
          message: '请选择要取回的证照',
          type: 'warning'
        })
      } else if (!(this.multipleSelection[0].maintenance_status === 'C' || this.multipleSelection[0].maintenance_status === 'I')) {
        this.$message({
          message: '当前状态不支持取回',
          type: 'warning'
        })
      } else {
        retrieve({ licenceId: this.multipleSelection[0].id }).then(response => {
          if (response.data.data.status) {
            this.$message({
              message: response.data.data.data,
              type: 'success'
            })
            this.fetchData()
          } else {
            this.$message({
              message: response.data.data.data,
              type: 'warning'
            })
          }
        })
      }
    },
    // 上传操作
    submitUpload() {
      var formData = new FormData()
      formData.append('file', this.$refs.upload.uploadFiles[0].raw)
      fastDFSUpload(formData).then(response => {
        if (response.data.data.status === false) {
          this.$message({
            message: '上传失败',
            type: 'error'
          })
          this.$refs.upload.clearFiles()
        } else {
          this.$message({
            message: '上传成功',
            type: 'success'
          })
          this.fileId = response.data.data.data.FILE_ID
          // this.$refs.upload.clearFiles()
        }
      })
    },
    // 获取有效期
    getValData(catalogId, val) {
      selectByPrimaryKey({ catalogId: catalogId }).then(res => {
        var arr = res.data.data.data.termOfValidity
        arr = arr.split(',')
        this.valOption = []
        for (var i = 0; i < arr.length; i++) {
          var obj = {
            label: this.timeFormate1(arr[i]),
            value: arr[i]
          }
          this.valOption.push(obj)
          val = val.slice(0, 1) + '/' + val.slice(2)
          this.valVal = val
        }
      })
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
    selectTemplate(id) {
      this.changeLicenceDataInfo = {}
      if (this.editionVal === '') {
        this.changeLicenceDataInfo = {}
      } else {
        getCatalogCertificateTemplateInfo({ templateId: id, catalogId: this.multipleSelection[0].catalog_id }).then(res => {
          this.holdType = res.data.data.data.certificateHolderTypeCode
          this.errors.clear()
          this.$nextTick(() => {
            this.changeLicenceDataInfo = JSON.parse(JSON.stringify(res.data.data.data.certificate_info))
          })
        })
      }
    },
    // 证照变更 和 年检
    changeLicence(status) {
      this.fileList = []
      this.fileListImg = []
      // this.isShowEndTime = true
      if (status === 'C') {
        this.dialogTitle = '证照变更'
        if (this.multipleSelection.length !== 0) {
          if (this.multipleSelection.length > 1) {
            this.$message({
              message: '只能选择一个进行操作',
              type: 'warning'
            })
          } else if (this.multipleSelection[0].maintenance_status !== '1') {
            this.$message({
              message: '证照当前状态不支持变更',
              type: 'warning'
            })
          } else {
            this.errors.clear()
            this.changeVisible = true
            this.changeLicenceData = this.multipleSelection[0]
            if (this.changeLicenceData.termOfValidity !== '0,L') {
              this.isShowEndTime = true
            } else {
              this.isShowEndTime = false
            }
            this.getEdition(this.multipleSelection[0].catalog_id)
            // 获取有效期option
            this.getValData(this.multipleSelection[0].catalog_id, this.multipleSelection[0].termOfValidity)
            this.editionVal = this.multipleSelection[0].templateBasicData
            // 需要遍历的信息
            this.changeLicenceDataInfo = JSON.parse(JSON.stringify(this.multipleSelection[0].certificate_info))
            for (var i = 0; i < this.changeLicenceDataInfo.length; i++) {
              if (this.changeLicenceDataInfo[i].label === '颁证单位') {
                this.firstVal = this.changeLicenceDataInfo[i].value
              }
              if (this.changeLicenceDataInfo[i].metadata === '2') {
                this.secondVal = this.changeLicenceDataInfo[i].value
              }
            }
          }
        } else {
          this.$message({
            message: '请先勾选相应的数据',
            type: 'warning'
          })
        }
      } else {
        if (this.multipleSelection.length === 0) {
          this.$message({
            message: '请先勾选相应的证照',
            type: 'warning'
          })
        } else {
          getIsYear({ catalog_id: this.multipleSelection[0].catalog_id }).then(response => {
            if (response.data.data.status === false) {
              this.isYear = false
            } else {
              this.isYear = true
            }
          }).then(() => {
            if (!this.isYear) {
              this.$message({
                message: '当前证照不支持年检',
                type: 'warning'
              })
            } else if (this.multipleSelection[0].maintenance_status !== '1') {
              this.$message({
                message: '证照当前状态不支持年检',
                type: 'warning'
              })
            } else {
              this.dialogTitle = '换发新证'
              this.changeVisible = true
              this.changeLicenceData = this.multipleSelection[0]
              if (this.changeLicenceData.termOfValidity !== '0,L') {
                this.isShowEndTime = true
              } else {
                this.isShowEndTime = false
              }
              this.getEdition(this.multipleSelection[0].catalog_id)
              // 获取有效期option
              this.getValData(this.multipleSelection[0].catalog_id, this.multipleSelection[0].termOfValidity)
              this.editionVal = this.multipleSelection[0].templateBasicData
              // 需要遍历的信息
              this.changeLicenceDataInfo = this.multipleSelection[0].certificate_info
              for (var i = 0; i < this.changeLicenceDataInfo.length; i++) {
                if (this.changeLicenceDataInfo[i].label === '颁证单位') {
                  this.firstVal = this.changeLicenceDataInfo[i].value
                }
                if (this.changeLicenceDataInfo[i].metadata === '2') {
                  this.secondVal = this.changeLicenceDataInfo[i].value
                }
              }
            }
          })
        }
      }
    },
    // 加盖印章
    changeSeal() {
      if (this.multipleSelection.length === 0) {
        this.$message({
          message: '请先勾选相应的证照',
          type: 'warning'
        })
      } else {
        getIsYear({ catalog_id: this.multipleSelection[0].catalog_id }).then(response => {
          if (response.data.data.status === false) {
            this.isYear = false
          } else {
            this.isYear = true
          }
        }).then(() => {
          if (!this.isYear) {
            this.$message({
              message: '当前证照不支持年检',
              type: 'warning'
            })
          } else if (this.multipleSelection[0].maintenance_status !== '1') {
            this.$message({
              message: '证照当前状态不支持年检',
              type: 'warning'
            })
          } else {
            recertification({ UlicenceId: this.multipleSelection[0].electroniId, licenceId: this.multipleSelection[0].id }).then(response => {
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
          }
        })
      }
    },
    // 填报文件上传 img
    // 上传数组索引用来更改其值
    submitUploadImg(arrIndex) {
      if (this.$refs.uploadImg[0].uploadFiles.length === 0) {
        this.$message({
          message: '请先选择要上传的文件',
          type: 'warning'
        })
      } else {
        var str = this.$refs.uploadImg[0].uploadFiles[0].name
        var index = str.lastIndexOf('.')
        str = str.substring(index + 1)
        if (!(str === 'png' || str === 'jpg')) {
          this.$message({
            message: '只能上传png或jpg类型的文件',
            type: 'warning'
          })
          this.$refs.uploadImg[0].clearFiles()
        } else {
          var formData = new FormData()
          formData.append('file', this.$refs.uploadImg[0].uploadFiles[0].raw)
          fastDFSUpload(formData).then(response => {
            if (response.data.data.status === false) {
              this.$message({
                message: '上传失败',
                type: 'error'
              })
              this.$refs.uploadImg[0].clearFiles()
            } else {
              this.$message({
                message: '上传成功',
                type: 'success'
              })

              this.editTemplateData.certificate_info[arrIndex].value = response.data.data.data.OPEN_FILE_URL
              // this.$refs.uploadImg[0].clearFiles()
            }
          })
        }
      }
    },
    // 变更和年检的保存
    templateSave(status) {
      this.$validator.validate().then(res => {
        if (res) {
          this.changeLicenceData.certificate_info = this.changeLicenceDataInfo
          var licenceId = this.changeLicenceData.id
          var maintena_status = status
          var url = config.config.BASE_URL + '/licenceMaintenlApi/inspectAnnually?licenceId=' + licenceId + '&maintena_status=' + maintena_status
          request.postJson(url, this.changeLicenceData).then(response => {
            if (response.data.data.status) {
              this.$message({
                message: response.data.data.data,
                type: 'success'
              })
              this.changeVisible = false
              this.fetchData()
            } else {
              this.$message({
                message: response.data.data.message,
                type: 'warning'
              })
            }
          })
        } else {
          this.$message({
            message: '请先完善信息再保存',
            type: 'warning'
          })
        }
      })
    },
    // 下载操作
    handleDowload(index, row) {
      window.open(config.config.BASE_URL + '/licenceUtils/downLoadLicence?certificateId=' + row.electroniId, '_blank')
    },
    // 填报文件上传 pdf
    submitUploadPdf() {
      if (this.$refs.uploadPdf.uploadFiles.length === 0) {
        this.$message({
          message: '请先选择要上传的文件',
          type: 'warning'
        })
      } else {
        var str = this.$refs.uploadPdf.uploadFiles[0].name
        var index = str.lastIndexOf('.')
        str = str.substring(index + 1)
        var formData = new FormData()
        for (var i = 0; i < this.$refs.uploadPdf.uploadFiles.length; i++) {
          formData.append('multipartFiles', this.$refs.uploadPdf.uploadFiles[i].raw)
        }
        fastDFSFilesUpload(formData).then(response => {
          if (response.data.data.status === true) {
            this.$message({
              message: '上传成功',
              type: 'success'
            })
            // this.$refs.uploadPdf.clearFiles()
            this.uploadFileSrc = response.data.data.data
          } else {
            this.$message({
              message: '上传失败',
              type: 'error'
            })
            this.$refs.uploadPdf.clearFiles()
          }
        })
      }
    },
    // 有效期 截止 获取
    getEndTime() {
      var val = this.$refs.beginTime[0].value
      if (this.valVal === '0/L') {
        this.isShowEndTime = false
      } else {
        this.isShowEndTime = true
      }
      var arr = this.valVal.split('/')
      var date = new Date(val)
      var temp = this.DateAdd(arr[1], Number(arr[0]), date)
      for (var i = 0; i < this.changeLicenceDataInfo.length; i++) {
        if (this.changeLicenceDataInfo[i].label === '有效期（截止）') {
          this.changeLicenceDataInfo[i].value = temp
        }
      }
    },
    DateAdd(interval, number, date) {
      switch (interval) {
        case 'Y':
          date.setFullYear(date.getFullYear() + number)
          break

        case 'M':
          date.setMonth(date.getMonth() + number)
          break
        case 'D':
          date.setDate(date.getDate() + number)
          break
      }
      return this.formatDate(date)
    },
    formatDate(date) {
      var myyear = date.getFullYear()
      var mymonth = date.getMonth() + 1
      var myweekday = date.getDate()

      if (mymonth < 10) {
        mymonth = '0' + mymonth
      }
      if (myweekday < 10) {
        myweekday = '0' + myweekday
      }
      return (myyear + '-' + mymonth + '-' + myweekday)
    },
    // 为el-table 添加class 类名
    addClass({ row, column, rowIndex, columnIndex }) {
      if (rowIndex === 0 && columnIndex === 0) {
        return 'cellClass'
      }
    },
    // 挂失 TODO
    lossData() {
      if (this.multipleSelection.length === 0) {
        this.$message({
          message: '请选择要挂失的证照',
          type: 'warning'
        })
      } else {
        reportLoss({ id: this.multipleSelection[0].id }).then(res => {
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
}
</script>

<style scoped>
.my-tab-content .el-col-12:nth-child(odd){
  padding-left: 0 !important
}
.my-tab-content .el-col-24{
  padding-left: 0 !important;
  padding-right: 0 !important
}
.my-tab-content .el-col-12:nth-child(even){
  padding-right: 0 !important
}
</style>
<style >
  .cellClass{
    background: #ff0
  }
  .cellClass .cell{
    display: none !important
  }
</style>
