<template>
  <div id="Myheader">
    <el-dialog v-model="loginDialogVisible" size="full" :show-close='false'>
      <div class="content">
        <div class="panel-head">物业后台管理系统</div>
        <el-form class='form' :model="loginForm" :rules="loginRole" ref="loginForm" label-width="100px" label-position='left'>
          <el-form-item label="用户名" prop="user">
            <el-input type="text" v-model="loginForm.user" auto-complete="off"></el-input>
          </el-form-item>
          <div class="" v-on:keyup.13="handleSubmit">
            <el-form-item label="密码" prop="pass">
              <el-input type="password" v-model="loginForm.pass" auto-complete="off"></el-input>
            </el-form-item>
          </div>
          <el-form-item>
            <el-button type="primary" @click="handleSubmit">登录</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import host from '../config.js'

export default {
  created(){

  },
  data() {
    return {
      loginDialogVisible:true,
      loginForm: {
        pass: '',
        user:''
      },
      loginRole: {
        pass: [
         { required: true, message: '请输入密码', trigger: 'blur' },
         { min: 6, max: 18, message: '长度在 6 到 18 位', trigger: 'blur' }
        ],
        user:[
          {required: true,message: '请输入用户名',trigger: 'blur'}
        ]
      }
    };
  },
  methods: {
    handleReset() {
      this.$refs.loginForm.resetFields();
    },
    handleSubmit(ev) {
      let that = this;
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          this.$http({
            method:'POST',
            url:host.basic.basicUrl+'/login/login',
            params:{userName:that.loginForm.user,passWord:that.loginForm.pass}
          }).then(function(res){
            let data = res.data;
            if(data.ERRORCODE == '0'){
              this.$notify({
                title: '登录成功',
                message: '欢迎登录物业后台管理系统',
                type: 'success'
              });
              that.fetchData();
              sessionStorage.setItem('xunLogin', true);
              this.$router.replace({path:'/'})
              window.location.reload();
            }else{
              that.$message.error('用户名或密码错误');
            }
          },function(error){
            this.$message.warning('网络错误');
          })
        } else {
          return false;
        }
      });
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
            this.$parent.todo2 = data.RESULT.total
          }else{
            document.querySelector('sup').style.display = 'none'
          }
        }else{
          if(data.ERRORCODE == '10000'){
            this.$router.push('login');
          }
        }
      }, function(error){

      });
    }
  }
}
</script>

<style lang='less'>
  #Myheader{
    position: relative;
    .el-dialog{
      background: #f6f5f5;
      background: url('../assets/login_1.png') no-repeat center center
    }
    .content{
      width: 500px;
      background: url('../assets/login_2.png') no-repeat center center;
      position: absolute;
      top:50%;
      left:50%;
      margin-top: -240px;
      margin-left: -250px;
      // border: 1px solid #dfdfdf;
      -moz-border-radius: 8px;
      -webkit-border-radius: 8px;
      border-radius: 8px;
      -moz-box-shadow: 0px 1px 15px rgba(0, 0, 0, 0.15);
      -webkit-box-shadow: 0px 1px 15px rgba(0, 0, 0, 0.15);
      box-shadow: 0px 1px 15px rgba(0, 0, 0, 0.15);
      .panel-head{
        border-radius: 8px 8px 0 0;
        height: 56px;
        background: #58a0da;
        color:#fff;
        font-size: 20px;
        line-height: 56px;
        text-align: center
      }
      .form{
        margin:40px 60px;
        button{
          width: 100%;
          background:-webkit-gradient(linear, 0% 0%, 0% 100%,from(#438dc9), to(#1490f5));/*谷歌*/
          background:-moz-linear-gradient(top,#438dc9,#1490f5);/*火狐*/
          height: 44px;
          span{
            font-size: 18px;
          }
        }
        .el-form-item__label{
          color:#fff;
          font-size: 16px;
        }
      }
    }
  }
</style>

<!-- <li><router-link to='/second'>f1d12dd</router-link></li> -->
