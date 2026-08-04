/**
 * @module 字典管理 Controller
 * @description HTTP 适配层，业务逻辑委托给 dictService
 */

import * as dictService from './dictService.js'
import { businessCode, businessMsg } from '../../config/businessCode.js'
import { createSuccessResponse, createFailResponse } from '../../utils/createResponse.js'

/**
 * 获取字典列表
 */
const listDicts = async (ctx) => {
  const data = await dictService.listDicts(ctx.query)
  ctx.body = createSuccessResponse(businessCode.success, '获取字典列表成功', data)
}

/**
 * 创建字典
 */
const createDict = async (ctx) => {
  const result = await dictService.createDict(ctx.request.body)
  if (!result.success) {
    return (ctx.body = createFailResponse(result.code, businessMsg[result.code]))
  }
  ctx.body = createSuccessResponse(businessCode.success, '创建字典成功', result.data)
}

/**
 * 更新字典
 */
const updateDict = async (ctx) => {
  const result = await dictService.updateDict(ctx.request.body)
  if (!result.success) {
    return (ctx.body = createFailResponse(result.code, businessMsg[result.code]))
  }
  ctx.body = createSuccessResponse(businessCode.success, '更新字典成功')
}

/**
 * 删除字典
 */
const deleteDict = async (ctx) => {
  const dictId = ctx.request.body.dictId || ctx.request.body.id
  const result = await dictService.deleteDict(dictId)
  if (!result.success) {
    return (ctx.body = createFailResponse(result.code, businessMsg[result.code]))
  }
  ctx.body = createSuccessResponse(businessCode.success, '删除字典成功')
}

export default {
  listDicts,
  createDict,
  updateDict,
  deleteDict
}
