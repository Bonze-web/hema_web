<!-- 促销条件 -->

<template>
  <div>
    <composite-condition :condition="condition" :readonly="readonly" v-bind:menuMode="menuMode" v-if="condition.type == 'compositeCondition'"></composite-condition>
    <basket-condition :condition="condition" :readonly="readonly" v-if="condition.type == 'basketCondition'"></basket-condition>
    <amount-condition :condition="condition" :readonly="readonly" v-if="condition.type == 'amountCondition'"></amount-condition>
    <count-condition :condition="condition" :readonly="readonly" v-if="condition.type == 'countCondition'"></count-condition>
    <member-score-condition :condition="condition" :readonly="readonly" v-if="condition.type == 'memberScoreCondition'"></member-score-condition>
    <member-grade-condition :condition="condition" :readonly="readonly" v-if="condition.type == 'memberGradeCondition'"></member-grade-condition>
    <member-birthday-condition :condition="condition" :readonly="readonly" v-if="condition.type == 'memberBirthdayCondition'"></member-birthday-condition>
    <store-condition :condition="condition" :readonly="readonly" v-if="condition.type == 'storeCondition'"></store-condition>
    <business-condition :condition="condition" :readonly="readonly" v-if="condition.type == 'businessCondition'"></business-condition>
    <goods-condition :condition="condition" :readonly="readonly" v-if="condition.type == 'goodsCondition'"></goods-condition>
    <brand-condition :condition="condition" :readonly="readonly" v-if="condition.type == 'brandCondition'"></brand-condition>
    <category-condition :condition="condition" :readonly="readonly" v-if="condition.type == 'categoryCondition'"></category-condition>
    <event-condition :condition="condition" :readonly="readonly" v-if="condition.type == 'eventCondition'"></event-condition>
    <member-day-condition :condition="condition" :readonly="readonly" v-if="condition.type == 'memberDayCondition'"></member-day-condition>
  </div>
</template>

<script>
import PromBaseObj from "../common/base.js";
import AmountCondition from "./amountCondition";
import BrandCondition from "./brandCondition";
import BusinessCondition from "./businessCondition";
import BasketCondition from "./basketCondition";
import CategoryCondition from "./categoryCondition";
import CompositeCondition from "./compositeCondition";
import CountCondition from "./countCondition";
import EventCondition from "./eventCondition";
import GoodsCondition from "./goodsCondition";
import MemberBirthdayCondition from "./memberBirthdayCondition";
import MemberGradeCondition from "./memberGradeCondition";
import MemberScoreCondition from "./memberScoreCondition";
import StoreCondition from "./storeCondition";
import TimeRangeCondition from "./timeRangeCondition";
import MemberDayCondition from "./memberDayCondition";

export default {
  extends: PromBaseObj,
  name: "condition",

  components: {
    AmountCondition,
    BrandCondition,
    BusinessCondition,
    BasketCondition,
    CategoryCondition,
    CompositeCondition,
    CountCondition,
    EventCondition,
    GoodsCondition,
    MemberBirthdayCondition,
    MemberGradeCondition,
    MemberScoreCondition,
    StoreCondition,
    TimeRangeCondition,
    MemberDayCondition
  },

  props: {
    condition: {
      type: Object,
      default: {}
    },
    readonly: {
      type: Boolean,
      default: false
    },
    menuMode: {
      type: Number,
      default: 0
    }
  },

  methods: {}
};
</script>

