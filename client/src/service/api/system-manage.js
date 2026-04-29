import { request } from '../request'

/** 获取角色列表 */
export function fetchGetRoleList(params) {
  return request({
    url: '/systemManage/getRoleList',
    method: 'get',
    params
  })
}

/**
 * 获取全部角色
 *
 * 返回的角色均为启用状态
 */
export function fetchGetAllRoles() {
  return request({
    url: '/systemManage/getAllRoles',
    method: 'get'
  })
}

/** 获取用户列表 */
export function fetchGetUserList(params) {
  return request({
    url: '/systemManage/getUserList',
    method: 'get',
    params
  })
}

/**
 * 获取菜单列表
 *
 * @deprecated 将在下个版本 1.1.0 移除
 */
export function fetchGetMenuListV1() {
  return request({
    url: '/systemManage/getMenuList',
    method: 'get'
  })
}

/** 获取菜单列表 */
export function fetchGetMenuList() {
  return request({
    url: '/systemManage/getMenuList/v2',
    method: 'get'
  })
}

/** 获取全部页面 */
export function fetchGetAllPages() {
  return request({
    url: '/systemManage/getAllPages',
    method: 'get'
  })
}

/** 获取菜单树 */
export function fetchGetMenuTree() {
  return request({
    url: '/systemManage/getMenuTree',
    method: 'get'
  })
}
