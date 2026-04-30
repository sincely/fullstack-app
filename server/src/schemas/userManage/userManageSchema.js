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
  password: z.string().min(6, '密码至少 6 位'),
  gender: z.enum(['male', 'female', 'other', '1', '2']).optional().default('other'),
  age: z.coerce.number().int().min(0).max(150).nullable().optional(),
  idCard: z.string().trim().min(1, '身份证号不能为空'),
  email: z.string().email('邮箱格式不正确'),
  address: z.string().trim().max(255).nullable().optional(),
  status: z.enum(['active', 'inactive', 'banned', '1', '2']).optional().default('active'),
  avatar: z.string().trim().max(255).nullable().optional(),
  roleId: z.coerce.number().int().positive()
})
