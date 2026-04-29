import { transformRecordToOption } from '@/utils/common'

export const themeSchemaRecord = {
  light: '亮色模式',
  dark: '暗黑模式',
  auto: '跟随系统'
}

export const themeSchemaOptions = transformRecordToOption(themeSchemaRecord)

export const loginModuleRecord = {
  'pwd-login': '密码登录',
  'code-login': '验证码登录',
  register: '注册账号',
  'reset-pwd': '重置密码',
  'bind-wechat': '绑定微信'
}

export const themeLayoutModeRecord = {
  vertical: '左侧菜单模式',
  'vertical-mix': '左侧菜单混合模式',
  horizontal: '顶部菜单模式',
  'horizontal-mix': '顶部菜单混合模式'
}

export const themeLayoutModeOptions = transformRecordToOption(themeLayoutModeRecord)

export const themeScrollModeRecord = {
  wrapper: '外层滚动',
  content: '主体滚动'
}

export const themeScrollModeOptions = transformRecordToOption(themeScrollModeRecord)

export const themeTabModeRecord = {
  chrome: '谷歌风格',
  button: '按钮风格'
}

export const themeTabModeOptions = transformRecordToOption(themeTabModeRecord)

export const themePageAnimationModeRecord = {
  'fade-slide': '滑动',
  fade: '淡入淡出',
  'fade-bottom': '底部消退',
  'fade-scale': '缩放消退',
  'zoom-fade': '渐变',
  'zoom-out': '闪现',
  none: '无'
}

export const themePageAnimationModeOptions = transformRecordToOption(themePageAnimationModeRecord)
