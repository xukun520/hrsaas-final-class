import { getToken, setToken, removeToken, setTokenTimeOut } from '@/utils/auth'
import { login, getInfo, getAvatar } from '@/api/user'
import { resetRouter } from '@/router'

const state = {
  token: getToken(),
  userInfo: {}
}
const mutations = {
  // 分配token
  getLoginToken(state, token) {
    state.token = token
    setToken(token)
  },
  // 存储用户信息
  setUserInfo(state, info) {
    state.userInfo = { ...info }
  },
  // 退出登录，删除用户信息
  removeUserInfo(state) {
    state.userInfo = {}
  },
  // 删除token
  removeLoginToken(state) {
    state.token = null
    removeToken()
  }
}
const actions = {
  // 发起登录请求
  async userLogin({ commit }, data) {
    // axios拦截器响应成功，返回token
    const res = await login(data)
    // 在cookie中存储token
    commit('getLoginToken', res)
    // 记录登录时，token的时间截
    setTokenTimeOut()
  },
  // 获取用户信息
  async getUserInfo({ commit }) {
    // 获取用户基本信息
    const res1 = await getInfo()
    // 获取用户携带头像的信息
    const res2 = await getAvatar(res1.userId)
    const res = { ...res1, ...res2 }
    commit('setUserInfo', res)
    return res
  },
  // 退出登录
  logout({ commit }) {
    commit('removeLoginToken')
    commit('removeUserInfo')
    // 清除动态路由参数
    resetRouter()
    commit('permission/setRoutes', [], { root: true })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
