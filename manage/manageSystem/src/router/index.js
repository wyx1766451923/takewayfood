import { createRouter, createWebHistory } from 'vue-router'
const routes = [
    {
      path:'/',
      redirect:'/home/index'
    },
    { 
      path: '/login',
      component: ()=>import('../views/Login/index.vue'),
      meta: {
        requireAuth: false // 不需要鉴权
      }
    },
    { 
      path: '/home',
      redirect:'/home/index',
      component: ()=>import('../views/Home/index.vue') ,
      meta: {
        requireAuth: true // 不需要鉴权
      },
      children:[
        { 
          path: 'index',
          component: ()=>import('../views/Index/index.vue') 
        },
        { 
          path: 'user',
          component: ()=>import('../views/User/index.vue') 
        },
        { 
          path: 'business',
          component: ()=>import('../views/Business/index.vue') 
        },
        { 
          path: 'food',
          component: ()=>import('../views/Food/index.vue') 
        },
        { 
          path: 'order',
          component: ()=>import('../views/Order/index.vue') 
        },
      ]
    }
    
  ]
const router = createRouter({
    // 4. 内部提供了 history 模式的实现。为了简单起见，我们在这里使用 hash 模式。
    history: createWebHistory(),
    routes
  })
  export default router