<!-- 抵扣促销结果 -->
<template>
  <div class="action deduction-action">
    <el-input type="number" v-model.number="action.total" :disabled="readonly" placeholder="请输入抵扣金额" size="small" class="total number">
      <template slot="append">元</template>
    </el-input>
    <p class="tip">(赠送抵扣订单金额{{action.total}}元优惠)</p>
  </div>
</template>

<script>
import PromBaseObj from "../common/base.js";

export default {
  extends: PromBaseObj,

  props: {
    action: {
      type: Object,
      default: {}
    },
    readonly: {
      type: Boolean,
      default: false
    }
  }
};
</script>

