/**
 * @module 操作日志管理
 * @description 处理操作日志的查询、删除等操作
 */

import operationLogDao from './operationLogDao.js'
import { businessCode, businessMsg } from '../../config/businessCode.js'
import { httpCode } from '../../config/httpError.js'

/**
 * 获取操作日志列表 - 分页查询
 */
const listOperationLogs = async (ctx) => {
  const { current, size, page, pageSize, username, action, status, startTime, endTime } = ctx.query
  const actualPage = Number(page || current || 1)
  const actualPageSize = Number(pageSize || size || 10)

  const [list, total] = await Promise.all([
    operationLogDao.listOperationLogs({
      page: actualPage,
      pageSize: actualPageSize,
      username,
      action,
      status,
      startTime,
      endTime
    }),
    operationLogDao.countOperationLogs({
      username,
      action,
      status,
      startTime,
      endTime
    })
  ])

  ctx.status = httpCode.ok
  ctx.body = {
    code: businessCode.success,
    msg: '获取操作日志列表成功',
    data: {
      records: list,
      current: actualPage,
      size: actualPageSize,
      total: Number(total)
    }
  }
}

/**
 * 获取操作日志详情
 */
const getOperationLogDetail = async (ctx) => {
  const { id } = ctx.query

  if (!id) {
    ctx.status = httpCode.ok
    ctx.body = {
      code: businessCode.paramError,
      msg: '日志ID不能为空'
    }
    return
  }

  const log = await operationLogDao.getOperationLogById(Number(id))

  if (!log) {
    ctx.status = httpCode.ok
    ctx.body = {
      code: businessCode.error,
      msg: '日志不存在'
    }
    return
  }

  // 解析请求参数 JSON
  if (log.requestParams) {
    try {
      log.requestParams = JSON.parse(log.requestParams)
    } catch (e) {
      // 保持原样
    }
  }

  ctx.status = httpCode.ok
  ctx.body = {
    code: businessCode.success,
    msg: '获取日志详情成功',
    data: log
  }
}

/**
 * 批量删除操作日志
 */
const batchDeleteOperationLogs = async (ctx) => {
  const { ids } = ctx.request.body

  if (!ids || ids.length === 0) {
    ctx.status = httpCode.ok
    ctx.body = {
      code: businessCode.paramError,
      msg: '请选择要删除的日志'
    }
    return
  }

  await operationLogDao.batchDeleteOperationLogs(ids)

  ctx.status = httpCode.ok
  ctx.body = {
    code: businessCode.success,
    msg: `成功删除 ${ids.length} 条日志`
  }
}

/**
 * 清空操作日志
 */
const clearOperationLogs = async (ctx) => {
  await operationLogDao.clearOperationLogs()

  ctx.status = httpCode.ok
  ctx.body = {
    code: businessCode.success,
    msg: '操作日志已清空'
  }
}

export default {
  listOperationLogs,
  getOperationLogDetail,
  batchDeleteOperationLogs,
  clearOperationLogs
}
