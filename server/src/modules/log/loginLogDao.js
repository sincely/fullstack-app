import { query } from '../../db/connection.js'

/**
 * 登录日志 DAO
 */

/**
 * 分页查询登录日志列表
 */
const listLoginLogs = async ({ page, pageSize, username, ipAddress, status, startTime, endTime }) => {
  const where = []
  const params = []

  if (username) {
    where.push('ll.username LIKE ?')
    params.push(`%${username}%`)
  }

  if (ipAddress) {
    where.push('ll.ipAddress = ?')
    params.push(ipAddress)
  }

  if (status !== undefined && status !== '') {
    where.push('ll.status = ?')
    params.push(Number(status))
  }

  if (startTime) {
    where.push('ll.createTime >= ?')
    params.push(startTime)
  }

  if (endTime) {
    where.push('ll.createTime <= ?')
    params.push(endTime)
  }

  const whereSql = where.length > 0 ? `WHERE ${where.join(' AND ')}` : ''
  const safePage = Number.parseInt(page, 10) || 1
  const safePageSize = Number.parseInt(pageSize, 10) || 10
  const offset = (safePage - 1) * safePageSize

  const sql = `
    SELECT
      ll.id,
      ll.userId,
      ll.username,
      ll.loginType,
      ll.ipAddress,
      ll.location,
      ll.browser,
      ll.os,
      ll.userAgent,
      ll.status,
      ll.message,
      ll.sessionId,
      ll.createTime
    FROM LoginLog ll
    ${whereSql}
    ORDER BY ll.createTime DESC
    LIMIT ?, ?
  `

  return query(sql, [...params, offset, safePageSize])
}

/**
 * 统计登录日志总数
 */
const countLoginLogs = async ({ username, ipAddress, status, startTime, endTime }) => {
  const where = []
  const params = []

  if (username) {
    where.push('ll.username LIKE ?')
    params.push(`%${username}%`)
  }

  if (ipAddress) {
    where.push('ll.ipAddress = ?')
    params.push(ipAddress)
  }

  if (status !== undefined && status !== '') {
    where.push('ll.status = ?')
    params.push(Number(status))
  }

  if (startTime) {
    where.push('ll.createTime >= ?')
    params.push(startTime)
  }

  if (endTime) {
    where.push('ll.createTime <= ?')
    params.push(endTime)
  }

  const whereSql = where.length > 0 ? `WHERE ${where.join(' AND ')}` : ''

  const sql = `
    SELECT COUNT(*) as total
    FROM LoginLog ll
    ${whereSql}
  `

  const rows = await query(sql, params)
  return rows[0]?.total || 0
}

/**
 * 创建登录日志
 */
const createLoginLog = async (data) => {
  const sql = `
    INSERT INTO LoginLog (
      userId, username, loginType, ipAddress, location,
      browser, os, userAgent, status, message, sessionId
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `

  return query(sql, [
    data.userId || null,
    data.username || '',
    data.loginType || 'password',
    data.ipAddress || '',
    data.location || '',
    data.browser || '',
    data.os || '',
    data.userAgent || '',
    data.status !== undefined ? data.status : 1,
    data.message || '',
    data.sessionId || null
  ])
}

/**
 * 批量删除登录日志
 */
const batchDeleteLoginLogs = async (ids) => {
  const placeholders = ids.map(() => '?').join(', ')
  const sql = `DELETE FROM LoginLog WHERE id IN (${placeholders})`
  return query(sql, ids)
}

/**
 * 清空登录日志
 */
const clearLoginLogs = async () => {
  return query('TRUNCATE TABLE LoginLog')
}

/**
 * 获取登录日志详情
 */
const getLoginLogById = async (id) => {
  const sql = 'SELECT * FROM LoginLog WHERE id = ? LIMIT 1'
  const rows = await query(sql, [id])
  return rows[0] || null
}

export default {
  listLoginLogs,
  countLoginLogs,
  createLoginLog,
  batchDeleteLoginLogs,
  clearLoginLogs,
  getLoginLogById
}
