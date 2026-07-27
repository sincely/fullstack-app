import adminPermissionDao from '../modules/permission/permissionDao.js'
import { businessCode } from '../config/businessCode.js'
import { setBody } from '../utils/response.js'
import { getPermCache, setPermCache } from '../utils/redisCache.js'

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
 * 获取角色的菜单路径列表（带 Redis 缓存）
 * 
 * 流程：Redis 缓存 → miss → 查 MySQL → 回填缓存（5 分钟 TTL）
 * 
 * @param {number|string|number[]} roleIds
 * @returns {Promise<string[]>} routePath 数组
 */
async function getMenuPathsByRoleId(roleIds) {
  // 1. 尝试 Redis 缓存
  const cached = await getPermCache(roleIds)
  if (cached) {
    return cached
  }

  // 2. 回退 MySQL
  const menus = await adminPermissionDao.findMenusByRoleId(roleIds)
  const routePaths = menus.map((menu) => menu.routePath)

  // 3. 回填缓存
  await setPermCache(roleIds, routePaths)

  return routePaths
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

    // 从缓存/数据库获取用户拥有的菜单路径
    const menuPaths = await getMenuPathsByRoleId(roleIds)
    const allowed = menuPaths.some((path) => allowedRoutePaths.includes(path))

    if (!allowed) {
      setBody(ctx, businessCode.permissionDenied, 403)
      return
    }

    await next()
  }
}

export default authorizeRoute
