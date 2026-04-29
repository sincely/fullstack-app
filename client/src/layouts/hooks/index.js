import { computed, ref, watch } from 'vue'
import { useRoute } from 'vue-router'

import { useRouteStore } from '@/store/modules/route'

/**
 * 混合菜单（顶部 + 侧边）模式下的菜单状态管理 Hook。
 *
 * 主要职责：
 * 1. 根据当前路由，推导并维护“激活的一级菜单 key”；
 * 2. 基于一级菜单 key，计算出当前侧边栏应展示的二级菜单列表；
 * 3. 在路由变化时自动同步菜单激活状态。
 */
export function useMixMenu() {
  // 当前路由对象（包含 name、meta 等信息）
  const route = useRoute()
  // 路由菜单 store，包含完整菜单树
  const routeStore = useRouteStore()

  // 当前激活的一级菜单 key（通常对应路由名的前缀）
  const activeFirstLevelMenuKey = ref('')

  /**
   * 手动设置一级菜单激活 key。
   * @param {string} key 一级菜单 key
   */
  function setActiveFirstLevelMenuKey(key) {
    activeFirstLevelMenuKey.value = key
  }

  /**
   * 根据当前路由推导一级菜单 key。
   *
   * 规则说明：
   * - 普通页面：使用当前路由 name；
   * - 隐藏菜单页面（meta.hideInMenu = true）：优先使用 meta.activeMenu，
   *   让隐藏页仍能高亮其“归属菜单”；
   * - 菜单命名约定：路由名使用 "_" 分割，首段作为一级菜单 key。
   */
  function getActiveFirstLevelMenuKey() {
    const { hideInMenu, activeMenu } = route.meta
    const { name } = route

    // 隐藏菜单页面使用 activeMenu 回退，保证菜单高亮正确
    const routeName = (hideInMenu ? activeMenu : name) || name

    // 例：'system_user_list' -> 'system'
    const [firstLevelRouteName] = routeName.split('_')

    setActiveFirstLevelMenuKey(firstLevelRouteName)
  }

  /**
   * 当前一级菜单对应的子菜单（用于渲染侧边栏菜单）。
   * 若未匹配到菜单项，返回空数组，避免模板层空值判断。
   */
  const menus = computed(
    () => routeStore.menus.find((menu) => menu.key === activeFirstLevelMenuKey.value)?.children || []
  )

  /**
   * 监听路由名称变化：
   * - 首次进入页面（immediate）时立即同步；
   * - 后续路由切换时持续同步。
   */
  watch(
    () => route.name,
    () => {
      getActiveFirstLevelMenuKey()
    },
    { immediate: true }
  )

  return {
    activeFirstLevelMenuKey,
    setActiveFirstLevelMenuKey,
    getActiveFirstLevelMenuKey,
    menus
  }
}
