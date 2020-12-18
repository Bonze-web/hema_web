<!-- 送积分促销结果 -->
<template>
  <div class="action score-action">
    <el-input v-model="action.total" :disabled="readonly" placeholder="请输入积分" size="small" class="total number">
      <template slot="append">分</template>
    </el-input>
    <p class="tip">(赠送{{action.total}}积分)</p>
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

  methods: {}
};
</script>

