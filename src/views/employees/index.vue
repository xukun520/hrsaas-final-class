<template>
  <div class='dashboard-container'>
    <div class='app-container'>
      <!-- 头部信息栏 -->
      <page-tools :show-before='true'>
        <template v-slot:before>
          共 <span>{{ total }}</span> 条数据
        </template>
        <template v-slot:after>
          <el-button size='mini' type='success' @click='toExcel'>导出excel</el-button>
          <el-button size='mini' type='warning' @click='fromExcel'>导入excel</el-button>
          <el-button size='mini'
                     :disabled='!checkPermission("POINT-USER-ADD")' type='primary'
                     @click='formVisible=true'>新增员工</el-button>
        </template>
      </page-tools>
      <!-- 表格数据栏 -->
      <el-card style='margin-top: 15px'>
        <el-row>
          <el-table border stripe
                    v-loading='loading'
                    element-loading-text='拼命加载中'
                    element-loading-spinner='el-icon-loading'
                    element-loading-background='rgba(0, 0, 0, 0.8)'
                    :data='employeesList'
          >
            <el-table-column align='center' type='index' label='序号' sortable='' />
            <el-table-column prop='username' align='center' label='姓名' sortable='' />
            <el-table-column align='center' label='头像'>
              <template v-slot='{row}'>
                <el-image @click='showCode(row.staffPhoto)' :src='row.staffPhoto'></el-image>
              </template>
            </el-table-column>
            <el-table-column prop='workNumber' align='center' label='工号' sortable='' />
            <el-table-column prop='formOfEmployment'
                             :formatter='formatEmploy'
                             align='center'
                             label='聘用形式' sortable=''
            />
            <el-table-column prop='departmentName' align='center' label='部门' sortable='' />
            <el-table-column align='center' label='入职时间' sortable=''>
              <template v-slot='{row}'>
                <span>{{ row.timeOfEntry | formatDate }}</span>
              </template>
            </el-table-column>
            <el-table-column align='center' label='账户状态' sortable=''>
              <template v-slot='{row}'>
                <el-switch :value='row.inServiceStatus===1'></el-switch>
              </template>
            </el-table-column>
            <el-table-column align='center' label='操作' fixed='right' width='280'>
              <template v-slot='{row}'>
                <el-button type='text' size='mini' @click='$router.push(`/employees/detail/${row.id}`)'>查看</el-button>
                <el-button type='text' size='mini'>转正</el-button>
                <el-button type='text' size='mini'>调岗</el-button>
                <el-button type='text' size='mini'>离职</el-button>
                <el-button type='text' size='mini' @click='showRolePull(row.id)'>角色</el-button>
                <el-button type='text' size='mini' @click='delEmploy(row.id)'>删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-row>
        <!-- 分页数据 -->
        <el-row style='margin-top: 15px;height: 60px' align='middle' type='flex' justify='center'>
          <el-pagination
            @size-change='empSizeChange'
            @current-change='empCurrentChange'
            :current-page='queryInfo.page'
            :page-sizes='[1, 3, 5, 10,20]'
            :page-size='queryInfo.size'
            layout='total, sizes, prev, pager, next, jumper'
            :total='total'
          >
          </el-pagination>
        </el-row>
      </el-card>
      <!-- 添加员工表单弹出组件 -->
      <add-employees :visible.sync='formVisible'></add-employees>
      <!-- 头像二维码弹窗 -->
      <el-dialog title='二维码头像'
                 align='center'
                 :visible.sync='qrcodeVisible'
                 width='50%'
      >
        <el-row type='flex' justify='center'>
          <canvas ref='qrcode'></canvas>
        </el-row>
      </el-dialog>
      <!-- 分配角色 -->
      <assign-role ref='assignRole'
                   :show-visible.sync='showRoleVisible'
                   :user-id='userId'
      >
      </assign-role>
    </div>
  </div>
</template>

<script>
import { getEmployees, delEmployees } from '@/api/employees'
import empEnum from '@/api/constant/employees'
import AddEmployees from './components/add-employees'
import { formatDate } from '@/filters'
import QrCode from 'qrcode'
import AssignRole from '@/views/employees/components/assign-role'

export default {
  name: 'index',
  components: {
    AssignRole,
    AddEmployees
  },
  data() {
    return {
      queryInfo: {
        page: 1,
        size: 5
      },
      loading: false,
      total: 0,
      employeesList: [],
      formVisible: false,
      qrcodeVisible: false,
      showRoleVisible: false,
      userId: ''
    }
  },
  created() {
    this.getEmployeesList()
  },
  methods: {
    // 获取员工数据列表
    async getEmployeesList() {
      this.loading = true
      const { total, rows } = await getEmployees(this.queryInfo)
      this.loading = false
      this.employeesList = rows
      this.total = total
    },
    // 分页页面发生改变
    empSizeChange(val) {
      this.queryInfo.size = val
      this.getEmployeesList()
    },
    // 当前页发生改变
    empCurrentChange(val) {
      this.queryInfo.page = val
      this.getEmployeesList()
    },
    // 格式化聘用方式
    formatEmploy(row, column, cellValue, index) {
      const res = empEnum.hireType.find(item => item.id === cellValue)
      return res ? res.value : '未知'
    },
    // 删除员工
    async delEmploy(id) {
      const res = await this.$confirm('你确定要删除该员工吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (res === 'confirm') {
        await delEmployees(id)
        this.$message.success('删除成功')
        await this.getEmployeesList()
      }
    },
    // 跳转到导入excel
    toExcel() {
      this.$router.push('/imports')
    },
    // 导出excel员工表
    fromExcel() {
      const headers = {
        '姓名': 'username',
        '手机号': 'mobile',
        '入职日期': 'timeOfEntry',
        '聘用形式': 'formOfEmployment',
        '转正日期': 'correctionTime',
        '工号': 'workNumber',
        '部门': 'departmentName'
      }
      import('@/vendorExcel/Export2Excel').then(async excel => {
        const { rows } = await getEmployees({ page: 1, size: this.total })
        const data = this.formatJson(headers, rows)
        const merges = ['A1:A2', 'B1:F1', 'G1:G2']
        const multiHeader = [['姓名', '基本信息', '', '', '', '', '部门']]
        excel.export_json_to_excel({
          header: Object.keys(headers),
          filename: '员工信息表',
          data,
          merges,
          multiHeader
        })
      })
    },
    // 格式化导出内容
    formatJson(headers, rows) {
      // [{username:'',id:132},{username:'',id:''}] [[],[]]
      return rows.map(item => {
        return Object.keys(headers).map(key => {
          if (headers[key] === 'timeOfEntry' || headers[key] === 'correctionTime') {
            return formatDate(item[headers[key]])
          } else if (headers[key] === 'formOfEmployment') {
            const e = empEnum.hireType.find(enItem => enItem.id === item[headers[key]])
            return e ? e.value : '未知'
          }
          return item[headers[key]]
        })
      })
    },
    // 点击头像生成二维码
    showCode(avatar) {
      if (avatar) {
        this.qrcodeVisible = true
        this.$nextTick(() => {
          QrCode.toCanvas(this.$refs.qrcode, avatar)
        })
      } else {
        this.$message.warning('该用户还未上传头像')
      }
    },
    // 分配用户角色
    async showRolePull(id) {
      this.userId = id
      // 父组件中调用子组件的方法
      await this.$refs.assignRole.getAvatar(id)
      this.showRoleVisible = true
    }
  },
  computed: {}
}
</script>

<style scoped>
.el-table {
  font-size: 12px;
}

.el-image {
  border-radius: 50%;
  margin: 5px;
  width: 60px;
  height: 60px;
}
</style>
