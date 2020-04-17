
<template>
  <div id="all-div">
      <div id="friend-app" style="">
        <div class="cntro-div">
          <div class="user-img-div"><img src="../../public/images/friend1.jpg" style="width:40px;height:40px;margin-left:5px"></div>
          <ui>
            <li><a @click.prevent="isShowFriend=false" :class="{check:!isShowFriend,'icon-a':true}"><i class="el-icon-chat-round"></i></a></li>
            <li><a @click.prevent="isShowFriend=true" :class="{check:isShowFriend,'icon-a':true}"><i class="el-icon-user"></i></a></li>
          </ui>
        </div>
        <!-- 聊天功能所有的页面 -->
        <div class="sidebar">
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
                  <img class="avatar" width="30" height="30" :alt="item.user.name" :src="item.user.img" />
                  <p class="name">{{item.user.name}}</p>
                </li>
              </ul>
            </div>
          </div>
          <!--好友功能所有的页面-->
          <div v-show="isShowFriend">
            <div class="card">
              <header>
                <input class="search" type="text" placeholder="search user..." @keyup="onKeyup" />
              </header>
              <div class="card-footer">
                <div class="card-tietle">新的朋友</div>
                <div :class="{'cart-list-div':true,'current-cart-list-div':'new_friend'===currentCartListValue}" @click="selectCardList('new_friend')">
                  <el-row>
                    <el-col :span="5">
                      <img style="height: 35px;" src="../../public/images/addFriend.png">
                    </el-col>
                    <el-col :span="16">
                      <div class="card-content" @click="dialogVisible=true">新的朋友</div>
                    </el-col>
                  </el-row>
                </div>
              </div>
              <div class="card-footer">
                <div class="card-tietle">好友申请</div>
                <div :class="{'cart-list-div':true,'current-cart-list-div':'new_friend'===currentCartListValue}" @click="selectCardList('new_friend')">
                  <el-row>
                    <el-col :span="5">
                      <img style="height: 30px;" src="../../public/images/friendApply.png">
                    </el-col>
                    <el-col :span="16">
                      <div class="card-content"><router-link to="/friend/friendApplyList" tag="a">好友申请</router-link></div>
                    </el-col>
                  </el-row>
                </div>
              </div>
            </div>
            <div class="list">
              <ul>
                <li
                  v-for="(item,index) in currentSessions"
                  :key="'user_list'+index"
                  :class="{ active: item.id === currentSessionId }"
                  @click="selectSession(item.id)"
                >
                  <img class="avatar" width="30" height="30" :alt="item.user.name" :src="item.user.img" />
                  <p class="name">{{item.user.name}}</p>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <!-- 聊天页面 -->
          <div class="main" v-show="!isShowFriend">
          <div class="message" v-scroll-bottom="session.messages">
            <ul v-if="session">
              <li v-for="(item,index) in session.messages" :key="'message'+index">
                <p class="time">
                  <span>{{ item.date | time }}</span>
                </p>
                <div class="main" :class="{ self: item.self }">
                  <img
                    class="avatar"
                    width="30"
                    height="30"
                    :src="item.self ? user.img : session.user.img"
                  />
                  <div class="messages-text">{{ item.content }}</div>
                </div>
              </li>
            </ul>
          </div>
          <div class="text">
          <textarea placeholder="按 Ctrl + Enter 发送" v-model="content" @keyup="sendMessageKeyUp"></textarea>
          </div>
        </div>
        <div style="position: relative;overflow: hidden;background-color: #eee;height:100%">
          <router-view :style="{'height':'100%'}"></router-view>
        </div>
      </div>

      <el-dialog
        title="添加好友"
        :visible.sync="dialogVisible"
        width="30%"
        :before-close="handleClose">
        <div style="margin-top: 15px;">
          <el-input placeholder="请完整的邮箱" v-model="friendApplySearchValue" class="input-with-select">
            <el-button slot="append" icon="el-icon-search" @click="friendApplySearch"></el-button>
          </el-input>
        </div>

        <template>
          <el-table
            :data="userList"
            style="width: 100%">
            <el-table-column
              prop="userName"
              label="用户名"
              width="180">
            </el-table-column>
            <el-table-column
              prop="userEmail"
              label="邮箱"
              width="180">
            </el-table-column>
            <el-table-column
              fixed="right"
              label="操作"
              width="100">
              <template slot-scope="scope">
                <el-button @click="addApply(scope.row)" type="text" size="small">添加</el-button>
              </template>
            </el-table-column>
          </el-table>

          <el-form v-show="isShowRemark">
            <el-form-item label="活动形式">
              <el-input type="textarea" v-model="currentApplyRemark"></el-input>
            </el-form-item>

             <el-form-item>
              <el-button type="primary" @click="submitForm('ruleForm')" size="small" plain>提交</el-button>
            </el-form-item>
          </el-form>
        </template>
      </el-dialog>
  </div>
</template>
<script>
export default {
  name: 'app',
  mounted: function () {
    this.currentSessions = [].concat(this.allSession)
  },
  methods: {
    onKeyup (e) { // 过滤聊天列表
      this.filterKey = e.target.value
      this.currentSessions.splice(0)
      this.currentSessions = this.allSession.filter((value) => {
        if (value.user.name.indexOf(this.filterKey) >= 0) {
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
    sendMessageKeyUp: function (e) { // 发送信息
      if (e.ctrlKey && e.keyCode === 13 && this.content.length) {
        this.session.messages.push({
          content: this.content,
          date: new Date(),
          self: true
        })
        this.content = ''
      }
    },
    selectSession: function (itemId) { // 切换用户
      this.currentSessionId = itemId
      this.session = this.currentSessions.find(function (value, index, arr) {
        if (value.id === itemId) {
          return true
        }
      })
    },
    handleClose (done) { // 关闭搜索添加好友的弹框
      this.$confirm('确认关闭？')
        .then(_ => {
          done()
        })
        .catch(_ => {})
    },
    friendApplySearch: function () { // 根据邮箱搜索好友
      if (!this.friendApplySearchValue) {
        return
      }
      var param = new URLSearchParams()
      param.append('email', this.friendApplySearchValue)
      this.$http.post('/user/getUserByEmail', param).then((response) => {
        var content = response.data.content
        if (content.status === '00') {
          this.userList = content.data.userInfo
          if (!this.userList || this.userList.length === 0) {
            this.$Message.success(content.msg)
          }
        }
      })
    },
    showRemark: function (row) { // 点击添加按钮,展示备注页面
      this.currentApplyFriendId = row.userId
      this.isShowRemark = true
    },
    addApply: function () { // 提交好友申请
      if (this.currentApplyRemark && this.currentApplyRemark.length > 20) {
        this.$Message.error('申请备注不能超过20个字')
        return
      }

      var param = new URLSearchParams()
      param.append('toId', this.currentApplyFriendId)
      param.append('remark', this.currentApplyRemark)
      // 提交添加好友申请
      this.$http.post('/friendApply/insertApply', param).then((response) => {
        var content = response.data.content
        if (content.status === '00') {
          if (content.data.result) {
            this.$Message.success(content.data.msg)
          } else {
            this.$Message.error(content.data.msg)
          }
        }
      })
      this.isShowRemark = true
    },
    selectCardList: function () {
    }
  },
  data () {
    return {
      dialogVisible: false,
      isShowFriend: false,
      content: '',
      // 当前用户
      user: {
        name: 'coffce',
        img: '../../public/images/friend1.jpg'
      },
      // 会话列表
      allSession: [
        {
          id: 1,
          user: {
            name: '示例介绍',
            img: '../../public/images/friend2.png'
          },
          messages: [
            {
              content:
                'Hello，这是一个基于Vue + Vuex + Webpack构建的简单chat示例，聊天记录保存在localStorge, 有什么问题可以通过Github Issue问我。',
              date: new Date()
            },
            {
              content: '项目地址: https://github.com/coffcer/vue-chat',
              date: new Date()
            }
          ]
        },
        {
          id: 2,
          user: {
            name: 'webpack',
            img: '../../public/images/friend3.jpg'
          },
          messages: []
        }
      ],
      currentSessions: [], // 当前符合筛选条件的聊天记录
      session: {
        id: 1,
        user: {
          name: '示例介绍',
          img: '../../public/images/friend2.png'
        },
        messages: [
          {
            content:
              'Hello，这是一个基于Vue + Vuex + Webpack构建的简单chat示例，聊天记录保存在localStorge, 有什么问题可以通过Github Issue问我。',
            date: new Date()
          },
          {
            content: '项目地址: https://github.com/coffcer/vue-chat',
            date: new Date()
          }
        ]
      },
      // 当前选中的会话
      currentSessionId: 1,
      // 过滤出只包含这个key的会话
      filterKey: '',
      // 当前好友列表
      allFriendList: [],
      // 符合条件的好友列表
      currentFriendList: [],
      // 好友列表页面筛选的关键字
      friendKey: '',
      // 搜索添加好友的搜索结果列表
      userList: [],
      // 添加好友的搜索输入的内容
      friendApplySearchValue: '',
      // 好友页面当前选中的功能或者好友
      currentCartListValue: '',
      // 添加好友页面点击添加按钮的好友id
      currentApplyFriendId: '',
      // 添加好友页面的备注
      currentApplyRemark: '',
      // 是否展示备注
      isShowRemark: false
    }
  },
  filters: {
    // 将日期过滤为 hour:minutes
    time (date) {
      // if (typeof date === 'string') {

      // }
      date = new Date(date)
      return date.getHours() + ':' + date.getMinutes()
    }
  },
  directives: {
    // 发送消息后滚动到底部
    'scroll-bottom': function (el, binding, vnode) {
      vnode.context.$nextTick(() => {
        vnode.context.scrollTop = vnode.context.scrollHeight - vnode.context.clientHeight
      })
    }
  }
}
</script>
<style src="../../public/css/friend.css" scoped>

</style>
