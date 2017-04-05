<template>
  <div id="charge">

    <div v-on:keyup.13="search">
       <el-row class="screening noprint">

        <el-date-picker
          v-model="month"
          type="month"
          placeholder="选择月份"
          :picker-options="pickerOptions0">
        </el-date-picker>

        <el-input class='inp'
          placeholder="请按照 x幢xxxx的格式填写"
          v-model="search_input">
        </el-input>

      <el-button type="primary" v-on:click='search' style='margin-left:12px;'>确定</el-button>
      <el-button type="primary" v-on:click='reset' style='margin-left:12px;'>刷新</el-button>
      <el-button type="danger"  v-on:click='excel' style='float:right; margin-right: 200px;' >导入</el-button>
      <el-button type="danger"  v-on:click='exam' style="float:right;">审核</el-button>
    </el-row>
    </div>
   <!-- 导入EXCEL -->
   <el-dialog title="上传" v-model="dialogVisible2">
    <el-upload :before-upload="add1" :data="fileList.data" :name="fileList.name" :on-success="add2"
      class="upload-demo"
      drag
      action= "wuye-manage/propertyCosts/importPropertyCosts"
      mutiple>
      <div class="el-upload-dragger">
        <i class="el-icon-upload"></i>
      <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
      <div class="el-upload__tip" slot="tip">只能上传excel文件</div>
      </div>
      
    </el-upload>
    <span slot="footer" class="dialog-footer">
      <!-- <el-button type="primary" @click="upload">上传</el-button> -->
    </span>
  </el-dialog>

    <el-table
      :data="tableData"
      v-loading.body="loading"
      border
      style="margin-top:15px;" class="noprint">
      <el-table-column
        label="房间号"
        inline-template >
        <span v-if="row.building != ''">{{row.building}}幢{{row.houseNum}}</span>
      </el-table-column>
      <el-table-column
         prop="area"
         label="面积(平方米)" >
       </el-table-column>
      <el-table-column
         prop="ownerName"
         label="业主名称" >
       </el-table-column>
       <el-table-column
         label="状态"
         inline-template >
         <div class="">
           <span v-if="row.hadPro == 0 || row.sendStatus == 0" style="color:#20a0ff">未发送</span>
           <span v-else-if="row.hadPro == 1 && row.sendStatus == 1">已发送</span>
           <span v-else-if="row.hadPro == 1 && row.payStatus == 1" style="color:#42d885">已支付</span>
         </div>
       </el-table-column>
       <el-table-column
         inline-template
         :context="_self"
         label="操作">
         <span>
           <el-button v-if="row.hadPro == 0" @click="add($index,row)" type="primary" size="small">添加</el-button>
           <el-button v-if="row.hadPro == 1 && row.payStatus == 0" @click="edit($index,row)" type="success" size="small">修改</el-button>
           <el-button v-if="row.hadPro == 1 && row.payStatus == 1" @click="edit($index,row)" type="primary" size="small">查看详情</el-button>
           <el-button v-if="row.hadPro == 1 && row.payStatus == 0 && row.sendStatus == 1" @click="com($index,row)" type="danger" size="small">完成支付</el-button>
          <!-- <el-button type="primary" @click="table1($index,row)" size="small">打印</el-button> -->

         </span>
       </el-table-column>
    </el-table>

    <div class="block bottom noprint">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="current"
        layout="total,prev, pager, next, jumper"
        :total="totle">
      </el-pagination>
    </div>
  <!-- table -->

   <!--  <el-dialog title="美德*天邑国际收费通知单" v-model="dialogTableVisible">
     <div>尊敬的<b>1-1022</b>业主/客户：</div>
     <p style="text-indent:2em;line-height:20px;">首先感谢您入驻本大厦以来对我们工作的支持与配合，望您一如既往地支持我们的工作。请您街道此通知后于<b>2017-2-15</b>日前到我管理处交付费用。迄今为止，您需缴付的费用如下：</p>
     <el-table :data="tableData11">
       <el-table-column property="con" label="内容/项目" ></el-table-column>
       <el-table-column property="name" label="电费" ></el-table-column>
       <el-table-column property="address" label="物管费" ></el-table-column>
       <el-table-column property="date" label="水费" ></el-table-column>
       <el-table-column property="name" label="停车费"></el-table-column>
       <el-table-column property="address" label="备注"></el-table-column>
     </el-table>
   </el-dialog> -->
   <!-- 新增审核弹出框 -->
   <el-dialog title="物业账单" v-model="dialogVisible1" :close-on-click-modal='false'>
    <!-- <el-button type="primary" v-show="sendPay" size="small" style="position:absolute;top:13px;left:15%" @click="sendPayList">发送账单</el-button> -->
    <!--   <el-button type="button" v-show="sendPay" size="small" style="position:absolute;top:13px;left:26%" @click="copyPayList1">下载水电收费单</el-button>
      <el-button type="button" v-show="sendPay" size="small" style="position:absolute;top:13px;left:45%" @click="copyPayList2">下载物业管理收费单</el-button> -->

      <el-form :model="form3" :rules="rule3" ref="form3" label-width="140px">
      <h3 v-text="form3.houseType" style="text-align:center;margin-bottom:10px;"></h3>
      
        <el-form-item label="房间号" prop="name">
          <el-input v-model="form3.name" :disabled='true'></el-input>
        </el-form-item>
        <el-form-item label="面积 (平方米)" prop="area">
          <el-input v-model="form3.area" :disabled='true'></el-input>
        </el-form-item>
        <el-form-item label="物业管理费(预收)" prop="name">
          <el-input v-model="form2.propertyFee" :disabled='true'></el-input>
        </el-form-item>
        <el-form-item label="公共耗能费(预收)" prop="area">
          <el-input v-model="form2.commonFee" :disabled='true'></el-input>
        </el-form-item>
        <el-form-item label="上期未交余额" prop="area">
          <el-input v-model="form3.lastFee" :disabled='true'></el-input>
        </el-form-item>
       <!--   <el-form-item label="天数" prop="property_days" @change="count">
              <el-input v-model="form1.property_days"  :disabled="dis" @change="count"></el-input>
        </el-form-item> -->
      <!--   <el-form-item label="车位管理费 (元)" prop="carportFee">
          <el-input v-model="form1.carportFee" placeholder='请输入当月的车位管理费' :disabled="dis"></el-input>
        </el-form-item> -->
        <div style="text-align:center;margin-bottom:15px;">电费</div>   
        <!-- <el-form-item label="电费" prop="electricFee"> -->
          <!-- 本期示数：<el-input v-model="form1.electricDegree"  :disabled="dis" style="width:32%;"></el-input>
          上期示数：<el-input v-model="form1.pastElectricDegree"  :disabled="dis" style="width:32%;"></el-input> -->
          <el-form-item label="本期示数" prop="electricDegree">
              <el-input v-model="form3.electricDegree"  :disabled="dis" @change="count1"></el-input>
          </el-form-item>
          <el-form-item label="上期示数" prop="pastElectricDegree" >
              <el-input v-model="form3.pastElectricDegree"  :disabled="dis" @change="count1"></el-input>
          </el-form-item>
           <el-form-item label="实用数" prop="useElectric">
              <el-input v-model="form3.useElectric"  :disabled="dis" ></el-input>
          </el-form-item>
          
          <el-form-item label="金额" prop="electricFee" >
              <el-input v-model="form3.electricFee"  :disabled="dis"></el-input>
          </el-form-item>
          <span style="margin-left:140px;display:inline-block;">当前价格:{{electricFee}}元/度</span>
        <!-- </el-form-item> -->
        <div style="text-align:center;margin-bottom:15px;">水费</div>
        <!-- <el-form-item label="水费" prop="waterFee"> -->
         <!--  <el-input v-model="form1.waterFee" placeholder='请输入当月的用水量' :disabled="dis"></el-input> -->
           <el-form-item label="本期示数" prop="waterTon" >
              <el-input v-model="form3.waterTon"  :disabled="dis" @change="count1"></el-input>
          </el-form-item>
          <el-form-item label="上期示数" prop="pastWaterTon" >
              <el-input v-model="form3.pastWaterTon"  :disabled="dis" @change="count1"></el-input>
          </el-form-item>
           <el-form-item label="实用数" prop="useWater">
              <el-input v-model="form3.useWater"  :disabled="dis" ></el-input>
          </el-form-item>
         <!--    <el-form-item label="天数" prop="property_days" >
              <el-input v-model="form1.property_days"  :disabled="dis" @change="count"></el-input>
          </el-form-item> -->
            <el-form-item label="金额" prop="waterFee" >
              <el-input v-model="form3.waterFee"  :disabled="dis" ></el-input>
          </el-form-item>
          <span style="margin-left:140px;display:inline-block;">当前价格:{{waterFee}}元/吨</span>
    <!--     </el-form-item> -->
        <el-form-item style="text-align:right">
          <el-button type="primary" @click="checkNext" :disabled="dis" class="noprint">下一条</el-button>
        </el-form-item>
      </el-form>
  </el-dialog>
    <!-- 新增公告弹出框 -->
    <!--startprint-->
    <el-dialog title="物业账单" v-model="dialogVisible" :close-on-click-modal='false' id="title">
      <el-button type="primary" v-show="sendPay1" size="small" style="position:absolute;top:13px;left:15%" @click="sendPayList">发送账单</el-button>
      <el-button type="button" v-show="sendPay" size="small" style="position:absolute;top:13px;left:26%" @click="copyPayList1">下载水电收费单</el-button>
      <el-button type="button" v-show="sendPay" size="small" style="position:absolute;top:13px;left:45%" @click="copyPayList2">下载物业管理收费单</el-button>

      <el-form :model="form1" :rules="rule" ref="form1" label-width="140px">
      <h3 v-text="form1.houseType" style="text-align:center;margin-bottom:10px;"></h3>
      
        <el-form-item label="房间号" prop="name">
          <el-input v-model="form1.name" :disabled='true'></el-input>
        </el-form-item>
        <el-form-item label="面积 (平方米)" prop="area">
          <el-input v-model="form1.area" :disabled='true'></el-input>
        </el-form-item>
        <el-form-item label="物业管理费(预收)" prop="name">
          <el-input v-model="form2.propertyFee" :disabled='true'></el-input>
        </el-form-item>
        <el-form-item label="公共耗能费(预收)" prop="area">
          <el-input v-model="form2.commonFee" :disabled='true'></el-input>
        </el-form-item>
        <el-form-item label="上期未交余额" prop="area">
          <el-input v-model="form1.lastFee" :disabled='true'></el-input>
        </el-form-item>
       <!--   <el-form-item label="天数" prop="property_days" @change="count">
              <el-input v-model="form1.property_days"  :disabled="dis" @change="count"></el-input>
        </el-form-item> -->
      <!--   <el-form-item label="车位管理费 (元)" prop="carportFee">
          <el-input v-model="form1.carportFee" placeholder='请输入当月的车位管理费' :disabled="dis"></el-input>
        </el-form-item> -->
        <div style="text-align:center;margin-bottom:15px;">电费</div>   
        <!-- <el-form-item label="电费" prop="electricFee"> -->
          <!-- 本期示数：<el-input v-model="form1.electricDegree"  :disabled="dis" style="width:32%;"></el-input>
          上期示数：<el-input v-model="form1.pastElectricDegree"  :disabled="dis" style="width:32%;"></el-input> -->
          <el-form-item label="本期示数" prop="electricDegree">
              <el-input v-model="form1.electricDegree"  :disabled="dis" @change="count"></el-input>
          </el-form-item>
          <el-form-item label="上期示数" prop="pastElectricDegree" >
              <el-input v-model="form1.pastElectricDegree"  :disabled="dis" @change="count"></el-input>
          </el-form-item>
           <el-form-item label="实用数" prop="useElectric">
              <el-input v-model="form1.useElectric"  :disabled="dis" ></el-input>
          </el-form-item>
          
          <el-form-item label="金额" prop="electricFee" v-show="fee">
              <el-input v-model="form1.electricFee"  :disabled="dis"></el-input>
          </el-form-item>
          <span style="margin-left:140px;display:inline-block;">当前价格:{{electricFee}}元/度</span>
        <!-- </el-form-item> -->
        <div style="text-align:center;margin-bottom:15px;">水费</div>
        <!-- <el-form-item label="水费" prop="waterFee"> -->
         <!--  <el-input v-model="form1.waterFee" placeholder='请输入当月的用水量' :disabled="dis"></el-input> -->
           <el-form-item label="本期示数" prop="waterTon" >
              <el-input v-model="form1.waterTon"  :disabled="dis" @change="count"></el-input>
          </el-form-item>
          <el-form-item label="上期示数" prop="pastWaterTon" >
              <el-input v-model="form1.pastWaterTon"  :disabled="dis" @change="count"></el-input>
          </el-form-item>
           <el-form-item label="实用数" prop="useWater">
              <el-input v-model="form1.useWater"  :disabled="dis" ></el-input>
          </el-form-item>
         <!--    <el-form-item label="天数" prop="property_days" >
              <el-input v-model="form1.property_days"  :disabled="dis" @change="count"></el-input>
          </el-form-item> -->
            <el-form-item label="金额" prop="waterFee" v-show="fee">
              <el-input v-model="form1.waterFee"  :disabled="dis" ></el-input>
          </el-form-item>
          <span style="margin-left:140px;display:inline-block;">当前价格:{{waterFee}}元/吨</span>
    <!--     </el-form-item> -->
        <el-form-item style="text-align:right">
          <el-button type="primary" @click="formSubmit" :disabled="dis" class="noprint">确认</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!--endprint-->

  </div>
</template>

<script type="text/javascript">
import host from '../config.js'

export default {
  data () {
    let checkNumber = (rule, value, callback) => {
      if (!/^\d+(\.\d+)?$/.test(value)) {
        callback(new Error('请输入正确的数字'));
        return false
      }
      callback();
    };
    return {
      timps:'',
      dialogVisible:false,
      dialogTableVisible:false,
      dialogVisible1:false,
      dialogVisible2:false,
      sendPay:false,
      sendPay1:false,
      fileList:{
        name:'uploadExcel',
        data:{
          year:'',
          month:''
        }
      },
      tableData11: [{
          con: '本期示数',
          name: 'electricDegree',
          address: '上海市普陀区金沙江路 1518 弄'
        }, {
          con: '上期示数',
          name: 'pastElectricDegree',
          address: '上海市普陀区金沙江路 1517 弄'
        }, {
          con: '实用数',
          name: 'useWater',
          address: '上海市普陀区金沙江路 1519 弄'
        }, {
          con: '单价',
          name: 'electricFee',
          address: '上海市普陀区金沙江路 1516 弄'
        }, {
          con: '金额',
          name: 'usemoney',
          address: '上海市普陀区金沙江路 1516 弄'
        }, {
          con: '上期累计未交',
          name: 'pastusemoney',
          address: '上海市普陀区金沙江路 1516 弄'
        }, {
          con: '合计',
          name: 'totalMoney',
          address: '上海市普陀区金沙江路 1516 弄'
        }],
      dis:false,
      fee:false,
      houseType:'',
      tableData: [],
      form1:{
        name:'',
        area:'',
        val1:'',
        val2:'',
        electricFee:'',
        shopElectricFee:'',
        waterFee:'',
        carportFee:'0',
        waterTon:'',
        pastWaterTon:'',
        electricDegree:'',
        pastElectricDegree:'',
        useElectric: '',
        useWater:'',
        houseType:'',
        lastFee:0,
        proId:'',
        houseId:'',
        sendStatus:''
      },
       form3:{
        name:'',
        area:'',
        val1:'',
        val2:'',
        electricFee:'',
        shopElectricFee:'',
        waterFee:'',
        carportFee:'0',
        waterTon:'',
        pastWaterTon:'',
        electricDegree:'',
        pastElectricDegree:'',
        useElectric: '',
        useWater:'',
        houseType:'',
        lastFee:0,
        proId:'',
        houseId:''
      },
      form2:{
        electricFee:'',
        shopElectricFee:'',
        commonFee:'',
        propertyFee:'',
      },
      rule: {
      //   electricFee: [
      //       {validator: host.basic.checkNum2, trigger: 'blur' }
      //     ],
      //   waterFee: [
      //       {validator: host.basic.checkNum2, trigger: 'blur' }
      //     ],
      //   carportFee: [
      //       {validator: host.basic.checkNum2, trigger: 'blur' }
      //     ]
        electricDegree: [
            {validator: host.basic.checkNum, trigger: 'blur' }
          ],
        pastElectricDegree: [
            {validator: host.basic.checkNum, trigger: 'blur' }
          ],
        waterTon: [
            {validator: host.basic.checkNum, trigger: 'blur' }
          ],
        pastWaterTon: [
            {validator: host.basic.checkNum, trigger: 'blur' }
          ],
        property_days: [
          {validator: host.basic.checkNum, trigger: 'blur' }
        ]
      },
      rule3: {
      //   electricFee: [
      //       {validator: host.basic.checkNum2, trigger: 'blur' }
      //     ],
      //   waterFee: [
      //       {validator: host.basic.checkNum2, trigger: 'blur' }
      //     ],
      //   carportFee: [
      //       {validator: host.basic.checkNum2, trigger: 'blur' }
      //     ]
        electricDegree: [
            {validator: host.basic.checkNum, trigger: 'blur' }
          ],
        pastElectricDegree: [
            {validator: host.basic.checkNum, trigger: 'blur' }
          ],
        waterTon: [
            {validator: host.basic.checkNum, trigger: 'blur' }
          ],
        pastWaterTon: [
            {validator: host.basic.checkNum, trigger: 'blur' }
          ],
        property_days: [
          {validator: host.basic.checkNum, trigger: 'blur' }
        ]
      },
      totle:0,
      current:1,
      loading:false,
      search_input:'',
      month:'',
      _index:'',
      _proId:'',
      _type:'add',
      electricFee:'未配置',
      shopElectricFee:'未配置',
      waterFee:'未配置',
      pickerOptions0: {
        disabledDate(time) {
          let now = new Date();
          let day = now.getDate();
          if(day <= 5){
            return time.getTime() > Date.now();
          }else{
            return time.getTime() > Date.now() - day*1000*60*60*24;
          }
        }
      }
    }
  },
  mounted(){
    let time = new Date();
    let year = time.getFullYear()
    let month = time.getMonth() + 1;
    let date = time.getDate();
    if(month == 1 && date > 5){
      year = year - 1;
      month = 12;
    }
    else if(date > 5){
      month = month - 1;
    }
    this.month = year + '-' + month
    this.getIps(1,year,month);
    let that = this;
    this.$http.get(host.basic.basicUrl+'/wuyeInfo/info').then(function(res){
      let data = res.data;
      if(data.ERRORCODE == '0'){
        if(data.RESULT.electricFee != ''){that.electricFee = data.RESULT.electricFee/100}
        if(data.RESULT.shopElectricFee != ''){that.shopElectricFee = data.RESULT.shopElectricFee/100}
        if(data.RESULT.waterFeee != ''){that.waterFee = data.RESULT.waterFee/100}
        if(data.RESULT.electricFee != ''){that.form2.electricFee = data.RESULT.electricFee/100}
        if(data.RESULT.shopElectricFee != ''){that.form2.shopElectricFee = data.RESULT.shopElectricFee/100}
         if(data.RESULT.commonFee != ''){that.form2.commonFee = data.RESULT.commonFee/100}
        if(data.RESULT.propertyFee != ''){that.form2.propertyFee = data.RESULT.propertyFee/100}

      }else{
        that.$message.warning(data.RESULT);
      }
    }, function(error){
      that.$message.error('获取物业信息失败,请稍后再试');
    });

  },
  methods: {
    //打印
    // print(){
    //   window.print();

    //  },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
    },
  
    handleCurrentChange(val) {
      let that = this;
      let month = that.month;
      let m; let y;
      if(typeof(month) == 'string'){
        y = month.substring(0,month.indexOf('-'));
        m = month.substring(month.indexOf('-')+1,)
      }else{
        y = that.month.getFullYear();
        m = that.month.getMonth()+1
      }
      this.getIps(val,y,m,this.search_input)
      this.current = val;
    },
    check(){
      let that = this;
      let month = that.month;
      let m; let y;
      if(typeof(month) == 'string'){
        y = month.substring(0,month.indexOf('-'));
        m = month.substring(month.indexOf('-')+1,)
      }else{
        y = that.month.getFullYear();
        m = that.month.getMonth()+1
      }
      this.$http.get(host.basic.basicUrl+'/propertyCosts/getPropertyCosts',{params:{
       year:y,month:m}}).then(function(res){
        let data = res.data;
        if(data.ERRORCODE == 0){
            this.dialogVisible1 = true;
           that.form3.name = data.RESULT.building + '-' + data.RESULT.houseNum; 
            that.form3.area = data.RESULT.area/100; 
            // that.form3.propertyFee = data.RESULT.propertyFee/100; 
            // that.form3.commonFee = data.RESULT.commonFee/100; 
            that.form3.lastFee = data.RESULT.lastFee/100;
            that.form3.electricDegree = data.RESULT.electricDegree;
            that.form3.pastElectricDegree = data.RESULT.pastElectricDegree;
            that.form3.useElectric= data.RESULT.electricDegree - data.RESULT.pastElectricDegree;
            that.form3.waterTon = data.RESULT.waterTon;
            that.form3.pastWaterTon = data.RESULT.pastWaterTon;
            that.form3.useWater= data.RESULT.waterTon - data.RESULT.pastWaterTon;
            that.form3.electricFee = data.RESULT.electricFee/100;
            that.form3.waterFee = data.RESULT.waterFee/100;
            that.form3.proId = data.RESULT.id;
            if(data.RESULT.houseType != ''&& data.RESULT.houseType == 1){
              that.form3.houseType = '住户'
              this.electricFee = this.form2.electricFee;
            }else if(data.RESULT.houseType != ''&& data.RESULT.houseType == 2){
              that.form3.houseType = '商户'
              this.electricFee = this.form2.shopElectricFee;
            }
          }else if(data.ERRORCODE == -1){
              this.dialogVisible1 = false;
              that.$message.error('没有可以审核的缴费单');
          }
       
      }, function(error){
        that.$message.error('数据获取失败,请稍后再试');
      });
    },
    checkNext(){
      let that = this;
      that.form3.proId = this.form3.proId;
      that.form3.waterTon = this.form3.waterTon;
      that.form3.pastWaterTon = this.form3.pastWaterTon;
      that.form3.electricDegree = this.form3.electricDegree;
      that.form3.pastElectricDegree = this.form3.pastElectricDegree;
      this.$http.get(host.basic.basicUrl+'/propertyCosts/sendAndAuditPropertyCosts',
      {
      params:{
        id:that.form3.proId,
        waterTon:that.form3.waterTon,
        pastWaterTon: that.form3.pastWaterTon,
        electricDegree:that.form3.electricDegree,
        pastElectricDegree:that.form3.pastElectricDegree
      }}).then(function(res){
        let data = res.data;
        if(data.ERRORCODE == 0){
          let that = this;
          let month = that.month;
          let m; let y;
          if(typeof(month) == 'string'){
            y = month.substring(0,month.indexOf('-'));
            m = month.substring(month.indexOf('-')+1,)
          }else{
            y = that.month.getFullYear();
            m = that.month.getMonth()+1
          }
          this.getIps(this.current,y,m,this.search_input);
          this.check();
        }else{
          that.$message.error(data.RESULT);
        }
      }, function(error){
        that.$message.error('数据获取失败,请稍后再试');
      });
    },
    // 上传缴费账单
    upload(){

    },
    add1(){
      let that = this;
      let month = that.month;
      let m; let y;
      if(typeof(month) == 'string'){
        y = month.substring(0,month.indexOf('-'));
        m = month.substring(month.indexOf('-')+1,)
      }else{
        y = that.month.getFullYear();
        m = that.month.getMonth()+1
      }
      this.fileList.data.year = y
      this.fileList.data.month = m
    },
    add2(){
      let that = this;
      let month = that.month;
      let m; let y;
      if(typeof(month) == 'string'){
        y = month.substring(0,month.indexOf('-'));
        m = month.substring(month.indexOf('-')+1,)
      }else{
        y = that.month.getFullYear();
        m = that.month.getMonth()+1
      }
      this.getIps(this.current,y,m,this.search_input)
      this.dialogVisible2 = false;
    },
    excel(){
      this.dialogVisible2 = true;
      let that = this;
      let month = that.month;
      let m; let y;
      if(typeof(month) == 'string'){
        y = month.substring(0,month.indexOf('-'));
        m = month.substring(month.indexOf('-')+1,)
      }else{
        y = that.month.getFullYear();
        m = that.month.getMonth()+1
      }
      // this.$http.get(host.basic.basicUrl+'/propertyCosts/importPropertyCosts',
      // {
      // params:{
      //   uploadExcel:
      //   year:y,
      //   month: m
      // }}).then(function(res){
      //   let data = res.data;
      //   if(data.ERRORCODE == 0){
      //     that.$message.success(data.RESULT);
      //   }else{
      //     that.$message.error(data.RESULT);
      //   }
      // }, function(error){
      //   that.$message.error('数据获取失败,请稍后再试');
      // });
    },
    // 获取订单
    getIps(ind,year,month,search){
      let that = this;
      that.loading = true;
      that.fee = false;
      this.$http.get(host.basic.basicUrl+'/propertyCosts/list',{params:{
        pageNum:ind,year:year,month:month,searchStr:search}}).then(function(res){
        let data = res.data;
        that.tableData = data.RESULT.list;
        this.totle = data.RESULT.total
        that.loading = false
        for (var i = 0; i < that.tableData.length; i++) {
          that.tableData[i].useElectric = that.tableData[i].electricDegree - that.tableData[i].pastElectricDegree
          that.tableData[i].useWater = that.tableData[i].waterTon - that.tableData[i].pastWaterTon   
          that.tableData[i].area = that.tableData[i].area/100  
        };
      }, function(error){
        that.$message.error('数据获取失败,请稍后再试');
        that.loading = false
      });
    },
    table1($index,row){
      this.dialogTableVisible = true
    },
    //自动计算
    count(){
      let that = this;
      this.form1.useElectric = this.form1.electricDegree - this.form1.pastElectricDegree;
      this.form1.useWater = this.form1.waterTon - this.form1.pastWaterTon;
      this.form1.waterFee = (this.waterFee*this.form1.useWater).toFixed(2);
      this.form1.electricFee = (this.electricFee*this.form1.useElectric).toFixed(2);
    },
     count1(){
      let that = this;
      this.form3.useElectric = this.form3.electricDegree - this.form3.pastElectricDegree;
      this.form3.useWater = this.form3.waterTon - this.form3.pastWaterTon;
      this.form3.waterFee = (this.waterFee*this.form3.useWater).toFixed(2);
      this.form3.electricFee = (this.electricFee*this.form3.useElectric).toFixed(2);
    },
    // 搜索
    search(){
      if(typeof(this.month) == 'string'){
        let _input = this.search_input;
        let year = this.month.substring(0,this.month.indexOf('-'));
        let month = this.month.substring(this.month.indexOf('-')+1,this.month.length);
        _input = _input.length > 1 ? _input.substring(0,2) + '1单元' + _input.substring(2,7) : ''
        // _input = _input.substring(0,2) + '1单元' + _input.substring(2,7);
        this.getIps(1,year,month,_input)
      }else{
        let _input = this.search_input;
        let year = this.month.getFullYear();
        let month = this.month.getMonth()+1;
        _input = _input.length > 1 ? _input.substring(0,2) + '1单元' + _input.substring(2,7) : ''
        this.getIps(1,year,month,_input)
        this.current = 1;
      }
    },
    // 重置
    reset(){
      this.current=1;
      let time = new Date();
      let year = time.getFullYear()
      let month = time.getMonth() + 1;
      let date = time.getDate();
      if(month == 1 && date > 5){
        year = year - 1;
        month = 12;
      }
      else if(date > 5){
        month = month - 1;
      }
      this.month = year + '-' + month
      this.getIps(1,year,month)
    },
    // 重置表单
    resetForm(){
      this.dialogVisible = true;
      this.$refs.formShort && this.$refs.formShort.resetFields();
      this.$refs.formLong && this.$refs.formLong.resetFields();
      this.radio = '1';
    },
    formSubmit(){
      // type add  edit
      let that = this;
      this.$refs.form1.validate((valid) => {
        if (valid) {
          let month = that.month;
          let m; let y;
          if(typeof(month) == 'string'){
            y = month.substring(0,month.indexOf('-'));
            m = month.substring(month.indexOf('-')+1,)
          }else{
            y = that.month.getFullYear();
            m = that.month.getMonth()+1
          }
          if(this._type == 'add'){      
            this.$http({
              method:'POST',
              url:host.basic.basicUrl+'/propertyCosts/sendPropertyCosts',
              params:{
                houseId:that._index,
                year:y,
                month:m,
                pastWaterTon:that.form1.pastWaterTon,
                waterTon:that.form1.waterTon,
                pastElectricDegree:that.form1.pastElectricDegree,
                electricDegree:that.form1.electricDegree,
                carportFee:0
              }
            }).then(function(res){
              let data = res.data;
              if(data.ERRORCODE == '0'){
                that.$message.success('操作成功');
                that.dialogVisible = false;
                that.sendPay = true;
                this.search();
              }else{
                that.$message.error(data.RESULT);
              }
            }, function(error){
              that.$message.error('请求失败,请稍后再试');
            });
          }
          else if(this._type == 'edit'){
            this.$http({
              method:'POST',
              url:host.basic.basicUrl+'/propertyCosts/update',
              params:{
                id:that._proId,
                waterFee:that.form1.waterFee,
                carportFee:(that.form1.carportFee)*100,
                electricFee:that.form1.electricFee,
                pastWaterTon:that.form1.pastWaterTon,
                waterTon:that.form1.waterTon,
                pastElectricDegree:that.form1.pastElectricDegree,
                electricDegree:that.form1.electricDegree
              }
            }).then(function(res){
              let data = res.data;
              if(data.ERRORCODE == '0'){
                that.$message.success('操作成功');
                that.dialogVisible = false;

                // that.getIps(1,y,m);
                // this.current = val;
                // console.log(this.current);
                // this.handleCurrentChange(this.current);
                this.getIps(this.current,y,m,this.search_input)
               
              }else{
                that.$message.error(data.RESULT);
              }
            }, function(error){
              that.$message.error('请求失败,请稍后再试');
            });
          }
        } else {
          return false;
        }
      });
    },
    // 点击新增
    add($index,row){    
      this.$refs.form1 && this.$refs.form1.resetFields();
      this.form1.electricDegree = '';
      this.form1.pastElectricDegree = '';
      this.form1.useElectric = '';
      this.form1.useWater = '';
      this.form1.waterTon = '';
      this.form1.pastWaterTon = '';
      this.form1.area = this.tableData[$index].area
      this.form1.name = this.tableData[$index].building + '-' + this.tableData[$index].houseNum
      this._index = this.tableData[$index].houseId;
      if( this.tableData[$index].houseType != '' && this.tableData[$index].houseType == 1) {
        this.form1.houseType = '住户' ;
        this.electricFee = this.form2.electricFee;
      }else if(this.tableData[$index].houseType != '' && this.tableData[$index].houseType == 2){
        this.form1.houseType = '商户';
        this.electricFee = this.form2.shopElectricFee;
      }else{
        this.form1.houseType = '';
      }
      this._type = 'add';
      this.dialogVisible = true;
      this.fee = false;
      this.dis = false;
      this.sendPay = false;
    },
    exam(){    
      this.check();
    },
    // 点击完成
    com($index,row){
      let that = this;
      let month = that.month;
      let m; let y;
      if(typeof(month) == 'string'){
        y = month.substring(0,month.indexOf('-'));
        m = month.substring(month.indexOf('-')+1,)
      }else{
        y = that.month.getFullYear();
        m = that.month.getMonth()+1
      }
      this.$confirm('你确定要完成此账单吗, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        closeOnClickModal:false,
        type: 'warning'
      }).then(() => {
        that.$http({
          method:'POST',
          url:host.basic.basicUrl+'/propertyCosts/pay',
          params:{
            id:that.tableData[$index].proId
          }
        }).then(function(res){
          let data = res.data;
          if(data.ERRORCODE == '0'){
            that.$message.success('操作成功');
            that.getIps(1,y,m)
          }else{
            that.$message.error(data.RESULT);
          }
        }, function(error){
          that.$message.error('请求失败,请稍后再试');
        });
      }).catch(() => {})
    },
    //下载账单
    copyPayList1(){
      let that = this;
      let month = that.month;
      let m; let y;
      if(typeof(month) == 'string'){
        y = month.substring(0,month.indexOf('-'));
        m = month.substring(month.indexOf('-')+1,)
      }else{
        y = that.month.getFullYear();
        m = that.month.getMonth()+1
      }
      location.href= host.basic.basicUrl+'/propertyCosts/printPropertyCosts?houseId='+this.form1.houseId+'&&year='+y+'&&month='+m+'&&type='+1;
    },
    copyPayList2(){
      let that = this;
      let month = that.month;
      let m; let y;
      if(typeof(month) == 'string'){
        y = month.substring(0,month.indexOf('-'));
        m = month.substring(month.indexOf('-')+1,)
      }else{
        y = that.month.getFullYear();
        m = that.month.getMonth()+1
      }
      location.href= host.basic.basicUrl+'/propertyCosts/printPropertyCosts?houseId='+this.form1.houseId+'&&year='+y+'&&month='+m+'&&type='+2;
    },
    //点击发送账单
    sendPayList(){
       let that = this;
         this.$http({
          method:'POST',
          url:host.basic.basicUrl+'/propertyCosts/auditPropertyCosts',
          params:{
            id:this.form1.proId
          }
        }).then(function(res){
          let data = res.data;
          if(data.ERRORCODE == '0'){
            let that = this;
            that.$message.success('发送成功');
            this.dialogVisible = false;
            let month = that.month;
            let m; let y;
            if(typeof(month) == 'string'){
              y = month.substring(0,month.indexOf('-'));
              m = month.substring(month.indexOf('-')+1,)
            }else{
              y = that.month.getFullYear();
              m = that.month.getMonth()+1
            }
            this.getIps(this.current,y,m,this.search_input)
          }else{
           that.$message.error(data.RESULT);
          }
        }),function(error){
         that.$message.error('请求失败,请稍后再试');
      }
    },
    // 点击修改
    edit($index,row){
      let that = this;
      this.sendPay = true;
      this.$refs.form1 && this.$refs.form1.resetFields();
      let month = that.month;
      let m; let y;
      if(typeof(month) == 'string'){
        y = month.substring(0,month.indexOf('-'));
        m = month.substring(month.indexOf('-')+1,)
      }else{
        y = that.month.getFullYear();
        m = that.month.getMonth()+1
      }
      let st = that.tableData[$index].payStatus;
      st == 0 ? that.dis = false : that.dis = true
      this.$http({
        method:'POST',
        url:host.basic.basicUrl+'/propertyCosts/info',
        params:{
          houseId:that.tableData[$index].houseId,
          year:y,
          month:m
        }
      }).then(function(res){
        let data = res.data;
        if(data.ERRORCODE == '0'){
          // that.form1.electricFee = data.RESULT.electricFee/100;
          that.form1.carportFee = parseInt(data.RESULT.carportFee)/100;
          // that.form1.waterFee = data.RESULT.waterFee/100;
          // that.form1.electricFee = data.RESULT.electricFee/100;
          // that.form1.property_days = data.RESULT.propertyDays;
          that.form1.waterTon = data.RESULT.waterTon;  
          that.form1.proId = data.RESULT.proId;  
          that.form1.houseId = data.RESULT.houseId;  
          that.form1.pastWaterTon = data.RESULT.pastWaterTon;
          that.form1.useWater= data.RESULT.waterTon - data.RESULT.pastWaterTon;       
          that.form1.electricDegree = data.RESULT.electricDegree;
          that.form1.pastElectricDegree = data.RESULT.pastElectricDegree;
          that.form1.useElectric= data.RESULT.electricDegree - data.RESULT.pastElectricDegree;
          that.form1.electricFee = (this.electricFee*that.form1.useElectric).toFixed(2);
          that.form1.waterFee = (this.waterFee*that.form1.useWater).toFixed(2);
          data.RESULT.sendStatus == true ? this.sendPay1 = false : this.sendPay1 = true;

          if (data.RESULT.houseType == 1) {
            this.form1.houseType = '住户';
            this.electricFee = this.form2.electricFee;
          } else if (data.RESULT.houseType == 2) {
            this.form1.houseType = '商户';
            this.electricFee = this.form2.shopElectricFee;
          } 
          this.fee = true;
          that.form1.area = that.tableData[$index].area
          that.form1.name = that.tableData[$index].building+'-'+that.tableData[$index].houseNum
          that._index = that.tableData[$index].houseId;
          that._proId = that.tableData[$index].proId;
          that._type = 'edit';
          that.dialogVisible = true; 
         
        }else{
          that.$message.error(data.RESULT);
        }
      }, function(error){
        that.$message.error('请求失败,请稍后再试');
      });
    }
  }
}
</script>

<style lang="less">
@media print { 
.noprint { display: none;color:green } 
} 
  #charge{
    padding-left: 15px;
    padding-right: 15px;
    tr{
      cursor: pointer;
    }
    .table-end{
      width: 35%;
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
    .totle-price{
      font-size: 20px;
      margin-left: 50px;
      padding-top: 6px;
      color:#666;
      display: inline-block;
      float:left
    }
    .el-upload{
      display: inline-block;
      text-align: center;
      cursor: pointer;
      .el-upload-dragger {
        background-color: #fff;
        border: 1px dashed #d9d9d9;
        border-radius: 6px;
        box-sizing: border-box;
        width: 360px;
        height: 180px;
        text-align: center;
        cursor: pointer;
        position: relative;
        overflow: hidden;
        .el-icon-upload{
          font-size: 67px;
          color: #97a8be;
          margin: 40px 0 16px;
          line-height: 50px;
        }
      }
    }

  }
</style>
