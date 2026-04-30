import { z } from 'zod'

const paginationSchema = {
  current: z.coerce.number().int().min(1).default(1),
  size: z.coerce.number().int().min(1).max(100).default(10)
}

export const roleManageUserCreateBodySchema = z.object({
  ...paginationSchema,
  roleName: z.string().trim().optional(),
  roleCode: z.string().trim().optional(),
  status: z.enum(['1', '2']).optional()
})

export const roleManageRoleRouteQuerySchema = z.object({
  roleId: z.coerce.number().int().positive()
})

export const roleManageRoleRouteBodySchema = z.object({
  roleId: z.coerce.number().int().positive(),
  routeIds: z.array(z.coerce.number().int().positive()).default([])
})

export const roleManageRoleButtonQuerySchema = z.object({
  roleId: z.coerce.number().int().positive()
})

export const roleManageRoleButtonBodySchema = z.object({
  roleId: z.coerce.number().int().positive(),
  buttonIds: z.array(z.coerce.number().int().positive()).default([])
})

export const roleManageRoleBodySchema = z.object({
  id: z.coerce.number().int().positive().optional(),
  roleName: z.string().trim().min(1),
  roleCode: z.string().trim().min(1),
  roleDesc: z.string().trim().optional().default(''),
  status: z.enum(['1', '2']).optional().default('1'),
  routeIds: z.array(z.coerce.number().int().positive()).optional().default([])
})

export const roleManageRoleDeleteBodySchema = z.object({
  id: z.coerce.number().int().positive().optional(),
  roleId: z.coerce.number().int().positive().optional(),
  ids: z.array(z.coerce.number().int().positive()).optional()
})
