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

// 插件
import { registerSwagger } from './plugins/swagger.js'

const app = new Koa()
app.keys = [process.env.SESSION_SECRET || process.env.JWT_SECRET || 'koa-app-template-session-secret']

// ========== 全局错误捕获（必须在最前注册）==========
// 1. 全局异常捕获中间件 - 使用 AsyncLocalStorage 绑定请求上下文
app.use(errorCatch)

// 2. 应用级错误监听 - 统一处理所有未捕获异常日志
app.on('error', errorHandler())

// 请求 ID 中间件（确保后续所有中间件都能读取到 requestId）
app.use(requestId)

// HTTP请求日志中间件
app.use(loggerMiddleware)

// 安全响应头（设置各种 HTTP 安全头）
app.use(securityHeaders)

// 速率限制（防止暴力攻击和频繁请求）
app.use(rateLimiter)

// 跨域处理
app.use(cors(corsConfig))

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

// 为静态资源请求重写url
app.use(rewriteUrl)

// 响应压缩
app.use(compress)

// 使用koa-static处理静态资源
app.use(KoaStatic(staticDir))

app.use(async (ctx, next) => {
  ctx.state.user = ctx.session?.user
  await next()
})

// 处理请求体数据（必须在路由之前注册）
app.use(KoaBodyParser(bodyParserConfig))

// 使用路由中间件
app.use(Routers.routes()).use(Routers.allowedMethods())

// 注册 Swagger API 文档（替代原 docsify 文档服务）
registerSwagger(app)

// 监听服务器启动端口
// 仅在非 Vercel 环境下启动服务器
// 本地开发：process.env.VERCEL 为 undefined（falsy），!process.env.VERCEL 为 true → 执行 app.listen()
// Vercel 部署：process.env.VERCEL 为 "1"（truthy），!process.env.VERCEL 为 false → 跳过 app.listen()
if (!process.env.VERCEL) {
  app.listen(Port, () => {
    logger.info(`服务器启动在 http://localhost:${Port}`)
    logger.info(`Swagger 接口文档地址 http://localhost:${Port}/docs`)
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
