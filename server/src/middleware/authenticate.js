import { verifyToken } from '../utils/jwt.js'
import { createErrorResponse } from '../utils/createResponse.js'
import { businessCode, businessMsg } from '../config/businessCode.js'
import { query } from '../utils/db.js'

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

  // 单设备登录控制：验证 JWT 中的 loginTime 与数据库中的一致
  // 每次登录时会生成新的 loginTime 并保存到数据库和 JWT
  // 如果 JWT 中的 loginTime 与数据库不匹配，说明用户在新设备登录了
  const userId = decoded.userId
  const jwtLoginTime = decoded.loginTime

  if (userId && jwtLoginTime) {
    const sql = 'SELECT loginTime FROM Users WHERE id = ? LIMIT 1'
    const rows = await query(sql, [userId])
    const dbLoginTime = rows[0]?.loginTime

    // 如果数据库中的 loginTime 与 JWT 中的不匹配，说明已被踢出
    if (!dbLoginTime || dbLoginTime !== jwtLoginTime) {
      ctx.status = 200
      ctx.body = createErrorResponse(businessCode.accountKicked, businessMsg[businessCode.accountKicked])
      return
    }
  }

  await next()
}

export default authenticate
