<!-- 翻倍积分促销结果 -->
<template>
  <div class="action nscore-action">
    <el-input-number size="small" :disabled="readonly" v-model="action.total" class="total number" :min=1 placeholder="请输入倍数" controls-position="right">
    </el-input-number>
    <p class="tip">(赠送{{action.total}}倍积分)</p>
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

