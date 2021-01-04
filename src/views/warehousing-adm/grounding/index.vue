<template>
  <div class="table-index _table-index">
    <div class="select-head">
      <el-form ref="form" style="display: flex;flex-wrap:wrap;" :model="form" label-width="180px" label-position="right" >

        <el-form-item label="上架单号: ">
          <el-input type="text" placeholder="请输入上架单" v-model="form.billNumberLike" class="input-width" ></el-input>
        </el-form-item>

        <el-form-item label="收货装箱单号: ">
          <el-input type="text" placeholder="请输入收货装箱单号" v-model="form.receiveBillNumberLike" class="input-width" ></el-input>
        </el-form-item>

        <el-form-item label="上架单状态: ">
          <el-select v-model="form.status" placeholder="请选择状态" class="input-width" >
            <el-option value="INITIAL" label="初始"></el-option>
            <el-option value="FINISH" label="已完成"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="来源容器条码：">
          <el-input type="text" placeholder="来源容器条码" v-model="form.sourceContainerBarcodeEquals" class="input-width" maxlength="50"></el-input>
        </el-form-item>

        <el-form-item label="上架容器条码：">
          <el-input type="text" placeholder="上架容器条码" v-model="form.containerBarcodeEquals" class="input-width" maxlength="50"></el-input>
        </el-form-item>

        <el-form-item label="操作人：">
           <el-input type="text" placeholder="操作人" v-model="form.putawayerNameLike" class="input-width" maxlength="50"></el-input>
        </el-form-item>

        <el-form-item label="创建日期: ">
          <el-date-picker class="input-width" v-model="createTime" type="datetimerange" format="yyyy-MM-dd" value-format="yyyy-MM-dd HH:mm:ss" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期" ></el-date-picker>
        </el-form-item>
        <!-- <el-form-item label="入库订单号/外部单号：">
          <el-input type="text" placeholder="请输入入库订单号/外部单号" v-model="form.srcBillNumberLike" class="input-width" maxlength="50" ></el-input>
        </el-form-item> -->
        
        <el-form-item>
          <el-button type="primary" size="mini" @click="onSubmit" >立即搜索</el-button>
          <el-button size="mini" @click="clearInput">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    
    <div style="height: 20px;" />

    <div style="background: #fff;">
      <!-- <div class="header-ground" >
          <div class="title-store">商品编码or条码</div>
          <el-input type="text" placeholder="请输入商品编码or条码" v-model="form.billNumberLike" class="input-width" ></el-input>
      </div> -->
      <div style="display: flex;justify-content: flex-end;font-size:12px; color: #909399;padding:20px;">
        <span>共{{totalCount}}条数据</span>
      </div>
      <el-table :data="listData" style="width: 100%; text-align: center" :row-style="{ height: '16px', padding: '-4px' }" >
        <!-- <el-table-column type="selection" width="55"></el-table-column> -->
        <el-table-column prop="idx" label="序号">
          <template slot-scope="scope">{{ scope.row.idx}}</template>
        </el-table-column>

        <el-table-column prop="billNumber" label="单号" style="height: 20px">
          <template slot-scope="scope">
            <span>{{ scope.row.billNumber }}</span>
          </template>
        </el-table-column>

        <el-table-column prop="receiveBillNumber" label="容器装箱单">
           <template slot-scope="scope">{{ scope.row.receiveBillNumber}}</template>
        </el-table-column>

        <el-table-column prop="containerBarcode" label="容器号" style="height: 20px">
          <template slot-scope="scope">{{ scope.row.containerBarcode }}</template>
        </el-table-column>

        <el-table-column prop="beginPutawayTime" label="创建时间">
          <template slot-scope="scope">
            {{ scope.row.beginPutawayTime }}
          </template>
        </el-table-column>

        <el-table-column prop="endPutawayTime" label="完成时间">
          <template slot-scope="scope">
            {{ scope.row.endPutawayTime }} 
          </template>
        </el-table-column>

        <el-table-column prop="putawayerName" label="操作人">
          <template slot-scope="scope">
            {{ scope.row.putawayerName ? scope.row.putawayerName : "&lt;空&gt;" }}
          </template>
        </el-table-column>

        <el-table-column prop="status" label="状态">
          <template slot-scope="scope">
            {{ scope.row.status | setScope }}
          </template>
        </el-table-column>


        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button size="mini" type="text" @click="putFinish(scope.row)">查看</el-button>
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
import GroundingService from "@/api/service/GroundingService";

export default {
  data() {
    return {
      listData: [], // 列表数据
      form: {
        billNumberLike: '' || null, // 单号
        receiveBillNumberLike: '' || null, 
        status: '' || null, // 状态等于
        sourceContainerBarcodeEquals: '' || null,
        containerBarcodeEquals: "" || null,
        putawayerNameLike: "" || null,
        searchCount: true
      },
      createTime: '' || null, // 创建日期
      page: 1,
      pageSize: 10,
      totalCount: 0,
      downList: '' || null
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
        billNumberLike: '' || null, // 单号
        receiveBillNumberLike: '' || null, 
        status: '' || null, // 状态等于
        sourceContainerBarcodeEquals: '' || null,
        containerBarcodeEquals: '' || null,
        putawayerNameLike: '' || null,
        searchCount: true
      };
      this.page = 1;
      this.pageSize = 10;
      this.createTime = "";
      this.queryOrderBill();
    },
    putFinish(obj) {
      // const _this = this;
      this.$router.push({name: 'GroundingEdit', query: {id: obj.id}})
    },
    queryOrderBill: function() {
      this.form.page = this.page;
      this.form.pageSize = this.pageSize;
      this.form.beginPutawayTimeEnd = null || (this.createTime && this.createTime[0])
      this.form.beginPutawayTimeStart = null || (this.createTime && this.createTime[1]);
       console.log(this.form);
      GroundingService.putwayBillQuery(this.form).then((res) => {
        this.listData = [];
        this.totalCount = res.totalCount;
        res.records.forEach((ele, idx) => {
            ele.idx = idx + 1;
            this.listData.push(ele);
        })
        // this.listData = res.records;
      }).catch(err => {
        this.$message.error("数据请求失败" + err.message)
      });
      //  this.listData = [
      //   {
      //   idx: 1,
      //   "beginPutawayTime": "2021-01-02T07:09:22.818Z",
      //   "billNumber": "string",
      //   "containerBarcode": "string",
      //   "createTime": "2021-01-02T07:09:22.818Z",
      //   "creatorId": "string",
      //   "creatorName": "string",
      //   "endPutawayTime": "2021-01-02T07:09:22.818Z",
      //   "id": "string",
      //   "orgId": "string",
      //   "putawayerName": "string",
      //   "receiveBillNumber": "string",
      //   "sourceContainerBarcode": "string",
      //   "status": "INITIAL",
      //   "updateTime": "2021-01-02T07:09:22.818Z",
      //   "updatorId": "string",
      //   "updatorName": "string",
      //   "version": "string"
      // },
      // {
      //   idx: 2,
      //   "beginPutawayTime": "2021-01-02T07:09:22.818Z",
      //   "billNumber": "string",
      //   "containerBarcode": "string",
      //   "createTime": "2021-01-02T07:09:22.818Z",
      //   "creatorId": "string",
      //   "creatorName": "string",
      //   "endPutawayTime": "2021-01-02T07:09:22.818Z",
      //   "id": "string",
      //   "orgId": "string",
      //   "putawayerName": "string",
      //   "receiveBillNumber": "string",
      //   "sourceContainerBarcode": "string",
      //   "status": "INITIAL",
      //   "updateTime": "2021-01-02T07:09:22.818Z",
      //   "updatorId": "string",
      //   "updatorName": "string",
      //   "version": "string"
      // }
      // ]
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
  },
  created() {
    // this.queryOrderBill();
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
        case 'INITIAL':
          return "初始"
        case 'FINISH':
          return "已完成"
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
.header-ground {
  padding: 20px;
  display: flex;
  align-items: center;
  .title-store {
    padding-right: 20px;
  }
}
// .table-index .el-table .cell{
//   padding-left: 0;
//   margin: 10px
// }
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
