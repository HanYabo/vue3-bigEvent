import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      component: () => import('@/views/Login'),
    },
    {
      path: '/register',
      component: () => import('@/views/Register')
    }
  ]
})

export default router
