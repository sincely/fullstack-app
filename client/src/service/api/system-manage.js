import { request } from '../request'

/**
 * 获取角色列表
 * @description 分页查询角色列表数据
 * @param {Record<string, any>} params 查询参数
 * @returns {Promise<any>} 请求结果
 */
export function fetchGetRoleList(params) {
  return request({
    url: '/systemManage/getRoleList',
    method: 'get',
    params
  })
}

/**
 * 获取全部角色
 * @description 获取全部启用状态的角色
 * @returns {Promise<any>} 请求结果
 */
export function fetchGetAllRoles() {
  return request({
    url: '/systemManage/getAllRoles',
    method: 'get'
  })
}

/**
 * 获取角色菜单 ID
 * @description 根据角色查询菜单权限 ID 列表
 * @param {Record<string, any>} params 查询参数
 * @returns {Promise<any>} 请求结果
 */
export function fetchGetRoleRouteIds(params) {
  return request({
    url: '/systemManage/getRoleRouteIds',
    method: 'get',
    params
  })
}

/**
 * 更新角色菜单 ID
 * @description 更新角色绑定的菜单权限
 * @param {Record<string, any>} data 请求体
 * @returns {Promise<any>} 请求结果
 */
export function fetchUpdateRoleRouteIds(data) {
  return request({
    url: '/systemManage/updateRoleRouteIds',
    method: 'post',
    data
  })
}

/**
 * 获取角色按钮 ID
 * @description 根据角色查询按钮权限 ID 列表
 * @param {Record<string, any>} params 查询参数
 * @returns {Promise<any>} 请求结果
 */
export function fetchGetRoleButtonIds(params) {
  return request({
    url: '/systemManage/getRoleButtonIds',
    method: 'get',
    params
  })
}

/**
 * 更新角色按钮 ID
 * @description 更新角色绑定的按钮权限
 * @param {Record<string, any>} data 请求体
 * @returns {Promise<any>} 请求结果
 */
export function fetchUpdateRoleButtonIds(data) {
  return request({
    url: '/systemManage/updateRoleButtonIds',
    method: 'post',
    data
  })
}

/**
 * 获取全部按钮
 * @description 获取系统全部按钮权限项
 * @returns {Promise<any>} 请求结果
 */
export function fetchGetAllButtons() {
  return request({
    url: '/systemManage/getAllButtons',
    method: 'get'
  })
}

/**
 * 新增角色
 * @description 创建角色
 * @param {Record<string, any>} data 请求体
 * @returns {Promise<any>} 请求结果
 */
export function fetchCreateRole(data) {
  return request({
    url: '/systemManage/saveRole',
    method: 'post',
    data
  })
}

/**
 * 更新角色
 * @description 更新角色信息
 * @param {Record<string, any>} data 请求体
 * @returns {Promise<any>} 请求结果
 */
export function fetchUpdateRole(data) {
  return request({
    url: '/systemManage/updateRole',
    method: 'post',
    data
  })
}

/**
 * 删除角色
 * @description 删除指定角色
 * @param {Record<string, any>} data 请求体
 * @returns {Promise<any>} 请求结果
 */
export function fetchDeleteRole(data) {
  return request({
    url: '/systemManage/deleteRole',
    method: 'post',
    data
  })
}

/**
 * 获取用户列表
 * @description 分页查询用户列表数据
 * @param {Record<string, any>} params 查询参数
 * @returns {Promise<any>} 请求结果
 */
export function fetchGetUserList(params) {
  return request({
    url: '/systemManage/getUserList',
    method: 'get',
    params
  })
}

/**
 * 新增用户
 * @description 创建用户
 * @param {Record<string, any>} data 请求体
 * @returns {Promise<any>} 请求结果
 */
export function fetchCreateUser(data) {
  return request({
    url: '/systemManage/saveUser',
    method: 'post',
    data
  })
}

/**
 * 更新用户
 * @description 更新用户信息
 * @param {Record<string, any>} data 请求体
 * @returns {Promise<any>} 请求结果
 */
export function fetchUpdateUser(data) {
  return request({
    url: '/systemManage/updateUser',
    method: 'post',
    data
  })
}

/**
 * 删除用户
 * @description 删除指定用户
 * @param {Record<string, any>} data 请求体
 * @returns {Promise<any>} 请求结果
 */
export function fetchDeleteUser(data) {
  return request({
    url: '/systemManage/deleteUser',
    method: 'post',
    data
  })
}

/**
 * 获取菜单列表
 * @description 获取菜单列表（旧版本）
 * @deprecated 将在下个版本 1.1.0 移除
 * @returns {Promise<any>} 请求结果
 */
export function fetchGetMenuListV1() {
  return request({
    url: '/systemManage/getMenuList',
    method: 'get'
  })
}

/**
 * 获取菜单列表
 * @description 获取菜单列表（v2）
 * @returns {Promise<any>} 请求结果
 */
export function fetchGetMenuList() {
  return request({
    url: '/systemManage/getMenuList/v2',
    method: 'get'
  })
}

/**
 * 获取全部页面
 * @description 获取系统全部页面项
 * @returns {Promise<any>} 请求结果
 */
export function fetchGetAllPages() {
  return request({
    url: '/systemManage/getAllPages',
    method: 'get'
  })
}

/**
 * 获取菜单树
 * @description 获取树形菜单结构
 * @returns {Promise<any>} 请求结果
 */
export function fetchGetMenuTree() {
  return request({
    url: '/systemManage/getMenuTree',
    method: 'get'
  })
}

/**
 * 新增菜单
 * @description 创建菜单
 * @param {Record<string, any>} data 请求体
 * @returns {Promise<any>} 请求结果
 */
export function fetchCreateMenu(data) {
  return request({
    url: '/systemManage/saveMenu',
    method: 'post',
    data
  })
}

/**
 * 更新菜单
 * @description 更新菜单信息
 * @param {Record<string, any>} data 请求体
 * @returns {Promise<any>} 请求结果
 */
export function fetchUpdateMenu(data) {
  return request({
    url: '/systemManage/updateMenu',
    method: 'post',
    data
  })
}

/**
 * 删除菜单
 * @description 删除指定菜单
 * @param {Record<string, any>} data 请求体
 * @returns {Promise<any>} 请求结果
 */
export function fetchDeleteMenu(data) {
  return request({
    url: '/systemManage/deleteMenu',
    method: 'post',
    data
  })
}
