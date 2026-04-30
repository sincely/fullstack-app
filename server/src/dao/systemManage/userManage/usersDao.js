import { query } from '#utils/db.js'
/**
 * 用户登录 - 根据用户名查找用户并验证密码
 * @param {string} username - 用户名
 * @param {string} password - 明文密码
 * @returns {Promise<Array>} - 匹配的用户数组
 */
const login = async (username, password) => {
  const sql = 'select * from users where userName = ? and password = ?'
  return await query(sql, [username, password])
}

/**
 * 查询用户名是否存在
 * @param {string} username - 用户名
 * @returns {Promise<Array>} - 用户数组
 */
const findUserName = async (username) => {
  const sql = 'select * from users where userName = ?'
  return await query(sql, [username])
}

/**
 * 用户注册 - 创建新用户（密码加密存储）
 * @param {string} username - 用户名
 * @param {string} password - 明文密码
 * @returns {Promise<Object>} - 包含 affectedRows 的结果对象
 */
const register = async (username, password) => {
  const sql = 'select * from users where userName = ?'
  return await query(sql, [username])
}

const buildUserFilters = ({ keyword, status, roleId }) => {
  const where = []
  const params = []

  if (keyword) {
    where.push('(u.username like ? or u.email like ?)')
    params.push(`%${keyword}%`, `%${keyword}%`)
  }

  if (status) {
    where.push('u.status = ?')
    params.push(status)
  }

  if (roleId) {
    where.push('u.roleId = ?')
    params.push(roleId)
  }

  return {
    whereSql: where.length > 0 ? `where ${where.join(' and ')}` : '',
    params
  }
}

const listUsers = async ({ keyword, status, roleId, page, pageSize }) => {
  const { whereSql, params } = buildUserFilters({ keyword, status, roleId })
  const offset = (page - 1) * pageSize
  const sql = `
    select
      u.id,
      u.username,
      u.gender,
      u.email,
      u.createTime,
      u.status,

      r.roleName,
      u.phone,
      u.nickName
    from Users u
    left join Roles r on r.roleId = u.roleId
    ${whereSql}
    order by u.createTime desc
    limit ?, ?
  `

  return query(sql, [...params, offset, pageSize])
}

const listAllUsersWithRoles = () => {
  const sql = `
    select
      u.id,
      u.username,
      u.gender,
      u.email,
      u.createTime,
      u.status,
      u.roleId,
      r.roleName,
      u.phone,
      u.nickName
    from Users u
    left join Roles r on r.roleId = u.roleId
    order by u.createTime desc
  `

  return query(sql)
}

const countUsers = async ({ keyword, status, roleId }) => {
  const { whereSql, params } = buildUserFilters({ keyword, status, roleId })
  const sql = `
    select count(*) as total
    from Users u
    ${whereSql}
  `

  const rows = await query(sql, params)
  return rows[0]?.total || 0
}

const findUserById = async (id) => {
  const sql = `
    select
      u.id,
      u.username,
      u.gender,
      u.email,
      u.createTime,
      u.status,
      u.roleId,
      u.password,
      r.roleName,
      u.phone,
      u.nickName
    from Users u
    left join Roles r on r.roleId = u.roleId
    where u.id = ?
    limit 1
  `
  const rows = await query(sql, [id])
  return rows[0] || null
}

const findUserBaseById = async (id) => {
  const sql = 'select id from Users where id = ? limit 1'
  const rows = await query(sql, [id])
  return rows[0] || null
}

const findUserByUsername = async (username) => {
  const sql = 'select id, username from Users where username = ? limit 1'
  const rows = await query(sql, [username])
  return rows[0] || null
}

const findUserByEmail = async (email) => {
  const sql = 'select id, email from Users where email = ? limit 1'
  const rows = await query(sql, [email])
  return rows[0] || null
}

const createUser = async ({ username, gender, phone, nickName, email, status, roleId, passwordHash }) => {
  const sql = `
    insert into Users (username, gender, phone, nickName, email, status, roleId, password)
    values (?, ?, ?, ?, ?, ?, ?, ?)
  `

  return query(sql, [username, gender, phone, nickName, email, status, roleId, passwordHash])
}

const updateUser = async (id, payload) => {
  const fields = []
  const params = []

  for (const [key, value] of Object.entries(payload)) {
    fields.push(`${key} = ?`)
    params.push(value)
  }

  if (fields.length === 0) {
    return { affectedRows: 0 }
  }

  const sql = `update Users set ${fields.join(', ')} where id = ?`
  return query(sql, [...params, id])
}

const deleteUser = async (id) => {
  const sql = 'delete from Users where id = ?'
  return query(sql, [id])
}

const listRoleOptions = async () => {
  const sql = 'select roleId, roleName from Roles order by roleId asc'
  return query(sql)
}

export default {
  login,
  findUserName,
  register,
  listUsers,
  listAllUsersWithRoles,
  countUsers,
  findUserById,
  findUserBaseById,
  findUserByUsername,
  findUserByEmail,
  createUser,
  updateUser,
  deleteUser,
  listRoleOptions
}
