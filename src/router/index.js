import HomeView from '@/views/HomeView.vue'
import DatasetView from '@/views/DatasetView.vue'
import { createRouter, createWebHistory } from 'vue-router'
import AnnotateView from '@/views/AnnotateView.vue'

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
    {
      path: '/annotate',
      name: 'annotate',
      component: AnnotateView
    }
  ]
})

export default router
