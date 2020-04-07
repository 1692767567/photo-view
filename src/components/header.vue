<template>
  <div style="width:100%" class="layui-row">
        <div class="header">
          <div class="menu-btn">
            <div class="menu"></div>
          </div>
        <h1 class="logo layui-col-md3" >
          <a href="index.html">
              <span>MYBLOG</span>
              <img src="../../public/images/logo.png">
          </a>
        </h1>
        <div class="nav layui-col-md6">
          <a href="index.html" class="active">文章</a>
          <a href="whisper.html">微语</a>
          <a href="leacots.html">留言</a>
          <a href="album.html">相册</a>
          <a href="about.html">关于</a>
        </div>

        <ul class="layui-nav layui-col-md3 layui-col-md-offset9" :style="{'background':'#fff','color': '#3f2863'}">
          <li class="layui-nav-item" v-if="reayLogin">
            <img :src="userPath" style="width:50px;height:50px;" class="layui-nav-img">
            <dl class="layui-nav-child">
              <dd>
                <router-link to="/updateSelfInfo" tag="a">个人信息</router-link>
              </dd>
              <dd><a href="javascript:;">安全管理</a></dd>
              <dd>
                <a @click.prevent="loginOut">退出</a>
                </dd>
            </dl>
          </li>
          <li class="layui-nav-item" v-if="!reayLogin">
            <router-link tag="a" to="/login">登录</router-link>
          </li>
          <li class="layui-nav-item" v-if="!reayLogin">
            <router-link tag="a" to="/login">注册</router-link>
          </li>
        </ul>
    </div>

  </div>
</template>

<script>

export default {
  name: 'app',
  data: function () {
    return {
      userPath: null,
      reayLogin: false
    }
  },
  methods: {
    loginOut: function () {
      // 退出登录功能
      this.$http.get('/user/loginOut').then((response) => {
        if (response.data.content.status === '00') {
          if (response.data.content.data.result) {
            // 清除cookie
            this.$cookies.remove('cookie_token')
            this.reayLogin = false
          } else {
            this.$Message.error(response.data.content.msg)
          }
        }
      })
    },
    changePath: function (newPath) {
      console.log('之前' + newPath)
      this.userPath = newPath
      console.log('之前' + newPath)
    }
  },
  mounted: function () {
    // eslint-disable-next-line no-undef
    layui.use('element', function () {
      //  导航的hover效果、二级菜单等功能，需要依赖element模块
      // eslint-disable-next-line no-undef
      var element = layui.element
      //  监听导航点击
      element.on('nav(demo)', function (elem) {
        console.log(elem)
        // eslint-disable-next-line no-undef
        layer.msg(elem.text())
      })
    })

    if (this.$cookies.isKey('cookie_token')) {
      this.$http.get('/user/getUserInfo').then((response) => {
        if (response.data.content.data.isLogin) {
          this.reayLogin = true
          this.userPath = response.data.content.data.userPath
          console.log(this.reayLogin)
        } else {
          this.reayLogin = false
          this.userPath = ''
        }
      })
    }
  }
}

</script>

<style>
  @import '../../public/css/main.css';

  .layui-nav .layui-nav-item a{
    color: #3f2863;
  }

  .layui-nav .layui-nav-item a:hover, .layui-nav .layui-this a {
      color: #3f2863;
      border-color: #fff;
  }

  .layui-nav .layui-this:after,
  .layui-nav-bar,
  .layui-nav .layui-nav-item a:after {
    position: absolute;
    left: 0;
    top: 0;
    width: 0;
    height: 0px;/*原为5px，我设置为1px*/
    background-color: #009261;
    transition: all .2s;
    -webkit-transition: all .2s
  }
</style>
