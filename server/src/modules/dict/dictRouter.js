import Router from '@koa/router'
import DictController from './dictController.js'
import authenticate from '../../middleware/authenticate.js'
import authorizeRoute from '../../middleware/authorize.js'
import { validateBody, validateQuery } from '../../middleware/validationMiddleware.js'
import { errorControllerWrapper } from '../../utils/errorHandler.js'
import {
  DictCreateBodySchema,
  DictDeleteBodySchema,
  DictListQuerySchema,
  DictUpdateBodySchema
} from '../../schemas/dict/dictSchema.js'

const dictManageRouter = new Router()

const useDictManagePermission = [authenticate, authorizeRoute('/manage/dict')]

// 获取字典列表
dictManageRouter.get(
  '/systemManage/getDictList',
  ...useDictManagePermission,
  validateQuery(DictListQuerySchema),
  errorControllerWrapper(DictController.listDicts)
)

// 新增字典
dictManageRouter.post(
  '/systemManage/saveDict',
  ...useDictManagePermission,
  validateBody(DictCreateBodySchema),
  errorControllerWrapper(DictController.createDict)
)

// 更新字典
dictManageRouter.post(
  '/systemManage/updateDict',
  ...useDictManagePermission,
  validateBody(DictUpdateBodySchema),
  errorControllerWrapper(DictController.updateDict)
)

// 删除字典
dictManageRouter.post(
  '/systemManage/deleteDict',
  ...useDictManagePermission,
  validateBody(DictDeleteBodySchema),
  errorControllerWrapper(DictController.deleteDict)
)

export default dictManageRouter
