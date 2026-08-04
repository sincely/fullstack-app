/**
 * @module 操作日志管理 Controller
 * @description HTTP 适配层，业务逻辑委托给 operationLogService
 */

import * as operationLogService from './operationLogService.js'
import { businessCode } from '../../config/businessCode.js'
import { createSuccessResponse, createFailResponse } from '../../utils/createResponse.js'

/**
 * 获取操作日志列表
 */
const listOperationLogs = async (ctx) => {
  const data = await operationLogService.listOperationLogs(ctx.query)
  ctx.body = createSuccessResponse(businessCode.success, '获取操作日志列表成功', data)
}

/**
 * 获取操作日志详情
 */
const getOperationLogDetail = async (ctx) => {
  const { id } = ctx.query

  if (!id) {
    ctx.status = 400
    return (ctx.body = createFailResponse(businessCode.paramError, '日志ID不能为空'))
  }

  const log = await operationLogService.getOperationLogDetail(Number(id))

  if (!log) {
    ctx.status = 404
    return (ctx.body = createFailResponse(businessCode.error, '日志不存在'))
  }

  ctx.body = createSuccessResponse(businessCode.success, '获取日志详情成功', log)
}

/**
 * 批量删除操作日志
 */
const batchDeleteOperationLogs = async (ctx) => {
  const { ids } = ctx.request.body

  if (!ids || ids.length === 0) {
    ctx.status = 400
    return (ctx.body = createFailResponse(businessCode.paramError, '请选择要删除的日志'))
  }

  await operationLogService.batchDeleteOperationLogs(ids)
  ctx.body = createSuccessResponse(businessCode.success, `成功删除 ${ids.length} 条日志`)
}

/**
 * 清空操作日志
 */
const clearOperationLogs = async (ctx) => {
  await operationLogService.clearOperationLogs()
  ctx.body = createSuccessResponse(businessCode.success, '操作日志已清空')
}

/**
 * 删除单条操作日志
 */
const deleteOperationLog = async (ctx) => {
  const { id } = ctx.request.body

  if (!id) {
    ctx.status = 400
    return (ctx.body = createFailResponse(businessCode.paramError, '日志ID不能为空'))
  }

  await operationLogService.deleteOperationLog(Number(id))
  ctx.body = createSuccessResponse(businessCode.success, '删除日志成功')
}

export default {
  listOperationLogs,
  getOperationLogDetail,
  batchDeleteOperationLogs,
  clearOperationLogs,
  deleteOperationLog
}
