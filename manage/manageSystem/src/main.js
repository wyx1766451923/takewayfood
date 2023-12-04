import { createApp } from 'vue'
import '../src/style.css'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

import App from './App.vue'
import router from './router'
router.beforeEach((to, from, next) => {
    const type = to.meta.type
    // 判断该路由是否需要登录权限
    if (to.meta.requireAuth) {
      // 该路由需要登录权限
      if (localStorage.getItem('token')) {
        // 已登录
        next()
      } else {
        next('/login')
      }
    } else {
      next()
    }
  })
  
  
const app = createApp(App)
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}
app.use(router)
app.use(ElementPlus)
app.mount('#app')

