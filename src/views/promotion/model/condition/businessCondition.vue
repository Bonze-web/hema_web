<!-- 促销业态条件 -->
<template>
  <div class="condition business-condition" :class="{readonly: readonly}">
    <div class="desc">
      <span v-for="biz in condition.business" :key="biz.name">{{biz.name}}</span>
      <span v-if="!condition.business || condition.business.length === 0">&lt;空&gt;</span>
    </div>
    <el-tree lazy show-checkbox ref="tree" :data="treeData" node-key="uuid" :check-strictly="true" :default-checked-keys="defaultKeys" :props="defaultProps" @check-change="onCheckChange" :load="loadSubBusiness" v-if="!readonly">
    </el-tree>
    <p class="tip" v-if="!readonly">(表示促销的业态范围，如果勾选上级业态，则表示所有下级业态都参与促销)</p>
  </div>
</template>

<script>
import PromBaseObj from "../common/base.js";

const BIZ_CONDITION_ALL = {
  uuid: "ALL",
  code: "",
  name: "全部",
  children: []
};

export default {
  extends: PromBaseObj,
  ame: "business-condition",

  props: {
    condition: {
      type: Object,
      default: function() {
        return {
          business: []
        };
      }
    },
    readonly: {
      type: Boolean,
      default: false
    }
  },

  data: function() {
    var self = this;
    return {
      treeData: [],
      defaultProps: {
        children: "children",
        label: "name",
        disabled: function() {
          return self.readonly;
        }
      }
    };
  },

  computed: {
    defaultKeys: function() {
      if (!this.condition.business) {
        return [];
      } else {
        return this.condition.business.map(function(item) {
          return item.uuid;
        });
      }
    }
  },

  methods: {
    /**
     * 加载子树
     */
    loadSubBusiness(node, resolve) {
      var self = this;
      if (node.level === 0) {
        return resolve([BIZ_CONDITION_ALL]);
      }

      var url = "promotionBillController/getBusiness.do?pid=" + node.data.uuid;
      this.get(url)
        .then(data => {
          // tree有个bug: 加载完成后，如果上级节点被选择，则所有下级节点都会被选择
          try {
            return resolve(data);
          } finally {
            self.setSelectedData();
          }
        })
        .catch(err => {
          self.showError(err);
          return resolve([]);
        });
    },

    setSelectedData() {
      this.$refs.tree && this.$refs.tree.setCheckedKeys(this.defaultKeys);
    },

    /**
     * 选择发生变化事件
     */
    onCheckChange(nd, checked) {
      var business = this.condition.business;
      if (checked) {
        if (!this.hasStore(nd.uuid)) {
          business.push({ uuid: nd.uuid, code: nd.code, name: nd.name });
          if (nd.uuid !== BIZ_CONDITION_ALL.uuid) {
            this.removeById(BIZ_CONDITION_ALL.uuid);
          }
        }
      } else {
        this.removeById(nd.uuid);
      }
    },

    hasStore(uuid) {
      var biz = this.condition.business;
      for (var i = 0; i < biz.length; ++i) {
        if (biz[i].uuid === uuid) {
          return true;
        }
      }
      return false;
    },

    /**
     * 删除根节点
     */
    removeById(uuid) {
      var biz = this.condition.business;
      for (var i = 0; i < biz.length; ++i) {
        if (biz[i].uuid === uuid) {
          biz.splice(i, 1);
          break;
        }
      }
    }
  },

  updated() {
    this.setSelectedData();
  }
};
</script>
