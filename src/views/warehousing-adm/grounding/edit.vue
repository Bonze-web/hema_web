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
        <div style="height: 20px;" />
        <div class="header-ground" style="background:#fff">
            <div class="title-store" style="width: 150px">商品代码: </div>
            <el-input type="text" placeholder="请输入商品代码" v-model="productCodeEquals" class="input-width" style="width: 200px" @change="getByIdOrderBill"></el-input>
        </div>
        <div style="display: flex;justify-content: flex-end;font-size:12px; color: #909399;padding:20px;background:#fff">
          <span>共{{totalCount}}条数据</span>
        </div>
        <el-table :data="listData" style="width: 100%; text-align: center" :row-style="{ height: '16px', padding: '-4px', textAlign: 'center'}" >
          <!-- <el-table-column prop="idx" label="序号">
            <template slot-scope="scope">{{ scope.row.idx}}</template>
          </el-table-column> -->

          <!-- <el-table-column prop="productCode" label="商品编码" style="height: 20px">
            <template slot-scope="scope">
              {{scope.row.productCode}}
          </el-table-column> -->

          <el-table-column prop="line" label="行号">
            <template slot-scope="scope">{{ scope.row.line}}</template>
          </el-table-column>

          <el-table-column prop="billNumber" label="单号" style="height: 20px">
            <template slot-scope="scope">{{ scope.row.billNumber }}</template>
          </el-table-column>

          <el-table-column prop="amount" label="金额">
            <template slot-scope="scope">
              {{ scope.row.amount }}
            </template>
          </el-table-column>

          <el-table-column prop="binCode" label="上架货位">
            <template slot-scope="scope">
              {{ scope.row.binCode }} 
            </template>
          </el-table-column>

          <el-table-column prop="binUsage" label="上架货位用途">
            <template slot-scope="scope">
              {{ scope.row.binUsage | binUsageChange }}
            </template>
          </el-table-column>

          <el-table-column prop="munit" label="计量单位">
            <template slot-scope="scope">
              {{ scope.row.munit }}
            </template>
          </el-table-column>

          <el-table-column prop="productName" label="商品名">
            <template slot-scope="scope">
              {{ scope.row.productName }}
            </template>
          </el-table-column>
          <el-table-column prop="price" label="商品单价">
            <template slot-scope="scope">
              {{ scope.row.price }}
            </template>
          </el-table-column>
          <el-table-column prop="productCode" label="商品编码">
            <template slot-scope="scope">
              {{ scope.row.productCode }}
            </template>
          </el-table-column>
          <el-table-column prop="productDate" label="商品生产日期">
            <template slot-scope="scope">
              {{ scope.row.productDate }}
            </template>
          </el-table-column>
          <el-table-column prop="productionBatch" label="批号">
            <template slot-scope="scope">
              {{ scope.row.productionBatch }}
            </template>
          </el-table-column>
          <el-table-column prop="putawayTime" label="上架时间">
            <template slot-scope="scope">
              {{ scope.row.putawayTime }}
            </template>
          </el-table-column>
          <el-table-column prop="qpcStr" label="规格">
            <template slot-scope="scope">
              {{ scope.row.qpcStr }}
            </template>
          </el-table-column>
          <el-table-column prop="spec" label="商品规格描述">
            <template slot-scope="scope">
              {{ scope.row.spec }}
            </template>
          </el-table-column>
          <el-table-column prop="qty" label="数量">
            <template slot-scope="scope">
              {{ scope.row.qty }}
            </template>
          </el-table-column>
          <el-table-column prop="qtyStr" label="件数">
            <template slot-scope="scope">
              {{ scope.row.qtyStr }}
            </template>
          </el-table-column>
          <el-table-column prop="volume" label="体积">
            <template slot-scope="scope">
              {{ scope.row.volume }}
            </template>
          </el-table-column>
          <el-table-column prop="weight" label="重量">
            <template slot-scope="scope">
              {{ scope.row.weight }}
            </template>
          </el-table-column>
          <el-table-column prop="sourceBinCode" label="来源货位编码">
            <template slot-scope="scope">
              {{ scope.row.sourceBinCode }}
            </template>
          </el-table-column>
          <el-table-column prop="sourceBinUsage" label="来源货位用途">
            <template slot-scope="scope">
              {{ scope.row.sourceBinUsage }}
            </template>
          </el-table-column>
          <el-table-column prop="stockBatch" label="批次">
            <template slot-scope="scope">
              {{ scope.row.stockBatch }}
            </template>
          </el-table-column>
          <el-table-column prop="targetBinCode" label="目标货位编码">
            <template slot-scope="scope">
              {{ scope.row.targetBinCode }}
            </template>
          </el-table-column>
          <el-table-column prop="targetBinUsage" label="目标货位用途">
            <template slot-scope="scope">
              {{ scope.row.targetBinUsage | binUsageChange}}
            </template>
          </el-table-column>
          <el-table-column prop="validDate" label="商品到效期">
            <template slot-scope="scope">
              {{ scope.row.validDate }}
            </template>
          </el-table-column>
          <el-table-column prop="vendorCode" label="供应商编码">
            <template slot-scope="scope">
              {{ scope.row.vendorCode }}
            </template>
          </el-table-column>
          <el-table-column prop="vendorName" label="供应商名字">
            <template slot-scope="scope">
              {{ scope.row.vendorName }}
            </template>
          </el-table-column>
          <el-table-column prop="remark" label="备注">
            <template slot-scope="scope">
              {{ scope.row.remark }}
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
import GroundingService from "@/api/service/GroundingService";

export default {
  data() {
      return {
        listData: [],
        productCodeEquals: "",
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
      //   this.listData = [
      //       {
      //         "amount": 0,
      //         "billId": "string",
      //         "billNumber": "string",
      //         "binCode": "string",
      //         "binId": "string",
      //         "binUsage": "string",
      //         "dcId": "string",
      //         "id": "string",
      //         "line": 0,
      //         "munit": "string",
      //         "price": 0,
      //         "productCode": "string",
      //         "productDate": "2020-12-28T12:37:48.834Z",
      //         "productId": "string",
      //         "productName": "string",
      //         "productionBatch": "string",
      //         "putawayTime": "2020-12-28T12:37:48.834Z",
      //         "qpc": 0,
      //         "qpcStr": "string",
      //         "qty": 0,
      //         "qtyStr": "string",
      //         "remark": "string",
      //         "sourceBinCode": "string",
      //         "sourceBinId": "string",
      //         "sourceBinUsage": "string",
      //         "spec": "string",
      //         "stockBatch": "string",
      //         "targetBinCode": "string",
      //         "targetBinId": "string",
      //         "targetBinUsage": "string",
      //         "validDate": "2020-12-28T12:37:48.834Z",
      //         "vendorCode": "string",
      //         "vendorId": "string",
      //         "vendorName": "string",
      //         "version": "string",
      //         "volume": 0,
      //         "weight": 0
      //     }
      // ]
        const data = {
          billIdEquals: this.$route.query.id,
          page: this.page,
          pageSize: this.pageSize,
          productCodeEquals: this.productCodeEquals || null,
          searchCount: true
        }
        GroundingService.putwayBillQueryItems(data)
        .then(res => {
          this.listData = [];
          res.records.forEach((ele, idx) => {
              ele.idx = idx + 1;
              this.listData.push(ele);
          })
          this.totalCount = res.totalCount;
        })
        .catch(err => {
          this.$message.error("查询失败" + err.message)
        });
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
      },
      binUsageChange(status) {
        switch (status) {
        case "UNIFYRECEIVE":
          return "统配收货暂存位"
        case "PUTAWAY":
          return "上架中转位"
        case "PICK":
          return "拣货位"
        case "STORAGE":
          return "存储位"
        case "PICK_STORAGE":
          return "拣货存储位"
        case "UNIFYPICK":
          return "统配拣货暂存位"
        case "UNIFYCOLLECT":
          return "统配集货存储位"
        case "RPL":
          return "补货暂存位"
        case "TRANSFERRECEIVE":
          return "中转收货暂存位"
        case "TRANSFERCOLLECT":
          return "中转集货暂存位"
        case "DIRECTRECEIVE":
          return "直通收货暂存位"
        case "STORECROSSALLOCATE":
          return "门店分拨位"
        case "STORERTN":
          return "门店退货收货暂存位"
        case "VENDORRTN":
          return "供应商退货位"
        case "VENDORCOLLECT":
          return "供应商集货位"
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
/deep/ .el-table .cell {
  text-align: center;
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