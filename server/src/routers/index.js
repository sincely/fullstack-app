import Router from '@koa/router'
import usersRouter from './router/userRouter.js' //
import adminRouter from './router/authRouter.js'

import routeRouter from './router/routeRouter.js'
import systemManageRouter from './router/systemManageRouter.js'
import operationLogRouter from './router/operationLogRouter.js'
import loginLogRouter from './router/loginLogRouter.js'
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
router.use(adminRouter.routes(), adminRouter.allowedMethods())

// 应用操作日志中间件（记录所有写操作）
router.use(operationLogMiddleware)

router.use(routeRouter.routes(), routeRouter.allowedMethods())
router.use(systemManageRouter.routes(), systemManageRouter.allowedMethods())
router.use(operationLogRouter.routes(), operationLogRouter.allowedMethods())
router.use(loginLogRouter.routes(), loginLogRouter.allowedMethods())

export default router
