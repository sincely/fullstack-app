import { getConnection, query } from '../utils/db.js'

/**
 * 菜单查询的公共字段（适配新表结构）。
 */
const MENU_COLUMNS = `
  ra.id, ra.parentId, ra.menuType, ra.menuName, ra.routeName, ra.routePath,
  ra.component, ra.redirect, ra.orderNum, ra.icon, ra.iconType, ra.i18nKey,
  ra.hideInMenu, ra.activeMenu, ra.multiTab, ra.keepAlive,
  ra.status, ra.createBy, ra.createTime, ra.updateBy, ra.updateTime
`

const normalizeRoleIds = (roleIds) => {
  const ids = Array.isArray(roleIds) ? roleIds : [roleIds]
  return [...new Set(ids.map((id) => Number(id)).filter(Boolean))]
}

const buildInClause = (values) => values.map(() => '?').join(', ')

/**
 * 根据角色 ID 查询可访问菜单列表。
 * @param {number} roleId
 * @returns {Promise<Array<any>>}
 */
const findMenusByRoleId = async (roleId) => {
  const roleIds = normalizeRoleIds(roleId)
  if (roleIds.length === 0) {
    return []
  }

  const sql = `
    select distinct
      ${MENU_COLUMNS}
    from RoleRoute rr
    inner join RouteAuth ra on ra.id = rr.routeId
    where rr.roleId in (${buildInClause(roleIds)})
    order by coalesce(ra.parentId, 0), ra.orderNum asc, ra.id asc
  `

  return query(sql, roleIds)
}

/**
 * 根据角色 ID 查询可用按钮权限列表。
 * @param {number} roleId
 * @returns {Promise<Array<any>>}
 */
const findButtonsByRoleId = async (roleId) => {
  const roleIds = normalizeRoleIds(roleId)
  if (roleIds.length === 0) {
    return []
  }

  const sql = `
    select distinct
      ba.buttonId,
      ba.routeId,
      ba.routeName,
      ba.buttonName,
      ba.buttonLabel
    from RoleButton rb
    inner join ButtonAuth ba on ba.buttonId = rb.buttonId
    where rb.roleId in (${buildInClause(roleIds)})
    order by ba.routeId asc, ba.buttonId asc
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
      buttonId,
      routeId,
      routeName,
      buttonName
    from ButtonAuth
    order by routeId asc, buttonId asc
  `
  return query(sql)
}

const replaceRoleButtons = async (roleId, buttonIds) => {
  const safeButtonIds = [...new Set((buttonIds || []).map((id) => Number(id)).filter(Boolean))]
  const connection = await getConnection()

  try {
    await connection.beginTransaction()
    await connection.execute('delete from RoleButton where roleId = ?', [roleId])

    if (safeButtonIds.length > 0) {
      const valuesSql = safeButtonIds.map(() => '(?, ?)').join(', ')
      const values = safeButtonIds.flatMap((buttonId) => [roleId, buttonId])
      await connection.execute(`insert into RoleButton (roleId, buttonId) values ${valuesSql}`, values)
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
