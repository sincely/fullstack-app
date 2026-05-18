/**
 * @module 角色管理
 * @description 处理后台角色及角色菜单权限的增删改查
 */

import adminRoleDao from '../services/roleDao.js'
import adminPermissionDao from '../services/permissionDao.js'
import { getConnection } from '../utils/db.js'
import { businessCode, businessMsg } from '../config/businessCode.js'
import { httpCode } from '../config/httpError.js'

const toDbStatus = (status) => {
  if (status === '2' || Number(status) === 0) {
    return 0
  }

  return 1
}

const toFrontendStatus = (status) => {
  return Number(status) === 1 ? '1' : '2'
}

const formatRoleRow = (role) => {
  return {
    id: role.roleId,
    roleId: role.roleId,
    roleCode: role.roleCode,
    roleName: role.roleName,
    roleDesc: role.description ?? '',
    description: role.description ?? '',
    status: toFrontendStatus(role.status),
    isSystem: Boolean(role.isSystem),
    userCount: Number(role.userCount || 0),
    routeIds: role.routeIds || []
  }
}

/**
 * 获取角色列表 - 含绑定的菜单 ID 和菜单选项
 * @api GET /admin/system/roles
 * @description 角色管理 - 后台角色及角色菜单权限的增删改查
 */
const listRoles = async (ctx) => {
  const { current, size, page, pageSize, roleName, roleCode, status } = ctx.query
  const actualPage = Number(page || current || 1)
  const actualPageSize = Number(pageSize || size || 10)
  const normalizedStatus = status === '2' ? '0' : status

  const [roles, total] = await Promise.all([
    adminRoleDao.listRoles({
      page: actualPage,
      pageSize: actualPageSize,
      roleName: roleName || '',
      roleCode: roleCode || '',
      status: normalizedStatus
    }),
    adminRoleDao.countRoles({
      roleName: roleName || '',
      roleCode: roleCode || '',
      status: normalizedStatus
    })
  ])

  const roleList = await Promise.all(
    roles.map(async (role) => {
      const routeIds = await adminRoleDao.getRouteIdsByRoleId(role.roleId)
      return {
        ...formatRoleRow(role),
        routeIds
      }
    })
  )

  ctx.status = httpCode.ok
  ctx.body = {
    code: businessCode.success,
    msg: '获取角色列表成功',
    data: {
      records: roleList,
      current: actualPage,
      size: actualPageSize,
      total: Number(total)
    }
  }
}

/**
 * 创建角色 - 并绑定菜单权限
 * @api POST /admin/system/roles
 * @description 角色管理
 * @body {string} roleName - 角色名称
 * @body {string} description - 角色描述
 * @body {array} [routeIds] - 关联菜单 ID 列表
 */
const createRole = async (ctx) => {
  const { roleName, roleCode, roleDesc, description, routeIds = [], status } = ctx.request.body
  const normalizedDescription = roleDesc ?? description ?? ''
  const existedRole = await adminRoleDao.findRoleByName(roleName, roleCode)

  if (existedRole) {
    ctx.status = httpCode.ok
    ctx.body = { code: businessCode.roleExist, msg: businessMsg[businessCode.roleExist] }
    return
  }

  const result = await adminRoleDao.createRoleWithRoutes({
    roleName,
    roleCode,
    description: normalizedDescription,
    status: toDbStatus(status),
    routeIds: [...new Set(routeIds)]
  })

  ctx.status = httpCode.ok
  ctx.body = {
    code: businessCode.success,
    msg: '创建角色成功',
    data: {
      roleId: result.roleId
    }
  }
}

/**
 * 更新角色 - 重置角色菜单权限
 * @api PUT /admin/system/roles
 * @description 角色管理
 * @body {integer} roleId - 角色 ID
 * @body {string} roleName - 角色名称
 * @body {string} description - 角色描述
 * @body {array} [routeIds] - 关联菜单 ID 列表
 */
const updateRole = async (ctx) => {
  const { id, roleId: rawRoleId, roleName, roleCode, roleDesc, description, routeIds = [], status } = ctx.request.body
  const roleId = Number(rawRoleId || id)
  const normalizedDescription = roleDesc ?? description ?? ''
  const currentRole = await adminRoleDao.findRoleById(roleId)

  if (!currentRole) {
    ctx.status = httpCode.ok
    ctx.body = { code: businessCode.roleNotFound, msg: businessMsg[businessCode.roleNotFound] }
    return
  }

  const existedRole = await adminRoleDao.findRoleByName(roleName, roleCode)
  if (existedRole && Number(existedRole.roleId) !== roleId) {
    ctx.status = httpCode.ok
    ctx.body = { code: businessCode.roleExist, msg: businessMsg[businessCode.roleExist] }
    return
  }

  await adminRoleDao.updateRoleWithRoutes({
    roleId,
    roleName,
    roleCode,
    description: normalizedDescription,
    status: toDbStatus(status),
    routeIds: [...new Set(routeIds)]
  })

  ctx.status = httpCode.ok
  ctx.body = {
    code: businessCode.success,
    msg: '更新角色成功'
  }
}

/**
 * 删除角色 - 清理角色菜单权限绑定
 * @api DELETE /admin/system/roles
 * @description 角色管理
 * @body {integer} roleId - 角色 ID
 */
const deleteRole = async (ctx) => {
  const roleId = Number(ctx.request.body.roleId || ctx.request.body.id)
  const currentRole = await adminRoleDao.findRoleById(roleId)

  if (!currentRole) {
    ctx.status = httpCode.ok
    ctx.body = { code: businessCode.roleNotFound, msg: businessMsg[businessCode.roleNotFound] }
    return
  }

  const userCount = await adminRoleDao.countUsersByRoleId(roleId)
  if (userCount > 0) {
    ctx.status = httpCode.ok
    ctx.body = { code: businessCode.roleInUse, msg: businessMsg[businessCode.roleInUse] }
    return
  }

  await adminRoleDao.deleteRole(roleId)

  ctx.status = httpCode.ok
  ctx.body = {
    code: businessCode.success,
    msg: '删除角色成功'
  }
}

const getAllRoles = async (ctx) => {
  const roles = await adminRoleDao.listAllRoles()
  ctx.status = httpCode.ok
  ctx.body = {
    code: businessCode.success,
    msg: '获取全部角色成功',
    data: roles.map((role) => ({
      roleId: role.roleId,
      roleCode: role.roleCode,
      roleName: role.roleName,
      status: toFrontendStatus(role.status)
    }))
  }
}

const getRoleRouteIds = async (ctx) => {
  const { roleId } = ctx.query
  const routeIds = await adminRoleDao.getRouteIdsByRoleId(Number(roleId))
  ctx.status = httpCode.ok
  ctx.body = {
    code: businessCode.success,
    msg: 'ok',
    data: routeIds
  }
}

const updateRoleRouteIds = async (ctx) => {
  const { roleId, routeIds } = ctx.request.body
  const currentRole = await adminRoleDao.findRoleById(roleId)
  if (!currentRole) {
    ctx.status = httpCode.ok
    ctx.body = { code: businessCode.roleNotFound, msg: businessMsg[businessCode.roleNotFound] }
    return
  }
  const connection = await getConnection()
  try {
    await connection.beginTransaction()
    await connection.execute('delete from RoleRoute where roleId = ?', [roleId])
    if (routeIds && routeIds.length > 0) {
      const valuesSql = routeIds.map(() => '(?, ?)').join(', ')
      const values = routeIds.flatMap((id) => [roleId, id])
      await connection.execute(`insert into RoleRoute (roleId, routeId) values ${valuesSql}`, values)
    }
    await connection.commit()
    ctx.status = httpCode.ok
    ctx.body = { code: businessCode.success, msg: '更新角色菜单成功', data: null }
  } catch (error) {
    await connection.rollback()
    throw error
  } finally {
    connection.release()
  }
}

const getRoleButtonIds = async (ctx) => {
  const { roleId } = ctx.query
  const buttons = await adminPermissionDao.findButtonsByRoleId(Number(roleId))
  const buttonIds = buttons.map((b) => b.buttonId)
  ctx.status = httpCode.ok
  ctx.body = {
    code: businessCode.success,
    msg: 'ok',
    data: buttonIds
  }
}

const updateRoleButtonIds = async (ctx) => {
  const { roleId, buttonIds } = ctx.request.body
  const currentRole = await adminRoleDao.findRoleById(roleId)
  if (!currentRole) {
    ctx.status = httpCode.ok
    ctx.body = { code: businessCode.roleNotFound, msg: businessMsg[businessCode.roleNotFound] }
    return
  }

  await adminPermissionDao.replaceRoleButtons(roleId, buttonIds)

  ctx.status = httpCode.ok
  ctx.body = { code: businessCode.success, msg: '更新角色按钮成功', data: null }
}

const getAllButtons = async (ctx) => {
  const buttons = await adminPermissionDao.findAllButtons()
  ctx.status = httpCode.ok
  ctx.body = {
    code: businessCode.success,
    msg: 'ok',
    data: buttons
  }
}

export default {
  listRoles,
  getAllRoles,
  getRoleRouteIds,
  updateRoleRouteIds,
  getRoleButtonIds,
  updateRoleButtonIds,
  getAllButtons,
  createRole,
  updateRole,
  deleteRole
}
