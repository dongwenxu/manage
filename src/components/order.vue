<template>
  <div id="order">
  <div v-on:keyup.13="search">
      <el-row class="screening">
      <el-select v-model="type_value1" placeholder="订单进程" class='select1'>
        <el-option
          v-for="item in typeOptions1"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>

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
         prop="realName"
         label="用户姓名">
       </el-table-column>
       <el-table-column
         prop="personMobile"
         label="用户电话">
       </el-table-column>
       <el-table-column
         label="房间号"
         inline-template>
         <span v-if="row.building != ''">{{row.building}}幢{{row.houseNum}}</span>
       </el-table-column>
      <el-table-column
         label="订单类型"
         inline-template>
         <div class="">
           <span v-if='row.orderType == 1'>报修</span>
           <span v-if='row.orderType == 2'>家政</span>
           <span v-if='row.orderType == 3'>回收</span>
         </div>
       </el-table-column>
      <el-table-column
         label="维修类型"
         inline-template>
         <div class="">
           <span v-if='row.detailType == 1'>环境卫生</span>
           <span v-if='row.detailType == 2'>园区损坏</span>
           <span v-if='row.detailType == 3'>占车位</span>
           <span v-if='row.detailType == 4'>房屋漏水</span>
           <span v-if='row.detailType == 5'>家电故障</span>
           <span v-if='row.detailType == 6'>闲置回收</span>
           <span v-if='row.detailType == 7'>其它</span>
         </div>
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
        width='200'>
        <span>
          <el-button v-if="row.status == 1" @click='allow($index,row)' type='primary' size="small">分配工单</el-button>
          <el-button v-if="row.status == 2" @click='complete($index,row)' type='success' size="small" >完成工单</el-button>
          <el-button type='primary' size="small" @click='_detail($index,row)' v-if="row.result_type == 1" class="el-button el-button--danger el-button--small">查看详情</el-button>
          <el-button type='primary' size="small" @click='_detail($index,row)' v-if="row.result_type == 0">查看详情</el-button>
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

    <!-- 查看详情 -->
    <el-dialog title="工单详情" v-model="dialogVisible2" :close-on-click-modal='false'>
      <p>工单备注:<span style="display:inline-block; float:right;">{{orderDetail.status}}</span></p>
      <el-input
        type="textarea"
        :autosize="{ minRows: 2, maxRows: 4}"
        v-model="orderDetail.remark"
        :disabled="true"
        class="textarea">
      </el-input>
      <div v-if="orderDetail.resultGrade > 0">
        <p>用户评价:</p>
        <div v-if="orderDetail.resultType != 1">
          <el-rate
            v-model="orderDetail.resultGrade"
            disabled
            show-text
            text-color="#ff9900"
            text-template="{value}">
          </el-rate>
        </div>
        <el-input
          type="textarea"
          :autosize="{ minRows: 2, maxRows: 4}"
          v-model="orderDetail.resultComment"
          :disabled="true"
          class="textarea textarea3">
        </el-input>
      </div>
      <div v-if="orderDetail.imageList.length > 0">
        <p>工单图片(点击查看大图):</p>
        <el-row  class='Img-list'>
          <el-col v-for="(n, index) in orderDetail.imageList" :data-index="index" :span="8">
            <img :src="n" @click="open($event)">
          </el-col>
        </el-row>
      </div>
      <div v-if="orderDetail.audio.length > 0">
        <p>语音消息:</p>
        <audio :src='orderDetail.audio' id="aud" controls="true"></audio>
      </div>
    </el-dialog>

    <!-- 查看详情 -->
    <el-dialog  v-model="Big" size='large' id="large">
      <img :src="BigUrl"/>
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
      Big:false,
      BigUrl:'',
      tableData: [],
      orderDetail:{
        resultGrade:0,
        resultComment:'',
        resultType:0,
        status:0,
        result_type:0,
        remark:'',
        imageList:[],
        audio:'http://streamrdt.music.qq.com/3165.3b17d5ecf4b6443beb2b7f057b62a7db/0/a.mp3'
      },
      totle:0,
      current:1,
      loading:false,
      date:'',
      typeOptions:[{
        value: '0',
        label: '全部'
      },{
        value: '1',
        label: '报修'
      },
      {
        value: '2',
        label: '家政'
      },
      {
        value: '3',
        label: '回收'
      }],
      type_value:'',
      typeOptions1:[{
        value: '0',
        label: '全部'
      },{
        value: '1',
        label: '未分配'
      },{
        value: '2',
        label: '处理中'
      },{
        value: '3',
        label: '已处理'
      },{
        value: '4',
        label: '完成评价'
      }],
      type_value1:'',
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
          obj.label = data.RESULT[i].name +'('+data.RESULT[i].orderNum+')';
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
    open(e){
      this.BigUrl = e.target.src;
      this.Big = true;
    },
    handleCurrentChange(val) {
      let status;let type;let date;let searchStr;
      if(this.type_value1 != ''){status = this.type_value1}
      if(this.type_value != ''){type = this.type_value}
      if(this.date != ''){date = this.date}
      if(this.searchStr != ''){searchStr = this.search_input}
      if(date != '' && date != undefined){date = host.basic.formatDate(this.date.getTime())}
      this.getIps(val,status,type,date,searchStr)
      this.current = val;
    },
    // 获取订单
    getIps(ind,status,type,date,searchStr){
      let that = this;
      that.loading = true;
      this.$http({
        method:'POST',
        url:host.basic.basicUrl+'/workOrder/list',
        params:{
          pageNum:ind,status:status,type:type,date:date,searchStr:searchStr
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
      let status;let type;let date;
      let searchStr = this.search_input;
      
      if(this.type_value1 != ''){status = this.type_value1}
      if(this.type_value != ''){type = this.type_value}
      if(this.date != ''){date = this.date}
      if(this.search_input != ''){
        searchStr = searchStr.length > 1 ? searchStr.substring(0,2) + '1单元' + searchStr.substring(2,7) : ''
        // searchStr = searchStr.substring(0,2) + '1单元' + searchStr.substring(2,7);
      }
      if(date != '' && date != undefined){date = host.basic.formatDate(this.date.getTime())}
      this.getIps(1,status,type,date,searchStr)
    },
    // 重置
    reset(){
      this.search_input='';
      this.date='';
      this.type_value='';
      this.type_value1='';
      this.current=1;
      this.getIps(1);
    },
    // 分配订单
    allow($index,row){
      this.dialogVisible = true;
      this.person_value = '';
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
          that.getIps(1);
          that.fetchData()
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
    },
    // 查看详情
    _detail($index,row){
      let that = this;
      this.$http({
        method:'POST',
        url:host.basic.basicUrl+'/workOrder/selectById',
        params:{
          id:that.tableData[$index].orderId,
        }
      }).then(function(res){
        let data = res.data;
        if(data.ERRORCODE == '0'){
          that.orderDetail.remark = data.RESULT.orderRemark;
          that.orderDetail.resultGrade = data.RESULT.resultGrade;
          that.orderDetail.resultComment = data.RESULT.resultComment;
          that.orderDetail.resultType = data.RESULT.resultType;
          that.orderDetail.status = data.RESULT.status;
          switch (that.orderDetail.status) {
            case 1:
              that.orderDetail.status = '未分配'
              break;
            case 2:
              that.orderDetail.status = '处理中'
              break;
            case 3:
              that.orderDetail.status = '已处理'
              break;
            case 4:
              that.orderDetail.status = '已完成'
              break;  
          }
          let target = data.RESULT.mediaList;
          if(target && target.length){
            that.orderDetail.imageList = [];
            that.orderDetail.audio = ''
            let arr = [];
            for(let i = 0; i < target.length; i++){
              if(target[i].type == 'jpg'){arr.push(target[i].url)}
              if(target[i].type == 'amr'){that.orderDetail.audio = target[i].url}
            }
            that.orderDetail.imageList = arr;
          }else{
            that.orderDetail.imageList = [];
            that.orderDetail.audio = ''
          }
          that.dialogVisible2 = true;
        }else{
          that.$message.error(data.RESULT);
        }
      }, function(error){
        that.$message.error('请求失败,请稍后再试');
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

<style lang="less">
  #order{
    padding: 15px;
    .textarea3{
      margin-top: 10px;
    }
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
    .textarea{
      textarea{
        background: #fff;
        color:#333
      }
    }
    .Img-list{
      img{
        height: 100%;
        width: 100%;
        max-height: 150px;
      }
    }
    #large{
      .el-dialog--large{
        top:0!important;
      }
      .el-dialog__body{
        text-align: center;
      }
      img{
        width: 100%;
        height: 100%;
      }
    }
  }
</style>
