// 默认头像
export const imagerr = {
  inserted: function(el, options) {
    el.src = el.src || options.value
    el.onerror = function() {
      el.src = options.value
    }
  },
  componentUpdated(el, options) {
    el.src = el.src || options.value
  }
}
