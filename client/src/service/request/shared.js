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
  const { error, data } = await fetchRefreshToken(refreshToken)
  if (!error) {
    localStg.set('token', data.token)
    localStg.set('refreshToken', data.refreshToken)

    const config = { ...axiosConfig }
    if (config.headers) {
      config.headers.Authorization = data.token
    }

    return config
  }

  resetStore()

  return null
}
