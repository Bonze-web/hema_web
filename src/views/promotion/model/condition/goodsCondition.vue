<!-- 促销商品条件 -->
<template>
  <el-form-item prop="goods-condition" class="condition goods-condition">
    <goods-selector :readonly="readonly" :init-data="condition.goods" @onselected="onSelected"></goods-selector>
    <p class="tip">(当购买商品 {{displayName}} 时，执行促销结果)</p>
  </el-form-item>
</template>

<script>
import PromBaseObj from "../common/base.js";
import GoodsSelector from "../components/goodsSelector";

export default {
  extends: PromBaseObj,
  name: "goods-condition",

  components: {
    GoodsSelector
  },

  props: {
    condition: {
      type: Object,
      default: function() {
        return {};
      }
    },
    readonly: {
      type: Boolean,
      default: false
    }
  },

  computed: {
    displayName: function() {
      var goods = this.condition.goods;
      if (!goods || !goods.uuid) {
        return "";
      } else {
        return goods.name + "[" + goods.code + "]";
      }
    }
  },

  methods: {
    onSelected(goods) {
      console.log(goods);
      if (!goods) {
        goods = {
          uuid: "",
          code: "",
          name: ""
        };
      }
      this.condition.goods = goods;
    }
  }
};
</script>
