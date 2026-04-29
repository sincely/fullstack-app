import Router from '@koa/router'
import roleManageController from '../../controllers/users/roleManageController.js'
import userManageController from '../../controllers/users/userManageController.js'
import { validateQuery } from '../../middleware/validationMiddleware.js'
import { errorControllerWrapper } from '../../utils/errorHandler.js'
import {
  SystemManageRoleListQuerySchema,
  SystemManageUserListQuerySchema
} from '../../schemas/models/systemManageSchema.js'

const systemManageRouter = new Router()

systemManageRouter.get(
  '/systemManage/getRoleList',
  validateQuery(SystemManageRoleListQuerySchema),
  errorControllerWrapper(roleManageController.listRoles)
)
systemManageRouter.get('/systemManage/getAllRoles', errorControllerWrapper(roleManageController.getAllRoles))
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
