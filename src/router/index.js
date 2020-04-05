import Vue from 'vue'
import VueRouter from 'vue-router'
import index from '../components/index.vue'
import login from '../components/login.vue'
import register from '../components/register.vue'
Vue.use(VueRouter)

const routes = [
  { path: '/', redirect: '/index' },
  { path: '/index', component: index },
  { path: '/login', component: login },
  { path: '/register', component: register }
]

const router = new VueRouter({
  routes
})

export default router
