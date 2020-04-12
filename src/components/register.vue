<template>
  <div style='width:100%' class='all-content'>
    <h1>电子相册</h1>
    <div class='container w3layouts agileits'>
      <div class='login w3layouts agileits'>
        <h2>注 册</h2>
        <el-form
          :model='ruleForm'
          status-icon
          :rules='rules'
          ref='ruleForm'
          class='demo-ruleForm'
        >
          <el-form-item  prop='email'>
            <el-input type='text' placeholder="邮箱" v-model='ruleForm.email' autocomplete='off'></el-input>
          </el-form-item>
          <el-form-item  prop='pass'>
            <el-input type='password' placeholder="密码" v-model='ruleForm.pass' autocomplete='off'></el-input>
          </el-form-item>
          <el-form-item  prop='checkPass'>
            <el-input type="password" placeholder="确认密码" v-model='ruleForm.checkPass' autocomplete='off'></el-input>
          </el-form-item>
          <el-form-item  prop='code' size="small">
            <el-col :span="16">
            <el-input type="text" placeholder="验证码" v-model='ruleForm.code' autocomplete='off'></el-input>
            </el-col>
            <el-col :span="8">
            <!-- <el-button @click.prevent="sendCode()"  ref="codeTime">{{codeTime}}</el-button> -->
            <button @click.prevent="sendCode()" class="send-code" ref="codeTime">{{codeTime}}</button>
            </el-col>
          </el-form-item>
        </el-form>
        <div class='send-button w3layouts agileits'>
          <form>
            <!-- @click.prevent 点击时触发submitForm 函数 ， .prevent 阻止表单的提交事件 -->
            <input type='submit' ref="submitRegister" value='注 册' @click.prevent="submitForm('ruleForm')" />
          </form>
        </div>
        <router-link to="/login" tag="a">已有账号?登录>></router-link>
        <a href='#'>注册>></a>
        <div class='clear'></div>
      </div>
      <div class='clear'></div>
    </div>
  </div>
</template>
<script>
export default {
  data () {
    // 验证是否存在这样的邮箱
    var validatorEmail = (rule, value, callback) => {
      var submitData = new URLSearchParams()
      submitData.append('email', this.ruleForm.email)
      this.$http.post('/email/hasSameEmail', submitData, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }).then(function (response) {
        if (response.data.content.data.status === '01') {
          callback(new Error('邮箱不能为空!'))
          return
        }
        if (response.data.content.data.result) {
          callback(new Error('已经存在这个邮箱!'))
        } else {
          callback()
        }
      })
    }

    var validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.ruleForm.pass) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }

    return {
      ruleForm: {
        email: '', // 输入的邮箱
        pass: '', // 密码
        checkPass: '', // 确认密码
        code: '' // 输入的验证码,
      },
      codeTime: '发送验证码',
      id: '',

      // 表单的验证规则
      rules: {
        email: [
          { required: true, message: '邮箱不能为空' },
          { type: 'email', message: '邮箱格式不正确' },
          { validator: validatorEmail, trigger: 'blur' }
        ],
        pass: [
          { required: true, trigger: 'blur', message: '密码不能为空' },
          { min: 6, max: 16, trigger: 'blur', message: '密码为6~16位' }
        ],
        checkPass: [
          { required: true, trigger: 'blur', message: '确认密码不能为空' },
          { validator: validatePass2, trigger: 'blur' }
        ],
        code: [
          { required: true, trigger: 'blur', message: '验证码不能为空' }
        ]
      }
    }
  },
  methods: {
    submitForm (formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          // 封装注册的参数
          var params = new URLSearchParams()
          params.append('userEmail', this.ruleForm.email)
          params.append('userPassword', this.ruleForm.pass)
          params.append('code', this.ruleForm.code)
          // 清除定时器
          clearInterval(this.id)
          // 禁用提交按钮，防止多次提交
          this.$refs.submitRegister.disabled = true
          this.codeTime = '重新发送'
          this.$http.post('/user/register', params, { 'Content-Type': 'application/x-www-form-urlencoded' }).then((response) => {
            debugger
            // 解除提交按钮的禁用
            this.$refs.submitRegister.disabled = false
            // 解除发送验证码按钮
            this.$refs.codeTime.disabled = false
            if (response.data.content.status === '00') {
              // 登录成功跳转到首页
              this.$router.push({ path: '/index' })
            }
          })
        } else {
          this.$Message.warning('表单信息未完善')
        }
      })
    },
    resetForm (formName) {
      this.$refs[formName].resetFields()
    },
    // 发送验证码
    sendCode () {
      // 检查是否填了邮箱
      if (!this.ruleForm.email) {
        this.$Message.warning('邮箱不能为空')
        return
      }

      var params = new URLSearchParams()
      params.append('email', this.ruleForm.email)
      var thisRef = this
      this.$http.post('/email/sendRegisterCode', params, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }).then((response) => {
        if (response.data.content.status === '01') {
          thisRef.$Message.error(response.data.content)
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
    }
  }
}
</script>
<style  scoped src='../../public/css/register.css'>
</style>
<style >
.all-content .el-input__inner{
    border-radius: 0px;
    float: left;
    background-color: transparent;
    border: none;
    font-size: 15px;
    border-bottom: 1px solid rgba(238, 238, 238, 0.41);
    outline: none;
    color: #FFF;
}

.send-code{
    padding: 9px 15px;
    font-size: 12px;
    border-radius: 3px;
    display: inline-block;
    line-height: 1;
    white-space: nowrap;
    cursor: pointer;
    background: #FFF;
    border: 1px solid #DCDFE6;
    color: #606266;
    -webkit-appearance: none;
    text-align: center;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    outline: 0;
    margin: 0;
    -webkit-transition: .1s;
    transition: .1s;
    font-weight: 500;
    width: 94px;
}
</style>
