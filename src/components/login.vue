<template>
<div style="width:100%" class="all-content">
  <h1>电子相册</h1>
  <div class="container w3layouts agileits">
   <div class="login w3layouts agileits">
    <h2>登 录</h2>
    <form action="#" method="post">
     <input type="text" name="Userame" v-model="loginObject.email" placeholder="邮箱" required="" />
     <input type="password" name="Password" v-model="loginObject.password"  placeholder="密码" required="" />
     <input type="text"  style="width:50%"  v-model="loginObject.code"  placeholder="验证码" />
     <img style="width:100px;height:39px" @click="changeCode" :src="codeSrc">
    </form>
    <ul class="tick w3layouts agileits">
     <li>
       <input type="checkbox" id="brand1" value="" v-model="isRemember"/>
       <label for="brand1"><span></span>记住我</label>

       <a href="#" style="float:right" class="gorget-a">记住密码?</a>
     </li>
    </ul>
    <div class="send-button w3layouts agileits">
     <form>
       <!-- @click.prevent 点击时触发submit 函数 ， .prevent 阻止表单的提交事件 -->
      <input type="submit" value="登 录" @click.prevent="submitLogin"/>
     </form>
    </div>
    <router-link to="/register" tag="a">注册>></router-link>
    <div class="clear"></div>
   </div>
   <div class="clear"></div>
  </div>

</div>
</template>
<script>
import Base64 from '../../public/js/util/base64.js'

export default {
  data () {
    return {
      centerDialogVisible: false,
      loginObject: {
        email: '',
        password: '',
        code: '',
        sessionId: ''
      },
      isRemember: false,
      codeSrc: 'http://localhost:8080/photo/user/getLoginCode'
    }
  },
  mounted: function () {
    // 加载页面的时候，把从前记录下来的邮箱和密码读取出来填充到页面中
    debugger
    var photoEmail = localStorage.getItem('photo_email')
    var photoPassword = localStorage.getItem('photo_password')

    if (photoEmail) {
      this.loginObject.email = Base64.decode(photoEmail)
    }
    if (photoPassword) {
      this.loginObject.password = Base64.decode(photoPassword)
    }
    // 同时存在邮箱和密码时，默认给记住我打勾
    if (photoEmail && photoPassword) {
      this.isRemember = true
    }
  },
  methods: {
    submitLogin: function () {
      // 点击记住我时，把邮箱和密码存入到localStorage(浏览器内存)
      if (this.isRemember) {
        localStorage.setItem('photo_email', Base64.encode(this.loginObject.email))
        localStorage.setItem('photo_password', Base64.encode(this.loginObject.password))
      }

      // 发起登录的请求
      var params = new URLSearchParams()
      params.append('userEmail', this.loginObject.email)
      params.append('userPassword', this.loginObject.password)
      params.append('code', this.loginObject.code)

      this.$http.post('/user/login', params, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }).then((response) => {
        if (response.data.content.status === '00') {
          this.$router.push({ path: '/index' })
        }
        // console.log('登录成功后的' + response)
      })
    },
    changeCode: function () {
      debugger
      var num = Math.ceil(Math.random() * 10) // 生成一个随机数（防止缓存）
      if (this.codeSrc.indexOf('?') >= 0) {
        this.codeSrc = this.codeSrc.substring(0, this.codeSrc.indexOf('?') + 1) + num
      } else {
        this.codeSrc = this.codeSrc + '?' + num
      }
    }
  }
}
</script>

<style scoped src='../../public/css/style.css'>
</style>
