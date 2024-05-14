import ClassView from '@/views/ClassView.vue'
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'class',
      component: ClassView
    },
    
  ]
})

export default router
