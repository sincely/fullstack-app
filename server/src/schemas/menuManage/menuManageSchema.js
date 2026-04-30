import { z } from 'zod'

const paginationSchema = {
  current: z.coerce.number().int().min(1).default(1),
  size: z.coerce.number().int().min(1).max(100).default(10)
}

const menuQueryItemSchema = z.object({
  key: z.string().trim().min(1),
  value: z.string().trim()
})

const menuButtonSchema = z.object({
  code: z.string().trim().min(1),
  desc: z.string().trim().min(1)
})

export const SystemManageMenuListQuerySchema = z.object({
  ...paginationSchema
})

export const SystemManageMenuBodySchema = z.object({
  id: z.coerce.number().int().positive().optional(),
  parentId: z.coerce.number().int().min(0).default(0),
  menuType: z.enum(['1', '2']),
  menuName: z.string().trim().min(1),
  routeName: z.string().trim().min(1),
  routePath: z.string().trim().min(1),
  component: z.string().trim().optional().nullable(),
  i18nKey: z.string().trim().optional().nullable(),
  icon: z.string().trim().optional().nullable(),
  iconType: z.enum(['1', '2']).optional().default('1'),
  order: z.coerce.number().int().min(0).default(0),
  status: z.enum(['1', '2']).default('1'),
  keepAlive: z.coerce.boolean().optional().default(false),
  constant: z.coerce.boolean().optional().default(false),
  href: z.string().trim().optional().nullable(),
  hideInMenu: z.coerce.boolean().optional().default(false),
  activeMenu: z.string().trim().optional().nullable(),
  multiTab: z.coerce.boolean().optional().default(false),
  fixedIndexInTab: z.coerce.number().int().min(0).optional().nullable(),
  query: z.array(menuQueryItemSchema).optional().default([]),
  buttons: z.array(menuButtonSchema).optional().default([])
})

export const SystemManageMenuDeleteBodySchema = z.object({
  id: z.coerce.number().int().positive().optional(),
  ids: z.array(z.coerce.number().int().positive()).optional()
})
