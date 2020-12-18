<template>
  <base-list>
    <div slot="header">
      <el-form ref="qryForm" :model="qryForm" label-width="80px">
        <el-form-item label="角色名称" prop="nameLike">
          <el-input v-model="qryForm.nameLike" placeholder="角色名称，支持模糊匹配" style="width:200px"></el-input>
        </el-form-item>
        <el-form-item label="所属组织" prop="upperOrgIdEquals">
          <org-select style="width:200px" :orgValue.sync="qryForm.upperOrgIdEquals" :includeLowerOrg="true"></org-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="onQuery">搜索</el-button>
          <el-button @click="resetForm('qryForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </div>

    <div slot="body">
      <el-row v-if="hasPermission(PermIds.SYS_ROLE_CREATE)">
        <router-link to="/sys/role/add">
          <el-button type="primary" icon="el-icon-plus">新增</el-button>
        </router-link>
      </el-row>

      <el-table :data="pageData.records" style="width: 100%" v-loading="listLoading" @selection-change="handleSelectionChange">
        <!--checkbox 适当加宽，否则IE下面有省略号 https://github.com/ElemeFE/element/issues/1563-->
        <el-table-column prop="id" type="index" width="50">
        </el-table-column>
        <el-table-column prop="name" label="名称">
        </el-table-column>
        <el-table-column prop="orgName" label="所属组织">
        </el-table-column>
        <el-table-column prop="remark" label="备注">
        </el-table-column>
        <el-table-column label="操作" width="300" align="center" header-align="center">
          <template slot-scope="scope">
            <el-button size="small" type="text" @click="handleEdit(scope.$index, scope.row)" v-if="hasPermission(PermIds.SYS_ROLE_UPDATE)">编辑
            </el-button>
            <el-button size="small" type="text" @click="handleDelete(scope.$index, scope.row)" v-if="hasPermission(PermIds.SYS_ROLE_REMOVE)">删除
            </el-button>
            <el-button size="small" type="text" @click="handleAuthorManage(scope.$index, scope.row)" v-if="hasPermission(PermIds.SYS_ROLE_EDIT_PERMISSION)">权限管理
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <page-bar :page-data="pageData" @onreload="reload">
      </page-bar>
    </div>
  </base-list>
</template>

<script>
import BaseList from "@/components/bill/baseList.vue";
import pageBar from "@/components/pagebar.vue";
import RoleService from "@/api/service/RoleService";
import OrgSelect from "@/components/orgSelect";
import PermIds from "@/api/permissionIds";
import { mapGetters } from "vuex";

export default {
  components: {
    "page-bar": pageBar,
    "base-list": BaseList,
    OrgSelect
  },

  data() {
    return {
      currentRow: {},
      qryForm: {
        orderField: "update_time",
        orderDirection: "desc",
        nameLike: "",
        upperOrgIdEquals: ""
      },
      listLoading: false,

      pageData: {
        page: 1,
        pageSize: 10,
        pageCount: 1,
        recordCount: 5,
        records: []
      },

      PermIds: PermIds
    };
  },

  computed: {
    ...mapGetters(["hasPermission", "user"])
  },

  methods: {
    message(type, msg) {
      this.$message({
        type: type,
        message: msg
      });
    },
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

    handleSelectionChange(val) {},

    handleEdit(index, row) {
      this.$router.push({
        name: "RoleAdd",
        query: {
          roleInfo: JSON.stringify(row)
        }
      });
    },

    handleDelete(index, row) {
      this.$confirm("此操作将会删除该角色, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          RoleService.remove(row.id)
            .then(res => {
              console.log(res);
              this.reload();
              this.message("success", "删除成功!");
            })
            .catch(err => {
              console.log(err);
              this.$message.error(err.message);
            });
        })
        .catch(() => {
          this.message("info", "已取消删除");
        });
    },

    handleAuthorManage(index, row) {
      console.log(row);
      this.$router.push({
        name: "AuthorManage",
        query: {
          roleId: row.id,
          roleName: row.name,
          orgName: row.orgName
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
      RoleService.query(page, pageSize, this.qryForm)
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
</style>
