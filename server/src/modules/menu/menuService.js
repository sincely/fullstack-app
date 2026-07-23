/**
 * @module 菜单管理 Service
 * @description 封装菜单 CRUD、树结构构建、按钮管理等业务逻辑
 */

import adminMenuDao from './menuDao.js'
import { buildMenuTree } from '../../utils/adminPermission.js'
import { businessCode } from '../../config/businessCode.js'
import { normalizePagination } from '../../schemas/common/paginationSchema.js'

const toDbStatus = (status) => {
  if (status === '2' || Number(status) === 0) return 0
  return 1
}

const toFrontendStatus = (status) => {
  return Number(status) === 1 ? '1' : '2'
}

const toMenuPayload = (body) => ({
  parentId: body.parentId ?? null,
  menuType: body.menuType ?? 2,
  menuName: body.menuName,
  routeName: body.routeName,
  routePath: body.routePath,
  component: body.component ?? null,
  redirect: body.redirect ?? null,
  orderNum: body.orderNum ?? 0,
  icon: body.icon ?? null,
  iconType: body.iconType ?? 1,
  hideInMenu: body.hideInMenu ? 1 : 0,
  activeMenu: body.activeMenu ?? null,
  multiTab: body.multiTab ? 1 : 0,
  keepAlive: body.keepAlive ? 1 : 0,
  status: toDbStatus(body.status)
})

const formatMenuRow = (row, buttonMap = new Map()) => ({
  id: row.id,
  createBy: row.createBy || '',
  createTime: row.createTime || '',
  updateBy: row.updateBy || '',
  updateTime: row.updateTime || '',
  status: toFrontendStatus(row.status),
  parentId: row.parentId ?? 0,
  menuType: String(row.menuType),
  menuName: row.menuName,
  routeName: row.routeName,
  routePath: row.routePath,
  component: row.component,
  redirect: row.redirect,
  order: row.orderNum,
  icon: row.icon,
  iconType: String(row.iconType),
  buttons: buttonMap.get(row.id) || [],
  ...(row.hideInMenu ? { hideInMenu: Boolean(row.hideInMenu) } : {}),
  ...(row.activeMenu ? { activeMenu: row.activeMenu } : {}),
  ...(row.multiTab ? { multiTab: Boolean(row.multiTab) } : {}),
  ...(row.keepAlive ? { keepAlive: Boolean(row.keepAlive) } : {})
})

const buildMenuRecordTree = (rows) => {
  const nodeMap = new Map(
    rows.map((row) => [
      row.id,
      row.menuType === '1'
        ? { ...row, children: [] }
        : { ...row }
    ])
  )
  const roots = []

  for (const row of rows) {
    const currentNode = nodeMap.get(row.id)
    const parentId = Number(row.parentId) || 0

    if (parentId !== 0 && nodeMap.has(parentId)) {
      const parentNode = nodeMap.get(parentId)
      if (parentNode.menuType === '1' && Array.isArray(parentNode.children)) {
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
    const currentButtons = buttonMap.get(button.routeId) || []
    currentButtons.push({
      code: button.buttonName,
      desc: button.buttonLabel || ''
    })
    buttonMap.set(button.routeId, currentButtons)
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
          return [item.menuName, item.routePath, item.routeName].some((field) =>
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

  if (existedPath) return { success: false, code: businessCode.menuPathExist }
  if (existedName) return { success: false, code: businessCode.menuNameExist }

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

  // 构建动态更新 payload
  const payload = {}
  const fieldMap = {
    menuName: 'menuName',
    routeName: 'routeName',
    routePath: 'routePath',
    menuType: 'menuType',
    component: 'component',
    redirect: 'redirect',
    orderNum: 'orderNum',
    icon: 'icon',
    iconType: 'iconType',
    activeMenu: 'activeMenu',
    status: 'status',
    parentId: 'parentId'
  }

  for (const [bodyKey, colKey] of Object.entries(fieldMap)) {
    if (body[bodyKey] !== undefined) {
      payload[colKey] = bodyKey === 'status' ? toDbStatus(body[bodyKey]) : (body[bodyKey] ?? null)
    }
  }

  // 布尔字段单独处理（前端传 true/false，数据库存 1/0）
  if (body.hideInMenu !== undefined) payload.hideInMenu = body.hideInMenu ? 1 : 0
  if (body.multiTab !== undefined) payload.multiTab = body.multiTab ? 1 : 0
  if (body.keepAlive !== undefined) payload.keepAlive = body.keepAlive ? 1 : 0

  await adminMenuDao.updateMenu(id, payload)
  if (buttons !== undefined) {
    await adminMenuDao.replaceMenuButtons(id, routeName || currentMenu.routeName, buttons)
  } else if (routeName && routeName !== currentMenu.routeName) {
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
      name: m.routeName,
      path: m.routePath,
      component: m.component,
      label: m.menuName
    }))
  return { success: true, data: pages }
}
