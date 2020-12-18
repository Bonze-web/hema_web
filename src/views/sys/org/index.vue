<template>
  <base-list>
    <div slot="header">
      <el-form ref="qryForm" :model="qryForm" label-width="100px" class="qry-form">
        <el-form-item label="名称" prop="nameLike">
          <el-input v-model="qryForm.nameLike" placeholder="请输入组织代码或名称，支持模糊匹配"></el-input>
        </el-form-item>
        <el-form-item label="状态" prop="disabled">
          <el-select v-model="qryForm.disabled" placeholder="请选择状态" clearable>
            <el-option label="已激活" value="false"></el-option>
            <el-option label="已禁用" value="true"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="组织类型" prop="orgTypesIn" v-if="workingOrg.type === 'GROUP'">
          <el-checkbox-group v-model="qryForm.orgTypesIn" style="width:600px;">
            <el-checkbox v-for="item in Object.keys(ORG_TYPE_NAMES)" :key="item" :label="item">{{ORG_TYPE_NAMES[item]}}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="上级组织：" v-if="workingOrg.type === 'GROUP'">
          <org-select :orgValue.sync="qryForm.upperOrgIdEquals" :includeLowerOrg="true"></org-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="onQuery">搜索</el-button>
          <el-button @click="resetForm('qryForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </div>

    <div slot="body">
      <el-row>
        <router-link to="/sys/org/add" v-if="hasPermission(PermIds.SYS_ORG_CREATE)">
          <el-button type="primary" icon="el-icon-plus">新增</el-button>
        </router-link>
      </el-row>

      <!--编辑组织角色对话框 -->
      <edit-org-role ref="dlgEditRole"></edit-org-role>

      <el-table :data="pageData.records" style="width: 100%" v-loading="listLoading">
        <!--checkbox 适当加宽，否则IE下面有省略号 https://github.com/ElemeFE/element/issues/1563-->
        <el-table-column prop="id" type="index" width="50"></el-table-column>
        <el-table-column prop="code" label="代码"></el-table-column>
        <el-table-column prop="name" label="名称"></el-table-column>
        <el-table-column label="状态" width="80">
          <template slot-scope="scope">{{ scope.row | formatState }}</template>
        </el-table-column>
        <el-table-column label="组织类型">
          <template slot-scope="scope">{{ scope.row | formatType }}</template>
        </el-table-column>
        <el-table-column prop="address" label="地址"></el-table-column>
        <el-table-column label="操作" width="100">
          <template slot-scope="scope">
            <el-button size="small" type="text" @click="handleEdit(scope.$index, scope.row)" v-if="scope.row.type !== 'STORE' && hasPermission(PermIds.SYS_ORG_UPDATE)">编辑</el-button>
            <el-button size="small" type="text" @click="handleEdit(scope.$index, scope.row)" v-else-if="scope.row.type === 'STORE' && hasPermission(PermIds.MALL_STORE_VIEW) && hasPermission(PermIds.MALL_STORE_UPDATE)">编辑</el-button>
            <!-- <el-button size="small" type="text" @click="handleRoleConfig(scope.$index, scope.row)" v-if="hasPermission(PermIds.SYS_USER_UPDATE)">编辑角色</el-button> -->
            <el-button size="small" type="text" @click="handleDisable(scope.$index, scope.row)" v-if="!scope.row.disabled && hasPermission(PermIds.SYS_ORG_DISABLE)">禁用</el-button>
            <el-button size="small" type="text" @click="handleEnable(scope.$index, scope.row)" v-if="scope.row.disabled && hasPermission(PermIds.SYS_ORG_ENABLE)">启用</el-button>
          </template>
        </el-table-column>
      </el-table>
      <page-bar :page-data="pageData" @onreload="reload"></page-bar>
    </div>
  </base-list>
</template>

<script>
import BaseList from "@/components/bill/baseList.vue";
import pageBar from "@/components/pagebar.vue";
import OrgService from "@/api/service/OrgService";
import OrgSelect from "@/components/orgSelect.vue";
import PermIds from "@/api/permissionIds";
import EditOrgRole from "./components/editOrgRole";
import * as Utils from "@/utils/index";
import { mapGetters } from "vuex";

const ORG_TYPE_NAMES = {
  GROUP: "总公司",
  COMPANY: "分公司",
  STORE: "门店",
  DEPART: "部门",
  VENDOR: "供应商"
};

export default {
  components: {
    "page-bar": pageBar,
    "base-list": BaseList,
    "org-select": OrgSelect,
    "edit-org-role": EditOrgRole
  },

  data() {
    return {
      listLoading: false,

      qryForm: {
        nameLike: "",
        orgTypesIn: [],
        disabled: "false",
        upperOrgIdEquals: "",
        includeLowerOrg: true
      },

      pageData: {
        page: 1,
        pageSize: 10,
        pageCount: 1,
        recordCount: 5,
        records: []
      },

      ORG_TYPE_NAMES: ORG_TYPE_NAMES,

      PermIds: PermIds
    };
  },

  computed: {
    ...mapGetters(["hasPermission", "workingOrg"])
  },

  filters: {
    /**
     * 格式化组织类型
     */
    formatType(org) {
      return ORG_TYPE_NAMES[org.type];
    },

    /**
     * 格式化组织状态
     */
    formatState(org) {
      return org.disabled ? "已禁用" : "已激活";
    }
  },

  methods: {
    onQuery() {
      this.reload();
    },

    /**
     * 重置搜索框
     */
    resetForm(formName) {
      this.$refs[formName].resetFields();
      this.onQuery();
    },

    handleRoleConfig(index, row) {
      this.$refs.dlgEditRole.show(row);
    },

    /** 编辑用户 */
    handleEdit(index, row) {
      // 如果组织类型是门店跳转到门店信息页面维护
      if (row.type === "STORE") {
        this.$router.push({
          name: "StoreInfo",
          query: {
            id: row.id
          }
        });
      } else {
        this.$router.push({ name: "OrgAdd", query: { id: row.id } });
      }
    },

    /** 禁用用户 */
    handleDisable(index, row) {
      var self = this;
      this.$confirm("是否确认禁用组织?", "提示", {
        type: "warning"
      })
        .then(() => {
          OrgService.disable(row.id)
            .then(() => {
              self.$message({
                message: "操作成功！",
                type: "success"
              });
              self.reload();
            })
            .catch(err => {
              Utils.showError(err);
            });
        })
        .catch(err => {
          if (err !== "cancel") {
            Utils.showError(err);
          }
        });
    },

    /** 启用组织 */
    handleEnable(index, row) {
      var self = this;
      this.$confirm("是否确认启用组织?", "提示", {
        type: "warning"
      })
        .then(() => {
          OrgService.enable(row.id)
            .then(() => {
              self.$message({
                message: "操作成功！",
                type: "success"
              });
              self.reload();
            })
            .catch(err => {
              Utils.showError(err);
            });
        })
        .catch(err => {
          if (err !== "cancel") {
            Utils.showError(err);
          }
        });
    },

    /**
     * 加载数据
     *
     * @param page 当前页码，默认为1
     * @param pageSize 每页记录数，默认为10
     */
    reload(page = 1, pageSize = 10) {
      if (this.workingOrg.type !== "GROUP") {
        this.qryForm.upperOrgIdEquals = this.workingOrg.id;
      }
      OrgService.query(page, pageSize, this.qryForm)
        .then(data => {
          console.log(data);
          this.pageData = data;
        })
        .catch(error => {
          this.$message.error(error.message);
        });
    }
  },

  created() {
    this.reload();
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.el-pagination {
  float: right;
  margin-top: 15px;
}
.qry-form {
  max-width: 500px;
}
</style>
