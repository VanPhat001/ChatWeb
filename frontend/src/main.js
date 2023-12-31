import './assets/main.css'
import './index.css'
import clock from './clock'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import VueCookies from 'vue-cookies'

import App from './App.vue'
import router from './router'

const app = createApp(App)
app.provide('clock', clock)
app.use(VueCookies)
app.use(createPinia())
app.use(router)


app.mount('#app')
