import { verifyToken } from '../utils/jwt.js'
import { createErrorResponse } from '../utils/createResponse.js'
import { businessCode } from '../config/businessCode.js'

async function authenticate(ctx, next) {
  // 从请求头获取 Token
  const authorization = ctx.headers.authorization

  if (!authorization) {
    ctx.status = 200
    ctx.body = createErrorResponse(businessCode.unAuthorized, '未登录或登录已过期')
    return
  }

  // 校验 Token 格式 (Bearer <token>)
  const token = authorization.toLowerCase().startsWith('bearer ') ? authorization.slice(7) : undefined
  if (!token) {
    ctx.status = 200
    ctx.body = createErrorResponse(businessCode.unAuthorized, 'Token 格式错误，应为 Bearer <token>')
    return
  }

  // 验证 Token（verifyToken 现在会抛出带 code 的错误）
  let decoded
  try {
    decoded = verifyToken(token)
  } catch (err) {
    ctx.status = 200
    ctx.body = createErrorResponse(err.code || businessCode.unAuthorized, err.message)
    return
  }

  // 将解码后的用户信息存储在 ctx.state.user 中，供后续中间件和路由使用
  ctx.state.user = decoded
  // 存储原始 token，供 logout 等接口使用
  ctx.state.token = token
  await next()
}

export default authenticate
