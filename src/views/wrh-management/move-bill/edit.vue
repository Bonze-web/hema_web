<template>
    <div>
        <div v-if="status === 'read'">
        <div class="head" v-if="status === 'read'">
            <div class="head-title">
                <div class="status">{{ moveBillDetail.status | billStatus }}</div>
                <div style="margin:8px">{{ '移库单：' + moveBillDetail.billNumber }}</div>
            </div>
        </div>
        <div style="height:20px" />
        <div class="info-content" v-if="status === 'read'">
            <div>
                <template>
                    <el-tabs v-model="tabActiveName">
                        <el-tab-pane label="移库单" name="containerType">
                            <div class="info-title">概要</div>
                            <el-col :span="6" class="info-box">
                                <div>移库类型:</div>
                                <div>{{ moveBillDetail.moveType }}</div>
                            </el-col>
                            <el-col :span="6" class="info-box">
                                <div>移库员:</div>
                                <div>{{ moveBillDetail.moverName }}</div>
                            </el-col>
                            <el-col :span="6" class="info-box">
                                <div>创建时间:</div>
                                <div>{{ moveBillDetail.createTime }}</div>
                            </el-col>
                            <el-col>
                              <div class="info-title">商品</div>
                            </el-col>
                            <el-table
                                        :data="productList"
                                        style="width: 100%;text-align:center"
                                    >
                                        <el-table-column width="55" prop="line" label="行">
                                          <template slot-scope="scope">
                                            {{ scope.$index + 1 }}
                                          </template>
                                        </el-table-column>
                                        <el-table-column width="100" prop="productName" label="商品/商品规格"></el-table-column>
                                        <el-table-column width="100" prop="qpcStr" label="规格/计量单位"></el-table-column>
                                        <el-table-column width="100" prop="fromBinCode" label="来源货位">
                                          <template slot-scope="scope">
                                            {{ '[' + scope.row.fromBinCode + ']' + scope.row.fromBinUsage }}
                                          </template>
                                        </el-table-column>
                                        <el-table-column width="100" prop="fromContainerBarcode" label="来源容器"></el-table-column>
                                        <el-table-column width="100" prop="toBinCode" label="目标货位">
                                          <template slot-scope="scope">
                                            {{ '[' + scope.row.toBinCode + ']' + scope.row.toBinUsage }}
                                          </template>
                                        </el-table-column>
                                        <el-table-column width="100" prop="validDate" label="目标容器">
                                          <template slot-scope="scope">
                                            {{ scope.row.toContainerBarcode ? scope.row.toContainerBarcode : '&lt;空&gt;' }}
                                          </template>
                                        </el-table-column>
                                        <el-table-column width="100" prop="productionBatch" label="批号"></el-table-column>
                                        <el-table-column width="100" prop="stockBatch" label="批次"></el-table-column>
                                        <el-table-column width="100" prop="consumeQtystr" label="生产日期"></el-table-column>
                                        <el-table-column width="100" prop="validDate" label="到效日期"></el-table-column>
                                        <el-table-column width="100" prop="vendorCode" label="供应商">
                                          <template slot-scope="scope">
                                            {{ '[' + scope.row.vendorCode + ']' + scope.row.vendorName }}
                                          </template>
                                        </el-table-column>
                                        <el-table-column width="100" prop="qty" label="件数"></el-table-column>
                                    </el-table>
                        </el-tab-pane>
                        <!-- <el-tab-pane label="配送中心范围" name="range">配置管理</el-tab-pane> -->
                        <el-tab-pane label="操作日志" name="log">
                          <system-log modular="DECINVBILL"></system-log>
                        </el-tab-pane>
                    </el-tabs>
                </template>
            </div>
        </div>
        </div>
    </div>
</template>

<script>
import BillService from "@/api/service/BillService";
import systemLog from "@/components/systemLog.vue";

export default {
  data() {
      return {
        tabActiveName: 'containerType',
        id: '', // 移库单ID
        moveBillDetail: {},
        productList: []
      }
    },
    components: {
      systemLog
    },
    methods: {
      getQueryStatus: function() {
        this.status = this.$route.query.status
        if (this.status === 'read') {
          this.id = this.$route.query.id
          this.getBillDetail(this.id)
        }
      },
      getBillDetail: function() {
        BillService.getMovebillDetail(this.id)
        .then((result) => {
          this.moveBillDetail = result
          this.productList = result.moveBillItemList
        }).catch((err) => {
          this.$message.error('获取移库单详情失败' + err.message)
        });
      }
    },
    created() {
      this.getQueryStatus()
    },
    filters: {
      billStatus(status) {
        switch (status) {
          case "INITIAL":
            return "初始状态"
          case "INPROGRESS":
            return "移库中"
          case "AUDITED":
            return "已完成"
          default:
            return "未知"
        }
      }
      // moveType(type) {
      //   switch (type) {
      //     case "SURPLUSSOW":
      //       return ""
      //       break;
        
      //     default:
      //       break;
      //   }
      // }
    }
};
</script>

<style lang="scss" scoped>
// @import "src/styles/mixin.scss";
.status{
  background: #008000;
  border-radius: 8px;
  padding: 4px;
  height: 32px;
  line-height: 26px;
}
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
    display: flex;
    justify-content: space-between;
}
.list-count{
    display: flex;
}
</style>
