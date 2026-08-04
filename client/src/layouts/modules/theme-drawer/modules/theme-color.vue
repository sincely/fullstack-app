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
  <a-divider>主题颜色</a-divider>
  <div class="flex-col-stretch gap-12px">
    <a-tooltip placement="topLeft">
      <SettingItem :label="'应用推荐算法的颜色'">
        <a-switch v-model:checked="themeStore.recommendColor" />
      </SettingItem>
      <template #title>
        <p>
          <span class="pr-12px">推荐颜色的算法参照</span>
          <br />
          <a-button
            type="link"
            href="https://uicolors.app/create"
            target="_blank"
            rel="noopener noreferrer"
            class="text-gray"
          >
            https://uicolors.app/create
          </a-button>
        </p>
      </template>
    </a-tooltip>
    <SettingItem v-for="(_, key) in themeStore.themeColors" :key="key" :label="themeColorLabelRecord[key] || key">
      <template v-if="key === 'info'" #suffix>
        <a-checkbox v-model:checked="themeStore.isInfoFollowPrimary">跟随主色</a-checkbox>
      </template>
      <ColorPicker
        :color="themeStore.themeColors[key]"
        :disabled="key === 'info' && themeStore.isInfoFollowPrimary"
        @update:color="handleUpdateColor($event, key)"
      />
    </SettingItem>
  </div>
</template>
