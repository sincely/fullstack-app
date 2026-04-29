<script setup>
import { computed } from 'vue'

import { themePageAnimationModeOptions, themeScrollModeOptions, themeTabModeOptions } from '@/constants/app'
import { useThemeStore } from '@/store/modules/theme'

import SettingItem from '../components/setting-item.vue'

defineOptions({
  name: 'PageFun'
})

const themeStore = useThemeStore()

const layoutMode = computed(() => themeStore.layout.mode)

const isMixLayoutMode = computed(() => layoutMode.value.includes('mix'))

const isWrapperScrollMode = computed(() => themeStore.layout.scrollMode === 'wrapper')
</script>

<template>
  <ADivider>页面功能</ADivider>
  <TransitionGroup tag="div" name="setting-list" class="flex-col-stretch gap-12px">
    <SettingItem key="1" :label="'滚动模式'">
      <ASelect v-model:value="themeStore.layout.scrollMode" class="w-120px">
        <ASelectOption v-for="option in themeScrollModeOptions" :key="option.value" :value="option.value">
          {{ option.label }}
        </ASelectOption>
      </ASelect>
    </SettingItem>
    <SettingItem key="1-1" :label="'页面切换动画'">
      <ASwitch v-model:checked="themeStore.page.animate" />
    </SettingItem>
    <SettingItem v-if="themeStore.page.animate" key="1-2" :label="'页面切换动画类型'">
      <ASelect v-model:value="themeStore.page.animateMode" class="w-120px">
        <ASelectOption v-for="option in themePageAnimationModeOptions" :key="option.value" :value="option.value">
          {{ option.label }}
        </ASelectOption>
      </ASelect>
    </SettingItem>
    <SettingItem v-if="isWrapperScrollMode" key="2" :label="'固定头部和标签栏'">
      <ASwitch v-model:checked="themeStore.fixedHeaderAndTab" />
    </SettingItem>
    <SettingItem key="3" :label="'头部高度'">
      <AInputNumber v-model:value="themeStore.header.height" class="w-120px" />
    </SettingItem>
    <SettingItem key="4" :label="'显示面包屑'">
      <ASwitch v-model:checked="themeStore.header.breadcrumb.visible" />
    </SettingItem>
    <SettingItem v-if="themeStore.header.breadcrumb.visible" key="4-1" :label="'显示面包屑图标'">
      <ASwitch v-model:checked="themeStore.header.breadcrumb.showIcon" />
    </SettingItem>
    <SettingItem key="5" :label="'显示标签栏'">
      <ASwitch v-model:checked="themeStore.tab.visible" />
    </SettingItem>
    <SettingItem v-if="themeStore.tab.visible" key="5-1" :label="'缓存标签页'">
      <ASwitch v-model:checked="themeStore.tab.cache" />
    </SettingItem>
    <SettingItem v-if="themeStore.tab.visible" key="5-2" :label="'标签栏高度'">
      <AInputNumber v-model:value="themeStore.tab.height" class="w-120px" />
    </SettingItem>
    <SettingItem v-if="themeStore.tab.visible" key="5-3" :label="'标签栏风格'">
      <ASelect v-model:value="themeStore.tab.mode" class="w-120px">
        <ASelectOption v-for="option in themeTabModeOptions" :key="option.value" :value="option.value">
          {{ option.label }}
        </ASelectOption>
      </ASelect>
    </SettingItem>
    <SettingItem v-if="layoutMode === 'vertical'" key="6-1" :label="'侧边栏宽度'">
      <AInputNumber v-model:value="themeStore.sider.width" class="w-120px" />
    </SettingItem>
    <SettingItem v-if="layoutMode === 'vertical'" key="6-2" :label="'侧边栏折叠宽度'">
      <AInputNumber v-model:value="themeStore.sider.collapsedWidth" class="w-120px" />
    </SettingItem>
    <SettingItem v-if="isMixLayoutMode" key="6-3" :label="'混合布局侧边栏宽度'">
      <AInputNumber v-model:value="themeStore.sider.mixWidth" class="w-120px" />
    </SettingItem>
    <SettingItem v-if="isMixLayoutMode" key="6-4" :label="'混合布局侧边栏折叠宽度'">
      <AInputNumber v-model:value="themeStore.sider.mixCollapsedWidth" class="w-120px" />
    </SettingItem>
    <SettingItem v-if="layoutMode === 'vertical-mix'" key="6-5" :label="'混合布局子菜单宽度'">
      <AInputNumber v-model:value="themeStore.sider.mixChildMenuWidth" class="w-120px" />
    </SettingItem>
    <SettingItem key="7" :label="'显示底部'">
      <ASwitch v-model:checked="themeStore.footer.visible" />
    </SettingItem>
    <SettingItem v-if="themeStore.footer.visible && isWrapperScrollMode" key="7-1" :label="'固定底部'">
      <ASwitch v-model:checked="themeStore.footer.fixed" />
    </SettingItem>
    <SettingItem v-if="themeStore.footer.visible" key="7-2" :label="'底部高度'">
      <AInputNumber v-model:value="themeStore.footer.height" class="w-120px" />
    </SettingItem>
    <SettingItem v-if="themeStore.footer.visible && layoutMode === 'horizontal-mix'" key="7-3" :label="'底部局右'">
      <ASwitch v-model:checked="themeStore.footer.right" />
    </SettingItem>
  </TransitionGroup>
</template>

<style scoped>
.setting-list-move,
.setting-list-enter-active,
.setting-list-leave-active {
  --uno: transition-all-300;
}

.setting-list-enter-from,
.setting-list-leave-to {
  --uno: opacity-0 -translate-x-30px;
}

.setting-list-leave-active {
  --uno: absolute;
}
</style>
