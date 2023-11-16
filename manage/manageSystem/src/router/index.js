import { createRouter, createWebHistory } from 'vue-router'
const routes = [
    { 
      path: '/', 
      component: ()=>import('../views/Home/index.vue') 
    },
    { 
      path: '/about',
      component: ()=>import('../views/About/index.vue') 
    }
  ]
const router = createRouter({
    // 4. 内部提供了 history 模式的实现。为了简单起见，我们在这里使用 hash 模式。
    history: createWebHistory(),
    routes
  })
  export default router