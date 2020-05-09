<template>
  <div style="width:100%" class="layui-row">
        <photoheader></photoheader>

    <div class="banner">
        <div class="cont w1000">
        <div class="title">
            <h3>MY<br />ALBUM</h3>
            <h4></h4>
        </div>
        <div class="amount">
            <p><span class="text"></span><span class="access"></span></p>
            <p><span class="text"></span><span class="daily-record"></span></p>
        </div>
        </div>
    </div>

    <div class="content">
        <div class="cont w1000">
        <div class="title">
            <span class="layui-breadcrumb" lay-separator="|">
            <router-link to="/albumTemp" tag="a" :class="{active:true}">动态模板</router-link>
            <router-link target="_blank" to="/friend" tag="a">好友</router-link>
            <router-link to="/dirList" tag="a">相册</router-link>
            </span>
        </div>
        <div class="list-item">
            <div class="item">
            <div class="layui-fluid">
                <div class="layui-row">
                <div class="layui-col-xs12 layui-col-sm4 layui-col-md5">
                    <div class="img"><img src="../../public/images/sy_img1.jpg" alt=""></div>
                </div>
                <div class="layui-col-xs12 layui-col-sm8 layui-col-md7">
                    <div class="item-cont">
                    <h3>一键上传， 快速制作<button class="layui-btn layui-btn-danger new-icon">hot</button></h3>
                    <h5>动态相册</h5>
                    <p>选择模板 - 上传素材 - 制作及分享 ，就能生成设计感十足的电子相册。</p>
                    <router-link to="/userAlbum" tag="a" :class="{'go-icon':true}"></router-link>
                    </div>
                </div>
                </div>
            </div>
            </div>
            <div class="item">
            <div class="layui-fluid">
                <div class="layui-row">
                <div class="layui-col-xs12 layui-col-sm4 layui-col-md5">
                    <div class="img"><img src="../../public/images/sy_img2.jpg" alt=""></div>
                </div>
                <div class="layui-col-xs12 layui-col-sm8 layui-col-md7">
                    <div class="item-cont">
                    <h3>海量模板， 供你选择<button class="layui-btn layui-btn-danger new-icon">hot</button></h3>
                    <h5>相册模板</h5>
                    <p>由专业设计师打造的创意模板库，涵盖您工作与生活中的各个场景，mooi会持续更新特效模板，最大程度美化您的相册。</p>
                    <router-link to="/albumTemp" tag="a" :class="{'go-icon':true}"></router-link>
                    </div>
                </div>
                </div>
            </div>
            </div>
            <div class="item">
            <div class="layui-fluid">
                <div class="layui-row">
                <div class="layui-col-xs12 layui-col-sm4 layui-col-md5">
                    <div class="img"><img src="../../public/images/sy_img3.jpg" alt=""></div>
                </div>
                <div class="layui-col-xs12 layui-col-sm8 layui-col-md7">
                    <div class="item-cont">
                    <h3>自由分享<button class="layui-btn layui-btn-danger new-icon">hot</button></h3>
                    <h5>动态</h5>
                    <p>可以分享自己的心情，与好友分享自己生活的点点滴滴。</p>
                    <router-link to="/dynamic" tag="a" :class="{'go-icon':true}"></router-link>
                    </div>
                </div>
                </div>
            </div>
            </div>
            <div class="item">
            <div class="layui-fluid">
                <div class="layui-row">
                <div class="layui-col-xs12 layui-col-sm4 layui-col-md5">
                    <div class="img"><img src="../../public/images/sy_img4.jpg" alt=""></div>
                </div>
                <div class="layui-col-xs12 layui-col-sm8 layui-col-md7">
                    <div class="item-cont">
                    <h3>在线聊天<button class="layui-btn layui-btn-danger new-icon">hot</button></h3>
                    <h5>好友</h5>
                    <p>室内设计作为一门新兴的学科，尽管还只是近数十年的事，但是人们有意识地对自己生活、生产活动的室内进行安排布置，甚至美化装饰，赋予室内环境以所祈使的气氛，却早巳从人类文明伊始的时期就已存在</p>
                    <router-link to="/friend" target="_blank" tag="a" :class="{'go-icon':true}"></router-link>
                    </div>
                </div>
                </div>
            </div>
            </div>
            <div class="item">
            <div class="layui-fluid">
                <div class="layui-row">
                <div class="layui-col-xs12 layui-col-sm4 layui-col-md5">
                    <div class="img"><img src="../../public/images/sy_img5.jpg" alt=""></div>
                </div>
                <div class="layui-col-xs12 layui-col-sm8 layui-col-md7">
                    <div class="item-cont">
                    <h3>图片存储<button class="layui-btn layui-btn-danger new-icon">new</button></h3>
                    <h5>相册</h5>
                    <p>自由上传自己的爱照，给它最温馨的保护。</p>
                    <router-link to="/dirList" tag="a" :class="{'go-icon':true}"></router-link>
                    </div>
                </div>
                </div>
            </div>
            </div>
        </div>
        <div id="demo" style="text-align: center;"></div>
        </div>
    </div>

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
  methods: {
  },
  components: {
    photoheader,
    photofooter
  }
}

</script>

<style scope >
    @import '../../public/css/main.css';
  .layui-nav .layui-nav-item a{
    color: #3f2863;
  }

  .layui-nav .layui-nav-item a:hover, .layui-nav .layui-this a {
      color: #3f2863;
      border-color: #fff;
  }

  .layui-nav .layui-this:after,
  .layui-nav-bar,
  .layui-nav .layui-nav-item a:after {
    position: absolute;
    left: 0;
    top: 0;
    width: 0;
    height: 0px;/*原为5px，我设置为1px*/
    background-color: #009261;
    transition: all .2s;
    -webkit-transition: all .2s
  }
</style>
