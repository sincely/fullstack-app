import { verifyToken } from '../utils/jwt.js'
import { businessCode } from '../config/businessCode.js'
import { setBody } from '../utils/response.js'
import { query } from '../db/connection.js'
import { getAuthCache, setAuthCache } from '../utils/redisCache.js'

/**
 * 查询用户的 sessionId 和 sessionExpire
 * 优先从 Redis 缓存读取，miss 时回退到 MySQL 并回填缓存
 * @param {number} userId
 * @returns {Promise<{ sessionId: string|null, sessionExpire: string|null }>}
 */
const getSessionInfo = async (userId) => {
  // 1. 尝试 Redis 缓存
  const cached = await getAuthCache(userId)
  if (cached) {
    return {
      sessionId: cached.sessionId || null,
      sessionExpire: cached.sessionExpire || null
    }
  }

  // 2. 回退 MySQL
  const sql = `
    SELECT sessionId, sessionExpire
    FROM Users
    WHERE id = ?
    LIMIT 1
  `
  const rows = await query(sql, [userId])
  const dbSessionId = rows[0]?.sessionId || null
  const sessionExpire = rows[0]?.sessionExpire || null

  // 3. 回填缓存（1 小时 TTL）
  if (dbSessionId) {
    await setAuthCache(userId, { sessionId: dbSessionId, sessionExpire })
  }

  return { sessionId: dbSessionId, sessionExpire }
}

/**
 * 尝试从 JWT Authorization 头认证用户
 * @returns {object|null} 解码的用户信息，失败返回 null
 */
const tryJwtAuth = async (ctx) => {
  const authorization = ctx.headers.authorization
  if (!authorization) return null

  const token = authorization.toLowerCase().startsWith('bearer ') ? authorization.slice(7) : undefined
  if (!token) return null

  try {
    const decoded = verifyToken(token)

    // 单设备登录控制：验证 JWT 中的 sessionId 与缓存/数据库中的一致
    const userId = decoded.userId
    const jwtSessionId = decoded.sessionId

    if (userId && jwtSessionId) {
      const { sessionId: dbSessionId, sessionExpire } = await getSessionInfo(userId)

      // 1. 检查会话是否过期
      if (sessionExpire) {
        const expireTime = new Date(sessionExpire).getTime()
        const now = Date.now()
        if (now > expireTime) return null
      }

      // 2. 检查 sessionId 是否匹配
      if (!dbSessionId || dbSessionId !== jwtSessionId) return null
    }

    return { decoded, token }
  } catch {
    return null
  }
}

/**
 * 尝试从 Session 认证用户（Redis Session Store 回退）
 * @returns {object|null} 用户信息，失败返回 null
 */
const trySessionAuth = (ctx) => {
  const sessionUser = ctx.session?.user
  if (!sessionUser?.userId) return null

  return {
    decoded: {
      userId: sessionUser.userId,
      sessionId: sessionUser.sessionId
    }
  }
}

async function authenticate(ctx, next) {
  // ── 优先 JWT 认证 ──
  const jwtResult = await tryJwtAuth(ctx)
  if (jwtResult) {
    ctx.state.user = jwtResult.decoded
    ctx.state.token = jwtResult.token
    await next()
    return
  }

  // ── 回退 Session 认证 ──
  const sessionResult = trySessionAuth(ctx)
  if (sessionResult) {
    ctx.state.user = sessionResult.decoded
    await next()
    return
  }

  // ── 两种方式都失败 ──
  const authorization = ctx.headers.authorization
  if (!authorization) {
    setBody(ctx, businessCode.unAuthorized, 401)
    return
  }

  const token = authorization.toLowerCase().startsWith('bearer ') ? authorization.slice(7) : undefined
  if (!token) {
    setBody(ctx, businessCode.unAuthorized, 401, null, 'Token 格式错误，应为 Bearer <token>')
    return
  }

  // Token 存在但验证失败（过期或无效）
  try {
    verifyToken(token)
    setBody(ctx, businessCode.accountKicked, 401)
  } catch (err) {
    setBody(ctx, err.code || businessCode.unAuthorized, 401, null, err.message)
  }
}

export default authenticate
