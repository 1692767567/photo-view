<template>
  <div style="width:100%" class="layui-row">
    <photoheader ref="header"></photoheader>

    <div class="content">
      <el-row>
        <el-col :span="6">
          <el-row class="tac">
            <el-col :span="12" :offset="12">
              <el-menu
                default-active="1"
                :span="6"
                class="el-menu-vertical-demo"
              >
                <el-menu-item index="1">
                  <i class="el-icon-user-solid"></i>
                  <span slot="title" @click="contentContr=true">我的账户</span>
                </el-menu-item>
                <el-menu-item index="2">
                  <i class="el-icon-s-tools"></i>
                  <span slot="title"  @click="contentContr=false">修改密码</span>
                </el-menu-item>
              </el-menu>
            </el-col>
          </el-row>
        </el-col>
        <!-- 个人信息修改 -->
        <el-col :span="17" v-if="contentContr" :offset="1" backgroud="color:#fff">
          <el-row>
            <el-col :span="6">
              <div style="width:100%">
                <div style="background:#999;width: 154px;border-radius: 50%;;height:154px;">
                  <img style="width: 150px;border-radius: 50%;padding:2px;height:150px;" :src="fromData.photoPath">
                </div>
              </div>
              <div style="width:100%;padding-left:40px;padding-top:10px;color:#409EFF;" id="headPortrait">修改图片<i class="el-icon-edit"></i></div>
            </el-col>
            <el-col :span="18">
              <el-col :span="12">
                <!--用户名  -->
                <el-row v-show="editorContr.userEditor">
                  <el-col :span="6">
                    <label class="form-item__label">用户名：</label>
                    </el-col>
                  <el-col :span="12">
                    <input type="text" class="input__inner" v-model="editorData.editName">
                  </el-col>
                  <el-col :span="2" :offset="1">
                    <i class="el-icon-check" style="line-height:40px" @click="saveName"></i>
                    </el-col>
                  <el-col :span="2">
                    <i class="el-icon-close" @click="editorContr.userEditor=false"></i>
                  </el-col>
                </el-row>
                <el-row v-show="!editorContr.userEditor">
                  <el-col :span="6">
                    <label class="form-item__label">用户名：</label>
                    </el-col>

                    <el-col :span="18">
                      <span class="text-cotent">{{fromData.userName}}</span>
                      <i class="el-icon-edit" @click="editorContr.userEditor=true" style="line-height:40px"></i>
                    </el-col>

                </el-row>

                <!--手机号  -->
                <el-row v-show="editorContr.phoneEditor">
                  <el-col :span="6">
                    <label class="form-item__label">手机号</label>
                    </el-col>
                  <el-col :span="12">
                    <input type="text" class="input__inner" v-model="editorData.editPhone">
                  </el-col>
                  <el-col :span="2" :offset="1"><i class="el-icon-check" @click="savePhone" style="line-height:40px"></i></el-col>
                  <el-col :span="2"><i class="el-icon-close" @click="editorContr.phoneEditor=false"></i></el-col>
                </el-row>
                <el-row v-show="!editorContr.phoneEditor">
                  <el-col :span="6">
                    <label class="form-item__label">手机号</label>
                    </el-col>
                  <el-col :span="18">
                    <span class="text-cotent">{{fromData.userPhone}}</span>
                    <i @click="editorContr.phoneEditor=true" class="el-icon-edit" style="line-height:40px"></i>
                  </el-col>
                </el-row>

                <!-- 个性签名 -->
                <el-row v-show="!editorContr.signatureEditor">
                  <el-col :span="6">
                    <label class="form-item__label">个性签名</label>
                    </el-col>
                  <el-col :span="18">
                    <span class="text-cotent">{{fromData.signature}}</span>
                    <i @click="editorContr.signatureEditor=true" class="el-icon-edit" style="line-height:40px"></i>
                  </el-col>

                </el-row>
                <el-row v-show="editorContr.signatureEditor">
                  <el-col :span="6">
                    <label class="form-item__label">个性签名</label>
                    </el-col>
                  <el-col :span="12">
                    <textarea class="textarea__inner" v-model="editorData.editSignature"></textarea>
                  </el-col>
                  <el-col :span="2" :offset="1"><i @click="saveSignature" class="el-icon-check" style="line-height:40px"></i></el-col>
                  <el-col :span="2"><i class="el-icon-close" @click="editorContr.signatureEditor=false"></i></el-col>
                </el-row>
                <!-- <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
                    <el-form-item label="活动形式" prop="desc">
                      <el-input type="textarea" v-model="fromData.signature"></el-input>
                    </el-form-item>
                </el-form> -->
              </el-col>
            </el-col>
          </el-row>
        </el-col>

        <!-- 密码修改 -->
        <el-col :span="17" v-if="!contentContr" :offset="1" backgroud="color:#fff">
          <el-row>
            <el-col :span="12">
              <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
                <el-form-item label="密码" prop="userPassword">
                  <el-input type="password" v-model="ruleForm.userPassword"></el-input>
                </el-form-item>
                <el-form-item label="确认密码" prop="checkPassword">
                  <el-input type="password" v-model="ruleForm.checkPassword"></el-input>
                </el-form-item>
                <el-form-item label="验证码" prop="name">
                  <el-row>
                    <el-col :span="18">
                      <el-input v-model="ruleForm.name"></el-input>
                    </el-col>
                    <el-col :span="6">
                      <button @click.prevent="sendCode()" class="send-code el-button el-button--primary" ref="codeTime">{{codeTime}}</button>
                    </el-col>
                  </el-row>
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
                  <el-button @click="resetForm('ruleForm')">重置</el-button>
                </el-form-item>
              </el-form>
            </el-col>
          </el-row>
        </el-col>
      </el-row>
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
    var passValitor = (rule, value, callback) => {
      if (this.ruleForm.userPassword !== this.ruleForm.checkPassword) {
        callback(new Error('确认密码和密码不一致'))
      }
    }
    return {
      fromData: { // 显示个人信息的数据
        userName: '',
        userPhone: '',
        signature: '',
        photoPath: ''
      },
      editorData: { // 修改个人信息输入框对应的数据
        editName: '',
        editPhone: '',
        editSignature: '',
        editPhotoPath: ''
      },
      editorContr: { // 控制个人信息修改的修改框出现
        userEditor: false,
        phoneEditor: false,
        signatureEditor: false
      },
      url: '',
      contentContr: true, // 控制显示修改密码或者个人信息
      ruleForm: { // 修改密码表单对应的数据
        userPassword: '',
        checkPassword: '',
        code: ''
      },
      rules: { // 修改密码表单验证规则
        userPassword: [
          { required: true, message: '密码不能为空' },
          { min: 6, max: 16, message: '密码为6~16位' }
        ],
        checkPassword: [
          { required: true, message: '确认密码不能为空' },
          { valitor: passValitor }
        ],
        code: [
          { required: true, message: '验证码不能为空' }
        ]
      },
      codeTime: '发送验证码',
      id: '' // 定时器id
    }
  },
  mounted: function () {
    var _this = this
    // eslint-disable-next-line no-undef
    layui.use('upload', function () {
      // eslint-disable-next-line no-undef
      var upload = layui.upload
      // 执行实例
      upload.render({
        elem: '#headPortrait', // 绑定元素
        accept: 'images',
        size: 2048,
        url: 'http://localhost:8080/photo/upload/headPortraitUpload?token=' + _this.$cookies.get('cookie_token'), // 上传接口
        done: function (res) {
          debugger
          if (res.content.status === '00') {
            _this.$refs.header.changePath(res.content.data.newPhonePath)
            _this.fromData.photoPath = res.content.data.newPhonePath
          } else {
            _this.$Message.error(res.content.msg)
          }

          console.log(res)
        },
        error: function () {

        }
      })
    })

    // 请求用户信息
    this.$http.post('/user/getUserAllInfo').then((response) => {
      debugger
      if (response.data.content.status === '00') {
        var use = response.data.content.data.userInfo
        this.fromData.userName = use.userName
        this.fromData.userPhone = use.userPhone
        this.fromData.signature = use.signature
        this.fromData.photoPath = use.photoPath

        this.editorData.editName = use.userName
        this.editorData.editPhone = use.userPhone
        this.editorData.editSignature = use.signature
        this.editorData.editPhotoPath = use.phonePath
      }
    })
  },
  methods: {
    saveName: function () {
      debugger
      var b = true
      this.editorContr.userEditor = false
      if (!this.editorData.editName) {
        this.editorData.editName = this.fromData.userName
        this.$Message.warning('用户名不能为空！')
        b = false
      }
      if (this.editorData.editName.length > 6) {
        this.editorData.editName = this.fromData.userName
        this.$Message.warning('用户名不能多于6位！')
        b = false
      }

      if (b) {
        this.save()
      }
    },
    savePhone: function () {
      var b = true
      this.editorContr.phoneEditor = false
      if (this.editorData.editPhone && !(/^1[3456789]\d{9}$/.test(this.editorData.editPhone))) {
        this.editorData.editPhone = this.fromData.userPhone
        this.$Message.warning('手机号码格式不正确！')
        b = false
      }

      if (b) {
        this.save()
      }
    },
    saveSignature: function () {
      debugger
      var b = true
      this.editorContr.signatureEditor = false
      if (this.editorData.editSignature && this.editorData.editSignature.length > 50) {
        this.editorData.editSignature = this.fromData.signature
        this.$Message.warning('个性签名不能多于50位！')
        b = false
      }

      if (b) {
        this.save()
      }
    },
    save: function () {
      var data = new URLSearchParams()
      data.append('userName', this.editorData.editName)
      data.append('userPhone', this.editorData.editPhone)
      data.append('signature', this.editorData.editSignature)
      // 发送更新的请求
      this.$http.post('/user/updateUser', data).then((response) => {
        debugger
        if (response.data.content.status === '00') {
          if (response.data.content.data.result) {
            debugger
            var use = response.data.content.data.userInfo
            this.fromData.userName = use.userName
            this.fromData.userPhone = use.userPhone
            this.fromData.signature = use.signature
            this.$Message.success(response.data.content.msg)
          }
        }
      })
    },
    // 发送验证码
    sendCode () {
      var params = new URLSearchParams()
      params.append('email', this.ruleForm.email)
      var thisRef = this
      this.$http.post('/email/sendUpdateUserInfoCode', params, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }).then((response) => {
        if (response.data.content.status === '01') {
          return
        }

        thisRef.codeTime = 60
        // 设置发送按钮不可点击
        thisRef.$refs.codeTime.disabled = true
        // 设置一个定时器，每1000毫秒就减去1
        thisRef.id = setInterval(() => {
          console.log(thisRef.codeTime)
          if (thisRef.codeTime > 0) {
            thisRef.codeTime--
          } else {
            thisRef.$refs.codeTime.disabled = false
            thisRef.codeTime = '重新发送'
            clearInterval(thisRef.id)
          }
        }, 1000)
      })
    },
    submitForm (formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          // 封装注册的参数
          var params = new URLSearchParams()
          params.append('userPassword', this.ruleForm.password)
          params.append('code', this.ruleForm.code)
          // 清除定时器
          clearInterval(this.id)
          // 禁用提交按钮，防止多次提交
          // this.$refs.submitRegister.disabled = true
          this.codeTime = '重新发送'
          this.$http.post('/user/updateUser', params, { 'Content-Type': 'application/x-www-form-urlencoded' }).then((response) => {
            debugger
            // 解除提交按钮的禁用
            // this.$refs.submitRegister.disabled = true
            // 解除发送验证码按钮
            this.$refs.codeTime.disabled = false
            if (response.data.content.status === '00') {
              this.ruleForm.userPassword = ''
              this.ruleForm.checkPassword = ''
              this.ruleForm.code = ''
              this.codeTime = '发送验证码'
              this.$Message.success(response.data.content.msg)
            } else {
              this.$Message.error(response.data.content.msg)
            }
          })
        } else {
          this.$Message.warning('表单信息未完善')
        }
      })
    },
    resetForm (formName) {
      this.$refs[formName].resetFields()
    }
  },
  components: {
    photoheader,
    photofooter
  }
}
</script>

<style scoped>
@import "../../public/css/main.css";
.content{
  margin-top:40px;
}

.text-cotent{
    height: 40px;
    line-height: 40px;
}
.input__inner{
    -webkit-appearance: none;
    background-color: #FFF;
    background-image: none;
    border-radius: 4px;
    border: 1px solid #DCDFE6;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    color: #606266;
    display: inline-block;
    font-size: inherit;
    height: 40px;
    line-height: 40px;
    outline: 0;
    padding: 0 15px;
    -webkit-transition: border-color .2s cubic-bezier(.645,.045,.355,1);
    transition: border-color .2s cubic-bezier(.645,.045,.355,1);
    width: 100%;
}

button, input, optgroup, option, select, textarea {
    font-family: inherit;
    font-size: inherit;
    font-style: inherit;
    font-weight: inherit;
    outline: 0;
}

input {
    text-rendering: auto;
    color: -internal-light-dark-color(black, white);
    letter-spacing: normal;
    word-spacing: normal;
    text-transform: none;
    text-indent: 0px;
    text-shadow: none;
    display: inline-block;
    text-align: start;
    -webkit-appearance: textfield;
    background-color: -internal-light-dark-color(white, black);
    -webkit-rtl-ordering: logical;
    cursor: text;
    margin: 0em;
    font: 400 13.3333px Arial;
    padding: 1px 0px;
    border-width: 2px;
    border-style: inset;
    border-color: initial;
    border-image: initial;
}

.form-item__label {
    text-align: right;
    vertical-align: middle;
    float: left;
    font-size: 14px;
    color: #606266;
    line-height: 40px;
    padding: 0 12px 0 0;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
}

.el-col .el-icon-check,.el-col .el-icon-close{
  line-height: 40px;
}

.textarea__inner {
    display: block;
    resize: vertical;
    padding: 5px 15px;
    line-height: 1.5;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    width: 100%;
    font-size: inherit;
    color: #606266;
    background-color: #FFF;
    background-image: none;
    border: 1px solid #DCDFE6;
    border-radius: 4px;
    -webkit-transition: border-color .2s cubic-bezier(.645,.045,.355,1);
    transition: border-color .2s cubic-bezier(.645,.045,.355,1);
}

.send-code{
    width: 108px;
}
</style>
