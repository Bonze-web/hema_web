<!-- 促销订单商品数量条件 -->

<template>
  <div class="condition count-condition">
    <el-input
      v-model.number="condition.count"
      :disabled="readonly"
      placeholder="请输入商品数量"
      size="small"
      class="total number"
    >
      <template slot="append">件</template>
    </el-input>
    <p class="tip">(当订单商品数量
      <b v-if="stepInfo.type=='STEP'">每满</b>
      <b v-else>大于等于</b>
      <b>{{condition.count}}</b> 件时，执行促销结果)</p>
    <div class="step">
      <step-info
        :stepinfo="stepInfo"
        :readonly="readonly"
      ></step-info>
    </div>
  </div>
</template>

<script>
import PromBaseObj from "../common/base.js";
import StepInfo from "./stepInfo.vue";

export default {
  extends: PromBaseObj,
  ame: "count-condition",

  components: {
    "step-info": StepInfo
  },

  props: {
    condition: {
      type: Object,
      default: function() {
        return { count: 0 };
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
