import { useSvgIcon } from '@/hooks/common/icon'

/**
 * 根据角色过滤权限路由
 *
 * @param routes 权限路由列表
 * @param roles 角色列表
 */
export function filterAuthRoutesByRoles(routes, roles) {
  return routes.flatMap((route) => filterAuthRouteByRoles(route, roles))
}

/**
 * 根据角色过滤单个权限路由
 *
 * @param route 权限路由项
 * @param roles 角色列表
 */
function filterAuthRouteByRoles(route, roles) {
  const routeRoles = (route.meta && route.meta.roles) || []

  // 路由未配置角色限制时，默认允许访问
  const isEmptyRoles = !routeRoles.length

  // 当前用户角色命中路由角色限制时，允许访问
  const hasPermission = routeRoles.some((role) => roles.includes(role))

  const filterRoute = { ...route }

  if (filterRoute.children?.length) {
    filterRoute.children = filterRoute.children.flatMap((item) => filterAuthRouteByRoles(item, roles))
  }

  return hasPermission || isEmptyRoles ? [filterRoute] : []
}

/**
 * 按 order 对单个路由及其子路由排序
 *
 * @param route 路由项
 */
function sortRouteByOrder(route) {
  if (route.children?.length) {
    route.children.sort((next, prev) => (Number(next.meta?.order) || 0) - (Number(prev.meta?.order) || 0))
    route.children.forEach(sortRouteByOrder)
  }

  return route
}

/**
 * 按 order 对路由列表排序
 *
 * @param routes 路由列表
 */
export function sortRoutesByOrder(routes) {
  routes.sort((next, prev) => (Number(next.meta?.order) || 0) - (Number(prev.meta?.order) || 0))
  routes.forEach(sortRouteByOrder)

  return routes
}

/**
 * 根据权限路由生成全局菜单
 *
 * @param routes 权限路由列表
 */
export function getGlobalMenusByAuthRoutes(routes) {
  const menus = []

  routes.forEach((route) => {
    if (!route.meta?.hideInMenu) {
      const menu = getGlobalMenuByBaseRoute(route)

      if (route.children?.some((child) => !child.meta?.hideInMenu)) {
        menu.children = getGlobalMenusByAuthRoutes(route.children)
      }

      menus.push(menu)
    }
  })

  return menus
}

/**
 * 更新全局菜单的多语言文本
 *
 * @param menus 菜单列表
 */
export function updateLocaleOfGlobalMenus(menus) {
  const result = []

  menus.forEach((menu) => {
    const { label, children } = menu

    const newMenu = {
      ...menu,
      label,
      title: label
    }

    if (children?.length) {
      newMenu.children = updateLocaleOfGlobalMenus(children)
    }

    result.push(newMenu)
  })

  return result
}

/**
 * 根据路由生成单个全局菜单项
 *
 * @param route 路由项
 */
function getGlobalMenuByBaseRoute(route) {
  const { SvgIconVNode } = useSvgIcon()

  const { name, path } = route
  const { title, icon = import.meta.env.VITE_MENU_ICON, localIcon } = route.meta ?? {}

  const label = title

  const menu = {
    key: name,
    label,
    routeKey: name,
    routePath: path,
    icon: SvgIconVNode({ icon, localIcon, fontSize: 20 }),
    title: label
  }

  return menu
}

/**
 * 获取需要缓存的路由名称列表
 *
 * @param routes Vue 路由（两级结构）
 */
export function getCacheRouteNames(routes) {
  const cacheNames = []

  routes.forEach((route) => {
    // 仅收集末级且存在组件的二级路由
    route.children?.forEach((child) => {
      if (child.component && child.meta?.keepAlive) {
        cacheNames.push(child.name)
      }
    })
  })

  return cacheNames
}

/**
 * 根据路由名称判断路由是否存在
 *
 * @param routeName 路由名称
 * @param routes 路由列表
 */
export function isRouteExistByRouteName(routeName, routes) {
  return routes.some((route) => recursiveGetIsRouteExistByRouteName(route, routeName))
}

/**
 * 递归判断路由名称是否存在
 *
 * @param route 路由项
 * @param routeName 路由名称
 */
function recursiveGetIsRouteExistByRouteName(route, routeName) {
  let isExist = route.name === routeName

  if (isExist) {
    return true
  }

  if (route.children && route.children.length) {
    isExist = route.children.some((item) => recursiveGetIsRouteExistByRouteName(item, routeName))
  }

  return isExist
}

/**
 * 根据选中 key 获取菜单 key 路径
 *
 * @param selectedKey 选中菜单 key
 * @param menus 菜单列表
 */
export function getSelectedMenuKeyPathByKey(selectedKey, menus) {
  const keyPath = []

  menus.some((menu) => {
    const path = findMenuPath(selectedKey, menu)

    const find = Boolean(path?.length)

    if (find) {
      keyPath.push(...path)
    }

    return find
  })

  return keyPath
}

/**
 * 查找目标菜单在树中的路径
 *
 * @param targetKey 目标菜单 key
 * @param menu 菜单节点
 */
function findMenuPath(targetKey, menu) {
  const path = []

  function dfs(item) {
    path.push(item.key)

    if (item.key === targetKey) {
      return true
    }

    if (item.children) {
      for (const child of item.children) {
        if (dfs(child)) {
          return true
        }
      }
    }

    path.pop()

    return false
  }

  if (dfs(menu)) {
    return path
  }

  return null
}

/**
 * 根据当前路由生成面包屑
 *
 * @param route 当前路由
 * @param menus 菜单列表
 */
export function getBreadcrumbsByRoute(route, menus) {
  const key = route.name
  const activeKey = route.meta?.activeMenu

  const menuKey = activeKey || key

  for (const menu of menus) {
    if (menu.key === menuKey) {
      const breadcrumb = menuKey !== activeKey ? menu : getGlobalMenuByBaseRoute(route)

      return [breadcrumb]
    }

    if (menu.children?.length) {
      const result = getBreadcrumbsByRoute(route, menu.children)
      if (result.length > 0) {
        return [menu, ...result]
      }
    }
  }

  return []
}

/**
 * 将菜单树转换为搜索菜单列表
 *
 * @param menus 菜单列表
 * @param treeMap 扁平化结果容器
 */
export function transformMenuToSearchMenus(menus, treeMap = []) {
  if (menus && menus.length === 0) return []
  return menus.reduce((acc, cur) => {
    if (!cur.children) {
      acc.push(cur)
    }
    if (cur.children && cur.children.length > 0) {
      transformMenuToSearchMenus(cur.children, treeMap)
    }
    return acc
  }, treeMap)
}
