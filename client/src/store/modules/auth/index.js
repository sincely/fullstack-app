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

  /** is super role in static route */
  const isStaticSuper = computed(() => {
    const { VITE_AUTH_ROUTE_MODE, VITE_STATIC_SUPER_ROLE } = import.meta.env

    return VITE_AUTH_ROUTE_MODE === 'static' && userInfo.roles.includes(VITE_STATIC_SUPER_ROLE)
  })

  /** Is login */
  const isLogin = computed(() => Boolean(token.value))

  /** Reset auth store */
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
   * Login
   *
   * @param userName User name
   * @param password Password
   * @param [redirect=true] Whether to redirect after login. Default is `true`
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
