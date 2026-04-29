import { useEventListener, usePreferredColorScheme } from '@vueuse/core'
import { defineStore } from 'pinia'
import { computed, effectScope, onScopeDispose, ref, toRefs, watch } from 'vue'

import { SetupStoreId } from '@/enum'
import { localStg } from '@/utils/storage'

import { addThemeVarsToHtml, createThemeToken, getAntdTheme, initThemeSettings, toggleCssDarkMode } from './shared'

/** 主题 Store */
export const useThemeStore = defineStore(SetupStoreId.Theme, () => {
  const scope = effectScope()
  const osTheme = usePreferredColorScheme()

  /** 主题配置 */
  const settings = ref(initThemeSettings())

  /** 重置 store */
  function resetStore() {
    const themeStore = useThemeStore()

    themeStore.$reset()
  }

  /** 主题色集合 */
  const themeColors = computed(() => {
    const { themeColor, otherColor, isInfoFollowPrimary } = settings.value
    const colors = {
      primary: themeColor,
      ...otherColor,
      info: isInfoFollowPrimary ? themeColor : otherColor.info
    }
    return colors
  })

  /** 深色模式状态 */
  const darkMode = computed(() => {
    if (settings.value.themeScheme === 'auto') {
      return osTheme.value === 'dark'
    }
    return settings.value.themeScheme === 'dark'
  })

  /** Antd 主题对象 */
  const antdTheme = computed(() => getAntdTheme(themeColors.value, darkMode.value))

  /**
   * 配置 JSON 字符串
   *
   * 用于复制主题配置
   */
  const settingsJson = computed(() => JSON.stringify(settings.value))

  /**
   * 设置主题方案
   *
   * @param themeScheme
   */
  function setThemeScheme(themeScheme) {
    settings.value.themeScheme = themeScheme
  }

  /** 切换主题方案 */
  function toggleThemeScheme() {
    const themeSchemes = ['light', 'dark', 'auto']

    const index = themeSchemes.findIndex((item) => item === settings.value.themeScheme)

    const nextIndex = index === themeSchemes.length - 1 ? 0 : index + 1

    const nextThemeScheme = themeSchemes[nextIndex]

    setThemeScheme(nextThemeScheme)
  }

  /**
   * 设置主题布局模式
   *
   * @param mode 主题布局模式
   */
  function setThemeLayout(mode) {
    settings.value.layout.mode = mode
  }

  /**
   * 更新主题颜色
   *
   * @param key 主题颜色键
   * @param color 主题颜色值
   */
  function updateThemeColors(key, color) {
    if (key === 'primary') {
      settings.value.themeColor = color
    } else {
      settings.value.otherColor[key] = color
    }
  }

  /** 将主题变量写入 HTML */
  function setupThemeVarsToHtml() {
    const { themeTokens, darkThemeTokens } = createThemeToken(themeColors.value)
    addThemeVarsToHtml(themeTokens, darkThemeTokens)
  }

  /** 缓存主题配置 */
  function cacheThemeSettings() {
    const isProd = import.meta.env.PROD

    if (!isProd) return

    localStg.set('themeSettings', settings.value)
  }

  // 页面关闭或刷新前缓存主题配置
  useEventListener(window, 'beforeunload', () => {
    cacheThemeSettings()
  })

  // 监听状态变更
  scope.run(() => {
    // 监听深色模式：同步切换暗色样式
    watch(
      darkMode,
      (val) => {
        toggleCssDarkMode(val)
      },
      { immediate: true }
    )

    // 监听主题色：更新 CSS 变量并缓存主色
    watch(
      themeColors,
      (val) => {
        setupThemeVarsToHtml()

        localStg.set('themeColor', val.primary)
      },
      { immediate: true }
    )
  })

  /** 作用域销毁时清理副作用 */
  onScopeDispose(() => {
    scope.stop()
  })

  return {
    ...toRefs(settings.value),
    resetStore,
    settingsJson,
    darkMode,
    themeColors,
    antdTheme,
    toggleThemeScheme,
    setThemeScheme,
    updateThemeColors,
    setThemeLayout
  }
})
