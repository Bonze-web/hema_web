<!-- 累加条件 -->
<template>
  <div class="step-info">
    <span class="title">叠加类型:</span>
    <el-select v-model="stepinfo.type" :disabled="readonly" placeholder="请选择" size="small" class="select">
      <el-option key="NONE" label="不可叠加" value="NONE"></el-option>
      <el-option key="STEP" label="可叠加" value="STEP"></el-option>
      <el-option key="STAIR" label="阶梯" value="STAIR" disabled></el-option>
    </el-select>
  </div>
</template>

<script>
import PromBaseObj from "../common/base.js";

export default {
  extends: PromBaseObj,
  name: "step-info",

  props: {
    stepinfo: {
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
