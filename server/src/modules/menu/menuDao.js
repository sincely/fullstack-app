import { getConnection, query } from '../../db/connection.js'

/**
 * 菜单列表查询的公共字段（适配新表结构，不再依赖 meta JSON）。
 */
const MENU_COLUMNS = `
  id, parent_id, menu_type, menu_name, route_name, route_path,
  component, redirect, order_num, icon, icon_type,
  hide_in_menu, active_menu, multi_tab, keep_alive,
  status, create_by, create_time, update_by, update_time
`

/**
 * 查询菜单列表（按父子关系排序）。
 * @returns {Promise<Array<any>>}
 */
const listMenus = async () => {
  const sql = `
    select ${MENU_COLUMNS}
    from RouteAuth
    order by coalesce(parent_id, 0), order_num asc, id asc
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
 * 根据 route_path 查询菜单（唯一性校验使用）。
 * @param {string} route_path
 * @returns {Promise<any | null>}
 */
const findMenuByPath = async (route_path) => {
  const sql = 'select id, route_path from RouteAuth where route_path = ? limit 1'
  const rows = await query(sql, [route_path])
  return rows[0] || null
}

/**
 * 根据 route_name 查询菜单（唯一性校验使用）。
 * @param {string} route_name
 * @returns {Promise<any | null>}
 */
const findMenuByName = async (route_name) => {
  const sql = 'select id, route_name from RouteAuth where route_name = ? limit 1'
  const rows = await query(sql, [route_name])
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
      parent_id, menu_type, menu_name, route_name, route_path,
      component, redirect, order_num, icon, icon_type,
      hide_in_menu, active_menu, multi_tab, keep_alive, status
    ) values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `

  const params = [
    payload.parent_id ?? null,
    payload.menu_type ?? 2,
    payload.menu_name,
    payload.route_name,
    payload.route_path,
    payload.component ?? null,
    payload.redirect ?? null,
    payload.order_num ?? 0,
    payload.icon ?? null,
    payload.icon_type ?? 1,
    payload.hide_in_menu ? 1 : 0,
    payload.active_menu ?? null,
    payload.multi_tab ? 1 : 0,
    payload.keep_alive ? 1 : 0,
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
  const sql = 'select count(*) as total from RouteAuth where parent_id = ?'
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
    await connection.execute('delete from ButtonAuth where route_id = ?', [id])
    await connection.execute('delete from RoleRoute where route_id = ?', [id])
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
    whereClause = ' where (menu_name like ? or route_path like ? or route_name like ?)'
    params.push(`%${keyword}%`, `%${keyword}%`, `%${keyword}%`)
  }

  const sql = `
    select ${MENU_COLUMNS}
    from RouteAuth
    ${whereClause}
    order by coalesce(parent_id, 0), order_num asc, id asc
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
    whereClause = ' where (menu_name like ? or route_path like ? or route_name like ?)'
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
      button_id,
      route_id,
      route_name,
      button_name,
      button_label,
      order_num,
      status
    from ButtonAuth
    order by route_id asc, order_num asc, button_id asc
  `

  return query(sql)
}

/**
 * 重置单个菜单的按钮配置。
 * @param {number} route_id
 * @param {string} route_name
 * @param {Array<{code:string,desc?:string}>} buttons
 * @param {import('mysql2/promise').PoolConnection} [connection]
 * @returns {Promise<void>}
 */
const replaceMenuButtons = async (route_id, route_name, buttons = [], connection) => {
  const executor = connection || (await getConnection())
  const safeButtons = buttons
    .map((item, index) => ({
      button_name: String(item.code || '').trim(),
      button_label: String(item.desc || '').trim() || null,
      order_num: index + 1
    }))
    .filter((item) => item.button_name)

  try {
    await executor.execute('delete from ButtonAuth where route_id = ?', [route_id])

    if (safeButtons.length > 0) {
      const valuesSql = safeButtons.map(() => '(?, ?, ?, ?, ?, 1)').join(', ')
      const values = safeButtons.flatMap((item) => [
        route_id,
        route_name,
        item.button_name,
        item.button_label,
        item.order_num
      ])
      await executor.execute(
        `
          insert into ButtonAuth (route_id, route_name, button_name, button_label, order_num, status)
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
 * 同步按钮记录中的 route_name。
 * @param {number} route_id
 * @param {string} route_name
 * @returns {Promise<any>}
 */
const updateMenuButtonRouteName = async (route_id, route_name) => {
  return query('update ButtonAuth set route_name = ? where route_id = ?', [route_name, route_id])
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
      await connection.execute('delete from ButtonAuth where route_id = ?', [id])
      await connection.execute('delete from RoleRoute where route_id = ?', [id])
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
