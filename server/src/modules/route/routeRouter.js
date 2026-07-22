import Router from '@koa/router'
import authenticate from '../../middleware/authenticate.js'
import { errorControllerWrapper } from '../../utils/errorHandler.js'
import routerController from './routerController.js'

const routeRouter = new Router()

// 获取常量路由
routeRouter.get(
  '/route/getConstantRoutes',
  errorControllerWrapper(routerController.getConstantRoutes)
)

// 获取用户路由
routeRouter.get(
  '/route/getUserRoutes',
  authenticate,
  errorControllerWrapper(routerController.getUserRoutes)
)

// 判断路由是否存在
routeRouter.get(
  '/route/isRouteExist',
  authenticate,
  errorControllerWrapper(routerController.isRouteExist)
)

export default routeRouter
