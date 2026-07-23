// 第三方库
import Koa from 'koa'
import KoaStatic from 'koa-static'
import cors from 'koa2-cors'
import session from 'koa-session'
import KoaBodyParser from '@koa/bodyparser'

// 配置文件
import { Port, staticDir } from './config/server.js'
import logger from './config/logger.js'
import corsConfig from './config/cors.js'
import { bodyParserConfig } from './config/koaBodyConfig.js'
import { redisEnabled } from './config/database.js'

// 中间件
import errorCatch from './middleware/errorCatch.js'
import requestId from './middleware/requestId.js'
import loggerMiddleware from './middleware/logger.js'
import errorHandler from './middleware/error.js'
import rewriteUrl from './middleware/rewriteUrl.js'
import compress from './middleware/compress.js'
import { securityHeaders } from './middleware/securityHeaders.js'
import { rateLimiter } from './middleware/rateLimiter.js'
import { redisRateLimiter } from './middleware/rateLimiterRedis.js'

// 路由
import Routers from './routers/index.js'

// 数据库
import { verifyMySQLConnection } from './db/connection.js'
import { connectRedis, getRedisClient } from './db/redis.js'
import { createRedisSessionStore } from './session/redisStore.js'

const app = new Koa()
app.keys = [process.env.SESSION_SECRET || process.env.JWT_SECRET || 'koa-app-template-session-secret']

// ========== 阶段 A：基础设施层 ==========
// 1. 全局异常捕获中间件 - 使用 AsyncLocalStorage 绑定请求上下文（洋葱模型最外层）
app.use(errorCatch)

// 2. 应用级错误监听 - 统一处理所有未捕获异常日志
app.on('error', errorHandler())

// 3. 请求 ID 中间件（确保后续所有中间件都能读取到 requestId）
app.use(requestId)

// 4. HTTP 请求日志中间件
app.use(loggerMiddleware)

// ========== 阶段 B：安全层 ==========
// 5. 安全响应头（HSTS、CSP、X-Frame-Options 等）
app.use(securityHeaders)

// 6. 跨域处理
app.use(cors(corsConfig))

// 7. 限流（在请求体解析前执行，快速拒绝超限请求）
  app.use(redisEnabled ? redisRateLimiter : rateLimiter)

// ========== 阶段 C：请求处理层 ==========
// 8. 请求体解析（JSON、表单、文本、XML）
app.use(KoaBodyParser(bodyParserConfig))

// 9. 会话管理（Redis Store 或 Cookie-based）
const sessionConfig = {
  key: 'koa.sess',
  maxAge: 86400000, // 1 天
  httpOnly: true,
  signed: true,
  renew: true
}

// 如果启用 Redis，使用 Redis Session Store；否则使用默认的 Cookie-based Session
if (redisEnabled) {
  const redis = getRedisClient()
  if (redis) {
    sessionConfig.store = createRedisSessionStore(redis)
    logger.info('Session 使用 Redis 存储')
  }
} else {
  logger.info('Session 使用 Cookie 存储（Redis 未启用）')
}

app.use(session(sessionConfig, app))

// 10. 为静态资源请求重写 URL（去除 /public 前缀）
app.use(rewriteUrl)

// 11. 响应压缩（gzip/deflate）
app.use(compress)

// 12. 静态资源服务
app.use(KoaStatic(staticDir))

// 13. Session 回退传播（仅当 Session 有值且 JWT 认证尚未设置 ctx.state.user 时生效）
// 注意：实际认证由 authenticate 中间件统一处理（JWT 优先 → Session 回退）
app.use(async (ctx, next) => {
  if (!ctx.state.user && ctx.session?.user) {
    ctx.state.user = { userId: ctx.session.user.userId }
  }
  await next()
})

// ========== 阶段 D：业务层 ==========
// 14. API 路由
app.use(Routers.routes()).use(Routers.allowedMethods())

// 15. Swagger API 文档
// registerSwagger(app)

// ========== 服务器启动 ==========
// 仅在非 Vercel 环境下启动服务器
if (!process.env.VERCEL) {
  const startServer = async () => {
    // ── 启动前：验证数据库连接 ──
    logger.info('正在验证数据库连接...')

    // MySQL：必须成功，否则进程退出
    try {
      await verifyMySQLConnection()
    } catch (err) {
      logger.fatal({ err: { message: err.message } }, 'MySQL 连接失败，服务无法启动')
      process.exit(1)
    }

    // Redis：根据配置决定是否启用，失败时降级（不阻塞启动）
    if (redisEnabled) {
      try {
        await connectRedis()
      } catch (err) {
        logger.warn(
          { err: { message: err.message } },
          'Redis 连接失败，服务将降级运行（任务队列/缓存不可用）'
        )
      }
    } else {
      logger.info('Redis 未启用（REDIS_ENABLED !== true）')
    }

    // ── 启动 HTTP 服务器 ──
    const server = app.listen(Port, () => {
      logger.info(`服务器启动在 http://localhost:${Port}`)
    })

    // ── 优雅关闭 ──
    const gracefulShutdown = async (signal) => {
      logger.info(`收到 ${signal} 信号，开始优雅关闭...`)

      // 1. 停止接收新请求
      server.close(() => {
        logger.info('HTTP 服务器已关闭，不再接收新请求')
      })

      // 2. 关闭数据库连接
      const { closeMySQL } = await import('./db/connection.js')
      const { closeRedis } = await import('./db/redis.js')

      await Promise.allSettled([closeMySQL(), closeRedis()])

      logger.info('所有资源已释放，进程退出')
      process.exit(0)
    }

    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'))
    process.on('SIGINT', () => gracefulShutdown('SIGINT'))
  }

  startServer()
}

// ========== 进程级未捕获异常处理 ==========
process.on('unhandledRejection', (reason, promise) => {
  logger.fatal({ reason, promise }, 'Unhandled Rejection')
  process.exit(1)
})

process.on('uncaughtException', (err) => {
  logger.fatal({ err }, 'Uncaught Exception')
  process.exit(1)
})

// 导出 app 实例，用于 Vercel 等 serverless 平台部署
export default app
