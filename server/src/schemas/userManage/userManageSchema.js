import { z } from 'zod'

const paginationSchema = {
  current: z.coerce.number().int().min(1).default(1),
  size: z.coerce.number().int().min(1).max(100).default(10)
}

export const userManageUserListQuerySchema = z.object({
  ...paginationSchema,
  userName: z.string().trim().optional(),
  userGender: z.enum(['1', '2']).optional(),
  nickName: z.string().trim().optional(),
  userPhone: z.string().trim().optional(),
  userEmail: z.string().trim().optional(),
  userStatus: z.enum(['1', '2']).optional(),
  status: z.enum(['1', '2']).optional()
})

export const userManageUserCreateBodySchema = z.object({
  username: z.string().trim().min(1, '用户名不能为空'),
  gender: z.enum(['male', 'female', 'other', '1', '2']).optional().default('1'),
  age: z.coerce.number().int().min(0).max(150).nullable().optional(),
  email: z.string().email('邮箱格式不正确'),
  status: z.enum(['active', 'inactive', 'banned', '1', '2']).optional().default('active'),
  roleId: z.coerce.number().int().positive(),
  phone: z.string().trim().max(20).optional(),
  nickName: z.string().trim().max(50).optional(),
  avatar: z.string().trim().max(255).optional()
})

export const userManageUserUpdateBodySchema = z
  .object({
    id: z.coerce.number().int().positive(),
    password: z.string().min(6, '密码至少 6 位').optional(),
    gender: z.enum(['male', 'female', 'other', '1', '2']).optional(),
    age: z.coerce.number().int().min(0).max(150).nullable().optional(),
    email: z.string().email('邮箱格式不正确').optional(),
    status: z.enum(['active', 'inactive', 'banned', '1', '2']).optional(),
    avatar: z.string().trim().max(255).nullable().optional(),
    roleId: z.coerce.number().int().positive().optional()
  })
  .refine((data) => Object.keys(data).length > 1, {
    message: '至少提供一个需要更新的字段'
  })

export const userManageUserDeleteBodySchema = z.object({
  id: z.coerce.number().int().positive()
})
