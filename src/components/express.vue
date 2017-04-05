<template>
  <div id="express">

    <el-row class="screening">
      <el-input class='inp'
        placeholder="搜索房间号请按照 x幢xxxx的格式填写"
        v-model="search_input">
      </el-input>

      <el-date-picker
        v-model="date_value1"
        align="right"
        type="date"
        placeholder="选择日期">
      </el-date-picker>
      <el-button type="primary" v-on:click='search' style='margin-left:12px;'>确定</el-button>
      <el-button type="primary" v-on:click='reset' style='margin-left:12px;'>重置</el-button>
    </el-row>

    <el-table
      :data="tableData"
      v-loading.body="loading"
      stripe
      border
      style="width: 100%;margin-top:15px;">
      <el-table-column
         prop="createTime"
         label="时间">
       </el-table-column>
      <el-table-column
         prop="personName"
         label="用户姓名">
       </el-table-column>
      <el-table-column
         prop="personMobile"
         label="用户手机号">
       </el-table-column>
       <el-table-column
         label="房间号"
         inline-template>
         <span v-if="row.building && row.building != ''">{{row.building}}幢{{row.unit}}单元{{row.houseNum}}</span>
       </el-table-column>
      <el-table-column
         label="快递公司"
         inline-template>
         <div class="">
           <span v-if="row.company == '1'">顺丰</span>
           <span v-if="row.company == '2'">圆通</span>
           <span v-if="row.company == '3'">申通</span>
           <span v-if="row.company == '4'">中通</span>
           <span v-if="row.company == '5'">韵达</span>
           <span v-if="row.company == '6'">EMS</span>
           <span v-if="row.company == '9'">其它</span>
         </div>
       </el-table-column>
       <el-table-column
         prop="wuyePersonName"
         label="快递员姓名">
       </el-table-column>
       <el-table-column
         prop="wuyePersonMobile"
         label="快递员电话">
       </el-table-column>
       <el-table-column
         label="状态"
         inline-template>
         <div class="">
           <span v-if="row.status == '0'" class="disabled">未取件</span>
           <span v-else-if="row.status == '1'">已取件</span>
         </div>
       </el-table-column>
      <el-table-column
        inline-template
        :context="_self"
        label="操作">
        <span>
          <el-button v-if="row.status == '0'" @click='complete($index,row)' type='primary' size="small">完成</el-button>
        </span>
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

    <div class="bottom-btn">
      <el-button class='uploadBtn' type="primary" @click='_add'>添加
        <i class="el-icon-plus el-icon--right"></i>
      </el-button>
    </div>

    <!-- 添加弹出框 -->
    <el-dialog title="添加订单" v-model="dialogVisible" :close-on-click-modal='false'>
      <el-form :model="firstForm" :rules="firstRules" ref="firstForm" label-width="140px">
        <el-form-item label="收件人姓名" prop="personName">
          <el-input v-model="firstForm.personName" placeholder="请输入收件人姓名"></el-input>
        </el-form-item>
        <el-form-item label="收件人手机" prop="personMobile">
          <el-input v-model="firstForm.personMobile" placeholder="请输入收件人手机"></el-input>
        </el-form-item>
        <el-form-item label="快递公司" prop="company">
          <el-select v-model="firstForm.company" placeholder="请选择快递公司">
            <el-option label="顺丰" value="1"></el-option>
            <el-option label="圆通" value="2"></el-option>
            <el-option label="申通" value="3"></el-option>
            <el-option label="中通" value="4"></el-option>
            <el-option label="韵达" value="5"></el-option>
            <el-option label="EMS" value="6"></el-option>
            <el-option label="其它" value="9"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="快递员姓名" prop="wuyePersonName">
          <el-input v-model="firstForm.wuyePersonName" placeholder="请输入快递员姓名"></el-input>
        </el-form-item>
        <el-form-item label="快递员手机" prop="wuyePersonMobile">
          <el-input v-model="firstForm.wuyePersonMobile" placeholder="请输入快递员手机"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="allowSub">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script type="text/javascript">
import host from '../config.js'

export default {
  data () {
    return {
      dialogVisible:false,
      tableData: [],
      totle:0,
      current:1,
      loading:false,
      date_value1:'',
      search_input:'',
      firstForm:{
        personName:'',
        wuyePersonName:'',
        personMobile:'',
        wuyePersonMobile:'',
        company:''
      },
      firstRules:{
        personMobile: [
          { required: true,validator: host.basic.checkMobile, message: '请输入正确的手机', trigger: 'blur' }
        ],
        wuyePersonName: [
          { required: true, message: '请输入快递员姓名', trigger: 'blur' },
        ],
        wuyePersonMobile: [
          { required: true,validator: host.basic.checkMobile, message: '请输入正确的手机', trigger: 'blur' },
        ],
        company: [
          { required: true, message: '请输入快递员手机', trigger: 'change' }
        ]
      }
    }
  },
  mounted(){
    this.getIps(1)
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
    // 获取列表
    getIps(ind,date,searchStr){
      let that = this;
      that.loading = true;
      this.$http.get(host.basic.basicUrl+'/server/listExpress',{params:{
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
      if(val1 != '' && val1 != undefined){val1 = host.basic.formatDate(this.date_value1.getTime())}
      this.getIps(1,val1,this.search_input)
    },
    // 重置
    reset(){
      this.search_input='';
      this.date_value1 = '';
      this.current=1;
      this.getIps(1);
    },
    _add(){
      this.$refs.firstForm && this.$refs.firstForm.resetFields();
      this.dialogVisible = true
    },
    // 完成订单
    complete($index,row){
      let that = this;
      this.$confirm('你确定要完成此订单?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        closeOnClickModal:false,
        type: 'warning'
      }).then(() => {
        this.$http({
          method:'POST',
          url:host.basic.basicUrl+'/server/pickUp',
          params:{
            id:that.tableData[$index].id
          }
        }).then(function(res){
        let data = res.data;
        if(data.ERRORCODE == '0'){
          that.tableData[$index].status = '1';
          this.$message.success('该订单已完成');
        }else{
          that.$message.warning(data.RESULT);
        }},function(error){
          that.$message.error('请求错误,请稍后再试');
        }).catch(() => {});
      })
    },
    // 添加快递
    allowSub(){
      let that = this;
      this.$http({
        method:'POST',
        url:host.basic.basicUrl+'/server/insertExpress',
        params:that.firstForm
      }).then(function(res){
      let data = res.data;
      if(data.ERRORCODE == '0'){
        that.$message.success('操作成功!');
        this.getIps(1);
        this.dialogVisible = false;
      }else{
        that.$message.warning(data.RESULT);
      }},function(error){
        that.$message.error('请求错误,请稍后再试');
      }).catch(() => {});
    }
  }
}
</script>

<style scoped lang="less">
  #express{
    padding-left: 15px;
    padding-right: 15px;
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
    .bottom-btn{
      text-align: center;
      button{
        width: 300px;
        margin-top: 50px;
      }
    }
  }
</style>
