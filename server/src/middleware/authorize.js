import adminPermissionDao from '#src/dao/systemManage/roleManage/userPermissionDao.js'
import { businessCode, businessMsg } from '#config/businessCode.js'
import { createErrorResponse } from '#utils/createResponse.js'
import { httpCode } from '#config/httpError.js'
// import { getRedisClient } from '#utils/redis.js'

/**
 * 获取角色菜单
 * 角色权限变更时应主动调用 invalidateRolePermissionCache 清除缓存
 * @param {number|string} roleId
 */
async function getMenusByRoleId(roleId) {
  const menus = await adminPermissionDao.findMenusByRoleId(roleId)
  return menus
}

/**
 * 主动清除角色权限缓存（角色权限变更时调用）
 * @param {number|string} roleId
 */
export async function invalidateRolePermissionCache(roleId) {
  // Redis 缓存逻辑已临时关闭，此处保留空实现，避免调用方报错
  return roleId
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
