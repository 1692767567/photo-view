import Vue from 'vue'
import VueRouter from 'vue-router'
import index from '../components/index.vue'
import login from '../components/login.vue'
import register from '../components/register.vue'
import updateSelfInfo from '../components/updateSelfInfo.vue'
import VueCookies from 'vue-cookies'

Vue.use(VueRouter)
Vue.use(VueCookies)

const routes = [
  { path: '/', redirect: '/index' },
  { path: '/index', component: index },
  { path: '/login', component: login },
  { path: '/register', component: register },
  { path: '/updateSelfInfo', component: updateSelfInfo }
]

const router = new VueRouter({
  routes
})

export default router
