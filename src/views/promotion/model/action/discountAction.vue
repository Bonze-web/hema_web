<!-- 折扣促销结果 -->
<template>
  <div class="action discount-action">
    <el-input type="number" v-model.number="action.total" class="total number" size="small" placeholder="请输入折扣率" :disabled="readonly"/>
    <p class="tip">(订单总金额{{getDiscountDesc(action.total)}}，折扣率取值[0..100])</p>
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
  },

  methods: {
    /** 取得优惠描述 */
    getDiscountDesc(discount) {
      var rate = parseFloat(discount) / 10;
      if (rate === 10) {
        return "不优惠";
      } else {
        return rate + "折优惠";
      }
    }
  }
};
</script>

