import HomeView from '@/views/HomeView.vue'
import DatasetView from '@/views/DatasetView.vue'
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/dataset',
      name: 'dataset',
      component: DatasetView
    },
    
  ]
})

export default router
