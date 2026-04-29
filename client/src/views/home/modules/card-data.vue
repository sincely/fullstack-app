<script setup>
import { createReusableTemplate } from '@vueuse/core'
import { computed } from 'vue'

defineOptions({
  name: 'CardData'
})

const cardData = computed(() => [
  {
    key: 'visitCount',
    title: '访问量',
    value: 9725,
    unit: '',
    color: {
      start: '#ec4786',
      end: '#b955a4'
    },
    icon: 'ant-design:bar-chart-outlined'
  },
  {
    key: 'turnover',
    title: '成交额',
    value: 1026,
    unit: '$',
    color: {
      start: '#865ec0',
      end: '#5144b4'
    },
    icon: 'ant-design:money-collect-outlined'
  },
  {
    key: 'downloadCount',
    title: '下载量',
    value: 970925,
    unit: '',
    color: {
      start: '#56cdf3',
      end: '#719de3'
    },
    icon: 'carbon:document-download'
  },
  {
    key: 'dealCount',
    title: '成交量',
    value: 9527,
    unit: '',
    color: {
      start: '#fcbc25',
      end: '#f68057'
    },
    icon: 'ant-design:trademark-circle-outlined'
  }
])

const [DefineGradientBg, GradientBg] = createReusableTemplate()

function getGradientColor(color) {
  return `linear-gradient(to bottom right, ${color.start}, ${color.end})`
}
</script>

<template>
  <ACard :bordered="false" size="small" class="card-wrapper">
    <!-- define component start: GradientBg -->
    <DefineGradientBg v-slot="{ $slots, gradientColor }">
      <div class="rd-8px px-16px pb-4px pt-8px text-white" :style="{ backgroundImage: gradientColor }">
        <component :is="$slots.default" />
      </div>
    </DefineGradientBg>
    <!-- define component end: GradientBg -->

    <ARow :gutter="[16, 16]">
      <ACol v-for="item in cardData" :key="item.key" :span="24" :md="12" :lg="6">
        <GradientBg :gradient-color="getGradientColor(item.color)" class="flex-1">
          <h3 class="text-16px">{{ item.title }}</h3>
          <div class="flex justify-between pt-12px">
            <SvgIcon :icon="item.icon" class="text-32px" />
            <CountTo
              :prefix="item.unit"
              :start-value="1"
              :end-value="item.value"
              class="text-30px text-white dark:text-dark"
            />
          </div>
        </GradientBg>
      </ACol>
    </ARow>
  </ACard>
</template>
