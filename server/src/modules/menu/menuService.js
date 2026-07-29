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
const toMenuPayload = (body) => ({
  parent_id: body.parentId ?? null,
  menu_type: body.menuType ?? 2,
  menu_name: body.menuName,
  route_name: body.routeName,
  route_path: body.routePath,
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
})

// DB snake_case → 前端 camelCase 字段映射
const formatMenuRow = (row, buttonMap = new Map()) => ({
  id: row.id,
  createBy: row.create_by || '',
  createTime: row.create_time || '',
  updateBy: row.update_by || '',
  updateTime: row.update_time || '',
  status: toFrontendStatus(row.status),
  parentId: row.parent_id ?? 0,
  menuType: String(row.menu_type),
  menuName: row.menu_name,
  routeName: row.route_name,
  routePath: row.route_path,
  component: row.component,
  redirect: row.redirect,
  order: row.order_num,
  icon: row.icon,
  iconType: String(row.icon_type),
  buttons: buttonMap.get(row.id) || [],
  ...(row.hide_in_menu ? { hideInMenu: Boolean(row.hide_in_menu) } : {}),
  ...(row.active_menu ? { activeMenu: row.active_menu } : {}),
  ...(row.multi_tab ? { multiTab: Boolean(row.multi_tab) } : {}),
  ...(row.keep_alive ? { keepAlive: Boolean(row.keep_alive) } : {})
})

const buildMenuRecordTree = (rows) => {
  const nodeMap = new Map(rows.map((row) => [row.id, row.menu_type === '1' ? { ...row, children: [] } : { ...row }]))
  const roots = []

  for (const row of rows) {
    const currentNode = nodeMap.get(row.id)
    const parentId = Number(row.parent_id) || 0

    if (parentId !== 0 && nodeMap.has(parentId)) {
      const parentNode = nodeMap.get(parentId)
      if (parentNode.menu_type === '1' && Array.isArray(parentNode.children)) {
        parentNode.children.push(currentNode)
        continue
      }
    }

    roots.push(currentNode)
  }

  return roots
}

/**
 * 构建按钮 Map
 */
const buildButtonMap = async () => {
  const buttonRows = await adminMenuDao.listMenuButtons()
  const buttonMap = new Map()

  for (const button of buttonRows) {
    const currentButtons = buttonMap.get(button.route_id) || []
    currentButtons.push({
      code: button.button_name,
      desc: button.button_label || ''
    })
    buttonMap.set(button.route_id, currentButtons)
  }

  return buttonMap
}

/**
 * 获取菜单列表
 */
export const listMenus = async (query, isV2 = false) => {
  const { current, size, page, pageSize, keyword } = query
  const { actualPage, actualPageSize } = normalizePagination({ current, size, page, pageSize })
  const buttonMap = await buildButtonMap()

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

    const records = buildMenuRecordTree(filteredMenus.map((item) => formatMenuRow(item, buttonMap)))

    return {
      records,
      current: 1,
      size: records.length,
      total: records.length
    }
  }

  const [list, total] = await Promise.all([
    adminMenuDao.listMenusPaginated({ page: actualPage, pageSize: actualPageSize, keyword }),
    adminMenuDao.countMenus({ keyword })
  ])

  return {
    records: list.map((item) => formatMenuRow(item, buttonMap)),
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
  return { success: true, data: buildMenuTree(menus) }
}

/**
 * 创建菜单
 */
export const createMenu = async (body) => {
  const { routePath, routeName, parentId, buttons = [] } = body

  const [existedPath, existedName] = await Promise.all([
    adminMenuDao.findMenuByPath(routePath),
    adminMenuDao.findMenuByName(routeName)
  ])

  if (existedPath) {
    return { success: false, code: businessCode.menuPathExist }
  }
  if (existedName) {
    return { success: false, code: businessCode.menuNameExist }
  }

  if (parentId) {
    const parentMenu = await adminMenuDao.findMenuById(parentId)
    if (!parentMenu) {
      return { success: false, code: businessCode.paramError, msg: '父级菜单不存在' }
    }
  }

  const result = await adminMenuDao.createMenu(toMenuPayload(body))
  await adminMenuDao.replaceMenuButtons(result.insertId, routeName, buttons)

  return { success: true, data: { id: result.insertId } }
}

/**
 * 更新菜单
 */
export const updateMenu = async (body) => {
  const { id, routePath, routeName, parentId, buttons } = body
  const currentMenu = await adminMenuDao.findMenuById(id)

  if (!currentMenu) {
    return { success: false, code: businessCode.error, msg: '菜单不存在' }
  }

  if (routePath) {
    const existedPath = await adminMenuDao.findMenuByPath(routePath)
    if (existedPath && existedPath.id !== id) {
      return { success: false, code: businessCode.menuPathExist }
    }
  }

  if (routeName) {
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

  for (const [bodyKey, colKey] of Object.entries(fieldMap)) {
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
  if (buttons !== undefined) {
    await adminMenuDao.replaceMenuButtons(id, routeName || currentMenu.route_name, buttons)
  } else if (routeName && routeName !== currentMenu.route_name) {
    await adminMenuDao.updateMenuButtonRouteName(id, routeName)
  }

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
