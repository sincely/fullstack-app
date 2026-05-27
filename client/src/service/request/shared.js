import { useAuthStore } from '@/store/modules/auth'
import { localStg } from '@/utils/storage'

import { fetchRefreshToken } from '../api'

/**
 * 刷新 token
 * @param axiosConfig token 过期时原始请求配置
 */
export async function handleRefreshToken(axiosConfig) {
  const { resetStore } = useAuthStore()

  const refreshToken = localStg.get('refreshToken') || ''

  // 如果没有refreshToken，直接重置store并返回null
  if (!refreshToken) {
    resetStore()
    return null
  }

  try {
    const { error, data } = await fetchRefreshToken(refreshToken)

    // 如果刷新成功，更新本地存储的token
    if (!error && data) {
      localStg.set('token', data.token)
      localStg.set('refreshToken', data.refreshToken)

      // 更新原始请求的Authorization头
      const config = { ...axiosConfig }
      if (config.headers) {
        config.headers.Authorization = `Bearer ${data.token}`
      }

      return config
    }

    // 如果刷新失败，重置store
    resetStore()
    return null
  } catch (err) {
    // 如果请求过程中发生异常，重置store
    console.error('Refresh token failed:', err)
    resetStore()
    return null
  }
}
