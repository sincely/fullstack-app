import { z } from 'zod'
import { createPaginatedQuerySchema } from '../common/paginationSchema.js'

// 角色/菜单状态枚举（前端兼容 1=启用 2=禁用）
const adminStatusEnum = z.enum(['1', '2'])

// 菜单列表查询参数（前端兼容：current/size 与 page/pageSize 都支持）
export const MenuListQuerySchema = createPaginatedQuerySchema({
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
