<!-- 会员等级条件 -->
<template>
  <div class="condition member-grade-condition">
    <el-select v-model="selectedId" :disabled="readonly" placeholder="请选择会员等级" size="small">
      <el-option v-for="item in grades" :key="item.uuid" :label="item.name" :value="item.uuid">
      </el-option>
    </el-select>
    <span class="tip">(当会员等级等于{{condition.grade.name}}时，执行促销结果)</span>
  </div>
</template>

<script>
import PromBaseObj from "../common/base.js";
import PromotionService from "../../service/service";

export default {
  extends: PromBaseObj,
  name: "member-grade-condition",

  props: {
    condition: {
      type: Object,
      default: function() {
        return { grade: { uuid: "" } };
      }
    },
    readonly: {
      type: Boolean,
      default: false
    }
  },

  data: function() {
    return {
      grades: []
    };
  },

  computed: {
    selectedId: {
      get: function() {
        var grade = this.condition.grade;
        return grade ? grade.uuid : "";
      },

      set: function(value) {
        for (var i = 0; i < this.grades.length; ++i) {
          if (this.grades[i].uuid === value) {
            this.condition.grade = this.grades[i];
            return;
          }
        }
        this.condition.grade = [];
      }
    }
  },

  methods: {},

  created() {
    PromotionService.getMemberGrades()
      .then(data => {
        this.grades = data;
      })
      .catch(err => {
        this.showError(err);
      });
  }
};
</script>
