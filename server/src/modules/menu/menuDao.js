import { getConnection, query } from '../../utils/db.js'

/**
 * 菜单列表查询的公共字段（适配新表结构，不再依赖 meta JSON）。
 */
const MENU_COLUMNS = `
  id, parentId, menuType, menuName, routeName, routePath,
  component, redirect, orderNum, icon, iconType,
  hideInMenu, activeMenu, multiTab, keepAlive,
  status, createBy, createTime, updateBy, updateTime
`

/**
 * 查询菜单列表（按父子关系排序）。
 * @returns {Promise<Array<any>>}
 */
const listMenus = async () => {
  const sql = `
    select ${MENU_COLUMNS}
    from RouteAuth
    order by coalesce(parentId, 0), orderNum asc, id asc
  `

  return query(sql)
}

/**
 * 根据菜单 ID 查询单条菜单。
 * @param {number} id
 * @returns {Promise<any | null>}
 */
const findMenuById = async (id) => {
  const sql = `
    select ${MENU_COLUMNS}
    from RouteAuth
    where id = ?
    limit 1
  `
  const rows = await query(sql, [id])
  return rows[0] || null
}

/**
 * 根据 routePath 查询菜单（唯一性校验使用）。
 * @param {string} routePath
 * @returns {Promise<any | null>}
 */
const findMenuByPath = async (routePath) => {
  const sql = 'select id, routePath from RouteAuth where routePath = ? limit 1'
  const rows = await query(sql, [routePath])
  return rows[0] || null
}

/**
 * 根据 routeName 查询菜单（唯一性校验使用）。
 * @param {string} routeName
 * @returns {Promise<any | null>}
 */
const findMenuByName = async (routeName) => {
  const sql = 'select id, routeName from RouteAuth where routeName = ? limit 1'
  const rows = await query(sql, [routeName])
  return rows[0] || null
}

/**
 * 创建菜单。
 * @param {object} payload
 * @returns {Promise<any>}
 */
const createMenu = async (payload) => {
  const sql = `
    insert into RouteAuth (
      parentId, menuType, menuName, routeName, routePath,
      component, redirect, orderNum, icon, iconType,
      hideInMenu, activeMenu, multiTab, keepAlive, status
    ) values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `

  const params = [
    payload.parentId ?? null,
    payload.menuType ?? 2,
    payload.menuName,
    payload.routeName,
    payload.routePath,
    payload.component ?? null,
    payload.redirect ?? null,
    payload.orderNum ?? 0,
    payload.icon ?? null,
    payload.iconType ?? 1,
    payload.hideInMenu ? 1 : 0,
    payload.activeMenu ?? null,
    payload.multiTab ? 1 : 0,
    payload.keepAlive ? 1 : 0,
    payload.status ?? 1
  ]

  return query(sql, params)
}

/**
 * 动态更新菜单字段，仅更新 payload 中出现的列。
 * @param {number} id
 * @param {Record<string, any>} payload
 * @returns {Promise<any>}
 */
const updateMenu = async (id, payload) => {
  const fields = []
  const params = []

  for (const [key, value] of Object.entries(payload)) {
    fields.push(`${key} = ?`)
    params.push(value)
  }

  if (fields.length === 0) {
    return { affectedRows: 0 }
  }

  const sql = `update RouteAuth set ${fields.join(', ')} where id = ?`
  return query(sql, [...params, id])
}

/**
 * 统计指定菜单的子菜单数量。
 * @param {number} id
 * @returns {Promise<number>}
 */
const countChildren = async (id) => {
  const sql = 'select count(*) as total from RouteAuth where parentId = ?'
  const rows = await query(sql, [id])
  return rows[0]?.total || 0
}

/**
 * 删除菜单（事务）：
 * 1) 删除按钮权限
 * 2) 删除角色路由关系
 * 3) 删除菜单自身
 * @param {number} id
 * @returns {Promise<any>}
 */
const deleteMenu = async (id) => {
  const connection = await getConnection()
  try {
    await connection.beginTransaction()
    await connection.execute('delete from ButtonAuth where routeId = ?', [id])
    await connection.execute('delete from RoleRoute where routeId = ?', [id])
    const [result] = await connection.execute('delete from RouteAuth where id = ?', [id])
    await connection.commit()
    return result
  } catch (error) {
    await connection.rollback()
    throw error
  } finally {
    connection.release()
  }
}

/**
 * 分页查询菜单列表（按父子关系排序）。
 * @param {{ page?: number, pageSize?: number, keyword?: string }} options
 * @returns {Promise<Array<any>>}
 */
const listMenusPaginated = async ({ page = 1, pageSize = 10, keyword = '' } = {}) => {
  const offset = (Number(page) - 1) * Number(pageSize)
  let whereClause = ''
  const params = []

  if (keyword) {
    whereClause = ' where (menuName like ? or routePath like ? or routeName like ?)'
    params.push(`%${keyword}%`, `%${keyword}%`, `%${keyword}%`)
  }

  const sql = `
    select ${MENU_COLUMNS}
    from RouteAuth
    ${whereClause}
    order by coalesce(parentId, 0), orderNum asc, id asc
    limit ? offset ?
  `

  return query(sql, [...params, Number(pageSize), offset])
}

/**
 * 统计菜单总数（支持关键词过滤）。
 * @param {{ keyword?: string }} options
 * @returns {Promise<number>}
 */
const countMenus = async ({ keyword = '' } = {}) => {
  let whereClause = ''
  const params = []

  if (keyword) {
    whereClause = ' where (menuName like ? or routePath like ? or routeName like ?)'
    params.push(`%${keyword}%`, `%${keyword}%`, `%${keyword}%`)
  }

  const sql = `select count(*) as total from RouteAuth${whereClause}`
  const rows = await query(sql, params)
  return rows[0]?.total || 0
}

/**
 * 查询全部菜单下的按钮配置。
 * @returns {Promise<Array<any>>}
 */
const listMenuButtons = async () => {
  const sql = `
    select
      buttonId,
      routeId,
      routeName,
      buttonName,
      buttonLabel,
      orderNum,
      status
    from ButtonAuth
    order by routeId asc, orderNum asc, buttonId asc
  `

  return query(sql)
}

/**
 * 重置单个菜单的按钮配置。
 * @param {number} routeId
 * @param {string} routeName
 * @param {Array<{code:string,desc?:string}>} buttons
 * @param {import('mysql2/promise').PoolConnection} [connection]
 * @returns {Promise<void>}
 */
const replaceMenuButtons = async (routeId, routeName, buttons = [], connection) => {
  const executor = connection || (await getConnection())
  const safeButtons = buttons
    .map((item, index) => ({
      buttonName: String(item.code || '').trim(),
      buttonLabel: String(item.desc || '').trim() || null,
      orderNum: index + 1
    }))
    .filter((item) => item.buttonName)

  try {
    await executor.execute('delete from ButtonAuth where routeId = ?', [routeId])

    if (safeButtons.length > 0) {
      const valuesSql = safeButtons.map(() => '(?, ?, ?, ?, ?, 1)').join(', ')
      const values = safeButtons.flatMap((item) => [
        routeId,
        routeName,
        item.buttonName,
        item.buttonLabel,
        item.orderNum
      ])
      await executor.execute(
        `
          insert into ButtonAuth (routeId, routeName, buttonName, buttonLabel, orderNum, status)
          values ${valuesSql}
        `,
        values
      )
    }
  } finally {
    if (!connection) {
      executor.release()
    }
  }
}

/**
 * 同步按钮记录中的 routeName。
 * @param {number} routeId
 * @param {string} routeName
 * @returns {Promise<any>}
 */
const updateMenuButtonRouteName = async (routeId, routeName) => {
  return query('update ButtonAuth set routeName = ? where routeId = ?', [routeName, routeId])
}

/**
 * 批量删除菜单。
 * @param {number[]} ids
 * @returns {Promise<void>}
 */
const deleteMenus = async (ids) => {
  const connection = await getConnection()
  const safeIds = [...new Set((ids || []).map((id) => Number(id)).filter(Boolean))]

  try {
    await connection.beginTransaction()
    for (const id of safeIds) {
      await connection.execute('delete from ButtonAuth where routeId = ?', [id])
      await connection.execute('delete from RoleRoute where routeId = ?', [id])
      await connection.execute('delete from RouteAuth where id = ?', [id])
    }
    await connection.commit()
  } catch (error) {
    await connection.rollback()
    throw error
  } finally {
    connection.release()
  }
}

export default {
  listMenus,
  listMenusPaginated,
  countMenus,
  listMenuButtons,
  updateMenuButtonRouteName,
  findMenuById,
  findMenuByPath,
  findMenuByName,
  createMenu,
  updateMenu,
  countChildren,
  deleteMenu,
  deleteMenus,
  replaceMenuButtons
}
