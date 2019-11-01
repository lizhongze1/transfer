<!--
 * @Descripttion:
 * @Author: lip
 * @Date: 2019-08-02 19:34:14
 * @LastEditors: lip
 * @LastEditTime: 2019-08-27 09:12:01
 -->
<template>
  <el-col class="app-container">
    <div class="titleButton">
      <div class="filter-container">
        <el-input v-model="listQuery.globalSearch" clearable placeholder="请输入证照名称或证照编号" style="width: 18%" />
        <el-select v-model="listQuery.dataStatus" placeholder="请选择状态" clearable style="width: 15%" class="filter-item">
          <el-option v-for="item in optionsState" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
        <el-select v-model="listQuery.sourceOfCertificate" placeholder="请选择来源" clearable style="width: 15%" class="filter-item">
          <el-option v-for="item in optionsSource" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
        <el-button type="primary" icon="el-icon-search" size="small" @click="searchData">搜索</el-button>
        <el-button v-popover:popover5 type="primary" class="filter-item" size="small" icon="el-icon-document">数据归集</el-button>
        <el-button type="primary" class="filter-item" size="small" icon="el-icon-back" @click="fetchBack">取回</el-button>
        <el-button type="success" class="filter-item" size="small" icon="el-icon-check" @click="submitLicence">提交</el-button>
        <el-button type="danger" class="filter-item" size="small" icon="el-icon-minus" @click="delLicence">删除</el-button>
        <el-popover
          ref="popover5"
          placement="bottom"
          trigger="hover"
          width="200"
        >
          <el-row>
            <el-col :span="24" align="center">
              <el-button type="text" @click="fillTemplate">填报</el-button>
              <el-button type="text" @click="importData">导入数据</el-button>
            </el-col>
          </el-row>
        </el-popover>
      </div>
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
      <el-table-column type="selection" align="center" />
      <el-table-column label="序号" width="50" align="center" type="index" />
      <el-table-column label="证照名称" align="center">
        <template slot-scope="scope">
          <a class="link-type" @click="viewTemplate(scope.row)">{{ scope.row.certificate_name }}</a>
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
          <span v-if="scope.row.certificate_status == 'S'">待提交</span>
          <span v-if="scope.row.certificate_status == 'P'">待审核</span>
          <span v-if="scope.row.certificate_status == 'R'">退回</span>
          <span v-if="scope.row.certificate_status == 'W'">签章中</span>
          <span v-if="scope.row.certificate_status == 'D'">待签章</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="200" class-name="small-padding ">
        <template slot-scope="{row}">
          <template v-if="row.certificate_status == 'S'|| row.certificate_status == 'R' ">
            <el-button type="primary" size="mini" plain @click="editTemplate(row)"> 修改 </el-button>
          </template>
          <el-button type="primary" size="mini" plain @click="onHandlePreview(row)"> 证照预览 </el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.rows" @pagination="fetchData" />
    <!-- 点击查看弹出框 -->
    <el-dialog
      title="查看模板"
      :visible.sync="viewDialogVisible"
      :close-on-click-modal="false"
    >
      <el-row :gutter="65">
        <el-form :model="viewTemplateList" label-position="top">
          <el-col :span="24" align="right">
            <el-button size="small" type="primary" @click="previewTemplate(viewTemplateList.templateBasicData)">预览模板</el-button>
          </el-col>
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
                <el-form-item v-if="item.value" :label="item.label">
                  <div style="color:#409eff;width:100%;overflow: hidden;cursor:pointer;text-overflow: ellipsis;white-space: nowrap;" :title="item.value.FILE_NAME" @click="downloadFile(item.value.OPEN_FILE_URL)">{{ item.value.FILE_NAME }}</div>
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
    <!-- 导入数据弹出框 -->
    <el-dialog
      title="导入数据"
      :visible.sync="importDataDialogVisible"
      :close-on-click-modal="false"
    >
      <el-row :gutter="65">
        <el-form :inline="true" label-position="top">
          <el-col :span="12">
            <el-form-item label="模板名称" class="is-required" style="width:100%">
              <el-select v-model="selectIdVal" style="width:100%" placeholder="请选择证照" @change="getEdition(selectIdVal)">
                <el-option v-for="(item,index) in selectIdOption" :key="index" :label="item.certificateName" :value="item.catalogId" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item style="width:100%">
              <label>版本号</label>
              <el-select v-model="editionVal" style="width:100%">
                <el-option v-for="(item,index) in editionOption" :key="index" :label="item.currentEdition" :value="item.templateId" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-button type="primary" size="small" @click="templateDownload">模板下载</el-button>
          </el-col>
          <el-col :span="12">
            <el-upload
              ref="upload"
              class="upload-demo"
              action=""
              accept="xlsx"
              :auto-upload="false"
              :limit="fileLimit"
            >
              <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
              <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload">导入数据</el-button>
              <div slot="tip" class="el-upload__tip">导入数据过程受数据量影响,此过程可能较慢,请耐心等待</div>
              <div slot="tip" class="el-upload__tip">只能上传Excel文件，且一次只能上传一个文件</div>
            </el-upload>
          </el-col>
        </el-form>
      </el-row>
    </el-dialog>
    <!-- 填报（新增）弹出框  -->
    <el-dialog
      title="模板填报"
      :visible.sync="addDialogVisible"
      :close-on-click-modal="false"
      width="60%"
    >
      <el-row :gutter="65">
        <el-form label-position="top">
          <el-col :span="24" align="right">
            <el-button type="primary" size="small" @click="previewTemplate(addEditionVal)">模板预览</el-button>
          </el-col>
          <el-col :span="12">
            <el-form-item label="证照模板" class="is-required">
              <el-select v-model="addSelectIdVal" v-validate="'required'" filterable data-vv-scope="add" style="width:100%" placeholder="请选择证照" name="catalogId" @change="getAddEdition(addSelectIdVal)">
                <el-option v-for="(item,index) in addSelectIdOption" :key="index" :label="item.certificateName" :value="item.catalogId" />
              </el-select>
              <span v-if="errors.has('add.catalogId')" v-cloak class="el-form-item__error"> 请选择证照模板 </span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="版本号" class="is-required">
              <el-select v-model="addEditionVal" v-validate="'required'" data-vv-scope="add" style="width:100%" name="templateId" @change="selectTemplate(addEditionVal,'add')">
                <el-option v-for="(item,index) in addEditionOption" :key="index" :label="item.templateYear+' V'+item.currentEdition" :value="item.templateId" />
              </el-select>
              <span v-if="errors.has('add.templateId')" v-cloak class="el-form-item__error"> 请选择版本号 </span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="有效期" class="is-required">
              <el-select v-model="valVal" v-validate="'required'" data-vv-scope="add" style="width:100%" name="termOfValidity" @change="getEndTime">
                <el-option v-for="(item,index) in valOption" :key="index" :label="item.label" :value="item.value" />
              </el-select>
              <span v-if="errors.has('add.termOfValidity')" v-cloak class="el-form-item__error"> 请选择有效期 </span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item class="is-required" label="模板名称">
              <el-input v-model="addTemplateName" v-validate="'required'" data-vv-scope="add" :disabled="true" name="templateName" />
              <span v-if="errors.has('add.templateName')" v-cloak class="el-form-item__error"> 请选择可用模板 </span>
            </el-form-item>
          </el-col>
          <el-col v-if="addActiveTemplate.length" class="my-tab-content">
            <el-tabs type="border-card">
              <el-tab-pane label="照面信息">
                <template v-for="(item,index) in addActiveTemplate">

                  <template v-if="item.certificateDataType==='3'">
                    <el-col :key="index" :span="24">
                      <el-form-item>
                        <el-upload
                          ref="uploadImg"
                          class="upload-demo"
                          action=""
                          :auto-upload="false"
                          :limit="fileLimit"
                          :file-list="fileListImg"
                        >
                          <label class="el-form-item__label" style="float:left"> {{ item.label }}</label>
                          <el-button slot="trigger" style="margin-left: 10px;" type="text">选取文件</el-button>
                          <el-button style="margin-left: 10px;" type="text" @click="submitUploadImg(index,'add')">上传</el-button>
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
                            ref="beginTime"
                            v-model="item.value"
                            v-validate="'required'"
                            data-vv-scope="add"
                            type="date"
                            placeholder="选择时间"
                            format="yyyy-MM-dd"
                            style="width:100%"
                            value-format="yyyy-MM-dd"
                            :name="item.name"
                            @change="getEndTime"
                          />
                          <span v-if="errors.has('add.'+item.name)" v-cloak class="el-form-item__error"> 请选择{{ item.label }} </span>
                        </el-form-item>
                      </el-col>
                    </template>
                    <template v-else-if="item.label === '有效期（截止）'">
                      <el-col v-if="isShowEndTime" :key="index" :span="12">
                        <el-form-item style="width:100%" class="is-required" :label="item.label">
                          <el-date-picker
                            ref="endTime"
                            v-model="item.value"
                            v-validate="'required|date_format:yyyy-MM-dd|after:beginTime'"
                            data-vv-scope="add"
                            type="date"
                            placeholder="选择时间"
                            format="yyyy-MM-dd"
                            style="width:100%"
                            value-format="yyyy-MM-dd"
                            name="endTime"
                          />
                          <span v-if="errors.has('add.endTime')" v-cloak class="el-form-item__error"> {{ errors.first('add.endTime') }}</span>
                        </el-form-item>
                      </el-col>
                    </template>
                    <template v-else="">
                      <el-col :key="index" :span="12">
                        <el-form-item style="width:100%" class="is-required" :label="item.label">
                          <el-date-picker
                            v-model="item.value"
                            v-validate="'required'"
                            data-vv-scope="add"
                            format="yyyy-MM-dd"
                            type="date"
                            placeholder="选择时间"
                            style="width:100%"
                            value-format="yyyy-MM-dd"
                            :name="item.name"
                          />
                          <span v-if="errors.has('add.'+item.name)" v-cloak class="el-form-item__error"> 请选择{{ item.label }} </span>
                        </el-form-item>
                      </el-col>
                    </template>

                  </template>

                  <template v-else-if="item.certificate_status === '10'">
                    <el-col :key="index" :span="12">
                      <el-form-item style="width:100%" class="is-required" :label="item.label">
                        <el-select v-model="item.value" v-validate="'required'" data-vv-scope="add" style="width:100%" :name="item.name">
                          <el-option v-for="(item2,index2) in item.option" :key="index2" :label="item2.label" :value="item2.value" />
                        </el-select>
                        <span v-if="errors.has('add.'+item.name)" v-cloak class="el-form-item__error"> 请选择{{ item.label }} </span>
                      </el-form-item>

                    </el-col>
                  </template>
                  <template v-else="">
                    <template v-if="item.label==='颁证单位'">
                      <el-col :key="index" :span="12">
                        <el-form-item class="is-required" :label="item.label">
                          <el-input v-model="item.value" v-validate="'required'" :disabled="true" data-vv-scope="add" :name="item.name" clearable />
                          <span v-if="errors.has('add.'+item.name)" v-cloak class="el-form-item__error"> 请填写{{ item.label }} </span>
                        </el-form-item>
                      </el-col>
                    </template>
                    <template v-else="">
                      <template v-if="item.metadata==='5'">
                        <template v-if="item.showmode ===''||item.showmode===undefined">
                          <el-col :key="index" :span="12">
                            <el-form-item class="is-required" :label="item.label">
                              <el-input v-model="item.value" v-validate="'required'" :maxlength="item.length" show-word-limit data-vv-scope="add" :name="item.name" clearable />
                              <span v-if="errors.has('add.'+item.name)" v-cloak class="el-form-item__error"> 请填写{{ item.label }} </span>
                            </el-form-item>
                          </el-col>
                        </template>
                        <template v-else="">
                          <el-col :key="index" :span="12">
                            <el-form-item class="is-required" :label="item.label">
                              <el-select
                                v-model="item.value"
                                v-validate="'required'"
                                multiple
                                filterable
                                allow-create
                                default-first-option
                                style="width:100%"
                                data-vv-scope="add"
                                :name="item.name"
                                no-data-text="请输入持证者,可输入多个持证者"
                              />
                              <span v-if="errors.has('add.'+item.name)" v-cloak class="el-form-item__error"> 请填写{{ item.label }} </span>
                            </el-form-item>
                          </el-col>
                        </template>
                      </template>
                      <template v-else="">
                        <template v-if="item.label==='证件号码' && holdType === '个人'">
                          <el-col :key="index" :span="12">
                            <el-form-item class="is-required" :label="item.label">
                              <el-input v-model="item.value" v-validate="'required|IDCard'" :maxlength="item.length" show-word-limit data-vv-scope="add" :name="item.name" clearable />
                              <span v-if="errors.has('add.'+item.name)" v-cloak class="el-form-item__error">请填写正确的证件信息</span>
                            </el-form-item>
                          </el-col>
                        </template>
                        <template v-else-if="item.label==='证件号码' && holdType === '法人'">
                          <el-col :key="index" :span="12">
                            <el-form-item class="is-required" :label="item.label">
                              <el-input v-model="item.value" v-validate="'required|SocCard'" :maxlength="item.length" show-word-limit data-vv-scope="add" :name="item.name" clearable />
                              <span v-if="errors.has('add.'+item.name)" v-cloak class="el-form-item__error">请填写正确的社会统一信用代码</span>
                            </el-form-item>
                          </el-col>
                        </template>
                        <template v-else="">
                          <el-col :key="index" :span="12">
                            <el-form-item class="is-required" :label="item.label">
                              <el-input v-model="item.value" v-validate="'required'" data-vv-scope="add" :maxlength="item.length" show-word-limit :name="item.name" clearable />
                              <span v-if="errors.has('add.'+item.name)" v-cloak class="el-form-item__error"> 请填写{{ item.label }} </span>
                            </el-form-item>
                          </el-col>
                        </template>

                      </template>

                    </template>
                  </template>
                </template>
                <el-col v-if="addUploadVisible==='0'" :span="24">
                  <el-form-item>
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

          <el-col style="margin-top:20px" :span="24">
            <el-button type="primary" size="small" @click="templateSave('S')">保存</el-button>
            <el-button type="primary" size="small" @click="templateSave('P')">提交</el-button>
            <el-button type="warning" size="small" @click="addDialogVisible=false">取消</el-button>
          </el-col>
        </el-form>
      </el-row>
    </el-dialog>
    <!-- 修改弹出框 -->
    <el-dialog
      title="模板修改"
      :visible.sync="editDialogVisible"
      :close-on-click-modal="false"
      width="60%"
    >
      <el-row :gutter="65">
        <el-form ref="addTemplate" label-position="top">
          <el-col :span="12">
            <el-form-item label="证照模板">
              <el-input v-model="editTemplateData.certificate_name" name="editCatalogId" :label="editTemplateData.certificate_name" :disabled="true" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="版本号">
              <el-input v-model="editTemplateData.version" clearable :label="editTemplateData.version" :disabled="true" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="有效期">
              <el-input v-model="editTemplateData.ValidityVal" clearable :label="editTemplateData.ValidityVal" :disabled="true" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="模板名称">
              <el-input v-model="editTemplateData.templateName" name="templateName" :disabled="true" />
            </el-form-item>
          </el-col>
          <el-col v-if="editTemplateData.certificate_info" class="my-tab-content">
            <el-tabs type="border-card">
              <el-tab-pane label="照面信息">
                <template v-for="(item,index) in editTemplateData.certificate_info">
                  <template v-if="item.certificateDataType==='3'">
                    <el-col :key="index" :span="24">
                      <el-form-item>
                        <el-upload
                          ref="uploadImg"
                          class="upload-demo"
                          action=""
                          :auto-upload="false"
                          :limit="fileLimit"
                          :file-list="fileListImg"
                        >

                          <label class="el-form-item__label" style="float:left"> {{ item.label }}</label>
                          <el-button slot="trigger" style="margin-left: 10px;" type="text">选取文件</el-button>
                          <el-button style="margin-left: 10px;" type="text" @click="submitUploadImg(index,'edit')">上传</el-button>
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
                            ref="beginEditTime"
                            v-model="item.value"
                            v-validate="'required|date_format:yyyy-MM-dd'"
                            data-vv-scope="edit"
                            type="date"
                            placeholder="选择时间"
                            style="width:100%"
                            format="yyyy-MM-dd"
                            value-format="yyyy-MM-dd"
                            :name="'edit'+item.name"
                            @change="getEditEndTime"
                          />
                          <span v-if="errors.has('edit.edit'+item.name)" v-cloak class="el-form-item__error"> 请选择{{ item.label }} </span>
                        </el-form-item>
                      </el-col>
                    </template>
                    <template v-else-if="item.label === '有效期（截止）'">
                      <el-col v-if="isShowEndTime" :key="index" :span="12">
                        <el-form-item style="width:100%" class="is-required" :label="item.label">
                          <el-date-picker
                            ref="editendTime"
                            v-model="item.value"
                            v-validate="'required|date_format:yyyy-MM-dd|after:beginEditTime'"
                            data-vv-scope="edit"
                            type="date"
                            placeholder="选择时间"
                            style="width:100%"
                            format="yyyy-MM-dd"
                            value-format="yyyy-MM-dd"
                            name="editendTime"
                          />
                          <span v-if="errors.has('edit.editendTime')" v-cloak class="el-form-item__error"> {{ errors.first('edit.editendTime') }} </span>
                        </el-form-item>
                      </el-col>
                    </template>
                    <template v-else="">
                      <el-col :key="index" :span="12">
                        <el-form-item style="width:100%" class="is-required" :label="item.label">
                          <el-date-picker

                            v-model="item.value"
                            v-validate="'required'"
                            data-vv-scope="edit"
                            type="date"
                            placeholder="选择时间"
                            style="width:100%"
                            value-format="yyyy-MM-dd"
                            :name="item.name"
                          />
                          <span v-if="errors.has('edit.edit.'+item.name)" v-cloak class="el-form-item__error"> 请选择{{ item.label }} </span>
                        </el-form-item>
                      </el-col>
                    </template>
                  </template>

                  <template v-else-if="item.certificate_status === '10'">
                    <el-col :key="index" :span="12">
                      <el-form-item style="width:100%" class="is-required" :label="item.label">
                        <el-select v-model="item.value" v-validate="'required'" data-vv-scope="edit" style="width:100%" :name="'edit'+item.name">
                          <el-option v-for="(item2,index2) in item.option" :key="index2" :label="item2.label" :value="item2.value" />
                        </el-select>
                        <span v-if="errors.has('edit.edit'+item.name)" v-cloak class="el-form-item__error"> 请选择{{ item.label }} </span>
                      </el-form-item>

                    </el-col>
                  </template>
                  <template v-else="">
                    <template v-if="item.label==='颁证单位'">
                      <el-col :key="index" :span="12">
                        <el-form-item class="is-required" :label="item.label">
                          <el-input v-model="item.value" v-validate="'required'" :disabled="true" data-vv-scope="edit" :name="'edit'+item.name" clearable />
                          <span v-if="errors.has('edit.edit'+item.name)" v-cloak class="el-form-item__error"> 请填写{{ item.label }} </span>
                        </el-form-item>
                      </el-col>
                    </template>
                    <template v-else="">
                      <template v-if="item.label==='持证者'">
                        <template v-if="item.showmode ==='' ||item.showmode === undefined ">
                          <el-col :key="index" :span="12">
                            <el-form-item class="is-required" :label="item.label">
                              <el-input v-model="item.value" v-validate="'required'" :maxlength="item.length" show-word-limit data-vv-scope="edit" :name="'edit'+item.name" clearable />
                              <span v-if="errors.has('edit.edit'+item.name)" v-cloak class="el-form-item__error"> 请填写{{ item.label }} </span>
                            </el-form-item>
                          </el-col>
                        </template>
                        <template v-else="">
                          <el-col :key="index" :span="12">
                            <el-form-item class="is-required" :label="item.label">
                              <el-select
                                v-model="item.value"
                                v-validate="'required'"
                                multiple
                                filterable
                                allow-create
                                default-first-option
                                style="width:100%"
                                data-vv-scope="edit"
                                :name="'edit'+item.name"
                                no-data-text="请输入持证者,可输入多个持证者"
                              />
                              <span v-if="errors.has('edit.edit'+item.name)" v-cloak class="el-form-item__error"> 请填写{{ item.label }} </span>
                            </el-form-item>
                          </el-col>
                        </template>
                      </template>
                      <template v-else="">
                        <template v-if="item.label === '证件号码'&&holdType==='个人'">
                          <el-col :key="index" :span="12">
                            <el-form-item class="is-required" :label="item.label">
                              <el-input v-model="item.value" v-validate="'required|IDCard'" :maxlength="item.length" show-word-limit data-vv-scope="edit" :name="item.name" clearable />
                              <span v-if="errors.has('edit.edit'+item.name)" v-cloak class="el-form-item__error"> 请填写正确的证件信息 </span>
                            </el-form-item>
                          </el-col>
                        </template>
                        <template v-else-if="item.label === '证件号码'&& holdType==='法人'">
                          <el-col :key="index" :span="12">
                            <el-form-item class="is-required" :label="item.label">
                              <el-input v-model="item.value" v-validate="'required|SocCard'" :maxlength="item.length" show-word-limit data-vv-scope="edit" :name="item.name" clearable />
                              <span v-if="errors.has('edit.edit'+item.name)" v-cloak class="el-form-item__error"> 请填写正确的社会统一信用代码 </span>
                            </el-form-item>
                          </el-col>
                        </template>
                        <template v-else="">
                          <el-col :key="index" :span="12">
                            <el-form-item class="is-required" :label="item.label">
                              <el-input v-model="item.value" v-validate="'required'" :maxlength="item.length" show-word-limit data-vv-scope="edit" :name="item.name" clearable />
                              <span v-if="errors.has('edit.edit'+item.name)" v-cloak class="el-form-item__error"> 请填写{{ item.label }} </span>
                            </el-form-item>
                          </el-col>
                        </template>

                      </template>

                    </template>
                  </template>
                </template>
                <el-col :span="24">
                  <!-- TODO -->
                  <el-form-item v-if="editTemplateData.fileId">
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
          <el-col style="margin-top:20px" :span="24">
            <el-button type="primary" size="small" @click="templateEditSave('S')">保存</el-button>
            <el-button type="primary" size="small" @click="templateEditSave('P')">提交</el-button>
            <el-button type="warning" size="small" @click="editDialogVisible=false">取消</el-button>
          </el-col>
        </el-form>
      </el-row>
    </el-dialog>
  </el-col>
</template>
<script>
import Pagination from '@/components/Pagination'
import { fastDFSFilesUpload, queryDictItemsByTypeCode, getOriginalData, getProvidedPageData, getMouleView, batchRetrieve, batchDelete, batchSubmit, getCatalogInfo, getTemplateBasicDataByCatalogId, dataFilling, getCatalogCertificateTemplateInfo, saveElectronicInfo, certificateView, fastDFSUpload } from '@/api/dataFillNew'
import { setTimeout } from 'timers'
import config from '@/../public/staticConfig'
import request from '@/utils/request'
export default {
  components: {
    Pagination
  },
  data() {
    return {
      // 是否可以进行提交的标示
      doSubmitLicence: true,
      // 是否可以进行取回操作的标示
      doFetchBack: true,
      // 照面类别
      CERTIFICATE_DATA_TYPE: '',
      // 固定字段的值
      encounterInfoList: [],
      addTemplate: [],
      listQuery: {
        page: 1,
        rows: 10,
        dataStatus: '',
        sourceOfCertificate: '',
        certificateTypeName: '',
        globalSearch: ''
      },
      optionsState: [
        {
          value: 'S',
          label: '待提交'
        }, {
          value: 'P',
          label: '待审核'
        }, {
          value: 'R',
          label: '退回'
        },
        {
          value: 'W',
          label: '签章中'
        },
        {
          value: 'D',
          label: '待签章'
        }
      ],
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
      // 存放表格数据
      list: [],
      // 分页总数
      total: 0,
      // 查看时候获取的数据
      viewTemplateList: [],
      // 查看弹框是否显示开关
      viewDialogVisible: false,
      // 预览模板内容
      templateHtml: '',
      // 模板预览时间格式化之后的内容
      templateTimeFormate: '',
      // 选择表格时 获取的表格id的数组
      multipleSelection: [],
      multipleSelectionIds: [],
      // 导入数据弹出框是否显示开关
      importDataDialogVisible: false,
      // 目录选择下拉框 value catalogId,即目录选择下拉框选定的值
      selectIdVal: '',
      // 目录选择下拉框 的 option 遍历用
      selectIdOption: [],
      // 版本号下拉框
      editionOption: [],
      // 版本号 值
      editionVal: '',
      // 证照状态
      certificate_status: 'P',
      // 文件列表
      fileList: [],
      // 图片列表
      fileListImg: [],
      // 文件上传限制
      fileLimit: 1,
      // 模板填报弹框是否显示开关
      addDialogVisible: false,
      // 填报模板名称 val 和label,
      addSelectIdVal: '',
      addSelectIdOption: [],
      // 填报时 版本号名称和 option
      addEditionOption: [],
      addEditionVal: '',
      // 添加时模板名称
      addTemplateName: '',
      // 有效期Option
      valOption: [],
      // 有效期val
      valVal: '',
      // 新增时动态生成的模板
      addActiveTemplate: [],
      // 保存时传证照名称
      saveTemplateName: '',
      // 修改弹框是否显示控制
      editDialogVisible: false,
      // 修改时候模板
      editTemplateData: [],
      // 有效期格式化
      ediTtermOfValidity: '',
      // 证照预览模板html
      cerTemplateHtml: '',
      // 填报时是否显示上传开关
      addUploadVisible: '1',
      // 上传文件成功时候存文件数组
      uploadFileSrc: [],
      // 部门名称 填报时候 颁证单位直接写上部门名称
      orgName: '',
      // 填报时候将版本号写入
      certificateCode: '',
      // 存持证主体的类型
      holdType: '',
      // 是否显示截止时间
      isShowEndTime: ''
    }
  },
  mounted() {
    this.$nextTick(() => {
      if (localStorage.userInfoJson) {
        this.orgName = JSON.parse(localStorage.userInfoJson).orgName
      }
    })

    this.fetchData()
  },
  methods: {
    // 处理表格复选框多选
    hanldeSelectionChange(val) {
      this.multipleSelection = val
    },
    // 获取数据
    fetchData() {
      getProvidedPageData(this.listQuery).then(response => {
        this.list = response.data.data.data.list
        this.total = Number(response.data.data.data.total)
      })
    },
    // 搜索
    searchData() {
      this.listQuery.page = 1
      this.fetchData()
    },
    // 查看操作
    viewTemplate(row) {
      // 获取数据展示
      this.viewTemplateList = row
      if (this.viewTemplateList.fileId !== undefined && !(Array.isArray(this.viewTemplateList.fileId))) {
        this.viewTemplateList.fileId = JSON.parse(this.viewTemplateList.fileId)
      }
      //
      this.viewDialogVisible = true
      this.templateTimeFormate = this.timeFormate(row.termOfValidity)
    },
    // 预览模板
    previewTemplate(id) {
      if (id) {
        getMouleView({ templateId: id }).then(response => {
          if (response.data.data.status) {
            response = response.data.data.data
            this.templateHtml = response.html
            localStorage.cerTemplateHtml = response.html
            window.open(config.config.NGINXURL + '/cataCertView.html', '_blank')
          } else {
            this.$message({
              message: response.data.data.message,
              type: 'warning'
            })
          }
        })
      } else {
        this.$message({
          message: '请先选择相应的版本号',
          type: 'warning'
        })
      }
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
    // 取回操作
    fetchBack() {
      if (this.multipleSelection.length === 0) {
        this.$message({
          message: '请先勾选要取回的证照',
          type: 'warning'
        })
      } else {
        this.multipleSelectionIds = []
        this.doFetchBack = true
        for (var i = 0; i < this.multipleSelection.length; i++) {
          this.multipleSelectionIds.push(this.multipleSelection[i].id)
          if (this.multipleSelection[i].certificate_status !== 'P') {
            this.doFetchBack = false
          }
        }
        if (this.doFetchBack) {
          var str = this.multipleSelectionIds.join(',')
          batchRetrieve({ ids: str }).then(response => {
            setTimeout(() => {
              if (response.data.data.status) {
                this.$message({
                  message: '操作成功',
                  type: 'success'
                })
                this.fetchData()
              } else {
                this.$message({
                  message: '操作失败',
                  type: 'warning'
                })
              }
            })
          })
        } else {
          this.$message({
            message: '只有待审核状态可以取回',
            type: 'warning'
          })
        }
      }
    },
    // 删除操作
    delLicence() {
      if (this.multipleSelection.length === 0) {
        this.$message({
          message: '请先勾选要删除的证照',
          type: 'warning'
        })
      } else {
        this.$confirm('您确定要删除吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.multipleSelectionIds = []
          for (var i = 0; i < this.multipleSelection.length; i++) {
            this.multipleSelectionIds.push(this.multipleSelection[i].id)
          }

          var str = this.multipleSelectionIds.join(',')
          batchDelete({ ids: str }).then(response => {
            setTimeout(() => {
              if (response.data.data.status) {
                this.$message({
                  message: '删除成功',
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
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
      }
    },
    // 提交操作
    submitLicence() {
      if (this.multipleSelection.length === 0) {
        this.$message({
          message: '请先勾选要提交的证照',
          type: 'warning'
        })
      } else {
        this.multipleSelectionIds = []
        this.doSubmitLicence = true
        for (var i = 0; i < this.multipleSelection.length; i++) {
          this.multipleSelectionIds.push(this.multipleSelection[i].id)
          if (!(this.multipleSelection[i].certificate_status === 'S' || this.multipleSelection[i].certificate_status === 'R')) {
            this.doSubmitLicence = false
          }
        }
        if (this.doSubmitLicence) {
          var str = this.multipleSelectionIds.join(',')
          batchSubmit({ ids: str }).then(response => {
            setTimeout(() => {
              if (response.data.data.status) {
                this.$message({
                  message: '提交成功',
                  type: 'success'
                })
                this.fetchData()
              } else {
                this.$message({
                  message: '操作失败',
                  type: 'warning'
                })
              }
            })
          })
        } else {
          this.$message({
            message: '当前状态不可提交',
            type: 'warning'
          })
        }
      }
    },
    // 导入数据操作
    importData() {
      this.importDataDialogVisible = true
      // 获取证照下拉选框
      this.selectIdVal = ''
      this.selectIdOption = ''
      this.editionVal = ''
      this.editionOption = ''
      getCatalogInfo().then(response => {
        this.selectIdOption = response.data.data.data
      })
    },
    // 获取版本号操作
    getEdition(id) {
      // 获取 版本号
      this.editionVal = ''
      getTemplateBasicDataByCatalogId({ catalogId: id }).then(response => {
        this.editionOption = response.data.data.data
      })
    },
    // 下载模板
    templateDownload() {
      if (!this.selectIdVal) {
        this.$message({
          message: '请先选择相应的证照',
          type: 'warning'
        })
      } else if (!this.editionVal) {
        this.$message({
          message: '请先选择相应的版本号',
          type: 'warning'
        })
      } else {
        // 流文件直接打开
        window.open(config.config.BASE_URL + '/licenceExcelApi/exportDynamicExcelTemplate?catalogId=' + this.selectIdVal + '&templateId=' + this.editionVal, '_blank')
      }
    },
    // 文件上传
    submitUpload() {
      if (this.$refs.upload.uploadFiles.length === 0) {
        this.$message({
          message: '请先选择要上传的文件',
          type: 'warning'
        })
      } else {
        var str = this.$refs.upload.uploadFiles[0].name
        var index = str.lastIndexOf('.')
        str = str.substring(index + 1)
        if (str !== 'xlsx') {
          this.$message({
            message: '只能上传xlsx类型文件',
            type: 'warning'
          })
          this.$refs.upload.clearFiles()
        } else {
          var formData = new FormData()
          formData.append('file', this.$refs.upload.uploadFiles[0].raw)
          var url = config.config.BASE_URL + '/licenceExcelApi/importExcel?certificate_status=' + this.certificate_status
          request.importFile(url, formData).then(response => {
            if (response.data.data.status === false) {
              this.$message({
                message: response.data.data.message,
                type: 'error'
              })
              this.$refs.upload.clearFiles()
            } else {
              this.$message({
                message: '导入成功',
                type: 'success'
              })
              this.$refs.upload.clearFiles()
              this.importDataDialogVisible = false
              this.fetchData()
            }
          })
        }
      }
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
    // 填报文件上传 img
    // 上传数组索引用来更改其值
    submitUploadImg(arrIndex, arrStr) {
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
              if (arrStr === 'add') {
                this.addActiveTemplate[arrIndex].value = response.data.data.data
              } else {
                this.editTemplateData.certificate_info[arrIndex].value = response.data.data.data
              }
            }
          })
        }
      }
    },
    // 填报相应操作
    fillTemplate() {
      this.errors.clear()
      this.addDialogVisible = true
      this.addSelectIdVal = ''
      this.addEditionVal = ''
      this.valVal = ''
      this.addTemplateName = ''
      this.addSelectIdOption = ''
      this.addActiveTemplate = []
      this.addUploadVisible = '1'
      dataFilling({ id: '' }).then(response => {
        this.addSelectIdOption = response.data.data.data.catalogInfo
      })
    },
    // 获取填报时候的版本号
    getAddEdition(id) {
      this.addEditionVal = ''
      this.valVal = ''
      this.addTemplateName = ''
      this.addActiveTemplate = ''
      var temp = this.addSelectIdOption.filter(function(item) {
        return item.catalogId === id
      })
      this.addUploadVisible = temp[0].appendix
      this.saveTemplateName = temp[0].certificateName
      // 证照编号
      this.certificateCode = temp[0].certificateCode
      var arr = temp[0].termOfValidity
      arr = arr.split(',')
      this.valOption = []
      for (var i = 0; i < arr.length; i++) {
        var obj = {
          label: this.timeFormate1(arr[i]),
          value: arr[i]
        }
        this.valOption.push(obj)
      }
      this.valVal = this.valOption[0].value
      if (this.valVal === '0/L') {
        this.isShowEndTime = false
      }
      getTemplateBasicDataByCatalogId({ catalogId: id }).then(response => {
        this.addEditionOption = response.data.data.data
      })
    },
    // 模板
    // status collect 为 采集操作
    // add 为新增
    selectTemplate(id, status) {
      var temp = this.addEditionOption.filter(function(item) {
        return item.templateId === id
      })
      if (status === 'collect') {
        this.getEncounterInfo(id)
      }
      var catalogId = temp[0].catalogId
      this.addTemplateName = temp[0].templateName
      getCatalogCertificateTemplateInfo({ templateId: id, catalogId: catalogId }).then(response => {
        // 存当前持证主体是法人还是 个体
        this.holdType = response.data.data.data.certificateHolderTypeCode
        setTimeout(() => {
          this.addActiveTemplate = []
        }, 100)
        setTimeout(() => {
          this.addActiveTemplate = response.data.data.data.certificate_info
          for (var i = 0; i < this.addActiveTemplate.length; i++) {
            if (this.addActiveTemplate[i].label === '颁证单位') {
              this.addActiveTemplate[i].value = this.orgName
            }
            if (this.addActiveTemplate[i].label === '证照编号') {
              this.addActiveTemplate[i].value = this.certificateCode
            }
          }
        }, 200)
      })
    },
    // 保存
    templateSave(status) {
      this.$validator.validateAll('add').then(res => {
        if (res) {
          var obj = {
            templateName: this.addTemplateName,
            termOfValidity: this.valVal,
            catalog_id: this.addSelectIdVal,
            certificate_info: this.addActiveTemplate,
            certificate_status: status,
            templateBasicData: this.addEditionVal,
            certificate_name: this.saveTemplateName,
            fileId: this.uploadFileSrc
          }
          saveElectronicInfo(obj).then(response => {
            console.log(response)
            if (response.data.data.status) {
              this.$message({
                message: '操作成功',
                type: 'success'
              })
              this.fetchData()
              this.addDialogVisible = false
            } else {
              this.$message({
                message: '操作失败',
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
    // 修改保存
    templateEditSave(status) {
      this.$validator.validateAll('edit').then(res => {
        if (res) {
          this.editTemplateData.fileId = this.uploadFileSrc
          this.editTemplateData.updateId = this.editTemplateData.id
          this.editTemplateData.certificate_status = status
          saveElectronicInfo(this.editTemplateData).then(response => {
            if (response.data.data.status) {
              this.$message({
                message: '操作成功',
                type: 'success'
              })
              this.fetchData()
              this.editDialogVisible = false
            } else {
              this.$message({
                message: '操作失败',
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
    // 编辑
    editTemplate(row) {
      console.log(row)
      // 清空上传文件
      this.fileList = []
      this.fileListImg = []
      // 若为长期有效则隐藏
      if (row.termOfValidity === '0,L') {
        this.isShowEndTime = false
      } else {
        this.isShowEndTime = true
      }
      this.errors.clear()
      this.editDialogVisible = true
      this.ediTtermOfValidity = this.timeFormate(row.termOfValidity)
      this.editTemplateData = JSON.parse(JSON.stringify(row))
      this.editTemplateData.ValidityVal = this.ediTtermOfValidity
      for (var i = 0; i < this.editTemplateData.certificate_info.length; i++) {
        if (this.editTemplateData.certificate_info[i].metadata === '5' && !(this.editTemplateData.certificate_info[i].showmode === '' || this.editTemplateData.certificate_info[i].showmode === undefined)) {
          this.editTemplateData.certificate_info[i].value = this.editTemplateData.certificate_info[i].value.split(this.editTemplateData.certificate_info[i].options)
        }
      }
    },
    // 证照预览
    onHandlePreview(row) {
      certificateView({ certificateId: row.id }).then(response => {
        this.cerTemplateHtml = response.data.data.data.html
        localStorage.setItem('cerTemplateHtml', response.data.data.data.html)
        window.open(config.config.NGINXURL + '/cataCertView.html', '_blank')
      })
    },
    // 下载文件
    downloadFile(url) {
      window.open(url, '_blank')
    },
    // 获取照面信息 七个固定字段
    getEncounterInfo(templateId) {
      getOriginalData({ templateId: templateId, templateStatus: '2' }).then(response => {
        response = response.data.data.data
        for (var i = 0; i < response.length; i++) {
          // delete response[i].certificateTemplateId
          response[i].templateId = templateId
          response[i].templateStatus = '2'
        }
        this.encounterInfoList = response
        this.sort = response.length
      })
      // 获取照面类别
      queryDictItemsByTypeCode({ typeCode: 'CERTIFICATE_DATA_TYPE' }).then(response => {
        response = response.data.data.data
        this.CERTIFICATE_DATA_TYPE = response
      })
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
      for (var i = 0; i < this.addActiveTemplate.length; i++) {
        if (this.addActiveTemplate[i].label === '有效期（截止）') {
          this.addActiveTemplate[i].value = temp
        }
      }
    },
    getEditEndTime() {
      var val = this.$refs.beginEditTime[0].value
      if (this.editTemplateData.ValidityVal === '0/L') {
        this.isShowEndTime = false
      } else {
        this.isShowEndTime = true
      }
      var tempTime = this.deFormateTime(this.editTemplateData.ValidityVal)
      var arr = tempTime.split('/')
      var date = new Date(val)
      var temp = this.DateAdd(arr[1], Number(arr[0]), date)
      for (var i = 0; i < this.editTemplateData.certificate_info.length; i++) {
        if (this.editTemplateData.certificate_info[i].label === '有效期（截止）') {
          this.editTemplateData.certificate_info[i].value = temp
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
    // 将年月转化成 1/D
    deFormateTime(val) {
      var temp = val.substring((val.length - 1))
      var preTemp = val.substring(0, (val.length - 1))
      var timeData = ''
      switch (temp) {
        case '年' :
          timeData = preTemp + '/Y'
          break
        case '月' :
          timeData = preTemp + '/M'
          break
        case '日' :
          timeData = preTemp + '/D'
          break
        case '效' :
          timeData = '0/L'
          break
      }
      return timeData
    }

  }
}
</script>
<style scoped>
.custom-width{
  width: 50%;
}
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
