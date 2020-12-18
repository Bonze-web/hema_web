<!-- 会员积分条件 -->
<template>
  <div class="condition member-score-condition">
    <el-input v-model.number="condition.total" :readonly="readonly" placeholder="请输入会员积分" size="small" class="total number">
      <template slot="append">分</template>
    </el-input>
    <p class="tip">(当会员积分≥{{condition.total}}分时，执行促销结果)</p>
  </div>
</template>

<script>
import PromBaseObj from "../common/base.js";

export default {
  extends: PromBaseObj,
  name: "member-score-condition",

  props: {
    condition: {
      type: Object,
      default: {}
    },
    readonly: {
      type: Boolean,
      default: false
    }
  },

  data: function() {
    return {
      grades: []
    };
  },

  methods: {}
};
</script>
