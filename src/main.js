import './index.css'
import Vue3Toastify from 'vue3-toastify'
import 'vue3-toastify/dist/index.css'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPersist from 'pinia-plugin-persist'
import VueLazyload from 'vue-lazyload'
import './assets/main.css'
import App from './App.vue'
import router from './router'

const pinia = createPinia()
const app = createApp(App)
pinia.use(piniaPersist)
app.use(VueLazyload)
app.use(pinia)
app.use(Vue3Toastify, {
  position: 'top-right',
  transition: 'Vue-Toastify__bounce'
})
app.use(VueLazyload, {
  preLoad: 1.3,
  attempt: 1
})
app.use(router).mount('#app')
