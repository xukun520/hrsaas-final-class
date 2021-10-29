<template>
  <div class='dashboard-container'>
    <div class='app-container'>
      <page-tools>
        <template v-slot:after>
          <el-button size='small' type='primary' @click='addPermForm(1,"0")'>添加权限</el-button>
        </template>
      </page-tools>
      <!-- table区域 -->
      <el-table border :data='permissionList' row-key='id'>
        <el-table-column header-align='center' label='名称' prop='name'></el-table-column>
        <el-table-column align='center' label='标识' prop='code'></el-table-column>
        <el-table-column align='center' label='描述' prop='description'></el-table-column>
        <el-table-column align='center' label='操作'>
          <template v-slot='{row}'>
            <el-button v-if='row.type===1' type='text' @click='addPermForm(2,row.id)'>添加</el-button>
            <el-button type='text' @click='editPerm(row.id)'>编辑</el-button>
            <el-button type='text' @click='delPermissionById(row.id)'>删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 添加编辑弹框 -->
      <el-dialog :title='showTitle'
                 :visible.sync='showDialog'
                 @close='closeDialog'
                 center
      >
        <el-form ref='permFormRef' :rules='permFormRule' :model='formData' label-width='80px'>
          <el-form-item label='名称' prop='name'>
            <el-input v-model='formData.name'></el-input>
          </el-form-item>
          <el-form-item label='标识' prop='code'>
            <el-input v-model='formData.code'></el-input>
          </el-form-item>
          <el-form-item label='描述'>
            <el-input v-model='formData.description'></el-input>
          </el-form-item>
          <el-form-item label='开启'>
            <el-switch active-value='0'
                       inactive-value='1'
                       v-model='formData.enVisible'
            />
          </el-form-item>
        </el-form>
        <el-row type='flex' justify='center' slot='footer'>
          <el-col :span='6'>
            <el-button size='small' type='primary' @click='addPerm'>确定</el-button>
            <el-button size='small' @click='closeDialog'>取消</el-button>
          </el-col>
        </el-row>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import {
  getPermissionList,
  delPermission,
  addPermission,
  updatePermission,
  getPermissionDetail
} from '@/api/permission'
import { departListToTree } from '@/utils'

export default {
  name: 'index',
  data() {
    return {
      permissionList: [],
      showDialog: false,
      formData: {
        name: '', // 名称
        code: '', // 标识
        description: '', // 描述
        type: '', // 类型 该类型 不需要显示 因为点击添加的时候已经知道类型了
        pid: '', // 因为做的是树 需要知道添加到哪个节点下了
        enVisible: '0' // 开启
      },
      permFormRule: {
        name: [{ required: true, message: '权限节点名不能为空', trigger: 'blur' }],
        code: [{ required: true, message: '权限节点标识不能为空', trigger: 'blur' }]
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    // 获取所有的权限数据列
    async getList() {
      this.permissionList = departListToTree(await getPermissionList(), '0')
    },
    // 删除权限
    async delPermissionById(id) {
      const result = await this.$confirm('你确定要删除该权限点?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (result === 'confirm') {
        await delPermission(id)
        this.$message.success('删除成功')
        await this.getList()
      }
    },
    // 拉起添加权限点框
    addPermForm(type, pid) {
      this.formData.type = type
      this.formData.pid = pid
      this.showDialog = true
    },
    // 添加权限点
    addPerm() {
      this.$refs.permFormRef.validate().then(() => {
        if (this.formData.id) return updatePermission(this.formData)
        return addPermission(this.formData)
      }).then(() => {
        this.$message.success('操作成功')
        this.getList()
        this.showDialog = false
      }).catch(err => err)
    },
    // 关闭添加权限点框
    closeDialog() {
      this.formData = {
        name: '',
        code: '',
        description: '',
        type: '',
        pid: '',
        enVisible: '0'
      }
      this.$refs.permFormRef.resetFields()
      this.showDialog = false
    },
    // 编辑权限点
    async editPerm(id) {
      this.formData = await getPermissionDetail(id)
      this.showDialog = true
    }
  },
  computed: {
    showTitle() {
      return this.formData.id ? '编辑权限' : '添加权限'
    }
  }
}
</script>

<style scoped>
.el-table {
  margin-top: 10px;
}
</style>
