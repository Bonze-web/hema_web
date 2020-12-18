<!--
  下拉选择框，数据可从服务器取得， 支持自定义数据显示方式.
  示例: 
  <selector-box item-key="uuid" item-label="name" :readonly="readonly" :init-data="initData"        placeholder="请输入商品名称搜索" :on-search="reload" @onselected="onSelected">
    <el-row slot-scope="scope">
      <el-col style="width: 40px;margin-right:10px;">
        <img :src="scope.item.image" style="width: 40px; height: 38px;">
      </el-col>
      <el-col :span="18" style="white-space: normal" :title="scope.item.name">
        {{ scope.item.name }}
      </el-col>
    </el-row>
  </selector-box>
-->
<template>
  <el-select :name="name" v-model="selected" filterable remote default-first-option clearable :placeholder="placeholder" :remote-method="doSearch" :loading="loading" :disabled="readonly" size="small" @change="onSelectGoods" @clear="onClear" :class="'selector-box ' + className" :popper-class="'selector-box-popper ' + popperClass">
    <el-option v-for="(item,index) in pageData.records" :key="index" :label="item[itemLabel]" :value="item[itemKey]" class="select-item">
      <slot :item="item"></slot>
    </el-option>
    <page-bar :page-data="pageData" layout="prev,next" @onreload="reload" style="margin:0;" v-if="showPage"></page-bar>
  </el-select>
</template>

<script>
import PageBar from "@/components/pagebar";
import request from "@/utils/request";

export default {
  components: {
    "page-bar": PageBar
  },

  props: {
    /**
     * select input 的 name 属性
     */
    name: {
      type: String,
      default: ""
    },
    /**
     * 值字段名称
     */
    itemKey: {
      type: String,
      default: "id"
    },
    /**
     * 用来显示的字段名称
     */
    itemLabel: {
      type: String,
      default: "name"
    },
    /**
     * 是否只读
     */
    readonly: {
      type: Boolean,
      default: false
    },
    /**
     * 是否显示分页组件
     */
    showPage: {
      type: Boolean,
      default: true
    },
    /**
     * 选择框的输入提示
     */
    placeholder: {
      type: String,
      default: "请输入关键字搜索"
    },
    /**
     * 样式类名
     */
    className: {
      type: String,
      default: ""
    },
    /**
     * 下拉框样式类名
     */
    popperClass: {
      type: String,
      default: ""
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
    /**
     * 执行搜索时被调用，参数为用户输入的关键字和回调
     *
     * @param searchKey 用户输入的key
     * @param page 第几页，起始于1
     * @param pageSize 每页几条记录
     * @return 远程调用的promise
     */
    onSearch: {
      type: Function,
      required: true,
      default: null
    }
  },

  data() {
    return {
      selected: null,
      loading: false,
      keywords: "",
      pageData: {
        page: 1,
        pageSize: 10,
        pageCount: 0,
        recordCount: 0,
        records: []
      }
    };
  },

  methods: {
    /** 执行搜索
     *
     * @param queryString 关键字
     */
    doSearch(queryString) {
      this.keywords = queryString;
      this.reload();
    },

    /**
     * 加载促销单列表
     */
    reload(page = 1, pageSize = 10) {
      var self = this;
      this.loading = true;
      request.hideLoadingOnce();
      this.onSearch(this.keywords, page, pageSize)
        .then(data => {
          self.loading = false;
          self.pageData = data;
        })
        .catch(err => {
          self.loading = false;
          console.log(err);
        });
    },

    onSelectGoods() {
      const selectedObj = this.getSelectedObj();
      this.$emit("onselected", selectedObj, this.pageData.records);
    },

    onClear() {
      this.doSearch();
    },

    getSelectedObj() {
      return this.pageData.records.find(
        item => item[this.itemKey] === this.selected
      );
    }
  },

  created() {
    if (this.initData && this.initData[this.itemKey]) {
      this.pageData.records.push(this.initData);
      this.selected = this.initData[this.itemKey];
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.selector-box {
  max-width: 300px;
  width: 100%;
}

.selector-box-popper {
  .select-item {
    margin-bottom: 10px;
  }
}
</style>
