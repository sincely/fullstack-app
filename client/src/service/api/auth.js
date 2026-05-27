import { request } from '../request'

/**
 * 登录
 *
 * @param userName 用户名
 * @param password 密码
 */
export function fetchLogin(userName, password) {
  return request({
    url: '/user/auth/login',
    method: 'post',
    data: {
      userName,
      password
    }
  })
}

/** 获取用户信息 */
export function fetchGetUserInfo() {
  return request({ url: '/user/getUserInfo' })
}

/**
 * 刷新 token
 *
 * @param refreshToken 刷新 token
 */
export function fetchRefreshToken(refreshToken) {
  return request({
    url: '/user/auth/refreshToken',
    method: 'post',
    data: {
      refreshToken
    }
  })
}

/** 退出登录 */
export function fetchLogout() {
  return request({
    url: '/user/auth/logout',
    method: 'post'
  })
}

/**
 * 返回自定义后端错误
 *
 * @param code 错误码
 * @param msg 错误信息
 */
export function fetchCustomBackendError(code, msg) {
  return request({ url: '/user/auth/error', params: { code, msg } })
}
