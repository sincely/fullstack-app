/**
 * @module 后台认证
 * @description 处理后台登录、注册、退出和权限信息获取
 */

import userAuthDao from '../../models/dao/userAuthDao.js'
import userPermissionDao from '../../models/dao/userPermissionDao.js'
import { httpCode } from '../../config/httpError.js'
import { businessCode, businessMsg } from '../../config/businessCode.js'
import { defaultAdminRoleName } from '../../config/admin.js'
import { hashPassword, comparePassword } from '../../utils/password.js'
import { generateToken, decodeToken } from '../../utils/jwt.js'
import { buildMenuTree, extractPermissionCodes } from '../../utils/adminPermission.js'
import { getRedisClient } from '../../utils/redis.js'

const SUCCESS_CODE = '0000'
const LOGIN_FAIL_CODE = '10001'
const TOKEN_INVALID_CODE = '9998'

// 后台管理端用户信息输出（内部接口使用）
const formatUserInfo = (user) => {
  return {
    id: user.id,
    username: user.username,
    email: user.email,
    status: user.status,
    avatar: user.avatar,
    roleId: user.roleId,
    roleName: user.roleName,
    roleDescription: user.roleDescription
  }
}

// 将数据库角色名规范化为前端静态路由识别的角色编码
const toRoleCode = (roleName = '') => {
  const normalized = String(roleName).trim()
  if (!normalized) {
    return 'R_USER'
  }

  const upper = normalized.toUpperCase()
  if (upper.startsWith('R_')) {
    return upper
  }
  if (upper.includes('SUPER')) {
    return 'R_SUPER'
  }
  if (upper.includes('ADMIN')) {
    return 'R_ADMIN'
  }
  return 'R_USER'
}

// `/auth/getCurrentUserInfo` 兼容接口返回结构
const formatLegacyUserInfo = (user, permissionSnapshot) => {
  return {
    userId: String(user.id),
    userName: user.username,
    roles: [toRoleCode(user.roleName)],
    buttons: permissionSnapshot.permissionCodes.buttons
  }
}

// 聚合角色对应的菜单与按钮权限，便于登录后一次性返回
const buildPermissionSnapshot = async (roleId) => {
  const menus = await userPermissionDao.findMenusByRoleId(roleId)
  const buttons = await userPermissionDao.findButtonsByRoleId(roleId)

  return {
    menuTree: buildMenuTree(menus),
    buttons,
    permissionCodes: extractPermissionCodes(menus, buttons)
  }
}

/**
 * @summary 后台注册
 * @description 注册后台账号并绑定默认角色，不包含验证码校验
 * @api POST /admin/auth/register
 * @param {string} username - 登录用户名
 * @param {string} password - 登录密码
 * @param {string} confirmPassword - 确认密码
 * @param {string} email - 邮箱地址
 * @returns {object} 200 - 注册成功
 */
const register = async (ctx) => {
  const { username, password, email } = ctx.request.body

  const existedUser = await userAuthDao.findAdminUserByUsername(username)
  if (existedUser) {
    ctx.status = httpCode.ok
    ctx.body = {
      code: businessCode.userExist,
      msg: businessMsg[businessCode.userExist]
    }
    return
  }

  const existedEmail = await userAuthDao.findAdminUserByEmail(email)
  if (existedEmail) {
    ctx.status = httpCode.ok
    ctx.body = {
      code: businessCode.emailExist,
      msg: businessMsg[businessCode.emailExist]
    }
    return
  }

  const defaultRole = await userAuthDao.findRoleByName(defaultAdminRoleName)
  if (!defaultRole) {
    ctx.status = httpCode.internalServerError
    ctx.body = {
      code: businessCode.roleNotFound,
      msg: businessMsg[businessCode.roleNotFound]
    }
    return
  }

  const passwordHash = await hashPassword(password)
  const registerResult = await userAuthDao.createAdminUser({
    username,
    email,
    passwordHash,
    roleId: defaultRole.roleId
  })

  if (registerResult.affectedRows !== 1) {
    ctx.status = httpCode.internalServerError
    ctx.body = {
      code: businessCode.error,
      msg: '注册失败'
    }
    return
  }

  ctx.status = httpCode.ok
  ctx.body = {
    code: businessCode.success,
    msg: '注册成功',
    data: {
      username,
      email,
      roleName: defaultRole.roleName
    }
  }
}

/**
 * @summary 获取当前用户信息
 * @description 获取当前登录后台用户的基础资料
 * @api GET /admin/auth/profile
 * @returns {object} 200 - 获取成功
 */
const getCurrentUserInfo = async (ctx) => {
  const currentUser = await userAuthDao.findAdminUserById(ctx.state.user.userId)
  if (!currentUser) {
    ctx.status = httpCode.unauthorized
    ctx.body = {
      code: businessCode.userNotFound,
      msg: businessMsg[businessCode.userNotFound]
    }
    return
  }

  ctx.status = httpCode.ok
  ctx.body = {
    code: businessCode.success,
    msg: '获取用户信息成功',
    data: formatUserInfo(currentUser)
  }
}

/**
 * @summary 获取当前用户菜单
 * @description 获取当前登录后台用户可访问的菜单树
 * @api GET /admin/auth/menus
 * @returns {object} 200 - 获取成功
 */
const getUserMenus = async (ctx) => {
  const permissionSnapshot = await buildPermissionSnapshot(ctx.state.user.roleId)

  ctx.status = httpCode.ok
  ctx.body = {
    code: businessCode.success,
    msg: '获取菜单成功',
    data: permissionSnapshot.menuTree
  }
}

/**
 * @summary 获取当前用户权限
 * @description 获取当前登录后台用户的菜单、按钮和权限码
 * @api GET /admin/auth/permissions
 * @returns {object} 200 - 获取成功
 */
const getUserPermissions = async (ctx) => {
  const permissionSnapshot = await buildPermissionSnapshot(ctx.state.user.roleId)

  ctx.status = httpCode.ok
  ctx.body = {
    code: businessCode.success,
    msg: '获取权限成功',
    data: {
      menus: permissionSnapshot.menuTree,
      buttons: permissionSnapshot.buttons,
      permissions: permissionSnapshot.permissionCodes
    }
  }
}

/**
 * @summary 后台退出登录
 * @description 将当前 Token 加入 Redis 黑名单，确保退出后 Token 立即失效
 * @api POST /admin/auth/logout
 * @returns {object} 200 - 退出成功
 */
const logout = async (ctx) => {
  const token = ctx.state.token
  if (token) {
    try {
      const redis = getRedisClient()
      // 解析 token 过期时间，TTL 设为剩余有效期（最少 1 秒）
      const decoded = decodeToken(token)
      const exp = decoded?.exp
      const now = Math.floor(Date.now() / 1000)
      const ttl = exp ? Math.max(exp - now, 1) : 3600 // 无法解析则默认 1 小时
      await redis.setex(`blacklist:${token}`, ttl, '1')
    } catch {
      // 黑名单写入失败不影响退出响应，但记录日志
    }
  }

  ctx.status = httpCode.ok
  ctx.body = {
    code: businessCode.success,
    msg: '退出成功'
  }
}

/**
 * @summary 后台登录
 * @description 使用用户名和密码登录后台，返回 token、用户信息、菜单和权限数据
 * @api POST /user/auth/login
 * @param {string} username - 登录用户名
 * @param {string} password - 登录密码
 * @returns {object} 200 - 登录成功
 */
const login = async (ctx) => {
  const { userName, password } = ctx.request.body

  const user = await userAuthDao.findAdminUserByUsername(userName)
  if (!user || user.status !== 'active') {
    ctx.status = httpCode.ok
    ctx.body = {
      code: LOGIN_FAIL_CODE,
      msg: businessMsg[businessCode.userLoginFail]
    }
    return
  }

  const passwordMatched = await comparePassword(password, user.password)
  if (!passwordMatched) {
    ctx.status = httpCode.ok
    ctx.body = {
      code: LOGIN_FAIL_CODE,
      msg: businessMsg[businessCode.userLoginFail]
    }
    return
  }

  const tokenPayload = {
    userId: user.id,
    username: user.username,
    roleId: user.roleId,
    roleName: user.roleName
  }

  ctx.status = httpCode.ok
  ctx.body = {
    code: SUCCESS_CODE,
    msg: '登录成功',
    data: {
      token: generateToken(tokenPayload),
      refreshToken: generateToken({ ...tokenPayload, tokenType: 'refresh' })
    }
  }
}

/**
 * @summary 获取用户信息（兼容前端旧接口）
 * @description 对齐 `/auth/getCurrentUserInfo` 响应结构，返回 userId/userName/roles/buttons
 * @api GET /auth/getCurrentUserInfo
 */
const getUserInfo = async (ctx) => {
  const userId = ctx.state.user?.userId
  if (!userId) {
    ctx.status = httpCode.ok
    ctx.body = {
      code: TOKEN_INVALID_CODE,
      msg: 'Token 无效'
    }
    return
  }

  const currentUser = await userAuthDao.findAdminUserById(userId)
  if (!currentUser || currentUser.status !== 'active') {
    ctx.status = httpCode.ok
    ctx.body = {
      code: businessCode.userNotFound,
      msg: businessMsg[businessCode.userNotFound]
    }
    return
  }

  const permissionSnapshot = await buildPermissionSnapshot(currentUser.roleId)

  ctx.status = httpCode.ok
  ctx.body = {
    code: SUCCESS_CODE,
    msg: '获取用户信息成功',
    data: formatLegacyUserInfo(currentUser, permissionSnapshot)
  }
}

export default {
  register,
  getCurrentUserInfo,
  getUserMenus,
  getUserPermissions,
  logout,
  login,
  getUserInfo
}
