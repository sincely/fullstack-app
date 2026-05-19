/**
 * 规范化数据库菜单结构，转换为前端路由树节点格式。
 * 新表结构已将 meta JSON 拆分为独立列，不再需要 parseMeta。
 * @param {object} menu - 数据库菜单行
 * @returns {object} 前端路由树节点
 */
const normalizeMenu = (menu) => {
  // 构建 meta 对象（前端路由仍需要 meta 格式）
  const meta = {
    title: menu.menuName,
    ...(menu.icon ? { icon: menu.icon } : {}),
    ...(menu.orderNum ? { order: menu.orderNum } : {}),
    ...(menu.hideInMenu ? { hideInMenu: Boolean(menu.hideInMenu) } : {}),
    ...(menu.activeMenu ? { activeMenu: menu.activeMenu } : {}),
    ...(menu.multiTab ? { multiTab: Boolean(menu.multiTab) } : {}),
    ...(menu.keepAlive ? { keepAlive: Boolean(menu.keepAlive) } : {})
  }

  return {
    id: menu.id,
    path: menu.routePath,
    name: menu.routeName,
    component: menu.component,
    redirect: menu.redirect,
    meta,
    children: []
  }
}

/**
 * 根据扁平菜单列表构建树形菜单。
 * @param {Array<object>} menuList
 * @returns {Array<object>}
 */
export const buildMenuTree = (menuList) => {
  const menuMap = new Map()
  const roots = []

  for (const menu of menuList) {
    menuMap.set(menu.id, normalizeMenu(menu))
  }

  for (const menu of menuMap.values()) {
    console.log(menu)

    if (menu.parentId && menuMap.has(menu.parentId)) {
      menuMap.get(menu.parentId).children.push(menu)
      continue
    }
    roots.push(menu)
  }

  return roots
}

/**
 * 提取权限编码集合：
 * - routePaths: 允许访问的路径
 * - routeNames: 允许访问的路由名称
 * - buttons: 允许使用的按钮权限编码
 * @param {Array<{routePath:string,routeName:string}>} menus
 * @param {Array<{buttonName?:string}>} buttons
 * @returns {{routePaths:string[], routeNames:string[], buttons:string[]}}
 */
export const extractPermissionCodes = (menus, buttons) => {
  return {
    routePaths: menus.map((menu) => menu.routePath),
    routeNames: menus.map((menu) => menu.routeName),
    buttons: buttons.map((button) => button.buttonName).filter(Boolean)
  }
}

/**
 * 解析菜单 meta 字段（保留兼容，不再需要 JSON.parse）。
 * @deprecated 新表结构已将 meta 拆分为独立列，此函数仅做兼容保留
 * @param {unknown} meta
 * @returns {Record<string, any>}
 */
export const parseMeta = (meta) => {
  if (!meta) {
    return {}
  }

  if (typeof meta === 'object') {
    return meta
  }

  try {
    return JSON.parse(meta)
  } catch {
    return {}
  }
}
