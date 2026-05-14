import Router from '@koa/router'
import UserManageController from '../../controllers/admin/userManageController.js'
import RoleManageController from '../../controllers/admin/roleManageController.js'
import MenuManageController from '../../controllers/admin/menuManageController.js'
import authenticate from '../../middleware/authenticate.js'
import authorizeRoute from '../../middleware/authorize.js'
import { validateBody, validateQuery } from '../../middleware/validationMiddleware.js'
import { errorControllerWrapper } from '../../utils/errorHandler.js'
import {
  AdminMenuCreateBodySchema,
  AdminMenuDeleteBodySchema,
  AdminMenuUpdateBodySchema,
  AdminRoleCreateBodySchema,
  AdminRoleDeleteBodySchema,
  AdminRoleUpdateBodySchema,
  AdminUserCreateBodySchema,
  AdminUserDeleteBodySchema,
  AdminUserListQuerySchema,
  AdminUserUpdateBodySchema
} from '../../schemas/models/adminManageSchema.js'

const systemManageRouter = new Router()

const useAccountManagePermission = [authenticate, authorizeRoute('/system/accountManage')]
const useRoleManagePermission = [authenticate, authorizeRoute('/system/roleManage')]
const useMenuManagePermission = [authenticate, authorizeRoute('/system/menuMange')]

// 获取角色列表
systemManageRouter.get(
  '/systemManage/getRoleList',
  ...useRoleManagePermission,
  errorControllerWrapper(RoleManageController.listRoles)
)

// 获取全部角色
systemManageRouter.get(
  '/systemManage/getAllRoles',
  ...useRoleManagePermission,
  errorControllerWrapper(RoleManageController.listRoles)
)

// 获取角色菜单 ID
systemManageRouter.get(
  '/systemManage/getRoleRouteIds',
  ...useRoleManagePermission,
  errorControllerWrapper((ctx) => {
    ctx.body = {
      code: 200,
      data: [],
      msg: 'ok'
    }
  })
)

// 更新角色菜单 ID
systemManageRouter.post(
  '/systemManage/updateRoleRouteIds',
  ...useRoleManagePermission,
  errorControllerWrapper((ctx) => {
    ctx.body = {
      code: 200,
      data: null,
      msg: 'ok'
    }
  })
)

// 获取角色按钮 ID
systemManageRouter.get(
  '/systemManage/getRoleButtonIds',
  ...useRoleManagePermission,
  errorControllerWrapper((ctx) => {
    ctx.body = {
      code: 200,
      data: [],
      msg: 'ok'
    }
  })
)

// 更新角色按钮 ID
systemManageRouter.post(
  '/systemManage/updateRoleButtonIds',
  ...useRoleManagePermission,
  errorControllerWrapper((ctx) => {
    ctx.body = {
      code: 200,
      data: null,
      msg: 'ok'
    }
  })
)

// 获取全部按钮
systemManageRouter.get(
  '/systemManage/getAllButtons',
  ...useRoleManagePermission,
  errorControllerWrapper((ctx) => {
    ctx.body = {
      code: 200,
      data: [],
      msg: 'ok'
    }
  })
)

// 新增角色
systemManageRouter.post(
  '/systemManage/saveRole',
  ...useRoleManagePermission,
  validateBody(AdminRoleCreateBodySchema),
  errorControllerWrapper(RoleManageController.createRole)
)

// 更新角色
systemManageRouter.post(
  '/systemManage/updateRole',
  ...useRoleManagePermission,
  validateBody(AdminRoleUpdateBodySchema),
  errorControllerWrapper(RoleManageController.updateRole)
)

// 删除角色
systemManageRouter.post(
  '/systemManage/deleteRole',
  ...useRoleManagePermission,
  validateBody(AdminRoleDeleteBodySchema),
  errorControllerWrapper(RoleManageController.deleteRole)
)

// 获取用户列表
systemManageRouter.get(
  '/systemManage/getUserList',
  ...useAccountManagePermission,
  validateQuery(AdminUserListQuerySchema),
  errorControllerWrapper(UserManageController.listUsers)
)

// 新增用户
systemManageRouter.post(
  '/systemManage/saveUser',
  ...useAccountManagePermission,
  validateBody(AdminUserCreateBodySchema),
  errorControllerWrapper(UserManageController.createUser)
)

// 更新用户
systemManageRouter.post(
  '/systemManage/updateUser',
  ...useAccountManagePermission,
  validateBody(AdminUserUpdateBodySchema),
  errorControllerWrapper(UserManageController.updateUser)
)

// 删除用户
systemManageRouter.post(
  '/systemManage/deleteUser',
  ...useAccountManagePermission,
  validateBody(AdminUserDeleteBodySchema),
  errorControllerWrapper(UserManageController.deleteUser)
)

// 获取菜单列表
systemManageRouter.get(
  '/systemManage/getMenuList',
  ...useMenuManagePermission,
  errorControllerWrapper(MenuManageController.listMenus)
)

// 获取菜单列表 v2
systemManageRouter.get(
  '/systemManage/getMenuList/v2',
  ...useMenuManagePermission,
  errorControllerWrapper(MenuManageController.listMenus)
)

// 获取全部页面
systemManageRouter.get(
  '/systemManage/getAllPages',
  ...useMenuManagePermission,
  errorControllerWrapper((ctx) => {
    ctx.body = {
      code: 200,
      data: [],
      msg: 'ok'
    }
  })
)

// 获取菜单树
systemManageRouter.get(
  '/systemManage/getMenuTree',
  ...useMenuManagePermission,
  errorControllerWrapper(MenuManageController.listMenus)
)

// 新增菜单
systemManageRouter.post(
  '/systemManage/saveMenu',
  ...useMenuManagePermission,
  validateBody(AdminMenuCreateBodySchema),
  errorControllerWrapper(MenuManageController.createMenu)
)

// 更新菜单
systemManageRouter.post(
  '/systemManage/updateMenu',
  ...useMenuManagePermission,
  validateBody(AdminMenuUpdateBodySchema),
  errorControllerWrapper(MenuManageController.updateMenu)
)

// 删除菜单
systemManageRouter.post(
  '/systemManage/deleteMenu',
  ...useMenuManagePermission,
  validateBody(AdminMenuDeleteBodySchema),
  errorControllerWrapper(MenuManageController.deleteMenu)
)

export default systemManageRouter
