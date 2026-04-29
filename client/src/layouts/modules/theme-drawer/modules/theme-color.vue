<script setup>
import { ColorPicker } from '@sa/materials'

import { useThemeStore } from '@/store/modules/theme'

import SettingItem from '../components/setting-item.vue'

defineOptions({
  name: 'ThemeColor'
})

const themeStore = useThemeStore()

const themeColorLabelRecord = {
  primary: '主色',
  info: '信息色',
  success: '成功色',
  warning: '警告色',
  error: '错误色'
}

function handleUpdateColor(color, key) {
  themeStore.updateThemeColors(key, color)
}
</script>

<template>
  <ADivider>主题颜色</ADivider>
  <div class="flex-col-stretch gap-12px">
    <SettingItem v-for="(_, key) in themeStore.themeColors" :key="key" :label="themeColorLabelRecord[key] || key">
      <template v-if="key === 'info'" #suffix>
        <ACheckbox v-model:checked="themeStore.isInfoFollowPrimary">跟随主色</ACheckbox>
      </template>
      <ColorPicker
        :color="themeStore.themeColors[key]"
        :disabled="key === 'info' && themeStore.isInfoFollowPrimary"
        @update:color="handleUpdateColor($event, key)"
      />
    </SettingItem>
  </div>
</template>
