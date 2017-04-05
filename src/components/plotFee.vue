<template>
  <div id="plotFee">

   <el-tabs v-model="activeName2" type="card" @tab-click="handleClick">
    <el-tab-pane label="住户 " name="first">
        <el-form :model="firstForm" :rules="firstRules" ref="firstForm" label-width="150px" class='form1'>
      <el-form-item label="物业名称" prop="name">
        <el-input v-model="firstForm.name" placeholder="如:万科物业"></el-input>
      </el-form-item>
      <el-form-item label="公共能耗费 元/月" prop="commonFee">
        <el-input v-model="firstForm.commonFee" placeholder="如:20"></el-input>
      </el-form-item>
      <el-form-item label="物业管理费 元/月" prop="propertyFee">
        <el-input v-model="firstForm.propertyFee" placeholder="如:60"></el-input>
      </el-form-item>
      <el-form-item label="水费 元/吨" prop="waterFee">
        <el-input v-model="firstForm.waterFee" placeholder="如:2"></el-input>
      </el-form-item>
      <el-form-item label="电费 元/度" prop="electricFee">
        <el-input v-model="firstForm.electricFee" placeholder="如:3"></el-input>
      </el-form-item>
      <div class="btn">
        <el-button type="primary" @click="submit">保存住户信息</el-button>
      </div>
    </el-form>
    </el-tab-pane>
    <el-tab-pane label="商户" name="second">
          <el-form :model="firstForm2" :rules="firstRules2" ref="firstForm2" label-width="150px" class='form1'>
      <el-form-item label="物业名称" prop="name">
        <el-input v-model="firstForm2.name" placeholder="如:万科物业"></el-input>
      </el-form-item>
      <el-form-item label="公共能耗费 元/月" prop="commonFee">
        <el-input v-model="firstForm2.commonFee" placeholder="如:20"></el-input>
      </el-form-item>
      <el-form-item label="物业管理费 元/月" prop="propertyFee">
        <el-input v-model="firstForm2.propertyFee" placeholder="如:60"></el-input>
      </el-form-item>
      <el-form-item label="水费 元/吨" prop="waterFee">
        <el-input v-model="firstForm2.waterFee" placeholder="如:2"></el-input>
      </el-form-item>
      <el-form-item label="电费 元/度" prop="electricFee">
        <el-input v-model="firstForm2.shopElectricFee" placeholder="如:3"></el-input>
      </el-form-item>
      <div class="btn">
        <el-button type="primary" @click="submit2">保存商户信息</el-button>
      </div>
    </el-form>
    </el-tab-pane>
  </el-tabs>
  </div>
</template>

<script type="text/javascript">
import host from '../config.js'

export default {
  data () {
    return {
      activeName: 'first',
      firstForm:{
        name:'',
        commonFee:'',
        propertyFee:'',
        waterFee:'',
        carportFee:'',
        electricFee:'',
        shopElectricFee:''
      },
      firstForm2:{
        name:'',
        commonFee:'',
        propertyFee:'',
        waterFee:'',
        carportFee:'',
        electricFee:'',
        shopElectricFee:''
      },
      firstRules:{
        waterFee:[
          {validator: host.basic.checkNum2, trigger: 'blur' }
        ],
        commonFee:[
          {validator: host.basic.checkNum2, trigger: 'blur' }
        ],
        propertyFee:[
          {validator: host.basic.checkNum2, trigger: 'blur' }
        ],
        carportFee:[
          {validator: host.basic.checkNum2, trigger: 'blur' }
        ],
        electricFee:[
          {validator: host.basic.checkNum2, trigger: 'blur' }
        ]
      },
      firstRules2:{
        waterFee:[
          {validator: host.basic.checkNum2, trigger: 'blur' }
        ],
        commonFee:[
          {validator: host.basic.checkNum2, trigger: 'blur' }
        ],
        propertyFee:[
          {validator: host.basic.checkNum2, trigger: 'blur' }
        ],
        carportFee:[
          {validator: host.basic.checkNum2, trigger: 'blur' }
        ],
        electricFee:[
          {validator: host.basic.checkNum2, trigger: 'blur' }
        ]
      }
    }
  },
  mounted(){
    this.getIps();
    // this.getIps1();
  },
  methods: {
    handleClick(tab, event) {
      // console.log(tab, event);
    },
    //  获取住户数据
    getIps(){
      let that = this;
      this.$http.get(host.basic.basicUrl+'/wuyeInfo/info').then(function(res){
        let data = res.data;
        if(data.ERRORCODE == '0'){
          if(data.RESULT){
            console.log(data.RESULT);
            that.firstForm = data.RESULT;
            that.firstForm2 = data.RESULT;
            if(that.firstForm.electricFee != ''){that.firstForm.electricFee = that.firstForm.electricFee/100}
            if(that.firstForm.waterFee != ''){that.firstForm.waterFee = that.firstForm.waterFee/100}  
            if(that.firstForm.commonFee != ''){that.firstForm.commonFee = that.firstForm.commonFee/100}
            if(that.firstForm.propertyFee != ''){that.firstForm.propertyFee = that.firstForm.propertyFee/100} 
            if(that.firstForm2.shopElectricFee != ''){that.firstForm2.shopElectricFee = that.firstForm2.shopElectricFee/100}
          }
        }else{
          that.$message.warning(data.RESULT);
        }
      }, function(error){
        that.$message.error('获取物业信息失败,请稍后再试');
      });
    },

    submit(){
      let that = this;
      this.$refs.firstForm.validate((valid) => {
        if (valid) {
          let data = {
            name:that.firstForm.name,
            carportFee:that.firstForm.carportFee
          }
          if(that.firstForm.electricFee != ''){data.electricFee = parseInt(that.firstForm.electricFee*100)}
          if(that.firstForm.waterFee != ''){data.waterFee = parseInt(that.firstForm.waterFee*100)}
          if(that.firstForm.commonFee != ''){data.commonFee = parseInt(that.firstForm.commonFee*100)}
          if(that.firstForm.propertyFee != ''){data.propertyFee = parseInt(that.firstForm.propertyFee*100)}
          // if(that.firstForm.shopElectricFee != ''){data.shopElectricFee = that.firstForm.shopElectricFee*100}
          this.$http({
            method:'POST',
            url:host.basic.basicUrl+'/wuyeInfo/update',
            params:data
          }).then(function(res){
            let data = res.data;
            if(data.ERRORCODE == '0'){
              that.$message.success('操作成功');
              this.getIps();
            }else{
              that.$message.warning(data.RESULT);
            }
          }, function(error){
            that.$message.error('请求失败');
          });
        } else {
          return false;
        }
      });
    },
    submit2(){
      let that = this;
      this.$refs.firstForm2.validate((valid) => {
        if (valid) {
          let data = {
            name:that.firstForm2.name,
            carportFee:that.firstForm2.carportFee
          }
          // if(that.firstForm2.electricFee != ''){data.electricFee = that.firstForm.electricFee*100}
          if(that.firstForm2.shopElectricFee != ''){data.shopElectricFee = parseInt(that.firstForm2.shopElectricFee*100)}
          if(that.firstForm2.waterFee != ''){data.waterFee = parseInt(that.firstForm2.waterFee*100)}
          if(that.firstForm2.commonFee != ''){data.commonFee = parseInt(that.firstForm2.commonFee*100)}
          if(that.firstForm2.propertyFee != ''){data.propertyFee = parseInt(that.firstForm2.propertyFee*100)}
          this.$http({
            method:'POST',
            url:host.basic.basicUrl+'/wuyeInfo/update',
            params:data
          }).then(function(res){
            let data = res.data;
            if(data.ERRORCODE == '0'){
              that.$message.success('操作成功');
              this.getIps();
            }else{
              that.$message.warning(data.RESULT);
            }
          }, function(error){
            that.$message.error('请求失败');
          });
        } else {
          return false;
        }
      });
    }
  }
}
</script>
<style scoped lang="less">
  #plotFee{
    padding: 15px;
    .btn{
      text-align: center
    }
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
