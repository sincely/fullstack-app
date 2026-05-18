import Router from '@koa/router'
import authenticate from '../../middleware/authenticate.js'
import { errorControllerWrapper } from '../../utils/errorHandler.js'
import adminPermissionDao from '../../services/permissionDao.js'
import adminMenuDao from '../../services/menuDao.js'
import { buildMenuTree } from '../../utils/adminPermission.js'
import { businessCode } from '../../config/businessCode.js'

const routeRouter = new Router()

const parseRoleIds = (value, fallbackRoleId) => {
  if (typeof value === 'string' && value.trim()) {
    return value
      .split(',')
      .map((item) => Number(item))
      .filter(Boolean)
  }

  return fallbackRoleId ? [Number(fallbackRoleId)] : []
}

// 获取常量路由
routeRouter.get(
  '/route/getConstantRoutes',
  errorControllerWrapper((ctx) => {
    ctx.body = {
      code: 200,
      data: [
        {
          name: 'login',
          path: '/login',
          component: 'layout.blankLayout',
          meta: {
            title: 'login',
            constant: true
          }
        },
        {
          name: '403',
          path: '/403',
          component: 'layout.blankLayout',
          meta: {
            title: '403',
            constant: true
          }
        },
        {
          name: '404',
          path: '/404',
          component: 'layout.blankLayout',
          meta: {
            title: '404',
            constant: true
          }
        },
        {
          name: '500',
          path: '/500',
          component: 'layout.blankLayout',
          meta: {
            title: '500',
            constant: true
          }
        }
      ],
      msg: 'ok'
    }
  })
)

// 获取用户路由
routeRouter.get(
  '/route/getUserRoutes',
  authenticate,
  errorControllerWrapper(async (ctx) => {
    const roleIds = parseRoleIds(ctx.state.user?.roleIds, ctx.state.user?.roleId)
    let menus = []
    if (roleIds.length > 0) {
      menus = await adminPermissionDao.findMenusByRoleId(roleIds)
    }
    // 直接用新表结构的扁平列表构建树，buildMenuTree 内部已做字段映射
    const routeTree = buildMenuTree(menus)
    ctx.body = {
      code: businessCode.success,
      data: {
        routes: routeTree,
        home: 'home'
      },
      msg: 'ok'
    }
  })
)

// 判断路由是否存在
routeRouter.get(
  '/route/isRouteExist',
  authenticate,
  errorControllerWrapper(async (ctx) => {
    const { routeName } = ctx.query
    const menu = await adminMenuDao.findMenuByName(routeName)
    ctx.body = {
      code: businessCode.success,
      data: !!menu,
      msg: 'ok'
    }
  })
)

export default routeRouter
