import { z } from 'zod'
import { createPaginatedQuerySchema } from '../common/paginationSchema.js'

// 角色/菜单状态枚举（前端兼容 1=启用 2=禁用）
const adminStatusEnum = z.enum(['1', '2'])

// 角色列表查询参数
export const RoleListQuerySchema = createPaginatedQuerySchema({
  roleName: z.string().max(100).optional(),
  roleCode: z.string().max(100).optional(),
  status: adminStatusEnum.optional()
})

// 创建角色请求体
export const RoleCreateBodySchema = z.object({
  roleName: z.string().min(2, '角色名至少 2 位').max(50, '角色名最长 50 位'),
  roleCode: z.string().min(2, '角色编码至少 2 位').max(50, '角色编码最长 50 位'),
  roleDesc: z.string().max(255, '角色描述最长 255 位').optional().default(''),
  status: adminStatusEnum.default('1'),
  routeIds: z.array(z.coerce.number().int().positive()).default([])
})

// 更新角色请求体
export const RoleUpdateBodySchema = z
  .object({
    roleId: z.coerce.number().int().positive().optional(),
    id: z.coerce.number().int().positive().optional(),
    roleName: z.string().min(2, '角色名至少 2 位').max(50, '角色名最长 50 位'),
    roleCode: z.string().min(2, '角色编码至少 2 位').max(50, '角色编码最长 50 位'),
    roleDesc: z.string().max(255, '角色描述最长 255 位').optional().default(''),
    status: adminStatusEnum.default('1'),
    routeIds: z.array(z.coerce.number().int().positive()).default([])
  })
  .refine((data) => Boolean(data.roleId || data.id), {
    message: '角色ID不能为空'
  })

// 删除角色请求体
export const RoleDeleteBodySchema = z
  .object({
    roleId: z.coerce.number().int().positive().optional(),
    id: z.coerce.number().int().positive().optional()
  })
  .refine((data) => Boolean(data.roleId || data.id), {
    message: '角色ID不能为空'
  })
