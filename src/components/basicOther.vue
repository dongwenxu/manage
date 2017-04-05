<template>
  <div id="basicOther">

    <el-row class="screening">
      <el-input class='inp'
        placeholder="搜索房间号请按照 x幢x单元xxxx的格式填写"
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
         prop="orderId"
         label="工单号">
       </el-table-column>
      <el-table-column
         prop="createTime"
         label="订单日期">
       </el-table-column>
       <el-table-column
         prop="nickName"
         label="用户昵称">
       </el-table-column>
       <el-table-column
         prop="personMobile"
         label="用户电话">
       </el-table-column>
       <el-table-column
         label="房间号"
         inline-template>
         <span v-if="row.building != ''">{{row.building}}幢{{row.unit}}单元{{row.houseNum}}</span>
       </el-table-column>
      <el-table-column
         prop="orderRemark"
         label="订单详情">
       </el-table-column>
       <el-table-column
         label="订单进程"
         inline-template>
         <div class="">
           <span v-if="row.status == 1" class='disabled'>未分配</span>
           <span v-else-if="row.status == 2">处理中</span>
           <span v-else-if="row.status == 3">已处理</span>
           <span v-else-if="row.status == 4">完成评价</span>
         </div>
       </el-table-column>
       <el-table-column
         prop="wuyePersonName"
         label="物业员工">
       </el-table-column>
       <el-table-column
         prop="jobNumber"
         label="员工号">
       </el-table-column>
       <el-table-column
         prop="wuyePersonMobile"
         label="员工电话号">
       </el-table-column>
      <el-table-column
        inline-template
        :context="_self"
        label="操作"
        width='110'>
        <span>
          <el-button v-if="row.status == 1" @click='allow($index,row)' type='primary' size="small">分配工单</el-button>
          <el-button v-if="row.status == 2" @click='complete($index,row)' type='success' size="small">完成工单</el-button>
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

    <!-- 分配订单 -->
    <el-dialog title="分配订单" v-model="dialogVisible" size="tiny">
      <el-select v-model="person_value" placeholder="请选择员工" class='select'>
        <el-option
          v-for="item in personOption"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
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
      personOption:[],
      person_value:'',
      search_input:'',
      _index:''
    }
  },
  mounted(){
    this.getIps(1)

    // 获取员工的下拉列表
    let that = this;
    this.$http({
      method:'POST',
      url:host.basic.basicUrl+'/wuyePerson/dropDown'
    }).then(function(res){
      let data = res.data;
      if(data.ERRORCODE == '0' && data.RESULT && data.RESULT.length){
        for(let i = 0; i<data.RESULT.length; i++){
          let obj = {};
          obj.value = data.RESULT[i].id;
          obj.label = data.RESULT[i].name;
          that.personOption.push(obj);
        }
      }
    }, function(error){
      that.$message.error('获取员工下拉列表失败');
    });
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
      this.$http({
        method:'POST',
        url:host.basic.basicUrl+'/workOrder/list',
        params:{
          pageNum:ind,type:3,date:date,searchStr:searchStr
        }
      }).then(function(res){
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
    // 分配订单
    allow($index,row){
      this.dialogVisible = true;
      this._index = $index;
    },
    allowSub(){
      let index = this._index;
      let that = this;

      this.$http({
        method:'POST',
        url:host.basic.basicUrl+'/workOrder/distribute',
        params:{
          orderId:that.tableData[index].orderId,
          wuyePersonId:that.person_value
        }
      }).then(function(res){
        let data = res.data;
        if(data.ERRORCODE == '0'){
          that.$message.success('分配成功');
          that.dialogVisible = false;
          that.getIps(1)
        }
      }, function(error){
        that.$message.error('请求失败,请稍后再试');
      });
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
          url:host.basic.basicUrl+'/workOrder/finish',
          params:{
            orderId:that.tableData[$index].orderId,
          }
        }).then(function(res){
          let data = res.data;
          if(data.ERRORCODE == '0'){
            that.$message.success('操作成功');
            that.dialogVisible = false;
            that.tableData[$index].status = 3;
          }
        }, function(error){
          that.$message.error('请求失败,请稍后再试');
        });
      })
    }
  }
}
</script>

<style scoped lang="less">
  #basicOther{
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
  }
</style>
