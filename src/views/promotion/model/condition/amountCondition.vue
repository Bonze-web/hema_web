<!-- 订单金额条件 -->
<template>
  <div class="condition amount-condition">
    <el-input type="number" v-model.number="condition.total" :disabled="readonly" placeholder="请输入金额" size="small" class="total number">
      <template slot="append">元</template>
    </el-input>
    <p class="tip">(当订单总金额
      <b v-if="stepInfo.type=='STEP'">每满</b>
      <b v-else>大于等于</b>
      <b>{{condition.total}}</b> 元时，执行促销结果)</p>
    <div class="step">
      <step-info :stepinfo="stepInfo" :readonly="readonly"></step-info>
    </div>
  </div>
</template>      

<script>
import PromBaseObj from "../common/base.js";
import StepInfo from "./stepInfo";

export default {
  extends: PromBaseObj,
  name: "amount-condition",

  components: {
    StepInfo
  },

  props: {
    condition: {
      type: Object,
      default: function() {
        return { total: 0 };
      }
    },
    readonly: {
      type: Boolean,
      default: false
    }
  },

  computed: {
    stepInfo: function() {
      if (!this.condition.stepInfo) {
        this.condition.stepInfo = {
          type: "NONE"
        };
      }
      return this.condition.stepInfo;
    }
  },

  methods: {}
};
</script>
