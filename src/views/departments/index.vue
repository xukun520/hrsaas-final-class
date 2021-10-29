<template>
  <div class='dashboard-container'>
    <div class='app-container'>
      <el-card class='tree-card'>
        <!-- 头部区域 -->
        <tree-tools :tree-node='company'
                    @addDialogPull='addDepartment'
                    :is-root='true'
        />
        <!-- 内容区域 -->
        <el-tree :data='departs' :props='defaultProps' default-expand-all>
          <tree-tools slot-scope='{data}'
                      @delDepts='getDepartmentList'
                      @addDialogPull='addDepartment'
                      @editDialogPull='editDepartment'
                      :tree-node='data'
          />
        </el-tree>
        <!-- 添加部门组件 -->
        <add-depart :dialog-visible.sync='dialogVisible'
                    @updateDepart='getDepartmentList'
                    :tree-node='node'
                    ref='editRef'
        ></add-depart>
      </el-card>
    </div>
  </div>
</template>

<script>
import TreeTools from './components/tree-tools'
import AddDepart from './components/add-depart'
import { getDepartment } from '@/api/departments'
import { departListToTree } from '@/utils'

export default {
  name: 'index',
  components: {
    AddDepart,
    TreeTools
  },
  created() {
    this.getDepartmentList()
  },
  data() {
    return {
      defaultProps: {
        label: 'name'
      },
      company: {
        name: '',
        manager: ''
      },
      departs: [],
      dialogVisible: false,
      node: null
    }
  },
  methods: {
    // 获取部门信息
    async getDepartmentList() {
      const res = await getDepartment()
      this.company = {
        name: res.companyName,
        manger: res.companyManage || '负责人',
        id: ''
      }
      this.departs = departListToTree(res.depts, '')
    },
    // 添加部门
    addDepartment(node) {
      this.dialogVisible = true
      this.node = node
    },
    // 编辑部门信息
    editDepartment(node) {
      this.dialogVisible = true
      this.node = node
      this.$refs.editRef.editDepartments(this.node.id)
    }
  }
}
</script>

<style scoped>
.tree-card {
  padding: 30px 140px;
  font-size: 14px;
}
</style>
