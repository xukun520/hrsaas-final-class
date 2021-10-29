import axios from 'axios'
import { Message } from 'element-ui'
import store from '@/store'
import router from '@/router'
import { isValidToken } from '@/utils/validToken'

const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API,
  timeout: 8000
})

// 请求拦截器
service.interceptors.request.use(config => {
  if (store.getters.token) {
    // 前端自定义时间截，判断token是否失效
    if (isValidToken()) {
      // token失效
      store.dispatch('user/logout')
      router.push('/login')
      Message.error('token失效，请重新登录')
      return Promise.reject(new Error('token失效，请重新登录'))
    }
    config.headers['Authorization'] = `Bearer ${store.getters.token}`
  }
  return config
}, error => {
  return Promise.reject(error)
})
// 请求响应拦截器
service.interceptors.response.use(res => {
  const { data, message, success } = res.data
  if (success) {
    return data
  } else {
    Message.error(message)
    return Promise.reject(new Error(message))
  }
}, error => {
  // 服务端返回状态，判断token是否失效
  if (error.response && error.response.data && error.response.data.code === 10002) {
    store.dispatch('user/logout')
    router.push('/login')
  } else {
    Message.error(error)
  }
  return Promise.reject(error)
})

export default service
