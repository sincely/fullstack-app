import Router from '@koa/router'
import UserManageController from '../../controllers/userManageController.js'
import authenticate from '../../middleware/authenticate.js'
import authorizeRoute from '../../middleware/authorize.js'
import { validateBody, validateQuery } from '../../middleware/validationMiddleware.js'
import { errorControllerWrapper } from '../../utils/errorHandler.js'
import {
  UserCreateBodySchema,
  UserDeleteBodySchema,
  UserListQuerySchema,
  UserUpdateBodySchema
} from '../../schemas/models/adminManageSchema.js'

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

export default userManageRouter
