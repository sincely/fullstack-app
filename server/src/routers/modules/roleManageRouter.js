import Router from '@koa/router'
import RoleManageController from '../../controllers/roleManageController.js'
import authenticate from '../../middleware/authenticate.js'
import authorizeRoute from '../../middleware/authorize.js'
import { validateBody, validateQuery } from '../../middleware/validationMiddleware.js'
import { errorControllerWrapper } from '../../utils/errorHandler.js'
import {
  RoleCreateBodySchema,
  RoleDeleteBodySchema,
  RoleListQuerySchema,
  RoleUpdateBodySchema
} from '../../schemas/models/systemManageSchema.js'

const roleManageRouter = new Router()

const useRoleManagePermission = [authenticate, authorizeRoute('/manage/role')]
const useRoleOptionsPermission = [authenticate, authorizeRoute(['/manage/user', '/manage/menu', '/manage/role'])]

// 获取角色列表
roleManageRouter.get(
  '/systemManage/getRoleList',
  ...useRoleManagePermission,
  validateQuery(RoleListQuerySchema),
  errorControllerWrapper(RoleManageController.listRoles)
)

// 获取全部角色
roleManageRouter.get(
  '/systemManage/getAllRoles',
  ...useRoleOptionsPermission,
  errorControllerWrapper(RoleManageController.getAllRoles)
)

// 获取角色菜单 ID
roleManageRouter.get(
  '/systemManage/getRoleRouteIds',
  ...useRoleManagePermission,
  errorControllerWrapper(RoleManageController.getRoleRouteIds)
)

// 更新角色菜单 ID
roleManageRouter.post(
  '/systemManage/updateRoleRouteIds',
  ...useRoleManagePermission,
  errorControllerWrapper(RoleManageController.updateRoleRouteIds)
)

// 获取角色按钮 ID
roleManageRouter.get(
  '/systemManage/getRoleButtonIds',
  ...useRoleManagePermission,
  errorControllerWrapper(RoleManageController.getRoleButtonIds)
)

// 更新角色按钮 ID
roleManageRouter.post(
  '/systemManage/updateRoleButtonIds',
  ...useRoleManagePermission,
  errorControllerWrapper(RoleManageController.updateRoleButtonIds)
)

// 获取全部按钮
roleManageRouter.get(
  '/systemManage/getAllButtons',
  ...useRoleManagePermission,
  errorControllerWrapper(RoleManageController.getAllButtons)
)

// 新增角色
roleManageRouter.post(
  '/systemManage/saveRole',
  ...useRoleManagePermission,
  validateBody(RoleCreateBodySchema),
  errorControllerWrapper(RoleManageController.createRole)
)

// 更新角色
roleManageRouter.post(
  '/systemManage/updateRole',
  ...useRoleManagePermission,
  validateBody(RoleUpdateBodySchema),
  errorControllerWrapper(RoleManageController.updateRole)
)

// 删除角色
roleManageRouter.post(
  '/systemManage/deleteRole',
  ...useRoleManagePermission,
  validateBody(RoleDeleteBodySchema),
  errorControllerWrapper(RoleManageController.deleteRole)
)

export default roleManageRouter
