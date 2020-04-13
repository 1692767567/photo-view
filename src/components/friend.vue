<script>
export default {
  created () {},
  methods: {
    onKeyup (e) {
      this.search(e.target.value)
    },
    sendMessageKeyUp: function (e) {
      if (e.ctrlKey && e.keyCode === 13 && this.content.length) {
        this.sendMessage(this.content)
        this.content = ''
      }
    }
  },
  data () {
    return {
      content: '',
      // 当前用户
      user: {
        name: 'coffce',
        img: './dist/images/1.jpg'
      },
      // 会话列表
      sessions: [
        {
          id: 1,
          user: {
            name: '示例介绍',
            img: './dist/images/2.png'
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
            img: './dist/images/3.jpg'
          },
          messages: []
        }
      ],
      session: {
        id: 1,
        user: {
          name: '示例介绍',
          img: './dist/images/2.png'
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
      filterKey: ''
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
    'scroll-bottom' () {
      this.vm.$nextTick(() => {
        this.el.scrollTop = this.el.scrollHeight - this.el.clientHeight
      })
    }
  }
}
</script>

<template>
  <div id="app">
    <div class="sidebar">
      <div class="card">
        <header>
          <img class="avatar" width="40" height="40" :alt="user.name" :src="user.img" />
          <p class="name">{{user.name}}</p>
        </header>
        <footer>
          <input class="search" type="text" placeholder="search user..." @keyup="onKeyup" />
        </footer>
      </div>
      <div class="list">
        <ul>
          <li
            v-for="(item,index) in sessions"
            :key="'user_list'+index"
            :class="{ active: item.id === currentId }"
            @click="selectSession(item.id)"
          >
            <img class="avatar" width="30" height="30" :alt="item.user.name" :src="item.user.img" />
            <p class="name">{{item.user.name}}</p>
          </li>
        </ul>
      </div>
    </div>
    <div class="main">
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
              <div class="text">{{ item.content }}</div>
            </div>
          </li>
        </ul>
      </div>
      <textarea placeholder="按 Ctrl + Enter 发送" v-model="content" @keyup="sendMessageKeyUp"></textarea>
    </div>
  </div>
</template>

<style lang="less" scoped>
#app {
  margin: 20px auto;
  width: 800px;
  height: 600px;

  overflow: hidden;
  border-radius: 3px;

  .sidebar,
  .main {
    height: 100%;
  }
  .sidebar {
    float: left;
    width: 200px;
    color: #f4f4f4;
    background-color: #2e3238;
  }
  .main {
    position: relative;
    overflow: hidden;
    background-color: #eee;
  }
  .text {
    position: absolute;
    width: 100%;
    bottom: 0;
    left: 0;
  }
  .message {
    height: ~"calc(100% - 160px)";
  }
}
</style>

<style scoped lang="less">
.card {
  padding: 12px;
  border-bottom: solid 1px #24272c;

  footer {
    margin-top: 10px;
  }

  .avatar,
  .name {
    vertical-align: middle;
  }
  .avatar {
    border-radius: 2px;
  }
  .name {
    display: inline-block;
    margin: 0 0 0 15px;
    font-size: 16px;
  }
  .search {
    padding: 0 10px;
    width: 100%;
    font-size: 12px;
    color: #fff;
    height: 30px;
    line-height: 30px;
    border: solid 1px #3a3a3a;
    border-radius: 4px;
    outline: none;
    background-color: #26292e;
  }
}
</style>

<style scoped lang="less">
.list {
  li {
    padding: 12px 15px;
    border-bottom: 1px solid #292c33;
    cursor: pointer;
    transition: background-color 0.1s;

    &:hover {
      background-color: rgba(255, 255, 255, 0.03);
    }
    &.active {
      background-color: rgba(255, 255, 255, 0.1);
    }
  }
  .avatar,
  .name {
    vertical-align: middle;
  }
  .avatar {
    border-radius: 2px;
  }
  .name {
    display: inline-block;
    margin: 0 0 0 15px;
  }
}
</style>

<style lang="less" scoped>
.message {
  padding: 10px 15px;
  overflow-y: scroll;

  li {
    margin-bottom: 15px;
  }
  .time {
    margin: 7px 0;
    text-align: center;

    > span {
      display: inline-block;
      padding: 0 18px;
      font-size: 12px;
      color: #fff;
      border-radius: 2px;
      background-color: #dcdcdc;
    }
  }
  .avatar {
    float: left;
    margin: 0 10px 0 0;
    border-radius: 3px;
  }
  .text {
    display: inline-block;
    position: relative;
    padding: 0 10px;
    max-width: ~"calc(100% - 40px)";
    min-height: 30px;
    line-height: 2.5;
    font-size: 12px;
    text-align: left;
    word-break: break-all;
    background-color: #fafafa;
    border-radius: 4px;

    &:before {
      content: " ";
      position: absolute;
      top: 9px;
      right: 100%;
      border: 6px solid transparent;
      border-right-color: #fafafa;
    }
  }

  .self {
    text-align: right;

    .avatar {
      float: right;
      margin: 0 0 0 10px;
    }
    .text {
      background-color: #b2e281;

      &:before {
        right: inherit;
        left: 100%;
        border-right-color: transparent;
        border-left-color: #b2e281;
      }
    }
  }
}
</style>

<style lang="less" scoped>
.text {
  height: 160px;
  border-top: solid 1px #ddd;

  textarea {
    padding: 10px;
    height: 100%;
    width: 100%;
    border: none;
    outline: none;
    font-family: "Micrsofot Yahei";
    resize: none;
  }
}
</style>
