/**
 * 将 elegant 常量路由转换为 Vue 路由
 * @param routes elegant 常量路由
 * @param layouts 布局组件映射
 * @param views 页面组件映射
 */
export function transformElegantRoutesToVueRoutes(routes, layouts, views) {
  return routes.flatMap((route) => transformElegantRouteToVueRoute(route, layouts, views))
}

/**
 * 将单个 elegant 路由转换为 Vue 路由
 * @param route elegant 常量路由项
 * @param layouts 布局组件映射
 * @param views 页面组件映射
 */
function transformElegantRouteToVueRoute(route, layouts, views) {
  const LAYOUT_PREFIX = 'layout.'
  const VIEW_PREFIX = 'view.'
  const ROUTE_DEGREE_SPLITTER = '_'
  const FIRST_LEVEL_ROUTE_COMPONENT_SPLIT = '$'

  function isLayout(component) {
    return component.startsWith(LAYOUT_PREFIX)
  }

  function getLayoutName(component) {
    return component.replace(LAYOUT_PREFIX, '')
  }

  function isView(component) {
    return component.startsWith(VIEW_PREFIX)
  }

  function getViewName(component) {
    return component.replace(VIEW_PREFIX, '')
  }

  function isFirstLevelRoute(item) {
    return !item.name.includes(ROUTE_DEGREE_SPLITTER)
  }

  function isSingleLevelRoute(item) {
    return isFirstLevelRoute(item) && !item.children?.length
  }

  function getSingleLevelRouteComponent(component) {
    const [layout, view] = component.split(FIRST_LEVEL_ROUTE_COMPONENT_SPLIT)

    return {
      layout: getLayoutName(layout),
      view: getViewName(view)
    }
  }

  const vueRoutes = []

  // 动态路由参数场景下，默认启用 props 透传
  if (route.path.includes(':') && !route.props) {
    route.props = true
  }

  const { name, path, component, children, ...rest } = route

  const vueRoute = {
    name,
    path,
    ...rest
  }

  if (component) {
    if (isSingleLevelRoute(route)) {
      const { layout, view } = getSingleLevelRouteComponent(component)

      const singleLevelRoute = {
        path,
        component: layouts[layout],
        children: [
          {
            name,
            path: '',
            component: views[view],
            ...rest
          }
        ]
      }

      return [singleLevelRoute]
    }

    if (isLayout(component)) {
      const layoutName = getLayoutName(component)

      vueRoute.component = layouts[layoutName]
    }

    if (isView(component)) {
      const viewName = getViewName(component)

      vueRoute.component = views[viewName]
    }
  }

  // 有子路由且未配置重定向时，默认重定向到第一个子路由
  if (children?.length && !vueRoute.redirect) {
    vueRoute.redirect = {
      name: children[0].name
    }
  }

  if (children?.length) {
    const childRoutes = children.flatMap((child) => transformElegantRouteToVueRoute(child, layouts, views))

    if (isFirstLevelRoute(route)) {
      vueRoute.children = childRoutes
    } else {
      vueRoutes.push(...childRoutes)
    }
  }

  vueRoutes.unshift(vueRoute)

  return vueRoutes
}

/**
 * 路由名称与路径映射表
 */
const routeMap = {
  root: '/',
  'not-found': '/:pathMatch(.*)*',
  exception: '/exception',
  exception_403: '/exception/403',
  exception_404: '/exception/404',
  exception_500: '/exception/500',
  403: '/403',
  404: '/404',
  500: '/500',
  about: '/about',
  function: '/function',
  'function_hide-child': '/function/hide-child',
  'function_hide-child_one': '/function/hide-child/one',
  'function_hide-child_three': '/function/hide-child/three',
  'function_hide-child_two': '/function/hide-child/two',
  'function_multi-tab': '/function/multi-tab',
  function_request: '/function/request',
  'function_super-page': '/function/super-page',
  function_tab: '/function/tab',
  'function_toggle-auth': '/function/toggle-auth',
  home: '/home',
  login: '/login/:module(pwd-login|code-login|register|reset-pwd|bind-wechat)?',
  manage: '/manage',
  manage_menu: '/manage/menu',
  manage_role: '/manage/role',
  manage_user: '/manage/user',
  'manage_user-detail': '/manage/user-detail/:id',
  'multi-menu': '/multi-menu',
  'multi-menu_first': '/multi-menu/first',
  'multi-menu_first_child': '/multi-menu/first/child',
  'multi-menu_second': '/multi-menu/second',
  'multi-menu_second_child': '/multi-menu/second/child',
  'multi-menu_second_child_home': '/multi-menu/second/child/home',
  'user-center': '/user-center'
}

/**
 * 根据路由名称获取路由路径
 * @param name 路由名称
 */
export function getRoutePath(name) {
  return routeMap[name]
}

/**
 * 根据路由路径获取路由名称
 * @param path 路由路径
 */
export function getRouteName(path) {
  const routeEntries = Object.entries(routeMap)

  const routeName = routeEntries.find(([, routePath]) => routePath === path)?.[0] || null

  return routeName
}
