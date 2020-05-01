<template>
<div>
    <el-form :inline="true" :model="formInline" class="demo-form-inline">
        <el-form-item label="邮箱">
            <el-input v-model="userEmail" placeholder="邮箱"></el-input>
        </el-form-item>
         <el-form-item label="用户名">
            <el-input v-model="userName" placeholder="用户名"></el-input>
        </el-form-item>
    <el-form-item>
        <el-button type="primary" @click="searchData">查询</el-button>
    </el-form-item>
    </el-form>

  <el-table :data="tableData" border style="width: 100%" fit>
    <el-table-column fixed prop="createTime" label="日期" :sortable="true" :formatter="formDate"></el-table-column>
    <el-table-column prop="userEmail" label="账号" ></el-table-column>
    <el-table-column prop="userName" label="用户名" ></el-table-column>
    <el-table-column prop="ptRole.roleName" label="角色"></el-table-column>
    <el-table-column prop="isUse" :formatter="formIsUse" label="状态"></el-table-column>
    <el-table-column prop="signature" label="个性签名" ></el-table-column>
    <el-table-column  label="操作" >
      <template slot-scope="scope">
        <el-popconfirm v-if="scope.row.isUse === 0"
          title="确定禁用该用户？"
            @onConfirm="openDisable(scope.row)"
        >
        <el-button type="text" size="small" slot="reference">禁用</el-button>
        </el-popconfirm>
        <el-popconfirm
            title="确定启用该用户"
            v-if="scope.row.isUse === 1"
            @onConfirm="startUse(scope.row)"
        >
            <el-button type="text" size="small" slot="reference">解禁</el-button>
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
      title="禁用信息"
      :visible.sync="centerDialogVisible"
      width="30%"
      center>
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="禁用理由" prop="reason">
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
      // 当前用户
      currentUser: {},
      // 当前用户在用户数组（表格数据数组）的下标
      currentUserIndex: -1,
      // 搜索条件的用户邮箱
      userEmail: '',
      // 分页的对象
      page: {
        pageSize: 10, // 当前页的大小
        dataCount: 10, // 动态总条数
        pageNumber: 1 // 第几页
      },
      centerDialogVisible: false,
      // 禁用表单
      ruleForm: {
        reason: ''
      },
      // 新增动态对应表单规则
      rules: {
        reason: [
          { required: true, message: '请输入禁用理由', trigger: 'blur' },
          { max: 255, message: '禁用理由不能超过255字', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    handleClick (row) {
    },
    // 改变当前每页大小触发
    handleSizeChange (val) {
      this.getData(this.page.pageNumber, val, this.userName, this.userEmail)
      console.log('大小' + val)
    },
    // 改变当前页数触发
    handleCurrentChange (val) {
      this.getData(val, this.page.pageSize, this.userName, this.userEmail)
      console.log('页数' + val)
    },
    // 根据搜索条件查询
    searchData: function () {
      this.getData(this.page.pageNumber, this.page.pageSize, this.userName, this.userEmail)
    },
    // 查询数据
    getData: function (pageNum, pageSize, userName, userEmail) {
      var param = new URLSearchParams()
      param.append('pageNum', pageNum)
      param.append('pageSize', pageSize)
      param.append('userName', userName)
      param.append('userEmail', userEmail)

      // 查询
      this.$http.post('/management/user/getListByExample', param).then((response) => {
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
    // 格式化日期
    formIsUse: function (row, column, cellValue, index) {
      return cellValue === 0 ? '启用' : '禁用'
    },
    // 打开禁用理由弹框
    openDisable: function (userInfo) {
      debugger
      // 打开禁用弹框
      this.centerDialogVisible = true
      this.currentUser = userInfo

      // 查找选中的用户在用户数组中的下标
      for (var i = 0; i < this.tableData.length; i++) {
        if (userInfo.userId === this.tableData[i].userId) {
          this.currentUserIndex = i
          break
        }
      }
    },
    // 提交禁用信息
    submitForm (formName) {
      debugger
      var _this = this
      this.$refs[formName].validate((valid) => {
        if (!valid) {
          return
        }

        var param = new URLSearchParams()
        param.append('disableReason', this.ruleForm.reason)
        param.append('userId', this.currentUser.userId)
        param.append('isUse', 1)

        // 禁用用户
        this.$http.post('/management/user/disableUser', param).then((response) => {
          var content = response.data.content
          if (content.status === '00') {
            _this.centerDialogVisible = false
            _this.ruleForm.reason = ''
            // 更新后的用户对象从前放入数组中
            debugger
            _this.tableData.splice(_this.currentUserIndex, 1, content.data.userInfo)
          }
        })
      })
    },
    // 提交启用信息
    startUse (userInfo) {
      debugger
      this.currentUser = userInfo
      var _this = this
      // 查找选中的用户在用户数组中的下标
      for (var i = 0; i < this.tableData.length; i++) {
        if (userInfo.userId === this.tableData[i].userId) {
          this.currentUserIndex = i
          break
        }
      }

      var param = new URLSearchParams()
      param.append('disableReason', '')
      param.append('userId', this.currentUser.userId)
      param.append('isUse', 0)

      // 插入启用用户
      this.$http.post('/management/user/disableUser', param).then((response) => {
        debugger
        var content = response.data.content
        if (content.status === '00') {
          _this.ruleForm.reason = ''
          // 更新后的用户对象从前放入数组中
          _this.tableData.splice(_this.currentUserIndex, 1, content.data.userInfo)
        }
      })
    }
  }
}
</script>
