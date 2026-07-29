import { query } from '../../db/connection.js'

/**
 * 操作日志 DAO
 */

/**
 * 分页查询操作日志列表
 */
const listOperationLogs = async ({ page, pageSize, username, module, action, status, startTime, endTime }) => {
  const where = []
  const params = []

  if (username) {
    where.push('ol.username LIKE ?')
    params.push(`%${username}%`)
  }

  if (module) {
    where.push('ol.module = ?')
    params.push(module)
  }

  if (action) {
    where.push('ol.action = ?')
    params.push(action)
  }

  if (status !== undefined && status !== '') {
    where.push('ol.status = ?')
    params.push(Number(status))
  }

  if (startTime) {
    where.push('ol.create_time >= ?')
    params.push(startTime)
  }

  if (endTime) {
    where.push('ol.create_time <= ?')
    params.push(endTime)
  }

  const whereSql = where.length > 0 ? `WHERE ${where.join(' AND ')}` : ''
  const safePage = Number.parseInt(page, 10) || 1
  const safePageSize = Number.parseInt(pageSize, 10) || 10
  const offset = (safePage - 1) * safePageSize

  const sql = `
    SELECT
      ol.id,
      ol.user_id,
      ol.username,
      ol.action,
      ol.module,
      ol.request_params,
      ol.response_status,
      ol.response_msg,
      ol.ip_address,
      ol.user_agent,
      ol.execute_time,
      ol.status,
      ol.create_time
    FROM OperationLog ol
    ${whereSql}
    ORDER BY ol.create_time DESC
    LIMIT ?, ?
  `

  return query(sql, [...params, offset, safePageSize])
}

/**
 * 统计操作日志总数
 */
const countOperationLogs = async ({ username, module, action, status, startTime, endTime }) => {
  const where = []
  const params = []

  if (username) {
    where.push('ol.username LIKE ?')
    params.push(`%${username}%`)
  }

  if (module) {
    where.push('ol.module = ?')
    params.push(module)
  }

  if (action) {
    where.push('ol.action = ?')
    params.push(action)
  }

  if (status !== undefined && status !== '') {
    where.push('ol.status = ?')
    params.push(Number(status))
  }

  if (startTime) {
    where.push('ol.create_time >= ?')
    params.push(startTime)
  }

  if (endTime) {
    where.push('ol.create_time <= ?')
    params.push(endTime)
  }

  const whereSql = where.length > 0 ? `WHERE ${where.join(' AND ')}` : ''

  const sql = `
    SELECT COUNT(*) as total
    FROM OperationLog ol
    ${whereSql}
  `

  const rows = await query(sql, params)
  return rows[0]?.total || 0
}

/**
 * 创建操作日志
 */
const createOperationLog = async (data) => {
  const sql = `
    INSERT INTO OperationLog (
      user_id, username, action, module, method, request_url,
      request_params, response_status, response_msg, ip_address,
      user_agent, execute_time, status
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `

  return query(sql, [
    data.user_id || null,
    data.username || '',
    data.action || '',
    data.module || '',
    data.method || '',
    data.request_url || '',
    data.request_params ? JSON.stringify(data.request_params) : null,
    data.response_status || '',
    data.response_msg || '',
    data.ip_address || '',
    data.user_agent || '',
    data.execute_time || 0,
    data.status !== undefined ? data.status : 1
  ])
}

/**
 * 批量删除操作日志
 */
const batchDeleteOperationLogs = async (ids) => {
  const placeholders = ids.map(() => '?').join(', ')
  const sql = `DELETE FROM OperationLog WHERE id IN (${placeholders})`
  return query(sql, ids)
}

/**
 * 清空操作日志
 */
const clearOperationLogs = async () => {
  return query('TRUNCATE TABLE OperationLog')
}

/**
 * 获取操作日志详情
 */
const getOperationLogById = async (id) => {
  const sql = 'SELECT * FROM OperationLog WHERE id = ? LIMIT 1'
  const rows = await query(sql, [id])
  return rows[0] || null
}

export default {
  listOperationLogs,
  countOperationLogs,
  createOperationLog,
  batchDeleteOperationLogs,
  clearOperationLogs,
  getOperationLogById
}
