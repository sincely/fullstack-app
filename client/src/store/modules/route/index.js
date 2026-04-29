import { useBoolean } from '@sa/hooks'
import { defineStore } from 'pinia'
import { computed, ref, shallowRef } from 'vue'

import { SetupStoreId } from '@/enum'
import { router } from '@/router'
import { getRouteName, getRoutePath } from '@/router/elegant/transform'
import { createStaticRoutes, getAuthVueRoutes } from '@/router/routes'
import { ROOT_ROUTE } from '@/router/routes/builtin'
import { fetchGetConstantRoutes, fetchGetUserRoutes, fetchIsRouteExist } from '@/service/api'

import { useAppStore } from '../app'
import { useAuthStore } from '../auth'
import { useTabStore } from '../tab'
import {
  filterAuthRoutesByRoles,
  getBreadcrumbsByRoute,
  getCacheRouteNames,
  getGlobalMenusByAuthRoutes,
  getSelectedMenuKeyPathByKey,
  isRouteExistByRouteName,
  sortRoutesByOrder,
  transformMenuToSearchMenus,
  updateLocaleOfGlobalMenus
} from './shared'

export const useRouteStore = defineStore(SetupStoreId.Route, () => {
  const appStore = useAppStore()
  const authStore = useAuthStore()
  const tabStore = useTabStore()
  const { bool: isInitConstantRoute, setBool: setIsInitConstantRoute } = useBoolean()
  const { bool: isInitAuthRoute, setBool: setIsInitAuthRoute } = useBoolean()

  /**
   * 权限路由模式
   *
   * 推荐在开发环境使用 static 模式，在生产环境使用 dynamic 模式。
   * 开发环境下使用 static 模式时，权限路由将由插件 "@elegant-router/vue" 自动生成。
   */
  const authRouteMode = ref(import.meta.env.VITE_AUTH_ROUTE_MODE)

  /** 首页路由键 */
  const routeHome = ref(import.meta.env.VITE_ROUTE_HOME)

  /**
   * 设置首页路由
   *
   * @param routeKey 路由键
   */
  function setRouteHome(routeKey) {
    routeHome.value = routeKey
  }

  /** 权限路由列表 */
  const authRoutes = shallowRef([])

  function addAuthRoutes(routes) {
    const authRoutesMap = new Map(authRoutes.value.map((route) => [route.name, route]))

    routes.forEach((route) => {
      authRoutesMap.set(route.name, route)
    })

    authRoutes.value = Array.from(authRoutesMap.values())
  }

  const removeRouteFns = []

  /** 全局菜单 */
  const menus = ref([])
  const searchMenus = computed(() => transformMenuToSearchMenus(menus.value))

  /** 生成全局菜单 */
  function getGlobalMenus(routes) {
    menus.value = getGlobalMenusByAuthRoutes(routes)
  }

  /** 根据语言环境更新全局菜单 */
  function updateGlobalMenusByLocale() {
    menus.value = updateLocaleOfGlobalMenus(menus.value)
  }

  /** 需要缓存的路由 */
  const cacheRoutes = ref([])

  /**
   * 计算缓存路由
   *
   * @param routes Vue 路由
   */
  function getCacheRoutes(routes) {
    cacheRoutes.value = getCacheRouteNames(routes)
  }

  /**
   * 添加缓存路由
   *
   * @param routeKey
   */
  function addCacheRoutes(routeKey) {
    if (cacheRoutes.value.includes(routeKey)) return

    cacheRoutes.value.push(routeKey)
  }

  /**
   * 移除缓存路由
   *
   * @param routeKey
   */
  function removeCacheRoutes(routeKey) {
    const index = cacheRoutes.value.findIndex((item) => item === routeKey)

    if (index === -1) return

    cacheRoutes.value.splice(index, 1)
  }

  /**
   * 按路由键重建缓存
   *
   * @param routeKey
   */
  async function reCacheRoutesByKey(routeKey) {
    removeCacheRoutes(routeKey)

    await appStore.reloadPage()

    addCacheRoutes(routeKey)
  }

  /**
   * 按多个路由键重建缓存
   *
   * @param routeKeys
   */
  async function reCacheRoutesByKeys(routeKeys) {
    for await (const key of routeKeys) {
      await reCacheRoutesByKey(key)
    }
  }

  /** 全局面包屑 */
  const breadcrumbs = computed(() => getBreadcrumbsByRoute(router.currentRoute.value, menus.value))

  /** 重置 store */
  async function resetStore() {
    const routeStore = useRouteStore()

    routeStore.$reset()

    resetVueRoutes()

    // 重置后需要重新初始化常量路由
    await initConstantRoute()
  }

  /** 重置 Vue 路由 */
  function resetVueRoutes() {
    removeRouteFns.forEach((fn) => fn())
    removeRouteFns.length = 0
  }

  /** 初始化常量路由 */
  async function initConstantRoute() {
    if (isInitConstantRoute.value) return

    if (authRouteMode.value === 'static') {
      const { constantRoutes } = createStaticRoutes()

      addAuthRoutes(constantRoutes)
    } else {
      const { data, error } = await fetchGetConstantRoutes()

      if (!error) {
        addAuthRoutes(data)
      }
    }

    handleAuthRoutes()

    setIsInitConstantRoute(true)
  }

  /** 初始化权限路由 */
  async function initAuthRoute() {
    if (authRouteMode.value === 'static') {
      await initStaticAuthRoute()
    } else {
      await initDynamicAuthRoute()
    }

    tabStore.initHomeTab()
  }

  /** 初始化静态权限路由 */
  async function initStaticAuthRoute() {
    const { authRoutes: staticAuthRoutes } = createStaticRoutes()

    if (authStore.isStaticSuper) {
      addAuthRoutes(staticAuthRoutes)
    } else {
      const filteredAuthRoutes = filterAuthRoutesByRoles(staticAuthRoutes, authStore.userInfo.roles)

      addAuthRoutes(filteredAuthRoutes)
    }

    handleAuthRoutes()

    setIsInitAuthRoute(true)
  }

  /** 初始化动态权限路由 */
  async function initDynamicAuthRoute() {
    const { data, error } = await fetchGetUserRoutes()

    if (!error) {
      const { routes, home } = data

      addAuthRoutes(routes)

      handleAuthRoutes()

      setRouteHome(home)

      handleUpdateRootRouteRedirect(home)

      setIsInitAuthRoute(true)
    }
  }

  /** 处理权限路由：排序、挂载、菜单与缓存 */
  function handleAuthRoutes() {
    const sortRoutes = sortRoutesByOrder(authRoutes.value)

    const vueRoutes = getAuthVueRoutes(sortRoutes)

    resetVueRoutes()

    addRoutesToVueRouter(vueRoutes)

    getGlobalMenus(sortRoutes)

    getCacheRoutes(vueRoutes)
  }

  /**
   * 将路由添加到 Vue Router
   *
   * @param routes Vue 路由
   */
  function addRoutesToVueRouter(routes) {
    routes.forEach((route) => {
      const removeFn = router.addRoute(route)
      addRemoveRouteFn(removeFn)
    })
  }

  /**
   * 保存路由移除函数
   *
   * @param fn
   */
  function addRemoveRouteFn(fn) {
    removeRouteFns.push(fn)
  }

  /**
   * 动态路由模式下更新根路由重定向
   *
   * @param redirectKey 重定向路由键
   */
  function handleUpdateRootRouteRedirect(redirectKey) {
    const redirect = getRoutePath(redirectKey)

    if (redirect) {
      const rootRoute = { ...ROOT_ROUTE, redirect }

      router.removeRoute(rootRoute.name)

      const [rootVueRoute] = getAuthVueRoutes([rootRoute])

      router.addRoute(rootVueRoute)
    }
  }

  /**
   * 判断权限路由是否存在
   *
   * @param routePath 路由路径
   */
  async function getIsAuthRouteExist(routePath) {
    const routeName = getRouteName(routePath)

    if (!routeName) {
      return false
    }

    if (authRouteMode.value === 'static') {
      const { authRoutes: staticAuthRoutes } = createStaticRoutes()
      return isRouteExistByRouteName(routeName, staticAuthRoutes)
    }

    const { data } = await fetchIsRouteExist(routeName)

    return data
  }

  /**
   * 获取选中菜单的 key 路径
   *
   * @param selectedKey 选中的菜单 key
   */
  function getSelectedMenuKeyPath(selectedKey) {
    return getSelectedMenuKeyPathByKey(selectedKey, menus.value)
  }

  /**
   * 根据 key 获取选中菜单的路由元信息
   *
   * @param selectedKey 选中的菜单 key
   */
  function getSelectedMenuMetaByKey(selectedKey) {
    // router.options.routes 仅包含静态路由，需要使用 router.getRoutes() 获取完整路由
    const allRoutes = router.getRoutes()

    return allRoutes.find((route) => route.name === selectedKey)?.meta || null
  }

  return {
    resetStore,
    routeHome,
    menus,
    searchMenus,
    updateGlobalMenusByLocale,
    cacheRoutes,
    reCacheRoutesByKey,
    reCacheRoutesByKeys,
    breadcrumbs,
    initConstantRoute,
    isInitConstantRoute,
    initAuthRoute,
    isInitAuthRoute,
    setIsInitAuthRoute,
    getIsAuthRouteExist,
    getSelectedMenuKeyPath,
    getSelectedMenuMetaByKey
  }
})
