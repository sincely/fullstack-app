import { useBoolean } from '@sa/hooks'
import { breakpointsTailwind, useBreakpoints } from '@vueuse/core'
import { defineStore } from 'pinia'
import { effectScope, onScopeDispose, ref, watch } from 'vue'

import { SetupStoreId } from '@/enum'
import { setDayjsLocale } from '@/locales/dayjs'

import { useThemeStore } from '../theme'

export const useAppStore = defineStore(SetupStoreId.App, () => {
  const themeStore = useThemeStore()
  const scope = effectScope()
  const breakpoints = useBreakpoints(breakpointsTailwind)
  const { bool: themeDrawerVisible, setTrue: openThemeDrawer, setFalse: closeThemeDrawer } = useBoolean()
  const { bool: reloadFlag, setBool: setReloadFlag } = useBoolean(true)
  const { bool: fullContent, toggle: toggleFullContent } = useBoolean()
  const { bool: contentXScrollable, setBool: setContentXScrollable } = useBoolean()
  const { bool: siderCollapse, setBool: setSiderCollapse, toggle: toggleSiderCollapse } = useBoolean()
  const { bool: mixSiderFixed, setBool: setMixSiderFixed, toggle: toggleMixSiderFixed } = useBoolean()

  /** 是否移动端布局 */
  const isMobile = breakpoints.smaller('sm')

  /**
   * 重新加载页面
   *
   * @param duration 延迟时长（毫秒）
   */
  async function reloadPage(duration = 300) {
    setReloadFlag(false)

    if (duration > 0) {
      await new Promise((resolve) => {
        setTimeout(resolve, duration)
      })
    }

    setReloadFlag(true)
  }

  const locale = ref('zh-CN')

  function init() {
    setDayjsLocale()
  }

  // 监听状态变更
  scope.run(() => {
    // 监听移动端状态：移动端下自动折叠侧边栏并切换为纵向布局
    watch(
      isMobile,
      (newValue) => {
        if (newValue) {
          setSiderCollapse(true)

          themeStore.setThemeLayout('vertical')
        }
      },
      { immediate: true }
    )
  })

  /** 作用域销毁时清理副作用 */
  onScopeDispose(() => {
    scope.stop()
  })

  // 初始化
  init()

  return {
    isMobile,
    reloadFlag,
    reloadPage,
    fullContent,
    locale,
    themeDrawerVisible,
    openThemeDrawer,
    closeThemeDrawer,
    toggleFullContent,
    contentXScrollable,
    setContentXScrollable,
    siderCollapse,
    setSiderCollapse,
    toggleSiderCollapse,
    mixSiderFixed,
    setMixSiderFixed,
    toggleMixSiderFixed
  }
})
