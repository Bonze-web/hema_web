<!-- 促销价促销结果 -->
<template>
  <div class="action price-action">
    <el-input type="number" v-model.number="action.price" :disabled="readonly" placeholder="请输入促销价格" size="small" class="total number">
    </el-input>
    <p class="tip">(满足条件的商品将以单价 {{action.price}} 元售卖)</p>
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

