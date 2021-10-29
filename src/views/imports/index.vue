<template>
  <div>
    <el-card>
      <el-row>
        <el-breadcrumb separator-class='el-icon-arrow-right'>
          <el-breadcrumb-item :to="{ path: '/employees' }">员工信息</el-breadcrumb-item>
          <el-breadcrumb-item>员工信息导入</el-breadcrumb-item>
        </el-breadcrumb>
      </el-row>
      <el-row>
        <upload-excel :on-success='fileSuccess'></upload-excel>
      </el-row>
    </el-card>
  </div>
</template>

<script>
import { importEmployees } from '@/api/employees'

export default {
  name: 'index',
  data() {
    return {}
  },
  methods: {
    async fileSuccess({ header, results }) {
      const userRelations = {
        '入职日期': 'timeOfEntry',
        '手机号': 'mobile',
        '姓名': 'username',
        '转正日期': 'correctionTime',
        '工号': 'workNumber'
      }
      const employArr = results.map(item => {
        const obj = {}
        Object.keys(item).forEach(key => {
          if (userRelations[key] === 'timeOfEntry' || userRelations[key] === 'correctionTime') {
            obj[userRelations[key]] = new Date(this.formatDate(item[key], '/'))
          } else {
            obj[userRelations[key]] = item[key]
          }
        })
        return obj
      })
      await importEmployees(employArr)
      this.$message.success('导入成功')
      this.$router.back()
    },
    formatDate(numb, format) {
      const time = new Date((numb - 1) * 24 * 3600000 + 1)
      time.setYear(time.getFullYear() - 70)
      const year = time.getFullYear() + ''
      const month = time.getMonth() + 1 + ''
      const date = time.getDate() - 1 + ''
      if (format && format.length === 1) {
        return year + format + month + format + date
      }
      return year + (month < 10 ? '0' + month : month) + (date < 10 ? '0' + date : date)
    }
  }
}
</script>

<style scoped>

</style>
