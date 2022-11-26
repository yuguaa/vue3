import { createApp } from 'vue'
import { createPinia } from 'pinia'

import 'normalize.css/normalize.css' // a modern alternative to CSS resets

import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')
