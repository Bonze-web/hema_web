<template>
  <div class="page">
    <imp-panel
      title="新建促销单"
      class="header"
    >
      <span slot="header">
        <span class="title">
          <el-button
            type="text"
            icon="el-icon-back"
            @click="goback"
          >返回</el-button>
          <span class="separator-line"></span>
          <span v-text="title"></span>
        </span>
        <span class="toolbox">
          <el-button
            size="small"
            @click="goback"
            v-if="bill.state === 'unsubmit'"
          >取消</el-button>
          <el-button
            @click="onCopy"
            v-if="bill.id && hasOnePermission(PermIds.PROMOTION_BILL_CREATE, PermIds.PROMOTION_BILL_UPDATE)"
            size="small"
          >复制</el-button>
          <el-button
            @click="onAbolish"
            v-if="bill.state === 'submit' && hasPermission(PermIds.PROMOTION_BILL_ABOLISH)"
            type="danger"
            size="small"
          >作废</el-button>
          <el-button
            @click="onDelete"
            v-if="bill.state === 'unsubmit' && bill.id && hasPermission(PermIds.PROMOTION_BILL_REMOVE)"
            type="danger"
            icon="el-icon-delete"
            size="small"
          >删除</el-button>
          <el-button
            @click="onSubmit"
            v-if="bill.state === 'unsubmit' && hasPermission(PermIds.PROMOTION_BILL_SUBMIT)"
            icon="el-icon-check"
            size="small"
          >保存并提交</el-button>
          <el-button
            @click="onSave"
            v-if="bill.state === 'unsubmit' && hasOnePermission(PermIds.PROMOTION_BILL_CREATE, PermIds.PROMOTION_BILL_UPDATE)"
            type="primary"
            icon="el-icon-check"
            size="small"
          >保存</el-button>
        </span>
      </span>
    </imp-panel>

    <!-- 单头 -->
    <el-card class="card body-bill">
      <div slot="header">
        <span
          @click="onHideCard('master')"
          class="title"
        >基本信息
          <i
            class="icon"
            v-bind:class="{ 'el-icon-arrow-up': !HIDINGS.master, 'el-icon-arrow-down': HIDINGS.master}"
          ></i>
        </span>
      </div>

      <el-collapse-transition>
        <div v-show="!HIDINGS.master">
          <el-form
            class="master-form"
            ref="masterForm"
            :class="{readonly: readonly}"
            :model="bill"
            :rules="rules"
            label-width="120px"
          >

            <el-form-item
              label="单号"
              prop="id"
              v-if="bill.id"
              class="billNumber"
            >
              {{bill.id}}
            </el-form-item>

            <el-form-item
              label="状态"
              prop="state"
              v-if="bill.id"
              class="state"
            >
              {{billStateName}}
            </el-form-item>

            <el-form-item
              label="主题"
              prop="subject"
            >
              <el-input
                v-model.trim="bill.subject"
                placeholder="请输入活动主题"
                v-bind:minlength="3"
                v-bind:maxlength="50"
                :disabled="readonly"
                v-if="!readonly"
              >
              </el-input>
              <div v-if="readonly">{{bill.subject}}</div>
            </el-form-item>
            <el-form-item
              label="标签名称"
              prop="labelName"
            >
            <el-input
                v-model.trim="bill.labelName"
                placeholder="请输入标签名称"
                v-bind:maxlength="20"
                :disabled="readonly"
                v-if="!readonly"
              >
              </el-input>
              <div v-if="readonly">{{bill.labelName}}</div>
            </el-form-item>
            <el-form-item
              label="起止时间"
              prop="timeRange"
            >
              <time-range-condition
                :condition="timeRange"
                :readonly="readonly"
                v-if="!readonly"
              ></time-range-condition>
              <div v-if="readonly">{{timeRange.begin}} ~ {{timeRange.end}}</div>
            </el-form-item>

            <el-form-item
              label="生效门店"
              prop="store"
            >
              <store-condition
                :condition="storeRange"
                :readonly="readonly"
              ></store-condition>
            </el-form-item>

            <el-form-item
              label="备注"
              prop="remark"
            >
              <el-input
                type="textarea"
                v-model.trim="bill.remark"
                placeholder="请输入活动备注"
                v-bind:maxlength="1024"
                :disabled="readonly"
              >
              </el-input>
            </el-form-item>
          </el-form>
        </div>
      </el-collapse-transition>
    </el-card>

    <!--表达式 -->
    <el-form id="exps-container">
      <el-card
        class="card body-exps"
        v-for="(exp,index) in bill.exps"
        :key="index"
      >
        <div slot="header">
          <span
            class="title"
            @click="onHideCard('exp' + index)"
          >促销规则{{index+1}}
            <i
              class="icon"
              v-bind:class="{ 'el-icon-arrow-up': !HIDINGS['exp' + index], 'el-icon-arrow-down': HIDINGS['exp' + index]}"
            ></i>
          </span>
          <el-button
            :id="'exp-btn' + index"
            style="float: right; padding: 3px 0"
            type="text"
            icon="el-icon-plus"
            title="添加表达式"
            @click="onAddExp(index)"
            v-if="!readonly"
          ></el-button>
          <el-button
            :id="'exp-btn' + index"
            style="float: right; padding: 3px 15px"
            type="text"
            icon="el-icon-delete"
            title="删除表达式"
            @click="onDelExp(index)"
            v-if="!readonly && bill.exps.length > 1"
          ></el-button>
        </div>
        <promotion-exp
          :exp="exp"
          :readonly="readonly"
          v-show="!HIDINGS['exp' + index]"
        ></promotion-exp>
      </el-card>
    </el-form>

  </div>

</template>

<script>
import "../model/res/model.scss";
import BaseModule from "@/utils/baseModule";
import * as Utils from "@/utils/index";
import * as BillUtils from "../utils/billUtils";
import Panel from "@/components/panel.vue";
import TimeRangeCondition from "../model/condition/timeRangeCondition";
import StoreCondition from "../model/condition/storeCondition";
import PromotionExp from "../model/expression/exp";
import PromotionService from "../service/service";
import PermIds from "@/api/permissionIds";
import { mapGetters } from "vuex";

export default {
  extends: BaseModule,

  components: {
    "imp-panel": Panel,
    "time-range-condition": TimeRangeCondition,
    "store-condition": StoreCondition,
    "promotion-exp": PromotionExp
  },

  data: function() {
    var validateTimeRange = (rule, value, callback) => {
      value = this.timeRange;

      if (!value.begin) {
        callback(new Error("请输入活动起始时间"));
      } else if (!value.end) {
        callback(new Error("请输入活动截止时间"));
      } else {
        callback();
      }
    };

    return {
      bill: {}, // 单据
      showMaster: true, // 显示表头
      HIDINGS: {},

      ruleForm: {
        name: "",
        desc: ""
      },

      PermIds: PermIds,

      rules: {
        subject: [
          { required: true, message: "请输入活动主题", trigger: "blur" },
          { min: 3, max: 50, message: "长度在 3 到 50 个字符", trigger: "blur" }
        ],
        timeRange: [
          // { required: true, message: "请输入起止时间", trigger: "blur" },
          { required: true, validator: validateTimeRange, trigger: "blur" }
        ]
      }
    };
  },

  computed: {
    ...mapGetters(["hasPermission", "hasOnePermission", "workingOrg"]),

    /** 页面标题 */
    title() {
      if (!this.bill.id) {
        return "新增促销单";
      } else if (this.bill.state === "unsubmit") {
        return "编辑促销单";
      } else {
        return "查看促销单";
      }
    },

    /**
     * 单据是否只读
     */
    readonly: function() {
      return (
        this.bill &&
        (this.bill.state === "submit" || this.bill.state === "abolished")
      );
    },

    /**
     * 单据状态名称
     */
    billStateName: function() {
      return BillUtils.getStateName(this.bill.state);
    },

    /** 前置条件: 促销时间范围 */
    timeRange: function() {
      var pc = this.bill.precondition;
      if (pc && pc.conditions && pc.conditions.length > 0) {
        return pc.conditions[0];
      } else {
        return { begin: null, end: null };
      }
    },

    /** 前置条件: 门店范围 */
    storeRange: function() {
      var pc = this.bill.precondition;
      if (pc && pc.conditions && pc.conditions.length > 1) {
        var sbc = pc.conditions[1];
        if (sbc.conditions && sbc.conditions.length > 0) {
          return sbc.conditions[0];
        }
      }
      return { stores: [] };
    },

    /** 前置条件: 业态范围 */
    businessRange: function() {
      var pc = this.bill.precondition;
      if (pc && pc.conditions && pc.conditions.length > 1) {
        var sbc = pc.conditions[1];
        if (sbc.conditions && sbc.conditions.length > 1) {
          return sbc.conditions[1];
        }
      }
      return { business: [] };
    }
  },

  methods: {
    onHideCard(key) {
      this.$set(this.HIDINGS, key, !this.HIDINGS[key]);
    },

    /** 回退 */
    goback() {
      this.$router.push({ path: "/promotion/bill" });
    },

    /**
     * 重新加载单据
     *
     * @param id 单据ID
     */
    reload(id) {
      var self = this;
      var call = null;
      if (id) {
        call = this.getById(id);
      } else {
        call = this.createBill();
      }

      call
        .then(data => {
          self.reloadByData(data);
        })
        .catch(err => {
          Utils.showError(err);
        });
    },

    /**
     * 重新加载数据
     *
     * @param data 促销单对象
     */
    reloadByData(data) {
      var self = this;
      data.exps.map(function(exp) {
        exp.actions.map(function(action) {
          action.showAdv = false;
        });
      });
      self.bill = data;
    },

    /**
     * 通过id查找单据
     *
     * @param id 促销单ID
     */
    getById(id) {
      return PromotionService.getBillById(id);
    },

    /**
     * 创建新的空白单据
     */
    createBill() {
      return new Promise(function(resolve, reject) {
        resolve(BillUtils.emptyBill());
      });
    },

    /**
     * 添加新的表达式
     *
     * @param index 当前索引
     */
    onAddExp(index) {
      this.bill.exps.push(BillUtils.newExpression());
      this.$nextTick(function() {
        // var btn = document.getElementById("exp-btn" + index);
        // console.log(btn);
        // btn.focus();
      });
    },

    /**
     * 删除表达式
     * @param index 删除的索引
     */
    onDelExp(index) {
      if (this.bill.exps.length <= 1) {
        this.$message.warning("一个促销单必须至少有一个表达式");
      } else {
        this.$confirm("是否删除促销规则" + (index + 1) + "?", "提示", {
          type: "warning"
        })
          .then(() => {
            this.bill.exps.splice(index, 1);
            this.$message.success("删除成功!");
          })
          .catch(() => {});
      }
    },

    /**
     * 保存操作
     */
    onSave() {
      var self = this;
      this.doValidate()
        .then(valid => {
          console.log("验证成功");
          self.doSave(false);
        })
        .catch(err => {
          this.$message.error(err);
        });
    },

    /**
     * 提交操作
     */
    onSubmit() {
      var self = this;
      this.doValidate()
        .then(valid => {
          self.doSave(true);
        })
        .catch(err => {
          this.$message.error(err);
        });
    },

    /**
     * 校验输入
     */
    doValidate() {
      var self = this;
      return new Promise(function(resolve, reject) {
        self.$refs["masterForm"].validate(valid => {
          if (!valid) {
            reject("输入非法，请修改后再试");
          } else {
            resolve(true);
          }
        });
      });
    },

    /**
     * 保存并提交操作
     */
    doSave(submit) {
      var self = this;

      function _do_save() {
        PromotionService.saveBill(self.bill, submit)
          .then(() => {
            self.$message({
              message: "操作成功！",
              type: "success",
              duration: 1000,
              onClose: function() {
                self.goback();
              }
            });
          })
          .catch(err => {
            Utils.showError(err);
          });
      }

      if (!submit) {
        _do_save();
      } else {
        this.$confirm("是否确认提交促销单?", "提示", {
          type: "warning"
        })
          .then(() => {
            _do_save();
          })
          .catch(() => {});
      }
    },

    /**
     * 作废促销单
     */
    onAbolish() {
      var self = this;
      this.$confirm("是否确认作废促销单?", "提示", {
        type: "warning"
      })
        .then(() => {
          return PromotionService.abolishBill(self.bill.id);
        })
        .then(data => {
          self.$message({
            message: "操作成功！",
            type: "success",
            duration: 1000,
            onClose: function() {
              self.goback();
            }
          });
        })
        .catch(err => {
          if (err !== "cancel") {
            Utils.showError(err);
          }
        });
    },

    /**
     * 删除促销单
     */
    onDelete() {
      var self = this;
      this.$confirm("是否确认删除促销单?", "提示", {
        type: "warning"
      })
        .then(() => {
          return PromotionService.removeBillById(self.bill.id);
        })
        .then(data => {
          self.$message({
            message: "操作成功！",
            type: "success",
            duration: 1000,
            onClose: function() {
              self.goback();
            }
          });
        })
        .catch(err => {
          if (err !== "cancel") {
            Utils.showError(err);
          }
        });
    },

    /**
     * 复制促销单
     */
    onCopy() {      
      return this.doCopy(this.bill.id)
    },

    /** 
     * 执行复制
     */
    doCopy(id) {
      var self = this;
      return PromotionService.copy(id)
        .then(data => {
          self.reloadByData(data);
        })
        .catch(err => {
          if (err !== "cancel") {
            Utils.showError(err);
          }
        });
    }

  },

  created() {
    var action = this.$route.query.action;
    if (action === "copy") {
      this.doCopy(this.$route.query.id);
    } else {
      this.reload(this.$route.query.id);
    }
  }
};
</script>

<style lang="scss">
.page {
  .el-form-item {
    &:last-child {
      margin-bottom: 0;
    }
  }
}
</style>


<style rel="stylesheet/scss" lang="scss" scoped>
.page {
  $bg-color: #ffffff;

  .header {
    .title .el-button--text {
      color: #606266;
    }

    .separator-line {
      height: 16px;
      width: 0;
      margin: 0 10px;
      border-left: 1px solid #dcdfe6;
    }

    .toolbox {
      float: right;
    }
  }

  .body-bill {
    .title {
      cursor: pointer;
    }
    .master-form {
      .el-input,
      .el-textarea {
        max-width: 400px;
      }
    }

    .master-form.readonly {
      .el-form-item {
        margin-bottom: 0px !important;
      }
    }
  }

  .body-exps {
    margin-top: 20px;

    .title {
      cursor: pointer;
    }
  }
}
</style>
