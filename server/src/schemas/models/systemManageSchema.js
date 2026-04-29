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
