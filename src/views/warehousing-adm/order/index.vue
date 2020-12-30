<template>
  <div class="table-index _table-index">
    <div class="select-head">
      <el-form ref="form" style="display: flex;flex-wrap:wrap;" :model="form" label-width="180px" label-position="right" >

        <el-form-item label="入库订单单号或外部单号：">
          <el-input type="text" placeholder="请输入入库订单单号或外部单号" v-model="form.billNumberOrSrcBillNumberLike" class="input-width" ></el-input>
        </el-form-item>

        <el-form-item label="来源单号：">
          <el-input type="text" placeholder="请输入来源单号" v-model="form.srcBillNumberLike" class="input-width" ></el-input>
        </el-form-item>

        <el-form-item label="供应商：">
          <el-input type="text" placeholder="请输入供应商" v-model="form.vendorCodeEqualsOrNameLike" class="input-width" ></el-input>
        </el-form-item>


        <el-form-item label="入库订单来源：">
          <el-select v-model="form.srcWayEquals" placeholder="请选择订单来源" class="input-width" >
            <el-option value="MANUAL" label="手工"></el-option>
            <el-option value="API" label="接口导入"></el-option>
            <el-option value="EXCEL" label="文件导入"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="收货方式：">
          <el-select v-model="form.typeEquals" placeholder="请选择状态" class="input-width" >
            <el-option value="NOTTRUST" label="清点收货"></el-option>
            <el-option value="TRUST" label="信任收货"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="商品：">
          <el-input type="text" placeholder="请输入商品" v-model="form.productCodeOrNameLike" class="input-width" ></el-input>
        </el-form-item>

        <el-form-item label="创建日期：">
          <el-date-picker class="input-width _picker" v-model="createTime" type="datetimerange" value-format="yyyy-MM-dd HH:mm:ss" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期" ></el-date-picker>
        </el-form-item>

        <el-form-item label="状态：">
          <el-select v-model="form.status" placeholder="请选择状态" class="input-width" >
            <el-option value="" label="全部"></el-option>
            <el-option value="INITIAL" label="初始"></el-option>
            <el-option value="ARRIVED" label="已登记"></el-option>
            <el-option value="QUALITY" label="已质检"></el-option>
            <el-option value="RECEIVING" label="进行中"></el-option>
            <el-option value="FINISHED" label="已完成"></el-option>
            <el-option value="ABORTED" label="已取消"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="到货日期：">
          <el-date-picker class="input-width _picker" v-model="arrival" type="datetimerange" value-format="yyyy-MM-dd HH:mm:ss" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期" ></el-date-picker>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" size="mini" @click="onSubmit" >立即搜索</el-button>
          <el-button size="mini" @click="clearInput">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    
    <div style="height: 20px" />

    <div style="background: #fff;">
      <el-row>
        <!-- <router-link :to="{ path: '/basicinfo/container/add' }" >
          <el-button style="margin: 18px 10px" type="primary" size="mini" >新建</el-button>
        </router-link> -->

        <el-button style="margin: 18px 10px" size="mini" @click="printingBtn" >打印</el-button>
      </el-row>


      <el-table :data="listData" style="width: 100%; text-align: center" @selection-change="handleSelectionChange" :row-style="{ height: '16px', padding: '-4px' }" >
        <el-table-column type="selection" width="55"></el-table-column>
        <!-- <el-table-column type="index" label="序号"></el-table-column> -->

        <el-table-column prop="billNumber" label="单号" style="height: 20px">
          <template slot-scope="scope">
            <router-link style="color: #409eff" :to="{ path: '/warehousing-adm/oeder/edit', query:{ id: scope.row.id } }" >
              <span>{{ scope.row.billNumber }}</span>
            </router-link>
          </template>
        </el-table-column>

        <el-table-column prop="srcBillNumber" label="来源单号"></el-table-column>

        <el-table-column prop="srcApi" label="通知订单类型" style="height: 20px">
          <template slot-scope="scope">{{ scope.row.srcApi | setSrcApi }}</template>
        </el-table-column>

        <el-table-column prop="type" label="收货方式">
          <template slot-scope="scope">
            {{ scope.row.type | setType }}
          </template>
        </el-table-column>

        <el-table-column prop="endReceiveTime" label="通知日期">
          <template slot-scope="scope">
            {{ scope.row.endReceiveTime ? scope.row.endReceiveTime : "&lt;空&gt;" }}
          </template>
        </el-table-column>

        <el-table-column prop="expireDate" label="失效日期">
          <template slot-scope="scope">
            {{ scope.row.expireDate ? scope.row.expireDate : "&lt;空&gt;" }}
          </template>
        </el-table-column>

        <el-table-column prop="vendorName" label="供应商"></el-table-column>

        <el-table-column prop="status" label="状态">
          <template slot-scope="scope">
            {{ scope.row.status | setScope }}
          </template>
        </el-table-column>


        <el-table-column label="操作">
          <template slot-scope="scope">
            <!-- <el-button size="mini" type="text" >
              <router-link style="color: #409eff" :to="{ path: '/warehousing-adm/oeder/edit', query:{ id: scope.row.id } }" >查看</router-link>
            </el-button> -->
            <el-button v-if="scope.row.status === 'RECEIVING'" size="mini" type="text" @click="putFinish(scope.row.billNumber, scope.row.version, scope.row.dcId)">收货完成</el-button>
            <el-button v-else-if="scope.row.status === 'FINISHED'" size="mini" type="text" @click="printingBtn(scope.row)">打印</el-button>
            <div v-else>--</div>
          </template>
        </el-table-column>

        <!-- <el-table-column prop="billNumber" label="单号" style="height: 20px">
          <template slot-scope="scope">
            <router-link style="color: #409eff" :to="{ path: '/warehousing-adm/oeder/edit', query:{ id: scope.row.billNumber } }" >
              <span>{{ scope.row.billNumber }}</span>
            </router-link>
          </template>
        </el-table-column>

        <el-table-column prop="srcWay" label="订单类型" style="height: 20px">
          <template slot-scope="scope">{{ scope.row.srcWay }}</template>
        </el-table-column>

        <el-table-column prop="vendorName" label="供应商"></el-table-column>

        <el-table-column prop="wrhName" label="入库仓"></el-table-column>
        <el-table-column prop="isLogisticMode" label="物流方式"></el-table-column>

        <el-table-column prop="endReceiveTime" label="到货日期">
          <template slot-scope="scope">
            {{ scope.row.endReceiveTime ? scope.row.endReceiveTime : "&lt;空&gt;" }}
          </template>
        </el-table-column>

        <el-table-column prop="expireDate" label="到效日期"></el-table-column>
        <el-table-column prop="srcBillNumber" label="来源单号"></el-table-column>
        <el-table-column prop="status" label="状态">
          <template slot-scope="scope">
            {{ scope.row.status | setScope }}
          </template>
        </el-table-column>

        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button size="mini" type="text" @click="deleteWmsBintype(scope.row.id, scope.row.version)">打印</el-button>
          </template>
        </el-table-column> -->

      </el-table>

      <el-pagination
          style="float:right"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="1"
          :page-sizes="[10, 20, 30, 50]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="totalCount">
      </el-pagination>

      
    </div>
  </div>
</template>

<script>
import WarehousingAdmServers from "@/api/service/WarehousingAdmServers";

export default {
  data() {
    return {
      listData: [], // 列表数据
      form: {
        billNumberOrSrcBillNumberLike: '', // 单号
        srcBillNumberLike: '', //  来源单号
        vendorCodeEqualsOrNameLike: '', // 供应商代码等于或者名称类似于
        wrhCodeEqualsOrNameLike: '', // 入库仓库
        typeEquals: '', // 收货方式
        srcWayEquals: '', // 订单来源
        productCodeOrNameLike: '', // 商品代码等于或者名称类似于
        status: '' // 状态等于
      },
      arrival: '', // 到货日期
      createTime: '', // 创建日期
      page: 1,
      pageSize: 10,
      totalCount: 0,
      downList: ''
    };
  },
  computed: {},
  methods: {
    onSubmit: function() {
      const _this = this;
      this.page = 1;

      this.$refs.form.validate((result) => {
        if (result) {
          _this.queryOrderBill();
        }
      });
    },
    clearInput: function() {
      this.form = {
        billNumberOrSrcBillNumberLike: '', // 单号
        srcBillNumberLike: '', //  来源单号
        vendorCodeEqualsOrNameLike: '', // 供应商代码等于或者名称类似于
        wrhCodeEqualsOrNameLike: '', // 入库仓库
        typeEquals: '', // 收货方式
        srcWayEquals: '', // 订单来源
        productCodeOrNameLike: '', // 商品代码等于或者名称类似于
        status: '' // 状态等于
      };

      this.arrival = ''; // 到货日期
      this.createTime = ''; // 创建日期
    },
    putFinish(billNumber, version, dcId) {
      // console.log(billNumber, version)
      // 确认收货
      const _this = this;
      this.$confirm('是否确认收货?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const obj = {
          dcId,
          billNumber,
          version
        }
        WarehousingAdmServers.finishOrderBill(obj)
        .then(res => {
          this.$message.success("收货成功")
          _this.queryOrderBill()
        })
        .catch(err => {
          this.$message.error("收货失败" + err.message)
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消'
        })        
      })
    },
    handleSelectionChange(val) {
      this.downList = val;
      console.log(val)
    },
    queryOrderBill: function() {
      const _this = this;

      const data = {
        page: this.page,
        pageSize: this.pageSize,
        billNumberOrSrcBillNumberLike: this.form.billNumberOrSrcBillNumberLike, // 单号
        srcBillNumberLike: this.form.srcBillNumberLike, //  来源单号
        vendorCodeEqualsOrNameLike: this.form.vendorCodeEqualsOrNameLike, // 供应商代码等于或者名称类似于
        wrhCodeEqualsOrNameLike: this.form.wrhCodeEqualsOrNameLike, // 入库仓库
        typeEquals: this.form.typeEquals ? this.form.typeEquals : null, // 收货方式
        productCodeOrNameLike: this.form.productCodeOrNameLike, // 商品代码等于或者名称类似于
        srcWayEquals: this.form.srcWayEquals ? this.form.srcWayEquals : null, // 订单来源
        statusEquals: this.form.status ? this.form.status : null, // 状态等于
        realArrivalDateGte: this.arrival[0], // 到货日期小于等于
        realArrivalDateLte: this.arrival[1], // 到货日期小于等于
        beginReceiveTimeGte: this.createTime[0], // 创建日期大于等于
        beginReceiveTimeLte: this.createTime[1], // 创建日期小于等于
        searchCount: true
      };

      console.log(data)

      WarehousingAdmServers.queryOrderBill(data).then((res) => {
        const records = res.records;
        this.totalCount = res.totalCount;
        _this.listData = records;
      }).catch(err => {
        this.$message.error("数据请求失败" + err.message)
      });
    },
    handleCurrentChange: function(e) {
      this.page = Number(e);
      this.queryOrderBill(true);
    },
    handleSizeChange: function(e) {
      this.pageSize = Number(e);
      this.page = 1;
      this.queryOrderBill(true);
    },
    printingBtn(data) {
      console.log(data)
      this.$message.error("打印功能还未开通")
    }
  },
  created() {
    this.queryOrderBill();
    // WarehousingAdmServers.createTestOrderBill({
    //         description: '1',
    //         arrivalDate: '2020-11-11',
    //         beginReceiveTime: '2020-11-15',
    //         dcId: '000001',
    //         endReceiveTime: '2020-12-11',
    //         expireDate: '2020-12-11',
    //         inputTime: '2020-12-11',
    //         isLogisticMode: '越库',
    //         isTest: '1',
    //         remark: '111',
    //         srcApi: '来源',
    //         status: 'MANUAL',
    //         totalAmount: '11111',
    //         totalPdtCount: '1',
    //         totalQty: '1',
    //         totalQtystr: '1',
    //         totalReceivedAmount: '1',
    //         totalReceivedPdtCount: '1',
    //         totalReceivedQty: '1',
    //         totalReceivedQtystr: '1',
    //         totalReceivedVolume: '1',
    //         totalReceivedWeight: '1',
    //         totalVolume: '1',
    //         totalWeight: '1',
    //         trustType: 'TRUST',
    //         uploadTime: '2020-11-11',
    //         vendorCode: '111',
    //         vendorId: '1111',
    //         vendorName: '名称',
    //         wrhCode: '仓库代码',
    //         wrhId: '2002',
    //         wrhName: '13号仓库'
    // })
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      // 通过 `vm` 访问组件实例
      vm.queryOrderBill(0);
    })
  },
  filters: {
    setScope(status) {
      // 状态。INITIAL:初始，ARRIVED:已登记，QUALITY:已质检，RECEIVING:进行中，FINISHED:已完成，ABORTED:已取消
      switch (status) {
        case 'INITIAL':
          return "初始"
        case 'ARRIVED':
          return "已登记"
        case 'QUALITY ':
          return "已质检"
        case 'RECEIVING':
          return "进行中"
        case 'FINISHED':
          return "已完成"
        case 'ABORTED ':
          return "已取消"
        default:
          return '未知';
      }
    },
    setType(type) {
      switch (type) {
        case 'NOTTRUST':
          return "清点收货"
        case 'TRUST':
          return "信任收货"
        default:
          return '未知';
      }
    },
    setSrcApi(arcApi) {
      switch (arcApi) {
        case 'VENDOR':
          return "供应商采购"
        case 'PROCESS':
          return "加工中心"
        default:
          return '未知';
      }
    }
  }
};
</script>

<style lang="scss" scoped>
@import "src/styles/mixin.scss";
.input-width{
  &._picker{
    width: 580px
  }
}

</style>

<style lang="scss">
.table-index {
  @import "src/styles/mixin.scss";
  @include elTable;
}

// ._table-index .el-table .cell{
//   padding: 7px 0;
// }
</style>
