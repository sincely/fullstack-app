import { getRoutePath } from '@/router/elegant/transform'

/**
 * 获取全部标签页
 * @param tabs 标签页列表
 * @param homeTab 首页标签页
 */
export function getAllTabs(tabs, homeTab) {
  if (!homeTab) {
    return []
  }

  const filterHomeTabs = tabs.filter((tab) => tab.id !== homeTab.id)

  const fixedTabs = filterHomeTabs
    .filter((tab) => tab.fixedIndex !== undefined)
    .sort((a, b) => a.fixedIndex - b.fixedIndex)

  const remainTabs = filterHomeTabs.filter((tab) => tab.fixedIndex === undefined)

  const allTabs = [homeTab, ...fixedTabs, ...remainTabs]

  return updateTabsLabel(allTabs)
}

/**
 * 根据路由生成标签页 id
 * @param route 路由对象
 */
export function getTabIdByRoute(route) {
  const { path, query = {}, meta } = route

  let id = path

  if (meta.multiTab) {
    const queryKeys = Object.keys(query).sort()
    const qs = queryKeys.map((key) => `${key}=${query[key]}`).join('&')

    id = `${path}?${qs}`
  }

  return id
}

/**
 * 根据路由生成标签页对象
 * @param route 路由对象
 */
export function getTabByRoute(route) {
  const { name, path, fullPath = path, meta } = route
  const { title, fixedIndexInTab } = meta

  // 从 getRouteIcons 中获取 icon 与 localIcon
  const { icon, localIcon } = getRouteIcons(route)

  const label = title

  const tab = {
    id: getTabIdByRoute(route),
    label,
    routeKey: name,
    routePath: path,
    fullPath,
    fixedIndex: fixedIndexInTab,
    icon,
    localIcon
  }

  return tab
}

/**
 * 获取路由的图标与本地图标
 * Vue Router 会自动合并所有匹配项的 meta，图标可能受其他匹配项影响，因此需单独处理
 * @param route 路由对象
 */
export function getRouteIcons(route) {
  // 先设置默认图标值
  let icon = route?.meta?.icon || import.meta.env.VITE_MENU_ICON
  let localIcon = route?.meta?.localIcon

  // route.matched 在多级匹配时存在，因此先判断其可用性
  if (route.matched) {
    // 从 matched 中定位当前路由的 meta
    const currentRoute = route.matched.find((r) => r.name === route.name)
    // 若 currentRoute.meta 中存在图标，则覆盖默认值
    icon = currentRoute?.meta?.icon || icon
    localIcon = currentRoute?.meta?.localIcon
  }

  return { icon, localIcon }
}

/**
 * 获取默认首页标签页
 * @param router 路由实例
 * @param homeRouteName useRouteStore 中的 routeHome
 */
export function getDefaultHomeTab(router, homeRouteName) {
  const homeRoutePath = getRoutePath(homeRouteName)

  let homeTab = {
    id: getRoutePath(homeRouteName),
    label: homeRouteName,
    routeKey: homeRouteName,
    routePath: homeRoutePath,
    fullPath: homeRoutePath
  }

  const routes = router.getRoutes()
  const homeRoute = routes.find((route) => route.name === homeRouteName)
  if (homeRoute) {
    homeTab = getTabByRoute(homeRoute)
  }

  return homeTab
}

/**
 * 判断标签页是否存在于列表中
 * @param tabId 标签页 id
 * @param tabs 标签页列表
 */
export function isTabInTabs(tabId, tabs) {
  return tabs.some((tab) => tab.id === tabId)
}

/**
 * 按 id 过滤标签页
 * @param tabId 标签页 id
 * @param tabs 标签页列表
 */
export function filterTabsById(tabId, tabs) {
  return tabs.filter((tab) => tab.id !== tabId)
}

/**
 * 按 id 列表过滤标签页
 * @param tabIds 标签页 id 列表
 * @param tabs 标签页列表
 */
export function filterTabsByIds(tabIds, tabs) {
  return tabs.filter((tab) => !tabIds.includes(tab.id))
}

/**
 * 基于当前全部路由提取有效标签页
 * @param router 路由实例
 * @param tabs 标签页列表
 */
export function extractTabsByAllRoutes(router, tabs) {
  const routes = router.getRoutes()

  const routeNames = routes.map((route) => route.name)

  return tabs.filter((tab) => routeNames.includes(tab.routeKey))
}

/**
 * 获取固定标签页
 * @param tabs 标签页列表
 */
export function getFixedTabs(tabs) {
  return tabs.filter((tab) => tab.fixedIndex !== undefined)
}

/**
 * 获取固定标签页 id 列表
 * @param tabs 标签页列表
 */
export function getFixedTabIds(tabs) {
  const fixedTabs = getFixedTabs(tabs)

  return fixedTabs.map((tab) => tab.id)
}

/**
 * 更新标签页标题
 * @param tabs 标签页列表
 */
function updateTabsLabel(tabs) {
  const updated = tabs.map((tab) => ({
    ...tab,
    label: tab.newLabel || tab.oldLabel || tab.label
  }))

  return updated
}

/**
 * 规范化单个标签页标题
 * @param tab 标签页对象
 */
export function normalizeTabLabel(tab) {
  return tab
}

/**
 * 规范化标签页标题列表
 * @param tabs 标签页列表
 */
export function normalizeTabsLabel(tabs) {
  return tabs.map((tab) => normalizeTabLabel(tab))
}

/**
 * 根据路由名称查找标签页
 * @param name 路由名称
 * @param tabs 标签页列表
 */
export function findTabByRouteName(name, tabs) {
  const routePath = getRoutePath(name)

  const tabId = routePath
  const multiTabId = `${routePath}?`

  return tabs.find((tab) => tab.id === tabId || tab.id.startsWith(multiTabId))
}
