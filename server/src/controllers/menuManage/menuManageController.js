import userMenuDao from '#src/dao/systemManage/menuManage/userMenuDao.js'
import { businessCode, businessMsg } from '#config/businessCode.js'
import { httpCode } from '#config/httpError.js'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import { readFile } from 'node:fs/promises'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const importsFilePath = path.resolve(__dirname, '../../../../client/src/router/elegant/imports.js')

const parseMeta = (meta) => {
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

const inferIconType = (icon = '', iconType) => {
  if (iconType) {
    return iconType
  }
  if (!icon) {
    return '1'
  }

  return icon.includes(':') ? '1' : '2'
}

const isMenuPage = (component = '') => String(component || '').includes('view.')

const toMenuRecord = (menu, buttons = []) => {
  const meta = parseMeta(menu.meta)

  return {
    id: menu.id,
    createBy: '',
    createTime: '',
    updateBy: '',
    updateTime: '',
    status: meta.status ?? '1',
    parentId: menu.parent_id ?? 0,
    menuType: meta.menuType ?? (isMenuPage(menu.component) ? '2' : '1'),
    menuName: meta.title ?? menu.name,
    routeName: menu.name,
    routePath: menu.path,
    component: menu.component ?? '',
    i18nKey: meta.i18nKey ?? '',
    icon: meta.icon ?? '',
    iconType: inferIconType(meta.icon, meta.iconType),
    order: meta.order ?? 0,
    keepAlive: meta.keepAlive ?? false,
    constant: meta.constant ?? false,
    href: meta.href ?? null,
    hideInMenu: meta.hideInMenu ?? false,
    activeMenu: meta.activeMenu ?? null,
    multiTab: meta.multiTab ?? false,
    fixedIndexInTab: meta.fixedIndexInTab ?? null,
    query: Array.isArray(meta.query) ? meta.query : [],
    buttons,
    children: []
  }
}

const buildTree = (menuList) => {
  const menuMap = new Map(menuList.map((item) => [item.id, { ...item, children: [] }]))
  const roots = []

  for (const menu of menuMap.values()) {
    if (menu.parentId && menuMap.has(menu.parentId)) {
      menuMap.get(menu.parentId).children.push(menu)
      continue
    }

    roots.push(menu)
  }

  return roots
}

const buildTreeOptions = (menuList) => {
  return menuList.map((item) => ({
    id: String(item.id),
    label: item.menuName,
    pId: String(item.parentId)
  }))
}

const buildMenuMeta = (payload) => {
  return {
    title: payload.menuName,
    menuType: payload.menuType,
    status: payload.status,
    i18nKey: payload.i18nKey || '',
    icon: payload.icon || '',
    iconType: payload.iconType,
    order: payload.order,
    keepAlive: payload.keepAlive,
    constant: payload.constant,
    href: payload.href || null,
    hideInMenu: payload.hideInMenu,
    activeMenu: payload.activeMenu || null,
    multiTab: payload.multiTab,
    fixedIndexInTab: payload.fixedIndexInTab ?? null,
    query: payload.query ?? [],
    buttons: payload.buttons ?? []
  }
}

const loadPageNames = async () => {
  const content = await readFile(importsFilePath, 'utf-8')
  const matches = [...content.matchAll(/^\s*['"]?([A-Za-z0-9_-]+)['"]?\s*:\s*\(\)\s*=>/gm)]

  return matches.map((match) => match[1]).filter((name) => !['403', '404', '500', 'login'].includes(name))
}

const getFormattedMenus = async () => {
  const menus = await userMenuDao.listMenus()
  const buttonRows = await userMenuDao.listButtonsByRouteIds(menus.map((item) => item.id))
  const buttonMap = new Map()

  for (const button of buttonRows) {
    if (!buttonMap.has(button.routeId)) {
      buttonMap.set(button.routeId, [])
    }
    buttonMap.get(button.routeId).push({
      code: button.buttonName,
      desc: button.buttonName
    })
  }

  return menus.map((menu) => {
    const meta = parseMeta(menu.meta)
    const buttons = Array.isArray(meta.buttons) && meta.buttons.length ? meta.buttons : buttonMap.get(menu.id) || []
    return toMenuRecord(menu, buttons)
  })
}

const validateParent = async (parentId, currentId) => {
  if (parentId === 0) {
    return { ok: true }
  }

  if (parentId === currentId) {
    return { ok: false, msg: '父级菜单不能选择自己' }
  }

  const parentMenu = await userMenuDao.findMenuById(parentId)
  if (!parentMenu) {
    return { ok: false, msg: '父级菜单不存在' }
  }

  if (currentId) {
    const menus = await userMenuDao.listMenus()
    const parentMap = new Map(menus.map((item) => [item.id, item.parent_id ?? 0]))
    let cursor = parentId
    while (cursor) {
      if (cursor === currentId) {
        return { ok: false, msg: '父级菜单不能为当前菜单的子节点' }
      }
      cursor = parentMap.get(cursor) ?? 0
    }
  }

  return { ok: true }
}

const listMenus = async (ctx) => {
  const current = Number(ctx.query.current) || 1
  const size = Number(ctx.query.size) || 10
  const formattedMenus = await getFormattedMenus()
  const treeRecords = buildTree(formattedMenus)

  ctx.status = httpCode.ok
  ctx.body = {
    code: '200',
    msg: '获取菜单列表成功',
    data: {
      records: treeRecords,
      current,
      size,
      total: treeRecords.length
    }
  }
}

const getAllPages = async (ctx) => {
  const pageNames = await loadPageNames()

  ctx.status = httpCode.ok
  ctx.body = {
    code: '200',
    msg: '获取全部页面成功',
    data: pageNames
  }
}

const getMenuTree = async (ctx) => {
  const formattedMenus = await getFormattedMenus()

  ctx.status = httpCode.ok
  ctx.body = {
    code: '200',
    msg: '获取菜单树成功',
    data: buildTreeOptions(formattedMenus)
  }
}

const createMenu = async (ctx) => {
  const payload = ctx.request.body
  const [existedPath, existedName] = await Promise.all([
    userMenuDao.findMenuByPath(payload.routePath),
    userMenuDao.findMenuByName(payload.routeName)
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

  const parentValidation = await validateParent(payload.parentId, null)
  if (!parentValidation.ok) {
    ctx.status = httpCode.ok
    ctx.body = { code: businessCode.paramError, msg: parentValidation.msg }
    return
  }

  const meta = buildMenuMeta(payload)
  const result = await userMenuDao.createMenuWithButtons({
    path: payload.routePath,
    name: payload.routeName,
    component: payload.component || null,
    redirect: null,
    meta: JSON.stringify(meta),
    parentId: payload.parentId || null,
    buttons: payload.buttons
  })

  const createdMenu = await userMenuDao.findMenuById(result.insertId)
  const menuRecord = toMenuRecord(createdMenu, payload.buttons)

  ctx.status = httpCode.ok
  ctx.body = {
    code: '200',
    msg: '创建菜单成功',
    data: menuRecord
  }
}

const updateMenu = async (ctx) => {
  const payload = ctx.request.body
  const currentMenu = await userMenuDao.findMenuById(payload.id)

  if (!currentMenu) {
    ctx.status = httpCode.ok
    ctx.body = { code: businessCode.error, msg: '菜单不存在' }
    return
  }

  const [existedPath, existedName] = await Promise.all([
    userMenuDao.findMenuByPath(payload.routePath),
    userMenuDao.findMenuByName(payload.routeName)
  ])

  if (existedPath && existedPath.id !== payload.id) {
    ctx.status = httpCode.ok
    ctx.body = { code: businessCode.menuPathExist, msg: businessMsg[businessCode.menuPathExist] }
    return
  }

  if (existedName && existedName.id !== payload.id) {
    ctx.status = httpCode.ok
    ctx.body = { code: businessCode.menuNameExist, msg: businessMsg[businessCode.menuNameExist] }
    return
  }

  const parentValidation = await validateParent(payload.parentId, payload.id)
  if (!parentValidation.ok) {
    ctx.status = httpCode.ok
    ctx.body = { code: businessCode.paramError, msg: parentValidation.msg }
    return
  }

  const meta = buildMenuMeta(payload)
  await userMenuDao.updateMenuWithButtons(
    payload.id,
    {
      path: payload.routePath,
      name: payload.routeName,
      component: payload.component || null,
      redirect: null,
      meta: JSON.stringify(meta),
      parent_id: payload.parentId || null
    },
    payload.routeName,
    payload.buttons
  )

  const updatedMenu = await userMenuDao.findMenuById(payload.id)
  const menuRecord = toMenuRecord(updatedMenu, payload.buttons)

  ctx.status = httpCode.ok
  ctx.body = {
    code: '200',
    msg: '更新菜单成功',
    data: menuRecord
  }
}

const deleteMenu = async (ctx) => {
  const ids =
    Array.isArray(ctx.request.body.ids) && ctx.request.body.ids.length ? ctx.request.body.ids : [ctx.request.body.id]

  for (const id of ids) {
    const currentMenu = await userMenuDao.findMenuById(id)
    if (!currentMenu) {
      ctx.status = httpCode.ok
      ctx.body = { code: businessCode.error, msg: '菜单不存在' }
      return
    }

    const childrenCount = await userMenuDao.countChildren(id)
    if (childrenCount > 0) {
      ctx.status = httpCode.ok
      ctx.body = { code: businessCode.menuHasChildren, msg: businessMsg[businessCode.menuHasChildren] }
      return
    }
  }

  for (const id of ids) {
    await userMenuDao.deleteMenu(id)
  }

  ctx.status = httpCode.ok
  ctx.body = {
    code: '200',
    msg: '删除菜单成功'
  }
}

export default {
  listMenus,
  getAllPages,
  getMenuTree,
  createMenu,
  updateMenu,
  deleteMenu
}
