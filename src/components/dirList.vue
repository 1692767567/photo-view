<template>
    <div style="width:100%">
        <photoheader ref="header"></photoheader>
        <div class="header">
            <el-row>
                <el-col :span="10" :offset="7">
                    <div class="header-title">查找相册</div>
                    <div class="search">
                            <el-input class="a" placeholder="" v-model="dirName">
                                <el-button slot="append" icon="el-icon-search" @click.native="getDirList"></el-button>
                            </el-input>
                        </div>
                </el-col>
            </el-row>
        </div>

        <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal">
            <el-menu-item index="0" @click.native="selectType(0)">全部</el-menu-item>
            <el-menu-item v-for="(e,index) in typeArray" :key="e.typeId" :index="index+1+''" @click.native="selectType(e.typeId)">{{ e.typeName }}</el-menu-item>
        </el-menu>

        <div style="margin:50px">
        <el-row>
            <el-col :span="3" :offset="1" v-for="(arr,index) in allDirList" :key="'all'+index">
                <!-- <el-row >
                  <el-col :span="24"> -->
                    <div style="margin-top:40px" v-for="(e) in arr" :key="e.dirId" @contextmenu.prevent='selectDir(e.dirId)'>
                      <el-card :body-style="{ padding: '0px' }" @contextmenu.prevent.native='onContextmenu'>
                          <img :src="e.dirImg" class="image" style="width:100%;height:auto"/>
                          <div style="padding: 2px;" class="content-div" v-if="e.createTime">
                              <el-row>
                                  <el-col :span="9" :offset="1">
                                      <span style="line-height:20px">{{e.dirName}}</span>
                                  </el-col>
                                  <el-col :span="14">
                                      <span style="display: inline-block;width: 100%;text-align:right;line-height:20px" >{{e.createTime | dateFilter}}</span>
                                  </el-col>
                              </el-row>
                              <el-row>
                                  <el-col :span="22" :offset="1">
                                        <p sttyle="width:100%">备注：{{e.remark}}</p>
                                  </el-col>
                              </el-row>
                          </div>
                      </el-card>
                    </div>
                    <!-- 添加符号 -->
                    <div @click="toInsert('insertDirForm')" style="width:100px;margin-top:40px;height:100px;border:1px dashed #8c939d" v-if="(dirListSize)%6===index">
                      <i class="el-icon-plus avatar-uploader-icon"></i>
                    </div>
                  <!-- </el-col>
                </el-row> -->
            </el-col>
        </el-row>
        </div>
        <div>
        <el-row style="-webkit-filter: grayscale(100%);filter: grayscale(100%);">
          <el-col :span="4" :offset="10">
            <img src="../../public/images/no_thing.png" style="height:100px">
            <div></div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="4" :offset="10">
            <div style="color:#aaa;padding:20px 30px">我是有底线的</div>
          </el-col>
        </el-row>
        </div>
         <photofooter></photofooter>

         <!-- 编辑相册的弹框 -->
         <el-dialog title="新增相册" :visible.sync="insertDirVisible">
          <el-form :model="editDirForm" :rules="insertDirRules" ref="insertDirForm">
            <el-form-item label="相册名" prop="dirName" label-width="100px">
              <el-input v-model="editDirForm.dirName" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="相册分类" prop="dirTypeId" label-width="100px">
              <el-select v-model="editDirForm.dirTypeId" placeholder="请选择相册分类">
                <el-option v-for="(t, index) in typeArray" :key="'dir_type_'+index" :label="t.typeName" :value="t.typeId"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="描述" prop="remark" label-width="100px">
              <el-input type="textarea" v-model="editDirForm.remark"></el-input>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="insertDirReset('insertDirForm')">取 消</el-button>
            <el-button type="primary" @click="insertDir('insertDirForm')">确 定</el-button>
          </div>
        </el-dialog>
    </div>
</template>

<style scoped>

    .header{
        background: url(../../public/images/dir_list_header.png);
        min-height: 235px;
    }

    .search >>> .el-input__inner{
        float: left;
        background-color: transparent;
        font-size: 15px;
        outline: none;
        color: #FFF;
        height: 45px;
        line-height: 45px;
    }

    .header-title{
        text-align: center;
        color: #fff;
        line-height: 90px;
        font-size: 34px;
    }

    .content-div{
      font-family: cursive;
      color: #555;
    }

    .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 100px;
    height: 100px;
    line-height: 100px;
    text-align: center;
  }
  .avatar {
    width: 100px;
    height: 100px;
    display: block;
  }

</style>

<script>
import photoheader from './header.vue'
import photofooter from './footer.vue'
export default {
  name: 'app',
  data: function () {
    // 验证是否存在相同的文件名
    var hasSameName = (rule, val, callback) => {
      var param = new URLSearchParams()
      param.append('dirName', val)
      param.append('dirId', this.editDirForm.dirId)
      this.$http.post('/dir/hasSameName', param).then((response) => {
        if (response.data.content.status) {
          if (response.data.content.data.result) {
            callback(new Error(response.data.content.msg))
          } else {
            callback()
          }
        }
      })
    }
    return {
      dirName: '', // 相册名搜索框的内容
      activeIndex: '0', // 默认选择哪个分类
      selectTypeId: '', // 当前选择中的分类id
      selectDirId: '', // 右键时选择的是哪个相册的id
      typeArray: [ // 分类数组
        { typeId: 1, typeName: '分类一' },
        { typeId: 2, typeName: '分类二' }
      ],
      dirListSize: 0, // 相册总数
      allDirList: [[], [], [], [], [], []], // 相册数组
      editDirVisible: false, // 控制编辑相册的弹框出现与否
      insertDirVisible: false, // 控制新增相册的弹框出现与否
      editDirForm: { // 编辑相册表单对应的对象
        dirId: '',
        dirName: '',
        dirTypeId: '',
        remark: ''
      },
      insertDirRules: { // 编辑相册表单验证规则
        dirName: [
          { required: true, message: '相册名不能为空' },
          { max: 6, message: '相册名不能超过6位' },
          { validator: hasSameName }
        ],
        dirTypeId: [
          { required: true, message: '相册类型不能为空' }
        ],
        remark: [
          { max: 50, message: '相册名不能超过50位' }
        ]
      }
    }
  },
  mounted: function () {
    // 加载时请求接口查询所有的分类
    this.$http.get('/dirType/selectAll').then((response) => {
      if (response.data.content.status === '00') {
        this.typeArray = response.data.content.data.typeList
      }
    })
    // 加载时请求接口返回所有的相册
    this.getDirList()
  },
  components: {
    photoheader,
    photofooter
  },
  methods: {
    // 切换分类
    selectType: function (typeId) {
      if (typeId === 0) {
        this.selectTypeId = ''
      } else {
        this.selectTypeId = typeId
      }
      this.getDirList()
    },
    // 请求接口获取符合条件的相册
    getDirList: function () {
      var params = new URLSearchParams()
      params.append('dirTypeId', this.selectTypeId)
      params.append('dirName', this.dirName)
      // 调用接口查询
      this.$http.post('/dir/selectListByExample', params).then((response) => {
        if (response.data.content.status === '00') {
          var dirList = response.data.content.data.dirList
          for (var j = 0; j < 6; j++) {
            this.allDirList[j].splice(0)
          }
          for (var i = 0; i < dirList.length; i++) {
            this.allDirList[i % 6].push(dirList[i])
          }

          this.dirListSize = dirList.length
          console.log((this.dirListSize + 1) % 6)
          console.log((this.dirListSize + 1))
        }
      })
    },
    onContextmenu: function (event) { // 生成右键菜单
      this.$contextmenu({
        items: [
          {
            label: '编辑相册',
            onClick: () => {
              this.toUpdateDir('insertDirForm')
            },
            icon: 'el-icon-edit-outline'
          },
          {
            label: '删除相册',
            onClick: () => {
              this.$http.post('/dir/deleteDirById?dirId=' + this.selectDirId).then((response) => {
                debugger
                var data = response.data.content
                if (data.status === '00') {
                  if (data.data.result === '0') {
                    this.$Message.success(data.msg)
                    this.getDirList()
                  } else {
                    this.$Message.error(data.msg)
                  }
                }
              })
            },
            icon: 'el-icon-delete'
          },
          {
            label: '下载相册',
            onClick: () => {
              this.$http.post('/dir/downloadDir?dirId=' + this.selectDirId).then((response) => {
                debugger
                var content = response.data.content
                if (content.status === '00') {
                  this.$Message.success(content.msg)
                }
              })
            },
            icon: 'el-icon-download'
          }
        ],
        event,
        customClass: 'class-a',
        zIndex: 3,
        minWidth: 230
      })
      return false
    },
    selectDir: function (dirId) { // 弹出右键菜单时，记录在哪个相册上右键弹出的
      this.selectDirId = dirId
    },
    insertDir: function (formName) { // 提交增加相册的请求
      var param = new URLSearchParams()
      param.append('dirId', this.editDirForm.dirId)
      param.append('dirName', this.editDirForm.dirName)
      param.append('dirTypeId', this.editDirForm.dirTypeId)
      param.append('remark', this.editDirForm.remark)

      var path = (this.editDirForm.dirId) ? '/dir/updateDir' : '/dir/insertDir'
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$http.post(path, param).then((response) => {
            debugger
            if (response.data.content.status === '00') {
              this.editDirForm.dirName = ''
              this.editDirForm.dirTypeId = ''
              this.editDirForm.remark = ''
              this.editDirForm.dirId = ''
              // 关闭编辑相册的弹出框
              this.insertDirVisible = false
              this.$Message.success(response.data.content.msg)
              // 重新请求相册列表
              this.getDirList()
            }
          })
        } else {
          this.$Message.errror('表单信息未完善！')
          return false
        }
      })
    },
    insertDirReset: function (formName) { // 新增表单取消
      this.$refs[formName].resetFields()
      this.insertDirVisible = false
    },
    toInsert: function (formName) {
      // this.$refs[formName].resetFields()
      this.insertDirVisible = true
    },
    toUpdateDir: function (formName) { // 进入更新相册页面，加载需要更新相册的内容
      this.$http.get('/dir/selectById?dirId=' + this.selectDirId).then((response) => {
        if (response.data.content.status === '00') {
          debugger
          var dirInfo = response.data.content.data.dirInfo
          // 把后台请求出来的信息复制到编辑表单中
          this.editDirForm.dirName = dirInfo.dirName
          this.editDirForm.dirTypeId = dirInfo.dirTypeId
          this.editDirForm.remark = dirInfo.remark
          this.editDirForm.dirId = dirInfo.dirId
          // 弹出修改的弹框
          this.insertDirVisible = true

          // this.$refs[formName].resetFields()
        }
      })
    }
  }
}
</script>
