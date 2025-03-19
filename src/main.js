import { createApp } from 'vue'
import { createPinia } from 'pinia'
import './assets/main.css'
import './index.css'
import App from './App.vue'
import router from './router'
import piniaPersist from 'pinia-plugin-persist'
import VueLazyload from 'vue-lazyload'
import Vue3Toastify from 'vue3-toastify'
import 'vue3-toastify/dist/index.css'

const app = createApp(App)
const pinia = createPinia()

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
