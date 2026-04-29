import Router from '@koa/router'
import usersAuthRouter from './router/usersAuthRouter.js'

const router = new Router({ prefix: '/api' })
// 健康检查
router.get('/health', (ctx) => {
  ctx.body = {
    status: 'ok',
    timestamp: new Date().toISOString()
  }
})

router.use(usersAuthRouter.routes(), usersAuthRouter.allowedMethods())

export default router
