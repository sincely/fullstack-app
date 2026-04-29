import { localStg } from '@/utils/storage'

/** 获取 token */
export function getToken() {
  return localStg.get('token') || ''
}

/** 获取用户信息 */
export function getUserInfo() {
  const emptyInfo = {
    userId: '',
    userName: '',
    roles: [],
    buttons: []
  }
  const userInfo = localStg.get('userInfo') || emptyInfo

  // 兼容旧数据：补齐 buttons 字段（预计在 `1.1.0` 后移除）
  if (!userInfo.buttons) {
    userInfo.buttons = []
  }

  return userInfo
}

/** 清理认证相关本地缓存 */
export function clearAuthStorage() {
  localStg.remove('token')
  localStg.remove('refreshToken')
  localStg.remove('userInfo')
}
