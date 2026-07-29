/**
 * @module 后台认证 Controller
 * @description HTTP 适配层，负责请求/响应转换，业务逻辑委托给 Service
 */

import * as authService from './authService.js'
import { businessCode, businessMsg } from '../../config/businessCode.js'
import { createSuccessResponse, createFailResponse } from '../../utils/createResponse.js'

/**
 * 后台注册
 */
const register = async (ctx) => {
  const result = await authService.register(ctx.request.body)
  if (!result.success) {
    return (ctx.body = createFailResponse(result.code, result.msg))
  }
  ctx.body = createSuccessResponse(businessCode.success, '注册成功', result.data)
}

/**
 * 后台登录
 */
const login = async (ctx) => {
  const result = await authService.login(ctx.request.body)
  if (!result.success) {
    return (ctx.body = createFailResponse(result.code, businessMsg[result.code]))
  }
  ctx.body = createSuccessResponse(businessCode.success, '登录成功', result.data)
}

/**
 * 获取当前用户信息
 */
const getProfile = async (ctx) => {
  const result = await authService.getProfile(ctx.state.user.userId)
  if (!result.success) {
    return (ctx.body = createFailResponse(ctx, result.code, businessMsg[result.code]))
  }
  ctx.body = createSuccessResponse(businessCode.success, '获取用户信息成功', result.data)
}

/**
 * 获取当前用户菜单
 */
const getMenus = async (ctx) => {
  const result = await authService.getMenus(ctx.state.user.roleIds, ctx.state.user.roleId)
  if (!result.success) {
    return (ctx.body = createFailResponse(ctx, result.code, businessMsg[result.code]))
  }
  ctx.body = createSuccessResponse(businessCode.success, '获取菜单成功', result.data)
}

/**
 * 获取当前用户权限
 */
const getPermissions = async (ctx) => {
  const result = await authService.getPermissions(ctx.state.user.roleIds, ctx.state.user.roleId)
  if (!result.success) {
    return (ctx.body = createFailResponse(ctx, result.code, businessMsg[result.code]))
  }
  ctx.body = createSuccessResponse(businessCode.success, '获取权限成功', result.data)
}

/**
 * 后台退出登录
 */
const logout = async (ctx) => {
  ctx.body = createSuccessResponse(businessCode.success, '退出成功')
}

export default {
  register,
  login,
  getProfile,
  getMenus,
  getPermissions,
  logout
}
