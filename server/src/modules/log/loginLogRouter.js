import Router from '@koa/router'
import LoginLogController from './loginLogController.js'
import authenticate from '../../middleware/authenticate.js'
import authorizeRoute from '../../middleware/authorize.js'
import { validateQuery, validateBody } from '../../middleware/validationMiddleware.js'
import { errorControllerWrapper } from '../../utils/errorHandler.js'
import {
  LoginLogListQuerySchema,
  LogBatchDeleteBodySchema
} from '../../schemas/models/logSchema.js'

const loginLogRouter = new Router()

const usePermission = [authenticate, authorizeRoute('/log')]

// 获取登录日志列表
loginLogRouter.get(
  '/log/getLoginLogList',
  ...usePermission,
  validateQuery(LoginLogListQuerySchema),
  errorControllerWrapper(LoginLogController.listLoginLogs)
)

// 获取登录日志详情
loginLogRouter.get(
  '/log/getLoginLogDetail',
  ...usePermission,
  errorControllerWrapper(LoginLogController.getLoginLogDetail)
)

// 批量删除登录日志
loginLogRouter.post(
  '/log/batchDeleteLoginLog',
  ...usePermission,
  validateBody(LogBatchDeleteBodySchema),
  errorControllerWrapper(LoginLogController.batchDeleteLoginLogs)
)

// 清空登录日志
loginLogRouter.post(
  '/log/clearLoginLogs',
  ...usePermission,
  errorControllerWrapper(LoginLogController.clearLoginLogs)
)

export default loginLogRouter
