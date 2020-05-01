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
import friend from '../components/friend.vue'
import friendApplyList from '../components/friendApplyList.vue'
import addFriendApply from '../components/addFriendApply.vue'
import FriendInfo from '../components/friendInfo.vue'
import dynamic from '../components/dynamic.vue'
import management from '../components/management.vue'
import userManage from '../components/userManage.vue'
import dirTypeManage from '../components/dirTypeManage.vue'
import dynamicManage from '../components/dynamicManage.vue'
import announManage from '../components/announManage.vue'

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

Vue.filter('friendNameFilter', function (data) {
  if (data) {
    if (data.length > 8) {
      return data.substring(0, 8) + '...'
    }
  }
  return data
})
const routes = [
  { path: '/', redirect: '/index' },
  { path: '/index', component: index },
  { path: '/login', component: login },
  { path: '/register', component: register },
  { path: '/updateSelfInfo', component: updateSelfInfo },
  { path: '/dirList', component: dirList },
  { path: '/test', component: test },
  { path: '/fileList/:dirId', component: fileList },
  { path: '/dynamic', component: dynamic, name: 'dynamic' },
  {
    path: '/friend/',
    component: friend,
    children:
    [
      { path: '/friend/friendApplyList', component: friendApplyList },
      { path: '/friend/addFriendApply', component: addFriendApply },
      { path: '/friend/friendInfo/:friendId', name: 'friendInfo', component: FriendInfo }
    ]
  },
  {
    path: '/management/',
    component: management,
    children:
    [
      { path: '/management/userManage', component: userManage, name: 'userManage' },
      { path: '/management/dirTypeManage', component: dirTypeManage, name: 'dirTypeManage' },
      { path: '/management/dynamicManage', component: dynamicManage, name: 'dynamicManage' },
      { path: '/management/announManage', component: announManage, name: 'announManage' }
    ]
  }
]

const router = new VueRouter({
  routes
})

export default router
