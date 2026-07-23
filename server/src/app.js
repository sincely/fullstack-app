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

// 中间件
import errorCatch from './middleware/errorCatch.js'
import requestId from './middleware/requestId.js'
import loggerMiddleware from './middleware/logger.js'
import errorHandler from './middleware/error.js'
import rewriteUrl from './middleware/rewriteUrl.js'
import compress from './middleware/compress.js'
import { securityHeaders } from './middleware/securityHeaders.js'
import { rateLimiter } from './middleware/rateLimiter.js'

// 路由
import Routers from './routers/index.js'


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
app.use(rateLimiter)

// ========== 阶段 C：请求处理层 ==========
// 8. 请求体解析（JSON、表单、文本、XML）
app.use(KoaBodyParser(bodyParserConfig))

// 9. 会话管理（cookie-based session）
app.use(
  session(
    {
      key: 'koa.sess',
      maxAge: 86400000,
      httpOnly: true,
      signed: true,
      renew: true
    },
    app
  )
)

// 10. 为静态资源请求重写 URL（去除 /public 前缀）
app.use(rewriteUrl)

// 11. 响应压缩（gzip/deflate）
app.use(compress)

// 12. 静态资源服务
app.use(KoaStatic(staticDir))

// 13. 会话用户传播（将 session.user 复制到 ctx.state.user）
app.use(async (ctx, next) => {
  ctx.state.user = ctx.session?.user
  await next()
})

// ========== 阶段 D：业务层 ==========
// 14. API 路由
app.use(Routers.routes()).use(Routers.allowedMethods())

// 15. Swagger API 文档
// registerSwagger(app)

// ========== 服务器启动 ==========
// 仅在非 Vercel 环境下启动服务器
// 本地开发：process.env.VERCEL 为 undefined（falsy），!process.env.VERCEL 为 true → 执行 app.listen()
// Vercel 部署：process.env.VERCEL 为 "1"（truthy），!process.env.VERCEL 为 false → 跳过 app.listen()
if (!process.env.VERCEL) {
  app.listen(Port, () => {
    logger.info(`服务器启动在 http://localhost:${Port}`)
    // logger.info(`Swagger 接口文档地址 http://localhost:${Port}/docs`)
  })
}

// ========== 进程级未捕获异常处理 ==========
// 防止未捕获的 Promise rejection 或异常导致进程直接退出
process.on('unhandledRejection', (reason, promise) => {
  logger.fatal({ reason, promise }, 'Unhandled Rejection')
  // 优雅退出，让 Docker/K8s/PM2 重启
  process.exit(1)
})

process.on('uncaughtException', (err) => {
  logger.fatal({ err }, 'Uncaught Exception')
  process.exit(1)
})

// 导出 app 实例，用于 Vercel 等 serverless 平台部署
export default app
