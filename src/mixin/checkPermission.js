import store from '@/store'

export default {
  methods: {
    checkPermission(key) {
      const userInfo = store.getters.userInfo
      if (userInfo.roles && userInfo.roles.points) {
        return userInfo.roles.points.some(item => item === key)
      }
      return false
    }
  }
}
