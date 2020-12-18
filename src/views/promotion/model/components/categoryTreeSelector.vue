<template>
  <div>
    <el-treeselect v-model="name" placeholder="请选择菜单名称" :data="treeData" :props="defaultProps" :isEdit="false" :search="false" :clickParent="true" @nodeClick="nodeClick" @clearFun="clearSelect" :disabled="readonly"></el-treeselect>
  </div>
</template>

<script>
import elTreeselect from "el-tree-select";
import PromService from "../../service/service";

export default {
  components: {
    elTreeselect
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
      treeData: [],
      name: "",
      defaultProps: {
        children: "children",
        label: "name",
        value: "uuid"
      }
    };
  },

  methods: {
    nodeClick(data, node, tree) {
      this.$emit("onselected", data);
    },

    clearSelect() {
      this.$emit("onselected", null);
    }
  },

  created() {
    var self = this;

    if (this.initData) {
      this.name = this.initData.name;
    }

    return PromService.getCategoryTree()
      .then(data => {
        self.treeData = data;
      })
      .catch(err => {
        self.loading = false;
        console.log(err);
      });
  }
};
</script>

<style rel="stylesheet/scss" lang="scss">
</style>
