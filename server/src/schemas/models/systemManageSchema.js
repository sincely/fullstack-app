import { z } from 'zod'

const paginationSchema = {
  current: z.coerce.number().int().min(1).default(1),
  size: z.coerce.number().int().min(1).max(100).default(10)
}

export const SystemManageRoleListQuerySchema = z.object({
  ...paginationSchema,
  roleName: z.string().trim().optional(),
  roleCode: z.string().trim().optional(),
  status: z.enum(['1', '2']).optional()
})

export const SystemManageUserListQuerySchema = z.object({
  ...paginationSchema,
  userName: z.string().trim().optional(),
  userGender: z.enum(['1', '2']).optional(),
  nickName: z.string().trim().optional(),
  userPhone: z.string().trim().optional(),
  userEmail: z.string().trim().optional(),
  userStatus: z.enum(['1', '2']).optional(),
  status: z.enum(['1', '2']).optional()
})

export const SystemManageMenuListQuerySchema = z.object({
  ...paginationSchema
})

const menuQueryItemSchema = z.object({
  key: z.string().trim().min(1),
  value: z.string().trim()
})

const menuButtonSchema = z.object({
  code: z.string().trim().min(1),
  desc: z.string().trim().min(1)
})

export const SystemManageMenuBodySchema = z.object({
  id: z.coerce.number().int().positive().optional(),
  parentId: z.coerce.number().int().min(0).default(0),
  menuType: z.enum(['1', '2']),
  menuName: z.string().trim().min(1),
  routeName: z.string().trim().min(1),
  routePath: z.string().trim().min(1),
  component: z.string().trim().optional().nullable(),
  i18nKey: z.string().trim().optional().nullable(),
  icon: z.string().trim().optional().nullable(),
  iconType: z.enum(['1', '2']).optional().default('1'),
  order: z.coerce.number().int().min(0).default(0),
  status: z.enum(['1', '2']).default('1'),
  keepAlive: z.coerce.boolean().optional().default(false),
  constant: z.coerce.boolean().optional().default(false),
  href: z.string().trim().optional().nullable(),
  hideInMenu: z.coerce.boolean().optional().default(false),
  activeMenu: z.string().trim().optional().nullable(),
  multiTab: z.coerce.boolean().optional().default(false),
  fixedIndexInTab: z.coerce.number().int().min(0).optional().nullable(),
  query: z.array(menuQueryItemSchema).optional().default([]),
  buttons: z.array(menuButtonSchema).optional().default([])
})

export const SystemManageMenuDeleteBodySchema = z.object({
  id: z.coerce.number().int().positive().optional(),
  ids: z.array(z.coerce.number().int().positive()).optional()
})

export const SystemManageRoleRouteQuerySchema = z.object({
  roleId: z.coerce.number().int().positive()
})

export const SystemManageRoleRouteBodySchema = z.object({
  roleId: z.coerce.number().int().positive(),
  routeIds: z.array(z.coerce.number().int().positive()).default([])
})

export const SystemManageRoleButtonQuerySchema = z.object({
  roleId: z.coerce.number().int().positive()
})

export const SystemManageRoleButtonBodySchema = z.object({
  roleId: z.coerce.number().int().positive(),
  buttonIds: z.array(z.coerce.number().int().positive()).default([])
})

export const SystemManageRoleBodySchema = z.object({
  id: z.coerce.number().int().positive().optional(),
  roleName: z.string().trim().min(1),
  roleCode: z.string().trim().min(1),
  roleDesc: z.string().trim().optional().default(''),
  status: z.enum(['1', '2']).optional().default('1'),
  routeIds: z.array(z.coerce.number().int().positive()).optional().default([])
})

export const SystemManageRoleDeleteBodySchema = z.object({
  id: z.coerce.number().int().positive().optional(),
  roleId: z.coerce.number().int().positive().optional(),
  ids: z.array(z.coerce.number().int().positive()).optional()
})
