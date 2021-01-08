<template>
    <div>
        <div class="head">
            <div class="head-title">
                <div style="margin:8px">{{ dataList.billNumber  }}</div>
                <div style="margin:11px 0 5px 0; font-size: 12px; color: #999">{{ dataList.status | setStatus }}</div>
                
            </div>
            <div>
                <el-button @click="back">返回</el-button>
                <!-- <el-button type="primary"  @click="printingBtn">打印</el-button> -->
            </div>
        </div>
        <div style="height:20px" />

        <!-- 展示 -->
        <div class="info-content table-index _table-index">
            <div>
                <template>
                    <el-tabs v-model="tabActiveName">
                        <el-tab-pane label="容器详情" name="category">
                            <div class="info-title">基本信息</div>
                            <el-col :span="6" class="info-box">
                                <div>创建人:</div>
                                <div>{{ dataList.creatorName }}</div>
                            </el-col>

                            <el-col :span="6" class="info-box">
                                <div>拣货员:</div>
                                {{ dataList.pickUserName }}
                            </el-col>

                            <el-col :span="6" class="info-box">
                                <div>开始拣货时间:</div>
                                <div>{{ dataList.beginPickTime }}</div>
                            </el-col>

                            <el-col :span="6" class="info-box">
                                <div>结束拣货时间:</div>
                                {{ dataList.endPickTime }}
                            </el-col>

                            <el-col :span="6" class="info-box">
                                <div>拣货方式:</div>
                                {{ dataList.method | setMethod }}
                            </el-col>

                            <!-- <el-col :span="6" class="info-box">
                                <div>分播类型:</div>
                                {{ dataList.sowingType | setSowingType }}
                            </el-col> -->

                            <el-col :span="6" class="info-box">
                                <div>备注:</div>
                                <div>{{ dataList.remark }}</div>
                            </el-col>

                            <br>

                            <el-col><div  class="info-title title">商品信息</div></el-col>
                            <div style="height:20px" />

                            <el-table :data="dataList.itemBins" style="width: 100%; text-align: center" :row-style="{ height: '16px', padding: '-4px' }" >
                            <el-table-column prop="billNumber" label="单号"></el-table-column>
                            <el-table-column prop="binCode" label="货位编码"></el-table-column>
                            <el-table-column prop="productName" label="商品名称"></el-table-column>
                            <el-table-column prop="isLack" label="是否缺货"></el-table-column>
                            <el-table-column prop="planQty" label="计划数量"></el-table-column>
                            <el-table-column prop="realQty" label="实拣数量"></el-table-column>
                            <el-table-column prop="creatorName" label="创建人"></el-table-column>

                            <el-table-column prop="scope" label="状态">
                              <template slot-scope="scope">
                                {{ scope.row.status | setStatus }}
                              </template>
                            </el-table-column>

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
      sowingPickBillDetails: function() {
        this.id = this.$route.query.id;
        console.log(this.id)
        DeliveryService.sowingPickBillDetails(this.id)
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
      this.sowingPickBillDetails()
    },
    filters: {
      setMethod(type) {
        // 拣货方式，MANUAL：手工单据，RF：手持终端
        switch (type) {
          case 'MANUAL':
            return "手工单据"
          case 'RF':
            return "手持终端"
          default:
            return '未知';
        }
      },
      setStatus(type) {
        // 状态， INITIAL 初始 PROCESSING 进行中 FINISH 已完成
        switch (type) {
          case 'INITIAL':
            return "初始"
          case 'PROCESSING':
            return "进行中"
          case 'FINISH':
            return "已完成"
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