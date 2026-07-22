import { getConnection, query } from '../../utils/db.js'

const buildRoleCode = (roleName) => {
  const normalized = String(roleName || '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '')

  return normalized || `role_${Date.now()}`
}

const ROLE_LIST_COLUMNS = `
  r.roleId,
  r.roleCode,
  r.roleName,
  r.description,
  r.status,
  r.isSystem,
  count(distinct ur.userId) as userCount
`

const buildRoleFilters = ({ roleName, roleCode, status } = {}) => {
  const where = []
  const params = []

  if (roleName) {
    where.push('r.roleName like ?')
    params.push(`%${roleName}%`)
  }

  if (roleCode) {
    where.push('r.roleCode like ?')
    params.push(`%${roleCode}%`)
  }

  if (status !== undefined && status !== null && status !== '') {
    where.push('r.status = ?')
    params.push(Number(status))
  }

  return {
    whereSql: where.length > 0 ? ` where ${where.join(' and ')}` : '',
    params
  }
}

/**
 * 分页查询角色列表，并统计每个角色的用户数。
 * @param {{page?:number,pageSize?:number,roleName?:string,roleCode?:string,status?:number|string}} options
 * @returns {Promise<Array<any>>}
 */
const listRoles = async ({ page = 1, pageSize = 10, roleName = '', roleCode = '', status } = {}) => {
  const { whereSql, params } = buildRoleFilters({ roleName, roleCode, status })
  const offset = (Number(page) - 1) * Number(pageSize)
  const sql = `
    select
      ${ROLE_LIST_COLUMNS}
    from Roles r
    left join UserRole ur on ur.roleId = r.roleId
    ${whereSql}
    group by r.roleId, r.roleCode, r.roleName, r.description, r.status, r.isSystem
    order by r.roleId asc
    limit ? offset ?
  `

  return query(sql, [...params, Number(pageSize), offset])
}

/**
 * 查询全部角色。
 * @returns {Promise<Array<any>>}
 */
const listAllRoles = async () => {
  const sql = `
    select
      roleId,
      roleCode,
      roleName,
      description,
      status,
      isSystem
    from Roles
    order by roleId asc
  `

  return query(sql)
}

/**
 * 统计角色总数。
 * @param {{roleName?:string,roleCode?:string,status?:number|string}} options
 * @returns {Promise<number>}
 */
const countRoles = async ({ roleName = '', roleCode = '', status } = {}) => {
  const { whereSql, params } = buildRoleFilters({ roleName, roleCode, status })
  const sql = `select count(*) as total from Roles r${whereSql}`
  const rows = await query(sql, params)
  return rows[0]?.total || 0
}

/**
 * 根据角色 ID 查询角色详情。
 * @param {number} roleId
 * @returns {Promise<any | null>}
 */
const findRoleById = async (roleId) => {
  const sql = 'select roleId, roleCode, roleName, description, status, isSystem from Roles where roleId = ? limit 1'
  const rows = await query(sql, [roleId])
  return rows[0] || null
}

/**
 * 根据角色名或角色编码查询角色（用于唯一性校验）。
 * @param {string} roleName
 * @param {string} [roleCode]
 * @returns {Promise<any | null>}
 */
const findRoleByName = async (roleName, roleCode = roleName) => {
  const sql = 'select roleId, roleCode, roleName from Roles where roleName = ? or roleCode = ? limit 1'
  const rows = await query(sql, [roleName, roleCode])
  return rows[0] || null
}

/**
 * 查询角色绑定的路由 ID 集合。
 * @param {number} roleId
 * @returns {Promise<number[]>}
 */
const getRouteIdsByRoleId = async (roleId) => {
  const sql = 'select routeId from RoleRoute where roleId = ? order by routeId asc'
  const rows = await query(sql, [roleId])
  return rows.map((item) => item.routeId)
}

/**
 * 创建角色并绑定路由（事务）。
 * @param {{roleName:string,roleCode:string,description:string,status:number,routeIds:number[]}} payload
 * @returns {Promise<{roleId:number, affectedRows:number}>}
 */
const createRoleWithRoutes = async ({ roleName, roleCode, description, status, routeIds }) => {
  const connection = await getConnection()
  try {
    await connection.beginTransaction()
    const [roleResult] = await connection.execute(
      'insert into Roles (roleCode, roleName, description, status) values (?, ?, ?, ?)',
      [roleCode || buildRoleCode(roleName), roleName, description, Number(status ?? 1)]
    )
    const roleId = roleResult.insertId

    if (routeIds.length > 0) {
      const valuesSql = routeIds.map(() => '(?, ?)').join(', ')
      const values = routeIds.flatMap((routeId) => [roleId, routeId])
      await connection.execute(`insert into RoleRoute (roleId, routeId) values ${valuesSql}`, values)
    }

    await connection.commit()
    return { roleId, affectedRows: roleResult.affectedRows }
  } catch (error) {
    await connection.rollback()
    throw error
  } finally {
    connection.release()
  }
}

/**
 * 更新角色信息并重建角色路由关系（事务）。
 * @param {{roleId:number,roleName:string,roleCode:string,description:string,status:number,routeIds:number[]}} payload
 * @returns {Promise<{affectedRows:number}>}
 */
const updateRoleWithRoutes = async ({ roleId, roleName, roleCode, description, status, routeIds }) => {
  const connection = await getConnection()
  try {
    await connection.beginTransaction()
    await connection.execute(
      'update Roles set roleName = ?, roleCode = ?, description = ?, status = ? where roleId = ?',
      [roleName, roleCode || buildRoleCode(roleName), description, Number(status ?? 1), roleId]
    )
    await connection.execute('delete from RoleRoute where roleId = ?', [roleId])

    if (routeIds.length > 0) {
      const valuesSql = routeIds.map(() => '(?, ?)').join(', ')
      const values = routeIds.flatMap((routeId) => [roleId, routeId])
      await connection.execute(`insert into RoleRoute (roleId, routeId) values ${valuesSql}`, values)
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
 * 删除角色并清理角色路由关系（事务）。
 * @param {number} roleId
 * @returns {Promise<any>}
 */
const deleteRole = async (roleId) => {
  const connection = await getConnection()
  try {
    await connection.beginTransaction()
    await connection.execute('delete from RoleRoute where roleId = ?', [roleId])
    await connection.execute('delete from RoleButton where roleId = ?', [roleId])
    const [result] = await connection.execute('delete from Roles where roleId = ?', [roleId])
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
 * 统计角色下绑定的用户数量。
 * @param {number} roleId
 * @returns {Promise<number>}
 */
const countUsersByRoleId = async (roleId) => {
  const sql = 'select count(*) as total from UserRole where roleId = ?'
  const rows = await query(sql, [roleId])
  return rows[0]?.total || 0
}

export default {
  listRoles,
  listAllRoles,
  countRoles,
  findRoleById,
  findRoleByName,
  getRouteIdsByRoleId,
  createRoleWithRoutes,
  updateRoleWithRoutes,
  deleteRole,
  countUsersByRoleId
}
