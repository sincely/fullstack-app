export const themeSettings = {
  themeScheme: 'light',
  recommendColor: false,
  themeColor: '#646cff',
  otherColor: {
    info: '#2080f0',
    success: '#52c41a',
    warning: '#faad14',
    error: '#f5222d'
  },
  isInfoFollowPrimary: true,
  resetCacheStrategy: 'close',
  layout: {
    mode: 'vertical',
    scrollMode: 'content',
    reverseHorizontalMix: false
  },
  page: {
    animate: true,
    animateMode: 'fade-slide'
  },
  header: {
    height: 56,
    breadcrumb: {
      visible: true,
      showIcon: true
    }
  },
  tab: {
    visible: true,
    cache: true,
    height: 44,
    mode: 'chrome'
  },
  fixedHeaderAndTab: true,
  sider: {
    inverted: false,
    width: 220,
    collapsedWidth: 64,
    mixWidth: 90,
    mixCollapsedWidth: 64,
    mixChildMenuWidth: 200
  },
  footer: {
    visible: true,
    fixed: false,
    height: 48,
    right: true
  },
  watermark: {
    visible: false,
    text: 'SoybeanAdmin'
  }
}

/**
 * 覆盖主题配置
 *
 * 发布新版本时，可通过 `overrideThemeSettings` 覆盖部分主题配置
 */
export const overrideThemeSettings = {
  resetCacheStrategy: 'close',
  watermark: {
    visible: false,
    text: 'SoybeanAdmin'
  }
}
