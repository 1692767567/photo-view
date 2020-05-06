<template>
<div>
    <!-- 放大图片 -->
    <el-dialog :visible.sync="isShowImg">
        <img width="100%" :src="showImgUrl" alt="">
    </el-dialog>

    <!-- 填写模板信息的弹框 -->
    <el-dialog
      title="动态相册模板"
      :visible.sync="centerDialogVisible"
      width="30%"
      center>
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="模板名" prop="name">
          <el-input  v-model="ruleForm.name"></el-input>
        </el-form-item>
        <!-- <el-form-item label="图片总数" prop="photoCount">
          <el-input  v-model="ruleForm.photoCount"></el-input>
        </el-form-item> -->
        <el-form-item label="图片">
          <el-upload
            action="/albumTempImgUploadAPI"
            list-type="picture-card"
            multiple
            :on-success="uploadPhotoSuccess"
            :limit="10"
            :on-exceed="photoHandleExceed"
            :before-upload="photoBeforeUpload"
            accept=".jpg,.jpeg,.png,.gif,.bmp,.pdf,.JPG,.JPEG,.PBG,.GIF,.BMP,.PDF"
            :on-remove="removePhoto"
            :file-list="photoList"
            >
            <i class="el-icon-plus"></i>
          </el-upload>
        </el-form-item>

        <!-- 上传js -->
        <el-form-item label="JS文件">
            <el-upload
                :data="{'type':'js'}"
                action="/albumTempFileUploadAPI"
                :on-success="uploadJsSuccess"
                :on-remove="removeJs"
                :on-exceed="jsHandleExceed"
                :before-upload="jsBeforeUpload"
                multiple
                :limit="3"
                :file-list="jsList"
                accept=".js"
                >
                <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
        </el-form-item>

        <!-- 上传css -->
        <el-form-item label="CSS文件">
            <el-upload
                :data="{'type':'css'}"
                action="/albumTempFileUploadAPI"
                :on-success="uploadCssSuccess"
                :on-remove="removeCss"
                multiple
                :limit="3"
                :on-exceed="cssHandleExceed"
                :before-upload="cssBeforeUpload"
                :file-list="cssList"
                accept=".css"
                >
                <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
        </el-form-item>

        <el-form-item label="html结构" prop="htmlStr">
          <el-input type="textarea" v-model="ruleForm.htmlStr"></el-input>
        </el-form-item>

        <el-form-item label="备注" prop="tempRemark">
          <el-input type="textarea" v-model="ruleForm.tempRemark"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="centerDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitForm('ruleForm')">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 列表模块 -->
    <el-row>
        <el-col :span="6" :offset="18">
        <el-button type="danger" @click.native="centerDialogVisible=true">新增模板</el-button>
        </el-col>
    </el-row>
    <el-form :inline="true"  class="demo-form-inline">
        <el-form-item label="模板名">
            <el-input v-model="tempName" placeholder="模板名"></el-input>
        </el-form-item>
    <el-form-item>
        <el-button type="primary" @click="searchData">查询</el-button>
    </el-form-item>
    </el-form>

  <el-table :data="tableData" border style="width: 100%" fit>
    <el-table-column fixed prop="createTime" label="日期" :sortable="true" :formatter="formDate"></el-table-column>
    <el-table-column prop="name" label="模板名" ></el-table-column>
    <el-table-column prop="coverPaths" label="封面"  >
      <template slot-scope="scope">
        <img @click="showImg(scope.row.coverPaths)" :src="scope.row.coverPaths" style="width:50px;height:50px"/>
      </template>
    </el-table-column>
    <el-table-column prop="photoCount" label="图片总数" ></el-table-column>
    <el-table-column prop="tempRemark" label="备注" ></el-table-column>
    <el-table-column  label="操作" >
      <template slot-scope="scope">
        <el-popconfirm
          title="确定删除该模板？"
            @onConfirm="submitDelete(scope.row)"
        >
        <el-button type="text" size="small" slot="reference">删除</el-button>
        </el-popconfirm>
      </template>
    </el-table-column>
  </el-table>

  <div>
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
</template>
<script>
export default {
  data: function () {
    return {
      // 是否显示新增模板的弹框
      centerDialogVisible: false,
      // 是否显示放大图片的弹框
      isShowImg: false,
      // 放大的图片路径
      showImgUrl: '',
      // 模板名称
      tempName: '',
      // 上传成功的图片列表
      photoList: [],
      // 上传成功的js列表
      jsList: [],
      // 上传成功的css列表
      cssList: [],
      // 表单数据列表
      tableData: [],
      // 有关分页的信息
      page: {
        pageSize: 3, // 当前页的大小
        dataCount: 100, // 动态总条数
        pageNumber: 1 // 第几页
      },
      // 表单对应的对象
      ruleForm: {
        // 图片个数
        // photoCount: 0,
        // 模板名
        name: '',
        // html结构
        htmlStr: '',
        // 备注
        tempRemark: ''
      },
      // 表单规则
      rules: {
        photoCount: [
          { required: true, message: '请输入图片总数', trigger: 'blur' },
          { min: 0, message: '图片总数小于0', trigger: 'blur' }
        ],
        name: [
          { required: true, message: '请输入模板名', trigger: 'blur' },
          { max: 10, message: '模板名不能超过10位数', trigger: 'blur' }
        ],
        htmlStr: [
          { max: 500, message: 'html结构不能超过500位数', trigger: 'blur' }
        ],
        tempRemark: [
          { max: 255, message: '备注不能超过255位数', trigger: 'blur' }
        ]
      }
    }
  },
  created: function () {
    this.getData(this.page.pageNumber, this.page.pageSize, this.tempName)
  },
  methods: {
    // 改变当前每页大小触发
    handleSizeChange (val) {
      this.getData(this.page.pageNumber, val, this.tempName)
      console.log(`每页 ${val} 条`)
    },
    // 改变当前页数触发
    handleCurrentChange (val) {
      this.getData(val, this.page.pageSize, this.tempName)
      console.log(`当前页: ${val}`)
    },
    // 根据搜索条件查询
    searchData: function () {
      this.getData(this.page.pageNumber, this.page.pageSize, this.tempName)
    },
    // 查询动态
    getData: function (pageNum, pageSize, tempName) {
      var param = new URLSearchParams()
      param.append('pageNum', pageNum)
      param.append('pageSize', pageSize)
      param.append('name', tempName)
      // 查询动态
      this.$http.post('/management/albumTemp/selectListByExample', param).then((response) => {
        var content = response.data.content
        if (content.status === '00') {
          var pageInfo = content.data.pageInfo
          this.tableData = pageInfo.list
          this.page.pageSize = pageInfo.pageSize
          this.page.pageNumber = pageInfo.pageNum
          this.page.dataCount = pageInfo.total
        }
      })
    },
    // 放大图片
    showImg (path) {
      this.showImgUrl = path
      this.isShowImg = true
    },
    // 上传图片成功之后调用
    uploadPhotoSuccess: function (response, file, fileList) {
      file.newFileName = response.content.data.fileName
      this.photoList = fileList
    },
    // 在上传页面点击删除图片触发
    removePhoto (file, fileList) {
      this.$http.get('/management/albumTemp/deleteTempImg/?fileName=' + file.newFileName).then((response) => {
        if (response.data.content.status === '00') {
          if (response.data.content.data.result) {
            this.$Message.success(response.data.content.msg)
          } else {
            this.$Message.error(response.data.content.msg)
          }
        }
      })
    },
    // 图片上传文件超过数量提示
    photoHandleExceed (files, fileList) {
      this.$message.error(`当前限制选择 10 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`)
    },
    // 图片上传之前执行
    photoBeforeUpload (file) {
      debugger
      var fileType = file.name.substring(file.name.lastIndexOf('.') + 1)
      const typeArr = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'pdf', 'JPG', 'JPEG', 'PBG', 'GIF', 'BMP', 'PDF']
      var type = typeArr.find((value) => {
        if (value.toUpperCase() === fileType.toUpperCase()) {
          return true
        }
      })
      if (!type) {
        this.$message.error('选中的文件不是图片文件')
        return false
      }
    },
    // 上传JS成功之后调用
    uploadJsSuccess: function (response, file, fileList) {
      file.newFileName = response.content.data.fileName
      this.jsList = fileList
    },
    // 在上传页面点击删除JS触发
    removeJs (file, fileList) {
      var param = new URLSearchParams()
      param.append('fileName', file.newFileName)
      param.append('type', 'js')
      this.$http.post('/management/albumTemp/deleteTempFile').then((response) => {
        if (response.data.content.status === '00') {
          if (response.data.content.data.result) {
            this.$Message.success(response.data.content.msg)
          } else {
            this.$Message.error(response.data.content.msg)
          }
        }
      })
    },
    // js上传文件超过数量提示
    jsHandleExceed (files, fileList) {
      this.$message.error(`当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`)
    },
    // js上传之前执行
    jsBeforeUpload (file) {
      var fileType = file.name.substring(file.name.lastIndexOf('.') + 1)
      const extension = fileType === 'js'
      if (!extension) {
        this.$message.error('选中的文件不是js文件')
        return false
      }
    },
    // 上传css成功之后调用
    uploadCssSuccess: function (response, file, fileList) {
      file.newFileName = response.content.data.fileName
      this.cssList = fileList
    },
    // 在上传页面点击删除css触发
    removeCss (file, fileList) {
      var param = new URLSearchParams()
      param.append('fileName', file.newFileName)
      param.append('type', 'css')

      this.$http.get('/management/albumTemp/deleteTempFile').then((response) => {
        if (response.data.content.status === '00') {
          if (response.data.content.data.result) {
            this.$Message.success(response.data.content.msg)
          } else {
            this.$Message.error(response.data.content.msg)
          }
        }
      })
    },
    // css上传文件超过数量提示
    cssHandleExceed (files, fileList) {
      this.$message.error(`当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`)
    },
    // css上传之前执行
    cssBeforeUpload (file) {
      var fileType = file.name.substring(file.name.lastIndexOf('.') + 1)
      const extension = fileType === 'css'
      if (!extension) {
        this.$message.error('选中的文件不是css文件')
        return false
      }
    },
    // 提交动态相册模板信息
    submitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (!valid) {
          return
        }
        // 拼凑演示图片的路径
        var photoPaths = ''
        if (this.photoList && this.photoList.length > 0) {
          for (var i = 0; i < this.photoList.length; i++) {
            photoPaths = photoPaths + this.photoList[i].newFileName + ';'
          }
        }

        // 拼凑js的路径
        var jsPaths = ''
        if (this.jsList && this.jsList.length > 0) {
          for (i = 0; i < this.jsList.length; i++) {
            jsPaths = jsPaths + this.jsList[i].newFileName + ';'
          }
        }

        // 拼凑css的路径
        var cssPaths = ''
        if (this.cssList && this.cssList.length > 0) {
          for (i = 0; i < this.cssList.length; i++) {
            cssPaths = cssPaths + this.cssList[i].newFileName + ';'
          }
        }

        var param = new URLSearchParams()
        param.append('name', this.ruleForm.name)
        param.append('htmlStr', this.ruleForm.htmlStr)
        // param.append('photoCount', this.ruleForm.photoCount)
        param.append('tempRemark', this.ruleForm.tempRemark)
        param.append('photoPaths', photoPaths)
        param.append('jsPaths', jsPaths)
        param.append('cssPaths', cssPaths)

        // 插入模板
        this.$http.post('/management/albumTemp/insertTemp', param).then((response) => {
          var content = response.data.content
          if (content.status === '00') {
            this.$Message.success(content.msg)
            this.centerDialogVisible = false
            this.ruleForm.name = ''
            this.ruleForm.photCount = ''
            this.ruleForm.tempRemark = ''
            this.ruleForm.htmlStr = ''
            this.photoList = []
            this.jsList = []
            this.cssList = []
            this.getData(1, this.page.pageSize, this.tempName)
          }
        })
      })
    },
    // 格式化日期
    formDate: function (row, column, cellValue, index) {
      if (!cellValue) {
        return ''
      }
      var date = new Date(cellValue)

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
    // 提交删除的请求
    submitDelete: function (album) {
      // 发送请求
      this.$http.get('/management/albumTemp/deleteTemp?id=' + album.id).then((response) => {
        var content = response.data.content
        if (content.status === '00') {
          this.getData(this.page.pageNumber, this.page.pageSize, this.tempName)
        }
      })
    }
  }
}
</script>
