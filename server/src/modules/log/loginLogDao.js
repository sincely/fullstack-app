import { query } from '../../db/connection.js'

/**
 * 登录日志 DAO
 */

/**
 * 分页查询登录日志列表
 */
const listLoginLogs = async ({ page, pageSize, username, ip_address, status, startTime, endTime }) => {
  const where = []
  const params = []

  if (username) {
    where.push('ll.username LIKE ?')
    params.push(`%${username}%`)
  }

  if (ip_address) {
    where.push('ll.ip_address = ?')
    params.push(ip_address)
  }

  if (status !== undefined && status !== '') {
    where.push('ll.status = ?')
    params.push(Number(status))
  }

  if (startTime) {
    where.push('ll.create_time >= ?')
    params.push(startTime)
  }

  if (endTime) {
    where.push('ll.create_time <= ?')
    params.push(endTime)
  }

  const whereSql = where.length > 0 ? `WHERE ${where.join(' AND ')}` : ''
  const safePage = Number.parseInt(page, 10) || 1
  const safePageSize = Number.parseInt(pageSize, 10) || 10
  const offset = (safePage - 1) * safePageSize

  const sql = `
    SELECT
      ll.id,
      ll.user_id,
      ll.username,
      ll.login_type,
      ll.ip_address,
      ll.location,
      ll.browser,
      ll.os,
      ll.user_agent,
      ll.status,
      ll.message,
      ll.session_id,
      ll.create_time
    FROM LoginLog ll
    ${whereSql}
    ORDER BY ll.create_time DESC
    LIMIT ?, ?
  `

  return query(sql, [...params, offset, safePageSize])
}

/**
 * 统计登录日志总数
 */
const countLoginLogs = async ({ username, ip_address, status, startTime, endTime }) => {
  const where = []
  const params = []

  if (username) {
    where.push('ll.username LIKE ?')
    params.push(`%${username}%`)
  }

  if (ip_address) {
    where.push('ll.ip_address = ?')
    params.push(ip_address)
  }

  if (status !== undefined && status !== '') {
    where.push('ll.status = ?')
    params.push(Number(status))
  }

  if (startTime) {
    where.push('ll.create_time >= ?')
    params.push(startTime)
  }

  if (endTime) {
    where.push('ll.create_time <= ?')
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
      user_id, username, login_type, ip_address, location,
      browser, os, user_agent, status, message, session_id
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `

  return query(sql, [
    data.user_id || null,
    data.username || '',
    data.login_type || 'password',
    data.ip_address || '',
    data.location || '',
    data.browser || '',
    data.os || '',
    data.user_agent || '',
    data.status !== undefined ? data.status : 1,
    data.message || '',
    data.session_id || null
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
