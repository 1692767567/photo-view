<template>
<div>
    <photoheader></photoheader>
    <div class="content whisper-content">
    <el-row>
      <el-col :span="2" :offset="18"><el-button @click.native="centerDialogVisible=true" type="primary" icon="el-icon-plus" circle></el-button></el-col>
    </el-row>
    <el-dialog
      title="动态信息"
      :visible.sync="centerDialogVisible"
      width="30%"
      center>
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="内容" prop="content">
          <el-input type="textarea" v-model="ruleForm.content"></el-input>
        </el-form-item>

        <el-form-item label="图片">
          <el-upload
            action="/dynamicImgUploadAPI"
            list-type="picture-card"
            :on-preview="handlePictureCardPreview"
            multiple
            :on-success="uploadSuccess"
            :limit="9"
            :on-remove="removeFile">
            <i class="el-icon-plus"></i>
          </el-upload>
        </el-form-item>
      </el-form>
      <!-- 上传文件 -->
      <el-dialog :visible.sync="dialogVisible">
        <img width="100%" :src="dialogImageUrl" alt="">
      </el-dialog>
      <span slot="footer" class="dialog-footer">
        <el-button @click="centerDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitForm('ruleForm')">确 定</el-button>
      </span>
    </el-dialog>

    <div class="cont">
      <div class="whisper-list">
        <div class="item-box" v-for="(dynamic,index) in dynamicList" :key="'dynamic_'+index">
          <div class="item">
            <div class="whisper-title">
              <i class="layui-icon layui-icon-date"></i><span class="hour">{{dynamic.createTime | hoursFilter}}</span><span class="date">{{dynamic.createTime | day2Filter}}</span>
            </div>
            <p class="text-cont">
              {{dynamic.content}}
            </p>
            <div class="img-box">
              <div style="width:200px;margin:0px 10px 10px 0px;height:200px;overflow:hidden;display:inline-block;vertical-align:middle;" v-for="(imgPath,index2) in dynamic.photoList" :key="'dynamic_'+index+'photo_'+index2">
                <img style="width:100%" :src="imgPath" @click="showDynamicImg(imgPath)">
              </div>
            </div>
             <!-- 动态图片 -->
              <el-dialog :visible.sync="isShowDynamicImg">
                <img width="100%" :src="showDynamicImgUrl" alt="">
              </el-dialog>
            <div class="op-list">
              <!-- <p class="like"><i class="layui-icon layui-icon-praise"></i><span>{{dynamic.starCount}}</span></p> -->
              <p class="edit"><i class="layui-icon layui-icon-reply-fill"></i><span>{{dynamic.commentCount}}</span></p>
              <p class="off" off = 'true' v-if="user.userId === dynamic.userId"><span @click="deleteDynamic(dynamic.id)">删除</span></p>
            </div>
          </div>
          <div class="review-version">
              <div class="form">
                <img :src="user.photoPath" style="width：50px;height:50px">
                <form class="layui-form">
                  <div class="layui-form-item layui-form-text">
                    <div class="layui-input-block">
                      <textarea :placeholder="areaPromptArr[index]" v-model="areaArr[index]" @click="comment(dynamic)"  class="layui-textarea" :id="'comment-erea-'+dynamic.id"></textarea>
                    </div>
                  </div>
                  <div class="layui-form-item">
                    <div class="layui-input-block" style="text-align: right;">
                      <button class="layui-btn" @click.prevent="insertComment()">确定</button>
                    </div>
                  </div>
                </form>
              </div>
              <div class="list-cont">
                <div class="cont" v-for="(comment,index3) in dynamic.commentList" :key="'dynamic_'+index+'comment_'+index3">
                  <div class="img">
                    <img  style="width：50px;height:50px" :src="comment.commentUser.photoPath">
                  </div>
                  <div class="text">
                    <p class="tit" v-if="comment.user == null"><span class="name">{{comment.commentUser.userName}}</span><span class="data">{{comment.createTime | day2Filter}}</span></p>
                    <p class="tit" v-if="comment.user != null"><span class="name">{{comment.commentUser.userName}} 回复 {{comment.user.userName}}</span><span class="data">{{comment.createTime | day2Filter}}</span></p>
                    <p class="ct" style="width:95%;display: inline-block;">{{comment.message}}</p>
                    <a @click="replyComment(comment,$event),changeHash('#comment-erea-'+dynamic.id)" style="width:5%;display: inline-block;" v-if="comment.commentUseId !== user.userId">回复</a>
                    <p style="width:5%;display: inline-block;" v-if="comment.commentUseId === user.userId" @click="deleteComment(comment.id,comment.dynamicId,index,index3)">删除</p>
                  </div>
                </div>
              </div>
          </div>
        </div>
      </div>
      <div id="demo1" style="text-align: center;">

      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="page.pageNumber"
        :page-sizes="[3, 5, 10, 20]"
        :page-size="page.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="page.dataCount">
      </el-pagination>

      </div>
    </div>
  </div>
  <photofooter></photofooter>
</div>
</template>
<script>
import photoheader from './header.vue'
import photofooter from './footer.vue'
export default {
  name: 'app',
  data: function () {
    return {
      // 分页的对象
      page: {
        pageSize: 3, // 当前页的大小
        dataCount: 100, // 动态总条数
        pageNumber: 1 // 第几页
      },
      // 动态列表
      dynamicList: [],
      // 当前用户信息
      user: {},
      // 控制添加弹框
      centerDialogVisible: false,
      // 控制放大好友动态图片弹框
      isShowDynamicImg: false,
      showDynamicImgUrl: '',
      // 放大图片的路径
      dialogImageUrl: '',
      // 控制放大的弹框
      dialogVisible: false,
      // 新增动态上传的所有图片列表
      photoList: [],
      // 当前评论
      currentComment: null,
      // 当前评论所在的动态数组中的下表
      currentCommentIndex: -1,
      // 回复框的提示内容数组
      areaPromptArr: [],
      // 回复框的内容数组
      areaArr: [],
      // 新增动态的对应的表单对象
      ruleForm: {
        content: ''
      },
      // 新增动态对应表单规则
      rules: {
        content: [
          { required: true, message: '请输入动态内容', trigger: 'blur' },
          { max: 255, message: '动态不能超过255字', trigger: 'blur' }
        ]
      }
    }
  },
  created: function () {
    // 查询当前用户的信息
    this.$http.get('/user/getUserAllInfo').then((response) => {
      var content = response.data.content
      if (content.status === '00') {
        this.user = content.data.userInfo
      }
    })

    this.getDynamicData(this.page.pageNumber, this.page.pageSize)
  },
  methods: {
    // 改变当前每页大小触发
    handleSizeChange (val) {
      this.getDynamicData(this.page.pageNumber, val)
      console.log(`每页 ${val} 条`)
    },
    // 改变当前页数触发
    handleCurrentChange (val) {
      this.getDynamicData(val, this.page.pageSize)
      console.log(`当前页: ${val}`)
    },
    // 放大图片
    handlePictureCardPreview (file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    // 放大好友动态图片
    showDynamicImg (path) {
      this.showDynamicImgUrl = path
      this.isShowDynamicImg = true
    },
    // 上传图片成功之后调用
    uploadSuccess: function (response, file, fileList) {
      // 把后台返回的图片id赋值给file的fileId属性，
      // 是为了删除时，可以把id传给后台进行删除
      // file代表当成上传成功的对象，
      file.newFileName = response.content.data.fileName
      this.fileList = fileList
      console.log(this.fileList)
    },
    // 在上传页面点击删除触发
    removeFile (file, fileList) {
      this.$http.get('/dynamic/deleteDynamicImg?fileName=' + file.newFileName).then((response) => {
        if (response.data.content.status === '00') {
          if (response.data.content.data.result) {
            this.$Message.success(response.data.content.msg)
          } else {
            this.$Message.error(response.data.content.msg)
          }
        }
      })
    },
    // 提交动态信息
    submitForm (formName) {
      this.$refs[formName].validate((valid) => {
        var dynamicPaths = ''
        if (!valid) {
          return
        }
        if (this.fileList && this.fileList.length > 0) {
          for (var i = 0; i < this.fileList.length; i++) {
            dynamicPaths = dynamicPaths + this.fileList[i].newFileName + ';'
          }
        }
        var param = new URLSearchParams()
        param.append('content', this.ruleForm.content)
        param.append('photoPaths', dynamicPaths)
        param.append('userId', this.user.userId)

        // 插入动态
        this.$http.post('/dynamic/insertDynamic', param).then((response) => {
          var content = response.data.content
          if (content.status === '00') {
            this.$Message.success(content.msg)
            this.centerDialogVisible = false
            this.ruleForm.content = ''
            this.fileList = []
            this.getDynamicData(1, this.page.pageSize)
          }
        })
      })
    },
    // 查询动态
    getDynamicData: function (pageNum, pageSize) {
      var param = new URLSearchParams()
      param.append('pageNum', pageNum)
      param.append('pageSize', pageSize)
      // 查询动态
      this.$http.post('/dynamic/getAllFriendDynamic', param).then((response) => {
        var content = response.data.content
        if (content.status === '00') {
          var pageInfo = content.data.pageInfo
          this.dynamicList = pageInfo.list
          this.page.pageSize = pageInfo.pageSize
          this.page.pageNumber = pageInfo.pageNum
          this.page.dataCount = pageInfo.total

          // 给每个动态的回复添加一个提示
          this.areaPromptArr.splice(0)
          for (var i = 0; i < pageInfo.total; i++) {
            this.areaPromptArr.push('')
          }

          // 给每个动态的回复添加一个内容
          this.areaArr.splice(0)
          for (i = 0; i < pageInfo.total; i++) {
            this.areaArr.push('')
          }
        }
      })
    },
    // 点击回复
    replyComment: function (comment, e) {
      var value = e.target.innerHTML
      // 取消回复
      if (value === '取消回复') {
        e.target.innerHTML = '回复'
        // 给回复框添加提示
        this.areaPromptArr[this.currentCommentIndex] = ''
        this.currentComment = null

        return
      }

      // 回复
      e.target.innerHTML = '取消回复'
      var index = 0
      // 查找当前是那条动态的回复
      for (var i = 0; i < this.dynamicList.length; i++) {
        if (comment.dynamicId === this.dynamicList[i].id) {
          index = i
          break
        }
      }

      // 给回复框添加提示
      this.areaPromptArr.splice(index, 1, '回复' + comment.commentUser.userName)
      this.currentComment = comment
      this.currentCommentIndex = index
    },
    // 点击回复框（评论框）
    comment: function (dynamic) {
      var index = 0
      // 查找当前是那条动态的回复
      for (var i = 0; i < this.dynamicList.length; i++) {
        if (dynamic.id === this.dynamicList[i].id) {
          index = i
          break
        }
      }
      this.currentCommentIndex = index
    },
    // 提交评论
    insertComment: function () {
      if (!this.areaArr[this.currentCommentIndex]) {
        this.$Message.error('回复内容不能为空')
        return
      }
      if (this.areaArr[this.currentCommentIndex].length > 100) {
        this.$Message.error('回复内容不能超过100字')
        return
      }
      // 拿到回复框中的内容
      var content = this.areaArr[this.currentCommentIndex]

      var param = new URLSearchParams()
      if (this.currentComment != null) {
        param.append('userId', this.currentComment.commentUseId)
      }
      param.append('commentUseId', this.user.userId)
      param.append('message', content)
      param.append('dynamicId', this.dynamicList[this.currentCommentIndex].id)

      // 请求后台数据
      this.$http.post('/comment/insertComment', param).then((response) => {
        var content = response.data.content
        debugger
        if (content.status === '00') {
          this.$Message.success(content.msg)

          // 修改评论数
          this.dynamicList[this.currentCommentIndex].starCount = content.data.commentCount
          // 把返回的评论添加到动态列表中的评论列表中
          this.dynamicList[this.currentCommentIndex].commentList.push(content.data.commentInfo)
          // 把回复框的内容清空
          this.areaArr.splice(this.currentCommentIndex, 1, '')
          this.areaPromptArr.splice(this.currentCommentIndex, 1, '')
          this.currentCommentIndex = -1
          this.currentComment = null
        }
      })
    },
    // 用来锚点跳转
    changeHash (idname) {
      document.querySelector(idname).scrollIntoView(true)
    },
    // 删除评论
    deleteComment: function (id, dynamicId, dynamicIndex, comemntIndex) {
      // 请求后台数据
      this.$http.get('/comment/deleteComment?commentId=' + id + '&dynamicId=' + dynamicId).then((response) => {
        debugger
        var content = response.data.content
        if (content.status === '00') {
          this.$Message.success(content.msg)
          // 从评论列表中删除评论
          this.dynamicList[dynamicIndex].commentList.splice(comemntIndex, 1)
          // 修改评论数
          this.dynamicList[this.currentCommentIndex].starCount = content.data.commentCount
        }
      })
    },
    // 删除动态
    deleteDynamic: function (dynamicId) {
      // 请求后台数据
      this.$http.get('/dynamic/deleteDynamic?dynamicId=' + dynamicId).then((response) => {
        var content = response.data.content
        if (content.status === '00') {
          this.$Message.success(content.msg)
          this.getDynamicData(this.page.pageNumber, this.page.pageSize)
        }
      })
    }
  },
  components: {
    photoheader,
    photofooter
  },
  filters: {
    day2Filter: function (date) {
      if (!date) {
        return ''
      }
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
      return `${year}-${month}-${d}`
    },
    hoursFilter: function (date) {
      if (!date) {
        return ''
      }
      date = new Date(date)
      var hours = date.getHours()
      if (hours < 10) {
        hours = '0' + hours
      }
      var minutes = date.getMinutes()
      if (minutes < 10) {
        minutes = '0' + minutes
      }
      return `${hours}:${minutes}`
    }
  }
}
</script>

<style scoped>
@import '../../public/css/main.css';
@import '../../public/layui/css/layui.css';
</style>
