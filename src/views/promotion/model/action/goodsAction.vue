<!-- 送商品促销结果 -->
<template>
  <div class="action goods-action">
    <goods-selector
      :readonly="readonly"
      :init-data="action.goods"
      @onselected="onSelected"
    ></goods-selector>
    <p class=" tip ">(赠送商品: {{displayName}})</p>
  </div>
</template>

<script>
import PromBaseObj from "../common/base.js";
import GoodsSelector from "../components/goodsSelector";

export default {
  extends: PromBaseObj,

  components: {
    GoodsSelector
  },

  props: {
    action: {
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

  data() {
    return {
      // goodsDlgVisible: false
    };
  },

  computed: {
    displayName: function() {
      var goods = this.action.goods;
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
          name: "",
          image: ""
        };
      }
      this.action.goods = goods;
    }
  }
};
</script>
