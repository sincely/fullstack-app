import Router from '@koa/router'
import UserManageController from './userManageController.js'
import authenticate from '../../middleware/authenticate.js'
import authorizeRoute from '../../middleware/authorize.js'
import { validateBody, validateQuery } from '../../middleware/validationMiddleware.js'
import { errorControllerWrapper } from '../../utils/errorHandler.js'
import {
  UserCreateBodySchema,
  UserDeleteBodySchema,
  UserListQuerySchema,
  UserUpdateBodySchema,
  UserBatchDeleteBodySchema,
  UserStatusUpdateBodySchema,
  UserPasswordResetBodySchema
} from '../../schemas/models/systemManageSchema.js'

const userManageRouter = new Router()

const useAccountManagePermission = [authenticate, authorizeRoute('/manage/user')]

// 获取用户列表
userManageRouter.get(
  '/systemManage/getUserList',
  ...useAccountManagePermission,
  validateQuery(UserListQuerySchema),
  errorControllerWrapper(UserManageController.listUsers)
)

// 新增用户
userManageRouter.post(
  '/systemManage/saveUser',
  ...useAccountManagePermission,
  validateBody(UserCreateBodySchema),
  errorControllerWrapper(UserManageController.createUser)
)

// 更新用户
userManageRouter.post(
  '/systemManage/updateUser',
  ...useAccountManagePermission,
  validateBody(UserUpdateBodySchema),
  errorControllerWrapper(UserManageController.updateUser)
)

// 删除用户
userManageRouter.post(
  '/systemManage/deleteUser',
  ...useAccountManagePermission,
  validateBody(UserDeleteBodySchema),
  errorControllerWrapper(UserManageController.deleteUser)
)

// 批量删除用户
userManageRouter.post(
  '/systemManage/batchDeleteUser',
  ...useAccountManagePermission,
  validateBody(UserBatchDeleteBodySchema),
  errorControllerWrapper(UserManageController.batchDeleteUsers)
)

// 更新用户状态
userManageRouter.post(
  '/systemManage/updateUserStatus',
  ...useAccountManagePermission,
  validateBody(UserStatusUpdateBodySchema),
  errorControllerWrapper(UserManageController.updateUserStatus)
)

// 重置用户密码
userManageRouter.post(
  '/systemManage/resetUserPassword',
  ...useAccountManagePermission,
  validateBody(UserPasswordResetBodySchema),
  errorControllerWrapper(UserManageController.resetUserPassword)
)

export default userManageRouter
