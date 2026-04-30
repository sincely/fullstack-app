import Router from '@koa/router'
import roleManageController from '#controllers/roleManage/roleManageController.js'
import { validateBody, validateQuery } from '#middleware/validationMiddleware.js'
import { errorControllerWrapper } from '#utils/errorHandler.js'
import {
  roleManageRoleBodySchema,
  roleManageRoleButtonBodySchema,
  roleManageRoleButtonQuerySchema,
  roleManageRoleDeleteBodySchema,
  roleManageRoleRouteBodySchema,
  roleManageRoleRouteQuerySchema,
  roleManageUserCreateBodySchema
} from '#schemas/roleManage/roleManageSchema.js'

const roleManageRouter = new Router({ prefix: '/systemManage' })

roleManageRouter.get(
  '/getRoleRouteIds',
  validateQuery(roleManageRoleRouteQuerySchema),
  errorControllerWrapper(roleManageController.getRoleRouteIds)
)
roleManageRouter.get(
  '/getRoleButtonIds',
  validateQuery(roleManageRoleButtonQuerySchema),
  errorControllerWrapper(roleManageController.getRoleButtonIds)
)
roleManageRouter.get('/getAllButtons', errorControllerWrapper(roleManageController.getAllButtons))
roleManageRouter.post(
  '/updateRoleRouteIds',
  validateBody(roleManageRoleRouteBodySchema),
  errorControllerWrapper(roleManageController.updateRoleRouteIds)
)
roleManageRouter.post(
  '/updateRoleButtonIds',
  validateBody(roleManageRoleButtonBodySchema),
  errorControllerWrapper(roleManageController.updateRoleButtonIds)
)
roleManageRouter.get(
  '/getRoleList',
  validateQuery(roleManageUserCreateBodySchema),
  errorControllerWrapper(roleManageController.listRoles)
)
roleManageRouter.get('/getAllRoles', errorControllerWrapper(roleManageController.getAllRoles))
roleManageRouter.post(
  '/saveRole',
  validateBody(roleManageRoleBodySchema),
  errorControllerWrapper(roleManageController.createRole)
)
roleManageRouter.post(
  '/updateRole',
  validateBody(roleManageRoleBodySchema),
  errorControllerWrapper(roleManageController.updateRole)
)
roleManageRouter.post(
  '/deleteRole',
  validateBody(roleManageRoleDeleteBodySchema),
  errorControllerWrapper(roleManageController.deleteRole)
)

export default roleManageRouter
