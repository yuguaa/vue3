import { createApp } from 'vue'
import { createPinia } from 'pinia'

import './styles/tailwindcss.css'
import App from './App.vue'
import router from './router'
import './permission.js'
const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')
