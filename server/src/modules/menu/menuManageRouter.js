import Router from '@koa/router'
import MenuManageController from './menuManageController.js'
import authenticate from '../../middleware/authenticate.js'
import authorizeRoute from '../../middleware/authorize.js'
import { validateBody, validateQuery } from '../../middleware/validationMiddleware.js'
import { errorControllerWrapper } from '../../utils/errorHandler.js'
import {
  MenuCreateBodySchema,
  MenuDeleteBodySchema,
  MenuListQuerySchema,
  MenuUpdateBodySchema
} from '../../schemas/models/systemManageSchema.js'

const menuManageRouter = new Router()

const useMenuManagePermission = [authenticate, authorizeRoute('/manage/menu')]

// 获取菜单列表
menuManageRouter.get(
  '/systemManage/getMenuList',
  ...useMenuManagePermission,
  validateQuery(MenuListQuerySchema),
  errorControllerWrapper(MenuManageController.listMenus)
)

// 获取菜单列表 v2
menuManageRouter.get(
  '/systemManage/getMenuList/v2',
  ...useMenuManagePermission,
  validateQuery(MenuListQuerySchema),
  errorControllerWrapper(MenuManageController.listMenus)
)

// 获取全部页面
menuManageRouter.get(
  '/systemManage/getAllPages',
  ...useMenuManagePermission,
  errorControllerWrapper(MenuManageController.getAllPages)
)

// 获取菜单树
menuManageRouter.get(
  '/systemManage/getMenuTree',
  ...useMenuManagePermission,
  errorControllerWrapper(MenuManageController.getMenuTree)
)

// 新增菜单
menuManageRouter.post(
  '/systemManage/saveMenu',
  ...useMenuManagePermission,
  validateBody(MenuCreateBodySchema),
  errorControllerWrapper(MenuManageController.createMenu)
)

// 更新菜单
menuManageRouter.post(
  '/systemManage/updateMenu',
  ...useMenuManagePermission,
  validateBody(MenuUpdateBodySchema),
  errorControllerWrapper(MenuManageController.updateMenu)
)

// 删除菜单
menuManageRouter.post(
  '/systemManage/deleteMenu',
  ...useMenuManagePermission,
  validateBody(MenuDeleteBodySchema),
  errorControllerWrapper(MenuManageController.deleteMenu)
)

export default menuManageRouter
