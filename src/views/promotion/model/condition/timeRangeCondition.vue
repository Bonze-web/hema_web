<!-- 促销时间范围条件 -->

<template>
  <div class="condition time-range-condition">
    <el-date-picker v-model="timeRange" type="datetimerange" :picker-options="pickerOptions" :disabled="readonly" format="yyyy-MM-dd HH:mm:ss" :default-time="['00:00:00', '23:59:59']" placeholder="选择时间范围">
    </el-date-picker>
  </div>
</template>

<script>
import PromBaseObj from "../common/base.js";
import * as DateUtil from "@/utils/dateUtil.js";

export default {
  extends: PromBaseObj,
  name: "time-range-condition",

  props: {
    condition: {
      type: Object,
      default: function() {
        return { begin: null, end: null };
      }
    },
    readonly: {
      type: Boolean,
      default: false
    }
  },

  data: function() {
    return {
      pickerOptions: {
        shortcuts: [
          {
            text: "一周",
            onClick(picker) {
              const start = new Date();
              start.setHours(0);
              start.setMinutes(0);
              start.setSeconds(0);
              start.setMilliseconds(0);
              const end = new Date();
              end.setTime(start.getTime() + 3600 * 1000 * 24 * 8 - 1);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "一个月",
            onClick(picker) {
              const start = new Date();
              start.setHours(0);
              start.setMinutes(0);
              start.setSeconds(0);
              start.setMilliseconds(0);
              const end = new Date();
              end.setTime(start.getTime() + 3600 * 1000 * 24 * 31 - 1);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "三个月",
            onClick(picker) {
              const start = new Date();
              start.setHours(0);
              start.setMinutes(0);
              start.setSeconds(0);
              start.setMilliseconds(0);
              const end = new Date();
              end.setTime(start.getTime() + 3600 * 1000 * 24 * 91 - 1);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "一年",
            onClick(picker) {
              const start = new Date();
              start.setHours(0);
              start.setMinutes(0);
              start.setSeconds(0);
              start.setMilliseconds(0);
              const end = new Date();
              end.setTime(start.getTime() + 3600 * 1000 * 24 * 366 - 1);
              picker.$emit("pick", [start, end]);
            }
          }
        ]
      }
    };
  },

  computed: {
    timeRange: {
      get() {
        return [this.condition.begin, this.condition.end];
      },

      set(v) {
        this.condition.begin = v ? DateUtil.formatDate(v[0]) : null;
        this.condition.end = v ? DateUtil.formatDate(v[1]) : null;
      }
    }
  },

  methods: {}
};
</script>
