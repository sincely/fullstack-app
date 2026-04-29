export const generatedRoutes = [
  {
    name: '403',
    path: '/403',
    component: 'layout.blank$view.403',
    meta: {
      title: '403',
      constant: true,
      hideInMenu: true
    }
  },
  {
    name: '404',
    path: '/404',
    component: 'layout.blank$view.404',
    meta: {
      title: '404',
      constant: true,
      hideInMenu: true
    }
  },
  {
    name: '500',
    path: '/500',
    component: 'layout.blank$view.500',
    meta: {
      title: '500',
      constant: true,
      hideInMenu: true
    }
  },
  {
    name: 'about',
    path: '/about',
    component: 'layout.base$view.about',
    meta: {
      title: '关于',
      icon: 'fluent:book-information-24-regular',
      order: 10
    }
  },
  {
    name: 'function',
    path: '/function',
    component: 'layout.base',
    meta: {
      title: '系统功能',
      icon: 'icon-park-outline:all-application',
      order: 6
    },
    children: [
      {
        name: 'function_hide-child',
        path: '/function/hide-child',
        meta: {
          title: '隐藏子菜单',
          icon: 'material-symbols:filter-list-off',
          order: 2
        },
        redirect: '/function/hide-child/one',
        children: [
          {
            name: 'function_hide-child_one',
            path: '/function/hide-child/one',
            component: 'view.function_hide-child_one',
            meta: {
              title: '子菜单一',
              icon: 'material-symbols:filter-list-off',
              hideInMenu: true,
              activeMenu: 'function_hide-child'
            }
          },
          {
            name: 'function_hide-child_three',
            path: '/function/hide-child/three',
            component: 'view.function_hide-child_three',
            meta: {
              title: '子菜单三',
              hideInMenu: true,
              activeMenu: 'function_hide-child'
            }
          },
          {
            name: 'function_hide-child_two',
            path: '/function/hide-child/two',
            component: 'view.function_hide-child_two',
            meta: {
              title: '子菜单二',
              hideInMenu: true,
              activeMenu: 'function_hide-child'
            }
          }
        ]
      },
      {
        name: 'function_multi-tab',
        path: '/function/multi-tab',
        component: 'view.function_multi-tab',
        meta: {
          title: '多标签页',
          icon: 'ic:round-tab',
          multiTab: true,
          hideInMenu: true,
          activeMenu: 'function_tab'
        }
      },
      {
        name: 'function_request',
        path: '/function/request',
        component: 'view.function_request',
        meta: {
          title: '请求示例',
          icon: 'carbon:network-overlay',
          order: 3
        }
      },
      {
        name: 'function_super-page',
        path: '/function/super-page',
        component: 'view.function_super-page',
        meta: {
          title: '超级管理员页',
          icon: 'ic:round-supervisor-account',
          order: 5,
          roles: ['R_SUPER']
        }
      },
      {
        name: 'function_tab',
        path: '/function/tab',
        component: 'view.function_tab',
        meta: {
          title: '标签页',
          icon: 'ic:round-tab',
          order: 1
        }
      },
      {
        name: 'function_toggle-auth',
        path: '/function/toggle-auth',
        component: 'view.function_toggle-auth',
        meta: {
          title: '切换权限',
          icon: 'ic:round-construction',
          order: 4
        }
      }
    ]
  },
  {
    name: 'home',
    path: '/home',
    component: 'layout.base$view.home',
    meta: {
      title: '首页',
      icon: 'mdi:monitor-dashboard',
      order: 1
    }
  },
  {
    name: 'login',
    path: '/login/:module(pwd-login|code-login|register|reset-pwd|bind-wechat)?',
    component: 'layout.blank$view.login',
    props: true,
    meta: {
      title: '登录',
      constant: true,
      hideInMenu: true
    }
  },
  {
    name: 'manage',
    path: '/manage',
    component: 'layout.base',
    meta: {
      title: '系统管理',
      icon: 'carbon:cloud-service-management',
      order: 9,
      roles: ['R_ADMIN']
    },
    children: [
      {
        name: 'manage_menu',
        path: '/manage/menu',
        component: 'view.manage_menu',
        meta: {
          title: '菜单管理',
          icon: 'material-symbols:route',
          order: 3,
          roles: ['R_ADMIN'],
          keepAlive: true
        }
      },
      {
        name: 'manage_role',
        path: '/manage/role',
        component: 'view.manage_role',
        meta: {
          title: '角色管理',
          icon: 'carbon:user-role',
          order: 2,
          roles: ['R_SUPER']
        }
      },
      {
        name: 'manage_user',
        path: '/manage/user',
        component: 'view.manage_user',
        meta: {
          title: '用户管理',
          icon: 'ic:round-manage-accounts',
          order: 1,
          roles: ['R_ADMIN']
        }
      },
      {
        name: 'manage_user-detail',
        path: '/manage/user-detail/:id',
        component: 'view.manage_user-detail',
        props: true,
        meta: {
          title: '用户详情',
          hideInMenu: true,
          roles: ['R_ADMIN'],
          activeMenu: 'manage_user'
        }
      }
    ]
  },
  {
    name: 'multi-menu',
    path: '/multi-menu',
    component: 'layout.base',
    meta: {
      title: '多级菜单',
      order: 8
    },
    children: [
      {
        name: 'multi-menu_first',
        path: '/multi-menu/first',
        meta: {
          title: '菜单一',
          order: 1
        },
        children: [
          {
            name: 'multi-menu_first_child',
            path: '/multi-menu/first/child',
            component: 'view.multi-menu_first_child',
            meta: {
              title: '菜单一子菜单'
            }
          }
        ]
      },
      {
        name: 'multi-menu_second',
        path: '/multi-menu/second',
        meta: {
          title: '菜单二',
          order: 2
        },
        children: [
          {
            name: 'multi-menu_second_child',
            path: '/multi-menu/second/child',
            meta: {
              title: '菜单二子菜单'
            },
            children: [
              {
                name: 'multi-menu_second_child_home',
                path: '/multi-menu/second/child/home',
                component: 'view.multi-menu_second_child_home',
                meta: {
                  title: '菜单二子菜单首页'
                }
              }
            ]
          }
        ]
      }
    ]
  },
  {
    name: 'user-center',
    path: '/user-center',
    component: 'layout.base$view.user-center',
    meta: {
      title: '个人中心',
      hideInMenu: true
    }
  }
]
