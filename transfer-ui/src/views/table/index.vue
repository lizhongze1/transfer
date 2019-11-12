<template>
  <div class="app-container">

<!--    <el-select v-model="listQuery.jobGroup" placeholder="表名" class="filter-item">

      <el-option v-for="item in canalClusters" :key="item.jobGroup" :label="item.jobGroup" :value="item.jobGroup" />
    </el-select>-->
    <el-button class="filter-item" type="primary" @click="handleCreate()">新建</el-button>

    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
    >
      <el-table-column align="center" label="序号" width="95">
        <template slot-scope="scope">
          {{ scope.$index }}
        </template>
      </el-table-column>
      <el-table-column label="描述" >
        <template slot-scope="scope">
          {{ scope.row.jobDesc }}
        </template>
      </el-table-column>
      <el-table-column label="执行器" width="110" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.executorHandler }}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" width="200" align="center">
        <template slot-scope="scope">

          {{scope.row.addTime|formatDate}}
        </template>
      </el-table-column>
      <el-table-column class-name="状态" label="Status" width="110" align="center">
        <template slot-scope="scope">
<!--          <el-tag :type="scope.row.triggerStatus | statusFilter">{{ scope.row.triggerStatus }}</el-tag>-->
          <span v-if="scope.row.triggerStatus == '1'" class="el-button el-button--success el-button--mini">启动中</span>
          <span v-else-if="scope.row.triggerStatus == '0'" class="el-button el-button--danger el-button--mini">已停止</span>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="created_at" label="操作" width="200">
        <template slot-scope="scope">
          <el-dropdown trigger="click">
            <el-button type="primary" size="mini">
              操作<i class="el-icon-arrow-down el-icon--right" />
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item @click.native="handleConfig(scope.row)">停止</el-dropdown-item>
              <el-dropdown-item @click.native="handleUpdate(scope.row)">编辑</el-dropdown-item>
              <el-dropdown-item @click.native="handleDelete(scope.row)">删除</el-dropdown-item>
              <el-dropdown-item @click.native="handleView(scope.row)">查看日志</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="count>0" :total="count" :page.sync="listQuery.page" :limit.sync="listQuery.size" @pagination="fetchData()" />
    <el-dialog :visible.sync="dialogFormVisible" :title="textMap[dialogStatus]" width="1000px">

      <el-steps :active="active" finish-status="success"  >
        <el-step title="步骤 1">

          <template slot="description" v-if="active==1" >
            <div class="step-row" >
                        <el-form ref="dataForm" :rules="rules" :model="taskInfo" label-position="left" label-width="120px" style="width: 400px; margin-left:0px;">
        <!--                  <el-form-item label="名称" prop="name">
                            <el-input v-model="taskInfo.title" />
                          </el-form-item>
                          <el-form-item label="app名称" prop="appName">
                            <el-input v-model="taskInfo.appName" />
                          </el-form-item>
                          <el-form-item label="注册地址" prop="addressList">
                            <el-input v-model="taskInfo.addressList" />
                          </el-form-item>-->

<!--                          <el-select v-model="listQuery.jobGroupId" placeholder="所选节点" class="filter-item">
                            <el-option key="" label="所选节点" value="" />
                            <el-option-group v-for="group in options" :key="group.id" :label="group.title">
                              <el-option v-for="item in group.options" :key="item.id" :label="item.title" :value="item.value" />
                            </el-option-group>
                          </el-select>-->
 <!--                         <el-option key="" label="所属集群" value="" />
                          <el-option key="-1" label="单机" value="-1" />-->
                          <el-form-item label="所选节点" >
<!--                          <el-option v-for="item in canalClusters" :key="item.id" :label="item.name" :value="item.id"/>-->
                              <el-select v-model="taskInfo.jobGroup" placeholder="所选节点" class="filter-item">
                                <el-option v-for="item in options" :key="item.id" :label="item.title" :value="item.id" />
                              </el-select>
                          </el-form-item>
                              <el-form-item label="描述" prop="name">
                                <el-input v-model="taskInfo.jobDesc" />
                              </el-form-item>
                              <el-form-item label="路由策略" prop="name">
                                <el-input v-model="taskInfo.executorRouteStrategy" />
                              </el-form-item>
                          <el-form-item label="cron表达式" prop="name">
                            <el-input v-model="taskInfo.jobCron" />
                          </el-form-item>
                          <el-form-item label="运行模式" prop="name">
                            <el-input v-model="taskInfo.glueType" />
                          </el-form-item>
                          <el-form-item label="beanname" prop="name">
                            <el-input v-model="taskInfo.executorHandler" />
                          </el-form-item>
                          <el-form-item label="执行模式" prop="name">
                            <el-input v-model="taskInfo.executorBlockStrategy" />
                          </el-form-item>
                          <el-form-item label="负责人" prop="name">
                            <el-input v-model="taskInfo.author" />
                          </el-form-item>
                        </el-form>

                <el-form-item label="esip" v-if="taskInfo.executorParamJs">
                  <el-input v-model="taskInfo.executorParamJs.esIp" />
                </el-form-item>

            </div>
          </template>
          <template slot="description" v-if="active==2" >
            <div class="step-row" >
              <el-form ref="dataForm" :rules="rules" :model="taskInfo" label-position="left" label-width="120px" style="width: 400px; margin-left:0px;">
<!--                <el-form-item label="esip" >
                  <el-input v-model="taskInfo.executorParamJs.esIp" />
                </el-form-item>
                <el-form-item label="mongoip">
                  <el-input v-model="taskInfo.executorParamJs.mongoIp" />
                </el-form-item>-->
                <template  v-if="taskInfo">
                  <el-form-item label="esip" v-if="taskInfo.executorParamJs">
                    <el-input v-model="taskInfo.executorParamJs.esIp" />
                  </el-form-item>
                </template>
              </el-form>
            </div>
          </template>

          <template slot="description" v-if="active==2" >
            <div class="step-row" >
              <el-form ref="dataForm" :rules="rules" :model="taskInfo" label-position="left" label-width="120px" style="width: 400px; margin-left:0px;">
   <!--             <template  v-if="taskInfo">
                  <el-form-item label="esip" v-if="taskInfo.executorParamJs">
                    <el-input v-model="taskInfo.executorParamJs.esIp" />
                  </el-form-item>
                </template>-->
<!--                <el-form-item label="mongoip">
                  <el-input v-model="taskInfo.executorParamJs.mongoIp" />
                </el-form-item>-->
              </el-form>
            </div>
          </template>
        </el-step>
        <el-step title="步骤 2" ></el-step>

        <el-step title="步骤 3"></el-step>
      </el-steps>
      <el-button style="margin-top: 12px;" @click="previous">上一步</el-button>
      <el-button style="margin-top: 12px;" @click="next">下一步</el-button>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="dataOperation()">确定</el-button>
      </div>
    </el-dialog>



  </div>
</template>

<script>
import { getList,getTaskGroup,addtaskInfo,updatetaskInfo } from '@/api/table'
import Pagination from '@/components/Pagination'
export default {
    components: { Pagination },
  filters: {
      formatDate: function (value) {// 时间戳转换日期格式方法
          if (value == null) {
              return '';
          } else {
              let date = new Date(value);
              let y = date.getFullYear();// 年
              let MM = date.getMonth() + 1;// 月
              MM = MM < 10 ? ('0' + MM) : MM;
              let d = date.getDate();// 日
              d = d < 10 ? ('0' + d) : d;
              let h = date.getHours();// 时
              h = h < 10 ? ('0' + h) : h;
              let m = date.getMinutes();// 分
              m = m < 10 ? ('0' + m) : m;
              let s = date.getSeconds();// 秒
              s = s < 10 ? ('0' + s) : s;
              return y + '-' + MM + '-' + d + ' ' + h + ':' + m + ':' + s;
          }
          },

    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'gray',
        deleted: 'danger'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      list: null,
      listLoading: true,
        count: 0,
        active: 1,

        dialogFormVisible: false,
        textMap: {
            create: '新建',
            update: '修改'
        },
        taskInfo: {
            id: null,
            title: null,
            appName: null,
            addressList:null,
            executorRouteStrategy: "ROUND",
            jobCron:"* * * * * ?",
            glueType:"BEAN",
            executorHandler:"demoJobHandler1",
            executorBlockStrategy:"SERIAL_EXECUTION",
            author:"SERIAL_EXECUTION",
            executorParamJs:{esIp:null, mongoIp:null},
        },


        dialogStatus: 'create',
        rules: {
            title: [{ required: true, message: '名称不能为空', trigger: 'change' }],
            appName: [{ required: true, message: 'app名不能为空', trigger: 'change' }],
            addressList: [{ required: true, message: '注册地址不能为空', trigger: 'change' }]

        },
        options: [],
        listQuery: {
            jobGroup: 1,
            triggerStatus: -1,
            jobGroupId: null,

            size: 10,
            page: 0,
        },
    }
  },
  created() {
      getTaskGroup().then((res) => {
          //console.log("+++++"+res);
          this.options = res.data
          // console.log(res.data);
      })
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.listLoading = true
      getList(this.listQuery).then(response => {
          console.log(response.data)
          this.count=response.recordsTotal
        this.list = response.data
        this.listLoading = false
      })
    },

      dataOperation() {
          this.$refs['dataForm'].validate((valid) => {
              if (valid) {
                  if (this.dialogStatus === 'create') {
                      addtaskInfo(this.taskInfo).then(res => {
                          this.operationRes(res)
                      })
                  }
                  if (this.dialogStatus === 'update') {
                      updatetaskInfo(this.taskInfo).then(res => {
                          this.operationRes(res)
                      })
                  }
              }
          })
      },
      operationRes(res) {
          console.log("value================")
          console.log(res)
          //alert(res)
          if (res.data === 'suess') {
              this.fetchData()
              this.dialogFormVisible = false
              this.$message({
                  message: this.textMap[this.dialogStatus] + '成功',
                  type: 'success'
              })
          } else {
              this.$message({
                  message: this.textMap[this.dialogStatus] + '失败',
                  type: 'error'
              })
          }
      },

      handleCreate() {
          this.resetModel()
          this.dialogStatus = 'create'
          this.dialogFormVisible = true
          this.$nextTick(() => {
              this.$refs['dataForm'].clearValidate()
          })
      },

      resetModel() {
          this.taskInfo= {
                  id: null,
                  title: null,
                  appName: null,
                  addressList:null,
                  executorRouteStrategy: "ROUND",
                  jobCron:"* * * * * ?",
                  glueType:"BEAN",
                  executorHandler:"demoJobHandler1",
                  executorBlockStrategy:"SERIAL_EXECUTION",
                  author:"SERIAL_EXECUTION",
                  executorParamJs:{esIp:null, mongoIp:null},
          }
      },
      next() {
          if (this.active++ > 2) this.active = 3;
      },
      previous(){
          if (this.active-- == 1) this.active = 1;
      },
      handleConfig(row) {
          this.$router.push('/canalServer/nodeServer/config?clusterId=' + row.id)
      },
  }
}
</script>
