<!-- 促销商品分类条件 -->
<template>
  <div class="condition category-condition">
    <!-- <category-selector :readonly="readonly" :init-data="condition.category" @onselected="onSelected"></category-selector> -->

    <category-tree-selector :readonly="readonly" :init-data="condition.category" @onselected="onSelected"></category-tree-selector>

    <p class="tip">(当购买 {{displayName}} 菜单下的商品时，执行促销结果)</p>
    <div v-if="false">
      <el-button type="text" v-if="!readonly" @click="onAddExcludeGoods">排除以下商品</el-button>
      <span v-if="readonly && condition.excludesGoods  && condition.excludesGoods.length > 0">排除以下商品</span>
      <ol>
        <li v-for="(item, index) in condition.excludesGoods" :key="index">
          <goods-selector :readonly="readonly" :init-data="item" :category-id="condition.category.uuid"></goods-selector>
          <el-button type="text" @click="onRemoveGoods(index)" title="删除该条件" v-if="!readonly">
            <i class="el-icon-close"></i>
          </el-button>
        </li>
      </ol>
    </div>
  </div>
</template>

<script>
import PromBaseObj from "../common/base.js";
import CategoryTreeSelector from "../components/categoryTreeSelector";
import GoodsSelector from "../components/goodsSelector";

export default {
  extends: PromBaseObj,
  ame: "category-condition",

  components: {
    CategoryTreeSelector,
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
      var category = this.condition.category;
      if (!category || !category.uuid) {
        return "";
      } else {
        return category.name;
        // return category.name + "[" + category.code + "]";
      }
    }
  },

  methods: {
    onSelected(category) {
      console.log(category);
      if (!category) {
        category = {
          uuid: "",
          code: "",
          name: ""
        };
      }
      this.condition.category = category;
    },

    onAddExcludeGoods() {
      if (!this.condition.category.uuid) {
        this.$message({
          message: "请先选择商品分类",
          type: "warning"
        });
        return;
      }

      if (!this.condition.excludesGoods) {
        this.condition.excludesGoods = [];
      }
      this.condition.excludesGoods.push({
        uuid: "",
        code: "",
        name: ""
      });
    },

    /**
     * 删除指定的排除商品
     *
     * @param index
     */
    onRemoveGoods(index) {
      this.condition.excludesGoods.splice(index, 1);
    }
  }
};
</script>
