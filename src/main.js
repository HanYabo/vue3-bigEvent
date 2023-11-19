import { createApp } from 'vue'
import { createPinia } from 'pinia'
import ElementPlus from 'element-plus'
import zhCn from "element-plus/es/locale/lang/zh-cn"
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import 'element-plus/dist/index.css'
import 'echarts'
import Echarts from 'vue-echarts'
import { use } from 'echarts/core'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import Quill from "vue3-quill-editor"
import "vue3-quill-editor/lib/style.css"
import dayjs from 'dayjs'

// pinia持久化插件
const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

import App from './App.vue'
import router from './router'

const app = createApp(App)

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}

app.use(ElementPlus, {
    locale: zhCn
})
app.component('Echarts', Echarts)
app.use(router)
app.use(pinia)
app.use(Quill)
app.config.globalProperties.$formatDate = (dateObj) => {
    return dayjs(dateObj).format('YYYY-MM-DD HH:mm:ss')
}

app.mount('#app')
