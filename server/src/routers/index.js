import Router from '@koa/router'
import usersAuthRouter from '#routers/router/usersAuthRouter.js'
import systemManageRouter from '#routers/router/systemManageRouter.js'

const router = new Router({ prefix: '/api' })
// 健康检查
router.get('/health', (ctx) => {
  ctx.body = {
    status: 'ok',
    timestamp: new Date().toISOString()
  }
})

router.use(usersAuthRouter.routes(), usersAuthRouter.allowedMethods())
router.use(systemManageRouter.routes(), systemManageRouter.allowedMethods())

export default router
