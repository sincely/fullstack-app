import { nanoid } from '@sa/utils'
import axios, { AxiosError } from 'axios'
import axiosRetry from 'axios-retry'

import { BACKEND_ERROR_CODE, REQUEST_ID_KEY } from './constant.js'
import { createAxiosConfig, createDefaultOptions, createRetryOptions } from './options.js'

/**
 * 创建请求封装的公共能力。
 *
 * 这里不直接暴露给业务层，而是给 createRequest 与 createFlatRequest 复用：
 * 1) 创建 axios 实例
 * 2) 注入 retry 能力
 * 3) 注入请求/响应拦截器
 * 4) 维护请求取消能力
 */
function createCommonRequest(axiosConfig, options) {
  // 先把调用方传入的 options 与默认配置合并，避免每个 hook 都要判空。
  const opts = createDefaultOptions(options)

  // 统一补齐 axios 基础配置（超时、状态码判定、params 序列化等）。
  const axiosConf = createAxiosConfig(axiosConfig)
  const instance = axios.create(axiosConf)

  // requestId -> CancelTokenSource，用于按请求取消和全量取消。
  const cancelTokenSourceMap = new Map()

  // 配置自动重试。默认 3 次，可通过 axiosConfig 覆盖。
  const retryOptions = createRetryOptions(axiosConf)
  axiosRetry(instance, retryOptions)

  instance.interceptors.request.use((conf) => {
    const config = { ...conf }

    // 为每次请求生成 requestId，便于日志追踪和请求取消。
    const requestId = nanoid()
    config.headers.set(REQUEST_ID_KEY, requestId)

    // 绑定取消令牌，并将取消器缓存起来。
    // 说明：这里使用 axios.CancelToken（当前项目仍在用该机制）。
    const cancelTokenSource = axios.CancelToken.source()
    config.cancelToken = cancelTokenSource.token
    cancelTokenSourceMap.set(requestId, cancelTokenSource)

    // 暴露请求前 hook，让业务有机会动态改写请求配置（如 token、租户信息等）。
    const handledConfig = opts.onRequest?.(config) || config

    return handledConfig
  })

  instance.interceptors.response.use(
    async (response) => {
      // HTTP 2xx 才会进这里
      // 先判断按业务定义判断“后端是否成功”。
      // 注意：这一步与 HTTP 2xx 成功不同，它是后端业务码维度的成功判断。
      if (opts.isBackendSuccess(response)) {
        return Promise.resolve(response)
      }

      // 后端失败时先走 onBackendFail，允许外部兜底处理并返回可用结果。
      // 例如：刷新 token 后重放请求、弹窗后返回默认值等。
      const fail = await opts.onBackendFail(response, instance)
      console.log('fail', fail)
      if (fail) {
        return fail
      }

      // 未被 onBackendFail 吃掉时，统一包装成 AxiosError 抛出。
      const backendError = new AxiosError(
        'the backend request error',
        BACKEND_ERROR_CODE,
        response.config,
        response.request,
        response
      )

      // 统一错误钩子，便于日志上报、全局提示等。
      await opts.onError(backendError)

      return Promise.reject(backendError)
    },
    async (error) => {
      // HTTP 非 2xx（401, 403, 500, 网络错误等）直接进这里处理网络错误、超时、取消等异常。
      await opts.onError(error)

      return Promise.reject(error)
    }
  )

  /**
   * 取消指定 requestId 对应的请求。
   */
  function cancelRequest(requestId) {
    const cancelTokenSource = cancelTokenSourceMap.get(requestId)
    if (cancelTokenSource) {
      cancelTokenSource.cancel()
      cancelTokenSourceMap.delete(requestId)
    }
  }

  /**
   * 取消当前实例内所有未完成请求。
   */
  function cancelAllRequest() {
    cancelTokenSourceMap.forEach((cancelTokenSource) => {
      cancelTokenSource.cancel()
    })
    cancelTokenSourceMap.clear()
  }

  return {
    instance,
    opts,
    cancelRequest,
    cancelAllRequest
  }
}

/**
 * 创建标准请求实例。
 *
 * 返回值风格：
 * - 请求成功：直接返回业务 data
 * - 请求失败：抛出异常（由调用方 try/catch）
 *
 * @param axiosConfig axios 配置
 * @param options 请求选项
 */
export function createRequest(axiosConfig, options) {
  const { instance, opts, cancelRequest, cancelAllRequest } = createCommonRequest(axiosConfig, options)

  const request = async function request(config) {
    // 先拿到原始 axios 响应。
    const response = await instance(config)

    // 仅 json 响应走业务转换，文件流等类型直接返回原始 data。
    const responseType = response.config?.responseType || 'json'

    if (responseType === 'json') {
      return opts.transformBackendResponse(response)
    }

    return response.data
  }

  request.cancelRequest = cancelRequest
  request.cancelAllRequest = cancelAllRequest
  request.state = {}

  return request
}

/**
 * 创建平铺风格请求实例。
 *
 * 返回值统一为：{ data, error }
 * - 成功：error 为 null
 * - 失败：data 为 null
 *
 * 适合不想写 try/catch 的业务场景。
 *
 * @param axiosConfig axios 配置
 * @param options 请求选项
 */
export function createFlatRequest(axiosConfig, options) {
  const { instance, opts, cancelRequest, cancelAllRequest } = createCommonRequest(axiosConfig, options)

  const flatRequest = async function flatRequest(config) {
    try {
      const response = await instance(config)

      const responseType = response.config?.responseType || 'json'

      if (responseType === 'json') {
        const data = opts.transformBackendResponse(response)

        return { data, error: null }
      }

      return { data: response.data, error: null }
    } catch (error) {
      return { data: null, error }
    }
  }

  flatRequest.cancelRequest = cancelRequest
  flatRequest.cancelAllRequest = cancelAllRequest
  flatRequest.state = {}

  return flatRequest
}

export { BACKEND_ERROR_CODE, REQUEST_ID_KEY }
