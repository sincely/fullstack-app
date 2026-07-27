import Router from '@koa/router'
import OperationLogController from './operationLogController.js'
import authenticate from '../../middleware/authenticate.js'
import authorizeRoute from '../../middleware/authorize.js'
import { validateQuery, validateBody } from '../../middleware/validationMiddleware.js'
import { errorControllerWrapper } from '../../utils/errorHandler.js'
import {
  OperationLogListQuerySchema,
  LogBatchDeleteBodySchema
} from '../../schemas/log/logSchema.js'

const operationLogRouter = new Router()

const usePermission = [authenticate, authorizeRoute('/log')]

// 获取操作日志列表
operationLogRouter.get(
  '/log/getOperationLogList',
  ...usePermission,
  validateQuery(OperationLogListQuerySchema),
  errorControllerWrapper(OperationLogController.listOperationLogs)
)

// 获取操作日志详情
operationLogRouter.get(
  '/log/getOperationLogDetail',
  ...usePermission,
  errorControllerWrapper(OperationLogController.getOperationLogDetail)
)

// 批量删除操作日志
operationLogRouter.post(
  '/log/batchDeleteOperationLog',
  ...usePermission,
  validateBody(LogBatchDeleteBodySchema),
  errorControllerWrapper(OperationLogController.batchDeleteOperationLogs)
)

// 清空操作日志
operationLogRouter.post(
  '/log/clearOperationLogs',
  ...usePermission,
  errorControllerWrapper(OperationLogController.clearOperationLogs)
)

export default operationLogRouter
