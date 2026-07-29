/**
 * @module 登录日志 Service
 * @description 登录日志的业务逻辑层，封装分页归一化、数据查询等逻辑
 */

import loginLogDao from './loginLogDao.js'
import { normalizePagination } from '../../schemas/common/paginationSchema.js'

/**
 * 将数据库 snake_case 字段映射为前端 camelCase 字段
 */
const formatLoginLogRow = (row) => ({
  id: row.id,
  userId: row.user_id,
  username: row.username,
  loginType: row.login_type,
  ipAddress: row.ip_address,
  location: row.location,
  browser: row.browser,
  os: row.os,
  userAgent: row.user_agent,
  status: row.status,
  message: row.message,
  sessionId: row.session_id,
  createTime: row.create_time
})

/**
 * 获取登录日志列表
 * @param {object} query - 查询参数（来自 ctx.query，已通过 schema 校验）
 * @returns {Promise<{ records: Array, current: number, size: number, total: number }>}
 */
export const listLoginLogs = async (query) => {
  const { current, size, page, pageSize, username, ipAddress, status, startTime, endTime } = query
  const { actualPage, actualPageSize } = normalizePagination({ current, size, page, pageSize })

  const filterParams = { username, ip_address: ipAddress, status, startTime, endTime }

  const [list, total] = await Promise.all([
    loginLogDao.listLoginLogs({ page: actualPage, pageSize: actualPageSize, ...filterParams }),
    loginLogDao.countLoginLogs(filterParams)
  ])

  return {
    records: list.map(formatLoginLogRow),
    current: actualPage,
    size: actualPageSize,
    total: Number(total)
  }
}

/**
 * 获取登录日志详情
 * @param {number} id
 * @returns {Promise<object|null>}
 */
export const getLoginLogDetail = async (id) => {
  const log = await loginLogDao.getLoginLogById(id)
  return log ? formatLoginLogRow(log) : null
}

/**
 * 批量删除登录日志
 * @param {number[]} ids
 */
export const batchDeleteLoginLogs = async (ids) => {
  await loginLogDao.batchDeleteLoginLogs(ids)
}

/**
 * 清空登录日志
 */
export const clearLoginLogs = async () => {
  await loginLogDao.clearLoginLogs()
}
