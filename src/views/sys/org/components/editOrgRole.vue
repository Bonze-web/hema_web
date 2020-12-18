<!--编辑组织角色 -->
<template>
  <el-dialog title="编辑组织角色" :visible.sync="dlgRolesVisible">
    <div v-if="orgRoles.length > 0">
      <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
      <el-checkbox-group v-model="userRoles" @change="handleCheckedChange">
        <el-checkbox v-for="role in orgRoles" :key="role.id" :label="role.id">{{role.name}}</el-checkbox>
      </el-checkbox-group>
    </div>
    <router-link :to="{name: 'RoleAdd'}">
      <el-button type="text">创建新的角色？</el-button>
    </router-link>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dlgRolesVisible = false">取 消</el-button>
      <el-button type="primary" @click="onOk">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import RoleService from "@/api/service/RoleService";
import OrgService from "@/api/service/OrgService";
import { mapGetters } from "vuex";
import * as Utils from "@/utils/index";

export default {
  name: "edit-org-role",

  data() {
    return {
      dlgRolesVisible: false,
      orgRoles: [],
      user: {},
      checkAll: false,
      isIndeterminate: false
    };
  },

  computed: {
    ...mapGetters({ loginUser: "user" })
  },

  methods: {
    handleCheckAllChange(val) {
      this.userRoles = val
        ? this.orgRoles.map(function(item) {
            return item.id;
          })
        : [];
      this.isIndeterminate = false;
    },

    handleCheckedChange(value) {
      const checkedCount = value.length;
      this.checkAll = checkedCount === this.orgRoles.length;
      this.isIndeterminate =
        checkedCount > 0 && checkedCount < this.orgRoles.length;
    },

    show(user) {
      if (!user || !user.id || !user.orgId) {
        console.error("组织不能为空");
        return;
      }

      if (!this.user || user.orgId !== this.user.orgId) {
        // 如果所属组织发生了变化，则重新加载组织角色列表
        this.reloadOrgRoles(user.orgId);
      }
      this.getOrgRoles(user.id);
      this.user = user;
      this.dlgRolesVisible = true;
    },

    /** 保存组织角色 */
    onOk() {
      var self = this;
      OrgService.updateRoles(this.user.id, this.userRoles)
        .then(() => {
          self.dlgRolesVisible = false;
        })
        .catch(err => {
          Utils.showError(err);
        });
    },

    /** 重新加载组织的所有角色 */
    reloadOrgRoles(orgId) {
      var self = this;

      console.log(self.loginUser);
      RoleService.query(1, 0, {
        searchCount: true,
        // 取指定人员的所属组织和当前登录组织的所属组织
        orgIdIn: [orgId, self.loginUser.workingOrgId]
      })
        .then(data => {
          self.orgRoles = data.records;
        })
        .catch(err => {
          Utils.showError(err);
        });
    },

    /** 取得组织的角色列表 */
    getOrgRoles(orgId) {
      var self = this;
      this.orgRoles = [];
      this.isIndeterminate = false;
      this.checkAll = [];

      OrgService.getRoles(orgId)
        .then(data => {
          self.orgRoles = data.map(function(item) {
            return item.id;
          });
        })
        .catch(err => {
          Utils.showError(err);
        });
    }
  }
};
</script>

