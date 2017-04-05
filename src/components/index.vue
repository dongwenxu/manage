<template>
  <div id="first" >
    <div v-on:keyup.13="search">
        <el-row class="screening">
           <el-date-picker
              v-model="date"
              align="right"
              type="date"
              placeholder="选择日期"
              :picker-options="pickerOptions">
            </el-date-picker>
             <el-input class='inp'
              placeholder="请按照 x幢xxxx的格式填写"
              v-model="search_input" >
              </el-input>  
            <el-button type="primary" v-on:click='search' style='margin-left:12px;' >确定</el-button>
            <el-button type="primary" v-on:click='reset' style='margin-left:12px;'>刷新</el-button>
        </el-row>
    </div>
  
    <el-table
      :data="tableData"
      v-loading.body="loading"
      stripe
      border
      @selection-change="handleSelectionChange"
      style="width: 100%;margin-top:15px;">
      <el-table-column
        type="selection"
        width="55">
      </el-table-column>
      <el-table-column
        prop="createTime"
        label="申请日期">
      </el-table-column>
      <el-table-column
        prop="realName"
        label="姓名">
      </el-table-column>
      <el-table-column
        label="类型"
        inline-template>
        <div class="">
          <span v-if='row.type == 0'>业主</span>
          <span v-if='row.type == 1'>租客</span>
          <span v-if='row.type == 2'>员工</span>
          <span v-if='row.type == 3'>其他</span>
        </div>
      </el-table-column>
      <el-table-column
        prop="mobile"
        label="用户电话">
      </el-table-column>
      <el-table-column
        label="房间号"
        inline-template>
        <span v-if="row.building != ''">{{row.building}}幢{{row.houseNum}}</span>
      </el-table-column>
      <el-table-column
        prop="ownerName"
        label="业主姓名">
      </el-table-column>
      
      <el-table-column
        prop="ownerMobile"
        label="业主手机">
      </el-table-column>
       <el-table-column
        prop="initialWater"
        label="水初始值">
      </el-table-column>
       <el-table-column
        prop="initialElectric"
        label="电初始值">
      </el-table-column>
      <el-table-column
        prop="verifyStatus"
        label="状态"
        inline-template>
        <div class="">
          <span v-if='row.verifyStatus == 0' class='disabled'>未认证</span>
          <span v-if='row.verifyStatus == 1'>认证中</span>
          <span v-if='row.verifyStatus == 2'>已认证</span>
        </div>
      </el-table-column>
      <el-table-column
        inline-template
        :context="_self"
        label="操作"
        width="160">
        <span>
          <el-button v-if='row.verifyStatus != 2' @click="freeze($index,row)" type="primary" size="small">通过</el-button>
          <el-button v-if='row.verifyStatus != 2' @click="unfreeze($index,row)" type="danger"  size="small">不通过</el-button>
          <el-button v-if='row.verifyStatus == 2' @click="unfreeze($index,row)" type="danger" size="small">删除</el-button>
          <el-button v-if='row.verifyStatus == 2 && row.type != 0' @click="edit($index,row)" type="primary" size="small">修改</el-button>
        </span>
      </el-table-column>
    </el-table>

    <div class="block bottom">
      <el-button  type="primary" style='float:left' @click='delAll'>删除所选</el-button>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="current"
        layout="total,prev, pager, next, jumper"
        :total="totle">
      </el-pagination>
    </div>

    <!-- 修改弹出框 -->
    <el-dialog title="修改用户信息" v-model="dialogVisible" :close-on-click-modal='false'>
      <el-form :model="userForm" :rules="rules" ref="userForm" label-width="150px" class="ruleForm">
        <el-form-item label="姓名" prop="nickName">
          <el-input v-model="userForm.nickName" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="userForm.mobile" :disabled="true"></el-input>
        </el-form-item>
        <!-- <el-form-item label="幢" prop="building">
          <el-input v-model="userForm.building"></el-input>
        </el-form-item>
        <el-form-item label="单元" prop="unit">
          <el-input v-model="userForm.unit"></el-input>
        </el-form-item>
        <el-form-item label="房间号" prop="houseNum">
          <el-input v-model="userForm.houseNum"></el-input>
        </el-form-item> -->
        <el-form-item label="幢" prop="building">
          <el-select v-model="userForm.building" placeholder="请选择幢" @change='_bchange()'>
            <el-option
              v-for="item in o_building"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
      <!--   <el-form-item label="单元" prop="unit">
          <el-select v-model="userForm.unit" placeholder="请选择单元" @change='_uchange()' :disabled='disU'>
            <el-option
              v-for="item in o_unit"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item> -->
        <el-form-item label="房间号" prop="houseNum">
          <el-select v-model="userForm.houseNum" placeholder="请选择房间号" :disabled='disH'>
            <el-option
              v-for="item in o_houseNum"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
       <el-form-item label="水-初始值" prop="building">
          <el-input v-model="userForm.initialWater"></el-input>
        </el-form-item>
        <el-form-item label="电-初始值" prop="unit">
          <el-input v-model="userForm.initialElectric"></el-input>
        </el-form-item> 
        <el-form-item>
          <el-button type="primary" @click="editSubmit">确认修改</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script type="text/javascript">
import host from '../config.js'

export default {
  // 判断是否登录
  beforeRouteEnter (to, from, next) {
    let val = sessionStorage.getItem('xunLogin');
    val ? next() : next({path: '/login'});
  },
  data () {
    return {
      tableData: [],
      totle:0,
      current:1,
      loading:true,
      date:'',
      type_value:'0',
      search_input:'',
      multipleSelection:[],
      dialogVisible:false,
      userForm:{
        id:'',
        realName:'',
        mobile:'',
        building:null,
        unit:null,
        houseNum:null,
        initialElectric:0,
        initialWater:0
      },
      o_building:[],
      o_unit:[],
      o_houseNum:[]
    }
  },
  mounted(){
    this.getIps(1)
    this.fetchBuilding()
  },
  methods: {
    // checkbox
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
    },
    // 分页回调
    handleCurrentChange(val) {
      let val1 = this.date;
      if(val1 != '' && val1 != undefined){val1 = host.basic.formatDate(this.date.getTime())}
      this.getIps(val,this.search_input,val1);
      this.current = val;
    },
    //  获取数据
    getIps(ind,inp,date1){
      let that = this;
      that.loading = true;
      this.$http.get(host.basic.basicUrl+'/person/list',{params:{
        pageNum:ind,date:date1,searchStr:inp
      }}).then(function(res){
        let data = res.data;
        if(data.RESULT.list && data.RESULT.list.length){
          for(let i = 0; i<data.RESULT.list.length; i++){
            data.RESULT.list[i].createTime = host.basic.formatDate(data.RESULT.list[i].createTime,2)
          }
        }
        that.tableData = data.RESULT.list;
        that.totle = data.RESULT.total;
        that.loading = false
      }, function(error){
        that.$message.error('数据获取失败,请稍后再试');
        that.loading = false
      });
    },
    // 搜索
 
    search(){
      let val1 = this.date;
      if(val1 != '' && val1 != undefined){val1 = host.basic.formatDate(this.date.getTime())}
      let _input = this.search_input;
      _input = _input.length > 1 ? _input.substring(0,2) + '1单元' + _input.substring(2,7) : ''
      // _input = _input.substring(0,2) + '1单元' + _input.substring(2,7);
      this.getIps(1,_input,val1);
    },
    // 重置
    reset(){
      this.search_input='';
      this.date='';
      this.current = 1;
      this.getIps(1);
    },
    // 通过
    freeze($index,row){
      let id = this.tableData[$index].id;
      let that = this;
      this.$confirm('你确定要通过此用户吗, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        closeOnClickModal:false,
        type: 'success'
      }).then(() => {
        that.$http({
          method:'POST',
          url:host.basic.basicUrl+'/person/pass',
          params:{id:id}
        }).then(function(res){
          let data = res.data;
          if(data.ERRORCODE == '0'){
            that.tableData[$index].verifyStatus = 2;
            that.$message.success('操作成功!');
          }else{
            that.$message.warning(data.RESULT);
          }
        },function(error){
          that.$message.error('请求错误,请稍后再试');
        })
      }).catch(() => {});
    },
    // 不通过
    unfreeze($index,row){
      let vid = this.tableData[$index].id;
      let that = this;
      this.$confirm('你确定要删除此用户吗, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        closeOnClickModal:false,
        type: 'success'
      }).then(() => {
        that._del(vid)
      }).catch(() => {

      })
    },
    // 编辑
    edit($index,row){
      let obj = host.basic.clone(this.tableData[$index]);
      obj.unit = null;
      obj.houseNum = null;
      obj.building = null;
      this.userForm = obj;
      this.userForm.type = this.userForm.type + '';
      this.fetchBuilding()
      this.dialogVisible = true;
    },
    editSubmit(){
      let that = this;
      let data = that.userForm;

      delete data.verifyStatus;
      delete data.createTime;
      delete data.gender;
      delete data.realName;
      delete data.ownerName;
      delete data.houseType;
      delete data.ownerMobile;
      delete data.type;
      delete data.area;
      delete data.nickName;
      delete data.ownerIdNumber;
      delete data.mobile;
      // data.initialElectric = 0,
      // data.initialWater = 0,
      data.unit = 1;
      console.log(data);
      that.$http({
        method:'POST',
        url:host.basic.basicUrl+'/person/update',
        params:that.userForm
      }).then(function(res){
        let data = res.data;
        if(data.ERRORCODE == '0'){
          that.$message.success('操作成功!');
          that.dialogVisible = false;
          that.getIps(1)
        }else{
          that.$message.warning(data.RESULT);
        }
        },function(error){
          that.$message.error('请求错误,请稍后再试');
        }).catch(() => {});
    },
    _del(str){
      let that = this;
      this.$http.get(host.basic.basicUrl+'/person/delete',{params:{ids:str}
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
    },
    delAll(){
      let str = '';
      let target = this.multipleSelection;
      if(target.length < 1){
        this.$message.warning('请选择所需删除项');
        return false
      }
      let that = this;
      this.$confirm('你确定要删除此用户吗, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        closeOnClickModal:false,
        type: 'warning'
      }).then(() => {
        if(target && target.length){
          for(let i = 0; i < target.length; i++){
            str += (',' + target[i].id)
          }
          str = str.substring(1,);
          that._del(str)
        }else{
          that.$message.warning('请选择所需删除项');
        }
      }).catch(() => {

      })
    },
    _bchange(){
      if(this.userForm.building == null){
        return false
      }
      // this.fetchUnit()
      this.fetchHouse()
    },
    // _uchange(){
    //   if(this.userForm.building == null || this.userForm.unit == null){
    //     return false
    //   }
    //   this.fetchHouse()
    // },
    fetchBuilding(){
      let that = this;
      this.$http.get(host.basic.basicUrl+'/housesInfo/buildingInfo',{params:{
        type:1}}).then(function(res){
        let data = res.data;
        if(data.ERRORCODE == '0' && data.RESULT.length){
          let res = data.RESULT;
          res = res.map( item => {return {value:item+'',label:item+'幢'}})
          that.o_building = res;
        }
      }, function(error){
        that.$message.error('获取房间数据异常,请稍后再试');
      });
    },
    // fetchUnit(){
    //   let that = this;
    //   this.$http.get(host.basic.basicUrl+'/housesInfo/buildingInfo',{params:{
    //     type:2,building:that.userForm.building}}).then(function(res){
    //     let data = res.data;
    //     if(data.ERRORCODE == '0' && data.RESULT.length){
    //       let res = data.RESULT;
    //       res = res.map( item => {return {value:item+'',label:item+'单元'}})
    //       that.o_unit = res;
    //       if(that.userForm.unit != null){that.userForm.unit = ''};
    //       if(that.userForm.houseNum != null){that.userForm.houseNum = ''};
    //     }
    //   }, function(error){
    //     that.$message.error('获取房间数据异常,请稍后再试');
    //   });
    // },
    fetchHouse(){
      let that = this;
      this.$http.get(host.basic.basicUrl+'/housesInfo/buildingInfo',{params:{
        type:3,building:that.userForm.building,unit:1}}).then(function(res){
        let data = res.data;
        if(data.ERRORCODE == '0' && data.RESULT.length){
          let res = data.RESULT;
          res = res.map( item => {return {value:item+'',label:item+'室'}})
          that.o_houseNum = res;
          if(that.userForm.houseNum != null){that.userForm.houseNum = ''};
        }
      }, function(error){
        that.$message.error('获取房间数据异常,请稍后再试');
      });
    }
  }
}
</script>

<style scoped lang="less">
  #first{
    padding-left: 15px;
    padding-right: 15px;
    .screening{
      padding:12px;
      text-align: left;
      .select{
        display:inline-block;
        width: 120px;
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
