/**
 * @module 登录日志管理 Controller
 * @description HTTP 适配层，业务逻辑委托给 loginLogService
 */

import * as loginLogService from './loginLogService.js'
import { businessCode } from '../../config/businessCode.js'
import { createSuccessResponse, createFailResponse } from '../../utils/createResponse.js'

/**
 * 获取登录日志列表
 */
const listLoginLogs = async (ctx) => {
  const data = await loginLogService.listLoginLogs(ctx.query)
  ctx.body = createSuccessResponse(businessCode.success, '获取登录日志列表成功', data)
}

/**
 * 获取登录日志详情
 */
const getLoginLogDetail = async (ctx) => {
  const { id } = ctx.query

  if (!id) {
    ctx.status = 400
    return (ctx.body = createFailResponse(businessCode.paramError, '日志ID不能为空'))
  }

  const log = await loginLogService.getLoginLogDetail(Number(id))

  if (!log) {
    ctx.status = 404
    return (ctx.body = createFailResponse(businessCode.error, '日志不存在'))
  }

  ctx.body = createSuccessResponse(businessCode.success, '获取日志详情成功', log)
}

/**
 * 批量删除登录日志
 */
const batchDeleteLoginLogs = async (ctx) => {
  const { ids } = ctx.request.body

  if (!ids || ids.length === 0) {
    ctx.status = 400
    return (ctx.body = createFailResponse(businessCode.paramError, '请选择要删除的日志'))
  }

  await loginLogService.batchDeleteLoginLogs(ids)
  ctx.body = createSuccessResponse(businessCode.success, `成功删除 ${ids.length} 条日志`)
}

/**
 * 清空登录日志
 */
const clearLoginLogs = async (ctx) => {
  await loginLogService.clearLoginLogs()
  ctx.body = createSuccessResponse(businessCode.success, '登录日志已清空')
}

export default {
  listLoginLogs,
  getLoginLogDetail,
  batchDeleteLoginLogs,
  clearLoginLogs
}
