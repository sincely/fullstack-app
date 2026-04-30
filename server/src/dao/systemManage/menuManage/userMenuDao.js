import { getConnection, query } from '#utils/db.js'

/**
 * 查询菜单列表（按父子关系排序）。
 * @returns {Promise<Array<any>>}
 */
const listMenus = async () => {
  const sql = `
    select
      id,
      path,
      name,
      component,
      redirect,
      meta,
      parent_id
    from RouteAuth
    order by coalesce(parent_id, 0), id asc
  `

  return query(sql)
}

const listPageComponents = async () => {
  const sql = `
    select distinct component
    from RouteAuth
    where component is not null
      and component <> ''
    order by component asc
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
    select id, path, name, component, redirect, meta, parent_id
    from RouteAuth
    where id = ?
    limit 1
  `
  const rows = await query(sql, [id])
  return rows[0] || null
}

/**
 * 根据 path 查询菜单（唯一性校验使用）。
 * @param {string} path
 * @returns {Promise<any | null>}
 */
const findMenuByPath = async (path) => {
  const sql = 'select id, path from RouteAuth where path = ? limit 1'
  const rows = await query(sql, [path])
  return rows[0] || null
}

/**
 * 根据 name 查询菜单（唯一性校验使用）。
 * @param {string} name
 * @returns {Promise<any | null>}
 */
const findMenuByName = async (name) => {
  const sql = 'select id, name from RouteAuth where name = ? limit 1'
  const rows = await query(sql, [name])
  return rows[0] || null
}

/**
 * 创建菜单。
 * @param {{path:string,name:string,component?:string|null,redirect?:string|null,meta?:string|null,parentId?:number|null}} payload
 * @returns {Promise<any>}
 */
const createMenu = async ({ path, name, component, redirect, meta, parentId }) => {
  const sql = `
    insert into RouteAuth (path, name, component, redirect, meta, parent_id)
    values (?, ?, ?, ?, ?, ?)
  `

  return query(sql, [path, name, component, redirect, meta, parentId])
}

const listButtonsByRouteIds = async (routeIds) => {
  if (!routeIds.length) {
    return []
  }

  const placeholders = routeIds.map(() => '?').join(', ')
  const sql = `
    select buttonId, routeId, routeName, buttonName
    from ButtonAuth
    where routeId in (${placeholders})
    order by routeId asc, buttonId asc
  `

  return query(sql, routeIds)
}

const syncButtonsFromMenus = async () => {
  const connection = await getConnection()

  try {
    await connection.beginTransaction()
    const [menus] = await connection.execute(`
      select id, name, meta
      from RouteAuth
      where meta is not null
      order by id asc
    `)

    await connection.execute('delete from ButtonAuth')

    const insertSql = 'insert into ButtonAuth (routeId, routeName, buttonName) values (?, ?, ?)'
    for (const menu of menus) {
      let meta = {}
      try {
        meta = typeof menu.meta === 'object' ? menu.meta : JSON.parse(menu.meta)
      } catch {
        meta = {}
      }

      const buttons = Array.isArray(meta.buttons) ? meta.buttons : []
      for (const button of buttons) {
        const buttonName = button?.code || button?.desc
        if (!buttonName) {
          continue
        }
        await connection.execute(insertSql, [menu.id, menu.name, buttonName])
      }
    }

    await connection.commit()
  } catch (error) {
    await connection.rollback()
    throw error
  } finally {
    connection.release()
  }
}

const replaceButtons = async (routeId, routeName, buttons = []) => {
  const connection = await getConnection()

  try {
    await connection.beginTransaction()
    await connection.execute('delete from ButtonAuth where routeId = ?', [routeId])

    if (buttons.length) {
      const sql = 'insert into ButtonAuth (routeId, routeName, buttonName) values (?, ?, ?)'
      for (const button of buttons) {
        await connection.execute(sql, [routeId, routeName, button.code])
      }
    }

    await connection.commit()
  } catch (error) {
    await connection.rollback()
    throw error
  } finally {
    connection.release()
  }
}

const createMenuWithButtons = async ({ path, name, component, redirect, meta, parentId, buttons = [] }) => {
  const connection = await getConnection()

  try {
    await connection.beginTransaction()
    const insertSql = `
      insert into RouteAuth (path, name, component, redirect, meta, parent_id)
      values (?, ?, ?, ?, ?, ?)
    `
    const [menuResult] = await connection.execute(insertSql, [path, name, component, redirect, meta, parentId])

    if (buttons.length) {
      const buttonSql = 'insert into ButtonAuth (routeId, routeName, buttonName) values (?, ?, ?)'
      for (const button of buttons) {
        await connection.execute(buttonSql, [menuResult.insertId, name, button.code])
      }
    }

    await connection.commit()
    return menuResult
  } catch (error) {
    await connection.rollback()
    throw error
  } finally {
    connection.release()
  }
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

const updateMenuWithButtons = async (id, payload, routeName, buttons = []) => {
  const connection = await getConnection()

  try {
    await connection.beginTransaction()

    const fields = []
    const params = []
    for (const [key, value] of Object.entries(payload)) {
      fields.push(`${key} = ?`)
      params.push(value)
    }

    if (fields.length) {
      const sql = `update RouteAuth set ${fields.join(', ')} where id = ?`
      await connection.execute(sql, [...params, id])
    }

    await connection.execute('delete from ButtonAuth where routeId = ?', [id])
    if (buttons.length) {
      const buttonSql = 'insert into ButtonAuth (routeId, routeName, buttonName) values (?, ?, ?)'
      for (const button of buttons) {
        await connection.execute(buttonSql, [id, routeName, button.code])
      }
    }

    await connection.commit()
    return { affectedRows: 1 }
  } catch (error) {
    await connection.rollback()
    throw error
  } finally {
    connection.release()
  }
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

export default {
  listMenus,
  listPageComponents,
  findMenuById,
  findMenuByPath,
  findMenuByName,
  createMenu,
  createMenuWithButtons,
  listButtonsByRouteIds,
  syncButtonsFromMenus,
  replaceButtons,
  updateMenu,
  updateMenuWithButtons,
  countChildren,
  deleteMenu
}
