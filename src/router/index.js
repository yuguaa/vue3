import { createRouter, createWebHistory } from 'vue-router'

import Layout from '@/layout/index.vue'

const routes = [
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        component: () => import('@/views/dashboard/index.vue'),
        name: 'Dashboard'
      }
    ]
  },
  {
    path: '/mine',
    name: 'mine',
    component: () => import('@/views/mine/index.vue')
  }
]
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router
