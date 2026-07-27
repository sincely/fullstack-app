/**
 * @module 菜单管理 Controller
 * @description HTTP 适配层，业务逻辑委托给 menuService
 */

import * as menuService from './menuService.js'
import { businessCode } from '../../config/businessCode.js'
import { setBody, success } from '../../utils/response.js'

/**
 * 获取菜单列表
 */
const listMenus = async (ctx) => {
  const isV2 = ctx.path.endsWith('/v2')
  const data = await menuService.listMenus(ctx.query, isV2)
  success(ctx, data, '获取菜单列表成功')
}

/**
 * 获取菜单树
 */
const getMenuTree = async (ctx) => {
  const result = await menuService.getMenuTree()
  success(ctx, result.data, '获取菜单树成功')
}

/**
 * 创建菜单
 */
const createMenu = async (ctx) => {
  const result = await menuService.createMenu(ctx.request.body)
  if (!result.success) return setBody(ctx, result.code, undefined, null, result.msg)
  success(ctx, result.data, '创建菜单成功')
}

/**
 * 更新菜单
 */
const updateMenu = async (ctx) => {
  const result = await menuService.updateMenu(ctx.request.body)
  if (!result.success) return setBody(ctx, result.code, undefined, null, result.msg)
  success(ctx, null, '更新菜单成功')
}

/**
 * 删除菜单
 */
const deleteMenu = async (ctx) => {
  const result = await menuService.deleteMenu(ctx.request.body)
  if (!result.success) return setBody(ctx, result.code, undefined, null, result.msg)
  success(ctx, null, '删除菜单成功')
}

/**
 * 获取全部页面
 */
const getAllPages = async (ctx) => {
  const result = await menuService.getAllPages()
  success(ctx, result.data, '请求成功')
}

export default {
  listMenus,
  getMenuTree,
  getAllPages,
  createMenu,
  updateMenu,
  deleteMenu
}
