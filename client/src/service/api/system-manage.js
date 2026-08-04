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
 * @description 更新角色绑定的菜单权限（含按钮节点 ID）
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
 * 批量删除用户
 * @description 批量删除用户
 * @param {Record<string, any>} data 请求体 {ids: number[]}
 * @returns {Promise<any>} 请求结果
 */
export function fetchBatchDeleteUser(data) {
  return request({
    url: '/systemManage/batchDeleteUser',
    method: 'post',
    data
  })
}

/**
 * 更新用户状态
 * @description 更新用户状态(启用/禁用)
 * @param {Record<string, any>} data 请求体 {id: number, status: string}
 * @returns {Promise<any>} 请求结果
 */
export function fetchUpdateUserStatus(data) {
  return request({
    url: '/systemManage/updateUserStatus',
    method: 'post',
    data
  })
}

/**
 * 重置用户密码
 * @description 重置用户密码为默认密码 123456
 * @param {Record<string, any>} data 请求体 {id: number}
 * @returns {Promise<any>} 请求结果
 */
export function fetchResetUserPassword(data) {
  return request({
    url: '/systemManage/resetUserPassword',
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
export function fetchGetMenuList(params) {
  return request({
    url: '/systemManage/getMenuList/v2',
    method: 'get',
    params
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

// ==================== 操作日志 ====================

/**
 * 获取操作日志列表
 * @description 分页查询操作日志
 * @param {Record<string, any>} params 查询参数
 * @returns {Promise<any>} 请求结果
 */
export function fetchGetOperationLogList(params) {
  return request({
    url: '/log/getOperationLogList',
    method: 'get',
    params
  })
}

/**
 * 批量删除操作日志
 * @description 批量删除操作日志
 * @param {Record<string, any>} data 请求体 {ids: number[]}
 * @returns {Promise<any>} 请求结果
 */
export function fetchBatchDeleteOperationLog(data) {
  return request({
    url: '/log/batchDeleteOperationLog',
    method: 'post',
    data
  })
}

/**
 * 获取操作日志详情
 * @description 根据ID查询操作日志详情
 * @param {number} id 日志ID
 * @returns {Promise<any>} 请求结果
 */
export function fetchGetOperationLogDetail(id) {
  return request({
    url: '/log/getOperationLogDetail',
    method: 'get',
    params: { id }
  })
}

/**
 * 删除操作日志
 * @description 删除单条操作日志
 * @param {Record<string, any>} data 请求体 {id: number}
 * @returns {Promise<any>} 请求结果
 */
export function fetchDeleteOperationLog(data) {
  return request({
    url: '/log/deleteOperationLog',
    method: 'post',
    data
  })
}

/**
 * 清空操作日志
 * @description 清空所有操作日志
 * @returns {Promise<any>} 请求结果
 */
export function fetchClearOperationLogs() {
  return request({
    url: '/log/clearOperationLogs',
    method: 'post'
  })
}

// ==================== 登录日志 ====================

/**
 * 获取登录日志列表
 * @description 分页查询登录日志
 * @param {Record<string, any>} params 查询参数
 * @returns {Promise<any>} 请求结果
 */
export function fetchGetLoginLogList(params) {
  return request({
    url: '/log/getLoginLogList',
    method: 'get',
    params
  })
}

/**
 * 获取登录日志详情
 * @description 根据ID查询登录日志详情
 * @param {number} id 日志ID
 * @returns {Promise<any>} 请求结果
 */
export function fetchGetLoginLogDetail(id) {
  return request({
    url: '/log/getLoginLogDetail',
    method: 'get',
    params: { id }
  })
}

/**
 * 批量删除登录日志
 * @description 批量删除登录日志
 * @param {Record<string, any>} data 请求体 {ids: number[]}
 * @returns {Promise<any>} 请求结果
 */
export function fetchBatchDeleteLoginLog(data) {
  return request({
    url: '/log/batchDeleteLoginLog',
    method: 'post',
    data
  })
}

/**
 * 清空登录日志
 * @description 清空所有登录日志
 * @returns {Promise<any>} 请求结果
 */
export function fetchClearLoginLogs() {
  return request({
    url: '/log/clearLoginLogs',
    method: 'post'
  })
}

// ==================== 字典管理 ====================

/**
 * 获取字典列表
 * @description 分页查询字典列表数据
 * @param {Record<string, any>} params 查询参数
 * @returns {Promise<any>} 请求结果
 */
export function fetchGetDictList(params) {
  return request({
    url: '/systemManage/getDictList',
    method: 'get',
    params
  })
}

/**
 * 新增字典
 * @description 创建字典
 * @param {Record<string, any>} data 请求体
 * @returns {Promise<any>} 请求结果
 */
export function fetchCreateDict(data) {
  return request({
    url: '/systemManage/saveDict',
    method: 'post',
    data
  })
}

/**
 * 更新字典
 * @description 更新字典信息
 * @param {Record<string, any>} data 请求体
 * @returns {Promise<any>} 请求结果
 */
export function fetchUpdateDict(data) {
  return request({
    url: '/systemManage/updateDict',
    method: 'post',
    data
  })
}

/**
 * 删除字典
 * @description 删除指定字典
 * @param {Record<string, any>} data 请求体
 * @returns {Promise<any>} 请求结果
 */
export function fetchDeleteDict(data) {
  return request({
    url: '/systemManage/deleteDict',
    method: 'post',
    data
  })
}
