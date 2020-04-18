<template>
    <div style="background:#fff;height:100%">
        <transition name="el-zoom-in-center">
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
                    :close-on-click-modal="false"
                    :close-on-press-escape="false"
                    opened
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
                        <el-button @click="showRemark(scope.row)" type="text" size="small">添加</el-button>
                    </template>
                    </el-table-column>
                </el-table>

                <el-form v-show="isShowRemark">
                    <el-form-item label="申请备注">
                    <el-input type="textarea" v-model="currentApplyRemark"></el-input>
                    </el-form-item>

                    <el-form-item>
                    <el-button ref="submitButton" type="primary" @click="addApply" size="small" plain>提交</el-button>
                    </el-form-item>
                </el-form>
                </template>
            </el-dialog>
        </transition>
    </div>
</template>

<script>
export default {
  data: function () {
    return {
      dialogVisible: false,
      // 搜索添加好友的搜索结果列表
      userList: [],
      // 添加好友的搜索输入的内容
      friendApplySearchValue: '',
      // 添加好友页面点击添加按钮的好友id
      currentApplyFriendId: '',
      // 添加好友页面的备注
      currentApplyRemark: '',
      // 是否展示备注
      isShowRemark: false
    }
  },
  methods: {
    handleClose (done) { // 关闭搜索添加好友的弹框
      this.isShowRemark = false
      this.currentApplyFriendId = ''
      this.friendApplySearchValue = ''
      this.userList.splice(0)
      this.dialogVisible = false
      done()
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
      debugger
      this.currentApplyFriendId = row.userId
      this.isShowRemark = true
    },
    addApply: function () { // 提交好友申请
      if (this.currentApplyRemark && this.currentApplyRemark.length > 20) {
        this.$Message.error('申请备注不能超过20个字')
        this.currentApplyRemark = ''
        return
      }

      this.$refs.submitButton.disabled = true
      var param = new URLSearchParams()
      // 把好友id添加
      param.append('toId', this.currentApplyFriendId)
      param.append('remark', this.currentApplyRemark)
      // 提交添加好友申请
      this.$http.post('/friendApply/insertApply', param).then((response) => {
        // 把后端响应内容赋值给content
        var content = response.data.content
        if (content.status === '00') {
          // 判断操作的结果
          if (content.data.result) {
            this.$Message.success(content.data.msg)
            // 关闭添加好友的弹框
            this.dialogVisible = false
          } else {
            this.$Message.error(content.data.msg)
          }
        }
        // 取消提交按钮的禁用
        this.$refs.submitButton.disabled = false
      })
      this.isShowRemark = true
    },
    changeDialogVisible: function () {
      this.dialogVisible = !this.dialogVisible
    }
  }
}
</script>
