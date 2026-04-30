/**
 * @module 用户管理
 * @description 处理后台用户管理相关的增删改查
 */

import userDao from '#src/dao/systemManage/userManage/usersDao.js'
import userRoleDao from '#src/dao/systemManage/roleManage/userRoleDao.js'
import { businessCode, businessMsg } from '#config/businessCode.js'
import { httpCode } from '#config/httpError.js'
import { hashPassword } from '#utils/password.js'
import { toUserRecord } from '#utils/dataFormatter.js'

/**
 * @summary 获取用户列表
 * @description 分页获取后台用户列表，并返回角色选项
 * @api GET /systemManage/getUserList
 * @param {number} page - 当前页码
 * @param {number} pageSize - 每页数量
 * @param {string} keyword - 用户名或邮箱关键词
 * @param {string} status - 用户状态
 * @param {number} roleId - 角色 ID
 * @returns {object} 200 - 获取成功
 */
const getUserList = async (ctx) => {
  const { current = 1, size = 10, userName, userGender, nickName, userPhone, userEmail, userStatus, status } = ctx.query
  const currentPage = Number(current) || 1
  const pageSize = Number(size) || 10
  const records = (await userDao.listAllUsersWithRoles()).map(toUserRecord)
  const normalizedStatus = userStatus ?? status

  const filteredRecords = records.filter((item) => {
    if (userName && !item.userName.includes(userName)) {
      return false
    }
    if (userGender && item.userGender !== userGender) {
      return false
    }
    if (nickName && !item.nickName.includes(nickName)) {
      return false
    }
    if (userPhone && !item.userPhone.includes(userPhone)) {
      return false
    }
    if (userEmail && !item.userEmail.includes(userEmail)) {
      return false
    }
    if (normalizedStatus && item.status !== normalizedStatus) {
      return false
    }

    return true
  })
  const start = (currentPage - 1) * pageSize
  const pageRecords = filteredRecords.slice(start, start + pageSize)

  ctx.status = httpCode.ok
  ctx.body = {
    code: '0000',
    msg: '获取用户列表成功',
    data: {
      records: pageRecords,
      current: currentPage,
      size: pageSize,
      total: filteredRecords.length
    }
  }
}

/**
 * @summary 创建用户
 * @description 新增后台用户并绑定角色
 * @api POST /systemManage/saveUser
 * @param {string} username - 用户名
 * @param {string} password - 登录密码
 * @param {string} gender - 性别
 * @param {number} age - 年龄
 * @param {string} email - 邮箱地址
 * @param {string} status - 用户状态
 * @param {string} avatar - 头像地址
 * @param {number} roleId - 角色 ID
 * @param {string} phone - 手机号
 * @param {string} nickName - 昵称
 * @returns {object} 200 - 创建成功
 */
const createUser = async (ctx) => {
  const { username, password, gender, email, status, roleId, phone, nickName } = ctx.request.body
  ctx.request.body

  const [existedUser, existedEmail, existedRole] = await Promise.all([
    userDao.findUserByUsername(username),
    userDao.findUserByEmail(email),
    userRoleDao.findRoleById(roleId)
  ])

  // 校验用户名、邮箱是否存在
  if (existedUser) {
    ctx.status = httpCode.ok
    ctx.body = { code: businessCode.userExist, msg: businessMsg[businessCode.userExist] }
    return
  }

  // 校验邮箱是否存在
  if (existedEmail) {
    ctx.status = httpCode.ok
    ctx.body = { code: businessCode.emailExist, msg: businessMsg[businessCode.emailExist] }
    return
  }

  // 校验角色是否存在
  if (!existedRole) {
    ctx.status = httpCode.ok
    ctx.body = { code: businessCode.roleNotFound, msg: businessMsg[businessCode.roleNotFound] }
    return
  }

  // 密码为空时，默认密码为 123456
  const passwordHash = await hashPassword(password ? password : '123456')
  const result = await userDao.createUser({
    gender,
    gender: toDbGender(gender),
    age: age ?? null,
    status,
    status: toDbStatus(status),
    avatar: avatar ?? null,
    roleId,
    passwordHash,
    phone: phone ?? null,
    nickName: nickName ?? null
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
 * @summary 更新用户
 * @description 更新后台用户资料、角色或密码
 * @api PUT /systemManage/updateUser
 * @param {number} id - 用户 ID
 * @param {string} password - 新密码
 * @param {string} gender - 性别
 * @param {number} age - 年龄
 * @param {string} email - 邮箱地址
 * @param {string} status - 用户状态
 * @param {string} avatar - 头像地址
 * @param {number} roleId - 角色 ID
 * @returns {object} 200 - 更新成功
 */
const updateUser = async (ctx) => {
  const { id, password, email, roleId, ...rest } = ctx.request.body
  const targetUserId = Number(id)
  const currentUser = await userDao.findUserById(id)

  if (!currentUser) {
    ctx.status = httpCode.ok
    ctx.body = { code: businessCode.userNotFound, msg: businessMsg[businessCode.userNotFound] }
    return
  }

  if (email) {
    const existedEmail = await userDao.findUserByEmail(email)
    if (existedEmail && Number(existedEmail.id) !== targetUserId) {
      ctx.status = httpCode.ok
      ctx.body = { code: businessCode.emailExist, msg: businessMsg[businessCode.emailExist] }
      return
    }
  }

  if (roleId) {
    const role = await userRoleDao.findRoleById(roleId)
    if (!role) {
      ctx.status = httpCode.ok
      ctx.body = { code: businessCode.roleNotFound, msg: businessMsg[businessCode.roleNotFound] }
      return
    }
  }

  const payload = { ...rest }
  if (email !== undefined) {
    payload.email = email
  }
  if (roleId !== undefined) {
    payload.roleId = roleId
  }
  if (password) {
    payload.password = await hashPassword(password)
  }

  await userDao.updateUser(id, payload)

  ctx.status = httpCode.ok
  ctx.body = {
    code: businessCode.success,
    msg: '更新用户成功'
  }
}

/**
 * @summary 删除用户
 * @description 删除指定后台用户
 * @api DELETE /systemManage/deleteUser
 * @param {number} id - 用户 ID
 * @returns {object} 200 - 删除成功
 */
const deleteUser = async (ctx) => {
  const { id } = ctx.request.body
  const operatorId = Number(ctx.state.user?.userId)
  const targetUserId = Number(id)

  if (Number.isFinite(operatorId) && operatorId === targetUserId) {
    ctx.status = httpCode.ok
    ctx.body = {
      code: businessCode.userDeleteSelfDenied,
      msg: businessMsg[businessCode.userDeleteSelfDenied]
    }
    return
  }

  const currentUser = await userDao.findUserById(id)
  if (!currentUser) {
    ctx.status = httpCode.ok
    ctx.body = { code: businessCode.userNotFound, msg: businessMsg[businessCode.userNotFound] }
    return
  }
  await userDao.deleteUser(id)

  ctx.status = httpCode.ok
  ctx.body = {
    code: businessCode.success,
    msg: '删除用户成功'
  }
}

export default {
  getUserList,
  createUser,
  updateUser,
  deleteUser
}
