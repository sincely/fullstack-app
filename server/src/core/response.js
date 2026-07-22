/**
 * Response - 响应格式化工具
 *
 * 统一返回格式：{ code, msg, data }
 * 核心思想：前后端接口契约规范，返回格式统一
 *
 * 使用示例：
 * // 成功响应
 * ctx.body = success('获取用户列表成功', { users: [...] })
 *
 * // 失败响应
 * ctx.body = fail(businessCode.userNotFound, '用户不存在')
 *
 * // 分页响应
 * ctx.body = paginate(records, total, page, pageSize)
 */

import logger from '../config/logger.js'

/**
 * 成功响应
 * @param {string} msg - 成功消息
 * @param {any} data - 响应数据
 * @returns {Object} - 标准响应对象
 */
export function success(msg = '操作成功', data = null) {
  return {
    code: 200,
    msg,
    data
  }
}

/**
 * 失败响应（业务预期内的失败，不记录堆栈）
 * @param {number} code - 业务错误码
 * @param {string} msg - 失败消息
 * @param {any} data - 响应数据
 * @returns {Object} - 标准响应对象
 */
export function fail(code = 500, msg = '操作失败', data = null) {
  return { code, msg, data }
}

/**
 * 错误响应（记录完整错误堆栈）
 * @param {number} code - 业务错误码
 * @param {string} msg - 错误消息
 * @param {any} data - 错误详情
 * @param {Error} [cause] - 原始错误对象（可选，传入时自动记录完整堆栈）
 * @returns {Object} - 标准响应对象
 */
export function error(code = 500, msg = '服务器内部错误', data = null, cause = null) {
  // 联动日志：记录完整的错误堆栈，方便定位代码崩溃位置
  const errSource = cause instanceof Error ? cause : data instanceof Error ? data : null
  if (errSource) {
    logger.error(
      {
        err: errSource,
        code,
        ...(data instanceof Error ? {} : { data })
      },
      msg
    )
  }

  return {
    code,
    msg,
    data: data instanceof Error ? { name: data.name, message: data.message } : data
  }
}

/**
 * 分页响应
 * @param {Array} records - 数据列表
 * @param {number} total - 总数
 * @param {number} page - 当前页
 * @param {number} pageSize - 每页数量
 * @param {string} msg - 成功消息
 * @returns {Object} - 标准响应对象
 */
export function paginate(records = [], total = 0, page = 1, pageSize = 10, msg = '查询成功') {
  return {
    code: 200,
    msg,
    data: {
      records,
      pagination: {
        total: Number(total),
        page: Number(page),
        pageSize: Number(pageSize),
        totalPages: Math.ceil(total / pageSize)
      }
    }
  }
}

/**
 * 前端兼容分页响应（使用 current/size 字段）
 * @param {Array} records - 数据列表
 * @param {number} total - 总数
 * @param {number} current - 当前页
 * @param {number} size - 每页数量
 * @param {string} msg - 成功消息
 * @returns {Object} - 标准响应对象
 */
export function paginateForFrontend(records = [], total = 0, current = 1, size = 10, msg = '查询成功') {
  return {
    code: 200,
    msg,
    data: {
      records,
      current: Number(current),
      size: Number(size),
      total: Number(total)
    }
  }
}

/**
 * 无数据响应（删除、更新等操作）
 * @param {string} msg - 成功消息
 * @returns {Object} - 标准响应对象
 */
export function noContent(msg = '操作成功') {
  return {
    code: 200,
    msg,
    data: null
  }
}

/**
 * 参数错误响应
 * @param {string} msg - 错误消息
 * @param {any} data - 错误详情
 * @returns {Object} - 标准响应对象
 */
export function paramError(msg = '参数错误', data = null) {
  return fail(400, msg, data)
}

/**
 * 未授权响应
 * @param {string} msg - 错误消息
 * @returns {Object} - 标准响应对象
 */
export function unauthorized(msg = '未授权，请先登录') {
  return fail(401, msg)
}

/**
 * 禁止访问响应
 * @param {string} msg - 错误消息
 * @returns {Object} - 标准响应对象
 */
export function forbidden(msg = '权限不足，禁止访问') {
  return fail(403, msg)
}

/**
 * 资源不存在响应
 * @param {string} msg - 错误消息
 * @returns {Object} - 标准响应对象
 */
export function notFound(msg = '资源不存在') {
  return fail(404, msg)
}

/**
 * 服务器错误响应
 * @param {string} msg - 错误消息
 * @param {Error} [cause] - 原始错误对象
 * @returns {Object} - 标准响应对象
 */
export function serverError(msg = '服务器内部错误', cause = null) {
  return error(500, msg, null, cause)
}

// 兼容旧代码：导出函数式接口别名
export const createSuccessResponse = success
export const createFailResponse = fail
export const createErrorResponse = error
export const createPaginatedResponse = paginate

// 默认导出所有函数
export default {
  success,
  fail,
  error,
  paginate,
  paginateForFrontend,
  noContent,
  paramError,
  unauthorized,
  forbidden,
  notFound,
  serverError
}