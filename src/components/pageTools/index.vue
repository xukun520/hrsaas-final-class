<template>
  <div>
    <el-card>
      <el-row type='flex' justify='space-between' align='middle'>
        <!-- 前面部门 -->
        <el-col>
          <el-tag v-if='showBefore' class='before'>
            <i class='el-icon-info'></i>
            <slot name='before'></slot>
          </el-tag>
        </el-col>
        <!-- 后面部分 -->
        <el-col>
          <el-row type='flex' justify='end'>
            <div class='after'>
              <slot name='after'></slot>
            </div>
          </el-row>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'index',
  props: {
    showBefore: {
      type: Boolean,
      default: false
    },
    showAfter: {
      type: Boolean,
      default: true
    }
  }
}
</script>

<style scoped>

</style>
