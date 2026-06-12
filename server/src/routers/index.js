import Router from '@koa/router'
import usersRouter from './modules/userRouter.js'
import authRouter from './modules/authRouter.js'

import routeRouter from './modules/routeRouter.js'
import systemManageRouter from './modules/systemManageRouter.js'
import operationLogRouter from './modules/operationLogRouter.js'
import loginLogRouter from './modules/loginLogRouter.js'
import { operationLogMiddleware } from '../middleware/logMiddleware.js'

const router = new Router({ prefix: '/api' })
// 健康检查
router.get('/health', (ctx) => {
  ctx.body = {
    status: 'ok',
    timestamp: new Date().toISOString()
  }
})

router.use(usersRouter.routes(), usersRouter.allowedMethods())
router.use(authRouter.routes(), authRouter.allowedMethods())

// 应用操作日志中间件（记录所有写操作）
router.use(operationLogMiddleware)

router.use(routeRouter.routes(), routeRouter.allowedMethods())
router.use(systemManageRouter.routes(), systemManageRouter.allowedMethods())
router.use(operationLogRouter.routes(), operationLogRouter.allowedMethods())
router.use(loginLogRouter.routes(), loginLogRouter.allowedMethods())

export default router
