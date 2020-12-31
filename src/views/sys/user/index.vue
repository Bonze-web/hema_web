<template>
  <base-list>
    <div slot="header">
      <el-form ref="qryForm" :model="qryForm" label-width="80px" class="qry-form">
        <el-form-item label="名称" prop="nameLike">
          <el-input v-model="qryForm.nameLike" placeholder="请输入用户昵称或用户名筛选，支持模糊匹配"></el-input>
        </el-form-item>
        <el-form-item label="状态" prop="disabled">
          <el-select v-model="qryForm.disabled" placeholder="请选择状态" clearable>
            <el-option label="已激活" value="false"></el-option>
            <el-option label="已禁用" value="true"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="所属组织" prop="upperOrgIdEquals">
          <org-select :orgValue.sync="qryForm.upperOrgIdEquals" :includeLowerOrg="true"></org-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="onQuery">搜索</el-button>
          <el-button @click="resetForm('qryForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </div>

    <div slot="body">
      <el-row class="navigation-button">
        <router-link to="/sys/user/add" v-if="hasPermission(PermIds.SYS_USER_CREATE)">
          <el-button type="primary" icon="el-icon-plus">新增</el-button>
        </router-link>
        <div class="import-export-button">
          <el-dropdown>
            <el-button class="export" size="small">
              <i class="iconfont icon-batch-import"></i>批量导入
              <i class="el-icon-arrow-down el-icon--right"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item @click.native="handleImportUserPopup" v-if="hasPermission(PermIds.SYS_USER_CREATE)">批量导入/修改</el-dropdown-item>
              <el-dropdown-item @click.native="handleToImportRecord('IMPORT')">查看导入记录</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
          <el-dropdown>
            <el-button class="export" size="small">
              <i class="iconfont icon-batch-export"></i>批量导出
              <i class="el-icon-arrow-down el-icon--right"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item @click.native="exportUser" v-if="hasPermission(PermIds.SYS_USER_EXPORT)">批量导出</el-dropdown-item>
              <el-dropdown-item @click.native="handleToImportRecord('EXPORT')">查看导出记录</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </el-row>

      <!--编辑用户角色对话框 -->
      <edit-user-role ref="dlgEditRole"></edit-user-role>

      <el-table :data="pageData.records" style="width: 100%" v-loading="listLoading" @sort-change="handleSortChange">
        <!--checkbox 适当加宽，否则IE下面有省略号 https://github.com/ElemeFE/element/issues/1563-->
        <el-table-column prop="id" type="index" width="50"></el-table-column>
        <!-- <el-table-column label="头像" width="76">
          <template slot-scope="scope">
            <img :src='scope.row.avatar' style="height: 35px;vertical-align: middle;" alt="">
          </template>
        </el-table-column>-->
        <el-table-column prop="realName" label="昵称" sortable="custom"></el-table-column>
        <el-table-column prop="username" label="用户名" sortable="custom"></el-table-column>
        <el-table-column prop="workNumber" label="工号"></el-table-column>
        <el-table-column prop="orgName" label="所属组织"></el-table-column>
        <el-table-column prop="state" label="状态" width="80" sortable="custom">
          <template slot-scope="scope">{{ scope.row | formatState }}</template>
        </el-table-column>
        <el-table-column label="操作" width="300">
          <template slot-scope="scope">
            <el-button size="small" type="text" @click="handleEdit(scope.$index, scope.row)" v-if="hasPermission(PermIds.SYS_USER_UPDATE)">编辑</el-button>
            <!-- 自已不能禁用或启用自己 -->
            <el-button size="small" type="text" @click="handleRoleConfig(scope.$index, scope.row)" v-if="hasPermission(PermIds.SYS_USER_EDIT_ROLE)" :disabled="user.id === scope.row.id">编辑角色</el-button>
            <el-button size="small" type="text" @click="handleDisable(scope.$index, scope.row)" v-if="!scope.row.disabled && hasPermission(PermIds.SYS_USER_DISABLE)" :disabled="user.id === scope.row.id">禁用</el-button>
            <el-button size="small" type="text" @click="handleEnable(scope.$index, scope.row)" v-if="scope.row.disabled && hasPermission(PermIds.SYS_USER_ENABLE)" :disabled="user.id === scope.row.id">启用</el-button>
          </template>
        </el-table-column>
      </el-table>
      <page-bar :page-data="pageData" @onreload="reload"></page-bar>
      <!-- 导入导出弹窗 -->
      <el-dialog title="导入用户" :visible.sync="importUserDialogVisible" width="35%" center>
        <span>用户批量导入</span>
        <div class="upload-user-box">
          <el-button style="float:left; margin-right: 10px;" type="text" @click="downloadUserImportTemplate">下载用户批量导入模板</el-button>
          <el-upload
            ref="uploadUser"
            style="float:left; "
            class="upload-demo"
            :action="uploadActionUrl"
            :headers="uploadHeaders"
            :on-exceed="handleUploadUserOnExceed"
            :before-upload="beforeExcelUpload"
            :on-remove="handleUploadRemove"
            :on-success="handleUploadUserSuccess"
            :limit="1"
            :auto-upload="false"
          >
            <el-button type="text">选择文件</el-button>
          </el-upload>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="importUserDialogVisible = false">取 消</el-button>
          <el-button style="margin-left: 10px;" size="small" type="primary" @click="handleImportUser">确 定</el-button>
        </span>
      </el-dialog>
    </div>
  </base-list>
</template>

<script>
import BaseList from "@/components/bill/baseList.vue";
import pageBar from "@/components/pagebar.vue";
import UserService from "@/api/service/UserService";
import OptionsService from "@/api/service/OptionsService";
import BatchService from "@/api/service/BatchService";
import EditUserRole from "./components/editUserRole";
import OrgSelect from "@/components/orgSelect";
import PermIds from "@/api/permissionIds";
import * as Utils from "@/utils/index";
import { mapGetters } from "vuex";
import { getToken } from "@/utils/auth";

export default {
  components: {
    "page-bar": pageBar,
    "base-list": BaseList,
    "edit-user-role": EditUserRole,
    OrgSelect
  },

  data() {
    return {
      listLoading: false,

      qryForm: {
        nameLike: "",
        disabled: "false",
        upperOrgIdEquals: "",
        orderField: "",
        orderDirection: ""
      },
      pageData: {
        page: 1,
        pageSize: 10,
        pageCount: 1,
        recordCount: 5,
        records: []
      },

      PermIds: PermIds,
      uploadHeaders: {
        "access-token": getToken()
      },
      importUserDialogVisible: false // 商品导入弹窗
    };
  },

  computed: {
    uploadActionUrl() {
      return process.env.BASE_API + "/sys/user/import";
    },
    ...mapGetters(["hasPermission", "user"])
  },

  filters: {
    /**
     * 格式化用户状态
     */
    formatState(user) {
      return user.disabled ? "已禁用" : "已激活";
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
      this.$router.push({ name: "UserEdit", query: { id: row.id } });
    },

    /** 禁用用户 */
    handleDisable(index, row) {
      var self = this;
      this.$confirm("是否确认禁用用户?", "提示", {
        type: "warning"
      })
        .then(() => {
          UserService.disable(row.id)
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

    /** 启用用户 */
    handleEnable(index, row) {
      var self = this;
      this.$confirm("是否确认启用用户?", "提示", {
        type: "warning"
      })
        .then(() => {
          UserService.enable(row.id)
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
    /* 处理表格排序 */
    handleSortChange(val) {
      console.log(val);
      this.qryForm.orderField = Utils.toLine(val.prop);
      this.qryForm.orderDirection = val.order === "ascending" ? "asc" : "desc";
      // 此处需第一页查
      this.reload();
    },
    /**
     * 加载数据
     *
     * @param page 当前页码，默认为1
     * @param pageSize 每页记录数，默认为10
     */
    reload(page = 1, pageSize = 10) {
      UserService.query(page, pageSize, this.qryForm)
        .then(data => {
          console.log(data);
          this.pageData = data;
        })
        .catch(error => {
          this.$message.error(error.message);
        });
    },
    /* 打开商品导入弹窗 */
    handleImportUserPopup(val) {
      this.importUserDialogVisible = true;
    },
    /* 下载门店商品模板 */
    downloadUserImportTemplate() {
      OptionsService.queryByKeys("importUserExcel")
        .then(res => {
          if (
            res &&
            res.length > 0 &&
            res[0].value != null &&
            res[0].value !== ""
          ) {
            window.location.href = res[0].value;
          }
        })
        .catch(err => {
          this.$message.error(err.message);
        });
    },
    // 导入模板上传限制
    handleUploadUserOnExceed(file, fileList) {
      if (fileList.length > 0) {
        this.$message.warning(
          "用户导入文件一次只能上传一个，请删除当前文件再上传"
        );
        return;
      }
    },
    /* 导入门店商品模板前的校验，文件大小不能大于1M */
    beforeExcelUpload(file) {
      const isLt = file.size / 1024 / 1024 < 1;
      if (!isLt) {
        this.$message.error("上传大小不能超过 1M!");
      }
      return isLt;
    },
    /* 门店商品模板删除事件  */
    handleUploadRemove(file, fileList) {
      // 如果是刚上传的图片，会有返回值，否则，不会有返回值response，说明是编辑状态
      fileList.forEach((item, index) => {
        if (item.id === file.id) {
          fileList.splice(index, 1);
        }
      });
    },
    /* 导入门店商品 */
    handleImportUser() {
      this.$refs.uploadUser.submit();
    },
    /* 导入门店商品模板成功事件 */
    handleUploadUserSuccess(response, file, fileList) {
      const self = this;
      if (response.code === 0) {
        const res = response.data;
        if (res) {
          self.importUserDialogVisible = false;
          self.$refs.uploadUser.clearFiles();
          self
            .$confirm(
              "导入请求已经成功提交，请耐心等待后台处理结果。点击“确定”立即查看导出结果。",
              "提示",
              {
                type: "success"
              }
            )
            .then(() => {
              self.handleToImportRecord("IMPORT");
            });
        }
      } else {
        this.$message.error(response.message);
      }
    },
    /**
     * 用户导出
     */
    exportUser() {
      const self = this;
      UserService.exportUser(
        this.pageData.page,
        this.pageData.pageSize,
        this.qryForm
      )
        .then(res => {
          self
            .$confirm(
              "导出请求已经成功提交，请耐心等待后台处理结果。点击“确定”立即查看导出结果。",
              "提示",
              {
                type: "success"
              }
            )
            .then(() => {
              self.handleToImportRecord("EXPORT");
            });
        })
        .catch(err => {
          this.$message.error(err.message);
        });
    },

    downloadImportDetails() {
      BatchService.getExecutionLogUrl(this.batchId)
        .then(res => {
          if (res) {
            window.location.href = res;
          }
        })
        .catch(err => {
          this.$message.error(err.message);
        });
    },

    // 获取SAAS租户信息
    getSaasTenant() {
      if (process.env.PRJ === "SAAS") {
        var tenant = localStorage.getItem("_tenant_");
        if (tenant) {
          this.uploadHeaders["tenant"] = tenant;
        }
      } else {
        this.uploadHeaders["tenant"] = "hema";
      }
    },

    /* 前往导入导出记录 */
    handleToImportRecord(type) {
      if (type === "EXPORT") {
        this.$router.push({
          name: "DfsList",
          query: {
            category: "USER_EXPORT",
            bizName: "用户",
            type: type
          }
        });
      } else {
        this.$router.push({
          name: "DfsList",
          query: {
            nameEquals: "IMPORT_USER",
            type: type
          }
        });
      }
    }
  },

  created() {
    this.reload();
    this.getSaasTenant();
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
.navigation-button {
  display: flex;
  .import-export-button {
    display: inline-block;
    margin-left: 10px;
    overflow: hidden;
    .export {
      padding: 7px 15px;
      i {
        margin-right: 4px;
      }
    }
    .el-button {
      float: left;
      i {
        margin-right: 4px;
      }
    }
    .el-dropdown {
      float: left;
      margin-right: 10px;
    }
    .el-dropdown-link {
      cursor: pointer;
      color: #409eff;
      font-size: 12px;
      i {
        margin-right: 4px;
      }
    }
    .el-icon-arrow-down {
      font-size: 12px;
    }
  }
}
.upload-user-box {
  width: 100%;
  height: 92px;
  .el-upload-list__item {
    margin-top: 0 !important;
  }
}
</style>