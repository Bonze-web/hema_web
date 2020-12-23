<template>
  <div class="role-add">
    <div class="top-box">
      <router-link to="/sys/acountIndex" style="font-size: 16px; color: #999999">
        <i class="el-icon-back"></i>返回
      </router-link>
      <i class="vertical-line"></i>
      <span>{{title}}微信小程序账户</span>
      <el-button size="small" type="primary" @click="handleSave('form')">保存</el-button>
      <el-button size="small" type="text" @click="handleCancel()">取消</el-button>
    </div>
    <div class="add-content">
      <el-row style="margin-top:20px">
        <el-col style="width:600px;">
          <el-form ref="form" :model="form" :rules="rules" status-icon label-width="240px">
            <el-form-item label="名称：" prop="name">
              <el-input v-model="form.name" placeholder="请输入账户名称"></el-input>
            </el-form-item>
            <el-form-item label="APPID：" prop="appid">
              <el-input v-model="form.appid" placeholder="请输入小程序appid"></el-input>
            </el-form-item>
            <el-form-item label="appSecret：" prop="appSecret">
              <el-input v-model="form.appSecret" placeholder="请输入appSecret"></el-input>
            </el-form-item>
            <el-form-item label="商户号：" prop="mchId">
              <el-input v-model="form.mchId" placeholder="请输入商户号"></el-input>
            </el-form-item>
            <el-form-item label="V2版本接口密钥：" prop="mchKey">
              <el-input type="text" v-model="form.mchKey" placeholder="请填写V2版本接口密钥"></el-input>
            </el-form-item>

            <el-form-item label="支付证书路径：" prop="keyPath">
              <el-input v-model="form.keyPath" placeholder="请输入支付证书路径"></el-input>
            </el-form-item>
            <el-form-item label="V3版本商户私钥：" prop="privteKey">
              <el-input type="textarea" :rows="4" v-model="form.privteKey" placeholder="请填写V3版本商户私钥"></el-input>
            </el-form-item>
            <el-form-item label="V3版本商户证书序列号：" prop="certificateSn">
              <el-input v-model="form.certificateSn" placeholder="请输入V3版本商户证书序列号"></el-input>
            </el-form-item>
            <el-form-item label="V3版本微信公钥：" prop="wxPublicKey">
              <el-input type="textarea" :rows="4" v-model="form.wxPublicKey" placeholder="请填写V3版本微信公钥"></el-input>
            </el-form-item>
            <el-form-item label="V3版本接口密钥：" prop="v3ApiKey">
              <el-input type="text" v-model="form.v3ApiKey" placeholder="请填写V3版本接口密钥"></el-input>
            </el-form-item>
            <el-form-item label="是否要生成对应的二维码：" prop="asCode">
              <el-radio-group v-model="form.asCode">
                <el-radio :label="true">是</el-radio>
                <el-radio :label="false">否</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="是否默认账户：" prop="asDefault">
              <el-radio-group v-model="form.asDefault">
                <el-radio :label="true">是</el-radio>
                <el-radio :label="false">否</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import panel from "@/components/panel.vue";
import BaseEdit from "@/components/bill/baseEdit.vue";
import WxaService from "@/api/service/WxaService";
import { mapGetters } from "vuex";

export default {
  components: {
    "imp-panel": panel,
    "base-edit": BaseEdit
  },
  data() {
    return {
      form: {
        name: "",
        appid: "",
        appSecret: "",
        accessToken: "",
        asCode: false,
        asDefault: false,
        mchId: "",
        mchKey: "",
        privteKey: "",
        caExpireTime: "",
        certificateSn: "",
        expireTime: "",
        keyPath: "",
        v3ApiKey: "",
        wxPublicKey: ""
      },
      rules: {
        name: [
          {
            required: true,
            message: "请输入微信小程序账户名称",
            trigger: "blur"
          },
          {
            min: 1,
            max: 20,
            message: "名称长度必须在 1 到 20 个字符",
            trigger: "blur"
          }
        ]
      }
    };
  },
  computed: {
    /** 页面标题 */
    title() {
      if (!this.form.id) {
        return "新增";
      } else {
        return "编辑";
      }
    },

    ...mapGetters({ hasPermission: "hasPermission", curUser: "user" })
  },
  methods: {
    message(type, msg) {
      this.$message({
        type: type,
        message: msg
      });
    },
    handleChange(value) {
      this.form.value = value;
    },
    // 代码只允许输入数字
    BlurText(e) {
      // console.log(e)
      const boolean = new RegExp("^[1-9][0-9]*$").test(e);
      if (!boolean) {
        this.message("warning", "代码只允许使用数字");
      }
    },
    /** 取消 */
    handleCancel() {
      // this.$router.push({ path: "/sys/wxaAcount" });
      this.$store.dispatch("tagsView/delView", this.$route);
      this.$router.go(-1);
    },

    /** 保存 */
    handleSave(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          const postData = this.form;
          if (!this.$route.query.id) {
            WxaService.createAccount(postData)
              .then(res => {
                console.log(res);
                this.message("success", "创建微信小程序账户成功");
                this.$router.push({
                  name: "wxaAcount"
                });
              })
              .catch(err => {
                console.log(err);
                this.$message.error(err.message);
              });
          } else {
            WxaService.updateAccount(postData)
              .then(res => {
                this.message("success", "修改微信小程序账户成功");
                this.$router.push({
                  name: "wxaAcount"
                });
              })
              .catch(err => {
                this.$message.error(err.message);
              });
          }
        } else {
          this.message("warning", "填写内容有误");
          return false;
        }
      });
    },

    reload(id) {
      var self = this;
      WxaService.getById(id)
        .then(data => {
          self.form = data;
        })
        .catch(err => {
          self.$message.error(err.message);
        });
    }
  },
  created() {
    const id = this.$route.query.id;
    if (id) {
      this.reload(id);
    }
  }
};
</script>

<style lang="scss" scoped>
@import "src/styles/mixin.scss";
.role-add {
  // background-color: #ebeff3;
  min-width: 800px;
  > .goBack {
    font-size: 16px;
    color: #999999;
  }
  > div {
    margin-bottom: 15px;
    border-radius: 8px;
    background-color: #ffffff;
    padding: 15px;
    &:last-child {
      margin-bottom: 0;
    }
  }
  .top-box {
    @include titleSticky;
    .vertical-line {
      display: inline-block;
      height: 24px;
      width: 0px;
      margin: 0px 3px -5px;
      border-right: 1px solid #cecece;
    }
    span {
      font-size: 20px;
      line-height: 32px;
    }
    .el-button {
      float: right;
      margin-left: 10px;
    }
  }
  .add-content {
    > p {
      font-size: 18px;
      margin: 0px;
      padding: 0px;
      margin-bottom: 20px;
    }
  }
}
</style>
