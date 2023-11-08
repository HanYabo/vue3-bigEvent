import { createRouter, createWebHistory } from 'vue-router'

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
      path: '/home',
      component: () => import('@/views/Home/index.vue')
    }
  ]
})

export default router
