import logger from '../config/logger.js'

/**
 * 创建错误响应对象，并联动日志记录完整错误堆栈
 * 统一返回 { code, msg, data } 格式，与 Controller 中的业务错误保持一致
 * @param {number} code - 业务错误码
 * @param {string} msg - 错误信息
 * @param {any} data - 错误详情
 * @param {Error} [cause] - 原始错误对象（可选，传入时自动记录完整堆栈）
 */
export function createErrorResponse(code, msg, data, cause) {
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
 * 创建失败响应对象（业务预期内的失败，不记录堆栈）
 * 统一返回 { code, msg, data } 格式
 * @deprecated 请使用 utils/response.js 的 setBody / fail 替代
 * @param {number} code - 业务错误码
 * @param {string} msg - 失败信息
 * @param {any} data - 响应数据
 */
export function createFailResponse(code, msg, data) {
  return { code, msg, data }
}

/**
 * 创建成功响应对象
 * 统一返回 { code, msg, data } 格式
 * @deprecated 请使用 utils/response.js 的 setBody / success 替代
 * @param {number} code - 业务成功码
 * @param {string} msg - 成功信息
 * @param {any} data - 响应数据
 */
export function createSuccessResponse(code, msg, data) {
  return { code, msg, data }
}

/**
 * 分页响应 - 统一使用 records/current/size/total 结构
 * @deprecated 请在 service 层直接构造分页对象，或使用 utils/response.js 的 success
 * @param {Array} records - 数据列表
 * @param {number} total - 总数
 * @param {number} current - 当前页码
 * @param {number} size - 每页数量
 * @returns {Object} 响应对象
 */
export function createPaginatedResponse(records, total, current, size) {
  return {
    code: 200,
    msg: 'Success',
    data: {
      records,
      current,
      size,
      total: Number(total)
    }
  }
}
