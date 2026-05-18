import Router from '@koa/router'
import usersRouter from './router/userRouter.js' //
import adminRouter from './router/authRouter.js'

import routeRouter from './router/routeRouter.js'
import systemManageRouter from './router/systemManageRouter.js'

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

router.use(routeRouter.routes(), routeRouter.allowedMethods())
router.use(systemManageRouter.routes(), systemManageRouter.allowedMethods())

export default router
