import { query } from '../utils/db.js'

/**
 * 操作日志 DAO
 */

/**
 * 分页查询操作日志列表
 */
const listOperationLogs = async ({ page, pageSize, username, action, status, startTime, endTime }) => {
  const where = []
  const params = []

  if (username) {
    where.push('ol.username LIKE ?')
    params.push(`%${username}%`)
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
    where.push('ol.createTime >= ?')
    params.push(startTime)
  }

  if (endTime) {
    where.push('ol.createTime <= ?')
    params.push(endTime)
  }

  const whereSql = where.length > 0 ? `WHERE ${where.join(' AND ')}` : ''
  const safePage = Number.parseInt(page, 10) || 1
  const safePageSize = Number.parseInt(pageSize, 10) || 10
  const offset = (safePage - 1) * safePageSize

  const sql = `
    SELECT
      ol.id,
      ol.userId,
      ol.username,
      ol.action,
      ol.method,
      ol.requestUrl,
      ol.requestParams,
      ol.responseStatus,
      ol.responseMsg,
      ol.ipAddress,
      ol.userAgent,
      ol.executeTime,
      ol.status,
      ol.createTime
    FROM OperationLog ol
    ${whereSql}
    ORDER BY ol.createTime DESC
    LIMIT ?, ?
  `

  return query(sql, [...params, offset, safePageSize])
}

/**
 * 统计操作日志总数
 */
const countOperationLogs = async ({ username, action, status, startTime, endTime }) => {
  const where = []
  const params = []

  if (username) {
    where.push('ol.username LIKE ?')
    params.push(`%${username}%`)
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
    where.push('ol.createTime >= ?')
    params.push(startTime)
  }

  if (endTime) {
    where.push('ol.createTime <= ?')
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
      userId, username, action, method, requestUrl,
      requestParams, responseStatus, responseMsg, ipAddress,
      userAgent, executeTime, status
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `

  return query(sql, [
    data.userId || null,
    data.username || '',
    data.action || '',
    data.method || '',
    data.requestUrl || '',
    data.requestParams ? JSON.stringify(data.requestParams) : null,
    data.responseStatus || '',
    data.responseMsg || '',
    data.ipAddress || '',
    data.userAgent || '',
    data.executeTime || 0,
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
