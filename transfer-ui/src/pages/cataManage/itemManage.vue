<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.text" placeholder="请输入事项名称" clearable style="width:15%" />
      <el-input v-model="listQuery.value" placeholder="请输入事项编码" clearable style="width:15%" />
      <el-button type="primary" icon="el-icon-search" @click="searchData">搜索</el-button>
      <el-button type="primary" icon="el-icon-plus" @click="handleAdd">新增</el-button>
    </div>
    <el-table
      :data="list"
      border
      fit
      stripe
      style="margin-top: 16px"
    >
      <el-table-column type="index" label="序号" width="50" align="center" />
      <el-table-column label="事项编码" prop="VALUE" align="center" />
      <el-table-column label="事项名称" prop="TEXT" align="center" />
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" plain @click="handleEdit(scope.row)">编辑</el-button>
          <el-button type="danger" size="mini" plain @click="handleDel(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.rows" @pagination="fetchData" />
    <el-dialog
      :title="dialogTitle"
      :visible.sync="dialogVisible"
      width="30%"
    >
      <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="100px" label-position="left">
        <el-form-item label="事项编码" prop="value">
          <el-input v-model.trim="ruleForm.value" />
        </el-form-item>
        <el-form-item label="事项名称" prop="text">
          <el-input v-model.trim="ruleForm.text" />
        </el-form-item>
      </el-form>
      <el-row>
        <el-button type="primary" @click="submitVal">确定</el-button>
        <el-button @click="dialogVisible = false">取消</el-button>
      </el-row>
    </el-dialog>
  </div>
</template>
<script>
import Pagination from '@/components/Pagination'
import { SelectDic, InsertDic, UpdateDic, DeleteDic } from '@/api/itemManage'
export default {
  components: {
    Pagination
  },
  data() {
    return {
      total: 0,
      listQuery: {
        page: 1,
        rows: 10,
        text: '',
        value: ''
      },
      // 表格数据
      list: [],
      // 弹框的标题
      dialogTitle: '',
      // 弹框是否可见
      dialogVisible: false,
      // 弹框
      ruleForm: {
        // 名称
        text: '',
        // 编号
        value: ''
      },
      rules: {
        text: [
          { required: true, message: '请输入事项编码', trigger: 'blur' }
        ],
        value: [
          { required: true, message: '请输入事项名称', trigger: 'blur' }
        ]
      }
    }
  },
  mounted() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      SelectDic(this.listQuery).then(res => {
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
    // 搜索
    searchData() {
      this.listQuery.page = 1
      this.fetchData()
    },
    // 删除
    handleDel(row) {
      this.$confirm('您确定要删除吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        DeleteDic({ dicId: row.DIC_ID }).then(res => {
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
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    // 编辑
    handleEdit(row) {
      this.dialogVisible = true
      this.dialogTitle = '编辑'
      this.ruleForm = {
        text: row.TEXT,
        value: row.VALUE,
        id: row.DIC_ID
      }
    },
    // 新增
    handleAdd() {
      this.dialogVisible = true
      this.dialogTitle = '新增'
    },
    // 新增 编辑 保存
    submitVal() {
      this.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          if (this.dialogTitle === '新增') {
            InsertDic({ text: this.ruleForm.text, value: this.ruleForm.value }).then(res => {
              if (res.data.data.status) {
                this.$message({
                  message: res.data.data.data,
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
            UpdateDic({ dicId: this.ruleForm.id, text: this.ruleForm.text, value: this.ruleForm.value }).then(res => {
              if (res.data.data.status) {
                this.$message({
                  message: res.data.data.data,
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
          }
        } else {
          this.$message({
            message: '请先完善信息再保存',
            type: 'warning'
          })
        }
      })
    }
  }
}
</script>
