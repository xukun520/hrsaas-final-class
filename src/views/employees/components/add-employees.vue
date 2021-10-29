<template>
  <el-dialog
    title='添加员工'
    :visible.sync='visible'
    align='center'
    width='50%'
    :close-on-click-modal='false'
    @close='resetForm'
  >
    <!-- 表单 -->
    <el-form :model='addForm' :rules='addFormRules' ref='addFormRef' label-width='100px'>
      <el-form-item label='姓名' prop='username'>
        <el-input v-model='addForm.username' placehelder='请输入员工姓名'></el-input>
      </el-form-item>
      <el-form-item label='电话' prop='mobile'>
        <el-input v-model='addForm.mobile' placehelder='请输入员工电话'></el-input>
      </el-form-item>
      <el-form-item label='入职时间' prop='timeOfEntry'>
        <el-date-picker style='width: 100%' v-model='addForm.timeOfEntry' placeholder='请选择入职时间' />
      </el-form-item>
      <el-form-item label='聘用形式' prop='formOfEmployment'>
        <el-select v-model='addForm.formOfEmployment' placeholder='请选择聘用形式' style='width: 100%'>
          <el-option :label='item.value' :value='item.id' v-for='item in getEnum' :key='item.id' />
        </el-select>
      </el-form-item>
      <el-form-item label='工号' prop='workNumber'>
        <el-input v-model='addForm.workNumber' placehelder='请输入工号'></el-input>
      </el-form-item>
      <el-form-item label='部门' prop='departmentName'>
        <!--        <el-input v-model='addForm.departmentName' placehelder='请输入部门'></el-input>-->
        <el-cascader
          :options='treeData'
          clearable
          v-loading='loading'
          v-model='addForm.departmentName'
          style='width: 100%'
          @focus='getDepart'
          :props='options'
          placeholder='请选择部门'
          @change='departChange'
        ></el-cascader>
      </el-form-item>
      <el-form-item label='转正时间' prop='correctionTime'>
        <el-date-picker style='width: 100%' v-model='addForm.correctionTime' placeholder='请选择转正时间' />
      </el-form-item>
    </el-form>
    <el-row slot='footer' type='flex' justify='center'>
      <el-button size='small' @click='resetForm'>取 消</el-button>
      <el-button size='small' type='primary' @click='addEmployees'>确 定</el-button>
    </el-row>
  </el-dialog>
</template>

<script>
import { checkPhone } from '@/filters'
import { getDepartment } from '@/api/departments'
import { departListToTree } from '@/utils'
import employEnum from '@/api/constant/employees'
import { addEmployees } from '@/api/employees'

export default {
  name: 'add-employees',
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    getEnum() {
      return employEnum.hireType
    }
  },
  data() {
    return {
      addForm: {
        username: '',
        mobile: '',
        formOfEmployment: '',
        workNumber: '',
        departmentName: '',
        timeOfEntry: '',
        correctionTime: ''
      },
      addFormRules: {
        username: [
          { required: true, message: '名字不能为空', trigger: 'blur' },
          { min: 1, max: 4, message: '用户姓名为1-4位' }
        ],
        mobile: [{ validator: checkPhone, trigger: 'blur' }],
        formOfEmployment: [{ required: true, message: '聘用形式不能为空', trigger: 'blur' }],
        workNumber: [{ required: true, message: '工号不能为空', trigger: 'blur' }],
        departmentName: [{ required: true, message: '部门不能为空', trigger: 'blur' }],
        timeOfEntry: [{ required: true, message: '入职时间', trigger: 'blur' }]
      },
      // 部门选择级联选择配置项
      options: {
        expandTrigger: 'hover',
        checkStrictly: true,
        label: 'name',
        value: 'name',
        children: 'children'
      },
      treeData: [],
      loading: false
    }
  },
  methods: {
    // 重置表单
    resetForm() {
      this.addForm = {
        username: '',
        mobile: '',
        formOfEmployment: '',
        workNumber: '',
        departmentName: '',
        timeOfEntry: '',
        correctionTime: ''
      }
      this.$refs.addFormRef.resetFields()
      this.$emit('update:visible', false)
    },
    // 选择部门
    departChange(val) {
      this.addForm.departmentName = val[0]
    },
    // 获取所有部门
    async getDepart() {
      this.loading = true
      const { depts } = await getDepartment()
      this.treeData = departListToTree(depts, '')
      this.loading = false
    },
    // 添加员工
    addEmployees() {
      try {
        this.$refs.addFormRef.validate(async valid => {
          if (valid) {
            await addEmployees(this.addForm)
            this.$message.success('添加成功')
            this.$emit('update:visible', false)
            await this.$parent.getEmployeesList() && this.$parent.getEmployeesList()
          }
        })
      } catch (err) {
        console.log(err)
      }

    }
  }
}
</script>

<style scoped>

</style>
