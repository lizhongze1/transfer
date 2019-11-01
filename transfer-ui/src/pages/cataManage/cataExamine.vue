<!--
 * @Description: 证照审核
 * @Author: ppfei
 * @Date: 2019-07-24 17:44:28
 -->

<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.all" placeholder="请输入名称或编码" style="width: 15%" clearable />
      <el-button v-waves type="primary" icon="el-icon-search" @click="fetchData()">搜索</el-button>
      <el-button type="warning" class="filter-item" icon="el-icon-back" @click="onHandleAudit('3')">退回</el-button>
      <el-button type="success" class="filter-item" icon="el-icon-check" @click="onHandleAudit('4')">通过</el-button>
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
          <span v-if="scope.row.catalogStatus == '3'">审核驳回</span>
          <span v-if="scope.row.catalogStatus == '6'">维护中</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="创建时间">
        <template slot-scope="scope">
          <span>{{ scope.row.createrTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="200" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <template v-if="row.catalogStatus == '2'||row.catalogStatus == '6'">
            <el-button type="primary" size="mini" plain @click="onHandleView(row)">
              目录信息
            </el-button>
            <el-button type="primary" size="mini" plain @click="onHandleViewTemp(row.catalogId)">
              模板信息
            </el-button>
          </template>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.rows" @pagination="fetchData" />

    <el-dialog :visible.sync="dialogVisible" :title="titleMap[dialogStatus]" :close-on-click-modal="false" width="60%">
      <el-form ref="ruleForm" :model="temp" label-position="top" class="form-main" :disabled="disabled">
        <el-row :gutter="64">
          <el-col :span="12">
            <el-form-item label="证照名称：" prop="certificateName">
              <el-input v-model="temp.certificateName" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="证照编码：" prop="certificateCode">
              <el-input v-model="temp.certificateCode" clearable />
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
              <el-select v-model="temp.certificateTypeName" placeholder="请选择" style="width: 100%" clearable>
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
            <el-form-item label="颁发单位：" prop="orgName">
              <el-select v-model="temp.orgName" placeholder="请选择颁发单位" style="width:100%" clearable />
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
        <el-row :gutter="64">
          <el-col :span="12">
            <el-form-item label="是否过期提醒" prop="ifRemind">
              <el-radio-group v-model="temp.ifRemind">
                <el-radio label="0">是</el-radio>
                <el-radio label="1">否</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col v-if="temp.ifRemind ==='0'" :span="12">
            <el-form-item label="过期天数" prop="remindDays">
              <el-input v-model="temp.remindDays" placeholder="请输入过期天数" clearable />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="64">
          <el-col :span="24">
            <el-form-item label="备注：" prop="remarks">
              <el-input v-model="temp.remarks" type="textarea" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
import Pagination from '@/components/Pagination'
import waves from '@/directive/waves' // waves directive
import { getCatalogPageData, queryDictItemsByTypeCode, auditCatalog } from '@/api/licenseCata'

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
        status: '2,6',
        certificateName: '',
        all: ''
      },
      dialogVisible: false,
      titleMap: {
        'create': '新增',
        'edit': '编辑',
        'view': '查看'
      },
      dialogStatus: '',
      temp: {},
      // 事项名称
      MATTER_TYPE: null,
      // 公开级别
      OPEN_LEVEL: null,
      // 证照类型组
      certificateTypeName: null,
      // 有效期数组
      termOfValidityValue: [{
        value: '1天',
        label: '1天'
      }, {
        value: '1月',
        label: '1月'
      }, {
        value: '1年',
        label: '1年'
      }, {
        value: '长期有效',
        label: '长期有效'
      }],
      // 表单禁用功能
      disabled: false,
      // table多选
      multipleSelection: [],
      // ids 删除用
      ids: ''
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
  },
  methods: {
    // 获取编目分页信息
    fetchData() {
      getCatalogPageData(this.listQuery).then(response => {
        response = response.data.data.data
        this.list = response.list
        this.total = parseInt(response.total)
        // Just to simulate the time of the request
      })
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
    // 驳回 通过
    onHandleAudit(status) {
      this.ids = ''
      for (var i = 0; i < this.multipleSelection.length; i++) {
        this.ids += this.multipleSelection[i].catalogId + ','
      }
      if (this.ids !== '') {
        this.$prompt('请输入审核意见', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputPattern: /^[\s\S]*.*[^\s][\s\S]*$/,
          inputErrorMessage: '请输入审核意见',
          closeOnClickModal: false
        }).then((value) => {
          auditCatalog({ ids: this.ids, status: status, auditOpinion: value }).then(res => {
            this.fetchData()
            if (status === '3') {
              this.$message({
                message: '已成功驳回',
                type: 'success'
              })
            } else {
              this.$message({
                message: '已通过',
                type: 'success'
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
          message: '请选择需要审核的证照',
          type: 'warning'
        })
      }
    },
    // 查看
    onHandleView(row) {
      console.log(row)
      this.disabled = true
      this.dialogVisible = true
      this.dialogStatus = 'view'
      this.temp = Object.assign({}, row)
      this.temp.termOfValidityList = this.temp.termOfValidity.split(',')
    },
    // 查看模板跳转
    onHandleViewTemp(catalogId) {
      this.$router.push({ path: '/cataManage/licenseCata/licenseTemp', query: { catalogId: catalogId, dialogStatus: 'view' }})
    }
  }
}
</script>
<style scoped>
.form-main{
  padding: 0 24px;
}
</style>
