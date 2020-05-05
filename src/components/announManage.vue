<template>
<div>
   <!-- 显示所有内容弹框 -->
    <el-dialog :visible.sync="isShowContent">
      <p>{{content}}</p>
    </el-dialog>
    <el-row>
    <el-col :span="6" :offset="18">
      <el-button type="danger" @click.native="centerDialogVisible=true">新增公告</el-button>
    </el-col>
  </el-row>
    <el-form :inline="true"  class="demo-form-inline">
        <el-form-item label="标题">
            <el-input v-model="title" placeholder="标题"></el-input>
        </el-form-item>
    <el-form-item>
        <el-button type="primary" @click="searchData">查询</el-button>
    </el-form-item>
    </el-form>

  <el-table :data="tableData" border style="width: 100%" fit>
    <el-table-column fixed prop="createTime" label="日期" :sortable="true" :formatter="formDate"></el-table-column>
    <el-table-column prop="title" label="标题" ></el-table-column>
    <el-table-column prop="content" label="内容"  >
      <template slot-scope="scope">
        <span @click="showContent">{{ scope.row.content | contentFilter}}</span>
      </template>
    </el-table-column>
    <el-table-column  label="操作" >
      <template slot-scope="scope">
        <el-popconfirm
          title="确定删除该公告？"
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

  <el-dialog
      title="公告信息"
      :visible.sync="centerDialogVisible"
      width="30%"
      center>

      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="标题" prop="title">
          <el-input  v-model="ruleForm.title"></el-input>
        </el-form-item>
        <el-form-item label="内容" prop="content">
          <el-input type="textarea" :autosize="{ minRows: 10, maxRows: 4}" v-model="ruleForm.content"></el-input>
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
      // 搜索条件的标题
      title: '',
      // 分页的对象
      page: {
        pageSize: 10, // 当前页的大小
        dataCount: 10, // 动态总条数
        pageNumber: 1 // 第几页
      },
      centerDialogVisible: false,
      // 撤回表单
      ruleForm: {
        title: '',
        content: '',
        announId: 0
      },
      // 撤回动态对应表单规则
      rules: {
        title: [
          { required: true, message: '请输入标题', trigger: 'blur' },
          { max: 25, message: '标题不能超过25字', trigger: 'blur' }
        ],
        content: [
          { required: true, message: '请输入内容', trigger: 'blur' },
          { max: 255, message: '内容不能超过255字', trigger: 'blur' }
        ]
      },
      // 显示所有内容的公告内容
      content: '',
      // 是否显示所有内容的弹框
      isShowContent: false
    }
  },
  methods: {
    // 改变当前每页大小触发
    handleSizeChange (val) {
      this.getData(this.page.pageNumber, val, this.title)
      console.log('大小' + val)
    },
    // 改变当前页数触发
    handleCurrentChange (val) {
      this.getData(val, this.page.pageSize, this.title)
      console.log('页数' + val)
    },
    // 根据搜索条件查询
    searchData: function () {
      this.getData(this.page.pageNumber, this.page.pageSize, this.title)
    },
    // 查询数据
    getData: function (pageNum, pageSize, title) {
      var param = new URLSearchParams()
      param.append('pageNum', pageNum)
      param.append('pageSize', pageSize)
      param.append('title', title)

      // 查询
      this.$http.post('/management/announ/getListByExample', param).then((response) => {
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
    // 显示所有的内容
    showContent (content) {
      this.content = content
      this.isShowContent = true
    },
    // 提交删除的请求
    submitDelete: function (announ) {
      // 发送请求
      this.$http.get('/management/announ/deleteAnnoun?id=' + announ.id).then((response) => {
        var content = response.data.content
        if (content.status === '00') {
          this.getData(this.page.pageNumber, this.page.pageSize, this.title)
        }
      })
    },
    // 提交
    submitForm (formName) {
      var _this = this
      this.$refs[formName].validate((valid) => {
        if (!valid) {
          return
        }

        var param = new URLSearchParams()
        param.append('title', this.ruleForm.title)
        param.append('content', this.ruleForm.content)

        // 撤回动态
        this.$http.post('/management/announ/insertAnnoun', param).then((response) => {
          var content = response.data.content
          if (content.status === '00') {
            _this.centerDialogVisible = false
            _this.getData(this.page.pageNumber, this.page.pageSize, this.title)
          }
        })
      })
    }
  },
  filters: {
    // 内容过滤器
    contentFilter: function (content) {
      if (!content || content.length <= 50) {
        return content
      }

      return content.substring(0, 50) + '。。。'
    }
  }
}
</script>
