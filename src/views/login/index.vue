<template>
  <div class="login-container">
    <div class="login-logo">
      <img src="/static/imgs/share_images/36524/hema.png" alt />
    </div>
    <div class="login-main">
      <transition name="imgshow">
        <img v-show="imgshow" class="login-img" src="../../../static/imgs/index/index-img1.png" alt />
      </transition>
      <transition name="formshow">
        <el-form v-show="imgshow" :model="loginForm" :rules="loginRules" ref="loginForm" label-position="left" label-width="0px" class="card-box login-form">
          <h3 class="title">{{title}}</h3>
          <el-form-item prop="username">
            <span class="svg-container svg-container_login">
              <svg-icon icon-class="user" />
            </span>
            <el-input name="username" type="text" size="big" v-model="loginForm.username" placeholder="请输入用户名" :maxlength="20" />
          </el-form-item>
          <el-form-item prop="password">
            <span class="svg-container svg-container_password">
              <svg-icon icon-class="password"></svg-icon>
            </span>
            <el-input name="password" :type="pwdType" size="big" @keyup.enter.native="handleLogin" v-model="loginForm.password" placeholder="请输入密码" :minlength="6" :maxlength="10"></el-input>
            <span class="show-pwd" @click="showPwd">
              <svg-icon :icon-class="pwdType? 'close-eye': 'eye'" />
            </span>
          </el-form-item>
          <el-form-item prop="tenant" v-if="prj==='SAAS'">
            <span class="svg-container svg-container_store">
              <svg-icon icon-class="store"></svg-icon>
            </span>
            <el-input name="tenant" type="text" size="big" :disabled="isUrltenant" @keyup.enter.native="handleLogin" v-model="loginForm.tenant" placeholder="请输入公司代码" :maxlength="20" @blur="handleTenantBlur" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" size="big" class="login-btn" :loading="loading" @click.native.prevent="handleLogin">登&nbsp;录</el-button>
          </el-form-item>
          <div class="version">当前版本 {{version}}</div>
        </el-form>
      </transition>
      <!-- <div class="copyright">Copyright &copy; 2020 上海孚巽数字科技有限公司 版权所有</div> -->
    </div>
  </div>
</template>

<script>
export default {
  name: "login",

  data() {
    return {
      loginForm: {
        username: "",
        password: "",
        tenant: "" // 租户
      },
      loginRules: {
        username: [
          { required: true, trigger: "blur", message: "请输入用户名" },
          { max: 20, message: "用户名不能大于20个字符", trigger: "blur" }
        ],
        password: [
          { required: true, trigger: "blur", message: "请输入密码" },
          {
            min: 6,
            max: 10,
            message: "密码长度在6到10个字符",
            trigger: "blur"
          }
        ],
        tenant: [{ required: true, trigger: "blur", message: "请填写公司代码" }]
      },
      loading: false,
      pwdType: "password",
      imgshow: false,
      logo: "",
      prj: "",
      IsFirstLogin: true, // 是否第一次登陆后台
      isUrltenant: false // 是否URL中带有租户信息
    };
  },
  computed: {
    title: function() {
      return process.env.TITLE;
    },
    version: function() {
      return process.env.VERSION;
    }
  },
  watch: {
    $route(to, from) {
      console.log(from.query.tenant, to.query.tenant, to.path);
      if (to.path === "/login" && to.query.tenant !== from.query.tenant) {
        const tenant = to.query.tenant ? to.query.tenant : "";
        if (tenant != null && tenant !== "null" && tenant !== "") {
          console.log("tenant", tenant);
          localStorage.setItem("_tenant_", tenant);
          this.isUrltenant = true;
          this.loginForm.tenant = tenant;
        } else {
          this.isUrltenant = false;
        }
      }
    }
  },
  mounted() {
    console.log(window.location);

    this.imgshow = true;
    this.prj = process.env.PRJ;
    if (this.prj === "SAAS") {
      var tenant = localStorage.getItem("_tenant_");
      if (window.location.pathname !== "/wms-admin/") {
        var pathnameArr = window.location.pathname.split("/");
        if (pathnameArr.length > 1) {
          tenant = pathnameArr[1];
          if (tenant != null && tenant !== "null" && tenant !== "") {
            localStorage.setItem("_tenant_", tenant);
            this.isUrltenant = true;
          }
        }
      }
      if (this.$route.query.tenant) {
        tenant = this.$route.query.tenant;
        if (tenant != null && tenant !== "null" && tenant !== "") {
          localStorage.setItem("_tenant_", tenant);
          this.isUrltenant = true;
        }
      }
      if (tenant) {
        this.loginForm.tenant = tenant;
      }
    }
    this.logo = require("../../assets/logo_images/logo.png");
    var operationalRecords = localStorage.getItem("_user_operational_records_");
    operationalRecords = JSON.parse(operationalRecords);
    if (operationalRecords && operationalRecords.hasNoviceGuidance) {
      this.IsFirstLogin = false;
    }
  },
  methods: {
    showPwd() {
      if (this.pwdType === "password") {
        this.pwdType = "";
      } else {
        this.pwdType = "password";
      }
    },

    handleLogin() {
      var reg = new RegExp("report");
      var redirect = this.$route.query.redirect;
      if (this.prj === "SAAS") {
        localStorage.setItem("_tenant_", this.loginForm.tenant);
      }

      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true;
          const loginForm = {
            username: this.loginForm.username,
            password: this.loginForm.password
          };
          this.$store
            .dispatch("Login", loginForm)
            .then(data => {
              this.loading = false;
              if (redirect) {
                if (reg.test(redirect)) {
                  this.$router.push({ path: "/" });
                } else {
                  this.$router.push({ path: redirect });
                }
              } else {
                this.$router.push({ path: "/" });
              }
            })
            .catch(error => {
              this.loading = false;
              this.$message.error(error.message);
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },

    handleTenantBlur: function() {
      localStorage.setItem("_tenant_", this.loginForm.tenant);
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss">
$bg: #2d3a4b;
$dark_gray: #889aa4;
$light_gray: #eee;
$wathet: #5eb0fa;

.login-container {
  position: fixed;
  height: 100%;
  width: 100%;
  .login-logo {
    height: 50px;
    line-height: 50px;
    background: #fff;
    img {
      height: 50px;
      margin-left: 10%;
      vertical-align: middle;
      margin-top: -3px;
    }
  }
  .login-main {
    width: 100%;
    height: calc(100% - 50px);
    background: url('~static/imgs/index/login-bg.png') no-repeat center;
    background-size: 100% 100%;
    // overflow: hidden;
    .login-img {
      position: absolute;
      top: 50%;
      left: 15%;
      width: 480px;
      height: 366px;
      transform: translateY(-50%);
      animation: beat 1s infinite;
      animation-direction: alternate;
      animation-timing-function: linear;
    }
    @keyframes beat {
      from {
        margin-top: -10px;
      }
      to {
        margin-top: 10px;
      }
    }
    .imgshow-enter-active {
      transition: all 1s ease;
      left: 15%;
      opacity: 1;
    }
    .imgshow-enter {
      left: -480px;
      opacity: 0;
    }
    .copyright {
      position: absolute;
      width: 100%;
      bottom: 10px;
      left: 0px;
      text-align: center;
      color: #89c2fb;
      font-size: 13px;
    }
  }
  // background-color: $bg;

  input:-internal-autofill-selected {
    -webkit-box-shadow: 0 0 0 100px white inset;
    box-shadow: 0 0 0 100px white inset;
  }
  input {
    background: transparent;
    border: 0px;
    -webkit-appearance: none;
    border-radius: 0px;
    padding: 12px 5px 12px 15px;
    // color: $light_gray;
    height: 47px;
  }
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;
  }
  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;
  }
  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
    height: 46px;
    box-sizing: border-box;
    &_login {
      font-size: 20px;
    }
    &_password {
      .svg-icon {
        margin-left: 2px;
      }
    }
    &_store {
      font-size: 15px;
      .svg-icon {
        margin-left: 1px;
      }
    }
  }
  .title {
    font-size: 26px;
    // font-weight: 400;
    color: $wathet;
    margin: 0px auto 40px auto;
    text-align: center;
    // font-weight: bold;
  }

  .login-form {
    position: absolute;
    top: 50%;
    right: 15%;
    width: 400px;
    padding: 35px 35px 15px 35px;
    // margin: 120px auto;
    transform: translateY(-50%);
    background: #fff;
    border-radius: 6px;
    box-shadow: 0px 0px 10px 1px rgba($color: #999, $alpha: 0.2);
  }
  .formshow-enter-active {
    transition: all 1s ease;
    right: 15%;
    opacity: 1;
  }
  .formshow-enter {
    right: -400px;
    opacity: 0;
  }
  .el-form-item {
    border: 1px solid #ddd;
    // background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
  }
  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }
  .thirdparty-button {
    position: absolute;
    right: 35px;
    bottom: 28px;
  }
  .login-btn {
    width: 100%;
    background: #00aaff;
  }
  .version {
    text-align: center;
    color: #9a9a9a;
    font-size: 14px;
    margin: 5px 0px;
  }
}
</style>
