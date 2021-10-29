import store from '@/store/index'
import router from '@/router/index'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

const writePage = ['/login', '/404']
router.beforeEach(async(to, from, next) => {
  NProgress.start()
  // 是否有token
  if (store.getters.token) {
    // 是否访问登录页
    if (to.path === '/login') {
      next('/')
    } else {
      // 是否有用户信息
      if (!store.getters.userId) {
        // 没有，发起请求获取用户信息
        const { roles } = await store.dispatch('user/getUserInfo')
        const routes = await store.dispatch('permission/filterRoutes', roles.menus)
        router.addRoutes([...routes, { path: '*', redirect: '/404', hidden: true }])
        next(to.path)
      } else {
        next()
      }
    }
  } else {
    // 没有token
    if (writePage.indexOf(to.path) > -1) {
      next()
    } else {
      next('/login')
    }
    NProgress.done()
  }
})
router.afterEach(() => {
  NProgress.done()
})
