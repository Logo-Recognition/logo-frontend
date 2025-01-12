import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../views/LoginView.vue'
import DefaultLayout from '@/layouts/ProjectLayout.vue'

const routes = [
  {
    path: '/',
    name: 'login',
    component: LoginView
  },
  {
    path: '/',
    component: DefaultLayout,
    meta: { requiresAuth: true },
    children: [
      {
        path: 'workspace',
        name: 'workspace',
        component: () => import('../views/WorkspaceView.vue')
      },
      {
        path: 'class',
        name: 'class',
        component: () => import('../views/ClassView.vue')
      },
      {
        path: '/annotate',
        name: 'annotate',
        component: () => import('../views/AnnotateView.vue')
      },
      {
        path: '/augment',
        name: 'augment',
        component: () => import('../views/AugmentView.vue')
      },
      {
        path: '/dataset',
        name: 'dataset',
        component: () => import('../views/DatasetView.vue')
      },
      {
        path: '/model',
        name: 'model',
        component: () => import('../views/RunView.vue')
      },
      {
        path: '/ocr',
        name: 'ocr',
        component: () => import('../views/OcrView.vue')
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

// router.beforeEach((to, from, next) => {
//   const isAuthenticated = localStorage.getItem('token')

//   if (to.meta.requiresAuth && !isAuthenticated) {
//     next('/')
//   } else {
//     next()
//   }
// })

export default router
