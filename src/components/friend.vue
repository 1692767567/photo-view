
<template>
  <div id="all-div">
      <div id="friend-app" style="">
        <div class="cntro-div">
          <div class="user-img-div"><img :src="user.photoPath" style="width:40px;height:40px;margin-left:5px"></div>
          <ul>
            <li><a @click.prevent="isShowFriend=false" :class="{check:!isShowFriend,'icon-a':true}"><i class="el-icon-chat-round"></i></a></li>
            <li @click="getAllFriend()"><a @click.prevent="isShowFriend=true" :class="{check:isShowFriend,'icon-a':true}"><i class="el-icon-user"></i></a></li>
          </ul>
        </div>
        <!-- 聊天功能所有的页面 -->
        <div class="sidebar" style="width:250px">
          <div v-show="!isShowFriend">
            <div class="card">
              <header>
              </header>
              <footer>
                <input class="search" type="text" placeholder="search user..." @keyup="onKeyup" />
              </footer>
            </div>
            <div class="list">
              <ul>
                <li
                  v-for="(item,index) in currentSessions"
                  :key="'user_list'+index"
                  :class="{ active: item.id === currentSessionId }"
                  @click="selectSession(item.id)"
                >
                  <!-- <img class="avatar" width="30" height="30" :alt="item.frinedName" :src="item.friendPhoto" />
                  <p class="name">{{item.frinedName | friendNameFilter}}</p> -->

                  <el-row>
                  <el-col :span="4">
                    <div style="position: relative;">
                      <img class="avatar" width="40" height="40"  :alt="item.frinedName" :src="item.friendPhoto"/>
                      <i v-show="item.unreadCount>0" style="display: inline-block;width: 15px;height: 15px;text-align: center;background: red;line-height: 15px;color: #fff;border-radius: 50%;position: absolute;right: 0px;top: 0px;">{{item.unreadCount}}</i>
                    </div>
                  </el-col>
                  <el-col :span="13">
                    <p class="name" style="line-height: 24px;font-size: 14px;display:block">{{item.frinedName | friendNameFilter}}</p>
                    <p class="name" style="line-height:16px;color: #555;font-size: 12px;display:block">{{item.lastContent | friendNameFilter}}</p>
                  </el-col>
                  <el-col :span="7">
                    <p style="font-size: 8px;text-align: right;color: #555;">{{ item.lastDate | lasttime}}</p>
                  </el-col>
                </el-row>
                </li>
              </ul>
            </div>
          </div>
          <!--好友功能所有的页面-->
          <div v-show="isShowFriend">
            <div class="card">
              <header>
                <input class="search" type="text" placeholder="search user..." @keyup="onKeyup2" />
              </header>
              <div class="card-footer">
                <div class="card-tietle">新的朋友</div>
                <div :key="'apply_list'" :class="{'cart-list-div':true,active:'new_friend'===currentCartListValue}" @click="selectCardList('new_friend')">
                  <el-row>
                    <el-col :span="5">
                      <img style="height: 35px;" src="../../public/images/addFriend.png">
                    </el-col>
                    <el-col :span="16">
                      <div class="card-content" @click="opendAddFriend"><router-link to="/friend/addFriendApply" tag="a">新的朋友</router-link></div>
                    </el-col>
                  </el-row>
                </div>
              </div>
              <div class="card-footer">
                <div class="card-tietle">好友申请</div>
                <div :key="'apply_list'" :class="{'cart-list-div':true,active:'apply_list'===currentCartListValue}" @click="selectCardList('apply_list')">
                  <el-row>
                    <el-col :span="5">
                      <img style="height: 30px;" src="../../public/images/friendApply.png">
                    </el-col>
                    <el-col :span="16">
                      <div class="card-content" @click="openApplyList"><router-link to="/friend/friendApplyList" tag="a" ref="applyList">好友申请</router-link></div>
                    </el-col>
                  </el-row>
                </div>
              </div>
            </div>
            <div class="list">
              <ul>
                <li
                  v-for="(item,index) in currentFriendList"
                  :key="'user_list'+index"
                  :class="{ active: 'friend_'+item.id == currentCartListValue }"
                  @click="selectCardList('friend_'+item.id)"
                >
                <!-- 设置满宽高、设置点击时间 -->
                  <!-- <div style="width:100%;height:100%" > -->
                    <router-link :to="{name:'friendInfo',params:{friendId:item.friendId}}" tag="div" @click.native="openFriendInfo(item.friendId)">
                    <img class="avatar" width="30" height="30" :alt="item.remark" :src="item.friendPhoto" />
                    <p class="name">{{item.remark | friendNameFilter}}</p>
                    </router-link>
                  <!-- </div> -->
                </li>
              </ul>
            </div>
          </div>
        </div>
        <!-- 聊天页面 -->
          <div class="main" v-show="!isShowFriend">
          <div class="message" v-scroll-bottom="currentMessages">
            <ul v-if="session">
              <li v-for="(item,index) in currentMessages" :key="'message'+index">
                <p class="time">
                  <span>{{ item.createTime | time }}</span>
                </p>
                <div class="main" :class="{ self: item.userId === item.fromId }">
                  <img
                    class="avatar"
                    width="30"
                    height="30"
                    :src="item.userId === item.fromId ? user.photoPath : session.friendPhoto"
                  />
                  <div class="messages-text">{{ item.message }}</div>
                </div>
              </li>
            </ul>
          </div>
          <div class="text">
          <textarea placeholder="按 Ctrl + Enter 发送" v-model="content" @keyup="websocketsend"></textarea>
          </div>
        </div>
        <div style="position: relative;overflow: hidden;background-color: #eee;height:100%">
          <router-view :style="{'height':'100%'}" ref="view"></router-view>
        </div>
      </div>
  </div>
</template>
<script>
import indexedDBUtil from '../../public/js/util/indexdb.js'
export default {
  name: 'app',
  created () {
    this.$http.get('/user/getUserAllInfo').then((response) => {
      var content = response.data.content
      if (content.status === '00') {
        this.user = content.data.userInfo
        // 初始化websocet
        this.initWebSocket(this.user.userId)

        // 打开本地数据库
        indexedDBUtil.init(this.user.userId)
        //  加载时，请求未读消息
        this.receiveUnreadMessage()
      }
    })
  },
  destroyed () {
    // 离开路由之后断开websocket连接
    this.webSocket.close()
  },
  mounted: function () {
    this.currentSessions = [].concat(this.allSession)
  },
  methods: {
    onKeyup (e) { // 过滤聊天列表
      this.filterKey = e.target.value
      this.currentSessions.splice(0)
      this.currentSessions = this.allSession.filter((value) => {
        if (value.frinedName.indexOf(this.filterKey) >= 0) {
          return value
        }
      })
    },
    onKeyup2 (e) { // 过滤好友列表
      debugger
      this.filterKey = e.target.value
      this.currentFriendList.splice(0)
      this.currentFriendList = this.allFriendList.filter((value) => {
        if (value.remark.indexOf(this.filterKey) >= 0) {
          return value
        }
      })
    },
    filterFriend (e) { // 过滤好友列表
      this.friendKey = e.target.value
      this.currentFriendList.splice(0)
      this.currentFriendList = this.allFriendList.filter((value) => {
        if (value.remark.indexOf(this.friendKey) >= 0) {
          return value
        }
      })
    },
    selectSession: function (itemId) { // 切换会话
      this.isShowFriend = false
      this.currentSessionId = itemId
      this.session = this.currentSessions.find(function (value, index, arr) {
        if (value.id === itemId) {
          return true
        }
      })
      // 设置信息已读
      indexedDBUtil.setContentRead(this.session, this.user)

      this.currentFriendId = this.session.friendId
      this.$http.get('/friend/getFriendInfo?friendId=' + this.currentFriendId).then((response) => {
        var content = response.data.content
        if (content.status === '00') {
          this.currentFriend = content.data.friendInfo
          if (!this.session) {
            return
          }

          this.currentMessages.splice(0)
          // 如果头像已经更换，就更新本地数据库头像
          if (this.session.friendPhoto !== this.currentFriend.friendPhoto) {
            this.session.friendPhoto = this.currentFriend.friendPhoto
            indexedDBUtil.updateFriendPhoto(this.session, this.currentMessages)
          } else {
            indexedDBUtil.getSessionContext(this.session.id, this.user.userId, this.currentMessages)
          }
        }
      })
    },
    selectCardList: function (val) { // 选中功能或者好友
      this.currentCartListValue = val
    },
    opendAddFriend: function () { // 打开添加好友页面
      this.$refs.view.changeDialogVisible()
    },
    openApplyList: function () { // 打开申请列表页面
      this.$refs.view.getAllApply()
    },
    openFriendInfo: function (friendId) { // 打开好友详情页面
      this.currentFriendId = friendId
    },
    getAllFriend: function () { // 查询当前用户所有的好友
      this.$http.get('/friend/getAllFriend').then((response) => {
        var content = response.data.content
        if (content.status === '00') {
          this.allFriendList = content.data.allFriend
        }
      })
    },
    // 点击好友消息页面的发信息，就需要创建一个新会话
    insertNewSession: function () {
      this.$http.get('/friend/getFriendInfo?friendId=' + this.currentFriendId).then((response) => {
        var content = response.data.content

        if (content.status === '00') {
          this.currentFriend = content.data.friendInfo
          var session = this.allSession.find((session) => {
            if (session.friendId === this.currentFriend.friendId) {
              return true
            }
          })

          var _this = this
          // 当和当前好友的会话不存在时，就新建会话
          if (!session) {
            session = {
              userId: _this.user.userId,
              friendId: _this.currentFriend.friendId,
              friendPhoto: _this.currentFriend.friendPhoto,
              lastContent: '',
              frinedName: _this.currentFriend.remark,
              lastDate: new Date()
            }
            indexedDBUtil.insertSession(session, this.allSession, this.currentSessions, this.selectSession)
          } else { // 已经存在和当前好友的会话
            this.selectSession(session.id)
          }
        }
      })
    },
    // 进入页面时，读取未读消息
    receiveUnreadMessage: function () {
      this.$http.get('/unreadMessage/getAllUnreadMessage').then((response) => {
        var content = response.data.content
        if (content.status === '00') {
          var messageList = content.data.allMessages

          if (messageList === undefined || messageList == null || messageList.length === 0) {
            indexedDBUtil.getUserAllSession(this.user.userId, this.allSession)
            return
          }

          for (var i = 0; i < messageList.length; i++) {
            if (i === messageList.length - 1) {
              indexedDBUtil.receiveUnreadMessage(messageList[i], this.allSession, this.user, true)
            } else {
              indexedDBUtil.receiveUnreadMessage(messageList[i], this.allSession, this.user, false)
            }
          }
        }
      })
    },
    initWebSocket (userId) { // 初始化weosocket
      const wsuri = 'ws://localhost:8080/photo/chat?userId=' + userId
      this.webSocket = new WebSocket(wsuri)
      this.webSocket.onmessage = this.websocketonmessage
      this.webSocket.onopen = this.websocketonopen
      this.webSocket.onerror = this.websocketonerror
      this.webSocket.onclose = this.websocketclose
    },
    websocketonopen () { // 连接建立成功执行的方法
      console.log('websocket已连接')
    },
    websocketonerror () { // 连接建立失败重连
      this.initWebSocket()
    },
    websocketonmessage (e) { // 数据接收
      var data = JSON.parse(e.data)

      // 当前正处于和该好友对话，就设置成已读信息
      debugger
      if (this.session && data.fromId === this.session.friendId) {
        data.isRead = 0
      }
      // 删除data中的id，因为id应该给数据库自动生成
      delete data.id
      indexedDBUtil.receiveMessage(data, this.currentMessages, this.allSession, this.session)
    },
    // 数据发送
    websocketsend (e) {
      // 如果不是按ctrl+回车键，并且内容不为空，就结束函数
      if (e.ctrlKey && e.keyCode === 13 && this.content.length) {
        // 拿到执行vue实例的引用
        var _this = this

        // 发送的信息对象
        var data = {
          userId: _this.currentFriend.friendId,
          toId: _this.currentFriend.friendId,
          fromId: _this.user.userId,
          fromPhoto: _this.user.photoPath,
          message: this.content,
          isRead: 1,
          createTime: new Date()
        }

        // 通过webscoket发送给服务器
        this.webSocket.send(JSON.stringify(data))

        // 插入到本地indexedDB数据库
        data.sessionId = this.session.id
        data.userId = data.fromId
        data.isRead = 0
        this.session.lastContent = data.message
        this.session.lastDate = data.createTime
        indexedDBUtil.insertSessionContent(data, this.currentMessages, this.session, true)

        this.content = ''
      }
    },
    websocketclose (e) { // 关闭
      console.log('websocket已断开连接', e)
    }
  },
  data () {
    return {
      // webSocket的引用
      webSocket: null,
      // 是否展示有关好友消息，true显示的好友功能，false显示的会话功能
      isShowFriend: false,
      // 发送的信息内容
      content: '',
      // 当前用户
      user: {},
      // 会话列表
      allSession: [],
      currentMessages: [], // 当前会话的所有聊天内容
      currentSessions: [], // 当前符合筛选条件的聊天记录
      currentFriend: {}, // 当前好友
      // 当前选中的会话
      session: {},
      // 当前选中的会话Id
      currentSessionId: 1,
      // 过滤出只包含这个key的会话
      filterKey: '',
      // 当前好友列表
      allFriendList: [],
      // 符合条件的好友列表
      currentFriendList: [],
      // 好友列表页面筛选的关键字
      friendKey: '',
      // 好友页面当前选中的功能或者好友
      currentCartListValue: '',
      // 当前选中的好友id
      currentFriendId: ''
    }
  },
  filters: {
    // 将日期过滤为 hour:minutes
    time (date) {
      // if (typeof date === 'string') {

      // }
      date = new Date(date)
      var year = date.getFullYear()
      var month = date.getMonth() + 1
      if (month < 10) {
        month = '0' + month
      }
      var d = date.getDate()
      if (d < 10) {
        d = '0' + d
      }
      var hours = date.getHours()
      if (hours < 10) {
        hours = '0' + hours
      }
      var minutes = date.getMinutes()
      if (minutes < 10) {
        minutes = '0' + minutes
      }
      var seconds = date.getSeconds()
      if (seconds < 10) {
        seconds = '0' + seconds
      }
      return `${year}-${month}-${d} ${hours}:${minutes}:${seconds}`
    },
    // 过滤会话最后的事件
    lasttime (date) {
      date = new Date(date)
      var year = date.getFullYear()
      var month = date.getMonth() + 1
      if (month < 10) {
        month = '0' + month
      }
      var d = date.getDate()
      if (d < 10) {
        d = '0' + d
      }
      var hours = date.getHours()
      if (hours < 10) {
        hours = '0' + hours
      }
      var minutes = date.getMinutes()
      if (minutes < 10) {
        minutes = '0' + minutes
      }
      var seconds = date.getSeconds()
      if (seconds < 10) {
        seconds = '0' + seconds
      }

      var today = new Date()
      if (today.getFullYear() === date.getFullYear() && today.getMonth() === date.getMonth() && today.getDate() === date.getDate()) {
        return `${hours}:${minutes}:${seconds}`
      } else {
        return `${year}-${month}-${d}`
      }
    }
  },
  directives: {
    // 发送消息后滚动到底部
    'scroll-bottom': function (el, binding, vnode) {
      vnode.context.$nextTick(() => {
        vnode.context.scrollTop = vnode.context.scrollHeight - vnode.context.clientHeight
      })
    }
  },
  watch: {
    allSession: {
      handler: function () {
        this.currentSessions = [].concat(this.allSession)
      }
    },
    allFriendList: {
      handler: function () {
        this.currentFriendList = [].concat(this.allFriendList)
      }
    },
    deep: true,
    immediate: true
  }
}
</script>
<style src="../../public/css/friend.css" scoped>

</style>
