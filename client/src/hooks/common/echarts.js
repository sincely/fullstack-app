import { useElementSize } from '@vueuse/core'
import { BarChart, GaugeChart, LineChart, PictorialBarChart, PieChart, RadarChart, ScatterChart } from 'echarts/charts'
import {
  DatasetComponent,
  GridComponent,
  LegendComponent,
  TitleComponent,
  ToolboxComponent,
  TooltipComponent,
  TransformComponent
} from 'echarts/components'
import * as echarts from 'echarts/core'
import { LabelLayout, UniversalTransition } from 'echarts/features'
import { CanvasRenderer } from 'echarts/renderers'
import { computed, effectScope, nextTick, onScopeDispose, ref, watch } from 'vue'

import { useThemeStore } from '@/store/modules/theme'

echarts.use([
  TitleComponent,
  LegendComponent,
  TooltipComponent,
  GridComponent,
  DatasetComponent,
  TransformComponent,
  ToolboxComponent,
  BarChart,
  LineChart,
  PieChart,
  ScatterChart,
  PictorialBarChart,
  RadarChart,
  GaugeChart,
  LabelLayout,
  UniversalTransition,
  CanvasRenderer
])

/**
 * use echarts
 *
 * @param optionsFactory echarts options factory function
 * @param darkMode dark mode
 */
export function useEcharts(optionsFactory, hooks = {}) {
  const scope = effectScope()

  const themeStore = useThemeStore()
  const darkMode = computed(() => themeStore.darkMode)

  const domRef = ref(null)
  const initialSize = { width: 0, height: 0 }
  const { width, height } = useElementSize(domRef, initialSize)

  let chart = null
  const chartOptions = optionsFactory()

  const {
    onRender = (instance) => {
      const textColor = darkMode.value ? 'rgb(224, 224, 224)' : 'rgb(31, 31, 31)'
      const maskColor = darkMode.value ? 'rgba(0, 0, 0, 0.4)' : 'rgba(255, 255, 255, 0.8)'

      instance.showLoading({
        color: themeStore.themeColor,
        textColor,
        fontSize: 14,
        maskColor
      })
    },
    onUpdated = (instance) => {
      instance.hideLoading()
    },
    onDestroy
  } = hooks

  /**
   * whether can render chart
   *
   * when domRef is ready and initialSize is valid
   */
  function canRender() {
    return domRef.value && initialSize.width > 0 && initialSize.height > 0
  }

  /** is chart rendered */
  function isRendered() {
    return Boolean(domRef.value && chart)
  }

  /**
   * update chart options
   *
   * @param callback callback function
   */
  async function updateOptions(callback = () => chartOptions) {
    if (!isRendered()) return

    const updatedOpts = callback(chartOptions, optionsFactory)

    Object.assign(chartOptions, updatedOpts)

    if (isRendered()) {
      chart?.clear()
    }

    chart?.setOption({ ...updatedOpts, backgroundColor: 'transparent' })

    await onUpdated?.(chart)
  }

  /** render chart */
  async function render() {
    if (!isRendered()) {
      const chartTheme = darkMode.value ? 'dark' : 'light'

      await nextTick()

      chart = echarts.init(domRef.value, chartTheme)

      chart.setOption({ ...chartOptions, backgroundColor: 'transparent' })

      await onRender?.(chart)
    }
  }

  /** resize chart */
  function resize() {
    chart?.resize()
  }

  /** destroy chart */
  async function destroy() {
    if (!chart) return

    await onDestroy?.(chart)
    chart?.dispose()
    chart = null
  }

  /** change chart theme */
  async function changeTheme() {
    await destroy()
    await render()
    await onUpdated?.(chart)
  }

  /**
   * render chart by size
   *
   * @param w width
   * @param h height
   */
  async function renderChartBySize(w, h) {
    initialSize.width = w
    initialSize.height = h

    // size is abnormal, destroy chart
    if (!canRender()) {
      await destroy()

      return
    }

    // resize chart
    if (isRendered()) {
      resize()
    }

    // render chart
    await render()
  }

  scope.run(() => {
    watch([width, height], ([newWidth, newHeight]) => {
      renderChartBySize(newWidth, newHeight)
    })

    watch(darkMode, () => {
      changeTheme()
    })
  })

  onScopeDispose(() => {
    destroy()
    scope.stop()
  })

  return {
    domRef,
    updateOptions
  }
}
