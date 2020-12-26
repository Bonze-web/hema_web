<template>
  <div class="navbar-conatainer">
    <div class="navbar-content">
      <el-menu class="navbar" mode="horizontal">
        <div class="logo-container" :class="{open: sidebar.opened}">
          <img src="/static/imgs/share_images/36524/hema.png" alt />
        </div>
        <hamburger class="hamburger-container" :toggleClick="toggleSideBar" :isActive="sidebar.opened"></hamburger>
        <breadcrumb></breadcrumb>
        <div class="navbar-right-container">
          <el-dropdown class="org-container" trigger="click" @command="handleChangeOrg" v-if="user && user.orgId !== 0 && user.orgId !== '0'">
            <span class="el-dropdown-link">
              切换登录组织
              <i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu class="user-dropdown" slot="dropdown">
              <el-dropdown-item :command="item" v-for="item in orgList" :key="item.id" :disabled="item.id === workingOrg.id">{{item.name}}</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
          <el-dropdown class="avatar-container" trigger="click" @command="handleCommand">
            <span class="el-dropdown-link">
              欢迎 {{user? user.realName: ''}}
              <i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu class="user-dropdown" slot="dropdown">
              <el-dropdown-item command="index">首页</el-dropdown-item>
              <el-dropdown-item divided command="updatePwd">修改密码</el-dropdown-item>
              <el-dropdown-item divided command="logout">注销</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </el-menu>
    </div>
    <el-dialog title="密码设置" :visible.sync="dialogVisible" width="400px" center>
      <el-form ref="passForm" :model="passForm" :rules="passFormRules">
        <el-form-item prop="oldPassword" label="旧密码：" label-width="80px">
          <el-input v-model="passForm.oldPassword" style="width: 250px;" auto-complete="off" placeholder="请输入旧密码"></el-input>
        </el-form-item>
        <el-form-item prop="newPassword" label="新密码：" label-width="80px">
          <el-input v-model="passForm.newPassword" style="width: 250px;" auto-complete="off" placeholder="请输入新密码(6-10位字符)"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="onUpdatePwd('passForm')">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import Breadcrumb from "@/components/Breadcrumb";
import Hamburger from "@/components/Hamburger";
import UserService from "@/api/service/UserService";

export default {
  data() {
    var validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入旧密码"));
      } else {
        callback();
      }
    };
    var validatePass2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入新密码"));
      } else {
        var reg = /^[0-9A-Za-z]{6,10}$/;
        if (!reg.test(value)) {
          callback(new Error("密码格式不对"));
        } else {
          callback();
        }
      }
    };
    return {
      logo: "",
      dialogVisible: false,
      passForm: {
        oldPassword: "",
        newPassword: ""
      },
      passFormRules: {
        oldPassword: [{ validator: validatePass, trigger: "blur" }],
        newPassword: [{ validator: validatePass2, trigger: "blur" }]
      },
      orgList: []
    };
  },
  components: {
    Breadcrumb,
    Hamburger
  },
  computed: {
    ...mapGetters(["sidebar", "avatar", "user", "workingOrg"])
  },
  methods: {
    /** 修改用户密码 */
    onUpdatePwd(formName) {
      var self = this;
      this.$refs[formName].validate(valid => {
        if (valid) {
          UserService.modifyPassword(
            this.passForm.oldPassword,
            this.passForm.newPassword
          )
            .then(res => {
              this.dialogVisible = false;
              this.$message({
                message: "修改密码成功，您将重新登录",
                type: "success",
                duration: 2000,
                onClose: function() {
                  self.$store.dispatch("LogOut").then(() => {
                    sessionStorage.setItem("_isLogOut_", true);
                    location.reload(); // 为了重新实例化vue-router对象 避免bug
                  });
                }
              });
            })
            .catch(err => {
              this.$message.error(err.message);
            });
        } else {
          return false;
        }
      });
    },
    toggleSideBar() {
      eventBus.$emit("toggleSideBar");
      this.$store.dispatch("ToggleSideBar");
    },
    logout() {
      this.$store.dispatch("LogOut").then(() => {
        sessionStorage.setItem("_isLogOut_", true);
        location.reload(); // 为了重新实例化vue-router对象 避免bug
      });
    },
    handleCommand(command) {
      if (command === "index") {
        this.$router.push({
          path: "/dashboard"
        });
      } else if (command === "logout") {
        this.logout();
      } else if (command === "updatePwd") {
        this.dialogVisible = true;
      }
    },

    getUserOrgs() {
      UserService.getUserOrgs(this.user.username)
        .then(res => {
          this.orgList = res;
        })
        .catch(err => {
          this.$message.error(err.message);
        });
    },
    handleChangeOrg(val) {
      var reg = new RegExp("report");
      var redirect = this.$route.query.redirect;
      const loginForm = {
        username: this.user.username,
        workingOrgId: val.id
      };
      this.$store
        .dispatch("ChangeWorkingOrg", loginForm)
        .then(data => {
          console.log(redirect);
          if (redirect) {
            if (reg.test(redirect)) {
              this.$router.push({ path: "/dashboard" });
            } else {
              this.$router.push({ path: redirect });
            }
          } else {
            this.$router.push({ path: "/dashboard" });
          }
          location.reload(); // 为了重新实例化vue-router对象 避免bug
        })
        .catch(error => {
          console.log(error);
          console.log(this.$store.state.tagsView.visitedViews);
          this.$message.error(error.message);
        });
    }
  },
  created() {
    this.logo = require("../../../assets/logo_images/logo.png");
    this.getUserOrgs();
  },
  watch: {
    dialogVisible: function(val) {
      if (!val) {
        this.passForm.oldPassword = "";
        this.passForm.newPassword = "";
      }
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.navbar-conatainer {
  .navbar-content {
    position: fixed;
    top: 0;
    left: 0px;
    z-index: 999;
    width: 100%;
    overflow: hidden;
  }

  .navbar {
    height: 50px;
    line-height: 50px;
    border-radius: 0px !important;
    .logo-container {
      float: left;
      text-align: center;
      width: 36px;
      word-break: keep-all;
      overflow: hidden;
      height: 50px;
      img {
        width: 136px;
        height: auto;
      }
    }

    .logo-container.open {
      width: 180px;
    }

    .hamburger-container {
      line-height: 58px;
      height: 50px;
      float: left;
      padding: 0 10px;
    }
    .screenfull {
      position: absolute;
      right: 90px;
      top: 16px;
      color: red;
    }
    .navbar-right-container {
      height: 50px;
      position: absolute;
      right: 35px;
      display: flex;
      justify-content: flex-end;
      align-items: center;
      top: 0;
    }
    .avatar-container {
      height: 50px;
      display: inline-block;
      // position: absolute;
      // right: 35px;
      cursor: pointer;
      .avatar-wrapper {
        margin-top: 5px;
        position: relative;
        .user-avatar {
          width: 40px;
          height: 40px;
          border-radius: 10px;
        }
        .el-icon-caret-bottom {
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
    .org-container {
      height: 50px;
      display: inline-block;
      // position: absolute;
      // right: 180px;
      cursor: pointer;
      margin-right: 20px;
    }
  }
}
.change-org-popover {
  margin-right: 20px !important;
  .change-org-button-box {
    display: flex;
    flex-direction: column;
    .el-button {
      width: 30px;
      text-align: left;
      margin-left: 0;
    }
  }
}
</style>