import Router from '@koa/router'
import usersAuthRouter from './router/common/usersAuthRouter.js' // 引入用户认证路由

import menuManageRouter from '#routers/router/systemManage/menuManageRouter.js'
import roleManageRouter from '#routers/router/systemManage/roleManageRouter.js'
import userManageRouter from '#routers/router/systemManage/userManageRouter.js'
const router = new Router({ prefix: '/api' })
// 健康检查
router.get('/health', (ctx) => {
  ctx.body = {
    status: 'ok',
    timestamp: new Date().toISOString()
  }
})

router.use(usersAuthRouter.routes(), usersAuthRouter.allowedMethods())
router.use(menuManageRouter.routes(), menuManageRouter.allowedMethods())
router.use(roleManageRouter.routes(), roleManageRouter.allowedMethods())
router.use(userManageRouter.routes(), userManageRouter.allowedMethods())

export default router
