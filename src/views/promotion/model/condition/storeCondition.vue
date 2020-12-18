<!-- 促销门店条件 -->
<template>
  <div class="condition store-condition" :class="{readonly: readonly}">
    <div class="desc">
      <span v-for="store in condition.stores" :key="store.name">{{store.name}}</span>
      <span v-if="!condition.stores || condition.stores.length === 0">&lt;空&gt;</span>
    </div>
    <el-tree lazy show-checkbox check-strictly ref="tree" :data="treeData" node-key="uuid" :default-checked-keys="defaultKeys" :props="defaultProps" @check-change="onCheckChange" :load="loadSubStores" v-if="!readonly">
    </el-tree>
    <span class="tip" v-if="!readonly">(表示促销的门店范围，如果勾选上级组织，则表示所有下级组织都参与促销)</span>
  </div>
</template>

<script>
import PromBaseObj from "../common/base.js";
import PromService from "@/views/promotion/service/service.js";

const STORE_CONDITION_ALL = {
  uuid: "ALL",
  code: "",
  name: "全部",
  children: []
};

export default {
  extends: PromBaseObj,
  name: "store-condition",

  props: {
    condition: {
      type: Object,
      default: function() {
        return {
          stores: []
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
      if (!this.condition.stores) {
        return [STORE_CONDITION_ALL.uuid];
      } else {
        return this.condition.stores.map(function(item) {
          return item.uuid;
        });
      }
    }
  },

  methods: {
    /**
     * 加载子树
     */
    loadSubStores(node, resolve) {
      var self = this;
      if (node.level === 0) {
        return resolve([STORE_CONDITION_ALL]);
      }

      PromService.getStores(node.data.uuid)
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
      var stores = this.condition.stores;
      if (checked) {
        if (!this.hasStore(nd.uuid)) {
          stores.push({ uuid: nd.uuid, code: nd.code, name: nd.name });
          if (nd.uuid !== STORE_CONDITION_ALL.uuid) {
            this.removeById(STORE_CONDITION_ALL.uuid);
          }
        }
      } else {
        this.removeById(nd.uuid);
      }
    },

    hasStore(uuid) {
      var stores = this.condition.stores;
      for (var i = 0; i < stores.length; ++i) {
        if (stores[i].uuid === uuid) {
          return true;
        }
      }
      return false;
    },

    /**
     * 删除根节点
     */
    removeById(uuid) {
      var stores = this.condition.stores;
      for (var i = 0; i < stores.length; ++i) {
        if (stores[i].uuid === uuid) {
          stores.splice(i, 1);
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
