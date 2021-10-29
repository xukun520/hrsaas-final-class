let obj = [
  {
    username: 'zs',
    mobile: 1
  },
  {
    username: 'ls',
    mobile: 2
  }
]
const headers = {
  '姓名': 'username',
  '手机号': 'mobile'
}
let a = obj.map(item => {
  return Object.keys(headers).map(key=>{
    return item[headers[key]]
  })
})
console.log(a)
