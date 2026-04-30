import Router from '@koa/router'
import userManageController from '#controllers/userManage/userManageController.js'
import { validateBody, validateQuery } from '#middleware/validationMiddleware.js'
import { errorControllerWrapper } from '#utils/errorHandler.js'
import { userManageUserCreateBodySchema, userManageUserListQuerySchema } from '#schemas/userManage/userManageSchema.js'

const userManageRouter = new Router({ prefix: '/systemManage' })
userManageRouter.get(
  '/getUserList',
  validateQuery(userManageUserListQuerySchema),
  errorControllerWrapper(userManageController.listUsers)
)
userManageRouter.post(
  '/saveUser',
  validateBody(userManageUserCreateBodySchema),
  errorControllerWrapper(userManageController.createUser)
)

export default userManageRouter
