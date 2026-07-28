import adminPermissionDao from '../modules/permission/permissionDao.js'
import { businessCode, businessMsg } from '../config/businessCode.js'
import { createFailResponse } from '../utils/createResponse.js'

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
 * 获取角色的菜单路径列表（直接查询 MySQL）
 *
 * @param {number|string|number[]} roleIds
 * @returns {Promise<string[]>} routePath 数组
 */
async function getMenuPathsByRoleId(roleIds) {
  const menus = await adminPermissionDao.findMenusByRoleId(roleIds)
  return menus.map((menu) => menu.routePath)
}

export const authorizeRoute = (routePath) => {
  return async (ctx, next) => {
    const currentUser = ctx.state.user
    const allowedRoutePaths = Array.isArray(routePath) ? routePath : [routePath]

    const roleIds = parseRoleIds(currentUser?.roleIds, currentUser?.roleId)

    if (roleIds.length === 0) {
      ctx.status = 401
      ctx.body = createFailResponse(businessCode.unAuthorized, businessMsg[businessCode.unAuthorized])
      return
    }

    // 从数据库获取用户拥有的菜单路径
    const menuPaths = await getMenuPathsByRoleId(roleIds)
    const allowed = menuPaths.some((path) => allowedRoutePaths.includes(path))

    if (!allowed) {
      ctx.status = 403
      ctx.body = createFailResponse(businessCode.permissionDenied, businessMsg[businessCode.permissionDenied])
      return
    }

    await next()
  }
}

export default authorizeRoute
