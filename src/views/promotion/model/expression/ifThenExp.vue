<!-- 条件表达式 -->
<template>
  <el-tabs value="conditions" class="if-then-exp">
    <el-tab-pane label="促销条件" name="conditions" class="conditions">
      <promotion-condition :condition="exp.condition" :readonly="readonly"></promotion-condition>
    </el-tab-pane>

    <el-tab-pane label="促销结果" name="actions" class="actions">
      <div class="top">
        <action-menu v-bind:mode="1" class="menu" v-if="!readonly" @onaddaction="onAddAction" @onclearactions="onClearActions">
        </action-menu>
      </div>

      <el-table :data="exp.actions" v-bind:show-header="false" class="table">
        <el-table-column type="index" width="50"></el-table-column>

        <el-table-column>
          <template slot-scope="scope">
            <el-form label-width="90px">
              <el-form-item :label="scope.row.description">
                <promotion-action :action="scope.row" :readonly="readonly"></promotion-action>
              </el-form-item>
              <div style="margin-top:-22px">
                <el-button type="text" style="margin-left:90px;" size="small" @click="scope.row.showAdv=!scope.row.showAdv">高级</el-button>
                <el-collapse-transition>
                  <div v-show="scope.row.showAdv">
                    <el-form-item label="优先级">
                      <el-input-number v-model.number="scope.row.priority" :min="1" :max="99" :disabled="readonly" size="small" controls-position="right"></el-input-number>
                      <p class="tip">(1~99，值越大优先级越高，如果促销结果有冲突将优先取优先级高的)</p>
                    </el-form-item>
                    <el-form-item label="促销冲突">
                      <el-checkbox-group v-model="scope.row.conflicts">
                        <el-checkbox v-for="item in actionTypes" :label="item.type" :key="item.type" :disabled="readonly">{{item.description}}</el-checkbox>
                      </el-checkbox-group>
                    </el-form-item>
                    <!-- <el-form-item label="促销约束">
                      <constraints :action="scope.row" :readonly="readonly"></constraints>
                    </el-form-item> -->
                  </div>
                </el-collapse-transition>
              </div>
            </el-form>
          </template>
        </el-table-column>

        <el-table-column width="55" align="center" v-if="!readonly">
          <template slot-scope="scope">
            <el-button type="text" @click="onRemoveAction(scope.$index)" title="删除该结果">
              <i class="el-icon-close"></i>
            </el-button>
          </template>
        </el-table-column>

      </el-table>
    </el-tab-pane>
  </el-tabs>
</template>

<script>
import PromBaseObj from "../common/base.js";
import PromotionCondition from "../condition/condition";
import CompositeCondition from "../condition/compositeCondition";
import PromotionAction from "../action/action";
import ActionMenu from "../menu/actionMenu";
import Constraints from "../components/constraints";

export default {
  extends: PromBaseObj,
  name: "if-then-exp",

  components: {
    PromotionCondition,
    CompositeCondition,
    PromotionAction,
    ActionMenu,
    Constraints
  },

  props: {
    exp: {
      type: Object,
      default: {}
    },
    readonly: {
      type: Boolean,
      default: false
    }
  },

  methods: {
    /**
     * 删除条件
     */
    onRemoveAction(index) {
      this.exp.actions.splice(index, 1);
    },

    /**
     * 添加指定的促销结果
     */
    onAddAction(name) {
      var obj = this.getDefPromObj(name);
      if (!obj) {
        console.log("找不到对应促销条件");
        this.showMsg("找不到对应促销条件");
        return;
      }
      obj.showAdv = false;
      this.exp.actions.push(obj);
    },

    /**
     * 删除所有促销结果
     */
    onClearActions() {
      this.exp.actions = [];
    }
  },

  created() {}
};
</script>
