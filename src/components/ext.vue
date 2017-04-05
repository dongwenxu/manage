<template>
  <div id="ext">
    <div v-on:keyup.13="search">
       <el-row class="screening">
         <el-date-picker
        v-model="date_value1"
        align="right"
        type="date"
        placeholder="选择日期">
      </el-date-picker>

      <el-input class='inp'
        placeholder="请按照 x幢xxxx的格式填写"
        v-model="search_input">
      </el-input>
      <el-button type="primary" v-on:click='search' style='margin-left:12px;'>确定</el-button>
      <el-button type="primary" v-on:click='reset' style='margin-left:12px;'>刷新</el-button>
      </el-row>
    </div>
   

    <el-table
      :data="tableData"
      v-loading.body="loading"
      stripe
      border
      style="width: 100%;margin-top:15px;">
      <el-table-column
         prop="createTime"
         label="订单日期">
       </el-table-column>
       <el-table-column
         label="房间号"
         inline-template>
         <span v-if="row.building && row.building != ''">{{row.building}}幢{{row.houseNum}}</span>
       </el-table-column>
      <el-table-column
         prop="personMobile"
         label="用户手机号">
       </el-table-column>
      <el-table-column
         label="类型"
         inline-template>
         <div class="">
           <span v-if="row.serverType==1">送水</span>
           <span v-if="row.serverType==2">装修</span>
           <span v-if="row.serverType==3">盆景</span>
           <!-- <span v-if="row.serverType==4">搬家</span>
           <span v-if="row.serverType==2">装修</span> -->
         </div>
       </el-table-column>
      <el-table-column
         prop="company"
         label="服务公司">
       </el-table-column>
       <el-table-column
         prop="wuyePersonName"
         label="员工">
       </el-table-column>
       <el-table-column
         prop="num"
         label="订单数">
       </el-table-column>
       <el-table-column
         prop="remark"
         label="备注">
       </el-table-column>
       <el-table-column
         prop="wuyePersonMobile"
         label="员工电话号">
       </el-table-column>
    </el-table>

    <div class="block bottom">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="current"
        layout="total,prev, pager, next, jumper"
        :total="totle">
      </el-pagination>
    </div>

    <!-- 新增公告弹出框 -->
    <el-dialog title="增值服务配置信息" v-model="dialogVisible2" size="small" :close-on-click-modal='false'>
      <el-form :model="formLong" :rules="rule" ref="formLong" label-width="100px">
        <el-form-item label="服务类型" prop="serverType">
          <el-select v-model="formLong.serverType" placeholder="请选择类型">
            <el-option label="快递" value="1"></el-option>
            <el-option label="租车位" value="2"></el-option>
            <el-option label="送水" value="3"></el-option>
            <el-option label="搬家" value="4"></el-option>
            <el-option label="装修" value="5"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="公司" prop="company">
          <el-input v-model="formLong.company" placeholder="请输入公司名称"></el-input>
        </el-form-item>
        <el-form-item label="员工姓名" prop="name">
          <el-input v-model="formLong.name" placeholder="请输入员工姓名"></el-input>
        </el-form-item>
        <el-form-item label="员工手机号" prop="mobile">
          <el-input v-model="formLong.mobile" placeholder="请输入员工手机号"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="allowSub">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script type="text/javascript">
import host from '../config.js'

export default {
  mounted(){
    this.getIps(1)
  },
  data() {
    return {
      dialogVisible:false,
      dialogVisible2:false,
      formLong:{
        company:'',
        serverType:'',
        name:'',
        mobile:''
      },
      rule: {
        name:[
          {required: true,message: '请输入',trigger: 'blur'},
        ],
        mobile:[
         { required: true, validator:host.basic.checkMobile, message: '请输入正确的手机号', trigger: 'blur' }
       ],
        company:[
         { required: true, message: '请输入', trigger: 'blur' }
       ],
        serverType:[
         { required: true, message: '请选择', trigger: 'change' }
        ]
      },
      tableData: [],
      totle:0,
      current:1,
      loading:false,
      date_value1:'',
      search_input:''
    }
  },
  methods: {
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      let val1 = this.date_value1;
      if(val1 != '' && val1 != undefined){val1 = host.basic.formatDate(this.date_value1.getTime())}
      this.getIps(val,val1,this.search_input)
      this.current = val;
    },
    // 获取订单
    getIps(ind,date,searchStr){
      let that = this;
      that.loading = true;
      this.$http.get(host.basic.basicUrl+'/server/listRecord',{params:{
        pageNum:ind,date:date,searchStr:searchStr}}).then(function(res){
        let data = res.data;
        if(data.RESULT.list && data.RESULT.list.length){
          for(let i = 0; i<data.RESULT.list.length; i++){
            data.RESULT.list[i].createTime = host.basic.formatDate(data.RESULT.list[i].createTime,2)
          }
        }
        that.tableData = data.RESULT.list;
        this.totle = data.RESULT.total
        that.loading = false
      }, function(error){
        that.$message.error('数据获取失败,请稍后再试');
        that.loading = false
      });
    },
    // 搜索
    search(){
      let val1 = this.date_value1;
      let _input = this.search_input;
      _input = _input.substring(0,2) + '1单元' + _input.substring(2,7);
      if(val1 != '' && val1 != undefined){val1 = host.basic.formatDate(this.date_value1.getTime())}
      this.getIps(1,val1,_input)
    },
    // 重置
    reset(){
      this.search_input='';
      this.date_value1 = '';
      this.current=1;
      this.getIps(1);
    },
    // 新增配置信息
    add(){
      this.dialogVisible2 = true;
      this.$refs.formLong && this.$refs.formLong.resetFields();
    },
    allowSub(){
      let that = this;
      this.$refs.formLong.validate((valid) => {
        if (valid) {
          this.$http({
            method:'POST',
            url:host.basic.basicUrl+'/server/insertServerInfo',
            params:that.formLong
          }).then(function(res){
          let data = res.data;
          if(data.ERRORCODE == '0'){
            that.$message.success('操作成功!');
            this.dialogVisible2 = false;
          }else{
            that.$message.warning(data.RESULT);
          }},function(error){
            that.$message.error('请求错误,请稍后再试');
          }).catch(() => {});
        } else {
          that.$message.error('部分信息输入有误');
          return false;
        }
      });
    }
  }
}
</script>

<style lang="less">
  #ext{
    padding: 15px;
    .screening{
      padding:12px;
      text-align: left;
      .select{
        display:inline-block;
        width: 110px;
      }
      .select1{
        display:inline-block;
        width: 110px;
        margin-right: 10px;
      }
      .inp{
        display:inline-block;
        width: 240px;
        margin-left: 10px;
        margin-right: 20px;
      }
      .span1{
        display: inline-block;
        padding:0 6px;
      }
    }
    .el-pagination{
      display: inline-block;
    }
    .bottom{
      text-align:right;margin-top:20px;
    }
    .disabled{
      color:#20a0ff
    }
  }
</style>
