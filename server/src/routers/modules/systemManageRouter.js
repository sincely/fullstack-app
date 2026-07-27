import Router from '@koa/router'
import roleManageRouter from '../../modules/role/roleManageRouter.js'
import userManageRouter from '../../modules/user/userManageRouter.js'
import menuManageRouter from '../../modules/menu/menuManageRouter.js'

const systemManageRouter = new Router()

systemManageRouter.use(roleManageRouter.routes(), roleManageRouter.allowedMethods())
systemManageRouter.use(userManageRouter.routes(), userManageRouter.allowedMethods())
systemManageRouter.use(menuManageRouter.routes(), menuManageRouter.allowedMethods())

export default systemManageRouter
