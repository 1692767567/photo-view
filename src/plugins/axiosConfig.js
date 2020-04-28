import axios from 'axios'
import router from '../router'
import { Message } from 'element-ui'
axios.defaults.baseURL = 'http://localhost:8080/photo'
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'
axios.defaults.timeout = 20000
axios.defaults.responseType = 'json'
axios.defaults.withCredentials = true // 允许携带cookie

// 请求之前的拦截器，每次请求之前都会执行这个函数
axios.interceptors.request.use(function (config) {
  return config
})

// 响应被接收之前拦截器，每次响应回来都会执行
axios.interceptors.response.use(function (response) {
  // 统一对为错误的响应进行提示
  if (response.data.content !== undefined) {
    if (response.data.content.status !== '00') {
      Message.error(response.data.content.msg)
    }
  }
  return response
},
function (error) {
  if (error.response) {
    if (error.response.status === 403) {
      Message.error('还未登录')
      router.push('/login')
    }
  }
})

export default axios
