import Router from '@koa/router'
import authRouter from '../modules/auth/authRouter.js'

import routeRouter from '../modules/route/routeRouter.js'
import systemManageRouter from './modules/systemManageRouter.js'
import operationLogRouter from '../modules/log/operationLogRouter.js'
import loginLogRouter from '../modules/log/loginLogRouter.js'
import { operationLogMiddleware } from '../middleware/logMiddleware.js'
import { checkMySQL } from '../db/connection.js'
import { checkRedis } from '../db/redis.js'

const router = new Router({ prefix: '/api' })

/**
 * 健康检查端点
 *
 * GET /api/health        → 快速检查（仅返回进程状态）
 * GET /api/health?deep   → 深度检查（探测 MySQL + Redis）
 */
router.get('/health', async (ctx) => {
  const isDeep = ctx.query.deep !== undefined

  const base = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: {
      rss: `${Math.round(process.memoryUsage().rss / 1024 / 1024)}MB`,
      heapUsed: `${Math.round(process.memoryUsage().heapUsed / 1024 / 1024)}MB`
    }
  }

  if (!isDeep) {
    ctx.body = base
    return
  }

  // 深度探针：并行检测 MySQL 和 Redis
  const [mysql, redis] = await Promise.all([checkMySQL(), checkRedis()])

  const allUp = mysql.status === 'up' && (redis.status === 'up' || redis.status === 'disabled')

  ctx.status = allUp ? 200 : 503
  ctx.body = {
    ...base,
    status: allUp ? 'healthy' : 'degraded',
    services: { mysql, redis }
  }
})

router.use(authRouter.routes(), authRouter.allowedMethods())

// 应用操作日志中间件（记录所有写操作）
router.use(operationLogMiddleware)

router.use(routeRouter.routes(), routeRouter.allowedMethods())
router.use(systemManageRouter.routes(), systemManageRouter.allowedMethods())
router.use(operationLogRouter.routes(), operationLogRouter.allowedMethods())
router.use(loginLogRouter.routes(), loginLogRouter.allowedMethods())

export default router
