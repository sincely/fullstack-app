import { z } from 'zod'

// 用户名规则：字母开头，5-16 位，允许字母/数字/下划线
const usernameRule = /^[a-zA-Z][a-zA-Z0-9_]{4,15}$/
// 密码规则：6-20 位，允许常见特殊字符
const passwordRule = /^[a-zA-Z0-9_!@#$%^&*().,\-+=]{6,20}$/

// 登录请求体校验
export const userLoginBodySchema = z.object({
  username: z.string().regex(usernameRule, '用户名格式不正确'),
  password: z.string().regex(passwordRule, '密码格式不正确，长度需为 6-20 位')
})

// 接口文档 `/user/auth/login` 请求体校验：字段名固定为 userName
export const AuthLoginBodySchema = z.object({
  userName: z.string().regex(usernameRule, '用户名格式不正确'),
  password: z.string().regex(passwordRule, '密码格式不正确，长度需为 6-20 位')
})

// 刷新 token 请求体校验
export const RefreshTokenBodySchema = z.object({
  refreshToken: z.string().min(1, 'refreshToken 不能为空')
})

// 注册请求体校验（含确认密码一致性检查）
export const userRegisterBodySchema = z
  .object({
    username: z.string().regex(usernameRule, '用户名格式不正确'),
    password: z.string().regex(passwordRule, '密码格式不正确，长度需为 6-20 位'),
    confirmPassword: z.string().min(1, '确认密码不能为空'),
    email: z.email('邮箱格式不正确')
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: '两次输入的密码不一致',
    path: ['confirmPassword']
  })
