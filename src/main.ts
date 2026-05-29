import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import { createRouter, createWebHistory } from 'vue-router'
import { routes } from 'vue-router/auto-routes'
import { VueQueryPlugin } from '@tanstack/vue-query'

import App from './App.vue'
import '@unocss/reset/tailwind.css'
import 'virtual:uno.css'
import './assets/styles/global.css'
import { setupGuards } from './router/guards'

const app = createApp(App)

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(_to, _from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  }
})

setupGuards(router)

app.use(pinia)
app.use(router)
app.use(VueQueryPlugin)

app.mount('#app')
