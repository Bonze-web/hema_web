<!-- 促销商品品牌条件 -->

<template>
  <div class="condition brand-condition">
    <el-input placeholder="请选择品牌" :disabled="readonly" v-model="displayName" icon="search" :on-icon-click="onClick" class="brand" size="small">
    </el-input>
    <p class="tip">(当购买指定品牌的商品时，执行促销结果)</p>
  </div>
</template>

<script>
import PromBaseObj from "../common/base.js";

export default {
  extends: PromBaseObj,
  name: "brand-condition",

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
      var brand = this.condition.brand;
      if (!brand || !brand.uuid) {
        return "";
      } else {
        return brand.name + "[" + brand.code + "]";
      }
    }
  },

  methods: {
    onClick() {
      var self = this;
      this.showBrandBrowser(function(brand) {
        self.condition.brand = brand;
      });
    }
  }
};
</script>
