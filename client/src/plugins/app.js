import { Button } from 'ant-design-vue'
import { h } from 'vue'

export function setupAppErrorHandle(app) {
  app.config.errorHandler = (err, vm, info) => {
    // eslint-disable-next-line no-console
    console.error(err, vm, info)
  }
}

export function setupAppVersionNotification() {
  const canAutoUpdateApp = import.meta.env.VITE_AUTOMATICALLY_DETECT_UPDATE === 'Y'

  if (!canAutoUpdateApp) return

  let isShow = false

  document.addEventListener('visibilitychange', async () => {
    const preConditions = [!isShow, document.visibilityState === 'visible', !import.meta.env.DEV]

    if (!preConditions.every(Boolean)) return

    const buildTime = await getHtmlBuildTime()

    if (buildTime === BUILD_TIME) {
      return
    }

    isShow = true

    const key = `open${Date.now()}`

    window.$notification?.open({
      message: '系统版本更新通知',
      description: '检测到系统有新版本发布，是否立即刷新页面？',
      btn() {
        return h(
          'div',
          {
            style: {
              display: 'flex',
              justifyContent: 'end',
              gap: '12px',
              width: '325px'
            }
          },
          [
            h(
              Button,
              {
                onClick() {
                  window.$notification?.destroy(key)
                }
              },
              () => '稍后再说'
            ),
            h(
              Button,
              {
                type: 'primary',
                onClick() {
                  location.reload()
                }
              },
              () => '立即刷新'
            )
          ]
        )
      },
      onClose() {
        isShow = false
      }
    })
  })
}

async function getHtmlBuildTime() {
  const res = await fetch(`/index.html?time=${Date.now()}`)

  const html = await res.text()

  const match = html.match(/<meta name="buildTime" content="(.*)">/)

  const buildTime = match?.[1] || ''

  return buildTime
}
