<script setup>
import { computed } from 'vue'

import { themeSchemaRecord } from '@/constants/app'
import { useThemeStore } from '@/store/modules/theme'

import SettingItem from '../components/setting-item.vue'

defineOptions({
  name: 'DarkMode'
})

const themeStore = useThemeStore()

const icons = {
  light: 'material-symbols:sunny',
  dark: 'material-symbols:nightlight-rounded',
  auto: 'material-symbols:hdr-auto'
}

function getSegmentOptions() {
  const opts = Object.keys(themeSchemaRecord).map((item) => {
    const key = item
    return {
      value: item,
      payload: {
        icon: icons[key]
      }
    }
  })

  return opts
}

const options = computed(() => getSegmentOptions())

function handleSegmentChange(value) {
  themeStore.setThemeScheme(value)
}

const showSiderInverted = computed(() => !themeStore.darkMode && themeStore.layout.mode.includes('vertical'))
</script>

<template>
  <ADivider>主题模式</ADivider>
  <div class="flex-col-stretch gap-16px">
    <div class="i-flex-center">
      <ASegmented :value="themeStore.themeScheme" :options="options" class="bg-layout" @change="handleSegmentChange">
        <template #label="{ payload }">
          <ButtonIcon :icon="payload.icon" class="h-28px text-icon-small" />
        </template>
      </ASegmented>
    </div>
    <Transition name="sider-inverted">
      <SettingItem v-if="showSiderInverted" label="深色侧边栏">
        <ASwitch v-model:checked="themeStore.sider.inverted" />
      </SettingItem>
    </Transition>
  </div>
</template>

<style scoped>
.sider-inverted-enter-active,
.sider-inverted-leave-active {
  --uno: h-22px transition-all-300;
}

.sider-inverted-enter-from,
.sider-inverted-leave-to {
  --uno: translate-x-20px opacity-0 h-0;
}
</style>
