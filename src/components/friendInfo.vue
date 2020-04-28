<template>
    <el-row>
        <el-col :span="12" :offset="6">
            <div style="border-bottom:1px solid #000;padding-top:50px">
                <el-row>
                    <el-col :span="12">
                      <div style="font-size: 20px;font-weight: bold;">{{friendInfo.friendName}}</div>
                    </el-col>
                    <el-col :span="12" :style="{'text-align':'right'}">
                      <img style="width:100px" :src="friendInfo.friendPhoto">
                    </el-col>
                </el-row>
            </div>
            <div class="friend-info-div" style="border-bottom:1px solid #000">
              <ul>
                <li><label for="">备注：</label><span>{{friendInfo.remark}}</span></li>
                <li><label for="">个性签名</label><span>{{friendInfo.signature}}</span></li>
                <li><label for="">添加时间：</label><span>{{friendInfo.createTime | dateFilter}}</span></li>
              </ul>
            </div>
            <div class="friend-info-div" style="border-bottom:1px solid #000">
              <el-row>
                <el-col :span="2" :offset="10"><el-button type="success" @click.native="addSession()">发送信息</el-button></el-col>
              </el-row>
            </div>
        </el-col>
    </el-row>
</template>
<script>
export default {
  data: function () {
    return {
      frinedId: '',
      friendInfo: ''
    }
  },
  methods: {
    getFriendInfo: function (frinedId) {
      // 拿到当前当前的用户id
      this.frinedId = frinedId
      this.$http.get('/friend/getFriendInfo?friendId=' + this.frinedId).then((response) => {
        var content = response.data.content
        if (content.status === '00') {
          // 拿到当前用户信息
          this.friendInfo = content.data.friendInfo
        }
      })
    },
    // 点击发送信息，新建会话
    addSession: function () {
      this.$parent.insertNewSession()
    }
  },
  watch: {
    // 监控路由如何包含friendInfo，也就是好友消息，就调用获取好友消息的接口
    '$route' (to, form) {
      console.log(to)
      if (to.name === 'friendInfo') {
        this.getFriendInfo(to.params.friendId)
      }
    }
  }
}
</script>
<style>
label{
  width:100px;
  text-align:right;
}

.friend-info-div{
  padding: 20px 0px;
}

.friend-info-div ul li{
  padding: 10px 0px;
}
</style>
