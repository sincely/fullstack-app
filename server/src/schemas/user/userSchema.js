import { z } from 'zod'
import { createPaginatedQuerySchema } from '../common/paginationSchema.js'

// 用户状态枚举（前端兼容 1=启用 2=禁用；数据库层再转换为 1/0）
const userStatusEnum = z.enum(['1', '2'])
// 性别枚举
const genderEnum = z.enum(['1', '2'])

// 用户列表查询参数（前端兼容：current/size 与 page/pageSize 都支持）
export const UserListQuerySchema = createPaginatedQuerySchema({
  keyword: z
    .string()
    .max(100)
    .optional()
    .transform((v) => v || ''),
  userName: z.string().max(100).optional(),
  userGender: genderEnum.optional(),
  nickName: z.string().max(100).optional(),
  userPhone: z.string().max(20).optional(),
  userEmail: z.string().max(100).optional(),
  status: userStatusEnum.optional(),
  roleId: z.coerce.number().int().positive().optional()
})

// 创建用户请求体
export const UserCreateBodySchema = z.object({
  username: z.string().min(2, '用户名至少 2 位').max(50, '用户名最长 50 位'),
  password: z.string().min(6, '密码至少 6 位').max(20, '密码最长 20 位').optional(),
  gender: genderEnum.default('1'),
  age: z.coerce.number().int().min(0).max(150).nullable().optional(),
  idCard: z.string().min(6, '身份证号不能为空').max(20, '身份证号最长 20 位').optional(),
  email: z.email('邮箱格式不正确'),
  phone: z.string().max(20, '手机号最长 20 位').optional(),
  nickName: z.string().max(50, '昵称最长 50 位').optional(),
  address: z.string().max(255, '地址最长 255 位').nullable().optional(),
  status: userStatusEnum.default('1'),
  avatar: z.string().max(255, '头像地址最长 255 位').nullable().optional(),
  roleId: z.coerce.number().int().positive()
})

// 更新用户请求体（至少提供一个变更字段）
export const UserUpdateBodySchema = z
  .object({
    id: z.coerce.number().int().positive(),
    password: z.string().min(6, '密码至少 6 位').max(20, '密码最长 20 位').optional(),
    gender: genderEnum.optional(),
    age: z.coerce.number().int().min(0).max(150).nullable().optional(),
    idCard: z.string().min(6, '身份证号不能为空').max(20, '身份证号最长 20 位').optional(),
    email: z.email('邮箱格式不正确').optional(),
    phone: z.string().max(20, '手机号最长 20 位').optional(),
    nickName: z.string().max(50, '昵称最长 50 位').optional(),
    address: z.string().max(255, '地址最长 255 位').nullable().optional(),
    status: userStatusEnum.optional(),
    avatar: z.string().max(255, '头像地址最长 255 位').nullable().optional(),
    roleId: z.coerce.number().int().positive().optional()
  })
  .refine((data) => Object.keys(data).length > 1, {
    message: '至少提供一个需要更新的字段'
  })

// 删除用户请求体
export const UserDeleteBodySchema = z.object({
  id: z.coerce.number().int().positive()
})

// 批量删除用户请求体
export const UserBatchDeleteBodySchema = z.object({
  ids: z.array(z.coerce.number().int().positive()).min(1, '至少选择一个用户')
})

// 更新用户状态请求体
export const UserStatusUpdateBodySchema = z.object({
  id: z.coerce.number().int().positive(),
  status: userStatusEnum
})

// 重置用户密码请求体
export const UserPasswordResetBodySchema = z.object({
  id: z.coerce.number().int().positive()
})
