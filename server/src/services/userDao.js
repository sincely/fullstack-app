import { getConnection, query } from '../utils/db.js'

/**
 * 用户查询公共字段（适配新表结构，多角色通过 UserRole 关联）。
 */
const USER_COLUMNS = `
  u.id, u.username, u.nickName, u.gender, u.age, u.phone,
  u.idCard, u.email, u.address, u.status, u.avatar,
  u.createBy, u.createTime, u.updateBy, u.updateTime
`

const USER_ROLE_AGGREGATE_SQL = `
  select
    ur.userId,
    min(ur.roleId) as roleId,
    group_concat(distinct ur.roleId order by ur.roleId asc) as roleIds,
    group_concat(distinct r.roleName order by r.roleName asc) as roleNames
  from UserRole ur
  left join Roles r on r.roleId = ur.roleId
  group by ur.userId
`

const buildUserFilters = ({ keyword, status, gender }) => {
  const where = []
  const params = []

  if (keyword) {
    where.push('(u.username like ? or u.email like ? or u.nickName like ? or u.phone like ?)')
    params.push(`%${keyword}%`, `%${keyword}%`, `%${keyword}%`, `%${keyword}%`)
  }

  if (status) {
    where.push('u.status = ?')
    params.push(Number(status))
  }

  if (gender) {
    where.push('u.gender = ?')
    params.push(gender)
  }

  return {
    whereSql: where.length > 0 ? `where ${where.join(' and ')}` : '',
    params
  }
}

/**
 * 查询用户列表（含角色信息）。
 * 多角色场景：通过 UserRole 关联获取 roleIds 数组。
 */
const listUsers = async ({ keyword, status, gender, roleId, page, pageSize }) => {
  const { whereSql, params } = buildUserFilters({ keyword, status, gender })
  const safePage = Number.parseInt(page, 10) || 1
  const safePageSize = Number.parseInt(pageSize, 10) || 10
  const offset = (safePage - 1) * safePageSize
  const extraWhere = []
  const queryParams = [...params]

  if (roleId) {
    extraWhere.push('exists (select 1 from UserRole urf where urf.userId = u.id and urf.roleId = ?)')
    queryParams.push(Number(roleId))
  }

  const finalWhereSql = [whereSql.replace(/^where\s+/i, ''), ...extraWhere]
    .filter(Boolean)
    .join(' and ')

  const sql = `
    select
      ${USER_COLUMNS},
      roleAgg.roleId,
      roleAgg.roleIds,
      roleAgg.roleNames
    from Users u
    left join (${USER_ROLE_AGGREGATE_SQL}) roleAgg on roleAgg.userId = u.id
    ${finalWhereSql ? `where ${finalWhereSql}` : ''}
    order by u.id desc
    limit ?, ?
  `

  return query(sql, [...queryParams, offset, safePageSize])
}

/**
 * 统计用户总数（支持按 roleId 过滤）。
 */
const countUsers = async ({ keyword, status, gender, roleId }) => {
  const { whereSql, params } = buildUserFilters({ keyword, status, gender })
  const extraWhere = []
  const queryParams = [...params]

  if (roleId) {
    extraWhere.push('exists (select 1 from UserRole ur where ur.userId = u.id and ur.roleId = ?)')
    queryParams.push(Number(roleId))
  }

  const finalWhereSql = [whereSql.replace(/^where\s+/i, ''), ...extraWhere]
    .filter(Boolean)
    .join(' and ')

  const sql = `
    select count(*) as total
    from Users u
    ${finalWhereSql ? `where ${finalWhereSql}` : ''}
  `
  const rows = await query(sql, queryParams)
  return rows[0]?.total || 0
}

/**
 * 根据用户 ID 查询单个用户（含角色列表）。
 */
const findUserById = async (id) => {
  const sql = `
    select
      ${USER_COLUMNS},
      u.password,
      roleAgg.roleId,
      roleAgg.roleIds,
      roleAgg.roleNames
    from Users u
    left join (${USER_ROLE_AGGREGATE_SQL}) roleAgg on roleAgg.userId = u.id
    where u.id = ?
    limit 1
  `
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

const findUserByIdCard = async (idCard) => {
  const sql = 'select id, idCard from Users where idCard = ? limit 1'
  const rows = await query(sql, [idCard])
  return rows[0] || null
}

/**
 * 创建用户并绑定角色（事务）。
 * @param {object} payload
 * @returns {Promise<any>}
 */
const createUser = async ({ username, nickName, gender, age, phone, idCard, email, address, status, avatar, roleIds, passwordHash }) => {
  const connection = await getConnection()
  try {
    await connection.beginTransaction()

    const [userResult] = await connection.execute(
      `insert into Users (username, nickName, gender, age, phone, idCard, email, address, status, avatar, password)
       values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [username, nickName ?? null, gender ?? 'other', age ?? null, phone ?? null, idCard, email, address ?? null, status ?? 1, avatar ?? null, passwordHash]
    )

    const userId = userResult.insertId

    if (roleIds && roleIds.length > 0) {
      const valuesSql = roleIds.map(() => '(?, ?)').join(', ')
      const values = roleIds.flatMap((roleId) => [userId, roleId])
      await connection.execute(`insert into UserRole (userId, roleId) values ${valuesSql}`, values)
    }

    await connection.commit()
    return { insertId: userId, affectedRows: userResult.affectedRows }
  } catch (error) {
    await connection.rollback()
    throw error
  } finally {
    connection.release()
  }
}

/**
 * 更新用户信息（动态字段）。
 */
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

/**
 * 更新用户角色关系（事务：先删后插）。
 * @param {number} userId
 * @param {number[]} roleIds
 */
const updateUserRoles = async (userId, roleIds) => {
  const connection = await getConnection()
  try {
    await connection.beginTransaction()
    await connection.execute('delete from UserRole where userId = ?', [userId])

    if (roleIds.length > 0) {
      const valuesSql = roleIds.map(() => '(?, ?)').join(', ')
      const values = roleIds.flatMap((roleId) => [userId, roleId])
      await connection.execute(`insert into UserRole (userId, roleId) values ${valuesSql}`, values)
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
 * 删除用户（事务：清理 UserRole 后删用户）。
 */
const deleteUser = async (id) => {
  const connection = await getConnection()
  try {
    await connection.beginTransaction()
    await connection.execute('delete from UserRole where userId = ?', [id])
    const [result] = await connection.execute('delete from Users where id = ?', [id])
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
 * 获取用户的角色 ID 列表。
 * @param {number} userId
 * @returns {Promise<number[]>}
 */
const getRoleIdsByUserId = async (userId) => {
  const sql = 'select roleId from UserRole where userId = ? order by roleId asc'
  const rows = await query(sql, [userId])
  return rows.map((item) => item.roleId)
}

const listRoleOptions = async () => {
  const sql = 'select roleId, roleName from Roles order by roleId asc'
  return query(sql)
}

/**
 * 检查角色是否存在。
 * @param {number} roleId
 * @returns {Promise<any|null>}
 */
const findRoleById = async (roleId) => {
  const sql = 'select roleId, roleName from Roles where roleId = ? limit 1'
  const rows = await query(sql, [roleId])
  return rows[0] || null
}

export default {
  listUsers,
  countUsers,
  findUserById,
  findUserByUsername,
  findUserByEmail,
  findUserByIdCard,
  createUser,
  updateUser,
  updateUserRoles,
  deleteUser,
  getRoleIdsByUserId,
  listRoleOptions,
  findRoleById
}
