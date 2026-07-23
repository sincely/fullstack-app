/**
 * @module 用户管理 Service
 * @description 封装用户 CRUD、批量操作、状态/密码管理等业务逻辑
 */

import adminUserDao from './userDao.js'
import adminRoleDao from '../role/roleDao.js'
import { businessCode } from '../../config/businessCode.js'
import { hashPassword } from '../../utils/password.js'
import { normalizePagination } from '../../schemas/common/paginationSchema.js'

const toFrontendGender = (gender) => {
  if (gender === 'male') return '1'
  if (gender === 'female') return '2'
  return null
}

const toDbGender = (gender) => {
  if (gender === '1') return 'male'
  if (gender === '2') return 'female'
  return undefined
}

const toDbStatus = (status) => {
  if (status === '2' || Number(status) === 0) return 0
  return 1
}

const toFrontendStatus = (status) => {
  return Number(status) === 1 ? '1' : '2'
}

const parseRoleIds = (value) => {
  if (typeof value !== 'string' || !value.trim()) return []
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
 * 获取用户列表
 */
export const listUsers = async (query) => {
  const { current, size, page, pageSize, keyword, status, roleId, userName, nickName, userEmail, userPhone, userGender } =
    query
  const { actualPage, actualPageSize } = normalizePagination({ current, size, page, pageSize })
  const normalizedKeyword = keyword || userName || nickName || userEmail || userPhone || ''
  const normalizedStatus = status === '2' ? '0' : status
  const normalizedGender = toDbGender(userGender)

  const filterParams = {
    keyword: normalizedKeyword,
    status: normalizedStatus,
    gender: normalizedGender,
    roleId
  }

  const [list, total] = await Promise.all([
    adminUserDao.listUsers({ page: actualPage, pageSize: actualPageSize, ...filterParams }),
    adminUserDao.countUsers(filterParams)
  ])

  return {
    records: list.map(formatUserRow),
    current: actualPage,
    size: actualPageSize,
    total: Number(total)
  }
}

/**
 * 创建用户
 */
export const createUser = async (body) => {
  const { username, password, gender, age, idCard, email, address, status, avatar, roleId, nickName, phone } = body

  const [existedUser, existedEmail, existedIdCard, role] = await Promise.all([
    adminUserDao.findUserByUsername(username),
    adminUserDao.findUserByEmail(email),
    adminUserDao.findUserByIdCard(idCard),
    adminRoleDao.findRoleById(roleId)
  ])

  if (existedUser) return { success: false, code: businessCode.userExist }
  if (existedEmail) return { success: false, code: businessCode.emailExist }
  if (existedIdCard) return { success: false, code: businessCode.idCardExist }
  if (!role) return { success: false, code: businessCode.roleNotFound }

  const passwordHash = await hashPassword(password || '123456')
  const result = await adminUserDao.createUser({
    username,
    nickName,
    phone,
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

  return { success: true, data: { id: result.insertId } }
}

/**
 * 更新用户
 */
export const updateUser = async (body) => {
  const { id, password, email, idCard, roleId, ...rest } = body
  const currentUser = await adminUserDao.findUserById(id)

  if (!currentUser) return { success: false, code: businessCode.userNotFound }

  if (email) {
    const existedEmail = await adminUserDao.findUserByEmail(email)
    if (existedEmail && existedEmail.id !== id) {
      return { success: false, code: businessCode.emailExist }
    }
  }

  if (idCard) {
    const existedIdCard = await adminUserDao.findUserByIdCard(idCard)
    if (existedIdCard && existedIdCard.id !== id) {
      return { success: false, code: businessCode.idCardExist }
    }
  }

  if (roleId) {
    const role = await adminRoleDao.findRoleById(roleId)
    if (!role) return { success: false, code: businessCode.roleNotFound }
  }

  const payload = { ...rest }
  if (payload.gender !== undefined) payload.gender = toDbGender(payload.gender) || 'other'
  if (payload.status !== undefined) payload.status = toDbStatus(payload.status)
  if (email !== undefined) payload.email = email
  if (idCard !== undefined) payload.idCard = idCard
  if (password) payload.password = await hashPassword(password)

  await adminUserDao.updateUser(id, payload)
  if (roleId !== undefined) {
    await adminUserDao.updateUserRoles(id, [roleId])
  }

  return { success: true }
}

/**
 * 删除用户
 */
export const deleteUser = async (id, currentUserId) => {
  if (currentUserId === id) {
    return { success: false, code: businessCode.userDeleteSelfDenied }
  }

  const currentUser = await adminUserDao.findUserById(id)
  if (!currentUser) return { success: false, code: businessCode.userNotFound }

  await adminUserDao.deleteUser(id)
  return { success: true }
}

/**
 * 批量删除用户
 */
export const batchDeleteUsers = async (ids, currentUserId) => {
  if (ids.includes(currentUserId)) {
    return { success: false, code: businessCode.userDeleteSelfDenied }
  }

  const userPromises = ids.map((id) => adminUserDao.findUserById(id))
  const users = await Promise.all(userPromises)
  const notFoundIds = ids.filter((id, index) => !users[index])

  if (notFoundIds.length > 0) {
    return {
      success: false,
      code: businessCode.userNotFound,
      msg: `以下用户不存在: ${notFoundIds.join(', ')}`
    }
  }

  const deletePromises = ids.map((id) => adminUserDao.deleteUser(id))
  await Promise.all(deletePromises)
  return { success: true, data: { count: ids.length } }
}

/**
 * 更新用户状态
 */
export const updateUserStatus = async (id, status, currentUserId) => {
  if (currentUserId === id && status === '2') {
    return { success: false, code: businessCode.userDisableSelfDenied }
  }

  const currentUser = await adminUserDao.findUserById(id)
  if (!currentUser) return { success: false, code: businessCode.userNotFound }

  await adminUserDao.updateUser(id, { status: toDbStatus(status) })
  return { success: true }
}

/**
 * 重置用户密码
 */
export const resetUserPassword = async (id) => {
  const currentUser = await adminUserDao.findUserById(id)
  if (!currentUser) return { success: false, code: businessCode.userNotFound }

  const passwordHash = await hashPassword('123456')
  await adminUserDao.updateUser(id, { password: passwordHash })
  return { success: true }
}
