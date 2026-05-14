import Router from '@koa/router'
import authenticate from '../../middleware/authenticate.js'
import { errorControllerWrapper } from '../../utils/errorHandler.js'

const routeRouter = new Router()

// 获取常量路由
routeRouter.get(
  '/route/getConstantRoutes',
  errorControllerWrapper((ctx) => {
    ctx.body = {
      code: 200,
      data: [
        {
          name: 'login',
          path: '/login',
          component: 'layout.blankLayout',
          meta: {
            title: 'login',
            i18nKey: 'route.login',
            constant: true
          }
        },
        {
          name: '403',
          path: '/403',
          component: 'layout.blankLayout',
          meta: {
            title: '403',
            i18nKey: 'route.403',
            constant: true
          }
        },
        {
          name: '404',
          path: '/404',
          component: 'layout.blankLayout',
          meta: {
            title: '404',
            i18nKey: 'route.404',
            constant: true
          }
        },
        {
          name: '500',
          path: '/500',
          component: 'layout.blankLayout',
          meta: {
            title: '500',
            i18nKey: 'route.500',
            constant: true
          }
        }
      ],
      msg: 'ok'
    }
  })
)

// 获取用户路由
routeRouter.get(
  '/route/getUserRoutes',
  authenticate,
  errorControllerWrapper((ctx) => {
    ctx.body = {
      code: 200,
      data: {
        routes: [
          {
            name: 'home',
            path: '/home',
            component: 'layout.base$view.home',
            meta: {
              title: 'home',
              i18nKey: 'route.home',
              icon: 'mdi:monitor-dashboard',
              order: 1
            }
          },
          {
            name: 'manage',
            path: '/manage',
            component: 'layout.base',
            meta: {
              title: 'manage',
              i18nKey: 'route.manage',
              icon: 'mdi:folder-cog',
              order: 2
            },
            children: [
              {
                name: 'manage_user',
                path: '/manage/user',
                component: 'view.manage_user',
                meta: {
                  title: 'manage_user',
                  i18nKey: 'route.manage_user',
                  icon: 'mdi:account'
                }
              },
              {
                name: 'manage_role',
                path: '/manage/role',
                component: 'view.manage_role',
                meta: {
                  title: 'manage_role',
                  i18nKey: 'route.manage_role',
                  icon: 'mdi:account-group'
                }
              },
              {
                name: 'manage_menu',
                path: '/manage/menu',
                component: 'view.manage_menu',
                meta: {
                  title: 'manage_menu',
                  i18nKey: 'route.manage_menu',
                  icon: 'mdi:menu'
                }
              }
            ]
          },
          {
            name: 'about',
            path: '/about',
            component: 'layout.base$view.about',
            meta: {
              title: 'about',
              i18nKey: 'route.about',
              icon: 'mdi:information'
            }
          }
        ],
        home: 'home'
      },
      msg: 'ok'
    }
  })
)

// 判断路由是否存在
routeRouter.get(
  '/route/isRouteExist',
  authenticate,
  errorControllerWrapper((ctx) => {
    const { routeName } = ctx.query
    ctx.body = {
      code: 200,
      data: false,
      msg: 'ok'
    }
  })
)

export default routeRouter
