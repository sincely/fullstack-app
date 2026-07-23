import adminPermissionDao from '../modules/permission/permissionDao.js'
import { businessCode } from '../config/businessCode.js'
import { setBody } from '../utils/response.js'

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
 * 获取角色菜单（直接从数据库获取，已禁用 Redis 缓存）
 * @param {number|string|number[]} roleId
 */
async function getMenusByRoleId(roleId) {
  return await adminPermissionDao.findMenusByRoleId(roleId)
}

export const authorizeRoute = (routePath) => {
  return async (ctx, next) => {
    const currentUser = ctx.state.user
    const allowedRoutePaths = Array.isArray(routePath) ? routePath : [routePath]

    const roleIds = parseRoleIds(currentUser?.roleIds, currentUser?.roleId)

    if (roleIds.length === 0) {
      setBody(ctx, businessCode.unAuthorized, 401)
      return
    }

    const menus = await getMenusByRoleId(roleIds)
    const allowed = menus.some((menu) => allowedRoutePaths.includes(menu.routePath))

    if (!allowed) {
      setBody(ctx, businessCode.permissionDenied, 403)
      return
    }

    await next()
  }
}

export default authorizeRoute
