import Router from '@koa/router'
import userManageController from '#controllers/userManage/userManageController.js'
import { validateBody, validateQuery } from '#middleware/validationMiddleware.js'
import { errorControllerWrapper } from '#utils/errorHandler.js'
import {
  userManageUserCreateBodySchema,
  userManageUserDeleteBodySchema,
  userManageUserListQuerySchema,
  userManageUserUpdateBodySchema
} from '#schemas/userManage/userManageSchema.js'

const userManageRouter = new Router({ prefix: '/systemManage' })
userManageRouter.get(
  '/getUserList',
  validateQuery(userManageUserListQuerySchema),
  errorControllerWrapper(userManageController.getUserList)
)
userManageRouter.post(
  '/saveUser',
  validateBody(userManageUserCreateBodySchema),
  errorControllerWrapper(userManageController.createUser)
)
userManageRouter.post(
  '/updateUser',
  validateBody(userManageUserUpdateBodySchema),
  errorControllerWrapper(userManageController.updateUser)
)
userManageRouter.post(
  '/deleteUser',
  validateBody(userManageUserDeleteBodySchema),
  errorControllerWrapper(userManageController.deleteUser)
)

export default userManageRouter
