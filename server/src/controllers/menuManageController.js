/**
 * @module 菜单管理
 * @description 处理后台菜单管理相关的增删改查
 */

import adminMenuDao from '../services/menuDao.js'
import { buildMenuTree } from '../utils/adminPermission.js'
import { businessCode, businessMsg } from '../config/businessCode.js'
import { httpCode } from '../config/httpError.js'

const toDbStatus = (status) => {
  if (status === '2' || Number(status) === 0) {
    return 0
  }

  return 1
}

const toFrontendStatus = (status) => {
  return Number(status) === 1 ? '1' : '2'
}

/**
 * 将前端请求体转换为数据库写入 payload。
 * @param {object} body
 * @returns {object}
 */
const toMenuPayload = (body) => {
  return {
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
    i18nKey: body.i18nKey ?? null,
    hideInMenu: body.hideInMenu ? 1 : 0,
    activeMenu: body.activeMenu ?? null,
    multiTab: body.multiTab ? 1 : 0,
    keepAlive: body.keepAlive ? 1 : 0,
    status: toDbStatus(body.status)
  }
}

/**
 * 格式化菜单记录，将数据库 tinyint 布尔字段转为前端友好的格式。
 * @param {object} row
 * @returns {object}
 */
const formatMenuRow = (row, buttonMap = new Map()) => {
  return {
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
    ...(row.i18nKey ? { i18nKey: row.i18nKey } : {}),
    ...(row.hideInMenu ? { hideInMenu: Boolean(row.hideInMenu) } : {}),
    ...(row.activeMenu ? { activeMenu: row.activeMenu } : {}),
    ...(row.multiTab ? { multiTab: Boolean(row.multiTab) } : {}),
    ...(row.keepAlive ? { keepAlive: Boolean(row.keepAlive) } : {})
  }
}

const buildMenuRecordTree = (rows) => {
  const nodeMap = new Map(
    rows.map((row) => [
      row.id,
      row.menuType === '1'
        ? {
            ...row,
            children: []
          }
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
 * 获取菜单列表 - 分页查询
 * @api GET /admin/system/menus
 * @description 菜单管理 - 后台菜单管理相关的增删改查
 * @query {integer} page - 当前页码
 * @query {integer} pageSize - 每页数量
 * @query {string} [keyword] - 菜单名称或路径关键词
 */
const listMenus = async (ctx) => {
  // 前端兼容：current/size 转换为 page/pageSize
  const { current, size, page, pageSize, keyword } = ctx.query
  const actualPage = Number(page || current || 1)
  const actualPageSize = Number(pageSize || size || 10)
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

  if (ctx.path.endsWith('/v2')) {
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

    ctx.status = httpCode.ok
    ctx.body = {
      code: businessCode.success,
      msg: '获取菜单列表成功',
      data: {
        records,
        current: 1,
        size: records.length,
        total: records.length
      }
    }
    return
  }

  const [list, total] = await Promise.all([
    adminMenuDao.listMenusPaginated({ page: actualPage, pageSize: actualPageSize, keyword }),
    adminMenuDao.countMenus({ keyword })
  ])

  ctx.status = httpCode.ok
  ctx.body = {
    code: businessCode.success,
    msg: '获取菜单列表成功',
    data: {
      records: list.map((item) => formatMenuRow(item, buttonMap)),
      current: actualPage,
      size: actualPageSize,
      total: Number(total)
    }
  }
}

/**
 * 获取菜单树 - 全量查询构建树形结构
 * @api GET /admin/system/menus/tree
 * @description 菜单管理 - 用于角色菜单权限选择
 */
const getMenuTree = async (ctx) => {
  const menus = await adminMenuDao.listMenus()

  ctx.status = httpCode.ok
  ctx.body = {
    code: businessCode.success,
    msg: '获取菜单树成功',
    data: buildMenuTree(menus)
  }
}

/**
 * 创建菜单
 * @api POST /admin/system/menus
 * @description 菜单管理
 * @body {string} menuName - 菜单名称
 * @body {string} routeName - 路由名称
 * @body {string} routePath - 路由路径
 * @body {integer} [menuType=2] - 菜单类型：1=目录 2=菜单页面
 * @body {string} [component] - 前端组件路径
 * @body {string} [redirect] - 重定向路径
 * @body {integer} [orderNum=0] - 排序序号
 * @body {string} [icon] - 菜单图标
 * @body {integer} [iconType=1] - 图标类型
 * @body {string} [i18nKey] - 国际化key
 * @body {boolean} [hideInMenu=false] - 是否隐藏
 * @body {string} [activeMenu] - 激活菜单路由名
 * @body {boolean} [multiTab=false] - 是否多标签页
 * @body {boolean} [keepAlive=false] - 是否缓存
 * @body {integer} [parentId] - 父级菜单 ID
 */
const createMenu = async (ctx) => {
  const { routePath, routeName, parentId, buttons = [] } = ctx.request.body
  const [existedPath, existedName] = await Promise.all([
    adminMenuDao.findMenuByPath(routePath),
    adminMenuDao.findMenuByName(routeName)
  ])

  if (existedPath) {
    ctx.status = httpCode.ok
    ctx.body = { code: businessCode.menuPathExist, msg: businessMsg[businessCode.menuPathExist] }
    return
  }

  if (existedName) {
    ctx.status = httpCode.ok
    ctx.body = { code: businessCode.menuNameExist, msg: businessMsg[businessCode.menuNameExist] }
    return
  }

  if (parentId) {
    const parentMenu = await adminMenuDao.findMenuById(parentId)
    if (!parentMenu) {
      ctx.status = httpCode.ok
      ctx.body = { code: businessCode.paramError, msg: '父级菜单不存在' }
      return
    }
  }

  const result = await adminMenuDao.createMenu(toMenuPayload(ctx.request.body))
  await adminMenuDao.replaceMenuButtons(result.insertId, routeName, buttons)

  ctx.status = httpCode.ok
  ctx.body = {
    code: businessCode.success,
    msg: '创建菜单成功',
    data: {
      id: result.insertId
    }
  }
}

/**
 * 更新菜单
 * @api PUT /admin/system/menus
 * @description 菜单管理
 * @body {integer} id - 菜单 ID
 * @body {string} [menuName] - 菜单名称
 * @body {string} [routeName] - 路由名称
 * @body {string} [routePath] - 路由路径
 * @body {integer} [menuType] - 菜单类型
 * @body {string} [component] - 前端组件路径
 * @body {string} [redirect] - 重定向路径
 * @body {integer} [orderNum] - 排序序号
 * @body {string} [icon] - 菜单图标
 * @body {integer} [iconType] - 图标类型
 * @body {string} [i18nKey] - 国际化key
 * @body {boolean} [hideInMenu] - 是否隐藏
 * @body {string} [activeMenu] - 激活菜单路由名
 * @body {boolean} [multiTab] - 是否多标签页
 * @body {boolean} [keepAlive] - 是否缓存
 * @body {integer} [parentId] - 父级菜单 ID
 * @body {integer} [status] - 状态
 */
const updateMenu = async (ctx) => {
  const { id, routePath, routeName, parentId, buttons } = ctx.request.body
  const currentMenu = await adminMenuDao.findMenuById(id)

  if (!currentMenu) {
    ctx.status = httpCode.ok
    ctx.body = { code: businessCode.error, msg: '菜单不存在' }
    return
  }

  if (routePath) {
    const existedPath = await adminMenuDao.findMenuByPath(routePath)
    if (existedPath && existedPath.id !== id) {
      ctx.status = httpCode.ok
      ctx.body = { code: businessCode.menuPathExist, msg: businessMsg[businessCode.menuPathExist] }
      return
    }
  }

  if (routeName) {
    const existedName = await adminMenuDao.findMenuByName(routeName)
    if (existedName && existedName.id !== id) {
      ctx.status = httpCode.ok
      ctx.body = { code: businessCode.menuNameExist, msg: businessMsg[businessCode.menuNameExist] }
      return
    }
  }

  if (parentId !== undefined) {
    if (parentId === id) {
      ctx.status = httpCode.ok
      ctx.body = { code: businessCode.paramError, msg: '父级菜单不能选择自己' }
      return
    }

    if (parentId !== null) {
      const parentMenu = await adminMenuDao.findMenuById(parentId)
      if (!parentMenu) {
        ctx.status = httpCode.ok
        ctx.body = { code: businessCode.paramError, msg: '父级菜单不存在' }
        return
      }
    }
  }

  // 构建动态更新 payload
  const payload = {}
  const body = ctx.request.body
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
    i18nKey: 'i18nKey',
    activeMenu: 'activeMenu',
    status: 'status',
    parentId: 'parentId'
  }

  for (const [bodyKey, colKey] of Object.entries(fieldMap)) {
    if (body[bodyKey] !== undefined) {
      payload[colKey] = bodyKey === 'status' ? toDbStatus(body[bodyKey]) : body[bodyKey] ?? null
    }
  }

  // 布尔字段单独处理（前端传 true/false，数据库存 1/0）
  if (body.hideInMenu !== undefined) {
    payload.hideInMenu = body.hideInMenu ? 1 : 0
  }
  if (body.multiTab !== undefined) {
    payload.multiTab = body.multiTab ? 1 : 0
  }
  if (body.keepAlive !== undefined) {
    payload.keepAlive = body.keepAlive ? 1 : 0
  }

  await adminMenuDao.updateMenu(id, payload)
  if (buttons !== undefined) {
    await adminMenuDao.replaceMenuButtons(id, routeName || currentMenu.routeName, buttons)
  } else if (routeName && routeName !== currentMenu.routeName) {
    await adminMenuDao.updateMenuButtonRouteName(id, routeName)
  }

  ctx.status = httpCode.ok
  ctx.body = {
    code: businessCode.success,
    msg: '更新菜单成功'
  }
}

/**
 * 删除菜单
 * @api DELETE /admin/system/menus
 * @description 菜单管理
 * @body {integer} id - 菜单 ID
 */
const deleteMenu = async (ctx) => {
  const ids = ctx.request.body.id ? [ctx.request.body.id] : ctx.request.body.ids || []

  for (const rawId of ids) {
    const id = Number(rawId)
    const currentMenu = await adminMenuDao.findMenuById(id)

    if (!currentMenu) {
      ctx.status = httpCode.ok
      ctx.body = { code: businessCode.error, msg: '菜单不存在' }
      return
    }

    const childrenCount = await adminMenuDao.countChildren(id)
    if (childrenCount > 0) {
      ctx.status = httpCode.ok
      ctx.body = { code: businessCode.menuHasChildren, msg: businessMsg[businessCode.menuHasChildren] }
      return
    }
  }

  if (ids.length > 1) {
    await adminMenuDao.deleteMenus(ids)
  } else {
    await adminMenuDao.deleteMenu(Number(ids[0]))
  }

  ctx.status = httpCode.ok
  ctx.body = {
    code: businessCode.success,
    msg: '删除菜单成功'
  }
}

const getAllPages = async (ctx) => {
  const menus = await adminMenuDao.listMenus()
  const pages = menus
    .filter((m) => m.component)
    .map((m) => ({
      name: m.routeName,
      path: m.routePath,
      component: m.component,
      label: m.menuName
    }))
  ctx.status = httpCode.ok
  ctx.body = {
    code: businessCode.success,
    msg: 'ok',
    data: pages
  }
}

export default {
  listMenus,
  getMenuTree,
  getAllPages,
  createMenu,
  updateMenu,
  deleteMenu
}
