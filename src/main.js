import { createApp } from 'vue'
import { createPinia } from 'pinia'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import 'echarts'
import Echarts from 'vue-echarts'
import { use } from 'echarts/core'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import Quill from "vue3-quill-editor"
import "vue3-quill-editor/lib/style.css"

// pinia持久化插件
const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

import App from './App.vue'
import router from './router'

const app = createApp(App)

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}

app.use(ElementPlus)
app.component('Echarts', Echarts)
app.use(router)
app.use(pinia)
app.use(Quill)

app.mount('#app')
