<!-- 外部送券促销结果 -->
<template>
  <div class="action excoupon-action">
    <el-select v-model="selected" placeholder="请选择外部券活动" @change="onSelected" :disabled="readonly">
      <el-option v-for="item in pageData.records" :key="item.uuid" :label="item.name" :value="item.uuid"></el-option>
      <page-bar :page-data="pageData" layout="prev,next" @onreload="reload" style="margin:0;"></page-bar>
    </el-select>
    <el-input-number v-model="action.count" :min="1" :disabled="readonly" size="small" controls-position="right"></el-input-number>
    <label>张</label>
    <p class="tip">(赠送 {{action.count}}张外部券 {{display}})</p>
  </div>
</template>

<script>
import PromBaseObj from "../common/base.js";
import PromService from "../../service/service";
import PageBar from "@/components/pagebar";
// import request from "@/utils/request";

export default {
  extends: PromBaseObj,

  components: {
    PageBar
  },

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
      selected: null,
      activities: [],
      pageData: {
        page: 1,
        pageSize: 10,
        pageCount: 1,
        recordCount: 0,
        records: []
      }
    };
  },

  computed: {
    display: function() {
      var activity = this.action.activity;
      if (!activity || !activity.uuid) {
        return "";
      } else {
        return activity.name;
      }
    }
  },

  methods: {
    onSelected(uuid) {
      console.log(uuid);
      this.selected = uuid;
      var activity = this.pageData.records.find(item => {
        return item.uuid === uuid;
      });
      this.action.activity = activity || {
        uuid: "",
        code: "",
        name: "",
        source: "DLY"
      };
    },
    onSearch(page = 1, pageSize = 10) {
      var self = this;
      PromService.queryExcouponActivity(page, pageSize)
        .then(data => {
          self.pageData = data;
          if (
            data.records &&
            data.records.length > 0 &&
            data.records[0].source &&
            data.records[0].source === "DLY"
          ) {
            // 鼎力云券不分页
            self.pageData.recordCount = pageSize;
          } else {
            self.pageData.recordCount = data.pageCount * pageSize;
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    reload(page, pageSize) {
      if (page <= this.pageData.pageCount) {
        // ++page;
        this.onSearch(page, pageSize);
      }
    }
  },

  created() {
    this.selected = this.action.activity.uuid || "";
    this.onSearch();
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
</style>
