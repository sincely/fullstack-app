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

  // 单设备登录控制：验证 JWT 中的 sessionId 与数据库中的一致
  // 每次登录时会生成新的 sessionId 并保存到数据库和 JWT
  // 如果 JWT 中的 sessionId 与数据库不匹配，说明用户在新设备登录了
  const userId = decoded.userId
  const jwtSessionId = decoded.sessionId

  if (userId && jwtSessionId) {
    const sql = `
      SELECT sessionId, sessionExpire
      FROM Users
      WHERE id = ?
      LIMIT 1
    `
    console.log(sql);
    const rows = await query(sql, [userId])
    const dbSessionId = rows[0]?.sessionId
    const sessionExpire = rows[0]?.sessionExpire

    // 1. 检查会话是否过期
    if (sessionExpire) {
      const expireTime = new Date(sessionExpire).getTime()
      const now = Date.now()
      if (now > expireTime) {
        ctx.status = 200
        ctx.body = createErrorResponse(businessCode.accountKicked, '会话已过期，请重新登录')
        return
      }
    }

    // 2. 检查 sessionId 是否匹配
    if (!dbSessionId || dbSessionId !== jwtSessionId) {
      ctx.status = 200
      ctx.body = createErrorResponse(businessCode.accountKicked, businessMsg[businessCode.accountKicked])
      return
    }
  }

  await next()
}

export default authenticate
