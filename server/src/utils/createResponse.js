/**
 * 创建错误响应对象，统一返回 { code, msg, data } 格式，与 Controller 中的业务错误保持一致
 * 注意：此函数只负责构造响应，错误日志统一由 errorHandler 记录，避免同一错误被重复打印
 * @param {number} code - 业务错误码
 * @param {string} msg - 错误信息
 * @param {any} data - 错误详情
 * @param {Error} [cause] - 原始错误对象（可选，仅用于构造响应中的错误摘要）
 */
export function createErrorResponse(code, msg, data, cause) {
  return {
    code,
    msg,
    data: data instanceof Error ? { name: data.name, message: data.message } : data
  }
}

/**
 * 创建失败响应对象（业务预期内的失败，不记录堆栈）
 * 统一返回 { code, msg, data } 格式
 * @param {number} code - 业务错误码
 * @param {string} msg - 失败信息
 * @param {any} [data] - 响应数据
 */
export function createFailResponse(code, msg, data) {
  return { code, msg, data }
}

/**
 * 创建成功响应对象
 * 统一返回 { code, msg, data } 格式
 * @param {number} code - 业务成功码
 * @param {string} msg - 成功信息
 * @param {any} [data] - 响应数据
 */
export function createSuccessResponse(code, msg, data) {
  return { code, msg, data }
}

/**
 * 分页响应 - 统一使用 records/current/size/total 结构
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
