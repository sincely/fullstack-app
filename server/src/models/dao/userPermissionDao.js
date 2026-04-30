import { query } from '#utils/db.js'
import { getConnection } from '#utils/db.js'

/**
 * 根据角色 ID 查询可访问菜单列表。
 * @param {number} roleId
 * @returns {Promise<Array<any>>}
 */
const findMenusByRoleId = async (roleId) => {
  const sql = `
    select distinct
      ra.id,
      ra.path,
      ra.name,
      ra.component,
      ra.redirect,
      ra.meta,
      ra.parent_id
    from RoleRoute rr
    inner join RouteAuth ra on ra.id = rr.routeId
    where rr.roleId = ?
    order by coalesce(ra.parent_id, 0), ra.id
  `

  return query(sql, [roleId])
}

/**
 * 根据角色 ID 查询可用按钮权限列表。
 * @param {number} roleId
 * @returns {Promise<Array<any>>}
 */
const findButtonsByRoleId = async (roleId) => {
  await ensureRoleButtonAuthTable()

  const sql = `
    select distinct
      ba.buttonId,
      ba.routeId,
      ba.routeName,
      ba.buttonName
    from ButtonAuth ba
    inner join RoleRoute rr on rr.routeId = ba.routeId
    left join RoleButtonAuth rba on rba.roleId = rr.roleId and rba.buttonId = ba.buttonId
    where rr.roleId = ?
      and (rba.buttonId is not null or not exists (select 1 from RoleButtonAuth rb where rb.roleId = rr.roleId))
    order by ba.routeId asc, ba.buttonId asc
  `

  return query(sql, [roleId])
}

const ensureRoleButtonAuthTable = async () => {
  const sql = `
    create table if not exists RoleButtonAuth (
      id int not null auto_increment,
      roleId int not null,
      buttonId int not null,
      primary key (id),
      unique key uniq_role_button (roleId, buttonId),
      key idx_roleId (roleId),
      key idx_buttonId (buttonId)
    ) engine=InnoDB default charset=utf8mb3
  `

  await query(sql)
}

const listAllButtons = async () => {
  const sql = `
    select buttonId, routeId, routeName, buttonName
    from ButtonAuth
    order by routeId asc, buttonId asc
  `

  return query(sql)
}

const getButtonIdsByRoleId = async (roleId) => {
  await ensureRoleButtonAuthTable()
  const sql = 'select buttonId from RoleButtonAuth where roleId = ? order by buttonId asc'
  const rows = await query(sql, [roleId])
  return rows.map((item) => item.buttonId)
}

const replaceRoleButtons = async ({ roleId, buttonIds }) => {
  await ensureRoleButtonAuthTable()
  const connection = await getConnection()

  try {
    await connection.beginTransaction()
    await connection.execute('delete from RoleButtonAuth where roleId = ?', [roleId])

    if (buttonIds.length) {
      const valuesSql = buttonIds.map(() => '(?, ?)').join(', ')
      const values = buttonIds.flatMap((buttonId) => [roleId, buttonId])
      await connection.execute(`insert into RoleButtonAuth (roleId, buttonId) values ${valuesSql}`, values)
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
  listAllButtons,
  getButtonIdsByRoleId,
  replaceRoleButtons,
  ensureRoleButtonAuthTable
}
