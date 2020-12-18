<template>
  <div class="coupon-dialog">
    <el-dialog title="选择优惠券" :visible.sync="dialogVisible" width="50%" center>
      <div class="search-box">
        <el-tabs v-model="queryType" @tab-click="handleClickTab">
          <el-tab-pane label="内部券" name="coupon"></el-tab-pane>
          <el-tab-pane label="外部券" name="externalCoupon"></el-tab-pane>
        </el-tabs>
        <el-input size="small" placeholder="请输入券名称查询" v-if="queryType === 'coupon'" prefix-icon="el-icon-search" v-model="searchValue" @keyup.enter.native="handleQuery"></el-input>
      </div>
      <div style="width: 100%;height:350px;margin-top:10px;">
        <el-scrollbar style="height:100%;">
          <el-table :data="pageData.records" style="width: 100%;" v-loading="selectCouponLoading">
            <el-table-column prop="name" label="券活动名称"></el-table-column>
            <el-table-column prop="function" label="券类型">
              <template slot-scope="scope">
                <span>{{scope.row.function | filtFunction}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="startDate" label="活动开始时间"></el-table-column>
            <el-table-column prop="endDate" label="活动结束时间"></el-table-column>
            <el-table-column prop="goods" label="操作">
              <template slot-scope="scope">
                <el-button size="small" type="text" @click="handleCheckCoupon(scope.row)">选择</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-scrollbar>
        <page-bar :page-data="pageData" @onreload="reload" style="margin:0;" v-if="queryType === 'coupon' || (pageData.records.length > 0 && pageData.records[0].service === 'ZJIAN')"></page-bar>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import CouponService from "@/api/service/CouponService";
import OptionsService from "@/api/service/OptionsService";
import PageBar from "@/components/pagebar";

export default {
  data() {
    return {
      dialogVisible: false,
      selectCouponLoading: false,
      searchValue: "",
      queryType: 'coupon',
      pageData: {
        page: 1,
        pageSize: 10,
        pageCount: 0,
        recordCount: 0,
        records: []
      }
    };
  },
  components: {
    PageBar
  },
  props: ["visible", "queryExternal", "queryPackage"],
  methods: {
    /* 选择优惠券 */
    handleCheckCoupon(val) {
      // 将选择结果抛出
      var obj = {
        id: val.id,
        name: val.name,
        couponService: val.couponService,
        startDate: val.startDate,
        endDate: val.endDate
      };
      this.$emit("selectResult", obj);
      this.dialogVisible = false;
    },
    // 切换内外部优惠券
    handleClickTab(tab, event) {
      this.pageData = {
        page: 1,
        pageSize: 10,
        pageCount: 0,
        recordCount: 0,
        records: []
      };
      this.queryType === 'coupon'
        ? this.handleQuery()
        : this.handleQueryExternal();
    },
    /* 查询优惠券活动 */
    handleQuery(page = 1, pageSize = 10) {
      const self = this;
      var queryPackage = true;
      if (self.queryPackage != null) {
        queryPackage = JSON.parse(self.queryPackage);
      }
      this.selectCouponLoading = true;
      
      var opts = {
        statusEquals: "COMMIT",
        nameLike: this.searchValue ? this.searchValue : null,
        orderDirection: "desc",
        orderField: "update_time"
      };
      CouponService.queryCouponActivity(page, pageSize, opts)
        .then(res => {
          this.selectCouponLoading = false;
          if (res && res.records) {
            this.pageData = {
              ...res,
              records: []
            }
            res.records.forEach(item => {
              if (queryPackage) {
                // 查询结果包含券包
                if (item.balance && item.balance > 0) {
                  this.pageData.records.push({
                    ...item,
                    couponService: "GM"
                  });
                }
              } else {
                if (item.function !== "PACKAGE") {
                  if (item.balance && item.balance > 0) {
                    this.pageData.records.push({
                      ...item,
                      couponService: "GM"
                    });
                  }
                }
              }
            });
          }
        })
        .catch(err => {
          this.selectCouponLoading = false;
          this.$message.error(err.message);
        });
    },
    handleQueryExternal(page = 1, pageSize = 10) {
      const self = this;
      if (this.queryExternal) {
        // 如果允许查询外部券，执行查询外部券操作
        OptionsService.query()
          .then(res => {
            this.selectCouponLoading = true;
            if (res && res.length > 0) {
              res.forEach(item => {
                if (item.key === "isUseExternalCoupon") {
                  // 如果配置为true,查询外部券
                  if (item.value === "TRUE") {
                    // 查询外部券
                    CouponService.getExternalCouponActivities(page, pageSize)
                      .then(res => {
                        this.selectCouponLoading = false;
                        self.pageData = {
                          ...res,
                          records: []
                        }
                        if (res && res.records) {
                          res.records.forEach(item => {
                            if (item.service === "ZJIAN") {
                              self.pageData.records.push({
                                ...item,
                                couponService: item.service
                              });
                            } else {
                              if (item.balance && item.balance > 0 || item.balance === undefined) {
                                self.pageData.records.push({
                                  ...item,
                                  couponService: item.service
                                });
                              }
                            }
                          });
                        }
                      })
                      .catch(err => {
                        this.$message.error(err.message);
                      });
                  }
                }
              });
            }
          })
          .catch(err => {
            this.selectCouponLoading = false;
            this.$message.error(err.message);
          });
      }
    },
    reload(page, pageSize) {
      this.queryType === "coupon"
        ? this.handleQuery(page, pageSize)
        : this.handleQueryExternal(page, pageSize);
    }
  },
  watch: {
    visible: function(val) {
      this.dialogVisible = val;
      if (val) {
        this.handleQuery();
      }
    },
    dialogVisible: function(val) {
      this.$emit("update:visible", val);
    }
  },
  filters: {
    filtFunction: function(val) {
      let res = "";
      if (val === "CASH") {
        res = "现金券";
      } else if (val === "DISCOUNT") {
        res = "折扣券";
      } else if (val === "GIFT") {
        res = "礼品券";
      } else if (val === "FREESHIP") {
        res = "免邮券";
      } else if (val === "PACKAGE") {
        res = "券包";
      } else if (val === "PRODUCT") {
        res = "商品券";
      }
      return res;
    }
  }
};
</script>
<style lang="scss" scoped>
.giftcard-img {
  width: 90px;
  height: 50px;
  margin-right: 10px;
  float: left;
  border-radius: 4px;
  overflow: hidden;
}
</style>

<style lang="scss">
  .coupon-dialog {
    .el-dialog__body {
      padding-bottom: 40px;
    }
  }
</style>