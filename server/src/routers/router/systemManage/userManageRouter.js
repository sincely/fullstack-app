import Router from '@koa/router'
import userManageController from '#controllers/userManage/userManageController.js'
import { validateQuery } from '#middleware/validationMiddleware.js'
import { errorControllerWrapper } from '#utils/errorHandler.js'
import { SystemManageUserListQuerySchema } from '#schemas/userManage/userManageSchema.js'

const userManageRouter = new Router({ prefix: '/systemManage' })
userManageRouter.get(
  '/getUserList',
  validateQuery(SystemManageUserListQuerySchema),
  errorControllerWrapper(userManageController.listUsers)
)

export default userManageRouter
