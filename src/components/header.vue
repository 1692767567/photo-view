<template>
  <div style="width:100%" class="layui-row">
        <div class="header">
          <div class="menu-btn">
            <div class="menu"></div>
          </div>
        <h1 class="logo layui-col-md2" >
          <a href="index.html">
              <span>MYBLOG</span>
              <img src="../../public/images/logo.png">
          </a>
        </h1>
        <div class="nav layui-col-md6">
          <router-link to="/dirList" tag="a">相册</router-link>
          <router-link to="/friend" tag="a">好友</router-link>
          <router-link to="/friend" tag="a">动态</router-link>
          <router-link to="/albumTemp" tag="a">动态相册模板</router-link>
          <router-link to="/userAlbum" tag="a">动态相册</router-link>
          <router-link to="/management" tag="a" v-if="showManagement">管理</router-link>
        </div>

        <ul class="layui-nav layui-col-md2 layui-col-md-offset8" :style="{'background':'#fff','color': '#3f2863'}">
          <li class="layui-nav-item" v-show="reayLogin">
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
          <li class="layui-nav-item" v-show="!reayLogin">
            <router-link tag="a" to="/login">登录</router-link>
          </li>
          <li class="layui-nav-item" v-show="!reayLogin">
            <router-link tag="a" to="/login">注册</router-link>
          </li>
      </ul>

      <div class="layui-col-md2" >
        <el-row class="block-col-2">
          <el-col :span="24">
            <el-dropdown trigger="click">
              <span class="el-dropdown-link">
                系统公告<i class="el-icon-chat-line-round"></i>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item @click.native="openAnnoun(announ)" v-for="(announ,index) in announList" :key="'announ_'+index">{{announ.title|titleFilter}}</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </el-col>
        </el-row>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: 'app',
  data: function () {
    return {
      userPath: null,
      reayLogin: false,
      showManagement: false,
      announList: []
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
            this.$cookies.remove('cookie_role_id')
            this.reayLogin = false

            this.$Message.success(response.data.content.msg)
          } else {
            this.$Message.error(response.data.content.msg)
          }
        }
      })
    },
    changePath: function (newPath) {
      this.userPath = newPath
    },
    // 获取最新的十条公告
    getFiftyLatest: function (id) {
      this.$http.get('/announ/getFiftyLatest').then((response) => {
        if (response.data.content.status === '00') {
          this.announList = response.data.content.data.pageInfo.list
          console.log(this.announList)
          // 查询最新的一个公告是否已读
          this.isHasRead(this.announList[0])
        }
      })
    },
    // 查询最新一个公告是否已读
    isHasRead: function (announ) {
      var param = new URLSearchParams()
      param.append('announId', announ.id)
      this.$http.post('/announHistory/isHasRead', param).then((response) => {
        var content = response.data.content
        if (content.status === '00') {
          if (!content.data.isHasRead) {
            this.openAnnoun(announ)
          }
        }
      })
    },
    // 弹出公告弹框
    openAnnoun: function (announ) {
      this.$notify.info({
        title: announ.title,
        message: announ.content,
        onClose: this.insertHistory(announ.id)
      })
    },
    // 插入一条已读信息
    insertHistory: function (announId) {
      var param = new URLSearchParams()
      param.append('announId', announId)
      this.$http.post('/announHistory/insertHistory', param)
    }
  },
  created: function () {
    this.getFiftyLatest()
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

    if (this.$cookies.isKey('cookie_role_id')) {
      this.showManagement = true
    }
  },
  filters: {
    titleFilter: function (data) {
      if (data.length > 10) {
        return data.substring(0, 8) + '...'
      }

      return data
    }
  }
}

</script>

<style scoped>
 @import '../../public/css/main.css';
</style>
<style scoped >
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
