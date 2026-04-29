import { useAuthStore } from '@/store/modules/auth'
import { useRouteStore } from '@/store/modules/route'
import { localStg } from '@/utils/storage'

/**
 * 创建路由守卫
 *
 * @param router 路由实例
 */
export function createRouteGuard(router) {
  router.beforeEach(async (to, from, next) => {
    const location = await initRoute(to)

    if (location) {
      next(location)
      return
    }

    const authStore = useAuthStore()

    const rootRoute = 'root'
    const loginRoute = 'login'
    const noAuthorizationRoute = '403'

    const isLogin = Boolean(localStg.get('token'))
    const needLogin = !to.meta.constant
    const routeRoles = to.meta.roles || []

    const hasRole = authStore.userInfo.roles.some((role) => routeRoles.includes(role))

    const hasAuth = authStore.isStaticSuper || !routeRoles.length || hasRole

    const routeSwitches = [
      // 已登录且访问登录页时，跳转到首页
      {
        condition: isLogin && to.name === loginRoute,
        callback: () => {
          next({ name: rootRoute })
        }
      },
      // 常量路由可直接访问
      {
        condition: !needLogin,
        callback: () => {
          handleRouteSwitch(to, from, next)
        }
      },
      // 需要登录但未登录，跳转到登录页
      {
        condition: !isLogin && needLogin,
        callback: () => {
          next({ name: loginRoute, query: { redirect: to.fullPath } })
        }
      },
      // 已登录且有权限，允许访问
      {
        condition: isLogin && needLogin && hasAuth,
        callback: () => {
          handleRouteSwitch(to, from, next)
        }
      },
      // 已登录但无权限，跳转到 403 页面
      {
        condition: isLogin && needLogin && !hasAuth,
        callback: () => {
          next({ name: noAuthorizationRoute })
        }
      }
    ]

    routeSwitches.some(({ condition, callback }) => {
      if (condition) {
        callback()
      }

      return condition
    })
  })
}

/**
 * 初始化路由
 *
 * @param to 目标路由
 */
async function initRoute(to) {
  const routeStore = useRouteStore()

  const notFoundRoute = 'not-found'
  const isNotFoundRoute = to.name === notFoundRoute

  // 常量路由未初始化时，先初始化常量路由
  if (!routeStore.isInitConstantRoute) {
    await routeStore.initConstantRoute()

    // 由于常量路由未初始化，当前路由可能被 not-found 捕获
    // 初始化完成后，重定向回原始目标地址
    if (isNotFoundRoute) {
      const path = to.fullPath

      const location = {
        path,
        replace: true,
        query: to.query,
        hash: to.hash
      }

      return location
    }
  }

  // 常量路由且非 not-found 路由时，允许访问
  if (to.meta.constant && !isNotFoundRoute) {
    return null
  }

  // 权限路由已初始化且不是 not-found 路由，允许访问
  if (routeStore.isInitAuthRoute && !isNotFoundRoute) {
    return null
  }
  // 路由被 not-found 捕获后，检查目标路由是否存在
  if (routeStore.isInitAuthRoute && isNotFoundRoute) {
    const exist = await routeStore.getIsAuthRouteExist(to.path)
    const noPermissionRoute = '403'

    if (exist) {
      const location = {
        name: noPermissionRoute
      }

      return location
    }

    return null
  }

  // 若权限路由尚未初始化，先进行初始化
  const isLogin = Boolean(localStg.get('token'))
  // 初始化权限路由前必须先登录，否则跳转到登录页
  if (!isLogin) {
    const loginRoute = 'login'
    const redirect = to.fullPath

    const query = to.name !== loginRoute ? { redirect } : {}

    const location = {
      name: loginRoute,
      query
    }

    return location
  }

  // 初始化权限路由
  await routeStore.initAuthRoute()

  // 由于权限路由未初始化，当前路由可能被 not-found 捕获
  // 初始化完成后，重定向回原始目标地址
  if (isNotFoundRoute) {
    const rootRoute = 'root'
    const path = to.redirectedFrom?.name === rootRoute ? '/' : to.fullPath

    const location = {
      path,
      replace: true,
      query: to.query,
      hash: to.hash
    }

    return location
  }

  return null
}

function handleRouteSwitch(to, from, next) {
  // 外链路由
  if (to.meta.href) {
    window.open(to.meta.href, '_blank')

    next({
      path: from.fullPath,
      replace: true,
      query: from.query,
      hash: to.hash
    })

    return
  }

  next()
}
