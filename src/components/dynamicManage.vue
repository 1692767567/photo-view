<template>
<div>
   <!-- 动态图片 -->
    <el-dialog :visible.sync="isShowDynamicImg">
      <img width="100%" :src="showDynamicImgUrl" alt="">
    </el-dialog>
    <el-form :inline="true"  class="demo-form-inline">
        <el-form-item label="用户名">
            <el-input v-model="userName" placeholder="用户名"></el-input>
        </el-form-item>
         <el-form-item label="时间">
            <el-date-picker type="date" placeholder="选择日期" v-model="createTime" style="width: 100%;"></el-date-picker>
        </el-form-item>
    <el-form-item>
        <el-button type="primary" @click="searchData">查询</el-button>
    </el-form-item>
    </el-form>

  <el-table :data="tableData" border style="width: 100%" fit>
    <el-table-column fixed prop="createTime" label="日期" :sortable="true" :formatter="formDate"></el-table-column>
    <el-table-column prop="content" label="内容" ></el-table-column>
    <el-table-column prop="photoPaths" label="图片" >
        <!--插入图片链接的代码-->
      <template slot-scope="scope">
        <img @click="showDynamicImg(photo)" v-for="(photo,index) in scope.row.photoList" :key="'dynamic_'+scope.row.id+'photo_'+index" :src="photo" alt="" style="width: 50px;height: 50px">
      </template>
    </el-table-column>
    <el-table-column prop="commentCount" label="评论数"></el-table-column>
    <el-table-column prop="user.userName"  label="用户"></el-table-column>
    <el-table-column  label="操作" >
      <template slot-scope="scope">
        <el-popconfirm
          title="确定撤回该动态？"
            @onConfirm="openDelete(scope.row)"
        >
        <el-button type="text" size="small" slot="reference">撤回</el-button>
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

  <el-dialog
      title="撤回信息"
      :visible.sync="centerDialogVisible"
      width="30%"
      center>
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="理由" prop="reason">
          <el-input type="textarea" v-model="ruleForm.reason"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="centerDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitForm('ruleForm')">确 定</el-button>
      </span>
    </el-dialog>
</div>
</template>

<script>
export default {
  name: 'userManage',
  created: function () {
    this.getData(1, 10, '', '')
  },
  data () {
    return {
      // 表格数据数组
      tableData: [],
      // 搜索条件的用户名
      userName: '',
      // 搜索条件的时间
      createTime: '',
      // 分页的对象
      page: {
        pageSize: 10, // 当前页的大小
        dataCount: 10, // 动态总条数
        pageNumber: 1 // 第几页
      },
      centerDialogVisible: false,
      // 撤回表单
      ruleForm: {
        reason: '',
        dynamicId: ''
      },
      // 撤回动态对应表单规则
      rules: {
        reason: [
          { required: true, message: '请输入撤回理由', trigger: 'blur' },
          { max: 255, message: '撤回理由不能超过255字', trigger: 'blur' }
        ]
      },
      // 放大图片的路径
      showDynamicImgUrl: '',
      // 是否展示放大图片的弹框
      isShowDynamicImg: false
    }
  },
  methods: {
    // 改变当前每页大小触发
    handleSizeChange (val) {
      this.getData(this.page.pageNumber, val, this.userName, this.createTime)
      console.log('大小' + val)
    },
    // 改变当前页数触发
    handleCurrentChange (val) {
      this.getData(val, this.page.pageSize, this.userName, this.createTime)
      console.log('页数' + val)
    },
    // 根据搜索条件查询
    searchData: function () {
      this.getData(this.page.pageNumber, this.page.pageSize, this.userName, this.createTime)
    },
    // 查询数据
    getData: function (pageNum, pageSize, userName, createTime) {
      var param = new URLSearchParams()
      param.append('pageNum', pageNum)
      param.append('pageSize', pageSize)
      param.append('userName', userName)
      param.append('createTime', this.formDate('', '', createTime, ''))

      // 查询
      this.$http.post('/management/dynamic/getListByExample', param).then((response) => {
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
    // 放大动态图片
    showDynamicImg (path) {
      this.showDynamicImgUrl = path
      this.isShowDynamicImg = true
    },
    // 打开撤回弹框
    openDelete: function (dynamic) {
      debugger
      // 打开禁用弹框
      this.centerDialogVisible = true
      this.ruleForm.dynamicId = dynamic.id
    },
    // 提交撤回动态信息
    submitForm (formName) {
      debugger
      var _this = this
      this.$refs[formName].validate((valid) => {
        if (!valid) {
          return
        }

        var param = new URLSearchParams()
        param.append('reason', this.ruleForm.reason)
        param.append('dynamicId', this.ruleForm.dynamicId)

        // 撤回动态
        this.$http.post('/management/dynamic/deleteDynamic', param).then((response) => {
          var content = response.data.content
          if (content.status === '00') {
            _this.centerDialogVisible = false
            _this.getData(this.page.pageNumber, this.page.pageSize, this.userName, this.createTime)
          }
        })
      })
    }
  }
}
</script>
