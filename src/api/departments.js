import request from '@/utils/request'

// 获取部门列表
export function getDepartment() {
  return request({
    url: '/company/department',
    method: 'GET'
  })
}

// 添加部门
export function addDepartment(data) {
  return request({
    url: '/company/department',
    method: 'POST',
    data
  })
}

// 根据部门id删除对应的部门
export function delDepartmentById(id) {
  return request({
    url: `/company/department/${id}`,
    method: 'DELETE'
  })
}

// 根据id获取对应部门信息
export function getDepartmentById(id) {
  return request({
    url: `/company/department/${id}`,
    method: 'GET'
  })
}

// 根据id修改部门信息
export function updateDepartmentById(data) {
  return request({
    url: `/company/department/${data.id}`,
    method: 'PUT'
  })
}
