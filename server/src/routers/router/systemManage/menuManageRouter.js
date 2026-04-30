import Router from '@koa/router'
import menuManageController from '#controllers/menuManage/menuManageController.js'
import { validateBody, validateQuery } from '#middleware/validationMiddleware.js'
import { errorControllerWrapper } from '#utils/errorHandler.js'
import {
  menuManageMenuBodySchema,
  menuManageMenuDeleteBodySchema,
  menuManageRoleDeleteBodySchema
} from '#schemas/menuManage/menuManageSchema.js'

const menuManageRouter = new Router({ prefix: '/systemManage' })

menuManageRouter.get(
  '/getMenuList/v2',
  validateQuery(menuManageRoleDeleteBodySchema),
  errorControllerWrapper(menuManageController.listMenus)
)
menuManageRouter.get('/getAllPages', errorControllerWrapper(menuManageController.getAllPages))
menuManageRouter.get('/getMenuTree', errorControllerWrapper(menuManageController.getMenuTree))
menuManageRouter.post(
  '/saveMenu',
  validateBody(menuManageMenuBodySchema),
  errorControllerWrapper(menuManageController.createMenu)
)
menuManageRouter.post(
  '/updateMenu',
  validateBody(menuManageMenuBodySchema),
  errorControllerWrapper(menuManageController.updateMenu)
)
menuManageRouter.post(
  '/deleteMenu',
  validateBody(menuManageMenuDeleteBodySchema),
  errorControllerWrapper(menuManageController.deleteMenu)
)

export default menuManageRouter
