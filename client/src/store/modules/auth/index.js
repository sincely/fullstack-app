import { useLoading } from '@sa/hooks'
import { defineStore } from 'pinia'
import { computed, reactive, ref } from 'vue'

import { SetupStoreId } from '@/enum'
import { useRouterPush } from '@/hooks/common/router'
import { fetchGetUserInfo, fetchLogin } from '@/service/api'
import { localStg } from '@/utils/storage'

import { useRouteStore } from '../route'
import { clearAuthStorage, getToken, getUserInfo } from './shared'

export const useAuthStore = defineStore(SetupStoreId.Auth, () => {
  const routeStore = useRouteStore()
  const { route, toLogin, redirectFromLogin } = useRouterPush(false)
  const { loading: loginLoading, startLoading, endLoading } = useLoading()

  const token = ref(getToken())

  const userInfo = reactive(getUserInfo())

  /** 是否为静态路由模式下的超级管理员角色 */
  const isStaticSuper = computed(() => {
    const { VITE_AUTH_ROUTE_MODE, VITE_STATIC_SUPER_ROLE } = import.meta.env
    console.log(VITE_AUTH_ROUTE_MODE, VITE_STATIC_SUPER_ROLE, userInfo.roles)
    return VITE_AUTH_ROUTE_MODE === 'static' && userInfo.roles.includes(VITE_STATIC_SUPER_ROLE)
  })

  /** 是否已登录 */
  const isLogin = computed(() => Boolean(token.value))

  /** 重置 auth store */
  async function resetStore() {
    const authStore = useAuthStore()

    clearAuthStorage()

    authStore.$reset()

    if (!route.value.meta.constant) {
      await toLogin()
    }

    routeStore.resetStore()
  }

  /**
   * 用户登录
   *
   * @param userName 用户名
   * @param password 密码
   * @param [redirect=true] 登录后是否重定向，默认为 `true`
   */
  async function login(userName, password, redirect = true) {
    startLoading()

    const { data: loginToken, error } = await fetchLogin(userName, password)

    if (!error) {
      const pass = await loginByToken(loginToken)

      if (pass) {
        await routeStore.initAuthRoute()

        if (redirect) {
          await redirectFromLogin()
        }

        if (routeStore.isInitAuthRoute) {
          window.$notification?.success({
            message: '登录成功',
            description: `欢迎回来，${userInfo.userName} ！`
          })
        }
      }
    } else {
      resetStore()
    }

    endLoading()
  }

  async function loginByToken(loginToken) {
    // 1. stored in the localStorage, the later requests need it in headers
    localStg.set('token', loginToken.token)
    localStg.set('refreshToken', loginToken.refreshToken)

    const { data: info, error } = await fetchGetUserInfo()

    if (!error) {
      // 2. store user info
      localStg.set('userInfo', info)

      // 3. update store
      token.value = loginToken.token
      Object.assign(userInfo, info)

      return true
    }

    return false
  }

  return {
    token,
    userInfo,
    isStaticSuper,
    isLogin,
    loginLoading,
    resetStore,
    login
  }
})
