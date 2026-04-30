/**
 * @module 角色管理
 * @description 处理后台角色及角色菜单权限的增删改查
 */

import userRoleDao from '#models/dao/userRoleDao.js'
import userPermissionDao from '#models/dao/userPermissionDao.js'
import userMenuDao from '#models/dao/userMenuDao.js'
import { businessCode, businessMsg } from '#config/businessCode.js'
import { httpCode } from '#config/httpError.js'
import { toRoleCode, toRoleRecord } from '#utils/dataFormatter.js'

/**
 * @summary 获取角色列表
 * @description 获取角色列表、绑定的菜单 ID 以及菜单选项
 * @api GET /admin/system/roles
 * @returns {object} 200 - 获取成功
 */
const listRoles = async (ctx) => {
  const { current = 1, size = 10, roleName, roleCode, status } = ctx.query
  const currentPage = Number(current) || 1
  const pageSize = Number(size) || 10
  const records = (await userRoleDao.listRoles()).map(toRoleRecord)
  const filteredRecords = records.filter((item) => {
    if (roleName && !item.roleName.includes(roleName)) {
      return false
    }
    if (roleCode && !item.roleCode.toUpperCase().includes(String(roleCode).toUpperCase())) {
      return false
    }
    if (status && item.status !== status) {
      return false
    }

    return true
  })
  const start = (currentPage - 1) * pageSize
  const pageRecords = filteredRecords.slice(start, start + pageSize)

  ctx.status = httpCode.ok
  ctx.body = {
    code: '0000',
    msg: '获取角色列表成功',
    data: {
      records: pageRecords,
      current: currentPage,
      size: pageSize,
      total: filteredRecords.length
    }
  }
}

const getAllRoles = async (ctx) => {
  const roles = await userRoleDao.listRoles()

  ctx.status = httpCode.ok
  ctx.body = {
    code: '0000',
    msg: '获取全部角色成功',
    data: roles.map((role) => ({
      id: String(role.roleId),
      roleName: role.roleName ?? '',
      roleCode: toRoleCode(role.roleName)
    }))
  }
}

const getRoleRouteIds = async (ctx) => {
  const { roleId } = ctx.query
  const currentRole = await userRoleDao.findRoleById(roleId)

  if (!currentRole) {
    ctx.status = httpCode.ok
    ctx.body = { code: businessCode.roleNotFound, msg: businessMsg[businessCode.roleNotFound] }
    return
  }

  const routeIds = await userRoleDao.getRouteIdsByRoleId(roleId)

  ctx.status = httpCode.ok
  ctx.body = {
    code: '0000',
    msg: '获取角色菜单成功',
    data: routeIds
  }
}

const getRoleButtonIds = async (ctx) => {
  const { roleId } = ctx.query
  const currentRole = await userRoleDao.findRoleById(roleId)

  if (!currentRole) {
    ctx.status = httpCode.ok
    ctx.body = { code: businessCode.roleNotFound, msg: businessMsg[businessCode.roleNotFound] }
    return
  }

  const buttonIds = await userPermissionDao.getButtonIdsByRoleId(roleId)

  ctx.status = httpCode.ok
  ctx.body = {
    code: '0000',
    msg: '获取角色按钮成功',
    data: buttonIds
  }
}

const updateRoleRouteIds = async (ctx) => {
  const { roleId, routeIds } = ctx.request.body
  const currentRole = await userRoleDao.findRoleById(roleId)

  if (!currentRole) {
    ctx.status = httpCode.ok
    ctx.body = { code: businessCode.roleNotFound, msg: businessMsg[businessCode.roleNotFound] }
    return
  }

  await userRoleDao.replaceRoleRoutes({
    roleId,
    routeIds: [...new Set(routeIds)]
  })

  ctx.status = httpCode.ok
  ctx.body = {
    code: '0000',
    msg: '更新角色菜单成功'
  }
}

const updateRoleButtonIds = async (ctx) => {
  const { roleId, buttonIds } = ctx.request.body
  const currentRole = await userRoleDao.findRoleById(roleId)

  if (!currentRole) {
    ctx.status = httpCode.ok
    ctx.body = { code: businessCode.roleNotFound, msg: businessMsg[businessCode.roleNotFound] }
    return
  }

  await userPermissionDao.replaceRoleButtons({
    roleId,
    buttonIds: [...new Set(buttonIds)]
  })

  ctx.status = httpCode.ok
  ctx.body = {
    code: '0000',
    msg: '更新角色按钮成功'
  }
}

const getAllButtons = async (ctx) => {
  await userMenuDao.syncButtonsFromMenus()
  const buttons = await userPermissionDao.listAllButtons()
  const grouped = new Map()

  for (const button of buttons) {
    const routeKey = String(button.routeId)
    if (!grouped.has(routeKey)) {
      grouped.set(routeKey, {
        key: routeKey,
        title: button.routeName || `route-${button.routeId}`,
        children: []
      })
    }

    grouped.get(routeKey).children.push({
      key: String(button.buttonId),
      title: button.buttonName,
      code: button.buttonName
    })
  }

  ctx.status = httpCode.ok
  ctx.body = {
    code: '0000',
    msg: '获取全部按钮成功',
    data: [...grouped.values()]
  }
}

/**
 * @summary 创建角色
 * @description 创建新角色并绑定菜单权限
 * @api POST /admin/system/roles
 * @param {string} roleName - 角色名称
 * @param {string} description - 角色描述
 * @param {array} routeIds - 关联菜单 ID 列表
 * @returns {object} 200 - 创建成功
 */
const createRole = async (ctx) => {
  const { roleName, roleCode, roleDesc, routeIds = [] } = ctx.request.body
  const existedRole = await userRoleDao.findRoleByName(roleName)

  if (existedRole) {
    ctx.status = httpCode.ok
    ctx.body = { code: businessCode.roleExist, msg: businessMsg[businessCode.roleExist] }
    return
  }

  const result = await userRoleDao.createRoleWithRoutes({
    roleName,
    description: JSON.stringify({
      roleCode,
      roleDesc
    }),
    routeIds: [...new Set(routeIds)]
  })

  ctx.status = httpCode.ok
  ctx.body = {
    code: businessCode.success,
    msg: '创建角色成功',
    data: {
      id: result.roleId
    }
  }
}

/**
 * @summary 更新角色
 * @description 更新角色信息并重置角色菜单权限
 * @api PUT /admin/system/roles
 * @param {number} roleId - 角色 ID
 * @param {string} roleName - 角色名称
 * @param {string} description - 角色描述
 * @param {array} routeIds - 关联菜单 ID 列表
 * @returns {object} 200 - 更新成功
 */
const updateRole = async (ctx) => {
  const { id, roleName, roleCode, roleDesc, routeIds = [] } = ctx.request.body
  const roleId = id
  const currentRole = await userRoleDao.findRoleById(roleId)

  if (!currentRole) {
    ctx.status = httpCode.ok
    ctx.body = { code: businessCode.roleNotFound, msg: businessMsg[businessCode.roleNotFound] }
    return
  }

  const existedRole = await userRoleDao.findRoleByName(roleName)
  if (existedRole && existedRole.roleId !== roleId) {
    ctx.status = httpCode.ok
    ctx.body = { code: businessCode.roleExist, msg: businessMsg[businessCode.roleExist] }
    return
  }

  await userRoleDao.updateRoleWithRoutes({
    roleId,
    roleName,
    description: JSON.stringify({
      roleCode,
      roleDesc
    }),
    routeIds: [...new Set(routeIds)]
  })

  ctx.status = httpCode.ok
  ctx.body = {
    code: businessCode.success,
    msg: '更新角色成功'
  }
}

/**
 * @summary 删除角色
 * @description 删除角色及其菜单权限绑定
 * @api DELETE /admin/system/roles
 * @param {number} roleId - 角色 ID
 * @returns {object} 200 - 删除成功
 */
const deleteRole = async (ctx) => {
  const roleId = ctx.request.body.roleId ?? ctx.request.body.id
  const currentRole = await userRoleDao.findRoleById(roleId)

  if (!currentRole) {
    ctx.status = httpCode.ok
    ctx.body = { code: businessCode.roleNotFound, msg: businessMsg[businessCode.roleNotFound] }
    return
  }

  const userCount = await userRoleDao.countUsersByRoleId(roleId)
  if (userCount > 0) {
    ctx.status = httpCode.ok
    ctx.body = { code: businessCode.roleInUse, msg: businessMsg[businessCode.roleInUse] }
    return
  }

  await userRoleDao.deleteRole(roleId)

  ctx.status = httpCode.ok
  ctx.body = {
    code: businessCode.success,
    msg: '删除角色成功'
  }
}

export default {
  listRoles,
  getAllRoles,
  getRoleRouteIds,
  getRoleButtonIds,
  updateRoleRouteIds,
  updateRoleButtonIds,
  getAllButtons,
  createRole,
  updateRole,
  deleteRole
}
