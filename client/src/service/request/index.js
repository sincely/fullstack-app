import { BACKEND_ERROR_CODE, createFlatRequest, createRequest } from '@sa/axios'

import { useAuthStore } from '@/store/modules/auth'
import { getServiceBaseURL } from '@/utils/service'
import { localStg } from '@/utils/storage'

import { handleRefreshToken } from './shared'

const isHttpProxy = import.meta.env.DEV && import.meta.env.VITE_HTTP_PROXY === 'Y'
const { baseURL, otherBaseURL } = getServiceBaseURL(import.meta.env, isHttpProxy)
const toCodeString = (code) => String(code ?? '').trim()
const parseCodeList = (rawValue) =>
  String(rawValue ?? '')
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean)

export const request = createFlatRequest(
  {
    baseURL
    // headers: {
    //   apifoxToken: 'XL299LiMEDZ0H5h3A29PxwQXdMJqWyY2'
    // }
  },
  {
    async onRequest(config) {
      const { headers } = config

      // 注入鉴权 token
      const token = localStg.get('token')
      const Authorization = token ? `Bearer ${token}` : null
      Object.assign(headers, { Authorization })

      return config
    },
    isBackendSuccess(response) {
      console.log('response', response)
      // 后端响应码命中 `VITE_SERVICE_SUCCESS_CODE` 时视为请求成功
      // 如需自定义成功判定，可修改 `.env` 中的 `VITE_SERVICE_SUCCESS_CODE`
      const backendCode = toCodeString(response.data.code)
      return backendCode === toCodeString(import.meta.env.VITE_SERVICE_SUCCESS_CODE)
    },
    async onBackendFail(response, instance) {
      const authStore = useAuthStore()
      const backendCode = toCodeString(response.data.code)

      function handleLogout() {
        authStore.resetStore()
      }

      function logoutAndCleanup() {
        handleLogout()
        window.removeEventListener('beforeunload', handleLogout)
      }

      // 命中 `logoutCodes` 时，直接登出并跳转登录页
      const logoutCodes = parseCodeList(import.meta.env.VITE_SERVICE_LOGOUT_CODES)
      if (logoutCodes.includes(backendCode)) {
        handleLogout()
        return null
      }

      // 命中 `modalLogoutCodes` 时，通过弹窗提示并登出
      const modalLogoutCodes = parseCodeList(import.meta.env.VITE_SERVICE_MODAL_LOGOUT_CODES)
      if (modalLogoutCodes.includes(backendCode)) {
        // 防止用户在处理弹窗期间刷新页面
        window.addEventListener('beforeunload', handleLogout)

        window.$modal?.error({
          title: 'Error',
          content: response.data.msg,
          okText: '确认',
          maskClosable: false,
          onOk() {
            logoutAndCleanup()
          },
          onCancel() {
            logoutAndCleanup()
          }
        })

        return null
      }

      // 命中 `expiredTokenCodes` 时，执行刷新 token 并重试请求
      // 刷新 token 接口不能再返回 `expiredTokenCodes`，否则会死循环，应返回登出类错误码
      const expiredTokenCodes = parseCodeList(import.meta.env.VITE_SERVICE_EXPIRED_TOKEN_CODES)
      if (expiredTokenCodes.includes(backendCode) && !request.state.isRefreshingToken) {
        request.state.isRefreshingToken = true

        try {
          const refreshConfig = await handleRefreshToken(response.config)

          request.state.isRefreshingToken = false

          if (refreshConfig) {
            return instance.request(refreshConfig)
          }
        } catch (err) {
          request.state.isRefreshingToken = false
          console.error('Token refresh failed:', err)
        }
      }

      // 针对 1002 (accountKicked) 等特殊登出码，即使不在 expiredTokenCodes 中也触发登出
      if (backendCode === '1002') {
        handleLogout()
        return null
      }

      return null
    },
    transformBackendResponse(response) {
      return response.data.data
    },
    onError(error) {
      // 请求失败时统一错误提示

      let { message } = error
      console.log('error', error)
      let backendErrorCode = ''

      // 提取后端返回的错误信息与错误码
      if (error.code === BACKEND_ERROR_CODE) {
        message = error.response?.data?.msg || message
        backendErrorCode = toCodeString(error.response?.data?.code)
      }

      // 弹窗登出类错误已在弹窗中处理，这里不重复提示
      const modalLogoutCodes = parseCodeList(import.meta.env.VITE_SERVICE_MODAL_LOGOUT_CODES)
      if (modalLogoutCodes.includes(backendErrorCode)) {
        return
      }

      // token 过期会走刷新并重试，无需重复提示
      const expiredTokenCodes = parseCodeList(import.meta.env.VITE_SERVICE_EXPIRED_TOKEN_CODES)
      if (expiredTokenCodes.includes(backendErrorCode)) {
        return
      }

      window.$message?.error?.(message)
    }
  }
)

export const demoRequest = createRequest(
  {
    baseURL: otherBaseURL.demo
  },
  {
    async onRequest(config) {
      const { headers } = config

      // 注入鉴权 token
      const token = localStg.get('token')
      const Authorization = token ? `Bearer ${token}` : null
      Object.assign(headers, { Authorization })

      return config
    },
    isBackendSuccess(response) {
      // 后端响应状态为 "200" 时视为请求成功
      // 可按业务需要自行调整该判定逻辑
      return response.data.status === '200'
    },
    async onBackendFail(_response) {
      // 后端状态非 "200" 时会进入该分支
      // 例如：token 过期后刷新 token 并重试请求
    },
    transformBackendResponse(response) {
      return response.data.result
    },
    onError(error) {
      // 请求失败时统一错误提示

      let { message } = error

      // 优先展示后端返回的错误信息
      if (error.code === BACKEND_ERROR_CODE) {
        message = error.response?.data?.message || message
      }

      window.$message?.error(message)
    }
  }
)
