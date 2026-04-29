/**
 * 请求唯一标识 header 名称。
 * 用于链路追踪与请求取消映射。
 */
export const REQUEST_ID_KEY = 'X-Request-Id'

/**
 * 后端业务错误的错误码标识。
 * 用于与网络错误等其他 AxiosError 区分。
 */
export const BACKEND_ERROR_CODE = 'BACKEND_ERROR'
