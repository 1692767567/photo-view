<template>
<div style="width:100%">
  <photoheader></photoheader>

  <h1>{{dirName}}</h1>
  <div id='waterfall'>
    <span v-for="(file,index) in fileArr" :key="'file_'+index"  @contextmenu='selectFile(file.fileId, file.fileName)'>
      <img :src='file.filePath'  @contextmenu.prevent='onContextmenu'/>
    </span>

    <!-- <div @click="dialogVisible=true" style="width:100px;height:100px;border:1px dashed #8c939d" > -->
      <!-- <i style="display: block;height: 100px;line-height: 100px;text-align: center;" class="el-icon-plus avatar-uploader-icon"></i> -->
    <!-- </div> -->
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
            action="/useFileUploadAPI"
            :data="{'dirId':dirId}"
            :with-credentials="true"
            :on-success="uploadSuccess"
            :on-remove="removeFile"
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
      dirName: '',
      dirId: '',
      selectFileId: '',
      fileArr: [],
      dialogVisible: false,
      fileList: [],
      selectFileName: ''
    }
  },
  mounted: function () {
    // 拿到路由传过来的相册id
    this.dirId = this.$route.params.dirId

    // 查询相册信息
    this.$http.get('/dir/selectById?dirId=' + this.dirId).then((response) => {
      if (response.data.content.status === '00') {
        var dirInfo = response.data.content.data.dirInfo
        this.dirName = dirInfo.dirName
        this.dirId = dirInfo.dirId
      }
    })

    this.getAllFile()
  },
  methods: {
    getAllFile: function () { // 查询当前相册下所有的图片
      this.$http.get('/userFile/getAllByDirId?dirId=' + this.dirId).then((response) => {
        if (response.data.content.status === '00') {
          this.fileArr = response.data.content.data.fileList
        }
      })
    },
    uploadSuccess: function (response, file, fileList) { // 上传图片成功之后调用
      // 把后台返回的图片id赋值给file的fileId属性，
      // 是为了删除时，可以把id传给后台进行删除
      // file代表当成上传成功的对象，
      file.fileId = response.content.data.fileInfo.fileId
      this.fileList = fileList
    },
    removeFile (file, fileList) { // 在上传页面点击删除触发
      this.$http.get('/userFile/deleteFile?userFileId=' + file.fileId).then((response) => {
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
              this.$http.post('/userFile/deleteFile?userFileId=' + this.selectFileId).then((response) => {
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
              this.$http.get('/userFile/downloadFile?userFileId=' + this.selectFileId, { responseType: 'blob' }).then((response) => {
                debugger
                const url = window.URL.createObjectURL(new Blob([response.data]))
                const link = document.createElement('a')
                link.href = url
                link.setAttribute('download', this.selectFileName) // this.selectFileName下载后的文件名
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
    }
  },
  components: {
    photoheader,
    photofooter
  }
}
</script>

<style scope>
  @import '../../public/css/waterfall.css';
</style>
