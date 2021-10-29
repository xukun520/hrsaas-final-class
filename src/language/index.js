import Vue from 'vue'
import VueI18n from 'vue-i18n'
import Cookie from 'js-cookie'
import elementZh from 'element-ui/lib/locale/lang/zh-CN'
import elementEn from 'element-ui/lib/locale/lang/en'
import elementJa from 'element-ui/lib/locale/lang/ja'
import myZh from './lib/zh'
import myEn from './lib/en'

Vue.use(VueI18n)
export default new VueI18n({
  locale: Cookie.get('language') || 'en',
  messages: {
    zh: { ...elementZh, ...myZh },
    en: { ...elementEn, ...myEn },
    ja: { ...elementJa }
  }
})
