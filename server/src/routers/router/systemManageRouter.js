import Router from '@koa/router'
import menuManageController from '../../controllers/users/menuManageController.js'
import roleManageController from '../../controllers/users/roleManageController.js'
import userManageController from '../../controllers/users/userManageController.js'
import { validateBody, validateQuery } from '../../middleware/validationMiddleware.js'
import { errorControllerWrapper } from '../../utils/errorHandler.js'
import {
  SystemManageMenuBodySchema,
  SystemManageMenuDeleteBodySchema,
  SystemManageMenuListQuerySchema,
  SystemManageRoleBodySchema,
  SystemManageRoleButtonBodySchema,
  SystemManageRoleButtonQuerySchema,
  SystemManageRoleDeleteBodySchema,
  SystemManageRoleRouteBodySchema,
  SystemManageRoleRouteQuerySchema,
  SystemManageRoleListQuerySchema,
  SystemManageUserListQuerySchema
} from '../../schemas/models/systemManageSchema.js'

const systemManageRouter = new Router()

systemManageRouter.get('/systemManage/getMenuList', errorControllerWrapper(menuManageController.listMenusV1))
systemManageRouter.get(
  '/systemManage/getMenuList/v2',
  validateQuery(SystemManageMenuListQuerySchema),
  errorControllerWrapper(menuManageController.listMenus)
)
systemManageRouter.get('/systemManage/getAllPages', errorControllerWrapper(menuManageController.getAllPages))
systemManageRouter.get('/systemManage/getMenuTree', errorControllerWrapper(menuManageController.getMenuTree))
systemManageRouter.post(
  '/systemManage/saveMenu',
  validateBody(SystemManageMenuBodySchema),
  errorControllerWrapper(menuManageController.createMenu)
)
systemManageRouter.post(
  '/systemManage/updateMenu',
  validateBody(SystemManageMenuBodySchema),
  errorControllerWrapper(menuManageController.updateMenu)
)
systemManageRouter.post(
  '/systemManage/deleteMenu',
  validateBody(SystemManageMenuDeleteBodySchema),
  errorControllerWrapper(menuManageController.deleteMenu)
)
systemManageRouter.get(
  '/systemManage/getRoleRouteIds',
  validateQuery(SystemManageRoleRouteQuerySchema),
  errorControllerWrapper(roleManageController.getRoleRouteIds)
)
systemManageRouter.get(
  '/systemManage/getRoleButtonIds',
  validateQuery(SystemManageRoleButtonQuerySchema),
  errorControllerWrapper(roleManageController.getRoleButtonIds)
)
systemManageRouter.get('/systemManage/getAllButtons', errorControllerWrapper(roleManageController.getAllButtons))
systemManageRouter.post(
  '/systemManage/updateRoleRouteIds',
  validateBody(SystemManageRoleRouteBodySchema),
  errorControllerWrapper(roleManageController.updateRoleRouteIds)
)
systemManageRouter.post(
  '/systemManage/updateRoleButtonIds',
  validateBody(SystemManageRoleButtonBodySchema),
  errorControllerWrapper(roleManageController.updateRoleButtonIds)
)
systemManageRouter.get(
  '/systemManage/getRoleList',
  validateQuery(SystemManageRoleListQuerySchema),
  errorControllerWrapper(roleManageController.listRoles)
)
systemManageRouter.get('/systemManage/getAllRoles', errorControllerWrapper(roleManageController.getAllRoles))
systemManageRouter.post(
  '/systemManage/saveRole',
  validateBody(SystemManageRoleBodySchema),
  errorControllerWrapper(roleManageController.createRole)
)
systemManageRouter.post(
  '/systemManage/updateRole',
  validateBody(SystemManageRoleBodySchema),
  errorControllerWrapper(roleManageController.updateRole)
)
systemManageRouter.post(
  '/systemManage/deleteRole',
  validateBody(SystemManageRoleDeleteBodySchema),
  errorControllerWrapper(roleManageController.deleteRole)
)
systemManageRouter.get(
  '/systemManage/getUserList',
  validateQuery(SystemManageUserListQuerySchema),
  errorControllerWrapper(userManageController.listUsers)
)
systemManageRouter.get(
  '/systemManage/getUserList/v1',
  validateQuery(SystemManageUserListQuerySchema),
  errorControllerWrapper(userManageController.listUsers)
)

export default systemManageRouter
