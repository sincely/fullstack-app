import adminPermissionDao from '../services/permissionDao.js'
import { businessCode, businessMsg } from '../config/businessCode.js'
import { createErrorResponse } from '../utils/createResponse.js'
import { httpCode } from '../config/httpError.js'

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
      ctx.status = httpCode.unauthorized
      ctx.body = createErrorResponse('未登录或登录已过期', ctx.status)
      return
    }

    const menus = await getMenusByRoleId(roleIds)
    const allowed = menus.some((menu) => allowedRoutePaths.includes(menu.routePath))

    if (!allowed) {
      ctx.status = httpCode.forbidden
      ctx.body = {
        code: businessCode.permissionDenied,
        msg: businessMsg[businessCode.permissionDenied]
      }
      return
    }

    await next()
  }
}

export default authorizeRoute
