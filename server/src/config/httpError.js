const httpCode = {
  ok: 200, // 成功
  created: 201, // 创建成功
  accepted: 202, // 已接受
  noContent: 204, // 无内容
  badRequest: 400, // 请求参数错误
  unauthorized: 401, // 未授权
  forbidden: 403, // 禁止访问
  notFound: 404, // 资源不存在
  methodNotAllowed: 405, // 方法不允许
  requestTimeout: 408, // 请求超时
  conflict: 409, // 资源冲突
  unprocessableEntity: 422, // 无法处理的实体
  internalServerError: 500, // 服务器内部错误
  notImplemented: 501, // 未实现
  badGateway: 502, // 网关错误
  serviceUnavailable: 503, // 服务不可用
  gatewayTimeout: 504 // 网关超时
}

const httpMessage = {
  [httpCode.ok]: '成功',
  [httpCode.created]: '创建成功',
  [httpCode.accepted]: '已接受',
  [httpCode.noContent]: '无内容',
  [httpCode.badRequest]: '请求参数错误',
  [httpCode.unauthorized]: '未授权',
  [httpCode.forbidden]: '禁止访问',
  [httpCode.notFound]: '资源不存在',
  [httpCode.methodNotAllowed]: '请求方法不允许',
  [httpCode.requestTimeout]: '请求超时',
  [httpCode.conflict]: '资源冲突',
  [httpCode.unprocessableEntity]: '无法处理的实体',
  [httpCode.internalServerError]: '服务器内部错误',
  [httpCode.notImplemented]: '功能未实现',
  [httpCode.badGateway]: '网关错误',
  [httpCode.serviceUnavailable]: '服务不可用',
  [httpCode.gatewayTimeout]: '网关超时'
}

export { httpCode, httpMessage }
