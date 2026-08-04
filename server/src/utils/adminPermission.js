/**
 * 规范化数据库菜单结构，转换为前端路由树节点格式。
 * 新表结构已将 meta JSON 拆分为独立列，不再需要 parseMeta。
 * @param {object} menu - 数据库菜单行
 * @returns {object} 前端路由树节点
 */
// 注意：此函数接收的是 DAO 查询出的数据库原始行（snake_case 字段）
const normalizeMenu = (menu) => {
  // button (menu_type=3) 节点
  if (Number(menu.menu_type) === 3) {
    // route_name 格式为 _btn_{parentId}_{code}，提取原始权限标识
    const parts = String(menu.route_name || '').split('_')
    const permissionCode = parts.length >= 4 ? parts.slice(3).join('_') : menu.route_name || ''

    return {
      id: menu.id,
      parentId: menu.parent_id ?? 0,
      name: permissionCode || menu.menu_name,
      meta: { title: menu.menu_name, isButton: true, permissionCode: permissionCode || '' }
    }
  }

  // 目录 / 菜单节点
  const meta = {
    title: menu.menu_name,
    ...(menu.icon ? { icon: menu.icon } : {}),
    ...(menu.order_num ? { order: menu.order_num } : {}),
    ...(menu.hide_in_menu ? { hideInMenu: Boolean(menu.hide_in_menu) } : {}),
    ...(menu.active_menu ? { activeMenu: menu.active_menu } : {}),
    ...(menu.multi_tab ? { multiTab: Boolean(menu.multi_tab) } : {}),
    ...(menu.keep_alive ? { keepAlive: Boolean(menu.keep_alive) } : {})
  }

  return {
    id: menu.id,
    parentId: menu.parent_id ?? 0,
    path: menu.route_path,
    name: menu.route_name,
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
    if (menu.parentId && menuMap.has(menu.parentId)) {
      const parent = menuMap.get(menu.parentId)
      // 目录可包含目录/菜单/按钮，菜单可包含按钮
      if (Array.isArray(parent.children)) {
        parent.children.push(menu)
        continue
      }
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
    routePaths: menus.map((menu) => menu.route_path).filter(Boolean),
    routeNames: menus.map((menu) => menu.route_name).filter(Boolean),
    buttons: buttons.map((button) => button.button_name).filter(Boolean)
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
