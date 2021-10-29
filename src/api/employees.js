import request from '@/utils/request'

/****
 * 获取员工简单列表
 **/
export function getEmployeeSimple() {
  return request({
    url: '/sys/user/simple',
    method: 'GET'
  })
}

/***
 * 获取员工数据列表
 * */
export function getEmployees(params) {
  return request({
    url: '/sys/user',
    method: 'GET',
    params
  })
}

/***
 * 删除员工
 * */
export function delEmployees(id) {
  return request({
    url: `/sys/user/${id}`,
    method: 'DELETE'
  })
}

/** *
 * 添加员工
 * */
export function addEmployees(data) {
  return request({
    url: '/sys/user',
    method: 'POST',
    data
  })
}

/** *
 * 批量导入excel的员工信息
 * */
export function importEmployees(data) {
  return request({
    url: '/sys/user/batch',
    method: 'POST',
    data
  })
}

/***
 * 更新员工登录密码
 * */
export function updateUserById(data) {
  return request({
    url: `/sys/user/${data.id}`,
    method: 'PUT',
    data
  })
}

/** *
 *  读取用户详情的基础信息
 * **/
export function getPersonalDetail(id) {
  return request({
    url: `/employees/${id}/personalInfo`
  })
}

/** *
 *  更新用户详情的基础信息
 * **/
export function updatePersonal(data) {
  return request({
    url: `/employees/${data.userId}/personalInfo`,
    method: 'put',
    data
  })
}

/** **
 * 获取用户的岗位信息
 *
 * ****/
export function getJobDetail(id) {
  return request({
    url: `/employees/${id}/jobs`
  })
}

/**
 * 保存岗位信息
 * ****/
export function updateJob(data) {
  return request({
    url: `/employees/${data.userId}/jobs`,
    method: 'PUT',
    data
  })
}

/**
 * 分配员工权限
 * ****/
export function updateAssignRole(data) {
  return request({
    url: '/sys/user/assignRoles',
    method: 'PUT',
    data
  })
}
