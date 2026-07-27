/**
 * @module 角色管理 Controller
 * @description HTTP 适配层，业务逻辑委托给 roleService
 */

import * as roleService from './roleService.js'
import { businessCode } from '../../config/businessCode.js'
import { setBody, success } from '../../utils/response.js'

/**
 * 获取角色列表
 */
const listRoles = async (ctx) => {
  const data = await roleService.listRoles(ctx.query)
  success(ctx, data, '获取角色列表成功')
}

/**
 * 创建角色
 */
const createRole = async (ctx) => {
  const result = await roleService.createRole(ctx.request.body)
  if (!result.success) return setBody(ctx, result.code)
  success(ctx, result.data, '创建角色成功')
}

/**
 * 更新角色
 */
const updateRole = async (ctx) => {
  const result = await roleService.updateRole(ctx.request.body)
  if (!result.success) return setBody(ctx, result.code)
  success(ctx, null, '更新角色成功')
}

/**
 * 删除角色
 */
const deleteRole = async (ctx) => {
  const roleId = ctx.request.body.roleId || ctx.request.body.id
  const result = await roleService.deleteRole(roleId)
  if (!result.success) return setBody(ctx, result.code)
  success(ctx, null, '删除角色成功')
}

/**
 * 获取全部角色
 */
const getAllRoles = async (ctx) => {
  const result = await roleService.getAllRoles()
  success(ctx, result.data, '获取全部角色成功')
}

/**
 * 获取角色路由 ID
 */
const getRoleRouteIds = async (ctx) => {
  const { roleId } = ctx.query
  const result = await roleService.getRoleRouteIds(roleId)
  success(ctx, result.data, '请求成功')
}

/**
 * 更新角色路由 ID
 */
const updateRoleRouteIds = async (ctx) => {
  const result = await roleService.updateRoleRouteIds(ctx.request.body)
  if (!result.success) return setBody(ctx, result.code)
  success(ctx, null, '更新角色菜单成功')
}

/**
 * 获取角色按钮 ID
 */
const getRoleButtonIds = async (ctx) => {
  const { roleId } = ctx.query
  const result = await roleService.getRoleButtonIds(roleId)
  success(ctx, result.data, '请求成功')
}

/**
 * 更新角色按钮 ID
 */
const updateRoleButtonIds = async (ctx) => {
  const result = await roleService.updateRoleButtonIds(ctx.request.body)
  if (!result.success) return setBody(ctx, result.code)
  success(ctx, null, '更新角色按钮成功')
}

/**
 * 获取全部按钮
 */
const getAllButtons = async (ctx) => {
  const result = await roleService.getAllButtons()
  success(ctx, result.data, '请求成功')
}

export default {
  listRoles,
  getAllRoles,
  getRoleRouteIds,
  updateRoleRouteIds,
  getRoleButtonIds,
  updateRoleButtonIds,
  getAllButtons,
  createRole,
  updateRole,
  deleteRole
}
