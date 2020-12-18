<!-- 送积分奖品促销结果 -->
<template>
  <div class="action prize-action">
    <el-input placeholder="请选择奖品" :disabled="readonly" v-model="displayName" icon="search" :on-icon-click="onClick" class="goods" size="small">
    </el-input>
    <p class="tip">(赠送奖品: {{displayName}})</p>
  </div>
</template>

<script>
import PromBaseObj from "../common/base.js";

export default {
  extends: PromBaseObj,

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

  computed: {
    displayName: function() {
      var prize = this.action.prize;
      if (!prize || !prize.uuid) {
        return "";
      } else {
        return prize.name + "[" + prize.code + "]";
      }
    }
  },

  methods: {
    onClick() {
      var self = this;
      this.showPrizeBrowser(function(prize) {
        self.action.prize = prize
          ? {
              uuid: prize.id,
              code: prize.code,
              name: prize.name
            }
          : {};
      });
    }
  }
};
</script>
