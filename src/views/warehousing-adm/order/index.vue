<template>
  <div class="table-index _table-index">
    <div class="select-head">
      <el-form ref="form" style="display: flex;flex-wrap:wrap;" :model="form" label-width="90px" label-position="right" >

        <el-form-item label="单号：">
          <el-input type="text" placeholder="请输入单号" v-model="form.billNumberLike" class="input-width" ></el-input>
        </el-form-item>

        <el-form-item label="来源单号：">
          <el-input type="text" placeholder="请输入来源单号" v-model="form.srcBillNumberLike" class="input-width" ></el-input>
        </el-form-item>

        <el-form-item label="供应商：">
          <el-input type="text" placeholder="请输入供应商" v-model="form.vendorCodeEqualsOrNameLike" class="input-width" ></el-input>
        </el-form-item>

        <el-form-item label="入库仓库：">
          <el-input type="text" placeholder="请输入库仓库" v-model="form.wrhCodeEqualsOrNameLike" class="input-width" ></el-input>
        </el-form-item>

        <el-form-item label="商品：">
          <el-input type="text" placeholder="请输入商品" v-model="form.productCodeEqualsOrNameLike" class="input-width" ></el-input>
        </el-form-item>

        <el-form-item label="状态：">
          <el-select v-model="form.statusEquals" placeholder="请选择状态" class="input-width" >
            <el-option value="MANUAL" label="手工"></el-option>
            <el-option value="API" label="接口导入"></el-option>
            <el-option value="EXCEL" label="文件导入"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="到效日期：">
          <el-date-picker class="input-width" v-model="toEffect" type="datetimerange" format="yyyy-MM-dd" value-format="yyyy-MM-dd" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期" ></el-date-picker>
        </el-form-item>

        <el-form-item label="接收日期：">
          <el-date-picker class="input-width" v-model="receivingGoods" type="datetimerange" format="yyyy-MM-dd" value-format="yyyy-MM-dd" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期" ></el-date-picker>
        </el-form-item>

        <el-form-item label="到货日期：">
          <el-date-picker class="input-width" v-model="arrival" type="datetimerange" format="yyyy-MM-dd" value-format="yyyy-MM-dd" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期" ></el-date-picker>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" size="mini" @click="onSubmit" >立即搜索</el-button>
          <el-button size="mini" @click="clearInput">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    
    <div style="height: 20px" />

    <div style="background: #fff;">
      <!-- <el-row>
        <router-link :to="{ path: '/basicinfo/container/add' }" >
          <el-button style="margin: 18px 10px" type="primary" size="mini" >新建</el-button>
        </router-link>

        <el-button style="margin: 18px 10px" size="mini" @click="printingBtn" >打印</el-button>
      </el-row> -->


      <el-table :data="listData" style="width: 100%; text-align: center" :row-style="{ height: '16px', padding: '-4px' }" >
        <el-table-column prop="billNumber" label="单号" style="height: 20px">
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
        <el-table-column prop="inputTime" label="接收日期"></el-table-column>

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
        billNumberLike: '', // 单号
        srcBillNumberLike: '', //  来源单号
        vendorCodeEqualsOrNameLike: '', // 供应商代码等于或者名称类似于
        wrhCodeEqualsOrNameLike: '', // 入库仓库
        productCodeEqualsOrNameLike: '', // 商品代码等于或者名称类似于
        statusEquals: '' // 状态等于
      },
      toEffect: '', // 到效日期
      arrival: '', // 到货日期
      receivingGoods: '', // 收货日期
      page: 1,
      pageSize: 10,
      totalCount: 0
    };
  },
  computed: {},
  methods: {
    onSubmit: function() {
      console.log(this.value1)

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
        billNumberLike: '', // 单号
        srcBillNumberLike: '', //  来源单号
        vendorCodeEqualsOrNameLike: '', // 供应商代码等于或者名称类似于
        wrhCodeEqualsOrNameLike: '', // 入库仓库
        productCodeEqualsOrNameLike: '', // 商品代码等于或者名称类似于
        statusEquals: '' // 状态等于
      };

      this.toEffect = ''; // 到效日期
      this.arrival = ''; // 到货日期
      this.receivingGoods = ''; // 收货日期
    },
    queryOrderBill: function() {
      const _this = this;

      const data = {
        page: this.page,
        pageSize: this.pageSize,
        billNumberLike: this.form.billNumberLike, // 单号
        srcBillNumberLike: this.form.srcBillNumberLike, //  来源单号
        vendorCodeEqualsOrNameLike: this.form.vendorCodeEqualsOrNameLike, // 供应商代码等于或者名称类似于
        wrhCodeEqualsOrNameLike: this.form.wrhCodeEqualsOrNameLike, // 入库仓库
        productCodeEqualsOrNameLike: this.form.productCodeEqualsOrNameLike, // 商品代码等于或者名称类似于
        statusEquals: this.form.statusEquals, // 状态等于
        expireDateGte: this.toEffect[0], // 到效日期
        expireDateLte: this.toEffect[1], // 到效日期
        arrivalDateGte: this.arrival[0], // 到货日期小于等于
        arrivalDateLte: this.arrival[1], // 到货日期小于等于
        beginReceiveTimeGte: this.receivingGoods[0], // 接收日期大于等于
        beginReceiveTimeLte: this.receivingGoods[1] // 接收日期小于等于
      };

      const arr = [];

      for (let i = 0; i < 5; i++) {
        arr.push({
            billNumber: i + '2020',
            srcWay: i + '类型',
            vendorName: i + '33',
            wrhName: i + '333',
            isLogisticMode: i + '33',
            inputTime: i + '2020-10-10',
            endReceiveTime: i + '2020-10-1',
            expireDate: i + '2020-10-1',
            srcBillNumber: i + '333',
            status: 'EXCEL'
        })
      }

      _this.listData = arr

      WarehousingAdmServers.queryOrderBill(data).then((res) => {
        // const records = res.records;

        // this.totalCount = res.totalCount;

        console.log(res)

        // _this.listData = records;
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
    }
    // printingBtn() {
    //   this.$message.error("打印功能还未开通")
    // }
  },
  created() {
    this.queryOrderBill();
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      // 通过 `vm` 访问组件实例
      vm.queryOrderBill(0);
    })
  },
  filters: {
    setScope(status) {
      switch (status) {
        case 'MANUAL':
          return "手工"
        case 'API':
          return "接口导入"
        case 'EXCEL ':
          return "文件导入"
        default:
          return '未知';
      }
    }
  }
};
</script>

<style lang="scss" scoped>
@import "src/styles/mixin.scss";
</style>
<style lang="scss">
.table-index {
  @import "src/styles/mixin.scss";
  @include elTable;
}

._table-index .el-table .cell{
  padding: 7px 0;
}
</style>
