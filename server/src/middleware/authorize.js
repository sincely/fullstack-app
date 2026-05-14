import adminPermissionDao from '../services/adminPermissionDao.js'
import { businessCode, businessMsg } from '../config/businessCode.js'
import { createErrorResponse } from '../utils/createResponse.js'
import { httpCode } from '../config/httpError.js'

/**
 * 获取角色菜单（直接从数据库获取，已禁用 Redis 缓存）
 * @param {number|string} roleId
 */
async function getMenusByRoleId(roleId) {
  return await adminPermissionDao.findMenusByRoleId(roleId)
}

export const authorizeRoute = (routePath) => {
  return async (ctx, next) => {
    const currentUser = ctx.state.user

    if (!currentUser?.roleId) {
      ctx.status = httpCode.unauthorized
      ctx.body = createErrorResponse('未登录或登录已过期', ctx.status)
      return
    }

    if (currentUser.roleName === 'admin') {
      await next()
      return
    }

    const menus = await getMenusByRoleId(currentUser.roleId)
    const allowed = menus.some((menu) => menu.path === routePath)

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
