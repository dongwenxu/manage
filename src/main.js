import Vue from 'vue'
import App from './App.vue'
import VueRouter from "vue-router"
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-default/index.css'
import VueResource from 'vue-resource'

//开启debug模式
Vue.config.debug = true;
Vue.use(VueRouter);
Vue.use(ElementUI);
Vue.use(VueResource);



// 定义组件, 也可以像教程之前教的方法从别的文件引入
import index from './components/index.vue'
import order from './components/order.vue'
import login from './components/login.vue'
import commit from './components/commit.vue'
import bulletin from './components/bulletin.vue'
import owner from './components/owner.vue'
import plot from './components/plot.vue'
import plotFee from './components/plotFee.vue'
import basicOther from './components/basicOther.vue'
import express from './components/express.vue'
import charge from './components/charge.vue'
import about from './components/about.vue'
import ext from './components/ext.vue'
import extConfig from './components/extConfig.vue'

// 创建一个路由器实例
// 并且配置路由规则
const router = new VueRouter({
  base: __dirname,
  routes: [
    {
      path: '/',
      component: index
    },
    {
      path: '/login',
      component: login
    },
    {
      path: '/order',
      component: order
    },
    {
      path: '/commit',
      component: commit
    },
    {
      path: '/bulletin',
      component: bulletin
    },
    {
      path: '/owner',
      component: owner
    },
    {
      path: '/plot',
      component: plot
    },
    {
      path: '/plotFee',
      component: plotFee
    },
    {
      path: '/basicOther',
      component: basicOther
    },
    {
      path: '/express',
      component: express
    },
    {
      path: '/charge',
      component: charge
    },
    {
      path: '/about',
      component: about
    },
    {
      path: '/ext',
      component: ext
    },
    {
      path: '/extConfig',
      component: extConfig
    }
  ]
})

// 现在我们可以启动应用了！
// 路由器会创建一个 App 实例，并且挂载到选择符 #app 匹配的元素上。
const app = new Vue({
  router: router,
  render: h => h(App)
}).$mount('#app')
