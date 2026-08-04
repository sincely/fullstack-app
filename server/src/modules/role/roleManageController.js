/**
 * @module 角色管理 Controller
 * @description HTTP 适配层，业务逻辑委托给 roleService
 */

import * as roleService from './roleService.js'
import { businessCode, businessMsg } from '../../config/businessCode.js'
import { createSuccessResponse, createFailResponse } from '../../utils/createResponse.js'

/**
 * 获取角色列表
 */
const listRoles = async (ctx) => {
  const data = await roleService.listRoles(ctx.query)
  ctx.body = createSuccessResponse(businessCode.success, '获取角色列表成功', data)
}

/**
 * 创建角色
 */
const createRole = async (ctx) => {
  const result = await roleService.createRole(ctx.request.body)
  if (!result.success) {
    return (ctx.body = createFailResponse(result.code, businessMsg[result.code]))
  }
  ctx.body = createSuccessResponse(businessCode.success, '创建角色成功', result.data)
}

/**
 * 更新角色
 */
const updateRole = async (ctx) => {
  const result = await roleService.updateRole(ctx.request.body)
  if (!result.success) {
    return (ctx.body = createFailResponse(result.code, businessMsg[result.code]))
  }
  ctx.body = createSuccessResponse(businessCode.success, '更新角色成功')
}

/**
 * 删除角色
 */
const deleteRole = async (ctx) => {
  const roleId = ctx.request.body.roleId || ctx.request.body.id
  const result = await roleService.deleteRole(roleId)
  if (!result.success) {
    return (ctx.body = createFailResponse(result.code, businessMsg[result.code]))
  }
  ctx.body = createSuccessResponse(businessCode.success, '删除角色成功')
}

/**
 * 获取全部角色
 */
const getAllRoles = async (ctx) => {
  const result = await roleService.getAllRoles()
  ctx.body = createSuccessResponse(businessCode.success, '获取全部角色成功', result.data)
}

/**
 * 获取角色路由 ID
 */
const getRoleRouteIds = async (ctx) => {
  const { roleId } = ctx.query
  const result = await roleService.getRoleRouteIds(roleId)
  ctx.body = createSuccessResponse(businessCode.success, '请求成功', result.data)
}

/**
 * 更新角色路由 ID
 */
const updateRoleRouteIds = async (ctx) => {
  const result = await roleService.updateRoleRouteIds(ctx.request.body)
  if (!result.success) {
    return (ctx.body = createFailResponse(result.code, businessMsg[result.code]))
  }
  ctx.body = createSuccessResponse(businessCode.success, '更新角色菜单成功')
}

export default {
  listRoles,
  getAllRoles,
  getRoleRouteIds,
  updateRoleRouteIds,
  createRole,
  updateRole,
  deleteRole
}
