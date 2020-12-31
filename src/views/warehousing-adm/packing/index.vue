<template>
  <div class="table-index _table-index">
    <div class="select-head">
      <el-form ref="form" style="display: flex;flex-wrap:wrap;" :model="form" label-width="180px" label-position="right" >

        <el-form-item label="收货装箱单号：">
          <el-input type="text" placeholder="请输入收货装箱单号" v-model="form.billNumberEquals" class="input-width" ></el-input>
        </el-form-item>

        <el-form-item label="入库订单或外部单号：">
          <el-input type="text" placeholder="请输入入库订单或外部单号" v-model="form.orderBillNumberOrSrcNumberEquals" class="input-width" ></el-input>
        </el-form-item>

        <el-form-item label="供应商：">
          <el-input type="text" placeholder="请输入供应商" v-model="form.vendorCodeOrNameLike" class="input-width" ></el-input>
        </el-form-item>

        <el-form-item label="容器码：">
          <el-input type="text" placeholder="请输容器码" v-model="form.containerBarcodeEquals" class="input-width" ></el-input>
        </el-form-item>
        <el-form-item label="操作人：">
          <el-input type="text" placeholder="请输入操作人" v-model="form.creatorNameOrCodeEquals" class="input-width" ></el-input>
        </el-form-item>
        <!-- ==== -->
        <el-form-item label="状态：">
          <el-select v-model="form.status" placeholder="请选择状态" class="input-width" >
            <el-option value="" label="全部"></el-option>
            <el-option value="INITIAL" label="初始"></el-option>
            <el-option value="RECEIVED" label="暂存"></el-option>
            <el-option value="PUTAWAY" label="上架完成"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="入库日期：">
          <el-date-picker class="input-width _picker" v-model="warehousingTime" type="datetimerange" value-format="yyyy-MM-dd HH:mm:ss" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期" ></el-date-picker>
        </el-form-item>
        
        <el-form-item label="收货日期：">
          <el-date-picker class="input-width _picker" v-model="shipmentTime" type="datetimerange" value-format="yyyy-MM-dd HH:mm:ss" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期" ></el-date-picker>
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
        </router-link>

        <el-button style="margin: 18px 10px" size="mini" @click="printingBtn" >打印</el-button> -->

        <!-- <router-link  :to="{ path: '/warehousing-adm/packing/edit', query:{ id: '20202020' } }" >
          <el-button style="margin: 18px 10px" type="primary" size="mini" >测试跳往详情页面</el-button>
        </router-link> -->
      </el-row>


      <el-table :data="listData" style="width: 100%; text-align: center" :row-style="{ height: '16px', padding: '-4px' }" >
        <!-- <el-table-column type="selection" width="55"></el-table-column> -->
        <el-table-column type="index" label="序号"></el-table-column>

        <el-table-column prop="scope" label="收货装箱单号" style="height: 20px">
          <template slot-scope="scope">
            <router-link style="color: #409eff" :to="{ path: '/warehousing-adm/packing/edit', query:{ id: scope.row.id } }" >
              <span>{{ scope.row.billNumber }}</span>
            </router-link>
          </template>
        </el-table-column>

        <!-- <el-table-column prop="b" label="到货通知单号"></el-table-column> -->

        <el-table-column prop="scope" label="收货类型" style="height: 20px">
          <template slot-scope="scope">{{ scope.row.type | setType }}</template>
        </el-table-column>

        <el-table-column prop="scope" label="容器码">
          <template slot-scope="scope">
            {{ scope.row.containerBarcode }}
          </template>
        </el-table-column>

        <el-table-column prop="scope" label="开始收货时间">
          <template slot-scope="scope">
            {{ scope.row.beginReceiveTime ? scope.row.beginReceiveTime : "&lt;空&gt;" }}
          </template>
        </el-table-column>

        <el-table-column prop="scope" label="收货完成时间">
          <template slot-scope="scope">
            {{ scope.row.endReceiveTime ? scope.row.endReceiveTime : "&lt;空&gt;" }}
          </template>
        </el-table-column>

        <el-table-column prop="scope" label="上架完成时间">
          <template slot-scope="scope">
            {{ scope.row.uploadTime ? scope.row.uploadTime : "&lt;空&gt;" }}
          </template>
        </el-table-column>

        <el-table-column prop="vendorName" label="供应商"></el-table-column>

        <el-table-column prop="scope" label="操作人">
          <template slot-scope="scope">
            {{ scope.row.updatorName }}
          </template>
        </el-table-column>

        <el-table-column prop="scope" label="状态">
          <template slot-scope="scope">
            {{ scope.row.status | setStatus }}
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
        billNumberEquals: '', // 收货装箱单号：
        orderBillNumberOrSrcNumberEquals: '', // 入库订单或外部单号
        vendorCodeOrNameLike: '', // 供应商
        containerBarcodeEquals: '', // 容器码
        creatorNameOrCodeEquals: '', // 操作人
        status: '' // 状态
      },
      warehousingTime: '', // 入库时间
      shipmentTime: '', // 收货时间
      page: 1,
      pageSize: 10,
      totalCount: 0
    };
  },
  computed: {},
  methods: {
    onSubmit: function() {
      const _this = this;
      this.page = 1;

      this.$refs.form.validate((result) => {
        if (result) {
          _this.packingQuery();
        }
      });
    },
    clearInput: function() {
      this.form = {
        billNumberEquals: '', // 收货装箱单号：
        orderBillNumberOrSrcNumberEquals: '', // 入库订单或外部单号
        vendorCodeOrNameLike: '', // 供应商
        containerBarcodeEquals: '', // 容器码
        creatorNameOrCodeEquals: '', // 操作人
        status: '' // 状态
      };

      this.warehousingTime = ''; // 入库时间
      this.shipmentTime = ''; // 收货时间
    },
    putFinish(billNumber, version) {
      // console.log(billNumber, version)
      // 确认收货
      const _this = this;
      this.$confirm('是否确认收货?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const obj = {
          billNumber,
          version
        }
        WarehousingAdmServers.finishOrderBill(obj)
        .then(res => {
          this.$message.success("收货成功")
          _this.packingQuery()
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
    packingQuery: function() {
      const _this = this;

      const data = {
        page: this.page,
        pageSize: this.pageSize,
        billNumberEquals: this.form.billNumberEquals ? this.form.billNumberEquals : null,
        orderBillNumberOrSrcNumberEquals: this.form.orderBillNumberOrSrcNumberEquals ? this.form.orderBillNumberOrSrcNumberEquals : null,
        vendorCodeOrNameLike: this.form.vendorCodeOrNameLike ? this.form.vendorCodeOrNameLike : null,
        containerBarcodeEquals: this.form.containerBarcodeEquals ? this.form.containerBarcodeEquals : null,
        creatorNameOrCodeEquals: this.form.creatorNameOrCodeEquals ? this.form.creatorNameOrCodeEquals : null,
        statusIn: this.form.status ? this.form.status : null,
        orderBillBeginDate: this.warehousingTime[0] ? this.warehousingTime[0] : null,
        orderBillEndDate: this.warehousingTime[1] ? this.warehousingTime[1] : null,
        receiveBillBeginDate: this.shipmentTime[0] ? this.shipmentTime[0] : null,
        receiveBillEndDate: this.shipmentTime[1] ? this.shipmentTime[1] : null,
        searchCount: true
      };

      WarehousingAdmServers.packingQuery(data).then((res) => {
        console.log(res)
        const records = res.records;
        this.totalCount = res.totalCount;
        _this.listData = records;
      }).catch(err => {
        this.$message.error("数据请求失败" + err.message)
      });
    },
    handleCurrentChange: function(e) {
      this.page = Number(e);
      this.packingQuery(true);
    },
    handleSizeChange: function(e) {
      this.pageSize = Number(e);
      this.page = 1;
      this.packingQuery(true);
    },
    printingBtn() {
      // this.$message.error("打印功能还未开通")
    }
  },
  created() {
    this.packingQuery();
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      // 通过 `vm` 访问组件实例
      vm.packingQuery(0);
    })
  },
  filters: {
    setType(type) {
      // 收货类型，FAST：快速收货，NORMAL：正常收货，TRUST：信任收货
      switch (type) {
        case 'FAST':
          return "快速收货"
        case 'NORMAL':
          return "正常收货"
        case 'TRUST':
          return "信任收货"
        default:
          return '未知';
      }
    },
    setStatus(status) {
      // 状态。INITIAL:初始，RECEIVED:暂存，PUTAWAY:上架完成
      switch (status) {
        case 'INITIAL':
          return "初始"
        case 'RECEIVED':
          return "暂存"
        case 'PUTAWAY':
          return "上架完成"
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

._table-index .el-table .cell{
  padding: 7px 0;
}
</style>
