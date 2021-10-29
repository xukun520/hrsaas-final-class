<template>
  <el-row type='flex' justify='space-between' align='middle' style='height: 40px;width: 100%'>
    <el-col :span='20'>
      <i class='el-icon-office-building'></i>
      <span>{{ treeNode.name }}</span>
    </el-col>
    <el-col :span='4'>
      <el-row type='flex' justify='end' align='middle'>
        <el-col>
          <span>{{ treeNode.manager }}</span>
        </el-col>
        <el-col>
          <!-- 下拉菜单 -->
          <el-dropdown @command='changeDepartments'>
            <span>
              操作<i class='el-icon-arrow-down' />
            </span>
            <el-dropdown-menu slot='dropdown'>
              <el-dropdown-item command='add'>添加子部门</el-dropdown-item>
              <el-dropdown-item v-if='!isRoot' command='edit'>编辑部门</el-dropdown-item>
              <el-dropdown-item v-if='!isRoot' command='del'>删除部门</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-col>
      </el-row>
    </el-col>
  </el-row>
</template>

<script>
import { delDepartmentById } from '@/api/departments'

export default {
  name: 'tree-tools',
  props: {
    treeNode: {
      type: Object,
      required: true
    },
    isRoot: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    async changeDepartments(command) {
      if (command === 'edit') {
        // 编辑
        this.$emit('editDialogPull', this.treeNode)
      }
      if (command === 'add') {
        // 添加
        this.$emit('addDialogPull', this.treeNode)
      }
      if (command === 'del') {
        // 删除
        const res = await this.$confirm('你确定要删除吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err => err)
        if (res === 'confirm') {
          await delDepartmentById(this.treeNode.id)
          this.$emit('delDepts')
          this.$message.success('删除成功')
        }
      }

    }
  }
}
</script>

<style scoped>
.el-row {
  letter-spacing: .2em;
  font-family: '楷体', sans-serif;
}

.el-dropdown > span {
  display: block;
  width: 60px;
}
</style>
