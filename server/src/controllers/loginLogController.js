/**
 * @module 登录日志管理
 * @description 处理登录日志的查询、删除等操作
 */

import loginLogDao from '../services/loginLogDao.js'
import { businessCode } from '../config/businessCode.js'
import { httpCode } from '../config/httpError.js'

/**
 * 获取登录日志列表 - 分页查询
 */
const listLoginLogs = async (ctx) => {
  const { current, size, page, pageSize, username, ipAddress, status, startTime, endTime } = ctx.query
  const actualPage = Number(page || current || 1)
  const actualPageSize = Number(pageSize || size || 10)

  const [list, total] = await Promise.all([
    loginLogDao.listLoginLogs({
      page: actualPage,
      pageSize: actualPageSize,
      username,
      ipAddress,
      status,
      startTime,
      endTime
    }),
    loginLogDao.countLoginLogs({
      username,
      ipAddress,
      status,
      startTime,
      endTime
    })
  ])

  ctx.status = httpCode.ok
  ctx.body = {
    code: businessCode.success,
    msg: '获取登录日志列表成功',
    data: {
      records: list,
      current: actualPage,
      size: actualPageSize,
      total: Number(total)
    }
  }
}

/**
 * 获取登录日志详情
 */
const getLoginLogDetail = async (ctx) => {
  const { id } = ctx.query

  if (!id) {
    ctx.status = httpCode.ok
    ctx.body = {
      code: businessCode.paramError,
      msg: '日志ID不能为空'
    }
    return
  }

  const log = await loginLogDao.getLoginLogById(Number(id))

  if (!log) {
    ctx.status = httpCode.ok
    ctx.body = {
      code: businessCode.error,
      msg: '日志不存在'
    }
    return
  }

  ctx.status = httpCode.ok
  ctx.body = {
    code: businessCode.success,
    msg: '获取日志详情成功',
    data: log
  }
}

/**
 * 批量删除登录日志
 */
const batchDeleteLoginLogs = async (ctx) => {
  const { ids } = ctx.request.body

  if (!ids || ids.length === 0) {
    ctx.status = httpCode.ok
    ctx.body = {
      code: businessCode.paramError,
      msg: '请选择要删除的日志'
    }
    return
  }

  await loginLogDao.batchDeleteLoginLogs(ids)

  ctx.status = httpCode.ok
  ctx.body = {
    code: businessCode.success,
    msg: `成功删除 ${ids.length} 条日志`
  }
}

/**
 * 清空登录日志
 */
const clearLoginLogs = async (ctx) => {
  await loginLogDao.clearLoginLogs()

  ctx.status = httpCode.ok
  ctx.body = {
    code: businessCode.success,
    msg: '登录日志已清空'
  }
}

export default {
  listLoginLogs,
  getLoginLogDetail,
  batchDeleteLoginLogs,
  clearLoginLogs
}
