<!-- 促销约束 -->
<template>
  <el-form :model="action.constraints" ref="actionForm" label-width="150px" class="constraints" :disabled="readonly">
    <el-form-item label="总限额" prop="maxTotalCount">
      <el-input-number v-model="action.constraints.maxTotalCount"></el-input-number>
    </el-form-item>
    <el-form-item label="每日最大限额" prop="maxDayCount">
      <el-input-number v-model="action.constraints.maxDayCount"></el-input-number>
    </el-form-item>
    <el-form-item label="每会员最大限额" prop="maxPerMember">
      <el-input-number v-model="action.constraints.maxPerMember"></el-input-number>
    </el-form-item>
    <el-form-item label="每会员每天最大限额" prop="maxPerMemberPerDay">
      <el-input-number v-model="action.constraints.maxPerMemberPerDay"></el-input-number>
    </el-form-item>
    <el-form-item>
      <span class="tip">（为空或小于等于0表示不限制）</span>
    </el-form-item>
  </el-form>
</template>

<script>
import PromBaseObj from "../common/base.js";

export default {
  extends: PromBaseObj,
  name: "constraints",

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

  created() {
    if (!this.action.constraints) {
      this.action.constraints = {
        maxTotalCount: 0,
        maxDayCount: 0,
        maxPerMember: 0,
        maxPerMemberPerDay: 0
      };
    }
  }
};
</script>

