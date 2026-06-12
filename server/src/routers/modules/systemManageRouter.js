import Router from '@koa/router'
import roleManageRouter from './roleManageRouter.js'
import userManageRouter from './userManageRouter.js'
import menuManageRouter from './menuManageRouter.js'

const systemManageRouter = new Router()

systemManageRouter.use(roleManageRouter.routes(), roleManageRouter.allowedMethods())
systemManageRouter.use(userManageRouter.routes(), userManageRouter.allowedMethods())
systemManageRouter.use(menuManageRouter.routes(), menuManageRouter.allowedMethods())

export default systemManageRouter
