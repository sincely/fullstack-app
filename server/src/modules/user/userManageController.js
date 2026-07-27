/**
 * @module 用户管理 Controller
 * @description HTTP 适配层，业务逻辑委托给 userService
 */

import * as userService from './userService.js'
import { businessCode } from '../../config/businessCode.js'
import { setBody, success } from '../../utils/response.js'

/**
 * 获取用户列表
 */
const listUsers = async (ctx) => {
  const data = await userService.listUsers(ctx.query)
  success(ctx, data, '获取用户列表成功')
}

/**
 * 创建用户
 */
const createUser = async (ctx) => {
  const result = await userService.createUser(ctx.request.body)
  if (!result.success) return setBody(ctx, result.code)
  success(ctx, result.data, '创建用户成功')
}

/**
 * 更新用户
 */
const updateUser = async (ctx) => {
  const result = await userService.updateUser(ctx.request.body)
  if (!result.success) return setBody(ctx, result.code)
  success(ctx, null, '更新用户成功')
}

/**
 * 删除用户
 */
const deleteUser = async (ctx) => {
  const { id } = ctx.request.body
  const result = await userService.deleteUser(id, ctx.state.user.userId)
  if (!result.success) return setBody(ctx, result.code)
  success(ctx, null, '删除用户成功')
}

/**
 * 批量删除用户
 */
const batchDeleteUsers = async (ctx) => {
  const { ids } = ctx.request.body
  const result = await userService.batchDeleteUsers(ids, ctx.state.user.userId)
  if (!result.success) return setBody(ctx, result.code, undefined, null, result.msg)
  success(ctx, null, `成功删除 ${result.data.count} 个用户`)
}

/**
 * 更新用户状态
 */
const updateUserStatus = async (ctx) => {
  const { id, status } = ctx.request.body
  const result = await userService.updateUserStatus(id, status, ctx.state.user.userId)
  if (!result.success) return setBody(ctx, result.code)
  success(ctx, null, '更新用户状态成功')
}

/**
 * 重置用户密码
 */
const resetUserPassword = async (ctx) => {
  const { id } = ctx.request.body
  const result = await userService.resetUserPassword(id)
  if (!result.success) return setBody(ctx, result.code)
  success(ctx, null, '密码重置成功，默认密码: 123456')
}

export default {
  listUsers,
  createUser,
  updateUser,
  deleteUser,
  batchDeleteUsers,
  updateUserStatus,
  resetUserPassword
}
