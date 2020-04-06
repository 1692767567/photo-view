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
            <a href=""><img :src="userPath" style="width:50px;height:auto" class="layui-nav-img"></a>
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
        <!-- <p class="welcome-text">
          欢迎来到<span class="name">小明</span>的博客~
        </p> -->
    </div>

    <div class="banner">
        <div class="cont w1000">
        <div class="title">
            <h3>MY<br />BLOG</h3>
            <h4>well-balanced heart</h4>
        </div>
        <div class="amount">
            <p><span class="text">访问量</span><span class="access">1000</span></p>
            <p><span class="text">日志</span><span class="daily-record">1000</span></p>
        </div>
        </div>
    </div>

    <div class="content">
        <div class="cont w1000">
        <div class="title">
            <span class="layui-breadcrumb" lay-separator="|">
            <a href="javascript:;" class="active">设计文章</a>
            <a href="javascript:;">前端文章</a>
            <a href="javascript:;">旅游杂记</a>
            </span>
        </div>
        <div class="list-item">
            <div class="item">
            <div class="layui-fluid">
                <div class="layui-row">
                <div class="layui-col-xs12 layui-col-sm4 layui-col-md5">
                    <div class="img"><img src="../../public/images/sy_img1.jpg" alt=""></div>
                </div>
                <div class="layui-col-xs12 layui-col-sm8 layui-col-md7">
                    <div class="item-cont">
                    <h3>空间立体效果图，完美呈现最终效果<button class="layui-btn layui-btn-danger new-icon">new</button></h3>
                    <h5>设计文章</h5>
                    <p>室内设计作为一门新兴的学科，尽管还只是近数十年的事，但是人们有意识地对自己生活、生产活动的室内进行安排布置，甚至美化装饰，赋予室内环境以所祈使的气氛，却早巳从人类文明伊始的时期就已存在</p>
                    <a href="details.html" class="go-icon"></a>
                    </div>
                </div>
                </div>
            </div>
            </div>
            <div class="item">
            <div class="layui-fluid">
                <div class="layui-row">
                <div class="layui-col-xs12 layui-col-sm4 layui-col-md5">
                    <div class="img"><img src="../../public/images/sy_img2.jpg" alt=""></div>
                </div>
                <div class="layui-col-xs12 layui-col-sm8 layui-col-md7">
                    <div class="item-cont">
                    <h3>空间立体效果图，完美呈现最终效果<button class="layui-btn layui-btn-danger new-icon">new</button></h3>
                    <h5>设计文章</h5>
                    <p>室内设计作为一门新兴的学科，尽管还只是近数十年的事，但是人们有意识地对自己生活、生产活动的室内进行安排布置，甚至美化装饰，赋予室内环境以所祈使的气氛，却早巳从人类文明伊始的时期就已存在</p>
                    <a href="details.html" class="go-icon"></a>
                    </div>
                </div>
                </div>
            </div>
            </div>
            <div class="item">
            <div class="layui-fluid">
                <div class="layui-row">
                <div class="layui-col-xs12 layui-col-sm4 layui-col-md5">
                    <div class="img"><img src="../../public/images/sy_img3.jpg" alt=""></div>
                </div>
                <div class="layui-col-xs12 layui-col-sm8 layui-col-md7">
                    <div class="item-cont">
                    <h3>空间立体效果图，完美呈现最终效果<button class="layui-btn layui-btn-danger new-icon">new</button></h3>
                    <h5>设计文章</h5>
                    <p>室内设计作为一门新兴的学科，尽管还只是近数十年的事，但是人们有意识地对自己生活、生产活动的室内进行安排布置，甚至美化装饰，赋予室内环境以所祈使的气氛，却早巳从人类文明伊始的时期就已存在</p>
                    <a href="details.html" class="go-icon"></a>
                    </div>
                </div>
                </div>
            </div>
            </div>
            <div class="item">
            <div class="layui-fluid">
                <div class="layui-row">
                <div class="layui-col-xs12 layui-col-sm4 layui-col-md5">
                    <div class="img"><img src="../../public/images/sy_img4.jpg" alt=""></div>
                </div>
                <div class="layui-col-xs12 layui-col-sm8 layui-col-md7">
                    <div class="item-cont">
                    <h3>空间立体效果图，完美呈现最终效果<button class="layui-btn layui-btn-danger new-icon">new</button></h3>
                    <h5>设计文章</h5>
                    <p>室内设计作为一门新兴的学科，尽管还只是近数十年的事，但是人们有意识地对自己生活、生产活动的室内进行安排布置，甚至美化装饰，赋予室内环境以所祈使的气氛，却早巳从人类文明伊始的时期就已存在</p>
                    <a href="details.html" class="go-icon"></a>
                    </div>
                </div>
                </div>
            </div>
            </div>
            <div class="item">
            <div class="layui-fluid">
                <div class="layui-row">
                <div class="layui-col-xs12 layui-col-sm4 layui-col-md5">
                    <div class="img"><img src="../../public/images/sy_img5.jpg" alt=""></div>
                </div>
                <div class="layui-col-xs12 layui-col-sm8 layui-col-md7">
                    <div class="item-cont">
                    <h3>空间立体效果图，完美呈现最终效果<button class="layui-btn layui-btn-danger new-icon">new</button></h3>
                    <h5>设计文章</h5>
                    <p>室内设计作为一门新兴的学科，尽管还只是近数十年的事，但是人们有意识地对自己生活、生产活动的室内进行安排布置，甚至美化装饰，赋予室内环境以所祈使的气氛，却早巳从人类文明伊始的时期就已存在</p>
                    <a href="details.html" class="go-icon"></a>
                    </div>
                </div>
                </div>
            </div>
            </div>
        </div>
        <div id="demo" style="text-align: center;"></div>
        </div>
    </div>

    <div class="footer-wrap">
        <div class="footer w1000">
        <div class="qrcode">
            <img src="../../public/images/erweima.jpg">
        </div>
        <div class="practice-mode">
            <img src="../../public/images/down_img.jpg">
            <div class="text">
            <h4 class="title">我的联系方式</h4>
            <p>微信<span class="WeChat">1234567890</span></p>
            <p>手机<span class="iphone">1234567890</span></p>
            <p>邮箱<span class="email">1234567890@qq.com</span></p>
            </div>
        </div>
        </div>
    </div>
  </div>
</template>

<script>

export default {
  name: 'app',
  data: function () {
    return {
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
    this.$http.get('/user/getUserInfo').then((response) => {
      debugger
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
