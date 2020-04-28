
<template>
  <div id="all-div">
      <div id="friend-app" style="">
        <!-- 聊天功能所有的页面 -->
        <div class="sidebar" style="width:250px">
          <div v-show="!isShowFriend">
            <div class="card">
              <header>
              </header>
              <footer>
                <input class="search" type="text" placeholder="search user..."/>
              </footer>
            </div>
            <div class="list">
              <ul>
                <li
                >
                <el-row>
                  <el-col :span="4" :style="{'postion':relative}">
                    <div style="position: relative;">
                      <img class="avatar" width="40" height="40"  src="http://localhost:8080/photo/headPortrait/default.png" />
                      <i style="display: inline-block;width: 15px;height: 15px;text-align: center;background: red;line-height: 15px;color: #fff;border-radius: 50%;position: absolute;right: 0px;top: 0px;">3</i>
                    </div>
                  </el-col>
                  <el-col :span="13">
                    <p class="name" style="line-height: 24px;font-size: 14px;display:block">{{'微光xx' | friendNameFilter}}</p>
                    <p class="name" style="line-height:16px;color: #555;font-size: 12px;display:block">{{'微光xx' | friendNameFilter}}</p>
                  </el-col>
                  <el-col :span="7">
                    <p style="font-size: 8px;text-align: right;color: #555;">{{ '2018-02-04 12:12:12' | lasttime}}</p>
                  </el-col>
                </el-row>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
  </div>
</template>
<script>
export default {
  name: 'app',
  filters: {
    // 将日期过滤为 hour:minutes
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
  }
}
</script>
<style src="../../public/css/friend.css" scoped>

</style>
