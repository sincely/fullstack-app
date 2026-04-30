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
