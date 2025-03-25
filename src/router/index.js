import { createRouter, createWebHistory } from 'vue-router'
import DefaultLayout from '@/layouts/ProjectLayout.vue'

const routes = [
  {
    path: '/',
    redirect: '/class',
    component: DefaultLayout,
    meta: { requiresAuth: true },
    children: [
      {
        path: 'class',
        name: 'class',
        component: () => import('../views/ClassView.vue')
      },
      {
        path: 'annotate',
        name: 'annotate',
        component: () => import('../views/AnnotateView.vue')
      },
      {
        path: 'augment',
        name: 'augment',
        component: () => import('../views/AugmentView.vue')
      },
      {
        path: 'dataset',
        name: 'dataset',
        component: () => import('../views/DatasetView.vue')
      },
      {
        path: 'model',
        name: 'model',
        component: () => import('../views/RunView.vue')
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router
