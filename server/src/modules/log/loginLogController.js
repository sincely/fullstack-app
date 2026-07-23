/**
 * @module 登录日志管理 Controller
 * @description HTTP 适配层，业务逻辑委托给 loginLogService
 */

import * as loginLogService from './loginLogService.js'
import { businessCode } from '../../config/businessCode.js'
import { setBody, success } from '../../utils/response.js'

/**
 * 获取登录日志列表
 */
const listLoginLogs = async (ctx) => {
  const data = await loginLogService.listLoginLogs(ctx.query)
  success(ctx, data, '获取登录日志列表成功')
}

/**
 * 获取登录日志详情
 */
const getLoginLogDetail = async (ctx) => {
  const { id } = ctx.query

  if (!id) {
    return setBody(ctx, businessCode.paramError, 400, null, '日志ID不能为空')
  }

  const log = await loginLogService.getLoginLogDetail(Number(id))

  if (!log) {
    return setBody(ctx, businessCode.error, 404, null, '日志不存在')
  }

  success(ctx, log, '获取日志详情成功')
}

/**
 * 批量删除登录日志
 */
const batchDeleteLoginLogs = async (ctx) => {
  const { ids } = ctx.request.body

  if (!ids || ids.length === 0) {
    return setBody(ctx, businessCode.paramError, 400, null, '请选择要删除的日志')
  }

  await loginLogService.batchDeleteLoginLogs(ids)
  success(ctx, null, `成功删除 ${ids.length} 条日志`)
}

/**
 * 清空登录日志
 */
const clearLoginLogs = async (ctx) => {
  await loginLogService.clearLoginLogs()
  success(ctx, null, '登录日志已清空')
}

export default {
  listLoginLogs,
  getLoginLogDetail,
  batchDeleteLoginLogs,
  clearLoginLogs
}
