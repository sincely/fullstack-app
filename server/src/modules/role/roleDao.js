import { getConnection, query } from '../../db/connection.js'

const buildRoleCode = (role_name) => {
  const normalized = String(role_name || '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '')

  return normalized || `role_${Date.now()}`
}

const ROLE_LIST_COLUMNS = `
  r.role_id,
  r.role_code,
  r.role_name,
  r.description,
  r.status,
  r.is_system,
  count(distinct ur.user_id) as userCount
`

const buildRoleFilters = ({ role_name, role_code, status } = {}) => {
  const where = []
  const params = []

  if (role_name) {
    where.push('r.role_name like ?')
    params.push(`%${role_name}%`)
  }

  if (role_code) {
    where.push('r.role_code like ?')
    params.push(`%${role_code}%`)
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
 * @param {{page?:number,pageSize?:number,role_name?:string,role_code?:string,status?:number|string}} options
 * @returns {Promise<Array<any>>}
 */
const listRoles = async ({ page = 1, pageSize = 10, role_name = '', role_code = '', status } = {}) => {
  const { whereSql, params } = buildRoleFilters({ role_name, role_code, status })
  const offset = (Number(page) - 1) * Number(pageSize)
  const sql = `
    select
      ${ROLE_LIST_COLUMNS}
    from Roles r
    left join UserRole ur on ur.role_id = r.role_id
    ${whereSql}
    group by r.role_id, r.role_code, r.role_name, r.description, r.status, r.is_system
    order by r.role_id asc
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
      role_id,
      role_code,
      role_name,
      description,
      status,
      is_system
    from Roles
    order by role_id asc
  `

  return query(sql)
}

/**
 * 统计角色总数。
 * @param {{role_name?:string,role_code?:string,status?:number|string}} options
 * @returns {Promise<number>}
 */
const countRoles = async ({ role_name = '', role_code = '', status } = {}) => {
  const { whereSql, params } = buildRoleFilters({ role_name, role_code, status })
  const sql = `select count(*) as total from Roles r${whereSql}`
  const rows = await query(sql, params)
  return rows[0]?.total || 0
}

/**
 * 根据角色 ID 查询角色详情。
 * @param {number} role_id
 * @returns {Promise<any | null>}
 */
const findRoleById = async (role_id) => {
  const sql =
    'select role_id, role_code, role_name, description, status, is_system from Roles where role_id = ? limit 1'
  const rows = await query(sql, [role_id])
  return rows[0] || null
}

/**
 * 根据角色 ID 集合批量查询角色（用于多角色绑定校验）。
 * @param {number[]} role_ids
 * @returns {Promise<any[]>}
 */
const findRolesByIds = async (role_ids) => {
  if (!Array.isArray(role_ids) || role_ids.length === 0) {
    return []
  }

  const placeholders = role_ids.map(() => '?').join(', ')
  const sql = `select role_id from Roles where role_id in (${placeholders})`
  return query(sql, role_ids)
}

/**
 * 根据角色名或角色编码查询角色（用于唯一性校验）。
 * @param {string} role_name
 * @param {string} [role_code]
 * @returns {Promise<any | null>}
 */
const findRoleByName = async (role_name, role_code = role_name) => {
  const sql = 'select role_id, role_code, role_name from Roles where role_name = ? or role_code = ? limit 1'
  const rows = await query(sql, [role_name, role_code])
  return rows[0] || null
}

/**
 * 查询角色绑定的路由 ID 集合。
 * @param {number} role_id
 * @returns {Promise<number[]>}
 */
const getRouteIdsByRoleId = async (role_id) => {
  const sql = 'select route_id from RoleRoute where role_id = ? order by route_id asc'
  const rows = await query(sql, [role_id])
  return rows.map((item) => item.route_id)
}

/**
 * 创建角色（仅 Roles 表，不涉及路由绑定）。
 * @param {{role_name:string,role_code:string,description:string,status:number}} payload
 * @returns {Promise<{role_id:number, affectedRows:number}>}
 */
const createRole = async ({ role_name, role_code, description, status }) => {
  const result = await query(
    'insert into Roles (role_code, role_name, description, status) values (?, ?, ?, ?)',
    [role_code || buildRoleCode(role_name), role_name, description, Number(status ?? 1)]
  )
  return { role_id: result.insertId, affectedRows: result.affectedRows }
}

/**
 * 更新角色（仅 Roles 表，不涉及路由绑定）。
 * @param {number} role_id
 * @param {{role_name:string,role_code:string,description:string,status:number}} payload
 * @returns {Promise<{affectedRows:number}>}
 */
const updateRole = async (role_id, { role_name, role_code, description, status }) => {
  const result = await query(
    'update Roles set role_name = ?, role_code = ?, description = ?, status = ? where role_id = ?',
    [role_name, role_code || buildRoleCode(role_name), description, Number(status ?? 1), role_id]
  )
  return { affectedRows: result.affectedRows }
}

/**
 * 删除角色并清理角色路由关系（事务）。
 * @param {number} role_id
 * @returns {Promise<any>}
 */
const deleteRole = async (role_id) => {
  const connection = await getConnection()
  try {
    await connection.beginTransaction()
    await connection.execute('delete from RoleRoute where role_id = ?', [role_id])
    await connection.execute('delete from RoleButton where role_id = ?', [role_id])
    const [result] = await connection.execute('delete from Roles where role_id = ?', [role_id])
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
 * @param {number} role_id
 * @returns {Promise<number>}
 */
const countUsersByRoleId = async (role_id) => {
  const sql = 'select count(*) as total from UserRole where role_id = ?'
  const rows = await query(sql, [role_id])
  return rows[0]?.total || 0
}

export default {
  listRoles,
  listAllRoles,
  countRoles,
  findRoleById,
  findRolesByIds,
  findRoleByName,
  getRouteIdsByRoleId,
  createRole,
  updateRole,
  deleteRole,
  countUsersByRoleId
}
