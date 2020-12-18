<!-- 商品折扣促销结果 -->
<template>
  <div class="action goods-discount-action">
    <ul>
      <li v-if="!readonly">
        <el-radio v-model="mode" :label="MODE_ALL" @change="onModeChange" :disabled="readonly">统一折扣</el-radio>
        <el-input type="number" v-model.number="action.allRate" class="total number" size="small" placeholder="请输入折扣率" :disabled="readonly || mode != MODE_ALL"/>
      </li>
      <li v-if="!readonly">
        <el-radio v-model="mode" :label="MODE_SINGLE" @change="onModeChange" :disabled="readonly">分别折扣</el-radio>
        <el-button type="text" @click="dialogVisible = true" v-if="!readonly" :disabled="mode != MODE_SINGLE">添加</el-button>
      </li>
    </ul>

    <div class="discounts">
      <p v-if="mode == MODE_ALL">(符合促销条件的订单商品统一 {{getDiscountDesc(action.allRate)}})</p>
      <p v-if="mode == MODE_SINGLE" v-for="(item,index) in action.rates" :key="item.count">
        第 {{item.count}} 件 {{getDiscountDesc(item.rate)}};
        <a href="javascript:void(0)" @click="onRemoveGoodRate(index)" title="删除该折扣" v-if="!readonly">
          <i class="el-icon-close"></i>
        </a>
      </p>
    </div>

    <el-dialog title="添加商品折扣率" :visible.sync="dialogVisible" width="50%">
      <div>
        <el-form :model="formModel" :rules="rules" ref="ruleForm" label-width="100px">
          <el-form-item label="商品序号" prop="count" style="margin-bottom: 20px">
            <el-input-number v-model="formModel.count" controls-position="right" size="small" :min="1" :max="100"></el-input-number>
          </el-form-item>
          <el-form-item label="折扣率" prop="rate">
            <el-input-number v-model="formModel.rate" class="total number" controls-position="right" size="small" :min="0" :max="100"></el-input-number>
            <p class="tip">(第{{formModel.count}}个商品 {{getDiscountDesc(formModel.rate)}}，折扣率取值[0..100])</p>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="onOkClicked('ruleForm')">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import PromBaseObj from "../common/base.js";
const CMODE_ALL = "ALL";
const CMODE_SINGLE = "SINGLE";

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

  data() {
    return {
      // 折扣方式
      mode: CMODE_ALL,
      MODE_ALL: CMODE_ALL,
      MODE_SINGLE: CMODE_SINGLE,
      dialogVisible: false,
      formModel: {
        count: 1,
        rate: 100
      },
      rules: {
        count: [
          { required: true, message: "请输入商品序号", trigger: "blur" },
          {
            type: "number",
            min: 1,
            max: 100,
            message: "序号必须介于1到100之间",
            trigger: "blur"
          }
        ],
        rate: [
          { required: true, message: "请输入折扣率", trigger: "blur" },
          {
            type: "number",
            min: 0,
            max: 100,
            message: "折扣率必须介于1到100之间",
            trigger: "blur"
          }
        ]
      }
    };
  },

  methods: {
    onModeChange() {
      if (this.mode === CMODE_ALL) {
        this.action.rates = [];
      } else {
        this.action.allRate = null;
      }
    },

    onOkClicked(formName) {
      var self = this;
      this.$refs[formName].validate(valid => {
        if (valid) {
          self.addOrUpdateRate(self.formModel.count, self.formModel.rate);
          self.dialogVisible = false;
          self.formModel.count++;
        } else {
          return false;
        }
      });
    },

    /** 添加或更新商品的折扣率 */
    addOrUpdateRate(count, rate) {
      for (var r of this.action.rates) {
        if (r.count === count) {
          r.rate = rate;
          return;
        }
      }
      this.action.rates.push({
        count: count,
        rate: rate
      });
    },

    /** 删除指定序号的商品折扣 */
    onRemoveGoodRate(index) {
      this.action.rates.splice(index, 1);
    },

    /** 取得优惠描述 */
    getDiscountDesc(discount) {
      var rate = parseFloat(discount) / 10;
      if (rate === 10) {
        return "不优惠";
      } else {
        return rate + "折优惠";
      }
    }
  },

  created() {
    this.mode = this.action.allRate == null ? CMODE_SINGLE : CMODE_ALL;
    console.log(this.mode);
  }
};
</script>

