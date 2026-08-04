/**
 * @module 菜单管理 Service
 * @description 封装菜单 CRUD、树结构构建、按钮管理等业务逻辑
 */

import adminMenuDao from './menuDao.js'
import { buildMenuTree } from '../../utils/adminPermission.js'
import { businessCode } from '../../config/businessCode.js'
import { normalizePagination } from '../../schemas/common/paginationSchema.js'

const toDbStatus = (status) => {
  if (status === '2' || Number(status) === 0) {
    return 0
  }
  return 1
}

const toFrontendStatus = (status) => {
  return Number(status) === 1 ? '1' : '2'
}

// 前端 camelCase → DB snake_case 字段映射
const toMenuPayload = (body) => {
  const isButton = Number(body.menuType) === 3
  if (isButton) {
    // 按钮：route_name + route_path 需全局唯一，用 parent+code+毫秒时间戳
    const parentId = body.parentId ?? 0
    const ts = Date.now()
    return {
      parent_id: body.parentId ?? null,
      menu_type: 3,
      menu_name: body.menuName,
      route_name: `_btn_${parentId}_${body.routeName || body.menuName}_${ts}`,
      route_path: `_btn_${parentId}_${ts}`,
      component: null,
      redirect: null,
      order_num: body.orderNum ?? 0,
      icon: null,
      icon_type: 1,
      hide_in_menu: 0,
      active_menu: null,
      multi_tab: 0,
      keep_alive: 0,
      status: toDbStatus(body.status)
    }
  }

  return {
    parent_id: body.parentId ?? null,
    menu_type: body.menuType ?? 2,
    menu_name: body.menuName,
    route_name: body.routeName ?? '',
    route_path: body.routePath ?? '',
    component: body.component ?? null,
    redirect: body.redirect ?? null,
    order_num: body.orderNum ?? 0,
    icon: body.icon ?? null,
    icon_type: body.iconType ?? 1,
    hide_in_menu: body.hideInMenu ? 1 : 0,
    active_menu: body.activeMenu ?? null,
    multi_tab: body.multiTab ? 1 : 0,
    keep_alive: body.keepAlive ? 1 : 0,
    status: toDbStatus(body.status)
  }
}

// DB snake_case → 前端 camelCase 字段映射
const formatMenuRow = (row) => {
  const isButton = Number(row.menu_type) === 3

  // 按钮类型：route_name 是内部合成键 _btn_{parentId}_{code}_{ts}，提取真实权限标识
  let displayRouteName = row.route_name || ''
  let displayRoutePath = row.route_path || ''
  if (isButton && displayRouteName.startsWith('_btn_')) {
    const parts = displayRouteName.split('_')
    // _btn_{parentId}_{code}_{ts} → 去掉前3段和后1段，取中间
    if (parts.length >= 5) {
      displayRouteName = parts.slice(3, -1).join('_')
    } else if (parts.length >= 4) {
      displayRouteName = parts[3]
    }
    displayRoutePath = ''
  }

  return {
    id: row.id,
    createBy: row.create_by || '',
    createTime: row.create_time || '',
    updateBy: row.update_by || '',
    updateTime: row.update_time || '',
    status: toFrontendStatus(row.status),
    parentId: row.parent_id ?? 0,
    menuType: String(row.menu_type),
    menuName: row.menu_name,
    routeName: displayRouteName,
    routePath: displayRoutePath,
    component: row.component || '',
    redirect: row.redirect || '',
    order: row.order_num ?? 0,
    icon: row.icon || '',
    iconType: String(row.icon_type ?? '1'),
    ...(row.hide_in_menu ? { hideInMenu: Boolean(row.hide_in_menu) } : {}),
    ...(row.active_menu ? { activeMenu: row.active_menu } : {}),
    ...(row.multi_tab ? { multiTab: Boolean(row.multi_tab) } : {}),
    ...(row.keep_alive ? { keepAlive: Boolean(row.keep_alive) } : {})
  }
}

// 前端表格树构建：
// - 目录（type=1）可包含：菜单（type=2）、目录（type=1）
// - 菜单（type=2）可包含：按钮（type=3）
// - 按钮（type=3）不包含子节点
const buildMenuRecordTree = (rows) => {
  const nodeMap = new Map(
    rows.map((row) => {
      const canHaveChildren = row.menuType === '1' || row.menuType === '2'
      return [row.id, canHaveChildren ? { ...row, children: [] } : { ...row }]
    })
  )
  const roots = []

  for (const row of rows) {
    const currentNode = nodeMap.get(row.id)
    const parentId = Number(row.parentId) || 0

    if (parentId !== 0 && nodeMap.has(parentId)) {
      const parentNode = nodeMap.get(parentId)
      if (parentNode.menuType === '1' || (parentNode.menuType === '2' && row.menuType === '3')) {
        if (Array.isArray(parentNode.children)) {
          parentNode.children.push(currentNode)
          continue
        }
      }
    }

    roots.push(currentNode)
  }

  // 清理空的 children 数组
  for (const node of nodeMap.values()) {
    if (Array.isArray(node.children) && node.children.length === 0) {
      delete node.children
    }
  }

  return roots
}

/**
 * 获取菜单列表
 */
export const listMenus = async (query, isV2 = false) => {
  const { current, size, page, pageSize, keyword } = query
  const { actualPage, actualPageSize } = normalizePagination({ current, size, page, pageSize })

  if (isV2) {
    const menus = await adminMenuDao.listMenus()
    const filteredMenus = keyword
      ? menus.filter((item) => {
          const matchedKeyword = String(keyword).toLowerCase()
          return [item.menu_name, item.route_path, item.route_name].some((field) =>
            String(field || '')
              .toLowerCase()
              .includes(matchedKeyword)
          )
        })
      : menus

    const formattedRows = filteredMenus.map((item) => formatMenuRow(item))
    const tree = buildMenuRecordTree(formattedRows)

    // 对根节点分页：保持子树完整，仅切片顶层节点
    const start = (actualPage - 1) * actualPageSize
    const pagedTree = tree.slice(start, start + actualPageSize)

    return {
      records: pagedTree,
      current: actualPage,
      size: actualPageSize,
      total: tree.length
    }
  }

  const [list, total] = await Promise.all([
    adminMenuDao.listMenusPaginated({ page: actualPage, pageSize: actualPageSize, keyword }),
    adminMenuDao.countMenus({ keyword })
  ])

  return {
    records: list.map((item) => formatMenuRow(item)),
    current: actualPage,
    size: actualPageSize,
    total: Number(total)
  }
}

/**
 * 获取菜单树
 */
export const getMenuTree = async () => {
  const menus = await adminMenuDao.listMenus()
  // 构建包含目录→菜单→按钮 三级层级结构的树
  return { success: true, data: buildMenuTree(menus) }
}

/**
 * 创建菜单
 */
export const createMenu = async (body) => {
  const { routePath, routeName, parentId, menuType } = body
  const isButton = Number(menuType) === 3

  // 按钮类型不需要路由字段校验
  if (!isButton) {
    if (routePath) {
      const existedPath = await adminMenuDao.findMenuByPath(routePath)
      if (existedPath) {
        return { success: false, code: businessCode.menuPathExist }
      }
    }
    if (routeName) {
      const existedName = await adminMenuDao.findMenuByName(routeName)
      if (existedName) {
        return { success: false, code: businessCode.menuNameExist }
      }
    }
  }

  if (parentId) {
    const parentMenu = await adminMenuDao.findMenuById(parentId)
    if (!parentMenu) {
      return { success: false, code: businessCode.paramError, msg: '父级菜单不存在' }
    }
    // 按钮类型只能挂在菜单（type=2）下
    if (isButton && Number(parentMenu.menu_type) !== 2) {
      return { success: false, code: businessCode.paramError, msg: '按钮只能挂在菜单下' }
    }
  }

  const result = await adminMenuDao.createMenu(toMenuPayload(body))

  return { success: true, data: { id: result.insertId } }
}

/**
 * 更新菜单
 */
export const updateMenu = async (body) => {
  const { id, routePath, routeName, parentId, menuType } = body
  const currentMenu = await adminMenuDao.findMenuById(id)

  if (!currentMenu) {
    return { success: false, code: businessCode.error, msg: '菜单不存在' }
  }

  const isButton = Number(menuType) === 3 || Number(currentMenu.menu_type) === 3

  if (!isButton && routePath) {
    const existedPath = await adminMenuDao.findMenuByPath(routePath)
    if (existedPath && existedPath.id !== id) {
      return { success: false, code: businessCode.menuPathExist }
    }
  }

  if (!isButton && routeName) {
    const existedName = await adminMenuDao.findMenuByName(routeName)
    if (existedName && existedName.id !== id) {
      return { success: false, code: businessCode.menuNameExist }
    }
  }

  if (parentId !== undefined) {
    if (parentId === id) {
      return { success: false, code: businessCode.paramError, msg: '父级菜单不能选择自己' }
    }

    if (parentId !== null) {
      const parentMenu = await adminMenuDao.findMenuById(parentId)
      if (!parentMenu) {
        return { success: false, code: businessCode.paramError, msg: '父级菜单不存在' }
      }
    }
  }

  // 构建动态更新 payload（前端 camelCase → DB snake_case）
  const payload = {}
  const fieldMap = {
    menuName: 'menu_name',
    routeName: 'route_name',
    routePath: 'route_path',
    menuType: 'menu_type',
    component: 'component',
    redirect: 'redirect',
    orderNum: 'order_num',
    icon: 'icon',
    iconType: 'icon_type',
    activeMenu: 'active_menu',
    status: 'status',
    parentId: 'parent_id'
  }

  // 按钮类型的 route_name/route_path 是内部合成键（_btn_*），不允许前端覆盖
  const skipKeys = isButton ? new Set(['routeName', 'routePath']) : new Set()

  for (const [bodyKey, colKey] of Object.entries(fieldMap)) {
    if (skipKeys.has(bodyKey)) continue
    if (body[bodyKey] !== undefined) {
      payload[colKey] = bodyKey === 'status' ? toDbStatus(body[bodyKey]) : (body[bodyKey] ?? null)
    }
  }

  // 布尔字段单独处理（前端传 true/false，数据库存 1/0）
  if (body.hideInMenu !== undefined) {
    payload.hide_in_menu = body.hideInMenu ? 1 : 0
  }
  if (body.multiTab !== undefined) {
    payload.multi_tab = body.multiTab ? 1 : 0
  }
  if (body.keepAlive !== undefined) {
    payload.keep_alive = body.keepAlive ? 1 : 0
  }

  await adminMenuDao.updateMenu(id, payload)

  return { success: true }
}

/**
 * 删除菜单
 */
export const deleteMenu = async (body) => {
  const ids = body.id ? [body.id] : body.ids || []

  for (const rawId of ids) {
    const id = Number(rawId)
    const currentMenu = await adminMenuDao.findMenuById(id)

    if (!currentMenu) {
      return { success: false, code: businessCode.error, msg: '菜单不存在' }
    }

    const childrenCount = await adminMenuDao.countChildren(id)
    if (childrenCount > 0) {
      return { success: false, code: businessCode.menuHasChildren }
    }
  }

  if (ids.length > 1) {
    await adminMenuDao.deleteMenus(ids)
  } else {
    await adminMenuDao.deleteMenu(Number(ids[0]))
  }

  return { success: true }
}

/**
 * 获取全部页面（含 component 的菜单）
 */
export const getAllPages = async () => {
  const menus = await adminMenuDao.listMenus()
  const pages = menus
    .filter((m) => m.component)
    .map((m) => ({
      name: m.route_name,
      path: m.route_path,
      component: m.component,
      label: m.menu_name
    }))
  return { success: true, data: pages }
}
