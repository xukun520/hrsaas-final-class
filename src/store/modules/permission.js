import { constantRoutes, asyncRouter } from '@/router'

const state = {
  // 默认为静态路由权限
  routes: constantRoutes
}
const mutations = {
  setRoutes(state, newRoutes) {
    state.routes = [...constantRoutes, ...newRoutes]
  }
}
const actions = {
  filterRoutes({ commit }, menus) {
    const routesArr = []
    menus.forEach(item => {
      routesArr.push(...asyncRouter.filter(key => key.name === item))
    })
    commit('setRoutes', routesArr)
    return routesArr
  }
}

export default {
  namespaced: true,
  state,
  actions,
  mutations
}
