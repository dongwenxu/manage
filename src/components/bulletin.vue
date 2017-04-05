<template>
  <div id="bulletin">

    <el-row class="screening">
      <el-select v-model="type_value" placeholder="订单类型" class='select'>
        <el-option
          v-for="item in typeOptions"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>

      <el-date-picker
        v-model="date"
        align="right"
        type="date"
        placeholder="选择日期"
        :picker-options="pickerOptions">
      </el-date-picker>
      <el-button type="primary" v-on:click='search' style='margin-left:12px;'>确定</el-button>
      <el-button type="primary" v-on:click='reset' style='margin-left:12px;'>重置</el-button>
      <el-button type="primary" @click="resetForm" style='float:right'>
        新增公告<i class="el-icon-plus el-icon--right"></i>
      </el-button>
    </el-row>

    <el-table
      :data="tableData"
      v-loading.body="loading"
      border
      style="width: 100%;margin-top:15px;">
      <el-table-column
         prop="createTime"
         label="时间">
       </el-table-column>
  <!--     <el-table-column
         label="类型"
         inline-template>
         <div class="">
           <span v-if='row.type == 0'>短篇公告</span>
           <span v-if='row.type == 1'>长篇通知</span>
         </div>
       </el-table-column> -->
      <el-table-column
         prop="brief"
         label="摘要">
       </el-table-column>
       <el-table-column
         inline-template
         :context="_self"
         label="操作"
         width='200'>
         <span>
           <el-button @click="del($index,row)" type="danger" size="small">删除</el-button>
           <el-button v-if='row.type == 1' @click="_detail($index,row)" type="primary" size="small">详情</el-button>
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
    <el-dialog title="物业公告" v-model="dialogVisible" size="small" :close-on-click-modal='false'>
     <!--  <div class="">
        <el-radio class="radio" v-model="radio" label="0">短篇公告</el-radio>
        <el-radio class="radio" v-model="radio" label="1">长篇通知</el-radio>
      </div> -->
      <div class="" style='margin-top:20px;'>
      <!--   <div class="" v-if="radio == '0'">
          <el-form :model="formShort" :rules="rule" ref="formShort">
            <el-form-item label="摘要" prop="brief">
              <el-input v-model="formShort.brief" placeholder="请输入摘要"></el-input>
            </el-form-item>
          </el-form>
        </div> -->
        <div class="">
          <el-form :model="formLong" :rules="rule" ref="formLong">
            <el-form-item label="标题" prop="brief">
              <el-input v-model="formLong.brief" placeholder="请输入标题"></el-input>
            </el-form-item>
            <el-form-item label="正文" prop="content">
              <el-input  type='textarea' v-model="formLong.content" placeholder='请输入详细公告内容，限1000字'
              :autosize="{ minRows:8}"></el-input>
            </el-form-item>
          </el-form>
        </div>
        <div class="btn-group">
          <el-button type="primary" @click="formSubmit">发布</el-button>
        </div>
      </div>
    </el-dialog>

    <!-- 查看详情 -->
    <el-dialog title="公告详情" v-model="dialogVisible2" :close-on-click-modal='false'>
      <el-input
        type="textarea"
        :autosize="{ minRows: 4, maxRows: 8}"
        v-model="detail"
        :disabled="true"
        class="textarea">
      </el-input>
    </el-dialog>

  </div>
</template>

<script type="text/javascript">
import host from '../config.js'

export default {
  data () {
    return {
      dialogVisible:false,
      dialogVisible2:false,
      detail:'',
      radio: '0',
      tableData: [],
      formShort:{
        brief:'',
      },
      formLong:{
        brief:'',
        content:''
      },
      rule: {
        content:[
          {required: true,message: '请输入内容',trigger: 'blur'},
           { max: 1000, message: '请控制在1000字符内', trigger: 'blur' }
        ],
        brief:[
         { required: true, message: '请输入标题/摘要', trigger: 'blur' },
         { max: 50, message: '请控制在50字符内', trigger: 'blur' }
        ]
      },
      totle:0,
      current:1,
      loading:false,
      date_value1:'',
      date:'',
      typeOptions:[{
        value: '',
        label: '全部'
      },{
        value: '0',
        label: '短篇公告'
      },
      {
        value: '1',
        label: '长篇通知 '
      }],
      type_value:''
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
      let type;let date;
      date = this.date;
      if(this.type_value != ''){type = this.type_value}
      if(date != '' && date != undefined){date = host.basic.formatDate(this.date.getTime())}
      this.getIps(val,type,date)
      this.current = val;
    },
    // 获取数据
    getIps(ind,type,date){
      let that = this;
      that.loading = true;
      this.$http.get(host.basic.basicUrl+'/notice/list',{params:{
        pageNum:ind,type:'',date:date}}).then(function(res){
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
      let type;let date;
      date = this.date;
      if(this.type_value != ''){type = this.type_value}
      if(date != '' && date != undefined){date = host.basic.formatDate(this.date.getTime())}
      this.getIps(1,type,date)
    },
    // 重置
    reset(){
      this.date_value='';
      this.date='';
      this.type_value=''
      this.current=1;
      this.getIps(1);
    },
    // 重置表单
    resetForm(){
      this.dialogVisible = true;
      this.$refs.formShort && this.$refs.formShort.resetFields();
      this.$refs.formLong && this.$refs.formLong.resetFields();
      this.radio = '0';
    },
    // 新增公告
    formSubmit(){
      let that = this;
      let data = this.formLong;
      data.type = this.radio;
      // if(this.radio == '0'){
      //   this.$refs.formShort.validate((valid) => {
      //     if (valid) {
      //       _sub()
      //     } else {
      //       return false;
      //     }
      //   });
      // }else{
        this.$refs.formLong.validate((valid) => {
          if (valid) {
            _sub()
          } else {
            return false;
          }
        })
      function _sub(){
        let oMyForm = new FormData();

        oMyForm.append('type','1');
         oMyForm.append('brief',data.brief);
          oMyForm.append('content',data.content);
        that.$http({
          method:'POST',
          url:host.basic.basicUrl+'/notice/insert',
          body:oMyForm
        }).then(function(res){
          let data = res.data;
          if(data.ERRORCODE == '0'){
            that.$message.success('操作成功');
            that.dialogVisible = false;
            that.getIps(1)
          }
        }, function(error){
          that.$message.error('请求失败,请稍后再试');
        });
      }
    },
    // 删除
    del($index,row){
      let that = this;
      this.$confirm('你确定要删除此公告吗, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        closeOnClickModal:false,
        type: 'warning'
      }).then(() => {
        this.$http.get(host.basic.basicUrl+'/notice/delete',{params:{id:that.tableData[$index].id}
        }).then(function(res){
          let data = res.data;
          if(data.ERRORCODE == '0'){
            that.$message.success('操作成功!');
            that.getIps(1)
          }else{
            that.$message.warning(data.RESULT);
          }
        },function(error){
          that.$message.error('请求错误,请稍后再试');
        })
      }).catch(() => {

      });
    },
    // 查看详情
    _detail($index,row){
      this.detail = this.tableData[$index].content
      this.dialogVisible2 = true;
    }
  }
}
</script>

<style lang="less">
  #bulletin{
    padding-left: 15px;
    padding-right: 15px;
    tr{
      cursor: pointer;
    }
    .screening{
      padding:12px;
      text-align: left;
      .select{
        display:inline-block;
        width: 110px;
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
    .btn-group{
      text-align: right;
    }
    .textarea{
      textarea{
        background: #fff;
        color:#333
      }
    }
  }
</style>
