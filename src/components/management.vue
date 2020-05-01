<template>
<div style="margin-top:40px">
    <photoheader></photoheader>
    <el-container>
        <el-aside width="400px" :style="{'padding':'20px 0px'}">
            <el-row class="tac">
            <el-col :span="12" :offset="12">
                <el-menu
                class="el-menu-vertical-demo">
                    <router-link to="/management/userManage" tag="div">
                        <el-menu-item index="1">
                            <i class="el-icon-menu"></i>
                            <span slot="title">用户管理</span>
                        </el-menu-item>
                    </router-link>
                    <router-link to="/management/dirTypeManage" tag="div">
                        <el-menu-item index="2">
                            <i class="el-icon-menu"></i>
                            <span slot="title">相册分类管理</span>
                        </el-menu-item>
                    </router-link>
                    <router-link to="/management/dynamicManage" tag="div">
                        <el-menu-item index="3">
                            <i class="el-icon-menu"></i>
                            <span slot="title">动态管理</span>
                        </el-menu-item>
                    </router-link>
                    <router-link to="/management/announManage" tag="div">
                        <el-menu-item index="4">
                            <i class="el-icon-menu"></i>
                            <span slot="title">公告管理</span>
                        </el-menu-item>
                    </router-link>
                </el-menu>
            </el-col>
            </el-row>
        </el-aside>
        <el-main>
            <router-view></router-view>
        </el-main>
    </el-container>
    <photofooter></photofooter>
</div>
</template>
<script>
import photoheader from './header.vue'
import photofooter from './footer.vue'
export default {
  name: 'app',
  data: function () {
    return {
    }
  },
  components: {
    photoheader,
    photofooter
  }
}
</script>
