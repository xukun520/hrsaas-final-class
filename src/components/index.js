// 全局注册组件
import pageTools from '@/components/pageTools'
import UploadExcel from './UploadExcel'
import ImageUpload from './ImageUpload'
import ScreenFull from './FullScreen'
import ThemePicker from './ThemePicker'
import Lang from './Lang'

export default {
  install(Vue) {
    Vue.component('pageTools', pageTools)
    Vue.component('UploadExcel', UploadExcel)
    Vue.component('ImageUpload', ImageUpload)
    Vue.component('ScreenFull', ScreenFull)
    Vue.component('ThemePicker', ThemePicker)
    Vue.component('Lang', Lang)
  }
}
