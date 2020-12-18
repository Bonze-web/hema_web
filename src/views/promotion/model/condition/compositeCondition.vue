<!-- 组合条件 -->
<template>
  <div class="condition composite-condition" :class="{ readonly: readonly }">
    <div class="top">
      <action-menu v-bind:mode="menuMode" class="menu" v-if="!readonly" @onaddcondition="onAddCondition" @onclearconditions="onClearConditions">
      </action-menu>
      <div class="radio logical">
        <span class="title">运算逻辑:</span>
        <el-select v-model="condition.logical" placeholder="请选择" size="small" :disabled="readonly" class="select">
          <el-option key="and" label="且" value="and"></el-option>
          <el-option key="or" label="或" value="or"></el-option>
        </el-select>
      </div>
    </div>

    <el-table :data="condition.conditions" v-bind:show-header="false" class="table">
      <el-table-column type="index" width="50"></el-table-column>

      <el-table-column>
        <template slot-scope="scope">
          <promotion-condition :condition="scope.row" :readonly="readonly"></promotion-condition>
        </template>
      </el-table-column>

      <el-table-column width="55" align="center" v-if="!readonly">
        <template slot-scope="scope">
          <el-button type="text" @click="onRemove(scope.$index)" title="删除该条件">
            <i class="el-icon-close"></i>
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import PromBaseObj from "../common/base.js";
import ActionMenu from "../menu/actionMenu";

export default {
  extends: PromBaseObj,
  name: "composite-condition",

  components: {
    ActionMenu
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
    }
  },

  beforeCreate: function() {
    // 因为与Condition.vue组件存在循环调用，所以这里通过动态加载组件, https://cn.vuejs.org/v2/guide/components.html#递归组件
    this.$options.components.PromotionCondition = require("./condition.vue").default;
  }
};
</script>
