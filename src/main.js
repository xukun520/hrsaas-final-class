import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
// import locale from 'element-ui/lib/locale/lang/en' // lang i18n
import i18n from '@/language'
import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'

import '@/icons' // icon
import '@/permission' // permission control
import * as directives from '@/directives' // all directives
import * as filters from '@/filters' // all filters
import Components from '@/components/index' // install components
import Print from 'vue-print-nb' // install Print
import CheckPermission from '@/mixin/checkPermission'

// 全局混入检查点击权限方法
Vue.mixin(CheckPermission)
// 全局注册自定义组件
Vue.use(Components)
// 注册打印组件
Vue.use(Print)
// 注册全部自定义指令
Object.keys(directives).forEach(i => {
  Vue.directive(i, directives[i])
})
// 注册自定义过滤器
Object.keys(filters).forEach(i => {
  Vue.filter(i, filters[i])
})
// set ElementUI lang to EN
// Vue.use(ElementUI, { locale })
// 如果想要中文版 element-ui，按如下方式声明
Vue.use(ElementUI, {
  i18n: (key, value) => i18n.t(key, value)
})

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  i18n,
  store,
  render: h => h(App)
})
