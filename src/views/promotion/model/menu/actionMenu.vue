<!-- 添加条件工具栏 -->
<template>
  <el-dropdown @command="onCommand" trigger="click" class="action-menu">
    <span class="el-dropdown-link">
      添加
      <i class="el-icon-caret-bottom el-icon--right"></i>
    </span>
    <el-dropdown-menu slot="dropdown" class="action-menu-items">
      <el-dropdown-item command="add_amountCondition" v-if="mode === 0">订单总金额条件</el-dropdown-item>
      <el-dropdown-item command="add_countCondition" v-if="mode === 0">订单商品数量条件</el-dropdown-item>

      <el-dropdown-item command="add_goodsCondition" v-if="mode === 0" divided>商品条件</el-dropdown-item>
      <el-dropdown-item command="add_categoryCondition" v-if="mode === 0">商品分类条件</el-dropdown-item>
      <!-- <el-dropdown-item command="add_brandCondition" v-if="mode === 0">商品品牌条件</el-dropdown-item> -->
      <el-dropdown-item command="add_memberGradeCondition" v-if="mode === 0" divided>会员等级条件</el-dropdown-item>
      <el-dropdown-item command="add_memberScoreCondition" v-if="mode === 0">会员积分条件</el-dropdown-item>
      <el-dropdown-item command="add_memberBirthdayCondition" v-if="mode === 0">会员生日条件</el-dropdown-item>
      <el-dropdown-item command="add_memberDayCondition" v-if="mode === 0">会员日条件</el-dropdown-item>

      <el-dropdown-item command="add_basketCondition" v-if="mode === 0" divided>购物篮条件</el-dropdown-item>
      <el-dropdown-item command="add_compositeCondition" v-if="mode === 0">组合条件</el-dropdown-item>

      <el-dropdown-item command="add_eventCondition" v-if="mode === 0" divided>场景促销</el-dropdown-item>

      <el-dropdown-item command="clearConditions" v-if="mode === 0" divided>清空全部条件</el-dropdown-item>

      <el-dropdown-item command="add_deductionAction" v-if="mode === 1">抵扣</el-dropdown-item>
      <el-dropdown-item command="add_discountAction" v-if="mode === 1">订单折扣</el-dropdown-item>

      <el-dropdown-item command="add_goodsDiscountAction" divided v-if="mode === 1">商品折扣</el-dropdown-item>
      <el-dropdown-item command="add_goodsAction" v-if="mode === 1">送商品</el-dropdown-item>
      <el-dropdown-item command="add_priceAction" v-if="mode === 1">促销价</el-dropdown-item>

      <el-dropdown-item command="add_scoreAction" divided v-if="mode === 1">送积分</el-dropdown-item>
      <el-dropdown-item command="add_nscoreAction" v-if="mode === 1">翻倍积分</el-dropdown-item>

      <el-dropdown-item command="add_couponAction" divided v-if="mode === 1">送券</el-dropdown-item>
      <el-dropdown-item command="add_excouponAction" v-if="mode === 1">送外部券</el-dropdown-item>
      <!-- <el-dropdown-item command="add_prizeAction" v-if="mode === 1">送奖品</el-dropdown-item> -->
      <el-dropdown-item command="add_useCouponAction" v-if="mode == 1">用券</el-dropdown-item>

      <el-dropdown-item command="clearActions" divided v-if="mode === 1">清空全部结果</el-dropdown-item>

      <!-- 购物篮菜单 -->
      <el-dropdown-item command="add_goodsCondition" v-if="mode === 2">商品</el-dropdown-item>
      <el-dropdown-item command="add_categoryCondition" v-if="mode === 2">分类</el-dropdown-item>
      <!-- <el-dropdown-item command="add_brandCondition" v-if="mode === 2">品牌</el-dropdown-item> -->
      <el-dropdown-item command="add_amountCondition" v-if="mode === 3">商品总金额</el-dropdown-item>
      <el-dropdown-item command="add_countCondition" v-if="mode === 3">商品数量</el-dropdown-item>

    </el-dropdown-menu>
  </el-dropdown>
</template>

<script>
import PromBaseObj from "../common/base.js";

export default {
  extends: PromBaseObj,

  props: {
    /** 0: 促销条件 1：促销结果 2: 购物篮商品过滤条件 3:购物篮汇总条件 */
    mode: 0
  },

  methods: {
    onCommand(cmd) {
      if (/^add_(.*)Condition$/.test(cmd)) {
        this.$emit("onaddcondition", cmd.substring(4));
      } else if (/^add_(.*)Action$/.test(cmd)) {
        this.$emit("onaddaction", cmd.substring(4));
      } else if (cmd === "clearConditions") {
        this.$emit("onclearconditions");
      } else if (cmd === "clearActions") {
        this.$emit("onclearactions");
      }
    }
  }
};
</script>

