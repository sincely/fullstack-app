/**
 * @module 用户管理
 * @description 处理后台用户管理相关的增删改查
 */

import adminUserDao from '../services/userDao.js'
import adminRoleDao from '../services/roleDao.js'
import { businessCode, businessMsg } from '../config/businessCode.js'
import { httpCode } from '../config/httpError.js'
import { hashPassword } from '../utils/password.js'

const toFrontendGender = (gender) => {
  if (gender === 'male') {
    return '1'
  }

  if (gender === 'female') {
    return '2'
  }

  return null
}

const toDbGender = (gender) => {
  if (gender === '1') {
    return 'male'
  }

  if (gender === '2') {
    return 'female'
  }

  return undefined
}

const toDbStatus = (status) => {
  if (status === '2' || Number(status) === 0) {
    return 0
  }

  return 1
}

const toFrontendStatus = (status) => {
  return Number(status) === 1 ? '1' : '2'
}

const parseRoleIds = (value) => {
  if (typeof value !== 'string' || !value.trim()) {
    return []
  }

  return value
    .split(',')
    .map((item) => Number(item))
    .filter(Boolean)
}

const formatUserRow = (row) => {
  const roleIds = parseRoleIds(row.roleIds)

  return {
    id: row.id,
    userName: row.username,
    userGender: toFrontendGender(row.gender),
    nickName: row.nickName ?? '',
    userPhone: row.phone ?? '',
    userEmail: row.email ?? '',
    status: toFrontendStatus(row.status),
    age: row.age,
    idCard: row.idCard ?? '',
    address: row.address ?? '',
    avatar: row.avatar ?? '',
    createBy: row.createBy ?? '',
    createTime: row.createTime ?? '',
    updateBy: row.updateBy ?? '',
    updateTime: row.updateTime ?? '',
    roleId: roleIds[0] ?? (row.roleId ? Number(row.roleId) : undefined),
    roleIds,
    roleNames: typeof row.roleNames === 'string' && row.roleNames ? row.roleNames.split(',') : []
  }
}

/**
 * 获取用户列表 - 分页查询并返回角色选项
 * @api GET /admin/system/users
 * @description 用户管理 - 后台用户管理相关的增删改查
 * @query {integer} page - 当前页码
 * @query {integer} pageSize - 每页数量
 * @query {string} [keyword] - 用户名或邮箱关键词
 * @query {string} [status] - 用户状态
 * @query {integer} [roleId] - 角色 ID
 */
const listUsers = async (ctx) => {
  // 前端兼容：current/size 转换为 page/pageSize
  const { current, size, page, pageSize, keyword, status, roleId, userName, nickName, userEmail, userPhone, userGender } = ctx.query
  const actualPage = Number(page || current || 1)
  const actualPageSize = Number(pageSize || size || 10)
  const normalizedKeyword = keyword || userName || nickName || userEmail || userPhone || ''
  const normalizedStatus = status === '2' ? '0' : status
  const normalizedGender = toDbGender(userGender)

  const [list, total] = await Promise.all([
    adminUserDao.listUsers({
      page: actualPage,
      pageSize: actualPageSize,
      keyword: normalizedKeyword,
      status: normalizedStatus,
      gender: normalizedGender,
      roleId
    }),
    adminUserDao.countUsers({ keyword: normalizedKeyword, status: normalizedStatus, gender: normalizedGender, roleId })
  ])

  ctx.status = httpCode.ok
  ctx.body = {
    code: businessCode.success,
    msg: '获取用户列表成功',
    data: {
      records: list.map(formatUserRow),
      current: actualPage,
      size: actualPageSize,
      total: Number(total)
    }
  }
}

/**
 * 创建用户 - 新增后台用户并绑定角色
 * @api POST /admin/system/users
 * @description 用户管理
 * @body {string} username - 用户名
 * @body {string} password - 登录密码
 * @body {string} [gender] - 性别
 * @body {integer} [age] - 年龄
 * @body {string} [idCard] - 身份证号
 * @body {string} email - 邮箱地址
 * @body {string} [address] - 联系地址
 * @body {string} [status] - 用户状态
 * @body {string} [avatar] - 头像地址
 * @body {integer} roleId - 角色 ID
 */
const createUser = async (ctx) => {
  const { username, password, gender, age, idCard, email, address, status, avatar, roleId } = ctx.request.body

  const [existedUser, existedEmail, existedIdCard, role] = await Promise.all([
    adminUserDao.findUserByUsername(username),
    adminUserDao.findUserByEmail(email),
    adminUserDao.findUserByIdCard(idCard),
    adminRoleDao.findRoleById(roleId)
  ])

  if (existedUser) {
    ctx.status = httpCode.ok
    ctx.body = { code: businessCode.userExist, msg: businessMsg[businessCode.userExist] }
    return
  }

  if (existedEmail) {
    ctx.status = httpCode.ok
    ctx.body = { code: businessCode.emailExist, msg: businessMsg[businessCode.emailExist] }
    return
  }

  if (existedIdCard) {
    ctx.status = httpCode.ok
    ctx.body = { code: businessCode.idCardExist, msg: businessMsg[businessCode.idCardExist] }
    return
  }

  if (!role) {
    ctx.status = httpCode.ok
    ctx.body = { code: businessCode.roleNotFound, msg: businessMsg[businessCode.roleNotFound] }
    return
  }

  const passwordHash = await hashPassword(password || '123456')
  const result = await adminUserDao.createUser({
    username,
    nickName: ctx.request.body.nickName,
    phone: ctx.request.body.phone,
    gender: toDbGender(gender) || 'other',
    age: age ?? null,
    idCard: idCard ?? null,
    email,
    address: address ?? null,
    status: toDbStatus(status),
    avatar: avatar ?? null,
    roleIds: [roleId],
    passwordHash
  })

  ctx.status = httpCode.ok
  ctx.body = {
    code: businessCode.success,
    msg: '创建用户成功',
    data: {
      id: result.insertId
    }
  }
}

/**
 * 更新用户 - 更新资料、角色或密码
 * @api PUT /admin/system/users
 * @description 用户管理
 * @body {integer} id - 用户 ID
 * @body {string} [password] - 新密码
 * @body {string} [gender] - 性别
 * @body {integer} [age] - 年龄
 * @body {string} [idCard] - 身份证号
 * @body {string} [email] - 邮箱地址
 * @body {string} [address] - 联系地址
 * @body {string} [status] - 用户状态
 * @body {string} [avatar] - 头像地址
 * @body {integer} [roleId] - 角色 ID
 */
const updateUser = async (ctx) => {
  const { id, password, email, idCard, roleId, ...rest } = ctx.request.body
  const currentUser = await adminUserDao.findUserById(id)

  if (!currentUser) {
    ctx.status = httpCode.ok
    ctx.body = { code: businessCode.userNotFound, msg: businessMsg[businessCode.userNotFound] }
    return
  }

  if (email) {
    const existedEmail = await adminUserDao.findUserByEmail(email)
    if (existedEmail && existedEmail.id !== id) {
      ctx.status = httpCode.ok
      ctx.body = { code: businessCode.emailExist, msg: businessMsg[businessCode.emailExist] }
      return
    }
  }

  if (idCard) {
    const existedIdCard = await adminUserDao.findUserByIdCard(idCard)
    if (existedIdCard && existedIdCard.id !== id) {
      ctx.status = httpCode.ok
      ctx.body = { code: businessCode.idCardExist, msg: businessMsg[businessCode.idCardExist] }
      return
    }
  }

  if (roleId) {
    const role = await adminRoleDao.findRoleById(roleId)
    if (!role) {
      ctx.status = httpCode.ok
      ctx.body = { code: businessCode.roleNotFound, msg: businessMsg[businessCode.roleNotFound] }
      return
    }
  }

  const payload = { ...rest }
  if (payload.gender !== undefined) {
    payload.gender = toDbGender(payload.gender) || 'other'
  }
  if (payload.status !== undefined) {
    payload.status = toDbStatus(payload.status)
  }
  if (email !== undefined) {
    payload.email = email
  }
  if (idCard !== undefined) {
    payload.idCard = idCard
  }
  if (password) {
    payload.password = await hashPassword(password)
  }

  await adminUserDao.updateUser(id, payload)
  if (roleId !== undefined) {
    await adminUserDao.updateUserRoles(id, [roleId])
  }

  ctx.status = httpCode.ok
  ctx.body = {
    code: businessCode.success,
    msg: '更新用户成功'
  }
}

/**
 * 删除用户
 * @api DELETE /admin/system/users
 * @description 用户管理
 * @body {integer} id - 用户 ID
 */
const deleteUser = async (ctx) => {
  const { id } = ctx.request.body

  if (ctx.state.user.userId === id) {
    ctx.status = httpCode.ok
    ctx.body = {
      code: businessCode.userDeleteSelfDenied,
      msg: businessMsg[businessCode.userDeleteSelfDenied]
    }
    return
  }

  const currentUser = await adminUserDao.findUserById(id)
  if (!currentUser) {
    ctx.status = httpCode.ok
    ctx.body = { code: businessCode.userNotFound, msg: businessMsg[businessCode.userNotFound] }
    return
  }

  await adminUserDao.deleteUser(id)

  ctx.status = httpCode.ok
  ctx.body = {
    code: businessCode.success,
    msg: '删除用户成功'
  }
}

export default {
  listUsers,
  createUser,
  updateUser,
  deleteUser
}
