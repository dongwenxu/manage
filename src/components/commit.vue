<template>
  <div id="commit">
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
      border
      style="width: 100%;margin-top:15px;">
      <el-table-column
         prop="id"
         label="ID"
         width='80'>
       </el-table-column>
      <el-table-column
         prop="creatTime"
         label="时间">
       </el-table-column>
      <el-table-column
         prop="realName"
         label="用户昵称">
       </el-table-column>
      <el-table-column
         prop="mobile"
         label="用户电话">
       </el-table-column>
       <el-table-column
         label="房间号"
         inline-template>
         <span v-if="row.building && row.building != ''">{{row.building}}幢{{row.houseNum}}</span>
       </el-table-column>
      <el-table-column
         prop="content"
         label="意见">
       </el-table-column>
       <el-table-column
         inline-template
         :context="_self"
         label="操作">
         <span>
           <el-button  @click='_detail($index,row)' type='primary' size="small">查看详情</el-button>
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

    <!-- 修改弹出框 -->
    <el-dialog title="意见详情" v-model="dialogVisible" :close-on-click-modal='false'>
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
      tableData: [],
      totle:0,
      current:1,
      loading:false,
      date_value1:'',
      search_input:'',
      detail:''
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
      let date = this.date_value1;
      let searchStr;
      if(this.searchStr != ''){searchStr = this.search_input}
      if(date != '' && date != undefined){date = host.basic.formatDate(this.date_value1.getTime())}
      this.getIps(val,date,searchStr)
      this.current = val;
    },
    // 获取数据
    getIps(ind,date,searchStr){
      let that = this;
      that.loading = true;
      this.$http({
        method:'POST',
        url:host.basic.basicUrl+'/feedBack/list',
        params:{
          pageNum:ind,date:date,searchStr:searchStr
        }
      }).then(function(res){
        let data = res.data;
        if(data.RESULT.list && data.RESULT.list.length){
          for(let i = 0; i<data.RESULT.list.length; i++){
            data.RESULT.list[i].creatTime = host.basic.formatDate(data.RESULT.list[i].creatTime,2)
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
      let date = this.date_value1;
      let searchStr;
      
      if(this.searchStr != ''){
        searchStr = this.search_input
        searchStr = searchStr.substring(0,2) + '1单元' + searchStr.substring(2,7);
      }
      if(date != '' && date != undefined){date = host.basic.formatDate(this.date_value1.getTime())}
      this.getIps(1,date,searchStr)
    },
    // 重置
    reset(){
      this.search_input='';
      this.date_value1='';
      this.current=1;
      this.getIps(1);
    },
    // 查看详情
    _detail($index,row){
      let that = this;
      this.$http({
        method:'POST',
        url:host.basic.basicUrl+'/feedBack/info',
        params:{
          id:that.tableData[$index].id
        }
      }).then(function(res){
        let data = res.data;
        if(data.ERRORCODE == '0'){
          that.detail = data.RESULT.content
          that.dialogVisible = true;
        }else{
          that.$message.warning(data.RESULT);
        }
      }, function(error){
        that.$message.error('数据获取失败,请稍后再试');
      });
    }
  }
}
</script>

<style lang="less">
  #commit{
    padding-left: 15px;
    padding-right: 15px;
    tr{
      cursor: pointer;
    }
    .screening{
      padding:12px;
      text-align: left;
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
    .textarea{
      textarea{
        background: #fff;
        color:#333
      }
    }
  }
</style>
