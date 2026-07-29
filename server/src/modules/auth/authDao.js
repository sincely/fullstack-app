import { getConnection, query } from '../../db/connection.js'

const ADMIN_USER_ROLE_AGGREGATE_SQL = `
  select
    ur.user_id,
    min(ur.role_id) as role_id,
    group_concat(distinct ur.role_id order by ur.role_id asc) as roleIds,
    group_concat(distinct r.role_code order by ur.role_id asc) as roleCodes,
    group_concat(distinct r.role_name order by ur.role_id asc) as roleNames
  from UserRole ur
  inner join Roles r on r.role_id = ur.role_id
  group by ur.user_id
`

// 管理员用户信息基础查询片段（含主角色与多角色聚合信息）
const getAdminUserBaseSql = `
  select
    u.id,
    u.username,
    u.email,
    u.status,
    u.avatar,
    roleAgg.role_id,
    roleAgg.roleIds,
    roleAgg.roleCodes,
    roleAgg.roleNames,
    u.password,
    r.role_code,
    r.role_name,
    r.description as roleDescription
  from Users u
  left join (${ADMIN_USER_ROLE_AGGREGATE_SQL}) roleAgg on roleAgg.user_id = u.id
  left join Roles r on r.role_id = roleAgg.role_id
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
 * @param {number} user_id
 * @returns {Promise<any | null>}
 */
const findAdminUserById = async (user_id) => {
  const sql = `${getAdminUserBaseSql} where u.id = ? limit 1`
  const rows = await query(sql, [user_id])
  return rows[0] || null
}

/**
 * 更新用户的 current_refresh_token。
 * @param {number} user_id
 * @param {string|null} refreshToken
 * @returns {Promise<void>}
 */
const updateUserRefreshToken = async (user_id, refreshToken) => {
  const sql = 'update Users set current_refresh_token = ? where id = ?'
  await query(sql, [refreshToken, user_id])
}

/**
 * 根据用户 ID 查询当前 Refresh Token。
 * @param {number} user_id
 * @returns {Promise<string|null>}
 */
const getUserRefreshToken = async (user_id) => {
  const sql = 'select current_refresh_token from Users where id = ? limit 1'
  const rows = await query(sql, [user_id])
  return rows[0]?.current_refresh_token || null
}

/**
 * 根据角色名查询角色信息。
 * @param {string} role_name
 * @returns {Promise<any | null>}
 */
const findRoleByName = async (role_name) => {
  const sql =
    'select role_id, role_code, role_name, description from Roles where role_name = ? or role_code = ? limit 1'
  const rows = await query(sql, [role_name, role_name])
  return rows[0] || null
}

/**
 * 生成注册场景用的 id_card 占位值（避免为空）。
 * @returns {string}
 */
const createRegisterIdCard = () => {
  const timestamp = Date.now().toString().slice(-13)
  const random = Math.floor(Math.random() * 10000)
    .toString()
    .padStart(4, '0')
  return `9${timestamp}${random}`
}

/**
 * 创建管理员用户记录。
 * @param {{username:string,email:string,passwordHash:string,role_id:number}} payload
 * @returns {Promise<any>}
 */
const createAdminUser = async ({ username, email, passwordHash, role_id }) => {
  const connection = await getConnection()
  try {
    await connection.beginTransaction()
    const [userResult] = await connection.execute(
      `
        insert into Users (username, gender, age, id_card, email, address, status, avatar, password)
        values (?, 'other', null, ?, ?, null, 1, null, ?)
      `,
      [username, createRegisterIdCard(), email, passwordHash]
    )

    await connection.execute('insert into UserRole (user_id, role_id) values (?, ?)', [userResult.insertId, role_id])
    await connection.commit()
    return userResult
  } catch (error) {
    await connection.rollback()
    throw error
  } finally {
    connection.release()
  }
}

export default {
  findAdminUserByUsername,
  findAdminUserByEmail,
  findAdminUserById,
  updateUserRefreshToken,
  getUserRefreshToken,
  findRoleByName,
  createAdminUser
}
