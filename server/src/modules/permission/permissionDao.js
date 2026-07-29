import { getConnection, query } from '../../db/connection.js'

/**
 * 菜单查询的公共字段（适配新表结构）。
 */
const MENU_COLUMNS = `
  ra.id, ra.parent_id, ra.menu_type, ra.menu_name, ra.route_name, ra.route_path,
  ra.component, ra.redirect, ra.order_num, ra.icon, ra.icon_type,
  ra.hide_in_menu, ra.active_menu, ra.multi_tab, ra.keep_alive,
  ra.status, ra.create_by, ra.create_time, ra.update_by, ra.update_time
`

const normalizeRoleIds = (roleIds) => {
  const ids = Array.isArray(roleIds) ? roleIds : [roleIds]
  return [...new Set(ids.map((id) => Number(id)).filter(Boolean))]
}

const buildInClause = (values) => values.map(() => '?').join(', ')

/**
 * 根据角色 ID 查询可访问菜单列表。
 * @param {number} role_id
 * @returns {Promise<Array<any>>}
 */
const findMenusByRoleId = async (role_id) => {
  const roleIds = normalizeRoleIds(role_id)
  if (roleIds.length === 0) {
    return []
  }

  const sql = `
    select distinct
      ${MENU_COLUMNS}
    from RoleRoute rr
    inner join RouteAuth ra on ra.id = rr.route_id
    where rr.role_id in (${buildInClause(roleIds)})
    order by coalesce(ra.parent_id, 0), ra.order_num asc, ra.id asc
  `

  return query(sql, roleIds)
}

/**
 * 根据角色 ID 查询可用按钮权限列表。
 * @param {number} role_id
 * @returns {Promise<Array<any>>}
 */
const findButtonsByRoleId = async (role_id) => {
  const roleIds = normalizeRoleIds(role_id)
  if (roleIds.length === 0) {
    return []
  }

  const sql = `
    select distinct
      ba.button_id,
      ba.route_id,
      ba.route_name,
      ba.button_name,
      ba.button_label
    from RoleButton rb
    inner join ButtonAuth ba on ba.button_id = rb.button_id
    where rb.role_id in (${buildInClause(roleIds)})
    order by ba.route_id asc, ba.button_id asc
  `

  return query(sql, roleIds)
}

/**
 * 查询全部按钮权限。
 * @returns {Promise<Array<any>>}
 */
const findAllButtons = async () => {
  const sql = `
    select
      button_id,
      route_id,
      route_name,
      button_name
    from ButtonAuth
    order by route_id asc, button_id asc
  `
  return query(sql)
}

const replaceRoleButtons = async (role_id, buttonIds) => {
  const safeButtonIds = [...new Set((buttonIds || []).map((id) => Number(id)).filter(Boolean))]
  const connection = await getConnection()

  try {
    await connection.beginTransaction()
    await connection.execute('delete from RoleButton where role_id = ?', [role_id])

    if (safeButtonIds.length > 0) {
      const valuesSql = safeButtonIds.map(() => '(?, ?)').join(', ')
      const values = safeButtonIds.flatMap((button_id) => [role_id, button_id])
      await connection.execute(`insert into RoleButton (role_id, button_id) values ${valuesSql}`, values)
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

export default {
  findMenusByRoleId,
  findButtonsByRoleId,
  findAllButtons,
  replaceRoleButtons
}
