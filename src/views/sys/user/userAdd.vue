<template>
  <base-edit :title="title">
    <span slot="toolbox">
      <el-button @click="goback" type="text" size="small">取消</el-button>
      <el-button @click="onResetPwd" size="small" v-if="user.id">重置密码</el-button>
      <el-button @click="onSave" type="primary" icon="el-icon-check" size="small">保存</el-button>
    </span>

    <el-form class="edit-form" ref="userForm" :model="user" :rules="rules" label-width="180px" slot="body">
      <el-form-item label="所属组织" prop="orgIds">
        <org-select :orgValue.sync="user.orgIds" :includeLowerOrg="true" v-if="(editOrg && upperOrgId)|| !user.id" :orgRange="orgRange" :multiple="true"></org-select>
        <span v-else>{{user.orgNames}}</span>
        <el-button size="small" v-if="hasPermission(PermIds.SYS_USER_UPDATE_ORG) && user.id && !editOrg" @click="handleEditOrg">修改</el-button>
      </el-form-item>
      <el-form-item label="状态" v-if="user.id">
        {{user.disabled? '已禁用': '已激活'}}
        <!-- 自已不能禁用或启用自己 -->
        <el-button @click="onDisable" type="danger" size="small" v-if="hasPermission(PermIds.SYS_USER_DISABLE) && user.id && !user.disabled" :disabled="curUser.id === user.id">禁用</el-button>
        <el-button @click="onEnable" size="small" v-if="hasPermission(PermIds.SYS_USER_ENABLE) && user.id && user.disabled" :disabled="curUser.id === user.id">启用</el-button>
      </el-form-item>
      <el-form-item label="用户名" prop="username">
        <el-input :disabled="user.id ? true : false" v-model.trim="user.username" placeholder="请输入用户名，长度大于3小于20个字符" :minlength="3" :maxlength="20"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password" v-if="!user.id">
        <el-input type="password" v-model.trim="user.password" placeholder="请输入密码，最长10位字符" auto-complete="off" :minlength="6" :maxlength="10"></el-input>
      </el-form-item>
      <el-form-item label="确认密码" prop="confirmPassword" v-if="!user.id">
        <el-input type="password" v-model.trim="user.confirmPassword" placeholder="请输入确认密码，最长10位字符" auto-complete="off" :minlength="6" :maxlength="10"></el-input>
      </el-form-item>
      <el-form-item label="昵称" prop="realName">
        <el-input v-model.trim="user.realName" placeholder="请输入昵称" :maxlength="20"></el-input>
      </el-form-item>
      <el-form-item label="手机号" prop="mobile">
        <el-input v-model.trim="user.mobile"></el-input>
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input v-model.trim="user.email" :maxlength="100"></el-input>
      </el-form-item>
      <el-form-item label="工号" prop="workNumber">
        <el-input v-model.trim="user.workNumber" :maxlength="30"></el-input>
      </el-form-item>
      <el-form-item label="头像" prop="avatar">
        <div v-if="user.avatar" class="uploaded-img-box">
          <img :src="user.avatar" class="avatar" />
          <div>
            <i class="el-icon-delete" @click="deleteUploadedAvatar"></i>
          </div>
        </div>
        <el-upload v-if="!user.avatar" class="avatar-uploader" :action="fileUploadUrl" :headers="uploadHeaders" :show-file-list="false" :on-success="handleAvatarSuccess" :on-error="handleAvatarFailed" :before-upload="beforeAvatarUpload" drag>
          <i class="el-icon-upload"></i>
          <div class="el-upload__text">
            将文件拖到此处，或
            <em>点击上传</em>
          </div>
          <div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过1M</div>
        </el-upload>
      </el-form-item>
    </el-form>
  </base-edit>
</template>
<script>
import BaseEdit from "@/components/bill/baseEdit.vue";
import OrgSelect from "@/components/orgSelect";
import UserService from "@/api/service/UserService";
import PermIds from "@/api/permissionIds";
import * as Utils from "@/utils/index";
import { mapGetters } from "vuex";
import { getToken } from "@/utils/auth";

export default {
  components: {
    "base-edit": BaseEdit,
    OrgSelect
  },

  data() {
    var validatePwd2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.user.confirmPassword) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    var validateOrg = (rule, value, callback) => {
      if (value === "" || value.length === 0) {
        callback(new Error("请选择所属组织"));
      } else {
        callback();
      }
    };

    return {
      uploadHeaders: {
        "access-token": getToken()
      },
      user: {
        id: null,
        orgIds: "",
        username: "",
        password: "",
        confirmPassword: "",
        realName: "",
        mobile: "",
        email: "",
        workNumber: "",
        avatar: "",
        orgNames: ""
      },
      PermIds: PermIds,
      rules: {
        orgIds: [{ required: true, validator: validateOrg, trigger: "blur" }],
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          {
            min: 3,
            max: 20,
            message: "用户名长度必须在 3 到 20 个字符",
            trigger: "blur"
          }
        ],
        password: [
          { required: true, message: "请输入登录密码", trigger: "blur" },
          {
            min: 6,
            max: 10,
            message: "密码长度必须在 6 到 10 个字符",
            trigger: "blur"
          }
        ],
        confirmPassword: [
          { required: true, validator: validatePwd2, trigger: "blur" }
        ],
        realName: [
          { required: true, message: "请输入用户昵称", trigger: "blur" },
          { max: 20, message: "昵称不能超过20个字符" }
        ],
        mobile: [
          {
            pattern: /^((0\d{2,3}-\d{7,8})|(1([38][0-9]|4[579]|5[0-3,5-9]|6[6]|7[0135678]|9[89])\d{8}))$/,
            message: "目前只支持中国大陆的手机号码",
            trigger: "blur"
          }
        ],
        email: [
          {
            type: "email",
            message: "请输入正确的邮箱地址",
            trigger: "blur"
          }
        ],
        workNumber: [
          {
            max: 30,
            message: "工号不能超过30个字符",
            trigger: "blur"
          }
        ]
      },
      editOrg: false,
      upperOrgId: "", // 门店的上级组织id
      orgRange: "ALL"
    };
  },

  computed: {
    /** 页面标题 */
    title() {
      if (!this.user.id) {
        return "新增用户";
      } else {
        return "编辑用户";
      }
    },

    fileUploadUrl: function() {
      return process.env.BASE_API + "/sys/dfs/upload";
    },

    ...mapGetters({ hasPermission: "hasPermission", curUser: "user" })
  },

  methods: {
    // 刪除已上传的头像
    deleteUploadedAvatar() {
      this.user.avatar = "";
    },

    /** 回退 */
    goback() {
      this.$router.push({ name: "UserList" });
    },

    handleAvatarSuccess(res, file) {
      if (res.code === 0) {
        this.user.avatar = res.data.url;
      } else {
        this.handleAvatarFailed(res.message);
      }
    },

    handleAvatarFailed(err) {
      this.$message.error(err);
    },

    beforeAvatarUpload(file) {
      // const isJPG = file.type === "image/jpeg";
      const isLt1M = file.size / 1024 / 1024;
      // if (!isJPG) {
      //   this.$message.error("上传头像图片只能是 JPG 格式!");
      // }
      if (!isLt1M) {
        this.$message.error("上传头像图片大小不能超过 1MB!");
      }
      return isLt1M;
    },

    /** 保存用户 */
    onSave() {
      if (this.user.id) {
        this.update();
      } else {
        this.create();
      }
    },

    /** 新增用户 */
    create() {
      var self = this;
      this.doValidate()
        .then(() => {
          return UserService.create(self.user);
        })
        .then(() => {
          Utils.showMessage("保存成功！", function() {
            self.goback();
          });
        })
        .catch(err => {
          Utils.showError(err);
        });
    },

    /** 更新用户 */
    update() {
      var self = this;
      this.doValidate()
        .then(() => {
          return UserService.update({
            ...self.user,
            orgId: ""
          });
        })
        .then(res => {
          // 修改所属组织
          if (self.hasPermission(PermIds.SYS_USER_UPDATE_ORG)) {
            const postData = {
              id: self.user.id,
              orgIds: self.user.orgIds
            };
            return UserService.updateOrg(postData);
          }
        })
        .then(() => {
          Utils.showMessage("保存成功！", function() {
            self.goback();
          });
        })
        .catch(err => {
          Utils.showError(err);
        });
    },

    /** 启用用户 */
    onEnable() {
      var self = this;
      this.$confirm("是否确认启用用户?", "提示", {
        type: "warning"
      })
        .then(() => {
          UserService.enable(self.user.id)
            .then(() => {
              self.$message({
                message: "操作成功！",
                type: "success"
              });
              self.reload(self.user.id);
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

    /** 禁用用户 */
    onDisable() {
      var self = this;
      this.$confirm("是否确认禁用用户?", "提示", {
        type: "warning"
      })
        .then(() => {
          UserService.disable(self.user.id)
            .then(() => {
              self.$message({
                message: "操作成功！",
                type: "success"
              });
              self.reload(self.user.id);
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

    /** 重置用户密码 */
    onResetPwd() {
      var self = this;
      this.showPassForm = false;
      this.$confirm("是否确认重置用户密码?", "提示", {
        type: "warning"
      })
        .then(() => {
          UserService.resetPassword(self.user.id)
            .then(() => {
              self.$message({
                message: "操作成功！",
                type: "success"
              });
              self.reload(self.user.id);
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

    /** 修改用户密码 */
    onUpdatePwd(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          UserService.modifyPassword(
            this.passForm.oldPassword,
            this.passForm.newPassword
          )
            .then(res => {
              this.dialogVisible = false;
              this.$message.success("修改密码成功");
            })
            .catch(err => {
              Utils.showError(err);
            });
        } else {
          return false;
        }
      });
    },

    /** 校验表单 */
    doValidate() {
      var self = this;
      return new Promise(function(resolve, reject) {
        self.$refs["userForm"].validate(valid => {
          if (!valid) {
            reject("输入非法，请修改后再试");
          } else {
            resolve(true);
          }
        });
      });
    },

    /**
     * 重新加载单据
     *
     * @param id 单据ID
     */
    reload(id) {
      var self = this;
      UserService.getById(id)
        .then(data => {
          self.user = {
            ...data,
            orgNames: ""
          };
          self.upperOrgId = data.orgId;
          return UserService.getUserOrgs(data.username);
        })
        .then(res => {
          var orgIds = [];
          var orgNames = [];
          res.forEach(ele => {
            orgIds.push(ele.id);
            orgNames.push(ele.name);
          });
          self.user.orgIds = orgIds;
          self.user.orgNames = orgNames.join(",");
          console.log(self.user.orgNames)
        })
        .catch(err => {
          Utils.showError(err);
        });
    },
    // 获取SAAS租户信息
    getSaasTenant() {
      if (process.env.PRJ === "SAAS") {
        var tenant = localStorage.getItem("_tenant_");
        if (tenant) {
          this.uploadHeaders["tenant"] = tenant;
        }
      }
    },

    handleEditOrg: function() {
      this.editOrg = true;
    }
  },
  created() {
    var id = this.$route.query.id;
    if (id) {
      this.reload(id);
    }
    this.getSaasTenant();
  }
};
</script>

<style>
.el-upload-dragger {
  width: 400px;
}
.el-upload.el-upload--text {
  width: 100%;
  overflow: hidden;
}
</style>

<style rel="stylesheet/scss" lang="scss" scoped>
.edit-form {
  .el-input,
  .el-textarea {
    max-width: 400px;
  }
}

.edit-form.readonly {
  .el-form-item {
    margin-bottom: 0px !important;
  }
}

.avatar-uploader {
  width: 100%;
}

.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}

.uploaded-img-box {
  width: 178px;
  height: 178px;
  position: relative;
  border: 1px solid #dedede;
  border-radius: 8px;
  overflow: hidden;
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
  div {
    position: absolute;
    top: 0px;
    left: 0px;
    width: 100%;
    height: 100%;
    background: rgba($color: #333, $alpha: 0.6);
    text-align: center;
    line-height: 178px;
    font-size: 22px;
    color: #409eff;
    display: none;
    i {
      cursor: pointer;
    }
  }
  &:hover {
    div {
      display: block;
    }
  }
}

.pass-setting {
  text-align: center;
}
</style>
