import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/views/home/index.vue'
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/mine',
      name: 'mine',
      component: () => import('@/views/mine/index.vue')
    }
  ]
})

export default router
