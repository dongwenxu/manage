<template>
  <div id="owner">
    <div v-on:keyup.13="search">
       <el-row class="screening">
        <el-input class='inp'
          placeholder="请按照 x幢xxxx的格式填写"
          v-model="search_input">
        </el-input>

        <el-button type="primary" v-on:click='search' style='margin-left:12px;'>确定</el-button>
        <el-button type="primary" v-on:click='reset' style='margin-left:12px;'>刷新</el-button>
        <el-button type="primary" @click="addOwner" style='float:right'>
          新增业主<i class="el-icon-plus el-icon--right"></i>
        </el-button>
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
        width="40">
      </el-table-column>
      <el-table-column
        prop="ownerName"
        label="	业主名称">
      </el-table-column>
       <el-table-column
        label="住户类型"
        inline-template>
        <span>
          <span v-if="row.houseType == 1">住户</span>
          <span v-if="row.houseType == 2">商户</span>
        </span>
      </el-table-column>
      <el-table-column
        prop="ownerIdNumber"
        label="业主身份证号">
      </el-table-column>
      <el-table-column
        prop="ownerMobile"
        label="业主手机">
      </el-table-column>
      <el-table-column
        label="房间号"
        inline-template>
        <span v-if="row.building != ''">{{row.building}}幢{{row.houseNum}}</span>
      </el-table-column>
      <el-table-column
        prop="area"
        label="占地面积(平方米)">
      </el-table-column>
      <el-table-column
        inline-template
        :context="_self"
        label="操作">
        <span>
          <el-button @click="edit($index,row)" type="primary" size='small'>修改</el-button>
          <el-button @click="del($index,row)" type="danger" size='small'>删除</el-button>
        </span>
      </el-table-column>
    </el-table>

    <div class="block bottom">
      <el-button  type="primary" style='float:left' @click="multiDel($index,row)">删除所选</el-button>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="current"
        layout="total,prev, pager, next, jumper"
        :total="totle">
      </el-pagination>
    </div>

    <!-- 修改弹出框 -->
    <el-dialog title="业主信息" v-model="dialogVisible" :close-on-click-modal='false'>
      <el-form :model="ownForm" :rules="rules" ref="ownForm" label-width="140px" class="ruleForm">
        <el-form-item label="用户名称" prop="ownerName">
          <el-input v-model="ownForm.ownerName" placeholder="如:张三"></el-input>
        </el-form-item>
         <el-form-item label="住户类型" prop="ownerName">
           <el-select v-model="ownForm.houseType" placeholder="请选择" >
              <el-option
                v-for="item in houseTypes"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
        </el-form-item>
        
        </el-form-item>
        <el-form-item label="手机号" prop="ownerMobile">
          <el-input v-model="ownForm.ownerMobile" placeholder="如:188888888888"  :disabled="dis"></el-input>
        </el-form-item>
        <el-form-item label="证件号" prop="ownerIdNumber">
          <el-input v-model="ownForm.ownerIdNumber" placeholder="如:33032145874125410x"></el-input>
        </el-form-item>
        <el-form-item label="幢" prop="building">
          <el-input v-model="ownForm.building" placeholder="如:3"></el-input>
        </el-form-item>
     <!--    <el-form-item label="单元" prop="unit">
          <el-input v-model="ownForm.unit" placeholder="如:2"></el-input>
        </el-form-item> -->
        <el-form-item label="房间号" prop="houseNum">
          <el-input v-model="ownForm.houseNum" placeholder="如:2"></el-input>
        </el-form-item>
        <el-form-item label="占地面积(平方米)" prop="area">
          <el-input v-model="ownForm.area" placeholder="如:80" :disabled="dis"></el-input>
        </el-form-item>
        <el-form-item style="text-align:right">
          <el-button type="primary" v-if="type == 'add'" @click="ownSubmit">确认新增</el-button>
          <el-button type="primary" v-if="type == 'edit'" @click="ownSubmit">确认修改</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script type="text/javascript">
import host from '../config.js'

export default {
  data () {
    return {
      tableData: [],
      totle:0,
      current:1,
      type:'add',
      loading:true,
      dis:false,
      search_input:'',
      multipleSelection:[],
      dialogVisible:false,
      houseTypes:[{
          value: '1',
          label: '住户'
        }, {
          value: '2',
          label: '商户'
        }],
      ownForm:{
        ownerName:'',
        ownerMobile:'',
        ownerIdNumber:'',
        building:null,
        unit:1,
        houseNum:null,
        // houseTypes:[{
        //   value: '1',
        //   label: '住户'
        // }, {
        //   value: '2',
        //   label: '商户'
        // }],
        houseType:'',
        _houseType:'',
        area:null,
      },
      ownForm1:{
        ownerName:'',
        ownerMobile:'',
        ownerIdNumber:'',
        building:null,
        unit:1,
        houseNum:null,
        // houseTypes:[{
        //   value: '1',
        //   label: '住户'
        // }, {
        //   value: '2',
        //   label: '商户'
        // }],
        houseType:''
      },
      rules:{
        ownerName: [
         { required: true,validator: host.basic.checkName,trigger: 'blur' }
       ],
        ownerMobile: [
         { required: true, validator: host.basic.checkMobile, message: '请输入正确的用户手机号', trigger: 'blur' }
       ],
       //  ownerIdNumber: [
       //   { required: true, validator: host.basic.checkCard , trigger: 'blur' }
       // ],
        building: [
         { required: true, message: '请输入幢', trigger: 'blur' },
         { validator: host.basic.checkNum, trigger: 'blur' }
       ],
       //  area: [
       //   { required: true, message: '请输入面积', trigger: 'blur' },
       //   { validator: host.basic.checkNum11, trigger: 'blur' }
       // ],
        houseNum: [
         { required: true, message: '请输入房间号', trigger: 'blur' },
         { validator: host.basic.checkNum, trigger: 'blur' }
       ],
       //  area: [
       //   { required: true, message: '面积不能为空', trigger: 'blur' },
       //   { validator: host.basic.checkNum11, trigger: 'blur' }
       // ]
      }
    }
  },
  mounted(){
    this.getIps(1)
  },
  methods: {
    // checkbox回调
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    // 删除 所选
    multiDel(){
      let target = this.multipleSelection;
      if(target.length < 1){
        this.$message.warning('请选择所需删除项');
        return false
      }
      let str = '';
      for(let i = 0; i < target.length; i++){
        str += ','+target[i].id;
      }
      str = str.substring(1,);
      this._del(str)
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
    },
    // 分页回调
    handleCurrentChange(val) {
      let val1 = this.date_value1;
      if(val1 != '' && val1 != undefined){val1 = host.basic.formatDate(this.date_value1.getTime())}
      this.getIps(val,this.search_input,val1);
      this.current = val;
    },
    //  获取数据
    getIps(ind,searchStr){
      let that = this;
      that.loading = true;
      this.$http.get(host.basic.basicUrl+'/housesInfo/list',{params:{
        pageNum:ind,searchStr:searchStr}}).then(function(res){
        let data = res.data;
        that.tableData = data.RESULT.list;

        that.totle = data.RESULT.total;
        for (var i = 0; i < that.tableData.length; i++) {
          this.tableData[i].area = this.tableData[i].area/100;
          // if(that.tableData[i].houseType == 1){
          //   that.tableData[i]._houseType = '住户'
          //   // that.tableData[i].houseType = '住户'
          // }else{
          //   that.tableData[i]._houseType = '商户'
          //   // that.tableData[i].houseType = '商户'
          // }
        };
        that.loading = false
      }, function(error){
        that.$message.error('数据获取失败,请稍后再试');
        that.loading = false
      });
    },
    // 搜索
    search(){
      let _input = this.search_input;
      _input = _input.substring(0,2) + '1单元' + _input.substring(2,7);
      this.getIps(1,_input);
    },
    // 重置
    reset(){
      this.search_input='';
      this.current = 1;
      this.getIps(1);
    },
    // 编辑
    edit($index,row){
      this.$refs.ownForm && this.$refs.ownForm.resetFields();
      this.ownForm = host.basic.clone(this.tableData[$index]);
      this.ownForm.building = this.ownForm.building + '';
      this.ownForm.unit = this.ownForm.unit + '';
      this.ownForm.houseNum = this.ownForm.houseNum + '';
      // this.ownForm.area = this.ownForm.area/100 + '';
      if(this.ownForm.houseType == 1){
        this.ownForm.houseType = '住户';
      }else if(this.ownForm.houseType == 2){
        this.ownForm.houseType = '商户';
      }else{
        this.ownForm.houseType='';
      }
      this.type = 'edit';
      this.dis = true;
      this.dialogVisible = true;
    },
    // 删除
    del($index,row){
      let that = this;
      this._del(this.tableData[$index].id)
    },
    // 删除的方法
    _del(ids){
      let that = this;
      this.$confirm('你确定要删除选中的业主吗, 是否继续?', '删除', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        closeOnClickModal:false,
        type: 'warning'
      }).then(() => {
        this.$http({
          method:'POST',
          url:host.basic.basicUrl+'/housesInfo/delete',
          params:{
            ids:ids
          }
        }).then(function(res){
          let data = res.data;
          if(data.ERRORCODE == '0'){
            that.$message.success('操作成功');
            that.getIps(1)
          }else{
            that.$message.warning(data.RESULT);
          }
        }, function(error){
          that.$message.error('请求失败');
        });
      }).catch(() => {});
    },
    // 点击新增业主
    addOwner(){
      this.type = 'add';
      this.$refs.ownForm && this.$refs.ownForm.resetFields();
      // this.houseType = '';
      this.ownForm.ownerName='';
      this.ownForm.building='';
      this.ownForm.houseNum='';
      this.ownForm.houseType='';
      this.ownForm.ownerIdNumber='';
      this.ownForm.ownerMobile='';
      this.ownForm.area='';
      this.dis = false;
      this.dialogVisible = true;
      // this.ownForm.houseType == '住户' ? this.ownForm.houseType = 1 : this.ownForm.houseType = 2

    },
    // 新增业主提交
    ownSubmit(){
      // add为新增  edit为编辑
      this.ownForm.area=this.ownForm.area*100;
      let that = this;
      this.$refs.ownForm.validate((valid) => {
        if (valid) {
          if(that.type == 'add'){
            this.$http({
              method:'POST',
              url:host.basic.basicUrl+'/housesInfo/insert',
              params:that.ownForm
            }).then(function(res){
              let data = res.data;
              if(data.ERRORCODE == '0'){
                that.$message.success('操作成功');
                that.dialogVisible = false;
                that.getIps(this.current)
              }else{
                that.$message.warning(data.RESULT);
              }
            }, function(error){
              that.$message.error('请求失败');
            });
          }
          else if(that.type == 'edit'){
           if(typeof(this.ownForm.houseType) == 'string' && this.ownForm.houseType == '住户'){
              that.ownForm.houseType = 1;
           }else if(typeof(this.ownForm.houseType) == 'string' && this.ownForm.houseType == '商户'){
              that.ownForm.houseType = 2;
           }
            this.ownForm1.ownerName= this.ownForm.ownerName;
            this.ownForm1.building=this.ownForm.building;
            this.ownForm1.houseNum=this.ownForm.houseNum;
            this.ownForm1.houseType=this.ownForm.houseType;
            this.ownForm1.ownerIdNumber=this.ownForm.ownerIdNumber;
            this.ownForm1.ownerMobile=this.ownForm.ownerMobile;
            this.ownForm1.id=this.ownForm.id;
            this.$http({
              method:'POST',
              url:host.basic.basicUrl+'/housesInfo/update',
              params:this.ownForm1
            }).then(function(res){
              let data = res.data;
              if(data.ERRORCODE == '0'){
                that.$message.success('操作成功');
                that.dialogVisible = false;
                that.getIps(this.current)
              }else{
                that.$message.warning(data.RESULT);
              }
              that.type == 'add';
            }, function(error){
              that.$message.error('请求失败');
              that.type == 'add';
            });
          }
        } else {
          that.$message.warning('部分信息输入有误');
          return false;
        }
      });
    }
  }
}
</script>

<style scoped lang="less">
  #owner{
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
  }
</style>
