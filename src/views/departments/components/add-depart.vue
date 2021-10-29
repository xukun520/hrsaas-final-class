<template>
  <el-dialog :title='toggleTitle'
             align='center'
             width='50%'
             :visible='DialogVisible'
             @close='resetForm'
  >
    <!-- 表单域 -->
    <el-form label-width='120px' ref='addFormRef' :model='addForm' :rules='addFormRules'>
      <el-form-item label='部门名称' prop='name'>
        <el-input placeholder='1-50个字符' v-model.trim='addForm.name' />
      </el-form-item>
      <el-form-item label='部门编码' prop='code'>
        <el-input placeholder='1-50个字符' v-model.trim='addForm.code' />
      </el-form-item>
      <el-form-item label='部门负责人' prop='manager'>
        <el-select placeholder='请选择' @focus='getManager' clearable v-model.trim='addForm.manager'>
          <el-option
            v-for='item in employeesInfo'
            :key='item.id'
            :label='item.username'
            :value='item.username'
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label='部门介绍' prop='introduce'>
        <el-input placeholder='1-300个字符' type='textarea' :rows='3' v-model.trim='addForm.introduce' />
      </el-form-item>
    </el-form>
    <el-row slot='footer' type='flex' justify='center' align='middle'>
      <el-col :span='6'>
        <el-button size='small' @click='resetForm'>取 消</el-button>
        <el-button size='small' type='primary' @click='addDepartments'>确 定</el-button>
      </el-col>
    </el-row>
  </el-dialog>
</template>

<script>
import { getDepartment, addDepartment, getDepartmentById, updateDepartmentById } from '@/api/departments'
import { getEmployeeSimple } from '@/api/employees'

export default {
  name: 'add-depart',
  props: {
    DialogVisible: {
      type: Boolean,
      default: false
    },
    treeNode: {
      type: Object,
      default: null
    },
    editData: {
      type: Object,
      default: null
    }
  },
  data() {
    // 校验部门名称是否重复
    const checkNameRepeat = async(rule, value, callback) => {
      const { depts } = await getDepartment()
      let res = null
      if (this.addForm.id) {
        res = depts.filter(item => (item.pid === this.addForm.pid && item.id !== this.addForm.id)).some(item => item.name === value)
      } else {
        res = depts.filter(item => item.pid === this.treeNode.id).some(item => item.name === value)
      }
      res ? callback(new Error(`同级目录下已经存在${value}部门了`)) : callback()
    }
    // 校验编码是否重复
    const checkCodeRepeat = async(rule, value, callback) => {
      const { depts } = await getDepartment()
      let res = null
      if (this.addForm.id) {
        res = depts.filter(item => item.id !== this.addForm.id).some(item => item.code === value && value)
      } else {
        res = depts.some(item => item.code === value && value)
      }
      res ? callback(new Error(`组织架构中已经存在【${value}】这个编码了`)) : callback()
    }
    return {
      // 表单数据
      addForm: {
        code: '',
        introduce: '',
        manager: '',
        name: ''
      },
      // 校验表单规则
      addFormRules: {
        name: [
          { required: true, message: '该字段不能为空', trigger: 'blur' },
          { min: 1, max: 50, message: '长度为1-50个字符', trigger: 'blur' },
          { trigger: 'blur', validator: checkNameRepeat }
        ],
        code: [
          { required: true, message: '该字段不能为空', trigger: 'blur' },
          { min: 1, max: 50, message: '长度为1-50个字符', trigger: 'blur' },
          { trigger: 'blur', validator: checkCodeRepeat }
        ],
        manager: [
          { required: true, message: '该字段不能为空', trigger: 'blur' }
        ],
        introduce: [
          { required: true, message: '该字段不能为空', trigger: 'blur' },
          { min: 1, max: 300, message: '长度为1-300个字符', trigger: 'blur' }
        ]
      },
      // 员工简单信息
      employeesInfo: []
    }
  },
  computed: {
    toggleTitle() {
      return this.addForm.id ? '编辑部门' : '新增部门'
    }
  },
  methods: {
    // 获取员工简单信息
    async getManager() {
      this.employeesInfo = await getEmployeeSimple()
    },
    // 关闭dialog时,重置表单
    resetForm() {
      this.addForm = {
        code: '',
        introduce: '',
        manager: '',
        name: ''
      }
      this.$refs.addFormRef.resetFields()
      this.$emit('update:dialog-visible', false)
    },
    // 提交表单，添加部门数据
    addDepartments() {
      this.$refs.addFormRef.validate(async valid => {
        if (valid) {
          if (this.addForm.id) {
            // 修改表单信息
            await updateDepartmentById(this.addForm)
            this.$message.success('修改成功')
          } else {
            // 添加表单信息
            const data = { ...this.addForm, pid: this.treeNode.id }
            await addDepartment(data)
            this.$message.success('添加成功')
          }
          this.$emit('update:dialog-visible', false)
          this.$emit('updateDepart')
        }
      })
    },
    // 获取部门信息，回写数据
    async editDepartments(id) {
      this.addForm = await getDepartmentById(id)
    }
  }
}
</script>

<style scoped>
.el-select {
  width: 100%;
}
</style>
