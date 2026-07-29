import { getConnection, query } from '../../db/connection.js'

/**
 * 用户查询公共字段（适配新表结构，多角色通过 UserRole 关联）。
 */
const USER_COLUMNS = `
  u.id, u.username, u.nick_name, u.gender, u.age, u.phone,
  u.id_card, u.email, u.address, u.status, u.avatar,
  u.create_by, u.create_time, u.update_by, u.update_time
`

const USER_ROLE_AGGREGATE_SQL = `
  select
    ur.user_id,
    min(ur.role_id) as role_id,
    group_concat(distinct ur.role_id order by ur.role_id asc) as roleIds,
    group_concat(distinct r.role_name order by r.role_name asc) as roleNames
  from UserRole ur
  left join Roles r on r.role_id = ur.role_id
  group by ur.user_id
`

const buildUserFilters = ({ keyword, status, gender }) => {
  const where = []
  const params = []

  if (keyword) {
    where.push('(u.username like ? or u.email like ? or u.nick_name like ? or u.phone like ?)')
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
const listUsers = async ({ keyword, status, gender, role_id, page, pageSize }) => {
  const { whereSql, params } = buildUserFilters({ keyword, status, gender })
  const safePage = Number.parseInt(page, 10) || 1
  const safePageSize = Number.parseInt(pageSize, 10) || 10
  const offset = (safePage - 1) * safePageSize
  const extraWhere = []
  const queryParams = [...params]

  if (role_id) {
    extraWhere.push('exists (select 1 from UserRole urf where urf.user_id = u.id and urf.role_id = ?)')
    queryParams.push(Number(role_id))
  }

  const finalWhereSql = [whereSql.replace(/^where\s+/i, ''), ...extraWhere].filter(Boolean).join(' and ')

  const sql = `
    select
      ${USER_COLUMNS},
      roleAgg.role_id,
      roleAgg.roleIds,
      roleAgg.roleNames
    from Users u
    left join (${USER_ROLE_AGGREGATE_SQL}) roleAgg on roleAgg.user_id = u.id
    ${finalWhereSql ? `where ${finalWhereSql}` : ''}
    order by u.id desc
    limit ?, ?
  `

  return query(sql, [...queryParams, offset, safePageSize])
}

/**
 * 统计用户总数（支持按 role_id 过滤）。
 */
const countUsers = async ({ keyword, status, gender, role_id }) => {
  const { whereSql, params } = buildUserFilters({ keyword, status, gender })
  const extraWhere = []
  const queryParams = [...params]

  if (role_id) {
    extraWhere.push('exists (select 1 from UserRole ur where ur.user_id = u.id and ur.role_id = ?)')
    queryParams.push(Number(role_id))
  }

  const finalWhereSql = [whereSql.replace(/^where\s+/i, ''), ...extraWhere].filter(Boolean).join(' and ')

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
      roleAgg.role_id,
      roleAgg.roleIds,
      roleAgg.roleNames
    from Users u
    left join (${USER_ROLE_AGGREGATE_SQL}) roleAgg on roleAgg.user_id = u.id
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

const findUserByIdCard = async (id_card) => {
  const sql = 'select id, id_card from Users where id_card = ? limit 1'
  const rows = await query(sql, [id_card])
  return rows[0] || null
}

/**
 * 创建用户并绑定角色（事务）。
 * @param {object} payload
 * @returns {Promise<any>}
 */
const createUser = async ({
  username,
  nickName,
  gender,
  age,
  phone,
  idCard,
  email,
  address,
  status,
  avatar,
  roleIds,
  passwordHash
}) => {
  const connection = await getConnection()
  try {
    await connection.beginTransaction()

    const [userResult] = await connection.execute(
      `insert into Users (username, nick_name, gender, age, phone, id_card, email, address, status, avatar, password)
       values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        username,
        nickName ?? null,
        gender ?? 'other',
        age ?? null,
        phone ?? null,
        idCard ?? null,
        email,
        address ?? null,
        status ?? 1,
        avatar ?? null,
        passwordHash
      ]
    )

    const user_id = userResult.insertId

    if (roleIds && roleIds.length > 0) {
      const valuesSql = roleIds.map(() => '(?, ?)').join(', ')
      const values = roleIds.flatMap((role_id) => [user_id, role_id])
      await connection.execute(`insert into UserRole (user_id, role_id) values ${valuesSql}`, values)
    }

    await connection.commit()
    return { insertId: user_id, affectedRows: userResult.affectedRows }
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
 * @param {number} user_id
 * @param {number[]} roleIds
 */
const updateUserRoles = async (user_id, roleIds) => {
  const connection = await getConnection()
  try {
    await connection.beginTransaction()
    await connection.execute('delete from UserRole where user_id = ?', [user_id])

    if (roleIds.length > 0) {
      const valuesSql = roleIds.map(() => '(?, ?)').join(', ')
      const values = roleIds.flatMap((role_id) => [user_id, role_id])
      await connection.execute(`insert into UserRole (user_id, role_id) values ${valuesSql}`, values)
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
    await connection.execute('delete from UserRole where user_id = ?', [id])
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
 * @param {number} user_id
 * @returns {Promise<number[]>}
 */
const getRoleIdsByUserId = async (user_id) => {
  const sql = 'select role_id from UserRole where user_id = ? order by role_id asc'
  const rows = await query(sql, [user_id])
  return rows.map((item) => item.role_id)
}

const listRoleOptions = async () => {
  const sql = 'select role_id, role_name from Roles order by role_id asc'
  return query(sql)
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
  listRoleOptions
}
