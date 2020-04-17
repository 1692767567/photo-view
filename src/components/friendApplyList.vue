<template>
    <div :style="{'heigth':'100%'}">
      <div style="padding-left:10px;border-bottom:1px solid #999;line-height: 55px;font-size: 16px;font-weight: bold;">好友申请</div>
      <div style="height:100%;overflow:autol;margin-bottom:20px" class="apply-list" >
        <el-row v-for="(e,index) in applyList" :key="'apply'+index">
         <el-col :span="16" :offset="1" :class="'apply-col'" :style="{height:'80px','padding':'15px 0px ','border-bottom':'1px solid #999'}">
            <div >
              <img :src="e.fromPhoto" style="width:50px;height:50px;float:left">
              <div style="float:left;padding-left:5px">
                <div style="width:100%;height:25px">{{e.fromUserName}}</div>
                <div style="width:100%;height:25px;color:#666;line-height:25px">{{e.remark}}</div>
              </div>
            </div>
          </el-col>

          <el-col :span="6" :style="{height:'80px','padding':'15px 0px ','border-bottom':'1px solid #999'}">
            <div v-if="e.isDeal === 1">
              <span style="line-height:80px" v-if="e.result ==0">已同意</span>
              <span style="line-height:80px" v-if="e.result ==1">已拒绝</span>
            </div>
            <el-row>
              <el-button small @click.prevent.native="dealApply(e.id,0)" type="success">通过</el-button>
              <el-button small @click.prevent.native="dealApply(e.id,1)" type="danger">拒绝</el-button>
            </el-row>
          </el-col>
        </el-row>
      </div>
    </div>
</template>

<script>
export default {
  data: function () {
    return {
      applyList: []
    }
  },
  mounted: function () {
    this.getAllApply()
  },
  methods: {
    dealApply: function (applyId, result) { // 处理申请
      if (!applyId) {
        this.$Message.error('申请id不能为空')
        return
      }
      var param = new URLSearchParams()
      param.append('id', applyId)
      param.append('result', result)
      this.$http.post('/friendApply/dealApply', param).then(function (response) {
        var content = response.data.content
        if (content.status === '00') {
          if (content.data.result) {
            this.$Message.success(content.msg)
          } else {
            this.$Message.error(content.msg)
          }
        }
      })
    },
    getAllApply: function () {
      this.$http.get('/friendApply/getAllApply').then(function (response) {
        var content = response.data.content
        if (content.status === '00') {
          this.applyList = content.data.allApply
        }
      })
    }
  }
}
</script>

<style scoped>
.apply-list::-webkit-scrollbar {
  width: 15px;
}
.apply-list::-webkit-scrollbar-track {
  background-color:#fff;
  -webkit-border-radius: 2em;
  -moz-border-radius: 2em;
  border-radius: 2em;
}
.apply-list::-webkit-scrollbar-thumb {
  background-color: #666;
  -webkit-border-radius: 2em;
  -moz-border-radius: 2em;
  border-radius: 2em;
}

</style>
