<template>
  <div id="plot">

    <section>
      <el-table
        :data="tableData"
        v-loading.body="loading"
        @selection-change="handleSelectionChange"
        stripe border>
        <el-table-column
          type="selection"
          width="55">
        </el-table-column>
        <el-table-column
          prop="name"
          label="名称">
        </el-table-column>
        <el-table-column
          prop="jobNumber"
          label="工号">
        </el-table-column>
        <el-table-column
          prop="mobile"
          label="联系电话">
        </el-table-column>
        <el-table-column
          prop="job"
          label="职位">
        </el-table-column>
        <el-table-column
          label="性别"
          inline-template>
          <div class="">
            <span v-if='row.gender == 1'>男</span>
            <span v-if='row.gender == 2'>女</span>
            <span v-if='row.gender == 0'>未知</span>
          </div>
        </el-table-column>
        <el-table-column
          label="部门"
          inline-template>
          <div class="">
            <span v-if='row.department == 0'>家政</span>
            <span v-if='row.department == 1'>维修</span>
            <span v-if='row.department == 9'>其他</span>
          </div>
        </el-table-column>
        <el-table-column
          inline-template
          :context="_self"
          label="编辑"
          width="160">
          <span>
            <el-button @click="edit($index,row)"  type="primary" size='small'>编辑</el-button>
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
      <div class="bottom-btn">
        <el-button class='uploadBtn' type="primary" @click="_add()">添加员工
          <i class="el-icon-plus el-icon--right"></i>
        </el-button>
      </div>
    </section>

   <!-- 物业基本信息弹出框 -->
   <el-dialog title="员工信息" v-model="dialogVisible" :close-on-click-modal='false'>
     <el-form :model="firstForm" :rules="firstRules" ref="firstForm" label-width="100px">
       <el-form-item label="姓名" prop="name">
         <el-input v-model="firstForm.name" placeholder="如:张三"></el-input>
       </el-form-item>
       <el-form-item label="手机号码" prop="mobile">
         <el-input v-model="firstForm.mobile" placeholder="如:18888888888"></el-input>
       </el-form-item>
       <el-form-item label="员工编号" prop="jobNumber">
         <el-input v-model="firstForm.jobNumber" placeholder="不超过10位,英文或数字"></el-input>
       </el-form-item>
       <el-form-item label="性别" prop="gender">
        <el-select v-model="firstForm.gender" placeholder="请选择性别">
          <el-option label="未知" value='0'></el-option>
          <el-option label="男" value="1"></el-option>
          <el-option label="女" value="2"></el-option>
        </el-select>
      </el-form-item>
       <el-form-item label="部门" prop="department">
          <el-select v-model="firstForm.department" placeholder="请选择部门">
            <el-option label="家政" value="0"></el-option>
            <el-option label="维修" value="1"></el-option>
            <el-option label="其他" value="9"></el-option>
          </el-select>
        </el-form-item>
       <el-form-item label="职位" prop="job">
         <el-input v-model="firstForm.job" placeholder="如:维修"></el-input>
       </el-form-item>
       <el-form-item style="text-align:right">
         <el-button type="primary" v-if="type == 'add'" @click="addSubmit">确认新增</el-button>
         <el-button type="primary" v-if="type == 'edit'" @click="addSubmit">确认修改</el-button>
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
      loading:false,
      multipleSelection:[],
      dialogVisible:false,
      type:'add',
      firstForm:{
        name:'',
        mobile:'',
        jobNumber:'',
        job:'',
        gender:'0',
        department:'9'
      },
      firstRules:{
        name: [
         { required: true, message: '请输入用户名称', trigger: 'blur' }
       ],
        mobile: [
         { required: true, message: '请输入用户手机号', trigger: 'blur' }
       ],
        jobNumber: [
         { required: true, validator: host.basic.checkStr, trigger: 'blur' },
         {max:10,message: '不能超过10个字符'}
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
    // 分页回调
    handleCurrentChange(val) {
      this.getIps(val);
      this.current = val;
    },
    //  获取数据
    getIps(ind){
      let that = this;
      that.loading = true;
      this.$http.get(host.basic.basicUrl+'/wuyePerson/list',{params:{pageNum:ind}}).then(function(res){
        let data = res.data;
        that.tableData = data.RESULT.list;
        that.totle = data.RESULT.total;
        that.loading = false
      }, function(error){
        that.$message.error('数据获取失败,请稍后再试');
        that.loading = false
      });
    },
    _add(){
      this.$refs.firstForm && this.$refs.firstForm.resetFields();
      this.type = 'add';
      this.dialogVisible = true
    },
    // 编辑
    edit($index,row){
      this.firstForm = host.basic.clone(this.tableData[$index]);
      this.type = 'edit';
      this.firstForm.gender = this.firstForm.gender + '';
      this.firstForm.department = this.firstForm.department+'';
      if(this.firstForm.department){
        this.firstForm.department = this.firstForm.department + '';
      }else{
        this.firstForm.department = ''
      }
      this.dialogVisible = true;
    },
    addSubmit(){
      // add为新增  edit为编辑
      let that = this;
      this.$refs.firstForm.validate((valid) => {
        if (valid) {
          if(that.type == 'add'){
            this.$http({
              method:'POST',
              url:host.basic.basicUrl+'/wuyePerson/insert',
              params:that.firstForm
            }).then(function(res){
              let data = res.data;
              if(data.ERRORCODE == '0'){
                that.$message.success('操作成功');
                that.dialogVisible = false;
                that.getIps(1)
              }else{
                that.$message.warning(data.RESULT);
              }
            }, function(error){
              that.$message.error('请求失败');
            });
          }
          else if(that.type == 'edit'){
            this.$http({
              method:'POST',
              url:host.basic.basicUrl+'/wuyePerson/update',
              params:that.firstForm
            }).then(function(res){
              let data = res.data;
              if(data.ERRORCODE == '0'){
                that.$message.success('操作成功');
                that.dialogVisible = false;
                that.getIps(1)
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
    },
    // 删除
    del($index,row){
      let that = this;
      this._del(this.tableData[$index].id)
    },
    // 删除的方法
    _del(ids){
      let that = this;
      this.$confirm('你确定要删除选中的员工吗, 是否继续?', '删除', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        closeOnClickModal:false,
        type: 'warning'
      }).then(() => {
        this.$http({
          method:'POST',
          url:host.basic.basicUrl+'/wuyePerson/delete',
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
    }
  }
}
</script>

<style scoped lang="less">
  #plot{
    padding:15px;
    .el-pagination{
      display: inline-block;
    }
    .bottom{
      text-align:right;margin-top:20px;
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
