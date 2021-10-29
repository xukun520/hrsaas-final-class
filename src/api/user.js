import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/sys/login',
    method: 'POST',
    data
  })
}

// 获取用户登录信息
export function getInfo() {
  return request({
    url: '/sys/profile',
    method: 'POST'
  })
}

// 获取用户头像
export function getAvatar(id) {
  return request({
    url: `/sys/user/${id}`,
    method: 'GET'
  })
}
