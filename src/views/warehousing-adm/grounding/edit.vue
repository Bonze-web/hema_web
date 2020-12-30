<template>
    <div>
        <div class="head">
            <div class="head-title">
                <div style="margin:8px">上架单详情</div>
                <div style="margin:11px 0 5px 0; font-size: 12px; color: #999"></div>
            </div>
            <div>
                <el-button @click="back">返回</el-button>
                <!-- <el-button type="primary"  @click="printingBtn">打印</el-button> -->
            </div>
        </div>
        <!-- <div style="height: 20px; background: #fff;" /> -->
        <div class="header-ground" >
            <div class="title-store" style="width: 150px">商品编码or条码: </div>
            <el-input type="text" placeholder="请输入商品编码or条码" v-model="productCodeOrProductName" class="input-width" style="width: 200px"></el-input>
        </div>

        <el-table :data="listData" style="width: 100%; text-align: center" :row-style="{ height: '16px', padding: '-4px' }" >
          <!-- <el-table-column prop="idx" label="序号">
            <template slot-scope="scope">{{ scope.row.idx}}</template>
          </el-table-column> -->

          <!-- <el-table-column prop="productCode" label="商品编码" style="height: 20px">
            <template slot-scope="scope">
              {{scope.row.productCode}}
          </el-table-column> -->

          <el-table-column prop="productName" label="商品名称">
            <template slot-scope="scope">{{ scope.row.productName}}</template>
          </el-table-column>

          <el-table-column prop="munit" label="单位" style="height: 20px">
            <template slot-scope="scope">{{ scope.row.munit }}</template>
          </el-table-column>

          <el-table-column prop="spec" label="规格">
            <template slot-scope="scope">
              {{ scope.row.spec }}
            </template>
          </el-table-column>

          <el-table-column prop="targetBinCode" label="应上货位">
            <template slot-scope="scope">
              {{ scope.row.targetBinCode }} 
            </template>
          </el-table-column>

          <el-table-column prop="binCode" label="实上货位">
            <template slot-scope="scope">
              {{ scope.row.binCode ? scope.row.binCode : "&lt;空&gt;" }}
            </template>
          </el-table-column>

          <el-table-column prop="productDate" label="生产日期">
            <template slot-scope="scope">
              {{ scope.row.productDate }}
            </template>
          </el-table-column>

          <el-table-column prop="validDate" label="到效日期">
            <template slot-scope="scope">
              {{ scope.row.validDate }}
            </template>
          </el-table-column>

        </el-table>

        <!-- <el-pagination
            style="float:right"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="1"
            :page-sizes="[10, 20, 30, 50]"
            :page-size="pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="totalCount">
        </el-pagination> -->
    </div>
</template>

<script>
// import GroundingService from "@/api/service/GroundingService";

export default {
  data() {
      return {
        listData: [],
        productCodeOrProductName: "",
        page: 1,
        pageSize: 10,
        totalCount: 0
      }
    },
    computed: {
    },
    methods: {
      back: function() {
        this.$store.dispatch("tagsView/delView", this.$route);
        this.$router.go(-1)
      },
      onSubmit() {
        // if (this.iptVal === '') {
        //   this.orderBillItems = this.dataList.orderBillItems
        // } else {
        //   this.orderBillItems = this.dataList.orderBillItems.filter((item) => {
        //     return item.billNumber.indexOf(this.iptVal) !== -1
        //   })
        // }
      },
      getByIdOrderBill() {
        this.listData = [
            {
              "amount": 0,
              "billId": "string",
              "billNumber": "string",
              "binCode": "string",
              "binId": "string",
              "binUsage": "string",
              "dcId": "string",
              "id": "string",
              "line": 0,
              "munit": "string",
              "price": 0,
              "productCode": "string",
              "productDate": "2020-12-28T12:37:48.834Z",
              "productId": "string",
              "productName": "string",
              "productionBatch": "string",
              "putawayTime": "2020-12-28T12:37:48.834Z",
              "qpc": 0,
              "qpcStr": "string",
              "qty": 0,
              "qtyStr": "string",
              "remark": "string",
              "sourceBinCode": "string",
              "sourceBinId": "string",
              "sourceBinUsage": "string",
              "spec": "string",
              "stockBatch": "string",
              "targetBinCode": "string",
              "targetBinId": "string",
              "targetBinUsage": "string",
              "validDate": "2020-12-28T12:37:48.834Z",
              "vendorCode": "string",
              "vendorId": "string",
              "vendorName": "string",
              "version": "string",
              "volume": 0,
              "weight": 0
          }
      ]
        // const data = {
        //   billIdEquals : this.$route.query.id,
        //   page : this.page,
        //   pageSize: this.pageSize,
        //   productCodeOrProductName: this.productCodeOrProductName,
        //   searchCount : true
        // }
        // WarehousingAdmServers.putwayBillQueryItems(this.id)
        // .then(res => {
        //   res.records.forEach((ele, idx) => {
        //       ele.idx = idx + 1;
        //       this.listData.push(ele);
        //   })
        //   this.totalCount = res.pageCount;
        // })
        // .catch(err => {
        //   this.$message.error("查询失败" + err.message)
        // });
      },
      handleCurrentChange: function(e) {
      this.page = Number(e);
      this.getByIdOrderBill(true);
      },
      handleSizeChange: function(e) {
        this.pageSize = Number(e);
        this.page = 1;
        this.getByIdOrderBill(true);
      }
    },
    created() {
      this.getByIdOrderBill()
    },
    filters: {
      setSrcWay(srcWay) {
        switch (srcWay) {
          case 'MANUAL':
            return "手工"
          case 'API':
            return "接口导入"
          case 'EXCEL ':
            return "文件导入"
          default:
            return '未知';
        }
      },
      setStatus(status) {
        switch (status) {
          case 'INITIAL':
            return "初始"
          case 'ARRIVED':
            return "已到货登记"
          case 'QUALITY ':
            return "已质检"
          case 'RECEIVING':
            return "进行中"
          case 'FINISHED':
            return "已完成"
          case 'ABORTED':
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
    }
    }
};
</script>

<style lang="scss" scoped>
@import "src/styles/mixin.scss";
.head{
    background: #fff;
    padding: 15px 12px;
    border-radius: 12px;
    border: 1px #eee solid;
    display: flex;
    justify-content: space-between;
}
.head-title{
    display: flex;
    justify-content: left;
}
.info-content{
    background: #fff;
    border-radius: 12px;
    padding: 15px 12px;
}
.info-box{
    margin: 4px 0;
    font-size: 12px;
    display: flex;
    justify-content: left;
}
.info-title{
    margin: 12px 0;
}
.header-ground {
  padding: 20px;
  display: flex;
  align-items: center;
  .title-store {
    padding-right: 20px;
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