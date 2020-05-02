<template>
<div>
  <photoheader></photoheader>
    <!-- 放大图片 -->
    <el-dialog :visible.sync="isShowImg">
        <img width="100%" :src="showImgUrl" alt="">
    </el-dialog>

    <!-- 填写用户动态相册的弹框 -->
    <el-dialog
      title="动态相册"
      :visible.sync="centerDialogVisible"
      width="30%"
      center>
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="相册名" prop="name">
          <el-input  v-model="ruleForm.name"></el-input>
        </el-form-item>
        <el-form-item label="模板" prop="tempId">
          <el-select v-model="ruleForm.tempId" filterable placeholder="请选择">
            <el-option
              v-for="temp in allTemp"
              :key="'temp_'+temp.id"
              :label="temp.name"
              :value="temp.id">
            </el-option>
          </el-select>
        </el-form-item>
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

        <el-form-item label="备注" prop="tempRemark">
          <el-input type="textarea" v-model="ruleForm.albumRemark" maxlength="255"></el-input>
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
        <el-button type="danger" @click.native="centerDialogVisible=true">新增相册</el-button>
        </el-col>
    </el-row>
    <el-form :inline="true"  class="demo-form-inline">
        <el-form-item label="相册名">
            <el-input v-model="albumName" placeholder="相册名"></el-input>
        </el-form-item>
        <el-form-item label="模板">
          <el-select v-model="tempId" filterable placeholder="请选择">
            <el-option
              v-for="temp in allTemp"
              :key="'temp_'+temp.id"
              :label="temp.name"
              :value="temp.id">
            </el-option>
          </el-select>
        </el-form-item>
    <el-form-item>
        <el-button type="primary" @click="searchData">查询</el-button>
    </el-form-item>
    </el-form>

  <el-table :data="tableData" border style="width: 100%" fit>
    <el-table-column fixed prop="createTime" label="日期" :sortable="true" :formatter="formDate"></el-table-column>
    <el-table-column prop="name" label="相册名" ></el-table-column>
    <el-table-column prop="coverPaths" label="封面"  >
      <template slot-scope="scope">
        <img @click="showImg(scope.row.coverPaths)" :src="scope.row.coverPaths" style="width:50px;height:50px"/>
      </template>
    </el-table-column>
    <el-table-column prop="albumRemark" label="备注" ></el-table-column>
    <el-table-column  label="操作" >
      <template slot-scope="scope">
        <el-button type="text" size="small" ><a target="view_window" style="color:#409EFF" :href="'./showUserAlbum.html?id='+scope.row.id">查看</a></el-button>
        <el-button type="text" size="small" @click="toDetailsInfo(scope.row.id)">详情</el-button>
        <el-button type="text" size="small" @click="deleteAlbum(scope.row.id)">删除</el-button>
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
  <photofooter></photofooter>
</div>
</template>
<script>
import photoheader from './header.vue'
import photofooter from './footer.vue'
export default {
  data: function () {
    return {
      // 是否显示新增模板的弹框
      centerDialogVisible: false,
      // 是否显示放大图片的弹框
      isShowImg: false,
      // 放大的图片路径
      showImgUrl: '',
      // 相册名称
      albumName: '',
      // 模板id
      tempId: '',
      // 上传成功的图片列表
      photoList: [],
      // 表单数据列表
      tableData: [],
      // 有关分页的信息
      page: {
        pageSize: 3, // 当前页的大小
        dataCount: 100, // 动态总条数
        pageNumber: 1 // 第几页
      },
      // 所有的动态相册模板
      allTemp: [],
      // 表单对应的对象
      ruleForm: {
        // 相册名
        name: '',
        // 备注
        albumRemark: '',
        // 模板id
        tempId: ''
      },
      // 表单规则
      rules: {
        tempId: [
          { required: true, message: '请输入选择模板', trigger: 'blur' }
        ],
        name: [
          { required: true, message: '请输入相册名', trigger: 'blur' },
          { max: 10, message: '相册名不能超过10位数', trigger: 'blur' }
        ],
        tempRemark: [
          { max: 255, message: '备注不能超过255位数', trigger: 'blur' }
        ]
      }
    }
  },
  created: function () {
    this.getData(this.page.pageNumber, this.page.pageSize, this.albumName, this.tempId)
    this.getAllTemp()
  },
  methods: {
    // 改变当前每页大小触发
    handleSizeChange (val) {
      this.getData(this.page.pageNumber, val, this.albumName, this.tempId)
      console.log(`每页 ${val} 条`)
    },
    // 改变当前页数触发
    handleCurrentChange (val) {
      this.getData(val, this.page.pageSize, this.albumName, this.tempId)
      console.log(`当前页: ${val}`)
    },
    // 根据搜索条件查询
    searchData: function () {
      this.getData(this.page.pageNumber, this.page.pageSize, this.albumName, this.tempId)
    },
    // 查询动态
    getData: function (pageNum, pageSize, albumName, tempId) {
      var param = new URLSearchParams()
      param.append('pageNum', pageNum)
      param.append('pageSize', pageSize)
      param.append('name', albumName)
      param.append('tempId', tempId)
      // 查询动态
      this.$http.post('/userAlbum/selectListByExample', param).then((response) => {
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
    // 查询所有的动态相册模板
    getAllTemp: function () {
      // 查询动态相册模板
      this.$http.get('/albumTemp/getAllAlbum').then((response) => {
        var content = response.data.content
        if (content.status === '00') {
          this.allTemp = content.data.listInfo
        }
      })
    },
    // 点击详情跳转到文件列表页面
    toDetailsInfo: function (id) {
      this.$router.push('/userAlbumFile/' + id)
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
    // 提交用户动态相册信息
    submitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (!valid) {
          return
        }
        // 拼凑图片的路径
        var photoPaths = ''
        if (this.photoList && this.photoList.length > 0) {
          for (var i = 0; i < this.photoList.length; i++) {
            photoPaths = photoPaths + this.photoList[i].newFileName + ';'
          }
        }

        var param = new URLSearchParams()
        param.append('name', this.ruleForm.name)
        param.append('albumRemark', this.ruleForm.albumRemark)
        param.append('fileNames', photoPaths)
        param.append('tempId', this.ruleForm.tempId)

        // 插入动态相册
        this.$http.post('/userAlbum/insertUserAlbum', param).then((response) => {
          var content = response.data.content
          if (content.status === '00') {
            this.$Message.success(content.msg)
            this.centerDialogVisible = false
            this.ruleForm.name = ''
            this.ruleForm.albumRemark = ''
            this.photoList = []
            this.getData(1, this.page.pageSize, this.albumName, this.tempId)
          }
        })
      })
    },
    // 删除相册
    deleteAlbum (id) {
      // 插入动态相册
      this.$http.get('/userAlbum/deleteUserAlbum?id=' + id).then((response) => {
        var content = response.data.content
        if (content.status === '00') {
          this.$Message.success(content.msg)
          this.getData(1, this.page.pageSize, this.albumName, this.tempId)
        }
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
    }
  },
  components: {
    photoheader,
    photofooter
  }
}
</script>
