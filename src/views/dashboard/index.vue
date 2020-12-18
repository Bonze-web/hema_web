<template>
  <div class="dashboard-container" v-if="showDashboard">
    <div class="top-box">
      数据概况
      <div class="btn-box">
        <el-radio-group v-model="totalTime" size="mini" @change="totalTimeChange">
          <el-radio-button label="yesterday">昨天</el-radio-button>
          <el-radio-button label="seven">近7天</el-radio-button>
          <el-radio-button label="thirty">近30天</el-radio-button>
        </el-radio-group>
      </div>
    </div>
    <div class="middle-box">
      <div class="business-statistics" v-if="hasPermission(PermIds.REPORT_STORE_SALES)">
        <div class="title-box">
          <div class="title">
            <span class="line"></span>
            <span>营业统计</span>
            <el-popover placement="top-start" width="190" trigger="click" content="本店线上平台营业统计">
              <i class="el-icon-question" slot="reference"></i>
            </el-popover>
          </div>
          <div class="btn-box">
            <el-radio-group v-model="businessTime" size="mini" @change="businessTimeChange">
              <el-radio-button label="yesterday">昨天</el-radio-button>
              <el-radio-button label="seven">近7天</el-radio-button>
              <el-radio-button label="thirty">近30天</el-radio-button>
            </el-radio-group>
          </div>
        </div>
        <div class="business-main">
          <report-info :report="turnover" :businessTime="businessTime" unit="￥"></report-info>
          <report-info :report="paymentOrder" :businessTime="businessTime" unit="单"></report-info>
          <report-info :report="customPrice" :businessTime="businessTime" unit="￥"></report-info>
          <!-- <div class="flex">
            <span>浏览量</span>
            <span class="number">23522</span>
            <span>比上周532</span>
          </div>-->
          <div class="flex"></div>
        </div>
      </div>
      <div class="passenger-flow-statistics" v-if="hasPermission(PermIds.REPORT_MEMBERS_FLOW)">
        <div class="title-box">
          <div class="title">
            <span class="line"></span>
            <span>客流统计</span>
            <el-popover placement="top-start" width="190" trigger="click" content="本店线上平台客流分析;到店顾客数：打开线上商城，并浏览当前门店的用户数。">
              <i class="el-icon-question" slot="reference"></i>
            </el-popover>
          </div>
          <div class="btn-box">
            <el-radio-group v-model="flowTime" size="mini" @change="flowTimeChange">
              <el-radio-button label="yesterday">昨天</el-radio-button>
              <el-radio-button label="seven">近7天</el-radio-button>
              <el-radio-button label="thirty">近30天</el-radio-button>
            </el-radio-group>
          </div>
        </div>
        <div class="flow-main">
          <div class="color-img">
            <div class="one"></div>
            <div class="two"></div>
            <div class="three"></div>
          </div>
          <div class="flow-main-content">
            <report-info :report="arrival" :businessTime="flowTime" unit="人"></report-info>
            <report-info :report="customers" :businessTime="flowTime" unit="人"></report-info>
          </div>
          <div class="jian">
            <i></i>
          </div>
          <report-info :report="orderRatio" :businessTime="flowTime" unit="%"></report-info>
        </div>
      </div>
    </div>
    <div class="content" v-if="hasPermission(PermIds.REPORT_PRODUCT_LIST_VIEW)">
      <div class="title-box">
        <div class="title">
          <span class="line"></span>
          <span>商品销量排行</span>
        </div>
        <div class="btn-box">
          <el-radio-group v-model="orderBy" size="mini" @change="orderByChange">
            <el-radio-button label="sale_count">按销量排序</el-radio-button>
            <el-radio-button label="sale_amount">按销售额排序</el-radio-button>
          </el-radio-group>
          <el-radio-group v-model="productTime" size="mini" @change="productTimeChange">
            <el-radio-button label="yesterday">昨天</el-radio-button>
            <el-radio-button label="seven">近7天</el-radio-button>
            <el-radio-button label="thirty">近30天</el-radio-button>
          </el-radio-group>
        </div>
      </div>
      <el-table :data="pageData.records" style="width: 100%">
        <el-table-column type="index" width="50" :index="indexMethod" label="排名"></el-table-column>
        <el-table-column prop="name" label="商品名称"></el-table-column>
        <el-table-column prop="productNumber" label="商品代码"></el-table-column>
        <el-table-column prop="saleAmount" label="商品销售额"></el-table-column>
        <el-table-column prop="saleCount" label="商品销量"></el-table-column>
      </el-table>
      <page-bar :page-data="pageData" @onreload="queryProductList"></page-bar>
    </div>
  </div>
</template>

<script>
import pageBar from "@/components/pagebar.vue";
import ReportInfo from "./components/reportInfo.vue";
import ReportService from "@/api/service/ReportService";
import PermIds from "@/api/permissionIds";
import * as DateUtil from "@/utils/dateUtil";
import { mapGetters } from "vuex";

export default {
  name: "dashboard",
  data() {
    return {
      PermIds: PermIds,
      showDashboard: true,
      currentStoreId: "",
      totalTime: "seven",
      businessTime: "seven",
      flowTime: "seven",
      productTime: "seven",
      pageData: {
        page: 1,
        pageSize: 20,
        pageCount: 0,
        records: []
      },
      startDate: "", // 查询开始日期
      endDate: "", // 查询结束日期 截止到昨晚23:59:59
      turnover: {}, // 营业额
      paymentOrder: {}, // 付款订单
      customPrice: {}, // 客单价
      arrival: {}, // 到店顾客数
      customers: {}, // 下单顾客数
      orderRatio: {}, // 订单转化率
      orderBy: "sale_count" // 排序依据
    };
  },
  computed: {
    ...mapGetters(["hasPermission", "workingOrg"])
  },
  methods: {
    indexMethod(index) {
      return (this.pageData.page - 1) * this.pageData.pageSize + index + 1;
    },
    /* 营业统计报表查询 */
    businessReportQuery() {
      ReportService.storeSalesReport(this.currentStoreId)
        .then(res => {
          if (res) {
            this.turnover = {
              title: "营业额",
              sevenTotal: res.sevenDaysAgoTurnover,
              sevenRatio: res.sevenDaysAgoTurnoverContrast,
              thirtyTotal: res.thirtyDaysAgoTurnover,
              thirtyRatio: res.thirtyDaysAgoTurnoverContrast,
              yesterdayTotal: res.yesterdayTurnover,
              yesterdayRatio: res.yesterdayTurnoverContrast
            };
            this.paymentOrder = {
              title: "付款订单数",
              sevenTotal: res.sevenDaysAgoOrders,
              sevenRatio: res.sevenDaysAgoOrdersContrast,
              thirtyTotal: res.thirtyDaysAgoOrders,
              thirtyRatio: res.thirtyDaysAgoOrdersContrast,
              yesterdayTotal: res.yesterdayOrders,
              yesterdayRatio: res.yesterdayOrdersContrast
            };
            this.customPrice = {
              title: "客单价",
              sevenTotal: res.sevenDaysAgoAveragePrice,
              sevenRatio: res.sevenDaysAgoAveragePriceContrast,
              thirtyTotal: res.thirtyDaysAgoAveragePrice,
              thirtyRatio: res.thirtyDaysAgoAveragePriceContrast,
              yesterdayTotal: res.yesterdayAveragePrice,
              yesterdayRatio: res.yesterdayAveragePriceContrast
            };
          } else {
            this.turnover = {
              title: "营业额"
            };
            this.paymentOrder = {
              title: "付款订单数"
            };
            this.customPrice = {
              title: "客单价"
            };
          }
        })
        .catch(err => {
          this.$message.error(err.message);
        });
    },
    /* 客流统计报表查询 */
    flowReportQuery() {
      ReportService.memberLowReport(this.currentStoreId)
        .then(res => {
          if (res) {
            this.flowReport = res;
            this.arrival = {
              title: "到店顾客数",
              sevenTotal: res.sevenDaysAgoMembers,
              sevenRatio: res.sevenDaysAgoMembersContrast,
              thirtyTotal: res.thirtyDaysAgoMembers,
              thirtyRatio: res.thirtyDaysAgoMembersContrast,
              yesterdayTotal: res.yesterdayMembers,
              yesterdayRatio: res.yesterdayMembersContrast
            };
            this.customers = {
              title: "下单顾客数",
              sevenTotal: res.sevenDaysAgoOrders,
              sevenRatio: res.sevenDaysAgoOrdersContrast,
              thirtyTotal: res.thirtyDaysAgoOrders,
              thirtyRatio: res.thirtyDaysAgoOrdersContrast,
              yesterdayTotal: res.yesterdayOrders,
              yesterdayRatio: res.yesterdayOrdersContrast
            };
            this.orderRatio = {
              title: "下单转化率",
              sevenTotal: (res.sevenDaysAgoPayrate * 100).toFixed(2),
              sevenRatio: (res.sevenDaysAgoPayrateContrast * 100).toFixed(2),
              thirtyTotal: (res.thirtyDaysAgoPayrate * 100).toFixed(2),
              thirtyRatio: (res.thirtyDaysAgoPayrateContrast * 100).toFixed(2),
              yesterdayTotal: (res.yesterdayPayrate * 100).toFixed(2),
              yesterdayRatio: (res.yesterdayPayrateContrast * 100).toFixed(2)
            };
          } else {
            this.arrival = {
              title: "到店顾客数"
            };
            this.customers = {
              title: "下单顾客数"
            };
            this.orderRatio = {
              title: "下单转化率"
            };
          }
        })
        .catch(err => {
          this.$message.error(err.message);
        });
    },
    /* 商品销量报表查询 */
    queryProductList(page, pageSize) {
      page = page !== "" ? page : this.pageData.page;
      pageSize = pageSize !== "" ? pageSize : this.pageData.pageSize;
      var opts = {
        storeId: this.currentStoreId, // 当前登录组织id
        orderField: this.orderBy, // sale_amount(销售额),sale_count(销量)
        startDate: this.startDate ? this.startDate : null,
        endDate: this.endDate ? this.endDate : null
      };
      ReportService.queryProductList(page, pageSize, opts)
        .then(res => {
          if (res) {
            this.pageData = res;
          }
        })
        .catch(err => {
          this.$message.error(err.message);
        });
    },
    // 统一的时间范围修改
    totalTimeChange(val) {
      // 修改每个模块的时间范围
      this.businessTime = val;
      this.flowTime = val;
      this.productTime = val;

      this.startDate = this.formatDateResult(val);

      // 各模块接口重新调用执行,营业统计和客流统计会自动变化，只需要调用商品销量排行接口就行
      this.productTimeChange(this.productTime);
    },
    businessTimeChange(val) {
      this.startDate = this.formatDateResult(val);
    },
    flowTimeChange(val) {
      this.startDate = this.formatDateResult(val);
    },
    productTimeChange(val) {
      this.startDate = this.formatDateResult(val);
      this.endDate =
        DateUtil.formatDate(DateUtil.getBeforeDate(1), "yyyy-MM-dd") +
        " 23:59:59";
      this.queryProductList(1, this.pageData.pageSize);
    },
    formatDateResult(val) {
      var startDate = "";
      if (val === "yesterday") {
        startDate = DateUtil.formatDate(
          DateUtil.getBeforeDate(1),
          "yyyy-MM-dd"
        );
      } else if (val === "seven") {
        startDate = DateUtil.formatDate(
          DateUtil.getBeforeDate(7),
          "yyyy-MM-dd"
        );
      } else if (val === "thirty") {
        startDate = DateUtil.formatDate(
          DateUtil.getBeforeDate(30),
          "yyyy-MM-dd"
        );
      }
      return startDate + " 00:00:00";
    },
    /* 排序按钮点击事件 */
    orderByChange(val) {
      this.productTimeChange(this.productTime);
    }
  },
  created() {
    window.document.title = process.env.TITLE;
  },
  mounted() {
    this.currentStoreId = this.workingOrg.id; // 当前门店的id
    console.log(this.currentStoreId);
    if (
      this.currentStoreId === "0" ||
      !this.currentStoreId ||
      (!this.hasPermission(PermIds.REPORT_STORE_SALES) &&
        !this.hasPermission(PermIds.REPORT_PRODUCT_LIST_VIEW) &&
        !this.hasPermission(PermIds.REPORT_MEMBERS_FLOW))
    ) {
      this.showDashboard = false;
    } else {
      this.showDashboard = true;
      if (this.hasPermission(PermIds.REPORT_PRODUCT_LIST_VIEW)) {
        this.productTimeChange(this.productTime);
      }
      if (this.hasPermission(PermIds.REPORT_STORE_SALES)) {
        this.businessReportQuery();
      }
      if (this.hasPermission(PermIds.REPORT_MEMBERS_FLOW)) {
        this.flowReportQuery();
      }
    }
  },
  components: {
    pageBar,
    ReportInfo
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
@import "src/styles/mixin.scss";
.dashboard {
  &-container {
    @include common;
    overflow: hidden;
    .middle-box {
      // background: #ebeff3;
      overflow: hidden;
      padding: 0px;
      display: flex;
      justify-content: space-between;
      > div {
        border-radius: 8px;
        height: 300px;
        background: #fff;
        padding: 10px 15px;
        overflow: hidden;
      }
    }
    .title {
      float: left;
      height: 32px;
      line-height: 32px;
      display: flex;
      align-items: center;
      .line {
        width: 2px;
        height: 16px;
        background: #409eff;
        display: inline-block;
        margin-right: 4px;
      }
      i {
        color: #999;
      }
    }
    .business-statistics {
      float: left;
      width: 49%;
      overflow: hidden;
      .business-main {
        width: 100%;
        display: flex;
        justify-content: space-around;
        align-items: center;
        flex-wrap: wrap;
        > div {
          width: 40%;
          height: 120px;
          > span {
            &:first-of-type {
              font-size: 14px;
            }
            i {
              font-size: 10px;
            }
          }
          .red {
            color: #ff4d4d;
          }
          .green {
            color: #17c071;
          }
        }
      }
    }
    .passenger-flow-statistics {
      float: right;
      overflow: hidden;
      width: 49%;
      .flow-main {
        width: 100%;
        height: 220px;
        margin-top: 40px;
        overflow: hidden;
        display: flex;
        align-items: center;
        .color-img {
          width: 140px;
          height: 190px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          position: relative;
          overflow: hidden;
          float: left;
          .one {
            width: 100%;
            height: 90px;
            background: #c7e8ff;
          }
          .two {
            width: 100%;
            height: 90px;
            background: #6bc3ff;
          }

          .three {
            position: absolute;
            width: 70px;
            height: 120%;
            left: -30px;
            bottom: -20px;
            background: #fff;
            transform: rotate(-15deg);
          }
        }
        .flow-main-content {
          float: left;
          width: 100px;
          height: 190px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          margin-left: 20px;
          div {
            height: 90px;
          }
        }
        .jian {
          width: 20px;
          height: 120px;
          border: 1px solid #ff7200;
          border-left-color: #fff;
          position: relative;
          margin-left: 20px;
          margin-right: 40px;
          i {
            display: block;
            width: 0px;
            height: 0px;
            border-right: 4px solid #ff7200;
            border-bottom: 4px solid transparent;
            border-left: 4px solid transparent;
            border-top: 4px solid transparent;
            position: absolute;
            left: -5px;
            bottom: -4px;
          }
        }
      }
    }
    .flex {
      display: flex;
      flex-direction: column;
      justify-content: center;
      font-size: 12px;
      color: #333;
      .number {
        font-size: 20px;
        margin: 6px 0px;
        color: #000;
      }
    }
    .unit {
      font-size: 12px;
    }
    .content {
      width: 100%;
    }
  }
}

.btn-box {
  float: right;
}
</style>
