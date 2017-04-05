<template>
  <div id="ext">
    <el-row class="screening">
      <el-button type="primary" @click="add" style='float:right'>
        增值服务信息<i class="el-icon-plus el-icon--right"></i>
      </el-button>
    </el-row>

    <el-table
      :data="tableData"
      v-loading.body="loading"
      stripe
      border
      style="width: 100%;margin-top:15px;">
      <el-table-column
         prop="createTime"
         label="创建日期">
       </el-table-column>
      <el-table-column
         label="类型"
         inline-template>
         <div class="">
           <span v-if="row.serverType==1">快递</span>
           <span v-if="row.serverType==2">租车位</span>
           <span v-if="row.serverType==3">送水</span>
           <span v-if="row.serverType==4">搬家</span>
           <span v-if="row.serverType==5">装修</span>
         </div>
       </el-table-column>
      <el-table-column
         prop="company"
         label="服务公司">
       </el-table-column>
       <el-table-column
         prop="name"
         label="员工">
       </el-table-column>
       <el-table-column
         prop="mobile"
         label="员工电话号">
       </el-table-column>
       <el-table-column
         inline-template
         :context="_self"
         label="操作">
         <span>
           <el-button type='primary' size="small" @click="edit($index,row)">修改</el-button>
           <el-button type='danger' size="small" @click="del($index,row)">删除</el-button>
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
      _type:'add'
    }
  },
  methods: {
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      this.getIps(val)
      this.current = val;
    },
    // 获取订单
    getIps(ind){
      let that = this;
      that.loading = true;
      this.$http.get(host.basic.basicUrl+'/server/listInfo',{params:{
        pageNum:ind}}).then(function(res){
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
    // 新增配置信息
    add(){
      this.$refs.formLong && this.$refs.formLong.resetFields();
      this._type = 'add'
      this.dialogVisible2 = true;
    },
    allowSub(){
      let that = this;
      this.$refs.formLong.validate((valid) => {
        if (valid) {
          if(that._type == 'add'){
            this.$http({
              method:'POST',
              url:host.basic.basicUrl+'/server/insertServerInfo',
              params:that.formLong
            }).then(function(res){
            let data = res.data;
            if(data.ERRORCODE == '0'){
              that.$message.success('添加成功!');
              that.getIps(1);
              this.dialogVisible2 = false;
            }else{
              that.$message.warning(data.RESULT);
            }},function(error){
              that.$message.error('请求错误,请稍后再试');
            }).catch(() => {});
          }
          if(that._type == 'edit'){
            this.$http({
              method:'POST',
              url:host.basic.basicUrl+'/server/updateServerInfo',
              params:that.formLong
            }).then(function(res){
            let data = res.data;
            if(data.ERRORCODE == '0'){
              that.$message.success('修改成功!');
              that.getIps(1);
              this.dialogVisible2 = false;
            }else{
              that.$message.warning(data.RESULT);
            }},function(error){
              that.$message.error('请求错误,请稍后再试');
            }).catch(() => {});
          }
        } else {
          that.$message.error('部分信息输入有误');
          return false;
        }
      });
    },
    edit($index,row){
      this.formLong = this.tableData[$index];
      this.formLong.serverType = this.formLong.serverType + '';
      this._type = 'edit';
      this.dialogVisible2 = true;
    },
    del($index,row){
      let that = this;
      this.$confirm('你确定要删除此信息吗, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        closeOnClickModal:false,
        type: 'warning'
      }).then(() => {
        this.$http({
          method:'POST',
          url:host.basic.basicUrl+'/server/deleteServerInfo',
          params:{id:that.tableData[$index].id}
        }).then(function(res){
        let data = res.data;
        if(data.ERRORCODE == '0'){
          that.$message.success('操作成功!');
          that.getIps(1);
        }else{
          that.$message.warning(data.RESULT);
        }},function(error){
          that.$message.error('请求错误,请稍后再试');
        }).catch(() => {});
      }).catch(() => {

      })
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
