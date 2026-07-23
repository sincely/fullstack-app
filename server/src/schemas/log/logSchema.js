import { z } from 'zod'
import { createPaginatedQuerySchema } from '../common/paginationSchema.js'

const statusEnum = z.enum(['0', '1'])

// 操作日志列表查询参数
export const OperationLogListQuerySchema = createPaginatedQuerySchema({
  username: z.string().max(50).optional(),
  action: z.string().max(100).optional(),
  status: statusEnum.optional(),
  startTime: z.string().optional(),
  endTime: z.string().optional()
})

// 登录日志列表查询参数
export const LoginLogListQuerySchema = createPaginatedQuerySchema({
  username: z.string().max(50).optional(),
  ipAddress: z.string().max(45).optional(),
  status: statusEnum.optional(),
  startTime: z.string().optional(),
  endTime: z.string().optional()
})

// 批量删除日志请求体
export const LogBatchDeleteBodySchema = z.object({
  ids: z.array(z.coerce.number().int().positive()).min(1, '至少选择一条日志')
})
