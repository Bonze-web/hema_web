<!-- 会员生日条件 -->
<template>
  <div class="condition member-birthday-condition">
    <el-checkbox v-model="condition.isBirthday" disabled>会员当天生日</el-checkbox>
    <p class="tip">(当天{{condition.isBirthday?'是':'不是'}}会员生日时，执行促销结果)</p>
  </div>
</template>

<script>
import PromBaseObj from "../common/base.js";

export default {
  extends: PromBaseObj,
  name: "member-birthday-condition",

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

  methods: {}
};
</script>

