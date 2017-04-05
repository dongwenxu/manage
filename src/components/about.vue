<template>
  <div id="about">
    <el-form :model="dynamicForm" :rules="dynamicRule" ref="dynamicForm" label-width="100px" class="demo-dynamic">
      <el-form-item prop="content" label="物业介绍:">
        <el-input type='textarea' :autosize="{ minRows: 10, maxRows: 15}"
        v-model="dynamicForm.content"
        placeholder='请您输入物业的介绍,如:园区的规模,建地面积,服务,联系电话等！字数不超过500字'></el-input>
      </el-form-item>
      <!-- <el-form-item
        v-for="(domain, index) in dynamicForm.domains"
        :label="'电话' + (index+1)"
        :key="domain.key"
        :prop="'domains.' + index + '.value'">
        <el-input v-model="domain.value" placeholder='请输入物业的联系电话'></el-input>
        <el-button @click.prevent="removeDomain(domain)" type='danger'>删除</el-button>
      </el-form-item>
      <el-form-item> -->
        <!-- <el-button @click="addDomain">新增电话</el-button> -->
        <div class="">
          <el-button type="primary" @click="submit" style='float:right'>保存信息</el-button>
        </div>
      </el-form-item>
    </el-form>
  </div>
</template>

<script type="text/javascript">
import host from '../config.js'

export default {
  created(){
    let that = this;
    this.$http.get(host.basic.basicUrl+'/aboutUs/info').then(function(res){
      let data = res.data;
      if(data.ERRORCODE == '0'){
        if(data.RESULT && data.RESULT.content){
          that.dynamicForm.content = data.RESULT.content;
        }
      }
    }, function(error){
      that.$message.error('数据获取失败,请稍后再试');
      that.loading = false
    });
  },
  data() {
    return {
      dynamicForm: {
        // domains: [{
        //   value: ''
        // }],
        content: ''
      },
      dynamicRule: {
        content: [
          {required: true,message: '请输入内容',trigger: 'blur'},
          {max:500, message: '长度控制在500个字符', trigger: 'blur' }
        ]
      }
    };
  },
  methods: {
    submit(ev) {
      let that = this;
      this.$refs.dynamicForm.validate((valid) => {
        if (valid) {
          that.$http.get(host.basic.basicUrl+'/aboutUs/insert',{params:{content:that.dynamicForm.content}}).then(function(res){
            let data = res.data;
            if(data.ERRORCODE == '0'){
              that.$message.success('操作成功');
            }else{
              that.$message.error(data.RESULT);
            }
          }, function(error){
            that.$message.error('数据获取失败,请稍后再试');
          });
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    removeDomain(item) {
      var index = this.dynamicForm.domains.indexOf(item)
      if (index !== -1) {
        this.dynamicForm.domains.splice(index, 1)
      }
    },
    addDomain() {
      this.dynamicForm.domains.push({
        value: '',
        key: Date.now(),
        placeholder:'请输入物业的联系电话'
      });
    }
  }
}
</script>

<style lang="less">
  #about{
    padding: 15px;
    form{
      margin: 0 auto;
      margin-top: 50px;
      width: 600px;
      .el-input{
        display: inline-block;
        width: 400px;
      }
      .el-button--danger{
        margin-left: 20px;
      }
    }

  }
</style>
