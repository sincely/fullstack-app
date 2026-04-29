import { stringify } from 'qs'

import { isHttpSuccess } from './shared'

/**
 * 创建请求选项默认值。
 *
 * 设计目的：
 * - 给每个 hook 提供可调用默认实现
 * - 让上层可按需覆盖局部行为，而不是必须完整传入一整套回调
 */
export function createDefaultOptions(options) {
  const opts = {
    // 请求发出前的配置处理
    onRequest: async (config) => config,
    // 业务成功判定（后端业务码维度）
    isBackendSuccess: (_response) => true,
    // 后端业务失败时的兜底处理
    onBackendFail: async () => {},
    // 把后端响应转换成业务层真正需要的数据结构
    transformBackendResponse: async (response) => response.data,
    // 全局错误处理
    onError: async () => {}
  }

  // 外部传入优先级更高。
  Object.assign(opts, options)

  return opts
}

/**
 * 创建重试配置。
 *
 * 注意：当前实现是把 axios 配置对象合并进 retry 配置。
 * 由于 axios-retry 会忽略无关字段，所以不会影响行为。
 */
export function createRetryOptions(config) {
  const retryConfig = {
    retries: 3
  }

  Object.assign(retryConfig, config)

  return retryConfig
}

/**
 * 创建 axios 默认配置。
 *
 * 默认策略：
 * - timeout: 10s
 * - Content-Type: application/json
 * - validateStatus: 仅 2xx 与 304 视为 HTTP 成功
 * - paramsSerializer: 使用 qs 序列化查询参数
 */
export function createAxiosConfig(config) {
  const TEN_SECONDS = 10 * 1000

  const axiosConfig = {
    timeout: TEN_SECONDS,
    headers: {
      'Content-Type': 'application/json'
    },
    validateStatus: isHttpSuccess,
    paramsSerializer: (params) => {
      return stringify(params)
    }
  }

  // 调用方传入配置覆盖默认值。
  Object.assign(axiosConfig, config)

  return axiosConfig
}
