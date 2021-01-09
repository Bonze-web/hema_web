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
                                <div>业务类型:</div>
                                <div>{{ dataList.bizType | setBizType }}</div>
                            </el-col>

                            <el-col :span="6" class="info-box">
                                <div>开始拣货时间:</div>
                                <div>{{ dataList.startPickTime }}</div>
                            </el-col>

                            <el-col :span="6" class="info-box">
                                <div>完成时间:</div>
                                {{ dataList.finishTime }}
                            </el-col>

                            <el-col :span="6" class="info-box">
                                <div>网格仓:</div>
                                {{ dataList.frontDcName }}
                            </el-col>

                            <el-col :span="6" class="info-box">
                                <div>暂用时间:</div>
                                {{ dataList.lockTime }}
                            </el-col>

                            <el-col :span="6" class="info-box">
                                <div>拣货方法:</div>
                                {{ dataList.pickType | setPickType }}
                            </el-col>

                            <el-col :span="6" class="info-box">
                                <div>拣货人:</div>
                                {{ dataList.pickUserName }}
                            </el-col>

                            <el-col :span="6" class="info-box">
                                <div>拣货类别:</div>
                                {{ dataList.type | setType }}
                            </el-col>

                            <el-col :span="6" class="info-box">
                                <div>备注:</div>
                                <div>{{ dataList.remark }}</div>
                            </el-col>

                            <!-- <el-col :span="6" class="info-box">
                                <div>目标位置:</div>
                                <div>{{ dataList.XX !== " " ? dataList.XX : "&lt;空&gt;" }}</div>
                            </el-col> -->
                            <br>

                            <!-- <el-col>
                                <div  class="info-title title">商品信息</div>
                            </el-col>

                            <div style="height:20px" />

                            <el-table :data="dataList.sonList" style="width: 100%; text-align: center" :row-style="{ height: '16px', padding: '-4px' }" >

                            <el-table-column prop="a" label="条码" style="height: 20px">
                              <template slot-scope="scope">
                                <span>条码{{ scope.row.barcode }}</span>
                              </template>
                            </el-table-column>

                            <el-table-column prop="b" label="容器类型" style="height: 20px">
                              <template slot-scope="scope">
                                <span>容器类型{{ scope.row.containerTypeName }}</span>
                              </template>
                            </el-table-column>

                            <el-table-column prop="c" label="状态">
                              <template slot-scope="scope">
                                {{ scope.row.useStatus | dcStatus }}
                              </template>
                            </el-table-column>

                          </el-table> -->


                        </el-tab-pane>

                        <el-tab-pane label="操作日志" name="log">
                          <system-log modular="PICK_BILL" :id="id"></system-log>
                        </el-tab-pane>
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
        active: 'ccc',
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
      detailsPick: function() {
        this.id = this.$route.query.id;
        console.log(this.id)
        DeliveryService.detailsPick(this.id)
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
      this.detailsPick()
    },
    filters: {
      setBizType(type) {
        // 业务类型。取值：DIST：配货；RETURN：退供应商
        switch (type) {
          case 'DIST':
            return "配货"
          case 'RETURN':
            return "退供应商"
          default:
            return '未知';
        }
      },
      setPickType(type) {
        // ‘拣货方法，RF：RF ，BILL：拣货单’
        switch (type) {
          case 'RF':
            return "RF"
          case 'BILL':
            return "拣货单"
          default:
            return '未知';
        }
      },
      setStatus(type) {
        // 状态 INITIAL: 初始, LOCKED: 已占货, PICKING：拣货中，FINISHED: 已完成
        switch (type) {
          case 'INITIAL':
            return "初始"
          case 'LOCKED':
            return "已占货"
          case 'PICKING':
            return "拣货中"
          case 'FINISHED':
            return "已完成"
          default:
            return '未知';
        }
      },
      setType(type) {
        // 拣货类型，PALLET：整托 ，CASE：整件 ，SPLIT：拆零
        switch (type) {
          case 'PALLET':
            return "整托"
          case 'CASE':
            return "整件"
          case 'SPLIT':
            return "拆零"
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