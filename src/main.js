import { createApp } from 'vue'
import { createPinia } from 'pinia'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import 'echarts'
import Echarts from 'vue-echarts'
import { use } from 'echarts/core'

import App from './App.vue'
import router from './router'

const app = createApp(App)
app.use(ElementPlus)
app.component('Echarts', Echarts)
app.use(createPinia())
app.use(router)

app.mount('#app')
