<template>
  <div class='dashboard-container'>
    <div class='app-container'>
      <el-card>
        <el-row style='margin-bottom: 15px'>
          <el-breadcrumb separator-class='el-icon-arrow-right'>
            <el-breadcrumb-item :to="{ path: '/employees' }">员工信息</el-breadcrumb-item>
            <el-breadcrumb-item>基本信息</el-breadcrumb-item>
          </el-breadcrumb>
        </el-row>
        <el-row>
          <el-tabs v-model='tabActive'>
            <el-tab-pane label='登录账户设置' name='first'>
              <el-row type='flex' justify='center'>
                <el-col :span='12'>
                  <el-form :model='loginForm'
                           :rules='loginFormRules'
                           ref='loginFormRef'
                           label-width='100px'
                  >
                    <el-form-item label='用户名' label-width='120px' prop='username'>
                      <el-input placeholder='请输入用户名' v-model='loginForm.username'></el-input>
                    </el-form-item>
                    <el-form-item label='密码' label-width='120px' prop='password2'>
                      <el-input placeholder='请输入密码' v-model='loginForm.password2' show-password></el-input>
                    </el-form-item>
                    <el-form-item label-width='120px'>
                      <el-button type='primary' size='small' @click='updateCurrentUser'>更 新</el-button>
                    </el-form-item>
                  </el-form>
                </el-col>
              </el-row>
            </el-tab-pane>
            <el-tab-pane label='个人详情' name='second'>
              <component :is='userComponent'></component>
            </el-tab-pane>
            <el-tab-pane label='岗位信息' name='third'>
              <component :is='jobComponent'></component>
            </el-tab-pane>
          </el-tabs>
        </el-row>
      </el-card>
    </div>
  </div>
</template>

<script>
import { getAvatar } from '@/api/user'
import { updateUserById } from '@/api/employees'
import userInfo from '@/views/employees/components/user-info'
import jobInfo from '@/views/employees/components/job-info'

export default {
  name: 'detail',
  components: {
    userInfo,
    jobInfo
  },
  data() {
    return {
      userComponent: 'userInfo',
      jobComponent: 'jobInfo',
      userId: this.$route.params.id,
      tabActive: 'first',
      loginForm: {
        username: '',
        password2: ''
      },
      loginFormRules: {
        username: [
          { required: true, message: '用户名不能为空', trigger: 'blur' },
          { min: 2, max: 8, message: '用户名为2-8个字符', trigger: 'blur' }
        ],
        password2: [
          { required: true, message: '密码不能为空', trigger: 'blur' },
          { min: 6, max: 16, message: '密码长度为6-16位', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.getCurrentUserInfo()
  },
  methods: {
    // 获取当前用户基本信息
    async getCurrentUserInfo() {
      this.loginForm = await getAvatar(this.userId)
    },
    // 提交修改信息
    updateCurrentUser() {
      this.$refs.loginFormRef.validate(async valid => {
        if (valid) {
          await updateUserById({ ...this.loginForm, password: this.loginForm.password2 })
          this.$message.success('更新成功')
          await this.getCurrentUserInfo()
        }
      })
    }
  }
}
</script>

<style scoped>
.el-input {
  width: 240px;
}
</style>
