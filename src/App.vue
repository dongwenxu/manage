<template>
  <div id="app">
    <el-row class='main-title'>
      <el-col :span="24" class="panel-top">
        <el-col :span="20" style="font-size:26px;padding-left:30px;">
          <span>物业后台管理系统</span>
        </el-col>
        <el-col :span="4" style="padding-top:6px;">
          <el-badge :value="todo2" class="item" id='news'>
            <el-popover
              placement="bottom"
              width="240"
              trigger="click">
              <el-table :data="newsData" @row-click='newsClick' id="newsTable">
                 <el-table-column width="148" property="createTime" label="日期"></el-table-column>
                 <el-table-column width="88" label="服务" inline-template>
                   <div class="">
                     <span v-if="row.orderType == '1'">报修</span>
                     <span v-if="row.orderType == '2'">家政</span>
                     <span v-if="row.orderType == '3'">回收</span>
                   </div>
                 </el-table-column>
               </el-table>
              <el-button size="text" slot="reference"><i class="el-icon-message"></i></el-button>
            </el-popover>
          </el-badge>
          <el-tooltip class="item" effect="dark" content="点击退出系统" placement="bottom" style="margin-left:30px">
            <span v-on:click='logout' class='logout'>退出系统</span>
          </el-tooltip>
        </el-col>
      </el-col>
    </el-row>
    <div class='main-content'>
      <div style='height:100%'>
        <el-menu :default-active='_index' class="nav-menu " @select="handleSelect"
        @open="handleOpen" @close="handleClose" theme="dark">
          <el-menu-item index="1" ><i class="el-icon-menu" ></i>用户管理<el-badge value="new" class="item" v-show="aok1"></el-badge></el-menu-item>
          <el-menu-item index="2"><i class="el-icon-document"></i>工单处理</el-menu-item>
          <el-menu-item index="3" v-show="level"><i class="el-icon-upload2"></i>物业收费</el-menu-item>
          <el-menu-item index="8" v-show="level"><i class="el-icon-share"></i>业主管理</el-menu-item>
          <el-menu-item index="5" v-show="level"><i class="el-icon-date"></i>物业公告</el-menu-item>
          <el-submenu index="7" v-show="level">
            <template slot="title"><i class="el-icon-information"></i>小区管理</template>
            <el-menu-item index="7-1">员工管理</el-menu-item>
            <el-menu-item index="7-2">物业费用管理</el-menu-item>
          </el-submenu>
          <el-submenu index="6" v-show="level">
            <template slot="title"><i class="el-icon-upload"></i>其它服务<el-badge value="new" class="item" v-show="aok"></el-badge></template>
            <el-menu-item index="6-2">增值服务列表</el-menu-item>
            <!-- <el-menu-item index="6-4">增值服务配置</el-menu-item> -->
            <!-- <el-menu-item index="6-3">收取快递</el-menu-item> -->
            <!-- <el-menu-item index="6-1">闲置回收</el-menu-item> -->
          </el-submenu>
          <el-menu-item index="4" v-show="level"><i class="el-icon-message"></i>意见反馈</el-menu-item>
          <el-menu-item index="9" v-show="level"><i class="el-icon-setting"></i>关于我们</el-menu-item>
        </el-menu>
      </div>
      <div style="flex:1;overflow:auto">
          <router-view class="view"></router-view>
      </div>
    </div>
    <div class="" style="display:none">
      <audio src="./src/assets/new.mp3" id="audio" controls="controls"></audio>
    </div>
  </div>
</template>

<script>
  import host from './config.js'

  export default {
    data() {
      return {
        level:false
      }
    },
    created(){
      // let url = window.location.href;
      // if(url.indexOf('#') > -1){
      //   url = url.substring(url.indexOf('#')+2,)
      //   switch (url) {
      //     case '':
      //       this._index = '1'
      //       break;
      //     case 'order':
      //       this._index = '2'
      //       break;
      //     case 'charge':
      //       this._index = '3'
      //       break;
      //     case 'owner':
      //       this._index = '8'
      //       break;
      //     case 'bulletin':
      //       this._index = '5'
      //       break;
      //     case 'plot':
      //       this._index = '7-1'
      //       break;
      //     case 'plotFee':
      //       this._index = '7-2'
      //       break;
      //     case 'basicOther':
      //       this._index = '6-1'
      //       break;
      //     case 'ext':
      //       this._index = '6-2'
      //       break;
      //     case 'extConfig':
      //       this._index = '6-4'
      //       break;
      //     case 'express':
      //       this._index = '6-3'
      //       break;
      //     case 'commit':
      //       this._index = '4'
      //       break;
      //     case 'about':
      //       this._index = '9'
      //       break;
      //     case 'login':
      //       this._index = '1'
      //       break;
      //   }
      // }
      // 获取为处理的消息
      let that = this;
      that.level();
      that.fetchData();

      let timer = setInterval(that.fetchData,60000);

      that.fetchData1();
      let timer1 = setInterval(that.fetchData1,10000);

      this._index = '1'
      this.$router.push({path:'/'})

      that.fetchData2();
      let timer2 = setInterval(that.fetchData2,10000);
      
    },
    data(){
      return {
        _index:'1',
        newsData:[],
        todo:0,
        todo2:0,
        aodo:0,
        aodo2:0,
        aok:false,
        aok1:false,
      }
    },
    methods: {
      handleSelect(key, keyPath) {
        switch (key) {
          case '1': 
            this.aok1 = false;
            this.$router.push({path:'/'})
            break;
          case '2':
            this.$router.push({path:'/order'})
            break;
          case '3':
            this.$router.push({path:'/charge'})
            break;
          case '4':
            this.$router.push({path:'/commit'})
            break;
          case '5':
            this.$router.push({path:'/bulletin'})
            break;
          case '6-1':
            this.$router.push({path:'/basicOther'})
            break;
          case '6-2':
            this.aok = false;
            this.$router.push({path:'/ext'})
            break;
          case '6-3':
            this.$router.push({path:'/express'})
            break;
          case '6-4':
            this.$router.push({path:'/extConfig'})
            break;
          case '7-1':
            this.$router.push({path:'/plot'})
            break;
          case '7-2':
            this.$router.push({path:'/plotFee'})
            break;
          case '8':
            this.$router.push({path:'/owner'})
            break;
          case '9':
            this.$router.push({path:'/about'})
            break;
        }
      },
      handleOpen(key, keyPath) {
        // console.log(key, keyPath);
      },
      handleClose(key, keyPath) {
        // console.log(key, keyPath);
      },
      aok11(){ 
         alert(1);
      },
      fetchData(){
        let that = this;
        this.$http({
          method:'POST',
          url:host.basic.basicUrl+'/workOrder/list',
          params:{
            pageNum:1,status:1
          }
        }).then(function(res){
          let data = res.data;
          if(data.ERRORCODE == '0'){
            if(data.RESULT.list && data.RESULT.list.length){
              for(let i = 0; i<data.RESULT.list.length; i++){
                data.RESULT.list[i].createTime = host.basic.formatDate(data.RESULT.list[i].createTime,2)
              }
              that.newsData = data.RESULT.list;
              that.todo2 = data.RESULT.total;
              let item = sessionStorage.getItem('xunLogin');
              if(data.RESULT.total > that.todo && item){
                that.todo = data.RESULT.total
                document.getElementById('audio').play();
              }
            }else{
              document.querySelector('sup').style.display = 'none'
            }
          }else{
            data = JSON.parse(data);
            if(data.ERRORCODE == '10000'){
              this.$router.push('login');
            }
          }
        }, function(error){

        });
      },
      fetchData1(){
        let that = this;
        // that.aok = false;  
        this.$http.get(host.basic.basicUrl+'/server/listRecord',{params:{
        pageNum:1}}).then(function(res){
          let data = res.data;
          if(data.ERRORCODE == '0'){
              // that.aodo2 = data.RESULT.total;
              let item = sessionStorage.getItem('xunLogin');
              if(data.RESULT.total > that.aodo && item){
                that.aodo = data.RESULT.total;
                that.aok = true;
                document.getElementById('audio').play();
              }else if(data.RESULT.total == that.aodo && item){
                that.aok = false;               
              }else{
                that.aok = false;
              }
              
          }else{
            data = JSON.parse(data);
            if(data.ERRORCODE == '10000'){
              this.$router.push('login');
            }
          }
        }, function(error){

        });
      },
      fetchData2(){
        let that = this;
        // that.aok = false;  
        this.$http.get(host.basic.basicUrl+'/person/list',{params:{
          pageNum:1
        }}).then(function(res){
          let data = res.data;
          if(data.ERRORCODE == '0'){
              // that.aodo2 = data.RESULT.total;
              let item = sessionStorage.getItem('xunLogin');
              if(data.RESULT.total > that.aodo2 && item){
                that.aodo2 = data.RESULT.total;
                that.aok1 = true;
                document.getElementById('audio').play();
              }else if(data.RESULT.total == that.aodo2 && item){
                that.aok1 = false;               
              }else{
                that.aok1 = false;
              }    
          }else{
            data = JSON.parse(data);
            if(data.ERRORCODE == '10000'){
              this.$router.push('login');
            }
          }
        }, function(error){

        });
      },
      level(){
          this.$http.get(host.basic.basicUrl+'/wuyePerson/userInfo').then(function(res){
           let _level = res.data.RESULT.level;
            console.log(_level);
            if(_level == 2){
              this.level = false;
            }else if(_level == 1){
              this.level = true;
            }
           
          }, function(error){
            that.$message.error('数据获取失败,请稍后再试');
          });
        },
      logout(){
        let that = this;
        this.$confirm('你确定要退出登录嘛?, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          closeOnClickModal:false,
          type: 'warning'
        }).then(() => {
          that.$http.get(host.basic.basicUrl+'/login/logout').then(function(res){
            let data = res.data;
            if(data.ERRORCODE == '0'){
              sessionStorage.removeItem('xunLogin');
              this.$router.replace({path:'/login'})
            }else{
              that.$notify({
                title: '退出失败',
                message: data.RESULT,
                type: 'error'
              });
            }
          })
        }).catch(() => {
        });
      },
      newsClick(rows){
        let type = rows.orderType;
        if(type != 3){
          this.$router.push('order');
          this._index = '2'
        }else{
          this.$router.push('basicOther');
          this._index = '6-1'
        }
      }
    }
  }
</script>

<style lang="less">
  html,body {
    font-family: Helvetica, sans-serif;
    margin: 0;
    overflow: auto;
    height: 100%;
  }
  #app{
    height: 100%;
  }
  .main-title{
    height: 10%;
    min-height: 70px;
  }
  .main-content{
    display:flex;
    flex:1;
    height: 90%;
  }
  .panel-top {
    height: 100%;
    background: #324057;
    color: #c0ccda;
    padding-top: 30px;
  }
  .nav-menu{
    height: 100%;
    >li{
      font-size: 16px;
      width: 180px;
      min-height: 65px;
      line-height: 65px;
      background-color: #324057;
    }
  }
  .logout{
    cursor: pointer;
  }
  .el-submenu__title{
    font-size: 16px!important;
  }
  .el-submenu .el-menu-item{
    padding:0!important;
    padding-left: 20px!important;
  }
  #news{
    .el-button{
      font-size: 20px;
      color:#c0ccda;
    }
  }
  #newsTable{
    tr{
      cursor: pointer;
    }
  }
</style>
