import DatasetView from '@/views/DatasetView.vue'
import { createRouter, createWebHistory } from 'vue-router'
import ClassView from '@/views/ClassView.vue'
import AugmentView from '@/views/AugmentView.vue'
import RunView from '@/views/RunView.vue'
import AnnotateView from '@/views/AnnotateView.vue'
import OcrView from '@/views/OcrView.vue'
import WorkspaceView from '@/views/WorkspaceView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'workspace',
      component: WorkspaceView
    },
    {
      path: '/class',
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
      component: RunView // Component to render
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
    },
    {
      path: '/ocr',
      name: 'ocr',
      component: OcrView
    }
  ]
})

export default router
