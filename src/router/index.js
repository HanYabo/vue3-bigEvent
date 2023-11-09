import { createRouter, createWebHashHistory } from 'vue-router'
import { useTokenStore } from '@/stores'

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      component: () => import('@/views/layout/index.vue'),
      redirect: '/home',
      children: [
        {
          path: 'home',
          name: 'home',
          component: () => import('@/views/Home/index.vue')
        },
        {
          path: 'userinfo',
          name: 'userinfo',
          component: () => import('@/views/User/UserInfo.vue')
        },
        {
          path: 'avatar',
          name: 'avatar',
          component: () => import('@/views/User/UserAvatar.vue')
        }
      ]
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/Login/index.vue'),
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('@/views/Register/index.vue')
    },
  ]
})

// 不允许绕过/login登录页面,要确认token存在才放行
router.beforeEach((to, from, next) => {
  const tokenStore = useTokenStore()
  if (to.path === '/login' || to.path === '/register') {
    next()
  } else {
    if (tokenStore.token) {
      next()
    } else {
      next('/login')
    }
  }
})

export default router