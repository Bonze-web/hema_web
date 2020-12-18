<!-- 促销表达式 -->
<template>
  <div class="exp-list">
    <if-then-exp v-if="exp.type == 'ifThenExpression'" :exp="exp" :readonly="readonly"></if-then-exp>
    <case-exp v-if="exp.type == 'caseExpression'" :exp="exp" :readonly="readonly"></case-exp>
  </div>
</template>

<script>
import PromBaseObj from "../common/base.js";
import IfThenExp from "./ifThenExp";
import CaseExp from "./caseExp";

export default {
  extends: PromBaseObj,
  name: "exp",

  components: {
    IfThenExp,
    CaseExp
  },

  props: {
    exp: {
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

