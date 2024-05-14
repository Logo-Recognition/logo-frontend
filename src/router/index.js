import ClassView from '@/views/ClassView.vue'
import AugmentView from '@/views/AugmentView.vue'
import { createRouter, createWebHistory } from 'vue-router'

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
    }
  ]
})

export default router
