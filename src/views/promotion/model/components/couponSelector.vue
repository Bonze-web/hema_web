<template>
  <selector-box item-key="uuid" item-label="name" :readonly="readonly" :init-data="initData" placeholder="请输入券活动名称搜索" :on-search="reload" @onselected="onSelected">
  </selector-box>
</template>

<script>
import SelectorBox from "@/components/selectorBox";
import PromService from "../../service/service";

export default {
  components: {
    SelectorBox
  },

  props: {
    readonly: {
      type: Boolean,
      default: false
    },
    /**
     * 默认值
     */
    initData: {
      type: Object,
      default: function() {
        return null;
      }
    }
  },

  data() {
    return {
      selected: null
    };
  },

  methods: {
    /**
     * 执行搜索时被调用，参数为用户输入的关键字和回调
     *
     * @param searchKey 用户输入的key
     * @param page 第几页，起始于1
     * @param pageSize 每页几条记录
     * @return 远程调用的promise
     */
    reload(searchKey, page, pageSize, cb) {
      return PromService.queryCouponActivity(page, pageSize, {
        nameLikes: searchKey,
        searchCount: true
      });
    },

    onSelected(activity) {
      this.$emit("onselected", activity);
    }
  },

  created() {}
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>

</style>
