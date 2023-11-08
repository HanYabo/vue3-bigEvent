import { createRouter, createWebHistory } from 'vue-router'
import { useTokenStore } from '@/stores'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/login'
    },
    {
      path: '/login',
      component: () => import('@/views/Login/index.vue'),
    },
    {
      path: '/register',
      component: () => import('@/views/Register/index.vue')
    },
    {
      path: '/layout',
      component: () => import('@/views/layout/index.vue')
    }
  ]
})

// 不允许绕过/login登录页面,要确认token存在才放行
router.beforeEach((to, from, next) => {
  const tokenStore = useTokenStore()
  if (to.path === '/login') {
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