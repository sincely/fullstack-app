import { useRouter } from 'vue-router'

import { router as globalRouter } from '@/router'

/**
 * Router push
 *
 * Jump to the specified route, it can replace function router.push
 *
 * @param inSetup Whether is in vue script setup
 */
export function useRouterPush(inSetup = true) {
  const router = inSetup ? useRouter() : globalRouter
  const route = globalRouter.currentRoute

  const routerPush = router.push

  const routerBack = router.back

  async function routerPushByKey(key, options) {
    const { query, params } = options || {}

    const routeLocation = {
      name: key
    }

    if (Object.keys(query || {}).length) {
      routeLocation.query = query
    }

    if (Object.keys(params || {}).length) {
      routeLocation.params = params
    }

    return routerPush(routeLocation)
  }

  /**
   * 跳转到指定路由，并携带该路由 meta 中配置的 query 参数
   *
   * @param key 路由键
   */
  async function routerPushByKeyWithMetaQuery(key) {
    const allRoutes = router.getRoutes()

    const meta = allRoutes.find((item) => item.name === key)?.meta || null

    const query = {}

    meta?.query?.forEach((item) => {
      query[item.key] = item.value
    })

    return routerPushByKey(key, { query })
  }

  async function toHome() {
    return routerPushByKey('root')
  }

  /**
   * Navigate to login page
   *
   * @param loginModule The login module
   * @param redirectUrl The redirect url, if not specified, it will be the current route fullPath
   */
  async function toLogin(loginModule, redirectUrl) {
    const module = loginModule || 'pwd-login'

    const options = {
      params: {
        module
      }
    }

    const redirect = redirectUrl || route.value.fullPath

    options.query = {
      redirect
    }

    return routerPushByKey('login', options)
  }

  /**
   * Toggle login module
   *
   * @param module
   */
  async function toggleLoginModule(module) {
    const { query } = route.value

    return routerPushByKey('login', { query, params: { module } })
  }

  /** Redirect from login */
  async function redirectFromLogin() {
    const redirect = route.value.query?.redirect

    if (redirect) {
      routerPush(redirect)
    } else {
      toHome()
    }
  }

  return {
    route,
    routerPush,
    routerBack,
    routerPushByKey,
    routerPushByKeyWithMetaQuery,
    toLogin,
    toggleLoginModule,
    redirectFromLogin
  }
}
