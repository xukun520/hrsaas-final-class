<template>
  <el-dialog title='权限设置'
             :visible.sync='showVisible'
             @close='closeVisible'
             width='50%' center
  >
    <!-- 角色选项 -->
    <el-checkbox-group v-model='roleIds'>
      <el-checkbox v-for='item in roleList' :key='item.id' :label='item.id'>
        {{ item.name }}
      </el-checkbox>
    </el-checkbox-group>
    <!-- 底部按钮 -->
    <el-row solt='footer' type='flex' justify='center'>
      <el-col :span='60'>
        <el-button size='small' type='primary' @click='assignRole'>确 定</el-button>
        <el-button size='small' @click='closeVisible'>取 消</el-button>
      </el-col>
    </el-row>
  </el-dialog>
</template>

<script>
import { getRoleList } from '@/api/setting'
import { getAvatar } from '@/api/user'
import { updateAssignRole } from '@/api/employees'

export default {
  name: 'assign-role',
  props: {
    showVisible: {
      default: false,
      type: Boolean
    },
    userId: {
      type: String,
      default: null
    }
  },
  created() {
    this.getRoleList()
  },
  data() {
    return {
      roleList: [],
      queryInfo: {
        page: 1,
        pagesize: 20
      },
      roleIds: []
    }
  },
  methods: {
    // 获取所有的权限
    async getRoleList() {
      const { rows } = await getRoleList(this.queryInfo)
      this.roleList = rows
    },
    // 获取当前员工拥有的权限Id
    async getAvatar(id) {
      const { roleIds } = await getAvatar(id)
      this.roleIds = roleIds
    },
    // 更新用户权限
    async assignRole() {
      await updateAssignRole({ id: this.userId, roleIds: this.roleIds })
      this.$message.success('更新角色成功')
      this.$emit('update:show-visible', false)
    },
    closeVisible() {
      this.roleIds = []
      this.$emit('update:show-visible', false)
    }
  }
}
</script>

<style scoped>

</style>
