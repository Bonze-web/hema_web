<template>
  <div class="product-spec-main">
    <div class="product-spec-table">
      <div class="spec-table-thead" :style="{width: queryType === 'bargin' ? '100%' : 'max-content'}">
        <div class="tr" :style="{width: queryType === 'bargin' ? '100%' : 'max-content'}">
          <div class="th" style="width:138px;">商品名称</div>
          <div class="th" style="width:100px;">售价</div>
          <div class="th no-border-right" style="width:128px;" v-if="queryType === 'bargin'">
            砍价底线
            <el-popover placement="right-start" title width="300" trigger="hover" content="提示：">
              <i slot="reference" class="el-icon-question"></i>
            </el-popover>
          </div>
          <div class="th no-border-right" style="width:128px;" v-if="queryType === 'bargin'">
            砍价商品数量
            <el-popover placement="right-start" title width="300" trigger="hover" content="提示：">
              <i slot="reference" class="el-icon-question"></i>
            </el-popover>
          </div>
          <div class="th no-border-right" style="width:128px;" v-if="queryType === 'group'">
            拼团商品数量
            <el-popover placement="right-start" title width="300" trigger="hover" content="提示：单个拼团包含的商品数量">
              <i slot="reference" class="el-icon-question"></i>
            </el-popover>
          </div>
          <div class="th no-border-right" style="width:128px;" v-if="queryType === 'group'">
            商品总量
            <el-popover placement="right-start" title width="300" trigger="hover" content="提示：当前拼团活动的商品总数量">
              <i slot="reference" class="el-icon-question"></i>
            </el-popover>
          </div>
          <div class="th no-border-right" style="width:102px;" v-if="queryType === 'group'">
            拼团价格
            <el-popover placement="right-start" title width="300" trigger="hover" content="提示：单个拼团商品的价格">
              <i slot="reference" class="el-icon-question"></i>
            </el-popover>
          </div>
          <div class="th no-border-right" style="width:260px;" v-if="queryType === 'group'">
            团长优惠价
            <el-popover placement="right-start" title width="300" trigger="hover" content="提示：单个拼团商品的团长优惠价">
              <i slot="reference" class="el-icon-question"></i>
            </el-popover>
          </div>
          <div class="th no-border-right" style="width:102px;" v-if="queryType === 'grab'">秒杀价格</div>
          <div class="th no-border-right" style="width:128px;" v-if="queryType === 'grab'">
            参与活动数量
            <el-popover placement="right-start" title width="300" trigger="hover" content="提示：当前商品参与秒杀活动的总数量">
              <i slot="reference" class="el-icon-question"></i>
            </el-popover>
          </div>
          <div class="th no-border-right" style="width:128px;" v-if="queryType === 'grab'">
            限购数量
            <el-popover placement="right-start" title width="300" trigger="hover" content="提示：实际限购数量取参与活动数量和库存数量两者的最小值。">
              <i slot="reference" class="el-icon-question"></i>
            </el-popover>
          </div>
          <div class="th no-border-right" style="width:128px;" v-if="queryType === 'solitaire'">接龙商品价格</div>
          <div class="th no-border-right" style="width:128px;" v-if="queryType === 'solitaire'">活动库存</div>
          <div class="th no-border-right" style="width:260px;" v-if="queryType === 'solitaire'">每人限购</div>
          <div class="th no-border-right" style="width:90px;"></div>
        </div>
      </div>
      <div class="spec-table-tbody">
        <div class="tr" v-for="(item, index) in childenProducts" :key="item.productId" :style="{width: queryType === 'bargin' ? '100%' : 'max-content'}">
          <div class="td" style="width:138px;">{{item.productName}}</div>
          <div class="td" style="width:100px;" v-if="queryType === 'bargin'">
            <span v-show="item.originalPrice || item.price">￥</span>
            {{item.originalPrice || item.price}}
          </div>
          <div class="td" style="width:100px;" v-else>
            <span v-show="item.originalPrice">￥</span>
            {{item.originalPrice}}
          </div>
          <!-- 砍价底线 -->
          <div class="td no-border-right" style="width:128px;" v-if="queryType === 'bargin'">
            <el-input type="number" :disabled="disabled" size="small" class="width-small" v-model="item.lowerPrice" placeholder="请输入"></el-input>
          </div>
          <!-- 砍价商品数量 -->
          <div class="td no-border-right" style="width:128px;" v-if="queryType === 'bargin'">
            <el-input-number size="mini" :disabled="disabled" :min="1" v-model="item.totalStockAmount"></el-input-number>
            <span>&nbsp;&nbsp;件</span>
          </div>

          <!-- 拼团 -->
          <div class="td no-border-right" style="width:128px;" v-if="queryType === 'group'">
            <el-input-number size="mini" :disabled="disabled" :min="1" v-model="item.teamMemberJoinCount"></el-input-number>
          </div>
          <div class="td no-border-right" style="width:128px;" v-if="queryType === 'group'">
            <el-input type="number" :disabled="disabled" size="small" class="width-small" placeholder="请输入" v-model="item.productCount"></el-input>
            <span>&nbsp;&nbsp;件</span>
          </div>
          <div class="td no-border-right" style="width:102px;" v-if="queryType === 'group'">
            <el-input :disabled="disabled" class="input-width-large" size="small" placeholder="请输入" v-model="item.teamMemberPrice" @change="handleTeamMemberPrice(item,index)"></el-input>
          </div>
          <div class="td no-border-right" style="width:260px;" v-if="queryType === 'group'">
            <el-checkbox :disabled="disabled" v-model="item.useLeaderPrice" @change="handleUseLeaderPriceChange(item,index)">团长享受优惠价</el-checkbox>
            <el-input :disabled="disabled" type="number" size="small" style="margin-right: 6px;" v-model="item.teamLeaderPrice" placeholder="请输入" @focus="handleLeaderPriceFocus(item,index)" @blur="handleLeaderPriceBlur(item,index)"></el-input>
            <span>元</span>
          </div>
          <!-- 秒杀 -->
          <div class="td no-border-right" style="width:102px;" v-if="queryType === 'grab'">
            <el-input type="number" :disabled="disabled" class="input-width-large" size="small" placeholder="请输入" v-model="item.price"></el-input>
          </div>
          <div class="td no-border-right" style="width:128px;" v-if="queryType === 'grab'">
            <el-input type="number" :disabled="disabled" class="input-width-large" size="small" placeholder="请输入" v-model="item.totalStockAmount"></el-input>
          </div>
          <div class="td no-border-right" style="width:128px;" v-if="queryType === 'grab'">
            <el-input type="number" :disabled="disabled" size="small" class="width-small" placeholder="请输入" v-model="item.limitCount"></el-input>
            <span>&nbsp;&nbsp;件</span>
          </div>
          <!-- 接龙商品价格 -->
          <div class="td no-border-right" style="width:128px;" v-if="queryType === 'solitaire'">
            <el-input :disabled="disabled" type="number" size="small" style="margin-right: 6px;" v-model="item.price" placeholder="请输入"></el-input>
            <span>元</span>
          </div>
          <!-- 活动库存 -->
          <div class="td no-border-right" style="width:128px;" v-if="queryType === 'solitaire'">
            <el-input type="number" :disabled="disabled" size="small" class="width-small" placeholder="请输入" v-model="item.stock"></el-input>
            <span>&nbsp;&nbsp;件</span>
          </div>
          <div class="td no-border-right" style="width:260px;" v-if="queryType === 'solitaire'">
            <el-checkbox :disabled="disabled" v-model="item.openMemberLimit" @change="handleOpenMemberLimitChange(item,index)">开启限购&nbsp;</el-checkbox>
            <el-input type="number" :disabled="disabled" size="small" class="width-small" placeholder="请输入" v-model="item.memberLimit" @focus="handleMemberLimitFocus(item,index)" @blur="handleMemberLimitBlur(item,index)"></el-input>
            <span>&nbsp;&nbsp;件/人</span>
          </div>
          <div class="td no-border-right" style="width:90px;">
            <el-button type="text" :disabled="disabled" @click="moveOutchildenProduct(item,index)">移除子商品</el-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      childenProducts: []
    };
  },
  props: ["queryType", "chooseProducts", "disabled"], // queryType:查询类型 chooseProducts:已经选择的子商品 disabled:是否禁用
  created() {},
  methods: {
    moveOutchildenProduct: function(val, index) {
      this.childenProducts.splice(index, 1);
      this.$emit("update:chooseProducts", this.childenProducts);
    },
    handleLeaderPriceFocus: function(val, index) {
      this.childenProducts[index].useLeaderPrice = true;
    },
    handleLeaderPriceBlur: function(val, index) {
      if (val.teamLeaderPrice > 0) {
        this.childenProducts[index].useLeaderPrice = true;
      } else {
        this.childenProducts[index].useLeaderPrice = false;
        this.childenProducts[index].teamLeaderPrice = "";
      }
    },
    handleUseLeaderPriceChange(val, index) {
      if (this.childenProducts[index].useLeaderPrice) {
        this.childenProducts[index].teamLeaderPrice = val.teamMemberPrice;
      } else {
        this.childenProducts[index].teamLeaderPrice = "";
      }
    },
    handleTeamMemberPrice(val, index) {
      if (val.useLeaderPrice) {
        this.childenProducts[index].teamLeaderPrice = parseFloat(
          val.teamMemberPrice
        );
      }
    },
    handleMemberLimitFocus: function(val, index) {
      this.childenProducts[index].openMemberLimit = true;
    },
    handleMemberLimitBlur: function(val, index) {
      if (val.memberLimit > 0) {
        this.childenProducts[index].openMemberLimit = true;
      } else {
        this.childenProducts[index].openMemberLimit = false;
        this.childenProducts[index].memberLimit = "";
      }
    },
    handleOpenMemberLimitChange(val, index) {
      if (!this.childenProducts[index].openMemberLimit) {
        this.childenProducts[index].memberLimit = "";
      }
    }
  },
  watch: {
    chooseProducts: function(val) {
      this.childenProducts = this.chooseProducts;
    },
    childenProducts: function(val) {}
  },
  mounted() {
    this.childenProducts = this.chooseProducts;
  }
};
</script>
<style lang="scss" scoped>
.product-spec-main {
  margin-bottom: 18px;
  .product-spec-table {
    margin-top: 18px;
    overflow-x: auto;
    overflow-y: auto;
    max-height: 400px;
    border-left: 1px solid #ccc;
    display: flex;
    flex-direction: column;
  }
  .tr {
    display: flex;
    font-size: 12px;
    padding-right: 20px;
    border-bottom: 1px solid #e5e5e5;
    border-right: 1px solid #e5e5e5;
    width: max-content;
  }
  .spec-table {
    &-thead {
      width: 100%;
      height: 38px;
      color: #000000;
      border-top: 1px solid #e5e5e5;
      width: max-content;
      .th {
        min-width: 90px;
        padding: 10px 10px 0 10px;
        line-height: 28px;
        display: flex;
        align-items: center;
        box-sizing: border-box;
        border-right: 1px solid #e5e5e5;
        flex-shrink: 0;

        &.no-border-right {
          border-right: none;
        }
      }
    }
    &-tbody {
      color: #000000;
      .td {
        min-width: 90px;
        min-height: 52px;
        line-height: 24px;
        padding: 14px 10px;
        display: flex;
        flex-shrink: 0;
        align-items: center;
        box-sizing: border-box;
        border-right: 1px solid #e5e5e5;
        &.no-border-right {
          border-right: none;
        }
      }
    }
  }
  .el-icon-question {
    font-size: 16px;
    margin-left: 4px;
    color: #c4c4c4;
    cursor: pointer;
  }
  .el-checkbox {
    margin-right: 6px;
  }
  .el-input {
    width: 102px;
  }
}
</style>



