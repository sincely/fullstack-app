<script setup>
import { getColorPalette, mixColor } from '@sa/utils'
import { computed } from 'vue'

import { loginModuleRecord } from '@/constants/app'
import { useThemeStore } from '@/store/modules/theme'

import BindWechat from './modules/bind-wechat.vue'
import CodeLogin from './modules/code-login.vue'
import PwdLogin from './modules/pwd-login.vue'
import Register from './modules/register.vue'
import ResetPwd from './modules/reset-pwd.vue'

// 'pwd-login' | 'code-login' | 'register' | 'reset-pwd' | 'bind-wechat'
const props = defineProps({
  module: {
    type: String,
    default: 'pwd-login'
  }
})

const themeStore = useThemeStore()

const moduleMap = {
  'pwd-login': { label: loginModuleRecord['pwd-login'], component: PwdLogin },
  'code-login': {
    label: loginModuleRecord['code-login'],
    component: CodeLogin
  },
  register: { label: loginModuleRecord.register, component: Register },
  'reset-pwd': { label: loginModuleRecord['reset-pwd'], component: ResetPwd },
  'bind-wechat': {
    label: loginModuleRecord['bind-wechat'],
    component: BindWechat
  }
}

const activeModule = computed(() => moduleMap[props.module || 'pwd-login'])

const bgThemeColor = computed(() =>
  themeStore.darkMode ? getColorPalette(themeStore.themeColor, 7) : themeStore.themeColor
)

const bgColor = computed(() => {
  const COLOR_WHITE = '#ffffff'

  const ratio = themeStore.darkMode ? 0.5 : 0.2

  return mixColor(COLOR_WHITE, themeStore.themeColor, ratio)
})
</script>

<template>
  <div class="relative size-full flex-center" :style="{ backgroundColor: bgColor }">
    <WaveBg :theme-color="bgThemeColor" />
    <ACard class="relative z-4">
      <div class="w-400px lt-sm:w-300px">
        <header class="flex-y-center justify-between">
          <SystemLogo class="size-64px lt-sm:size-48px" />
          <h3 class="text-28px text-primary font-500 lt-sm:text-22px">Soybean 管理系统</h3>
          <div class="i-flex-col">
            <ThemeSchemaSwitch
              :theme-schema="themeStore.themeScheme"
              :show-tooltip="false"
              class="text-20px lt-sm:text-18px"
              @switch="themeStore.toggleThemeScheme"
            />
          </div>
        </header>
        <main class="pt-24px">
          <h3 class="text-18px text-primary font-medium">
            {{ activeModule.label }}
          </h3>
          <div class="animation-slide-in-left pt-24px">
            <Transition :name="themeStore.page.animateMode" mode="out-in" appear>
              <component :is="activeModule.component" />
            </Transition>
          </div>
        </main>
      </div>
    </ACard>
  </div>
</template>
