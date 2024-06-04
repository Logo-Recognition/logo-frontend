import DatasetView from '@/views/DatasetView.vue'
import { createRouter, createWebHistory } from 'vue-router'
import ClassView from '@/views/ClassView.vue'
import AugmentView from '@/views/AugmentView.vue'
import AboutView from '@/views/AboutView.vue'
import AnnotateView from '@/views/AnnotateView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'class',
      component: ClassView
    },
    {
      path: '/augment', // New path
      name: 'augment', // Name for the route
      component: AugmentView // Component to render
    },
    {
      path: '/model', // New path
      name: 'model', // Name for the route
      component: AboutView // Component to render
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
