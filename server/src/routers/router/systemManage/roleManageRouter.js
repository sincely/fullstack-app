import Router from '@koa/router'
import roleManageController from '#controllers/roleManage/roleManageController.js'
import { validateBody, validateQuery } from '#middleware/validationMiddleware.js'
import { errorControllerWrapper } from '#utils/errorHandler.js'
import {
  SystemManageRoleBodySchema,
  SystemManageRoleButtonBodySchema,
  SystemManageRoleButtonQuerySchema,
  SystemManageRoleDeleteBodySchema,
  SystemManageRoleRouteBodySchema,
  SystemManageRoleRouteQuerySchema,
  SystemManageRoleListQuerySchema
} from '#schemas/roleManage/roleManageSchema.js'

const roleManageRouter = new Router({ prefix: '/systemManage' })

roleManageRouter.get(
  '/getRoleRouteIds',
  validateQuery(SystemManageRoleRouteQuerySchema),
  errorControllerWrapper(roleManageController.getRoleRouteIds)
)
roleManageRouter.get(
  '/getRoleButtonIds',
  validateQuery(SystemManageRoleButtonQuerySchema),
  errorControllerWrapper(roleManageController.getRoleButtonIds)
)
roleManageRouter.get('/getAllButtons', errorControllerWrapper(roleManageController.getAllButtons))
roleManageRouter.post(
  '/updateRoleRouteIds',
  validateBody(SystemManageRoleRouteBodySchema),
  errorControllerWrapper(roleManageController.updateRoleRouteIds)
)
roleManageRouter.post(
  '/updateRoleButtonIds',
  validateBody(SystemManageRoleButtonBodySchema),
  errorControllerWrapper(roleManageController.updateRoleButtonIds)
)
roleManageRouter.get(
  '/getRoleList',
  validateQuery(SystemManageRoleListQuerySchema),
  errorControllerWrapper(roleManageController.listRoles)
)
roleManageRouter.get('/getAllRoles', errorControllerWrapper(roleManageController.getAllRoles))
roleManageRouter.post(
  '/saveRole',
  validateBody(SystemManageRoleBodySchema),
  errorControllerWrapper(roleManageController.createRole)
)
roleManageRouter.post(
  '/updateRole',
  validateBody(SystemManageRoleBodySchema),
  errorControllerWrapper(roleManageController.updateRole)
)
roleManageRouter.post(
  '/deleteRole',
  validateBody(SystemManageRoleDeleteBodySchema),
  errorControllerWrapper(roleManageController.deleteRole)
)

export default roleManageRouter
