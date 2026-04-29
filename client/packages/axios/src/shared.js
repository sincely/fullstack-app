/**
 * 获取请求 Content-Type。
 *
 * 当调用方未显式设置时，默认按 json 处理。
 */
export function getContentType(config) {
  const contentType = config.headers?.['Content-Type'] || 'application/json'

  return contentType
}

/**
 * 判断 HTTP 状态码是否成功。
 *
 * 规则：2xx 或 304。
 *
 * @param status HTTP 状态码
 */
export function isHttpSuccess(status) {
  const isSuccessCode = status >= 200 && status < 300
  return isSuccessCode || status === 304
}

/**
 * 判断响应是否为 json 类型。
 *
 * @param response axios 响应
 */
export function isResponseJson(response) {
  const { responseType } = response.config

  return responseType === 'json' || responseType === undefined
}
