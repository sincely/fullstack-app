import Router from '@koa/router'
import menuManageController from '#controllers/menuManage/menuManageController.js'
import { validateBody, validateQuery } from '#middleware/validationMiddleware.js'
import { errorControllerWrapper } from '#utils/errorHandler.js'
import {
  SystemManageMenuBodySchema,
  SystemManageMenuDeleteBodySchema,
  SystemManageMenuListQuerySchema
} from '#schemas/menuManage/menuManageSchema.js'

const menuManageRouter = new Router({ prefix: '/systemManage' })

menuManageRouter.get(
  '/getMenuList/v2',
  validateQuery(SystemManageMenuListQuerySchema),
  errorControllerWrapper(menuManageController.listMenus)
)
menuManageRouter.get('/getAllPages', errorControllerWrapper(menuManageController.getAllPages))
menuManageRouter.get('/getMenuTree', errorControllerWrapper(menuManageController.getMenuTree))
menuManageRouter.post(
  '/saveMenu',
  validateBody(SystemManageMenuBodySchema),
  errorControllerWrapper(menuManageController.createMenu)
)
menuManageRouter.post(
  '/updateMenu',
  validateBody(SystemManageMenuBodySchema),
  errorControllerWrapper(menuManageController.updateMenu)
)
menuManageRouter.post(
  '/deleteMenu',
  validateBody(SystemManageMenuDeleteBodySchema),
  errorControllerWrapper(menuManageController.deleteMenu)
)

export default menuManageRouter
