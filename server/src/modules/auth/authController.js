/**
 * @module 后台认证 Controller
 * @description HTTP 适配层，负责请求/响应转换，业务逻辑委托给 Service
 */

import * as authService from './authService.js'
import { businessCode } from '../../config/businessCode.js'
import { setBody, success } from '../../utils/response.js'

/**
 * 后台注册
 */
const register = async (ctx) => {
  const result = await authService.register(ctx.request.body)
  if (!result.success) return setBody(ctx, result.code, undefined, null, result.msg)
  success(ctx, result.data, '注册成功')
}

/**
 * 后台登录
 */
const login = async (ctx) => {
  const result = await authService.login(ctx.request.body)
  if (!result.success) return setBody(ctx, result.code)
  success(ctx, result.data, '登录成功')
}

/**
 * 获取当前用户信息
 */
const getProfile = async (ctx) => {
  const result = await authService.getProfile(ctx.state.user.userId)
  if (!result.success) return setBody(ctx, result.code)
  success(ctx, result.data, '获取用户信息成功')
}

/**
 * 获取当前用户菜单
 */
const getMenus = async (ctx) => {
  const result = await authService.getMenus(ctx.state.user.roleIds, ctx.state.user.roleId)
  if (!result.success) return setBody(ctx, result.code)
  success(ctx, result.data, '获取菜单成功')
}

/**
 * 获取当前用户权限
 */
const getPermissions = async (ctx) => {
  const result = await authService.getPermissions(ctx.state.user.roleIds, ctx.state.user.roleId)
  if (!result.success) return setBody(ctx, result.code)
  success(ctx, result.data, '获取权限成功')
}

/**
 * 后台退出登录
 */
const logout = async (ctx) => {
  success(ctx, null, '退出成功')
}

export default {
  register,
  login,
  getProfile,
  getMenus,
  getPermissions,
  logout
}
