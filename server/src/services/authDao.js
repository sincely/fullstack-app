import { getConnection, query } from '../utils/db.js'

const ADMIN_USER_ROLE_AGGREGATE_SQL = `
  select
    ur.userId,
    min(ur.roleId) as roleId,
    group_concat(distinct ur.roleId order by ur.roleId asc) as roleIds,
    group_concat(distinct r.roleCode order by ur.roleId asc) as roleCodes,
    group_concat(distinct r.roleName order by ur.roleId asc) as roleNames
  from UserRole ur
  inner join Roles r on r.roleId = ur.roleId
  group by ur.userId
`

// 管理员用户信息基础查询片段（含主角色与多角色聚合信息）
const getAdminUserBaseSql = `
  select
    u.id,
    u.username,
    u.email,
    u.status,
    u.avatar,
    roleAgg.roleId,
    roleAgg.roleIds,
    roleAgg.roleCodes,
    roleAgg.roleNames,
    u.password,
    r.roleCode,
    r.roleName,
    r.description as roleDescription
  from Users u
  left join (${ADMIN_USER_ROLE_AGGREGATE_SQL}) roleAgg on roleAgg.userId = u.id
  left join Roles r on r.roleId = roleAgg.roleId
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
 * 更新用户的 currentRefreshToken。
 * @param {number} userId
 * @param {string|null} refreshToken
 * @returns {Promise<void>}
 */
const updateUserRefreshToken = async (userId, refreshToken) => {
  const sql = 'update Users set currentRefreshToken = ? where id = ?'
  await query(sql, [refreshToken, userId])
}

/**
 * 根据用户 ID 查询当前 Refresh Token。
 * @param {number} userId
 * @returns {Promise<string|null>}
 */
const getUserRefreshToken = async (userId) => {
  const sql = 'select currentRefreshToken from Users where id = ? limit 1'
  const rows = await query(sql, [userId])
  return rows[0]?.currentRefreshToken || null
}

/**
 * 根据角色名查询角色信息。
 * @param {string} roleName
 * @returns {Promise<any | null>}
 */
const findRoleByName = async (roleName) => {
  const sql = 'select roleId, roleCode, roleName, description from Roles where roleName = ? or roleCode = ? limit 1'
  const rows = await query(sql, [roleName, roleName])
  return rows[0] || null
}

/**
 * 生成注册场景用的 idCard 占位值（避免为空）。
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
 * @param {{username:string,email:string,passwordHash:string,roleId:number}} payload
 * @returns {Promise<any>}
 */
const createAdminUser = async ({ username, email, passwordHash, roleId }) => {
  const connection = await getConnection()
  try {
    await connection.beginTransaction()
    const [userResult] = await connection.execute(
      `
        insert into Users (username, gender, age, idCard, email, address, status, avatar, password)
        values (?, 'other', null, ?, ?, null, 1, null, ?)
      `,
      [username, createRegisterIdCard(), email, passwordHash]
    )

    await connection.execute('insert into UserRole (userId, roleId) values (?, ?)', [userResult.insertId, roleId])
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
