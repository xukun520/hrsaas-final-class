<template>
  <div class='dashboard-container'>
    <div class='app-container'>
      <el-card>
        <el-tabs @tab-click='checkTabs' v-model='activeTab'>
          <!-- 放置页签 -->
          <el-tab-pane label='角色管理' name='role'>
            <!-- 新增角色按钮 -->
            <el-row style='height:60px'>
              <el-button icon='el-icon-plus'
                         size='small'
                         @click='addRolePull'
                         type='primary'
              >新增角色
              </el-button>
            </el-row>
            <!-- 表格 -->
            <el-table border stripe :data='roleList'>
              <el-table-column align='center' label='序号' type='index' width='50' />
              <el-table-column align='center' label='角色名称' prop='name' width='140' />
              <el-table-column header-align='center' label='描述' prop='description' />
              <el-table-column align='center' label='操作' width='260'>
                <template v-slot='{row}'>
                  <el-button size='mini' type='success' @click='assignPull(row.id)'>分配权限</el-button>
                  <el-button size='mini' type='primary' @click='editRolePull(row.id)'>编辑</el-button>
                  <el-button size='mini' type='danger' @click='delRole(row.id)'>删除</el-button>
                </template>
              </el-table-column>
            </el-table>
            <!-- 编辑角色信息弹框 -->
            <el-dialog
              :title='roleTitle'
              align='center'
              :visible.sync='editVisible'
              width='40%'
              @close='resetForm'
            >
              <!-- 编辑表单 -->
              <el-form :model='roleForm'
                       :rules='roleFormRules'
                       ref='roleFormRef'
                       label-width='100px'
              >
                <el-form-item label='角色名称' prop='name'>
                  <el-input v-model.trim='roleForm.name'></el-input>
                </el-form-item>
                <el-form-item label='角色描述' prop='description'>
                  <el-input v-model.trim='roleForm.description'></el-input>
                </el-form-item>
              </el-form>
              <el-row slot='footer' type='flex' justify='center' align='center'>
                <el-button size='small' @click='resetForm'>取 消</el-button>
                <el-button size='small' type='primary' @click='updateRoleForm'>确 定</el-button>
              </el-row>
            </el-dialog>
            <!-- 分配权限 -->
            <el-dialog title='权限分配'
                       :visible='showPermDialog'
                       @close='closePermDialog'
                       center
            >
              <el-tree :data='permFormData'
                       :default-expand-all='true'
                       show-checkbox
                       check-strictly
                       node-key='id'
                       ref='roleByPermFormRef'
                       :default-checked-keys='checkRoleId'
                       :props='permOptions'
              ></el-tree>
              <el-row slot='footer' type='flex' justify='center'>
                <el-col :span='6'>
                  <el-button type='primary' size='small' @click='updateRoleByPerm'>确定</el-button>
                  <el-button size='small' @click='closePermDialog'>取消</el-button>
                </el-col>
              </el-row>
            </el-dialog>
            <!-- 分页组件 -->
            <el-row type='flex' justify='center' align='middle' style='height: 60px'>
              <!-- 分页组件 -->
              <el-pagination
                @size-change='handleSizeChange'
                @current-change='handleCurrentChange'
                :current-page='queryInfo.page'
                :page-sizes='[1, 3, 5, 10,20]'
                :page-size='queryInfo.pagesize'
                layout='total, sizes, prev, pager, next, jumper'
                :total='total'
              >
              </el-pagination>
            </el-row>
          </el-tab-pane>
          <el-tab-pane label='公司信息' name='company'>
            <el-alert
              title='对公司名称、公司地址、营业执照、公司地区的更新，将使得公司资料被重新审核，请谨慎修改'
              type='info'
              show-icon
              :closable='false'
            />
            <el-form :model='companyList' label-width='120px' style='margin-top:50px'>
              <el-form-item label='公司名称' prop='name'>
                <el-input disabled style='width:600px' v-model='companyList.name' />
              </el-form-item>
              <el-form-item label='公司地址' prop='companyAddress'>
                <el-input disabled style='width:600px' v-model='companyList.companyAddress' />
              </el-form-item>
              <el-form-item label='邮箱' prop='mailbox'>
                <el-input disabled style='width:600px' v-model='companyList.mailbox' />
              </el-form-item>
              <el-form-item label='备注' prop='remarks'>
                <el-input type='textarea'
                          v-model='companyList.remarks'
                          :rows='3'
                          disabled
                          style='width:600px'
                />
              </el-form-item>
            </el-form>
          </el-tab-pane>
        </el-tabs>
      </el-card>
    </div>
  </div>
</template>

<script>
import {
  getRoleList,
  getCompanyInfoById,
  delRoleById,
  getRoleInfoById,
  updateRole,
  addRole,
  assignPerm
} from '@/api/setting'
import { getPermissionList } from '@/api/permission'
import { departListToTree } from '@/utils'

export default {
  name: 'index',
  data() {
    return {
      roleList: [],
      queryInfo: {
        page: 1,
        pagesize: 5
      },
      total: 0,
      activeTab: 'role',
      companyList: {
        name: '',
        mailbox: '',
        companyAddress: '',
        remarks: ''
      },
      editVisible: false,
      roleForm: {
        description: '',
        name: ''
      },
      roleFormRules: {
        name: [
          { required: true, message: '角色名称不能为空', trigger: 'blur' }
        ],
        description: [
          { required: true, message: '角色名称不能为空', trigger: 'blur' }
        ]
      },
      showPermDialog: false,
      permFormData: {},
      permOptions: {
        label: 'name'
      },
      roleId: '',
      checkRoleId: []
    }
  },
  created() {
    this.getRoleList()
  },
  methods: {
    // 获取公司角色列表
    async getRoleList() {
      const { rows, total } = await getRoleList(this.queryInfo)
      this.roleList = rows
      this.total = total
    },
    // 根据id删除对应的角色信息
    async delRole(id) {
      const res = await this.$confirm('你确定删除该角色吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (res === 'confirm') {
        await delRoleById(id)
        this.$message.success('删除成功')
        await this.getRoleList()
      }
    },
    // 编辑角色信息
    async editRolePull(id) {
      this.roleForm = await getRoleInfoById(id)
      this.editVisible = true
    },
    // 添加角色
    addRolePull() {
      this.editVisible = true
    },
    // 提交更新角色信息
    updateRoleForm() {
      this.$refs.roleFormRef.validate(async valid => {
        if (valid) {
          if (this.roleForm.id) {
            await updateRole(this.roleForm)
            this.$message.success('更新成功！')
          } else {
            await addRole(this.roleForm)
            this.$message.success('添加成功！')
          }
          this.editVisible = false
          await this.getRoleList()
        }
      })
    },
    // 关闭弹窗,重置角色表单信息
    resetForm() {
      this.roleForm = {
        description: '',
        name: ''
      }
      this.$refs.roleFormRef.resetFields()
      this.editVisible = false
    },
    // 点击跳转的分页
    handleSizeChange(val) {
      this.queryInfo.pagesize = val
      this.getRoleList(this.queryInfo)
    },
    // 点击切换当前页
    handleCurrentChange(val) {
      this.queryInfo.page = val
      this.getRoleList(this.queryInfo)
    },
    // 根据公司Id获取企业信息
    // 切换Tabs时获取数据
    async checkTabs(tab) {
      if (tab.name === 'company') {
        this.companyList = await getCompanyInfoById(this.$store.getters.companyId)
      }
    },
    // 拉起分配权限框
    async assignPull(id) {
      this.roleId = id
      const res = await getPermissionList(id)
      this.permFormData = departListToTree(res, '0')
      const { permIds } = await getRoleInfoById(id)
      this.checkRoleId = permIds
      this.showPermDialog = true
    },
    // 关闭分配权限框
    closePermDialog() {
      this.checkRoleId = []
      this.showPermDialog = false
    },
    // 添加角色权限
    async updateRoleByPerm() {
      const res = this.$refs.roleByPermFormRef.getCheckedKeys()
      await assignPerm({ id: this.roleId, permIds: res })
      this.$message.success('添加成功')
      this.showPermDialog = false
    }
  },
  computed: {
    roleTitle() {
      return this.roleForm.id ? '编辑角色信息' : '添加新角色'
    }
  }
}
</script>

<style scoped>

</style>
