import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createAppRouter } from './router'
import './styles/style.css'
import App from './App.vue'
import { parseEnv } from './config/env.ts'

const env = parseEnv(import.meta.env)

document.title = env.VITE_APP_TITLE

createApp(App).use(createPinia()).use(createAppRouter()).mount('#app')
