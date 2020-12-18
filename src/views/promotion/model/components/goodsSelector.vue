<!-- 商品筛选器 -->
<template>
  <selector-box item-key="uuid" item-label="name" :readonly="readonly" :init-data="initData" placeholder="请输入商品名称搜索" :on-search="reload" @onselected="onSelected">
    <el-row slot-scope="scope">
      <el-col style="width: 40px;margin-right:10px;" v-if="scope.item.image">
        <img :src="scope.item.image" style="width: 40px; height: 38px;">
      </el-col>
      <el-col :span="18" style="white-space: normal" :title="scope.item.name">
        {{ scope.item.name }}
      </el-col>
    </el-row>
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
    },

    /** 商品分类  */
    categoryId: {
      type: String,
      default: function() {
        return "";
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
      var cat = this.categoryId ? this.categoryId : "";
      return PromService.queryGoods(page, pageSize, {
        nameLikes: searchKey,
        categoryIdEquals: cat,
        searchCount: true
      });
    },

    onSelected(goods) {
      if (this.initData) {
        this.initData.uuid = goods ? goods.uuid : "";
        this.initData.code = goods ? goods.code : "";
        this.initData.name = goods ? goods.name : "";
      }
      this.$emit("onselected", goods);
    }
  },

  created() {}
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
</style>
