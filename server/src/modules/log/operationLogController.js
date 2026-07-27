/**
 * @module 操作日志管理 Controller
 * @description HTTP 适配层，业务逻辑委托给 operationLogService
 */

import * as operationLogService from './operationLogService.js'
import { businessCode } from '../../config/businessCode.js'
import { setBody, success } from '../../utils/response.js'

/**
 * 获取操作日志列表
 */
const listOperationLogs = async (ctx) => {
  const data = await operationLogService.listOperationLogs(ctx.query)
  success(ctx, data, '获取操作日志列表成功')
}

/**
 * 获取操作日志详情
 */
const getOperationLogDetail = async (ctx) => {
  const { id } = ctx.query

  if (!id) {
    return setBody(ctx, businessCode.paramError, 400, null, '日志ID不能为空')
  }

  const log = await operationLogService.getOperationLogDetail(Number(id))

  if (!log) {
    return setBody(ctx, businessCode.error, 404, null, '日志不存在')
  }

  success(ctx, log, '获取日志详情成功')
}

/**
 * 批量删除操作日志
 */
const batchDeleteOperationLogs = async (ctx) => {
  const { ids } = ctx.request.body

  if (!ids || ids.length === 0) {
    return setBody(ctx, businessCode.paramError, 400, null, '请选择要删除的日志')
  }

  await operationLogService.batchDeleteOperationLogs(ids)
  success(ctx, null, `成功删除 ${ids.length} 条日志`)
}

/**
 * 清空操作日志
 */
const clearOperationLogs = async (ctx) => {
  await operationLogService.clearOperationLogs()
  success(ctx, null, '操作日志已清空')
}

export default {
  listOperationLogs,
  getOperationLogDetail,
  batchDeleteOperationLogs,
  clearOperationLogs
}
