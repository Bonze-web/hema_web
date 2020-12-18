<!-- 购物篮促销条件，一种特殊的组合条件 -->
<template>
  <div class="condition basket-condition" :class="{ readonly: readonly }">
    <el-table :data="condition.conditions" v-bind:show-header="false" :highlight-current-row="false" :stripe="false" class="table">
      <el-table-column width="60" align="center">
        <template slot-scope="scope">
          <span v-if="scope.$index == 0" class="title">商品范围</span>
          <span v-if="scope.$index == 1" class="title">统计条件</span>
          <span v-if="scope.$index == 2" class="title">排除商品</span>
        </template>
      </el-table-column>

      <el-table-column>
        <template slot-scope="scope">
          <promotion-condition :condition="scope.row" v-bind:menuMode="scope.$index==1? 3: 2" :readonly="readonly" :class="{ 'exclude-goods': scope.$index == 2}"></promotion-condition>
          <el-button size="mini" type="text" icon="el-icon-plus" :disabled="hasExcludeGoods" v-if="(scope.$index==0) && !readonly" @click="onAddExcludeGoods">添加排除商品</el-button>
          <el-button size="mini" type="text" icon="el-icon-delete" v-if="(scope.$index==2) && !readonly" @click="onDelExcludeGoods">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <p class="tip">(对指定的商品来源列表进行统计的促销条件)</p>
  </div>
</template>  

<script>
import PromBaseObj from "../common/base.js";

export default {
  extends: PromBaseObj,
  name: "basket-condition",

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

  computed: {
    hasExcludeGoods() {
      return this.condition.conditions && this.condition.conditions.length > 2;
    }
  },

  methods: {
    /**
     * 删除条件
     */
    onRemove(index) {
      this.condition.conditions.splice(index, 1);
    },

    /**
     * 添加促销条件
     */
    onAddCondition(name) {
      console.log("添加 " + name);
      var obj = this.getDefPromObj(name);
      if (!obj) {
        console.error("找不到对应促销条件");
        return;
      }
      this.condition.conditions.push(obj);
    },

    /**
     * 清空当前组合条件的所有子条件
     */
    onClearConditions() {
      this.condition.conditions = [];
    },

    /** 添加排除商品条件  */
    onAddExcludeGoods() {
      var conds = this.condition.conditions;
      if (conds && conds.length < 3) {
        conds.push({
          /** 第三个条件是排除商品条件 */
          type: "compositeCondition",
          logical: "or",
          conditions: []
        });
      }
    },

    /** 删除排除商品条件  */
    onDelExcludeGoods() {
      var conds = this.condition.conditions;
      if (conds && conds.length > 2) {
        this.condition.conditions.splice(2, 1);
      }
    }
  },

  beforeCreate: function() {
    // 因为与Condition.vue组件存在循环调用，所以这里通过动态加载组件, https://cn.vuejs.org/v2/guide/components.html#递归组件
    this.$options.components.PromotionCondition = require("./condition.vue").default;
  }
};
</script>
