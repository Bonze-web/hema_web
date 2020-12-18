<!-- 促销事件条件 -->

<template>
  <div class="condition event-condition">
    <el-select v-model="condition.event.type" clearable class="event" size="small" :disabled="readonly" placeholder="请选择">
      <el-option value="MBR_REGISTER" label="注册会员"></el-option>
      <el-option value="COMPLETE_MBR_INFO" label="完善会员资料"></el-option>
      <el-option value="MBR_SIGNIN" label="会员签到"></el-option>
      <el-option value="MBR_BENEFITS" label="会员权益"></el-option>
      <el-option value="INVITE_MEMBER" label="邀请会员"></el-option>
      <el-option value="RECHARGE" label="充值"></el-option>
      <el-option value="THIRD_PARTY_ACTIVITY" label="第三方促销活动"></el-option>
      <!-- <el-option value="WX_SHARE" label="微信分享"></el-option> -->
      <!-- <el-option value="JOIN_ACTIVITY" label="参加活动"></el-option>
      <el-option value="JOIN_PAPER" label="参加调查问卷"></el-option> -->
    </el-select>
    <p class="tip">(事件发生后，执行促销结果)</p>

    <el-row class="config register" v-if="condition.event.type == 'MBR_REGISTER'">
      <label>注册渠道:</label>
      <el-checkbox-group v-model="registerSources" :disabled="readonly">
        <el-checkbox v-for="source in REGISTER_SOURCE_REPO" :label="source.name" :key="source.name">{{source.label}}</el-checkbox>
      </el-checkbox-group>
    </el-row>

    <el-row class="config signin" v-if="condition.event.type == 'MBR_SIGNIN'">
      <label>连续签到天数</label>
      <el-input-number v-model="condition.event.params" :min="1" size="small" controls-position="right"></el-input-number>
    </el-row>

    <el-row class="config activity" v-if="condition.event.type == 'JOIN_ACTIVITY'">
      <label>活动</label>
      <el-input placeholder="请选择活动" :disabled="readonly" v-model="activityName" icon="search" :on-icon-click="onBrowserActivity" class="browser" size="small">
      </el-input>
      <p class="tip">(不指定表示任意活动)</p>
    </el-row>

    <el-row class="config paper" v-if="condition.event.type == 'JOIN_PAPER'">
      <label>调查问卷</label>
      <el-input placeholder="请选择调查问卷" :disabled="readonly" v-model="paperName" icon="search" :on-icon-click="onBrowserPaper" class="browser" size="small">
      </el-input>
      <p class="tip">(不指定表示任意调查问卷)</p>
    </el-row>

    <el-row class="config paper" v-if="condition.event.type == 'RECHARGE'">
      <label>充值金额范围</label>
      <el-input size="small" placeholder="请输入起始金额" v-model="rechargeBegin" @change="onRechangeChange" :min=0 :disabled="readonly" style="width: 130px"></el-input>
      <el-input size="small" placeholder="请输入截止金额" v-model="rechargeEnd" @change="onRechangeChange" :min=0 :disabled="readonly" style="width: 130px"></el-input>
      <p class="tip">(起始金额必填，截止金额可空，如果截止金额为空表示无上限)</p>
    </el-row>

    <el-row class="config paper" v-if="condition.event.type == 'THIRD_PARTY_ACTIVITY'">
      <el-checkbox-group v-model="thirdVenders" :disabled="readonly">
        <el-checkbox label="PIZZA_HURT">必胜客</el-checkbox>
      </el-checkbox-group>
    </el-row>

  </div>
</template>

<script>
import PromBaseObj from "../common/base.js";

export default {
  extends: PromBaseObj,
  name: "event-condition",

  props: {
    condition: {
      type: Object,
      default: function() {
        return { event: { type: "" } };
      }
    },
    readonly: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      rechargeBegin: 0,
      rechargeEnd: "",
      REGISTER_SOURCE_REPO: [
        {
          name: "APP",
          label: "APP"
        },
        {
          name: "ALIAPP",
          label: "支付宝小程序"
        },
        {
          name: "WXAPP",
          label: "微信小程序"
        },
        {
          name: "KOUBEI",
          label: "口碑商城"
        },
        {
          name: "CLERK_BIND",
          label: "店员绑定"
        }
      ]
    };
  },

  computed: {
    activityName: function() {
      var activity = this.condition.event.params;
      if (!activity || !activity.uuid) {
        return "";
      } else {
        return activity.name + "[" + activity.code + "]";
      }
    },

    paperName: function() {
      var paper = this.condition.event.params;
      if (!paper || !paper.uuid) {
        return "";
      } else {
        return paper.name;
      }
    },

    /** 第三方促销活动 */
    thirdVenders: {
      get() {
        var venders = [];
        if (this.condition.event.params) {
          try {
            venders = this.condition.event.params.split(",");
          } catch (e) {
            console.log(e);
          }
        }
        return venders;
      },

      set(venders) {
        this.condition.event.params = venders.join(",");
      }
    },

    /** 会员注册渠道 */
    registerSources: {
      get() {
        var sources = [];
        if (this.condition.event.params) {
          try {
            sources = this.condition.event.params.split(",");
          } catch (e) {
            console.log(e);
          }
        }
        return sources;
      },
      set(sources) {
        this.condition.event.params = sources.join(",");
      }
    }
  },

  methods: {
    onBrowserActivity() {
      var self = this;
      this.showActivityBrowser(function(activity) {
        self.condition.event.params = activity
          ? {
              uuid: activity.id,
              code: activity.activityCode,
              name: activity.activityTheme
            }
          : {};
      });
    },

    onBrowserPaper() {
      var self = this;
      this.showPaperBrowser(function(paper) {
        self.condition.event.params = paper
          ? {
              uuid: paper.id,
              code: paper.category,
              name: paper.theme
            }
          : {};
      });
    },

    /** 充值金额发生变化  */
    onRechangeChange() {
      if (this.condition.event.type === "RECHARGE") {
        this.condition.event.params = {
          begin: this.rechargeBegin || "",
          end: this.rechargeEnd || ""
        };
      }
    }
  },

  created() {
    if (this.condition.event.type === "RECHARGE") {
      this.rechargeBegin = this.condition.event.params.begin || "";
      this.rechargeEnd = this.condition.event.params.end || "";
    }
  }
};
</script>
