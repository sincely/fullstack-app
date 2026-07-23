/**
 * @module 操作日志 Service
 * @description 操作日志的业务逻辑层，封装分页归一化、数据查询、JSON 解析等逻辑
 */

import operationLogDao from './operationLogDao.js'
import { normalizePagination } from '../../schemas/common/paginationSchema.js'

/**
 * 获取操作日志列表
 * @param {object} query - 查询参数
 * @returns {Promise<{ records: Array, current: number, size: number, total: number }>}
 */
export const listOperationLogs = async (query) => {
  const { current, size, page, pageSize, username, action, status, startTime, endTime } = query
  const { actualPage, actualPageSize } = normalizePagination({ current, size, page, pageSize })

  const filterParams = { username, action, status, startTime, endTime }

  const [list, total] = await Promise.all([
    operationLogDao.listOperationLogs({ page: actualPage, pageSize: actualPageSize, ...filterParams }),
    operationLogDao.countOperationLogs(filterParams)
  ])

  return {
    records: list,
    current: actualPage,
    size: actualPageSize,
    total: Number(total)
  }
}

/**
 * 获取操作日志详情（含 requestParams JSON 解析）
 * @param {number} id
 * @returns {Promise<object|null>}
 */
export const getOperationLogDetail = async (id) => {
  const log = await operationLogDao.getOperationLogById(id)

  if (log?.requestParams) {
    try {
      log.requestParams = JSON.parse(log.requestParams)
    } catch {
      // 保持原样
    }
  }

  return log
}

/**
 * 批量删除操作日志
 * @param {number[]} ids
 */
export const batchDeleteOperationLogs = async (ids) => {
  await operationLogDao.batchDeleteOperationLogs(ids)
}

/**
 * 清空操作日志
 */
export const clearOperationLogs = async () => {
  await operationLogDao.clearOperationLogs()
}
