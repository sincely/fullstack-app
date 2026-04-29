import { request } from '../request'

/** 获取常量路由 */
export function fetchGetConstantRoutes() {
  return request({ url: '/route/getConstantRoutes' })
}

/** 获取用户路由 */
export function fetchGetUserRoutes() {
  return request({ url: '/route/getUserRoutes' })
}

/**
 * 判断路由是否存在
 *
 * @param routeName 路由名称
 */
export function fetchIsRouteExist(routeName) {
  return request({ url: '/route/isRouteExist', params: { routeName } })
}
