import Vue from 'vue'
import VueRouter from 'vue-router'
import index from '../components/index.vue'
import login from '../components/login.vue'
import register from '../components/register.vue'
import updateSelfInfo from '../components/updateSelfInfo.vue'
import dirList from '../components/dirList.vue'
import VueCookies from 'vue-cookies'
import test from '../components/test.vue'
import fileList from '../components/fileList.vue'

Vue.use(VueRouter)
Vue.use(VueCookies)
Vue.filter('dateFilter', function (data) {
  if (data === '') {
    return ''
  }
  var date = new Date(data)
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var d = date.getDate()
  return `${year}-${month}-${d}`
})
const routes = [
  { path: '/', redirect: '/index' },
  { path: '/index', component: index },
  { path: '/login', component: login },
  { path: '/register', component: register },
  { path: '/updateSelfInfo', component: updateSelfInfo },
  { path: '/dirList', component: dirList },
  { path: '/test', component: test },
  { path: '/fileList/:dirId', component: fileList }
]

const router = new VueRouter({
  routes
})

export default router
