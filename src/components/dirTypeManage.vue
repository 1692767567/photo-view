<template>
<div>
  <el-row>
    <el-col :span="6" :offset="18">
      <el-button type="danger" @click.native="openForm">新增分类</el-button>
    </el-col>
  </el-row>
    <el-form :inline="true"  class="demo-form-inline">
        <el-form-item label="分类名">
            <el-input v-model="typeName" placeholder="分类名"></el-input>
        </el-form-item>
    <el-form-item>
        <el-button type="primary" @click="searchData">查询</el-button>
    </el-form-item>
    </el-form>

  <el-table :data="tableData" border style="width: 100%" fit>
    <el-table-column prop="typeName" label="分类名" ></el-table-column>
    <el-table-column fixed prop="createTime" label="日期" :sortable="true" :formatter="formDate"></el-table-column>
    <el-table-column prop="weight" label="排序" :sortable="true"></el-table-column>
    <el-table-column  label="操作" >
      <template slot-scope="scope">
        <el-button type="text" size="small" @click="openForm(scope.row)">修改</el-button>
        <el-popconfirm
            title="确定删除该分类"
            @onConfirm="deleteType(scope.row.typeId)"
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
      title="分类信息"
      :visible.sync="centerDialogVisible"
      width="30%"
      center>
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="分类名" prop="typeName">
          <el-input v-model="ruleForm.typeName"></el-input>
        </el-form-item>
        <el-form-item label="排序" prop="weight">
          <el-input type="number" v-model="ruleForm.weight" :placeholder="'数值越大，顺序越前'"></el-input>
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
      // 分类名搜索框对应的内容
      typeName: '',
      // 表格数据数组
      tableData: [],
      // 当前分类
      currentType: {},
      // 当前分类在分类数组（表格数据数组）的下标
      currentTypeIndex: -1,
      // 分页的对象
      page: {
        pageSize: 10, // 当前页的大小
        dataCount: 10, // 动态总条数
        pageNumber: 1 // 第几页
      },
      centerDialogVisible: false,
      // 编辑分类表单
      ruleForm: {
        typeName: '',
        weight: 0,
        typeId: ''
      },
      // 编辑分类对应表单规则
      rules: {
        typeName: [
          { required: true, message: '请输入分类名', trigger: 'blur' },
          { max: 10, message: '禁用理由不能超过10字', trigger: 'blur' }
        ],
        weight: [
          { required: true, message: '请输入排序', trigger: 'blur' },
          { min: 0, message: '不能小于0', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    // 改变当前每页大小触发
    handleSizeChange (val) {
      this.getData(this.page.pageNumber, val, this.typeName)
      console.log('大小' + val)
    },
    // 改变当前页数触发
    handleCurrentChange (val) {
      this.getData(val, this.page.pageSize, this.typeName)
      console.log('页数' + val)
    },
    // 根据搜索条件查询
    searchData: function () {
      this.getData(this.page.pageNumber, this.page.pageSize, this.typeName)
    },
    // 查询数据
    getData: function (pageNum, pageSize, typeName) {
      var param = new URLSearchParams()
      param.append('pageNum', pageNum)
      param.append('pageSize', pageSize)
      param.append('typeName', typeName)

      // 查询
      this.$http.post('/management/dirType/getListByExample', param).then((response) => {
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

      var hours = date.getHours()
      if (hours < 10) {
        hours = '0' + hours
      }
      var minutes = date.getMinutes()
      if (minutes < 10) {
        minutes = '0' + minutes
      }
      var second = date.getSeconds()
      if (second < 10) {
        second = '0' + second
      }
      return `${year}-${month}-${d} ${hours}:${minutes}:${second}`
    },
    // 打开编辑分类信息弹框
    openForm: function (typeInfo) {
      if (typeInfo) {
        this.ruleForm.typeId = typeInfo.typeId
        this.ruleForm.typeName = typeInfo.typeName
        this.ruleForm.weight = typeInfo.weight
      } else {
        this.ruleForm.typeId = ''
        this.ruleForm.typeName = ''
        this.ruleForm.weight = 0
      }

      // 打开编辑分类信息弹框
      this.centerDialogVisible = true
    },
    // 提交禁用信息
    submitForm (formName) {
      var _this = this
      this.$refs[formName].validate((valid) => {
        debugger
        if (!valid) {
          return
        }

        var param = new URLSearchParams()
        param.append('typeName', _this.ruleForm.typeName)
        param.append('weight', _this.ruleForm.weight)

        if (!_this.ruleForm.typeId) {
          debugger
          // 插入分类
          _this.$http.post('/management/dirType/insertDitType', param).then((response) => {
            var content = response.data.content
            if (content.status === '00') {
              _this.centerDialogVisible = false
              // 插入数据之后调用查询方法
              _this.getData(_this.page.pageNumber, _this.page.pageSize, _this.typeName)
            }
          })
        } else {
          param.append('typeId', _this.ruleForm.typeId)

          // 更新分类
          _this.$http.post('/management/dirType/updateDitType', param).then((response) => {
            var content = response.data.content
            if (content.status === '00') {
              _this.centerDialogVisible = false
              // 更新完之后更到表单数据数组
              var typeInfo = content.data.typeInfo

              var index = -1
              for (var i = 0; i < _this.tableData.length; i++) {
                if (typeInfo.typeId === _this.tableData[i].typeId) {
                  index = i
                  break
                }
              }
              // 把数组的数据替换成新的
              _this.tableData.splice(index, 1, typeInfo)
            }
          })
        }
      })
    },
    // 删除分类
    deleteType: function (typeId) {
      this.$http.get('/management/dirType/deleteDitType?typeId=' + typeId).then((response) => {
        var content = response.data.content
        if (content.status === '00') {
          this.centerDialogVisible = false
          // 插入数据之后调用查询方法
          this.getData(this.page.pageNumber, this.page.pageSize, this.typeName)
        }
      })
    }
  }
}
</script>
