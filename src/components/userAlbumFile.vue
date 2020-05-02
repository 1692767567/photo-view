<template>
<div style="width:100%">
  <photoheader></photoheader>

  <h1>{{album.name}}</h1>
  <div id='waterfall'>
    <span v-for="(file,index) in fileArr" :key="'file_'+index"  @contextmenu='selectFile(file.fileId, file.filePath)'>
      <img :src='file.filePath'  @contextmenu.prevent='onContextmenu'/>
    </span>

    <span @click="dialogVisible=true" style="width:100px;height:100px;border:1px dashed #8c939d" >
      <i style="display: block;height: 100px;line-height: 100px;text-align: center;" class="el-icon-plus avatar-uploader-icon"></i>
    </span>
  </div>
    <photofooter></photofooter>
   <!-- 编辑相册的弹框 -->
    <el-dialog title="上传图片" width="30%" :before-close="closeDialog" :visible.sync="dialogVisible">
          <el-upload
            class="upload-demo"
            drag
            action="/userAlbumFileUploadAPI"
            :data="{'id':album.id}"
            :with-credentials="true"
            :on-success="uploadSuccess"
            :on-remove="removeFile"
            :before-upload="photoBeforeUpload"
            accept=".jpg,.jpeg,.png,.gif,.bmp,.pdf,.JPG,.JPEG,.PBG,.GIF,.BMP,.PDF"
            multiple>
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
            <div class="el-upload__tip" slot="tip">只能上传图片</div>
          </el-upload>
    </el-dialog>
</div>
</template>

<script>
import photoheader from './header.vue'
import photofooter from './footer.vue'
export default {
  name: 'app',
  data: function () {
    return {
      album: {},
      dirName: '',
      id: '',
      selectFileId: '',
      fileArr: [],
      dialogVisible: false,
      fileList: [],
      selectFileName: ''
    }
  },
  mounted: function () {
    // 拿到路由传过来的相册id
    this.id = this.$route.params.id

    // 查询相册信息
    this.$http.get('/userAlbum/selectById?id=' + this.id).then((response) => {
      if (response.data.content.status === '00') {
        this.album = response.data.content.data.albumInfo
        this.fileArr = this.album.files
      }
    })
  },
  methods: {
    getAllFile: function () { // 查询当前相册下所有的图片
      this.$http.get('/userAlbumFile/getAllFileByAlbumId?albumId=' + this.album.id).then((response) => {
        if (response.data.content.status === '00') {
          this.fileArr = response.data.content.data.fileInfo
        }
      })
    },
    uploadSuccess: function (response, file, fileList) { // 上传图片成功之后调用
      // 把后台返回的图片id赋值给file的fileId属性，
      // 是为了删除时，可以把id传给后台进行删除
      // file代表当成上传成功的对象，
      file.fileId = response.content.data.fileInfo.fileId
      // 刚才上传的图片放入图片数组中
      this.fileArr.push(response.content.data.fileInfo)
      this.fileList = fileList
    },
    removeFile (file, fileList) { // 在上传页面点击删除触发
      this.$http.get('/userAlbumFile/deleteFile?fileId=' + file.fileId).then((response) => {
        if (response.data.content.status === '00') {
          if (response.data.content.data.result) {
            this.$Message.success(response.data.content.msg)
          } else {
            this.$Message.error(response.data.content.msg)
          }
        }
      })
    },
    closeDialog: function (done) { // 关闭上传的弹框触发
      this.fileList.splice(0) // 把上传的列表清空
      this.getAllFile() // 获取所有图片
      done()
    },
    selectFile: function (fileId, fileName) {
      this.selectFileId = fileId
      this.selectFileName = fileName
    },
    onContextmenu: function (event) { // 生成右键菜单
      this.$contextmenu({
        items: [
          {
            label: '删除图片',
            onClick: () => {
              this.$http.post('/userAlbumFile/deleteFile?fileId=' + this.selectFileId).then((response) => {
                var data = response.data.content
                if (data.status === '00') {
                  if (data.data.result) {
                    this.$Message.success(data.msg)
                    this.getAllFile()
                  } else {
                    this.$Message.error(data.msg)
                  }
                }
              })

              this.getAllFile()
            },
            icon: 'el-icon-delete'
          },
          {
            label: '下载图片',
            onClick: () => {
              var _this = this
              this.$http.get('/userAlbumFile/downloadFile?fileId=' + this.selectFileId, { responseType: 'blob' }).then((response) => {
                const url = window.URL.createObjectURL(new Blob([response.data]))
                const link = document.createElement('a')
                link.href = url
                debugger
                link.setAttribute('download', _this.selectFileName) // this.selectFileName下载后的文件名
                document.body.appendChild(link)
                link.click()
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
    }
  },
  components: {
    photoheader,
    photofooter
  }
}
</script>

<style scoped src='../../public/css/waterfall.css'>
  /* @import ''; */
</style>
