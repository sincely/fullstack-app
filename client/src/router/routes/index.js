import { layouts, views } from '../elegant/imports'
import { generatedRoutes } from '../elegant/routes'
import { transformElegantRoutesToVueRoutes } from '../elegant/transform'

/**
 * 自定义路由
 *
 * @link https://github.com/soybeanjs/elegant-router?tab=readme-ov-file#custom-route
 */
const customRoutes = [
  {
    name: 'exception',
    path: '/exception',
    component: 'layout.base',
    meta: {
      title: '异常页',
      icon: 'ant-design:exception-outlined',
      order: 7
    },
    children: [
      {
        name: 'exception_403',
        path: '/exception/403',
        component: 'view.403',
        meta: {
          title: '403',
          icon: 'ic:baseline-block'
        }
      },
      {
        name: 'exception_404',
        path: '/exception/404',
        component: 'view.404',
        meta: {
          title: '404',
          icon: 'ic:baseline-web-asset-off'
        }
      },
      {
        name: 'exception_500',
        path: '/exception/500',
        component: 'view.500',
        meta: {
          title: '500',
          icon: 'ic:baseline-wifi-off'
        }
      }
    ]
  }
]

/** 在静态权限路由模式下创建路由 */
export function createStaticRoutes() {
  const constantRoutes = []

  const authRoutes = []

  console.log('合并路由', [...customRoutes, ...generatedRoutes])

  for (const item of [...customRoutes, ...generatedRoutes]) {
    if (item.meta?.constant) {
      constantRoutes.push(item)
    } else {
      authRoutes.push(item)
    }
  }

  return {
    constantRoutes,
    authRoutes
  }
}

/**
 * 获取权限路由对应的 Vue 路由
 *
 * @param routes Elegant 路由
 */
export function getAuthVueRoutes(routes) {
  return transformElegantRoutesToVueRoutes(routes, layouts, views)
}
