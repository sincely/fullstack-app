import { businessCode, businessMsg } from '../config/businessCode.js'

/**
 * 业务码 → HTTP 状态码映射
 * 根据业务语义返回合适的 HTTP status
 */
const httpStatusMap = {
  [businessCode.success]: 200,
  [businessCode.paramError]: 400,
  [businessCode.unAuthorized]: 401,
  [businessCode.tokenExpired]: 401,
  [businessCode.accountKicked]: 401,
  [businessCode.permissionDenied]: 403,
  [businessCode.userDeleteSelfDenied]: 403,
  [businessCode.userDisableSelfDenied]: 403,
  [businessCode.userNotFound]: 404,
  [businessCode.roleNotFound]: 404,
  [businessCode.userExist]: 409,
  [businessCode.emailExist]: 409,
  [businessCode.idCardExist]: 409,
  [businessCode.roleExist]: 409,
  [businessCode.roleInUse]: 409,
  [businessCode.menuPathExist]: 409,
  [businessCode.menuNameExist]: 409,
  [businessCode.menuHasChildren]: 409,
  [businessCode.error]: 500
}

/**
 * 获取业务码对应的 HTTP 状态码
 * @param {number} code
 * @returns {number}
 */
const getHttpStatus = (code) => httpStatusMap[code] ?? 200

/**
 * 快捷响应：统一构造 { code, msg, data } 并写入 ctx
 * @param {object} ctx
 * @param {number} code - 业务码
 * @param {number} [httpStatus] - 手动指定 HTTP 状态码
 * @param {any} [data] - 响应数据
 * @param {string} [overrideMsg] - 覆盖默认消息
 */
export const setBody = (ctx, code, httpStatus, data, overrideMsg) => {
  const status = httpStatus ?? getHttpStatus(code)
  const msg = overrideMsg ?? businessMsg[code] ?? ''

  ctx.status = status
  ctx.body = { code, msg, data: data ?? null }
}

/**
 * 成功响应
 * @param {object} ctx
 * @param {any} [data]
 * @param {string} [overrideMsg]
 */
export const success = (ctx, data, overrideMsg) => {
  setBody(ctx, businessCode.success, 200, data, overrideMsg ?? businessMsg[businessCode.success])
}

/**
 * 失败响应
 * @param {object} ctx
 * @param {number} code
 * @param {string} [overrideMsg]
 * @param {any} [data]
 */
export const fail = (ctx, code, overrideMsg, data) => {
  setBody(ctx, code, undefined, data, overrideMsg)
}
