import request from '@/utils/request'

// 获取公司角色列表
export function getRoleList(params) {
  return request({
    url: '/sys/role',
    method: 'GET',
    params
  })
}

// 根据公司id获取信息
export function getCompanyInfoById(companyId) {
  return request({
    url: `/company/${companyId}`,
    method: 'GET'
  })
}

// 根据Id删除对应角色信息
export function delRoleById(id) {
  return request({
    url: `/sys/role/${id}`,
    method: 'DELETE'
  })
}

// 根据id获取角色详情
export function getRoleInfoById(id) {
  return request({
    url: `/sys/role/${id}`,
    method: 'GET'
  })
}

// 根据ID更新角色
export function updateRole(data) {
  return request({
    url: `/sys/role/${data.id}`,
    method: 'PUT',
    data
  })
}

// 添加新角色
export function addRole(data) {
  return request({
    url: '/sys/role',
    method: 'POST',
    data
  })
}
// 分配权限
export function assignPerm(data) {
  return request({
    url: '/sys/role/assignPrem',
    method: 'put',
    data
  })
}
