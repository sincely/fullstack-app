/**
 * @module 认证 Service
 * @description 封装登录、注册、权限快照等核心业务逻辑
 */

import { randomUUID } from 'crypto'
import adminAuthDao from './authDao.js'
import adminPermissionDao from '../permission/permissionDao.js'
import loginLogDao from '../log/loginLogDao.js'
import { businessCode } from '../../config/businessCode.js'
import { defaultAdminRoleName } from '../../config/admin.js'
import { hashPassword, comparePassword } from '../../utils/password.js'
import { generateToken, generateRefreshToken, verifyRefreshToken } from '../../utils/jwt.js'
import { buildMenuTree, extractPermissionCodes } from '../../utils/adminPermission.js'
import { query } from '../../db/connection.js'
import { delAuthCache } from '../../utils/redisCache.js'

const parseRoleIds = (value, fallbackRoleId) => {
  if (typeof value === 'string' && value.trim()) {
    return value
      .split(',')
      .map((item) => Number(item))
      .filter(Boolean)
  }
  return fallbackRoleId ? [Number(fallbackRoleId)] : []
}

const parseRoleNames = (value, fallbackRoleName) => {
  if (typeof value === 'string' && value.trim()) {
    return value
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean)
  }
  return fallbackRoleName ? [fallbackRoleName] : []
}

const parseRoleCodes = (value, fallbackRoleCode) => {
  if (typeof value === 'string' && value.trim()) {
    return value
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean)
  }
  return fallbackRoleCode ? [fallbackRoleCode] : []
}

const formatUserInfo = (user) => ({
  id: user.id,
  username: user.username,
  email: user.email,
  status: user.status,
  avatar: user.avatar,
  roleId: user.roleId,
  roleIds: parseRoleIds(user.roleIds, user.roleId),
  roleCode: user.roleCode,
  roleCodes: parseRoleCodes(user.roleCodes, user.roleCode),
  roleName: user.roleName,
  roleNames: parseRoleNames(user.roleNames, user.roleName),
  roleDescription: user.roleDescription
})

const buildPermissionSnapshot = async (roleIds) => {
  const menus = await adminPermissionDao.findMenusByRoleId(roleIds)
  const buttons = await adminPermissionDao.findButtonsByRoleId(roleIds)

  return {
    menuTree: buildMenuTree(menus),
    buttons,
    permissionCodes: extractPermissionCodes(menus, buttons)
  }
}

/**
 * 管理员注册
 */
export const register = async ({ username, password, email }) => {
  const existedUser = await adminAuthDao.findAdminUserByUsername(username)
  if (existedUser) {
    return { success: false, code: businessCode.userExist }
  }

  const existedEmail = await adminAuthDao.findAdminUserByEmail(email)
  if (existedEmail) {
    return { success: false, code: businessCode.emailExist }
  }

  const defaultRole = await adminAuthDao.findRoleByName(defaultAdminRoleName)
  if (!defaultRole) {
    return { success: false, code: businessCode.roleNotFound }
  }

  const passwordHash = await hashPassword(password)
  const registerResult = await adminAuthDao.createAdminUser({
    username,
    email,
    passwordHash,
    roleId: defaultRole.roleId
  })

  if (registerResult.affectedRows !== 1) {
    return { success: false, code: businessCode.error, msg: '注册失败' }
  }

  return {
    success: true,
    data: { username, email, roleName: defaultRole.roleName }
  }
}

/**
 * 管理员登录（后台管理端）
 */
export const login = async ({ username, password }) => {
  const user = await adminAuthDao.findAdminUserByUsername(username)
  if (!user) {
    return { success: false, code: businessCode.userLoginFail }
  }

  if (Number(user.status) !== 1) {
    return { success: false, code: businessCode.adminUserDisabled }
  }

  const passwordMatched = await comparePassword(password, user.password)
  if (!passwordMatched) {
    return { success: false, code: businessCode.userLoginFail }
  }

  const roleIds = parseRoleIds(user.roleIds, user.roleId)
  const roleCodes = parseRoleCodes(user.roleCodes, user.roleCode)
  const roleNames = parseRoleNames(user.roleNames, user.roleName)
  const permissionSnapshot = await buildPermissionSnapshot(roleIds)
  const token = generateToken({
    userId: user.id,
    username: user.username,
    roleId: user.roleId,
    roleIds,
    roleCode: user.roleCode,
    roleCodes,
    roleName: user.roleName,
    roleNames
  })

  return {
    success: true,
    data: {
      token,
      user: formatUserInfo(user),
      menus: permissionSnapshot.menuTree,
      permissions: permissionSnapshot.permissionCodes,
      buttons: permissionSnapshot.buttons
    }
  }
}

/**
 * 获取当前用户信息
 */
export const getProfile = async (userId) => {
  const currentUser = await adminAuthDao.findAdminUserById(userId)
  if (!currentUser) {
    return { success: false, code: businessCode.userNotFound }
  }
  return { success: true, data: formatUserInfo(currentUser) }
}

/**
 * 获取当前用户菜单
 */
export const getMenus = async (roleIds, roleId) => {
  const ids = parseRoleIds(roleIds, roleId)
  const permissionSnapshot = await buildPermissionSnapshot(ids)
  return { success: true, data: permissionSnapshot.menuTree }
}

/**
 * 获取当前用户权限
 */
export const getPermissions = async (roleIds, roleId) => {
  const ids = parseRoleIds(roleIds, roleId)
  const permissionSnapshot = await buildPermissionSnapshot(ids)
  return {
    success: true,
    data: {
      menus: permissionSnapshot.menuTree,
      buttons: permissionSnapshot.buttons,
      permissions: permissionSnapshot.permissionCodes
    }
  }
}

// ─── 前端兼容接口 ────────────────────────────────────────────

const detectBrowser = (ua) => {
  if (!ua) return 'Unknown'
  if (ua.includes('Edg/')) return 'Microsoft Edge'
  if (ua.includes('Chrome/')) return 'Google Chrome'
  if (ua.includes('Firefox/')) return 'Mozilla Firefox'
  if (ua.includes('Safari/') && !ua.includes('Chrome/')) return 'Safari'
  if (ua.includes('MSIE') || ua.includes('Trident/')) return 'Internet Explorer'
  return 'Unknown'
}

const detectOS = (ua) => {
  if (!ua) return 'Unknown'
  if (ua.includes('Windows NT')) {
    const version = ua.match(/Windows NT (\d+\.\d+)/)?.[1]
    const versionMap = {
      '10.0': 'Windows 10/11',
      '6.3': 'Windows 8.1',
      '6.2': 'Windows 8',
      '6.1': 'Windows 7'
    }
    return versionMap[version] || 'Windows'
  }
  if (ua.includes('Macintosh') || ua.includes('Mac OS X')) return 'macOS'
  if (ua.includes('Linux')) return 'Linux'
  if (ua.includes('Android')) return 'Android'
  if (ua.includes('iPhone') || ua.includes('iPad')) return 'iOS'
  return 'Unknown'
}

const buildLoginLogData = ({ userId, username, loginIp, userAgent, status, message, sessionId }) => ({
  userId,
  username,
  loginType: 'password',
  ipAddress: loginIp,
  location: '',
  browser: detectBrowser(userAgent),
  os: detectOS(userAgent),
  userAgent,
  status,
  message,
  sessionId: sessionId ?? null
})

/**
 * 前端兼容登录
 * @param {object} params - { userName, password, loginIp, userAgent }
 */
export const frontendLogin = async ({ userName, password, loginIp, userAgent }) => {
  const username = userName

  const user = await adminAuthDao.findAdminUserByUsername(username)
  if (!user) {
    await loginLogDao.createLoginLog(
      buildLoginLogData({
        userId: null,
        username,
        loginIp,
        userAgent,
        status: 0,
        message: '用户名或密码错误'
      })
    )
    return { success: false, code: businessCode.userLoginFail }
  }

  if (Number(user.status) !== 1) {
    await loginLogDao.createLoginLog(
      buildLoginLogData({
        userId: user.id,
        username,
        loginIp,
        userAgent,
        status: 0,
        message: '账号已被禁用'
      })
    )
    return { success: false, code: businessCode.adminUserDisabled }
  }

  const passwordMatched = await comparePassword(password, user.password)
  if (!passwordMatched) {
    await loginLogDao.createLoginLog(
      buildLoginLogData({
        userId: user.id,
        username,
        loginIp,
        userAgent,
        status: 0,
        message: '用户名或密码错误'
      })
    )
    return { success: false, code: businessCode.userLoginFail }
  }

  // 生成会话 ID 和登录信息
  const sessionId = randomUUID()
  const sessionExpire = new Date()
  sessionExpire.setDate(sessionExpire.getDate() + 7)

  const payload = {
    userId: user.id,
    username: user.username,
    roleId: user.roleId,
    roleIds: parseRoleIds(user.roleIds, user.roleId),
    roleCode: user.roleCode,
    roleCodes: parseRoleCodes(user.roleCodes, user.roleCode),
    roleName: user.roleName,
    roleNames: parseRoleNames(user.roleNames, user.roleName),
    sessionId
  }

  const token = generateToken(payload)
  const refreshToken = generateRefreshToken(payload)

  // 失效旧设备的认证缓存（新 sessionId 写入 MySQL 后，旧缓存中的旧 sessionId 不再匹配）
  await delAuthCache(user.id)

  // 将 sessionId、登录信息写入用户表
  const sql = `
    UPDATE Users SET
      sessionId = ?,
      currentRefreshToken = ?,
      loginIp = ?,
      loginTime = NOW(),
      sessionExpire = ?
    WHERE id = ?
  `
  await query(sql, [sessionId, refreshToken, loginIp, sessionExpire, user.id])

  // 记录登录成功日志
  await loginLogDao.createLoginLog(
    buildLoginLogData({
      userId: user.id,
      username,
      loginIp,
      userAgent,
      status: 1,
      message: '登录成功',
      sessionId
    })
  )

  return {
    success: true,
    data: {
      userId: user.id,
      token,
      refreshToken,
      sessionId
    }
  }
}

/**
 * 前端兼容 - 获取用户信息（含按钮权限）
 * @param {number} userId
 */
export const frontendGetUserInfo = async (userId) => {
  const currentUser = await adminAuthDao.findAdminUserById(userId)
  if (!currentUser) {
    return { success: false, code: businessCode.userNotFound }
  }

  const roleIds = parseRoleIds(currentUser.roleIds, currentUser.roleId)
  const roleCodes = parseRoleCodes(currentUser.roleCodes, currentUser.roleCode)
  const buttons = await adminPermissionDao.findButtonsByRoleId(roleIds)
  const buttonCodes = buttons.map((b) => b.buttonName)

  return {
    success: true,
    data: {
      userId: currentUser.id,
      userName: currentUser.username,
      roles: roleCodes,
      buttons: buttonCodes
    }
  }
}

/**
 * 前端兼容 - 刷新 Token
 * @param {string} refreshToken
 */
export const frontendRefreshToken = async (refreshToken) => {
  if (!refreshToken) {
    return { success: false, code: businessCode.paramError, msg: '缺少refreshToken参数' }
  }

  try {
    const decoded = verifyRefreshToken(refreshToken)

    // 单设备登录控制：校验用户表中的 currentRefreshToken 是否匹配
    const currentRefreshToken = await adminAuthDao.getUserRefreshToken(decoded.userId)
    if (currentRefreshToken !== refreshToken) {
      return { success: false, code: businessCode.accountKicked }
    }

    const payload = {
      userId: decoded.userId,
      username: decoded.username,
      roleId: decoded.roleId,
      roleIds: decoded.roleIds,
      roleCode: decoded.roleCode,
      roleCodes: decoded.roleCodes,
      roleName: decoded.roleName,
      roleNames: decoded.roleNames
    }

    const newToken = generateToken(payload)
    const newRefreshToken = generateRefreshToken(payload)

    await adminAuthDao.updateUserRefreshToken(decoded.userId, newRefreshToken)

    return {
      success: true,
      data: { token: newToken, refreshToken: newRefreshToken }
    }
  } catch {
    return { success: false, code: businessCode.accountKicked }
  }
}

/**
 * 前端兼容 - 登出（清除 sessionId 和 currentRefreshToken）
 * @param {number} userId
 */
export const frontendLogout = async (userId) => {
  if (userId) {
    const sql = `
      UPDATE Users SET
        sessionId = NULL,
        currentRefreshToken = NULL,
        loginIp = NULL,
        loginTime = NULL,
        sessionExpire = NULL
      WHERE id = ?
    `
    await query(sql, [userId])

    // 清除认证缓存，确保登出后立即生效
    await delAuthCache(userId)
  }
}
