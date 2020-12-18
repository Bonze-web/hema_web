<!-- 送券促销结果 -->
<template>
  <div class="action coupon-action">
    <coupon-selector :readonly="readonly" :init-data="action.activity" @onselected="onSelected"></coupon-selector>
    <el-input-number v-model="action.count" :min="1" :disabled="readonly" size="small" controls-position="right"></el-input-number>
    <label>张</label>
    <p class="tip">(赠送{{action.count}}张{{display}}券 )</p>
  </div>
</template>

<script>
import PromBaseObj from "../common/base.js";
import CouponSelector from "../components/couponSelector";

export default {
  extends: PromBaseObj,

  components: {
    CouponSelector
  },

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

  computed: {
    display: function() {
      var activity = this.action.activity;
      if (!activity || !activity.uuid) {
        return "";
      } else {
        return activity.name;
      }
    }
  },

  methods: {
    onSelected(activity) {
      console.log(activity);
      if (!activity) {
        activity = {
          uuid: "",
          code: "",
          name: ""
        };
      }
      this.action.activity = activity;
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
</style>
