import Router from '@koa/router'
import roleManageRouter from '../../modules/role/roleManageRouter.js'
import userManageRouter from '../../modules/user/userManageRouter.js'
import menuManageRouter from '../../modules/menu/menuManageRouter.js'
import dictManageRouter from '../../modules/dict/dictRouter.js'

const systemManageRouter = new Router()

systemManageRouter.use(roleManageRouter.routes(), roleManageRouter.allowedMethods())
systemManageRouter.use(userManageRouter.routes(), userManageRouter.allowedMethods())
systemManageRouter.use(menuManageRouter.routes(), menuManageRouter.allowedMethods())
systemManageRouter.use(dictManageRouter.routes(), dictManageRouter.allowedMethods())

export default systemManageRouter
