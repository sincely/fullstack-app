import { useEventListener } from '@vueuse/core'
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'

import { SetupStoreId } from '@/enum'
import { useRouterPush } from '@/hooks/common/router'
import { useRouteStore } from '@/store/modules/route'
import { localStg } from '@/utils/storage'

import { useThemeStore } from '../theme'
import {
  extractTabsByAllRoutes,
  filterTabsById,
  filterTabsByIds,
  findTabByRouteName,
  getAllTabs,
  getDefaultHomeTab,
  getFixedTabIds,
  getTabByRoute,
  isTabInTabs,
  normalizeTabLabel,
  normalizeTabsLabel
} from './shared'

export const useTabStore = defineStore(SetupStoreId.Tab, () => {
  const router = useRouter()
  const routeStore = useRouteStore()
  const themeStore = useThemeStore()
  const { routerPush } = useRouterPush(false)

  /** 标签页列表 */
  const tabs = ref([])

  /** 首页标签页 */
  const homeTab = ref()

  /**
   * 初始化首页标签页
   *
   * @param router 路由实例
   */
  function initHomeTab() {
    homeTab.value = getDefaultHomeTab(router, routeStore.routeHome)
  }

  /** 全部标签页（含首页与固定页） */
  const allTabs = computed(() => getAllTabs(tabs.value, homeTab.value))

  /** 当前激活标签页 id */
  const activeTabId = ref('')

  /**
   * 设置激活标签页 id
   *
   * @param id 标签页 id
   */
  function setActiveTabId(id) {
    activeTabId.value = id
  }

  /**
   * 初始化标签页 store
   *
   * @param currentRoute 当前路由
   */
  function initTabStore(currentRoute) {
    const storageTabs = localStg.get('globalTabs')

    if (themeStore.tab.cache && storageTabs) {
      const filteredTabs = extractTabsByAllRoutes(router, storageTabs)
      tabs.value = normalizeTabsLabel(filteredTabs)
    }

    addTab(currentRoute)
  }

  /**
   * 添加标签页
   *
   * @param route 标签页对应路由
   * @param active 是否激活新增标签页
   */
  function addTab(route, active = true) {
    const tab = getTabByRoute(route)

    const isHomeTab = tab.id === homeTab.value?.id

    if (!isHomeTab && !isTabInTabs(tab.id, tabs.value)) {
      tabs.value.push(tab)
    }

    if (active) {
      setActiveTabId(tab.id)
    }
  }

  /**
   * 移除标签页
   *
   * @param tabId 标签页 id
   */
  async function removeTab(tabId) {
    const isRemoveActiveTab = activeTabId.value === tabId
    const updatedTabs = filterTabsById(tabId, tabs.value)

    function update() {
      tabs.value = updatedTabs
    }

    if (!isRemoveActiveTab) {
      update()
      return
    }

    const activeTab = updatedTabs.at(-1) || homeTab.value

    if (activeTab) {
      await switchRouteByTab(activeTab)
      update()
    }
  }

  /** 移除当前激活标签页 */
  async function removeActiveTab() {
    await removeTab(activeTabId.value)
  }

  /**
   * 按路由名称移除标签页
   *
   * @param routeName 路由名称
   */
  async function removeTabByRouteName(routeName) {
    const tab = findTabByRouteName(routeName, tabs.value)
    if (!tab) return

    await removeTab(tab.id)
  }

  /**
   * 清空标签页
   *
   * @param excludes 需要保留的标签页 id
   */
  async function clearTabs(excludes = []) {
    const remainTabIds = [...getFixedTabIds(tabs.value), ...excludes]
    const removedTabsIds = tabs.value.map((tab) => tab.id).filter((id) => !remainTabIds.includes(id))

    const isRemoveActiveTab = removedTabsIds.includes(activeTabId.value)
    const updatedTabs = filterTabsByIds(removedTabsIds, tabs.value)

    function update() {
      tabs.value = updatedTabs
    }

    if (!isRemoveActiveTab) {
      update()
      return
    }

    const activeTab = updatedTabs[updatedTabs.length - 1] || homeTab.value

    await switchRouteByTab(activeTab)
    update()
  }

  /**
   * 按标签页切换路由
   *
   * @param tab 标签页对象
   */
  async function switchRouteByTab(tab) {
    const fail = await routerPush(tab.fullPath)
    if (!fail) {
      setActiveTabId(tab.id)
    }
  }

  /**
   * 清空左侧标签页
   *
   * @param tabId 基准标签页 id
   */
  async function clearLeftTabs(tabId) {
    const tabIds = tabs.value.map((tab) => tab.id)
    const index = tabIds.indexOf(tabId)
    if (index === -1) return

    const excludes = tabIds.slice(index)
    await clearTabs(excludes)
  }

  /**
   * 清空右侧标签页
   *
   * @param tabId 基准标签页 id
   */
  async function clearRightTabs(tabId) {
    const isHomeTab = tabId === homeTab.value?.id
    if (isHomeTab) {
      clearTabs()
      return
    }

    const tabIds = tabs.value.map((tab) => tab.id)
    const index = tabIds.indexOf(tabId)
    if (index === -1) return

    const excludes = tabIds.slice(0, index + 1)
    await clearTabs(excludes)
  }

  /**
   * 设置标签页新标题
   *
   * @default activeTabId
   * @param label 新标题
   * @param tabId 标签页 id
   */
  function setTabLabel(label, tabId) {
    const id = tabId || activeTabId.value

    const tab = tabs.value.find((item) => item.id === id)
    if (!tab) return

    tab.oldLabel = tab.label
    tab.newLabel = label
  }

  /**
   * 重置标签页标题
   *
   * @default activeTabId
   * @param tabId 标签页 id
   */
  function resetTabLabel(tabId) {
    const id = tabId || activeTabId.value

    const tab = tabs.value.find((item) => item.id === id)
    if (!tab) return

    tab.newLabel = undefined
  }

  /**
   * 判断标签页是否应保留
   *
   * @param tabId 标签页 id
   */
  function isTabRetain(tabId) {
    if (tabId === homeTab.value?.id) return true

    const fixedTabIds = getFixedTabIds(tabs.value)

    return fixedTabIds.includes(tabId)
  }

  /** 根据语言环境更新标签页 */
  function updateTabsByLocale() {
    tabs.value = normalizeTabsLabel(tabs.value)

    if (homeTab.value) {
      homeTab.value = normalizeTabLabel(homeTab.value)
    }
  }

  /** 缓存标签页 */
  function cacheTabs() {
    if (!themeStore.tab.cache) return

    localStg.set('globalTabs', tabs.value)
  }

  // 页面关闭或刷新前缓存标签页
  useEventListener(window, 'beforeunload', () => {
    cacheTabs()
  })

  return {
    /** 全部标签页 */
    tabs: allTabs,
    activeTabId,
    initHomeTab,
    initTabStore,
    addTab,
    removeTab,
    removeActiveTab,
    removeTabByRouteName,
    clearTabs,
    clearLeftTabs,
    clearRightTabs,
    switchRouteByTab,
    setTabLabel,
    resetTabLabel,
    isTabRetain,
    updateTabsByLocale
  }
})
