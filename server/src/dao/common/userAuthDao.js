import { query } from '#utils/db.js'

// 管理员用户信息基础查询片段（含角色信息）。
// 以当前真实 Users 表结构为准，不再查询已移除字段。
const getAdminUserBaseSql = `
  select
    u.id,
    u.username,
    u.email,
    u.status,
    u.roleId,
    u.password,
    r.roleName,
    r.description as roleDescription
  from Users u
  left join Roles r on r.roleId = u.roleId
`

/**
 * 根据用户名查询管理员用户。
 * @param {string} username
 * @returns {Promise<any | null>}
 */
const findAdminUserByUsername = async (username) => {
  const sql = `${getAdminUserBaseSql} where u.username = ? limit 1`
  const rows = await query(sql, [username])
  return rows[0] || null
}

/**
 * 根据邮箱查询管理员用户。
 * @param {string} email
 * @returns {Promise<any | null>}
 */
const findAdminUserByEmail = async (email) => {
  const sql = `${getAdminUserBaseSql} where u.email = ? limit 1`
  const rows = await query(sql, [email])
  return rows[0] || null
}

/**
 * 根据用户 ID 查询管理员用户。
 * @param {number} userId
 * @returns {Promise<any | null>}
 */
const findAdminUserById = async (userId) => {
  const sql = `${getAdminUserBaseSql} where u.id = ? limit 1`
  const rows = await query(sql, [userId])
  return rows[0] || null
}

/**
 * 根据角色名查询角色信息。
 * @param {string} roleName
 * @returns {Promise<any | null>}
 */
const findRoleByName = async (roleName) => {
  const sql = 'select roleId, roleName, description from Roles where roleName = ? limit 1'
  const rows = await query(sql, [roleName])
  return rows[0] || null
}

/**
 * 创建管理员用户记录。
 * @param {{username:string,email:string,passwordHash:string,roleId:number}} payload
 * @returns {Promise<any>}
 */
const createAdminUser = async ({ username, email, passwordHash, roleId }) => {
  const sql = `
    insert into Users (username, gender, email, status, roleId, password, phone, nickName)
    values (?, 'other', ?, 'active', ?, ?, null, ?)
  `

  return query(sql, [username, email, roleId, passwordHash, username])
}

export default {
  findAdminUserByUsername,
  findAdminUserByEmail,
  findAdminUserById,
  findRoleByName,
  createAdminUser
}
