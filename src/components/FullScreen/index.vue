<template>
  <div>
    <svg-icon icon-class='fullscreen'
              class='screen'
              :title='title'
              @click='changeScreen'
    />
  </div>
</template>

<script>
import screenFull from 'screenfull'

export default {
  name: 'index',
  data() {
    return {
      title: '全屏'
    }
  },
  methods: {
    changeScreen() {
      if (!screenFull.isEnabled) {
        return this.$message.warning('全屏插件不可用')
      }
      screenFull.toggle()
    }
  }
}
</script>

<style scoped>
.screen {
  color: #ac23bb;
  cursor: pointer;
  width: 18px;
  height: 18px
}
</style>
