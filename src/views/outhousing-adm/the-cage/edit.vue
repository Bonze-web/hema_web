<template>
    <div>
        <div class="head">
            <div class="head-title">
                <div style="margin:8px">{{ dataList.billNumber  }}</div>
                <div style="margin:11px 0 5px 0; font-size: 12px; color: #999">{{ dataList.status | setStatus }}</div>
                
            </div>
            <div>
                <el-button @click="back">返回</el-button>
            </div>
        </div>
        <div style="height:20px" />

        <!-- 展示 -->
        <div class="info-content table-index _table-index">
            <div>
                <template>
                    <el-tabs v-model="tabActiveName">
                        <el-tab-pane label="装笼单详情" name="category">
                            <div class="info-title">基本信息</div>
                            <el-col :span="6" class="info-box">
                                <div>区块码:</div>
                                <div>{{ dataList.blockCode }}</div>
                            </el-col>

                            <el-col :span="6" class="info-box">
                                <div>集货位码:</div>
                                {{ dataList.collectBinCode }}
                            </el-col>

                            <el-col :span="6" class="info-box">
                                <div>集货人时间:</div>
                                <div>{{ dataList.collectTime }}</div>
                            </el-col>

                            <el-col :span="6" class="info-box">
                                <div>容器码:</div>
                                {{ dataList.containerCode }}
                            </el-col>

                            <el-col :span="6" class="info-box">
                                <div>装车人时间:</div>
                                {{ dataList.entrunckTime }}
                            </el-col>

                            <el-col :span="6" class="info-box">
                                <div>网格仓:</div>
                                {{ dataList.frontDcName }}
                            </el-col>

                            <el-col :span="6" class="info-box">
                                <div>装笼人:</div>
                                {{ dataList.palletUserName }}
                            </el-col>

                            <el-col :span="6" class="info-box">
                                <div>装笼人时间:</div>
                                {{ dataList.palletTime }}
                            </el-col>

                            <el-col :span="6" class="info-box">
                                <div>收货时间:</div>
                                {{ dataList.receiveTime }}
                            </el-col>

                            <el-col :span="6" class="info-box">
                                <div>发运人:</div>
                                {{ dataList.shipUserName }}
                            </el-col>

                            <el-col :span="6" class="info-box">
                                <div>发运人时间:</div>
                                {{ dataList.shipTime }}
                            </el-col>

                            <el-col :span="6" class="info-box">
                                <div>仓库:</div>
                                {{ dataList.wrhName }}
                            </el-col>

                            <br>

                            <el-col><div  class="info-title title">商品信息</div></el-col>
                            <div style="height:20px" />

                            <el-table :data="dataList.loadPalletItemDTOList" style="width: 100%; text-align: center" :row-style="{ height: '16px', padding: '-4px' }" >
                            <el-table-column prop="productCode" label="商品编码"></el-table-column>
                            <el-table-column prop="productName" label="商品名"></el-table-column>
                            <el-table-column prop="batch" label="批次"></el-table-column>
                            <el-table-column prop="containerCode" label="二级容器"></el-table-column>
                            <el-table-column prop="loadPalletNumber" label="装笼单号"></el-table-column>
                            <el-table-column prop="qpc" label="规格数"></el-table-column>
                            <el-table-column prop="unit" label="单位"></el-table-column>
                            <el-table-column prop="qpcStr" label="规格"></el-table-column>
                            <el-table-column prop="qty" label="数量"></el-table-column>
                            <el-table-column prop="qtyStr" label="件数"></el-table-column>
                          </el-table>


                        </el-tab-pane>

                        <!-- <el-tab-pane label="操作日志" name="log">
                          <system-log modular="CONTAINER" :id="id"></system-log>
                        </el-tab-pane> -->
                    </el-tabs>
                </template>
            </div>
        </div>
    </div>
</template>

<script>
import systemLog from "@/components/systemLog.vue";
import DeliveryService from "@/api/service/DeliveryService";

export default {
  data() {
      return {
        tabActiveName: 'category', // tab栏名称
        status: '', // 页面状态
        id: '', // 货位类别ID
        dataList: {} // 详情数据
      }
    },
    computed: {
    },
    components: {
      systemLog
    },
    methods: {
      back: function() {
        this.$store.dispatch("tagsView/delView", this.$route);
        this.$router.go(-1)
      },
      loadPalletDetils: function() {
        this.id = this.$route.query.id;
        console.log(this.id)
        DeliveryService.loadPalletDetils(this.id)
        .then((res) => {
          this.dataList = res;
        })
        .catch((err) => {
          this.$message.error("获取详情失败" + err.message)
        })
      },
      printingBtn() {
        this.$message.error("打印功能还未开通")
      }
    },
    created() {
      this.loadPalletDetils()
    },
    filters: {
      setStatus(type) {
        // 状态 CREATED:创建, PALLETED : 装笼完成；COLLECTED: 集货完成, ENTRUNCKED：已装车，SHIPED: 已发运，RECEIVED：已收货，MERGE_PALLETED 已拼笼
        switch (type) {
          case 'CREATED':
            return "创建"
          case 'PALLETED':
            return "装笼完成"
          case 'COLLECTED':
            return "集货完成"
          case 'ENTRUNCKED':
            return "已装车"
          case 'SHIPED':
            return "已发运"
          case 'RECEIVED':
            return "已收货"
          case 'MERGE_PALLETED':
            return "已拼笼"
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