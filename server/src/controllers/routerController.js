import adminPermissionDao from '../services/permissionDao.js'
import adminMenuDao from '../services/menuDao.js'
import { buildMenuTree } from '../utils/adminPermission.js'
import { businessCode } from '../config/businessCode.js'

const parseRoleIds = (value, fallbackRoleId) => {
  if (typeof value === 'string' && value.trim()) {
    return value
      .split(',')
      .map((item) => Number(item))
      .filter(Boolean)
  }

  return fallbackRoleId ? [Number(fallbackRoleId)] : []
}

/**
 * 获取常量路由
 * @param {object} ctx - Koa 上下文
 */
const getConstantRoutes = (ctx) => {
  ctx.body = {
    code: 200,
    data: [
      {
        name: 'login',
        path: '/login/:module(pwd-login|code-login|register|reset-pwd|bind-wechat)?',
        component: 'layout.blank$view.login',
        props: true,
        meta: {
          title: 'login',
          constant: true,
          hideInMenu: true
        }
      },
      {
        name: '403',
        path: '/403',
        component: 'layout.blank$view.403',
        meta: {
          title: '403',
          constant: true,
          hideInMenu: true
        }
      },
      {
        name: '404',
        path: '/404',
        component: 'layout.blank$view.404',
        meta: {
          title: '404',
          constant: true,
          hideInMenu: true
        }
      },
      {
        name: '500',
        path: '/500',
        component: 'layout.blank$view.500',
        meta: {
          title: '500',
          constant: true,
          hideInMenu: true
        }
      }
    ],
    msg: '请求成功'
  }
}

/**
 * 获取用户路由
 * @param {object} ctx - Koa 上下文
 */
const getUserRoutes = async (ctx) => {
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
    msg: '请求成功'
  }
}

/**
 * 判断路由是否存在
 * @param {object} ctx - Koa 上下文
 */
const isRouteExist = async (ctx) => {
  const { routeName } = ctx.query
  const menu = await adminMenuDao.findMenuByName(routeName)
  ctx.body = {
    code: businessCode.success,
    data: !!menu,
    msg: '请求成功'
  }
}

export default {
  getConstantRoutes,
  getUserRoutes,
  isRouteExist
}
