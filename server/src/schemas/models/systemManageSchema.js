import { z } from 'zod'

// 用户状态枚举（前端兼容 1=启用 2=禁用；数据库层再转换为 1/0）
const userStatusEnum = z.enum(['1', '2'])
// 性别枚举
const genderEnum = z.enum(['1', '2'])
// 角色/菜单状态枚举（前端兼容 1=启用 2=禁用）
const adminStatusEnum = z.enum(['1', '2'])

// 用户列表查询参数（前端兼容：current/size 与 page/pageSize 都支持）
export const UserListQuerySchema = z.object({
  current: z.coerce.number().int().min(1).default(1),
  size: z.coerce.number().int().min(1).max(100).default(10),
  page: z.coerce.number().int().min(1).optional(),
  pageSize: z.coerce.number().int().min(1).max(100).optional(),
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

// 角色列表查询参数
export const RoleListQuerySchema = z.object({
  current: z.coerce.number().int().min(1).default(1),
  size: z.coerce.number().int().min(1).max(100).default(10),
  page: z.coerce.number().int().min(1).optional(),
  pageSize: z.coerce.number().int().min(1).max(100).optional(),
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

// 菜单列表查询参数（前端兼容：current/size 与 page/pageSize 都支持）
export const MenuListQuerySchema = z.object({
  current: z.coerce.number().int().min(1).default(1),
  size: z.coerce.number().int().min(1).max(100).default(10),
  page: z.coerce.number().int().min(1).optional(),
  pageSize: z.coerce.number().int().min(1).max(100).optional(),
  keyword: z
    .string()
    .max(100)
    .optional()
    .transform((v) => v || '')
})

// 创建菜单请求体
export const MenuCreateBodySchema = z.object({
  parentId: z.coerce.number().int().nonnegative().nullable().optional(),
  menuType: z.coerce.number().int().min(1).max(2).default(2),
  menuName: z.string().min(1, '菜单名称不能为空').max(50, '菜单名称最长 50 位'),
  routeName: z.string().min(1, '路由名称不能为空').max(255, '路由名称最长 255 位'),
  routePath: z.string().min(1, '路由路径不能为空').max(255, '路由路径最长 255 位'),
  component: z.string().max(255, 'component 最长 255 位').nullable().optional(),
  redirect: z.string().max(255, 'redirect 最长 255 位').nullable().optional(),
  orderNum: z.coerce.number().int().min(0).default(0),
  icon: z.string().max(255, 'icon 最长 255 位').nullable().optional(),
  iconType: z.coerce.number().int().min(1).default(1),
  hideInMenu: z.boolean().default(false).optional(),
  activeMenu: z.string().max(255, 'activeMenu 最长 255 位').nullable().optional(),
  multiTab: z.boolean().default(false).optional(),
  keepAlive: z.boolean().default(false).optional(),
  status: adminStatusEnum.default('1'),
  buttons: z
    .array(
      z.object({
        code: z.string().min(1, '按钮编码不能为空').max(100, '按钮编码最长 100 位'),
        desc: z.string().max(50, '按钮描述最长 50 位').optional().default('')
      })
    )
    .optional()
    .default([])
})

// 更新菜单请求体（至少提供一个变更字段）
export const MenuUpdateBodySchema = z
  .object({
    id: z.coerce.number().int().positive(),
    parentId: z.coerce.number().int().nonnegative().nullable().optional(),
    menuType: z.coerce.number().int().min(1).max(2).optional(),
    menuName: z.string().min(1, '菜单名称不能为空').max(50, '菜单名称最长 50 位').optional(),
    routeName: z.string().min(1, '路由名称不能为空').max(255, '路由名称最长 255 位').optional(),
    routePath: z.string().min(1, '路由路径不能为空').max(255, '路由路径最长 255 位').optional(),
    component: z.string().max(255, 'component 最长 255 位').nullable().optional(),
    redirect: z.string().max(255, 'redirect 最长 255 位').nullable().optional(),
    orderNum: z.coerce.number().int().min(0).optional(),
    icon: z.string().max(255, 'icon 最长 255 位').nullable().optional(),
    iconType: z.coerce.number().int().min(1).optional(),
    hideInMenu: z.boolean().optional(),
    activeMenu: z.string().max(255, 'activeMenu 最长 255 位').nullable().optional(),
    multiTab: z.boolean().optional(),
    keepAlive: z.boolean().optional(),
    status: adminStatusEnum.optional(),
    buttons: z
      .array(
        z.object({
          code: z.string().min(1, '按钮编码不能为空').max(100, '按钮编码最长 100 位'),
          desc: z.string().max(50, '按钮描述最长 50 位').optional().default('')
        })
      )
      .optional()
  })
  .refine((data) => Object.keys(data).length > 1, {
    message: '至少提供一个需要更新的字段'
  })

// 删除菜单请求体
export const MenuDeleteBodySchema = z
  .object({
    id: z.coerce.number().int().positive().optional(),
    ids: z.array(z.coerce.number().int().positive()).optional()
  })
  .refine((data) => Boolean(data.id || (data.ids && data.ids.length > 0)), {
    message: '至少提供一个菜单ID'
  })
