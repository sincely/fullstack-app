import BaseLayout from '@/layouts/base-layout/index.vue'
import BlankLayout from '@/layouts/blank-layout/index.vue'

export const layouts = {
  base: BaseLayout,
  blank: BlankLayout
}

export const views = {
  403: () => import('@/views/_builtin/403/index.vue'),
  404: () => import('@/views/_builtin/404/index.vue'),
  500: () => import('@/views/_builtin/500/index.vue'),
  login: () => import('@/views/_builtin/login/index.vue'),
  about: () => import('@/views/about/index.vue'),
  'function_hide-child_one': () => import('@/views/function/hide-child/one/index.vue'),
  'function_hide-child_three': () => import('@/views/function/hide-child/three/index.vue'),
  'function_hide-child_two': () => import('@/views/function/hide-child/two/index.vue'),
  'function_multi-tab': () => import('@/views/function/multi-tab/index.vue'),
  function_request: () => import('@/views/function/request/index.vue'),
  'function_super-page': () => import('@/views/function/super-page/index.vue'),
  function_tab: () => import('@/views/function/tab/index.vue'),
  'function_toggle-auth': () => import('@/views/function/toggle-auth/index.vue'),
  home: () => import('@/views/home/index.vue'),
  manage_menu: () => import('@/views/manage/menu/index.vue'),
  manage_role: () => import('@/views/manage/role/index.vue'),
  'manage_user-detail': () => import('@/views/manage/user-detail/[id].vue'),
  manage_user: () => import('@/views/manage/user/index.vue'),
  manage_log_operation: () => import('@/views/manage/log/manage_log_operation.vue'),
  manage_log_login: () => import('@/views/manage/log/manage_log_login.vue'),
  'multi-menu_first_child': () => import('@/views/multi-menu/first_child/index.vue'),
  'multi-menu_second_child_home': () => import('@/views/multi-menu/second_child_home/index.vue'),
  'user-center': () => import('@/views/user-center/index.vue')
}
