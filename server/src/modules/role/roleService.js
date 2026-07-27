/**
 * @module 角色管理 Service
 * @description 封装角色 CRUD、路由/按钮权限管理等业务逻辑
 */

import adminRoleDao from './roleDao.js'
import adminPermissionDao from '../permission/permissionDao.js'
import { getConnection } from '../../db/connection.js'
import { businessCode } from '../../config/businessCode.js'
import { normalizePagination } from '../../schemas/common/paginationSchema.js'
import { delPermCacheByRole } from '../../utils/redisCache.js'

const toDbStatus = (status) => {
  if (status === '2' || Number(status) === 0) return 0
  return 1
}

const toFrontendStatus = (status) => {
  return Number(status) === 1 ? '1' : '2'
}

const formatRoleRow = (role) => ({
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
})

/**
 * 获取角色列表
 */
export const listRoles = async (query) => {
  const { current, size, page, pageSize, roleName, roleCode, status } = query
  const { actualPage, actualPageSize } = normalizePagination({ current, size, page, pageSize })
  const normalizedStatus = status === '2' ? '0' : status

  const filterParams = {
    roleName: roleName || '',
    roleCode: roleCode || '',
    status: normalizedStatus
  }

  const [roles, total] = await Promise.all([
    adminRoleDao.listRoles({ page: actualPage, pageSize: actualPageSize, ...filterParams }),
    adminRoleDao.countRoles(filterParams)
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

  return {
    records: roleList,
    current: actualPage,
    size: actualPageSize,
    total: Number(total)
  }
}

/**
 * 创建角色
 */
export const createRole = async (body) => {
  const { roleName, roleCode, roleDesc, description, routeIds = [], status } = body
  const normalizedDescription = roleDesc ?? description ?? ''
  const existedRole = await adminRoleDao.findRoleByName(roleName, roleCode)

  if (existedRole) return { success: false, code: businessCode.roleExist }

  const result = await adminRoleDao.createRoleWithRoutes({
    roleName,
    roleCode,
    description: normalizedDescription,
    status: toDbStatus(status),
    routeIds: [...new Set(routeIds)]
  })

  return { success: true, data: { roleId: result.roleId } }
}

/**
 * 更新角色
 */
export const updateRole = async (body) => {
  const { id, roleId: rawRoleId, roleName, roleCode, roleDesc, description, routeIds = [], status } = body
  const roleId = Number(rawRoleId || id)
  const normalizedDescription = roleDesc ?? description ?? ''
  const currentRole = await adminRoleDao.findRoleById(roleId)

  if (!currentRole) return { success: false, code: businessCode.roleNotFound }

  const existedRole = await adminRoleDao.findRoleByName(roleName, roleCode)
  if (existedRole && Number(existedRole.roleId) !== roleId) {
    return { success: false, code: businessCode.roleExist }
  }

  await adminRoleDao.updateRoleWithRoutes({
    roleId,
    roleName,
    roleCode,
    description: normalizedDescription,
    status: toDbStatus(status),
    routeIds: [...new Set(routeIds)]
  })

  return { success: true }
}

/**
 * 删除角色
 */
export const deleteRole = async (roleIdOrId) => {
  const roleId = Number(roleIdOrId)
  const currentRole = await adminRoleDao.findRoleById(roleId)

  if (!currentRole) return { success: false, code: businessCode.roleNotFound }

  const userCount = await adminRoleDao.countUsersByRoleId(roleId)
  if (userCount > 0) return { success: false, code: businessCode.roleInUse }

  await adminRoleDao.deleteRole(roleId)
  return { success: true }
}

/**
 * 获取全部角色（选项列表）
 */
export const getAllRoles = async () => {
  const roles = await adminRoleDao.listAllRoles()
  return {
    success: true,
    data: roles.map((role) => ({
      roleId: role.roleId,
      roleCode: role.roleCode,
      roleName: role.roleName,
      status: toFrontendStatus(role.status)
    }))
  }
}

/**
 * 获取角色路由 ID 列表
 */
export const getRoleRouteIds = async (roleId) => {
  const routeIds = await adminRoleDao.getRouteIdsByRoleId(Number(roleId))
  return { success: true, data: routeIds }
}

/**
 * 更新角色路由绑定
 */
export const updateRoleRouteIds = async ({ roleId, routeIds }) => {
  const currentRole = await adminRoleDao.findRoleById(roleId)
  if (!currentRole) return { success: false, code: businessCode.roleNotFound }

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
    
    // 清除该角色的权限缓存
    await delPermCacheByRole(roleId)
    
    return { success: true }
  } catch (error) {
    await connection.rollback()
    throw error
  } finally {
    connection.release()
  }
}

/**
 * 获取角色按钮 ID 列表
 */
export const getRoleButtonIds = async (roleId) => {
  const buttons = await adminPermissionDao.findButtonsByRoleId(Number(roleId))
  const buttonIds = buttons.map((b) => b.buttonId)
  return { success: true, data: buttonIds }
}

/**
 * 更新角色按钮绑定
 */
export const updateRoleButtonIds = async ({ roleId, buttonIds }) => {
  const currentRole = await adminRoleDao.findRoleById(roleId)
  if (!currentRole) return { success: false, code: businessCode.roleNotFound }

  await adminPermissionDao.replaceRoleButtons(roleId, buttonIds)
  
  // 清除该角色的权限缓存
  await delPermCacheByRole(roleId)
  
  return { success: true }
}

/**
 * 获取全部按钮
 */
export const getAllButtons = async () => {
  const buttons = await adminPermissionDao.findAllButtons()
  return { success: true, data: buttons }
}
