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

/** 获取角色菜单ID */
export function fetchGetRoleRouteIds(params) {
  return request({
    url: '/systemManage/getRoleRouteIds',
    method: 'get',
    params
  })
}

/** 更新角色菜单ID */
export function fetchUpdateRoleRouteIds(data) {
  return request({
    url: '/systemManage/updateRoleRouteIds',
    method: 'post',
    data
  })
}

/** 获取角色按钮ID */
export function fetchGetRoleButtonIds(params) {
  return request({
    url: '/systemManage/getRoleButtonIds',
    method: 'get',
    params
  })
}

/** 更新角色按钮ID */
export function fetchUpdateRoleButtonIds(data) {
  return request({
    url: '/systemManage/updateRoleButtonIds',
    method: 'post',
    data
  })
}

/** 获取全部按钮 */
export function fetchGetAllButtons() {
  return request({
    url: '/systemManage/getAllButtons',
    method: 'get'
  })
}

/** 新增角色 */
export function fetchCreateRole(data) {
  return request({
    url: '/systemManage/saveRole',
    method: 'post',
    data
  })
}

/** 更新角色 */
export function fetchUpdateRole(data) {
  return request({
    url: '/systemManage/updateRole',
    method: 'post',
    data
  })
}

/** 删除角色 */
export function fetchDeleteRole(data) {
  return request({
    url: '/systemManage/deleteRole',
    method: 'post',
    data
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

/** 新增菜单 */
export function fetchCreateMenu(data) {
  return request({
    url: '/systemManage/saveMenu',
    method: 'post',
    data
  })
}

/** 更新菜单 */
export function fetchUpdateMenu(data) {
  return request({
    url: '/systemManage/updateMenu',
    method: 'post',
    data
  })
}

/** 删除菜单 */
export function fetchDeleteMenu(data) {
  return request({
    url: '/systemManage/deleteMenu',
    method: 'post',
    data
  })
}
