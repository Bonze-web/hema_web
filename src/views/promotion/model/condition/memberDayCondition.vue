<!-- 会员日条件 -->
<template>
  <div class="condition member-day-condition">
    <div v-if="!readonly">
      <el-row>
        <el-col class="label">
          <el-checkbox v-model="dayOfWeek" @change="onSelectDayOfWeek">每周：</el-checkbox>
        </el-col>
        <el-col :span="20" class="options">
          <el-checkbox-group v-model="dayOfWeekValues" @change="resetDays">
            <el-checkbox :label="item.value" v-for="item in weekOptions" :key="item.value" :disabled="!dayOfWeek">{{item.name}}</el-checkbox>
          </el-checkbox-group>
        </el-col>
      </el-row>
      <el-row>
        <el-col class="label">
          <el-checkbox v-model="dayOfMonth" @change="onSelectDayOfMonth">每月：</el-checkbox>
        </el-col>
        <el-col :span="20" class="options">
          <el-checkbox-group v-model="dayOfMonthValues" @change="resetDays">
            <el-checkbox :label="index + ''" v-for="index in 31" :key="index" :disabled="!dayOfMonth">{{index}}号</el-checkbox>
          </el-checkbox-group>
        </el-col>
      </el-row>
      <el-row>
        <el-col class="label">
          <el-checkbox v-model="dateOfYear" @change="onSelectDateOfYear">每年：</el-checkbox>
        </el-col>
        <el-col :span="20" class="options">
          <el-date-picker type="dates" v-model="dateOfYearValues" format="MM-dd" size="small" placeholder="选择一个或多个日期" style="width: 100%" :disabled="!dateOfYear" @change="resetDays"></el-date-picker>
        </el-col>
      </el-row>
    </div>
    <div v-else>
      <el-row v-if="dayOfWeekValues.length > 0">
        每周:
        <span v-for="item in dayOfWeekValues" :key="item" class="vblock">{{weekOptions[item-1].name}}</span>
      </el-row>
      <el-row v-if="dayOfMonthValues.length > 0">
        每月:
        <span v-for="item in dayOfMonthValues" :key="item" class="vblock">{{item}}号</span>
      </el-row>
      <el-row v-if="dateOfYearValues.length > 0">
        每年：
        <span v-for="(item, index) in dateOfYearValues" :key="index" class="vblock">{{item|formatDate}}</span>
      </el-row>
    </div>
    <p class="tip ">(在指定的会员日消费，执行促销结果)</p>
  </div>
</template>

<script>
import PromBaseObj from "../common/base.js";
import * as DateUtil from "@/utils/dateUtil";

const WEEKS = ["周一", "周二", "周三", "周四", "周五", "周六", "周日"];

export default {
  extends: PromBaseObj,
  name: "member-day-condition",

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

  data() {
    var weekOptions = [];
    for (var i = 0; i < WEEKS.length; ++i) {
      weekOptions.push({ value: i + 1 + "", name: WEEKS[i] });
    }

    return {
      weekOptions: weekOptions,
      dayOfWeek: true,
      dayOfWeekValues: [],

      dayOfMonth: false,
      dayOfMonthValues: [],

      dateOfYear: false,
      dateOfYearValues: []
    };
  },

  filters: {
    formatDate(v) {
      return v ? DateUtil.formatDate(v, "MM-dd") : "";
    }
  },

  methods: {
    onSelectDayOfWeek(val) {
      if (!val) {
        this.dayOfWeekValues = [];
      }
      this.resetDays();
    },

    onSelectDayOfMonth(val) {
      if (!val) {
        this.dayOfMonthValues = [];
      }
      this.resetDays();
    },

    onDayOfMonthChange() {
      this.resetDays();
    },

    onSelectDateOfYear(val) {
      if (!val) {
        this.dateOfYearValues = [];
      }
      this.resetDays();
    },

    /** 重置会员日 */
    resetDays() {
      console.log(this.condition.days);
      var days = [];

      this.dayOfWeekValues.forEach(function(item) {
        days.push({ unit: "DAY_OF_WEEK", value: item });
      });
      this.dayOfMonthValues.forEach(function(item) {
        days.push({ unit: "DAY_OF_MONTH", value: item });
      });
      this.dateOfYearValues.forEach(function(item) {
        days.push({
          unit: "DATE_OF_YEAR",
          value: DateUtil.formatDate(item, "yyyy-MM-dd")
        });
      });

      this.condition.days = days;
      console.log(this.condition.days);
    }
  },

  created() {
    console.log(this.condition);

    this.dayOfWeekValues = this.condition.days
      .filter(item => item.unit === "DAY_OF_WEEK")
      .map(item => item.value);
    this.dayOfWeek = this.dayOfWeekValues.length > 0;

    this.dayOfMonthValues = this.condition.days
      .filter(item => item.unit === "DAY_OF_MONTH")
      .map(item => item.value);
    this.dayOfMonth = this.dayOfMonthValues.length > 0;

    this.dateOfYearValues = this.condition.days
      .filter(item => item.unit === "DATE_OF_YEAR")
      .map(item => DateUtil.parseDate(item.value, "yyyy-MM-dd"));
    this.dateOfYear = this.dateOfYearValues.length > 0;
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.label {
  width: 100px;
}
.vblock + .vblock:before {
  content: ",";
  margin-right: 10px;
}
</style>

