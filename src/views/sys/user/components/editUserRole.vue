<!--编辑用户角色 -->
<template>
  <el-dialog title="编辑用户角色" :visible.sync="dlgRolesVisible">
    角色来源：
    <ul>
      <li>
        <span>用户上级组织盒马的角色</span>
        <div v-if="userRolesSet.length === 0">&lt;空&gt;</div>
        <div>
          <span v-for="role in userRolesSet" :key="role.id" style="margin-right: 20px;">{{role.name}}</span>
        </div>
      </li>

      <li>
        <span>用户所属组织的角色</span>
        <div v-if="orgRoles.length === 0">&lt;空&gt;</div>
        <div v-for="ele in orgRoles" :key="ele.orgId">
          <span style="margin: 4px 0;display: inline-block;">{{ele.orgName}}</span>
          <el-checkbox-group v-model="userRoles" @change="handleCheckedChange">
            <el-checkbox v-for="role in ele.lists" :key="role.id" :label="role.id">{{role.name}}</el-checkbox>
          </el-checkbox-group>
        </div>
      </li>

      <li>
        <span>你还可以授予你自己拥有的角色</span>
        <div v-if="curUserRoles.length === 0">&lt;空&gt;</div>
        <div v-for="ele in curUserRoles" :key="ele.orgId">
          <span style="margin: 4px 0;display: inline-block;">{{ele.orgName}}</span>
          <el-checkbox-group v-model="userRoles" @change="handleCheckedChange">
            <el-checkbox v-for="role in ele.lists" :key="role.id" :label="role.id">{{role.name}}</el-checkbox>
          </el-checkbox-group>
        </div>
      </li>

      <li v-if="hasPermission(PermIds.SYS_ROLE_CREATE)">
        <router-link :to="{name: 'RoleAdd'}">
          <el-button type="text">或者创建新的角色？</el-button>
        </router-link>
      </li>
    </ul>

    <div slot="footer" class="dialog-footer">
      <el-button @click="dlgRolesVisible = false">取 消</el-button>
      <el-button type="primary" @click="onOk">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import RoleService from "@/api/service/RoleService";
import UserService from "@/api/service/UserService";
import { mapGetters } from "vuex";
import PermIds from "@/api/permissionIds";
import * as Utils from "@/utils/index";

export default {
  name: "edit-user-role",

  data() {
    return {
      dlgRolesVisible: false,
      userRolesSet: [], // 用户已经有的角色列表
      userRoles: [], // 用户当前拥有的角色列表，只有ID
      orgRoles: [], // 用户所属组织的角色列表
      curUserRoles: [], // 当前授权人的角色列表
      user: {}, // 被授权的用户
      checkAll: false,
      isIndeterminate: false,
      PermIds: PermIds,
      userOrgs: []
    };
  },

  computed: {
    ...mapGetters({ loginUser: "user", hasPermission: "hasPermission" }),

    /**
     * 上级组织角色
     */
    upperOrgRoles: function() {
      if (!this.userRoles) {
        return [];
      } else {
        var roles = this.userRoles.filter(r => {
          return r.orgId !== this.user.orgId;
        });
        console.log(roles);
        return roles;
      }
    }
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
      var self = this;
      if (!user || !user.id || !user.orgId) {
        console.error("用户不能为空");
        return;
      }

      if (
        !this.user ||
        user.orgId !== this.user.orgId ||
        user.id !== this.user.id
      ) {
        // 如果所属组织发生了变化，则重新加载组织角色列表
        // this.reloadOrgRoles(user.orgId);
        Promise.all([self.reloadUserOrgs(user.username)])
          .then(() => {
            self.user = user;
            return self.getUserRoles(user.id);
          })
          .catch(err => {
            Utils.showError(err);
          });
      }
      // this.getUserRoles(user.id);
      this.dlgRolesVisible = true;
    },

    /** 保存用户角色 */
    onOk() {
      var self = this;
      var roles = [];
      for (let i = 0; i < this.orgRoles.length; i++) {
        const item = this.orgRoles[i];
        var roleIds = [];
        for (let j = 0; j < item.lists.length; j++) {
          const ele = item.lists[j];
          for (let k = 0; k < this.userRoles.length; k++) {
            const it = this.userRoles[k];
            if (ele.id === it) {
              roleIds.push(it);
              break;
            }
          }
        }
        if (roleIds.length > 0) {
          roles.push({
            roleIds: roleIds,
            workingOrgId: item.orgId
          });
        }
      }

      UserService.updateRoles(this.user.id, roles)
        .then(() => {
          self.dlgRolesVisible = false;
        })
        .catch(err => {
          Utils.showError(err);
        });
    },
    /* 获取用户所有的所属组织 */
    reloadUserOrgs(username) {
      var self = this;
      return UserService.getUserOrgs(username)
        .then(res => {
          self.userOrgs = res;
          self.reloadCurUserRoles();
        })
        .then(res => {
          self.reloadOrgRoles();
        });
    },
    /** 重新加载组织的所有角色 */
    reloadOrgRoles() {
      var self = this;
      var orgIdIn = [];
      if (self.userOrgs.length > 0) {
        orgIdIn = [];
        self.userOrgs.forEach(ele => {
          orgIdIn.push(ele.id);
        });
      }
      return RoleService.query(1, 0, {
        searchCount: true,
        orgIdIn: orgIdIn
      }).then(data => {
        var orgRoles = [];
        for (let i = 0; i < data.records.length; i++) {
          const ele = data.records[i];
          var isHas = false;
          var index = 0;
          for (let j = 0; j < orgRoles.length; j++) {
            const item = orgRoles[j];
            if (ele.orgId === item.orgId) {
              isHas = true;
              index = j;
              break;
            }
          }
          if (isHas) {
            orgRoles[index].lists.push(ele);
          } else {
            orgRoles.push({
              orgId: ele.orgId,
              orgName: ele.orgName,
              lists: [ele]
            });
          }
        }
        self.orgRoles = orgRoles;
      });
    },

    /** 重新加载当前登录人拥有的所有角色  */
    reloadCurUserRoles() {
      var self = this;
      var workingOrgIds = [];
      if (self.userOrgs.length > 0) {
        self.userOrgs.forEach(ele => {
          workingOrgIds.push(ele.id);
        });
      }
      return UserService.getRoles(this.loginUser.id, workingOrgIds).then(
        data => {
          var tempCurUserRoles = [];
          for (let i = 0; i < data.length; i++) {
            const ele = data[i];
            var isHas = false;
            var index = 0;
            for (let j = 0; j < tempCurUserRoles.length; j++) {
              const item = tempCurUserRoles[j];
              if (ele.orgId === item.orgId) {
                isHas = true;
                index = j;
                break;
              }
            }
            if (isHas) {
              tempCurUserRoles[index].lists.push(ele);
            } else {
              tempCurUserRoles.push({
                orgId: ele.orgId,
                orgName: ele.orgName,
                lists: [ele]
              });
            }
          }
          self.curUserRoles = tempCurUserRoles;
        }
      );
    },

    /** 取得用户的角色列表 */
    getUserRoles(userId) {
      var self = this;
      this.userRoles = [];
      this.isIndeterminate = false;
      this.checkAll = [];
      var workingOrgIds = [];
      if (self.userOrgs.length > 0) {
        self.userOrgs.forEach(ele => {
          workingOrgIds.push(ele.id);
        });
      }
      return UserService.getRoles(userId, workingOrgIds).then(data => {
        self.userRolesSet = data;
        self.userRoles = data.map(function(item) {
          return item.id;
        });
      });
    }
  }
};
</script>

