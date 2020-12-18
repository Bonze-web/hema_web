<!-- 促销结果 -->
<template>
  <div>
    <goods-action :action="action" :readonly="readonly" v-if="action.type == 'goodsAction'"></goods-action>
    <deduction-action :action="action" :readonly="readonly" v-if="action.type == 'deductionAction'"></deduction-action>
    <score-action :action="action" :readonly="readonly" v-if="action.type == 'scoreAction'"></score-action>
    <nscore-action :action="action" :readonly="readonly" v-if="action.type == 'nscoreAction'"></nscore-action>
    <coupon-action :action="action" :readonly="readonly" v-if="action.type == 'couponAction' && !action.activity.source"></coupon-action>
    <excoupon-action :action="action" :readonly="readonly" v-if="action.type == 'couponAction' && action.activity.source"></excoupon-action>
    <discount-action :action="action" :readonly="readonly" v-if="action.type == 'discountAction'"></discount-action>
    <prize-action :action="action" :readonly="readonly" v-if="action.type == 'prizeAction'"></prize-action>
    <use-coupon-action :action="action" :readonly="readonly" v-if="action.type == 'useCouponAction'"></use-coupon-action>
    <goods-discount-action :action="action" :readonly="readonly" v-if="action.type == 'goodsDiscountAction'"></goods-discount-action>
    <price-action :action="action" :readonly="readonly" v-if="action.type == 'priceAction'"></price-action>
  </div>
</template>

<script>
import PromBaseObj from "../common/base.js";
import CouponAction from "./couponAction.vue";
import ExcouponAction from "./excouponAction.vue";
import DeductionAction from "./deductionAction.vue";
import GoodsAction from "./goodsAction.vue";
import NScoreAction from "./nscoreAction.vue";
import PrizeAction from "./prizeAction.vue";
import ScoreAction from "./scoreAction.vue";
import UseCouponAction from "./useCouponAction.vue";
import DiscountAction from "./discountAction";
import GoodsDiscountAction from "./goodsDiscountAction";
import PriceAction from "./priceAction";

export default {
  extends: PromBaseObj,

  components: {
    "coupon-action": CouponAction,
    "deduction-action": DeductionAction,
    "goods-action": GoodsAction,
    "nscore-action": NScoreAction,
    "prize-action": PrizeAction,
    "score-action": ScoreAction,
    "use-coupon-action": UseCouponAction,
    "discount-action": DiscountAction,
    "goods-discount-action": GoodsDiscountAction,
    "excoupon-action": ExcouponAction,
    "price-action": PriceAction
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
  methods: {}
};
</script>
