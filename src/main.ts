import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import { parseEnv } from './config/env.ts'

const env = parseEnv(import.meta.env)

document.title = env.VITE_APP_TITLE

createApp(App).mount('#app')
