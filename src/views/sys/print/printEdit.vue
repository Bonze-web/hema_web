<template>
  <div class="role-add">
    <div class="top-box">
      <span>{{title}}</span>
      <el-button size="small" type="primary" @click="handleSave('form')">保存</el-button>
      <el-button size="small" type="text" @click="handleCancel()">取消</el-button>
    </div>
    <div class="add-content">
      <p>基本信息</p>
      <el-row>
        <el-col style="width:500px;" :offset="5">
          <el-form ref="form" :model="form" status-icon label-width="120px">
            <el-form-item :required="true" label="模板类型">
              <el-select v-model="form.templateType" placeholder="请选择模板类型" :disabled="true">
                <el-option
                  v-for="item in templateType"
                  :key="item.type"
                  :label="item.name"
                  :value="item.type"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item :required="true" label="打印机类型">
              <el-select v-model="form.printerType" placeholder="请选择打印机类型" :disabled="true">
                <el-option
                  v-for="printer in printerType"
                  :key="printer.type"
                  :label="printer.name"
                  :value="printer.type"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item :required="true" label="模板内容：">
              <el-input type="textarea" v-model="form.content" :rows="7"></el-input>
            </el-form-item>
            <el-form-item label="备注：">
              <el-input type="textarea" v-model="form.remark"></el-input>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import PrintTemplate from "@/api/service/PrintTemplate";

export default {
  data() {
    return {
      title: "新增打印模板",
      templateType: [
        {
          name: "线下订单",
          type: "OFFLINE_ORDER"
        },
        {
          name: "立即取餐订单",
          type: "TAKE_MEAL_NOW_ORDER"
        },
        {
          name: "自提订单",
          type: "SELF_DRAW_ORDER"
        },
        {
          name: "外卖订单",
          type: "EXPRESS_ORDER"
        },
        {
          name: "立即取餐退单",
          type: "TAKE_MEAL_NOW_REFUND"
        },
        {
          name: "自提退单",
          type: "SELF_DRAW_REFUND"
        },
        {
          name: "外卖退单",
          type: "EXPRESS_REFUND"
        },
        {
          name: "待审核退款单",
          type: "WAIT_AUDIT_REFUND"
        },
        {
          name: "配送单",
          type: "DISTRIBUTION_ORDER"
        }
      ],
      printerType: [
        {
          name: "易联云",
          type: "YLY"
        },
        {
          name: "商米",
          type: "SUNMI"
        },
        {
          name: "POS自带打印机",
          type: "POS"
        }
      ],
      orgDisabled: false,
      form: {
        templateType: "",
        printerType: "",
        remark: "",
        content: "",
        id: ""
      }
    };
  },

  methods: {
    message(type, msg) {
      this.$message({
        type: type,
        message: msg
      });
    },
    /** 取消 */
    handleCancel() {
      // this.$router.push({ path: "/sys/PrintTemplate" });
      this.$store.dispatch("tagsView/delView", this.$route);
      this.$router.go(-1);
    },

    /** 保存 */
    handleSave(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (
            this.form.templateType === "" ||
            this.form.printerType === "" ||
            this.form.content === ""
          ) {
            this.message("warning", "填写内容有误");
          } else {
            if (!this.$route.query.templateInfo) {
              const postData = {
                content: this.form.content,
                printerType: this.form.printerType,
                remark: this.form.remark,
                type: this.form.templateType
              };
              console.log(postData)
              PrintTemplate.create(postData)
                .then(res => {
                  console.log(res);
                  this.message("success", "创建成功");
                  this.$router.push({
                    name: "PrintList"
                  });
                })
                .catch(err => {
                  // console.log(err);
                  this.$message.error(err.message);
                });
            } else {
              const postData = {
                content: this.form.content,
                printerType: this.form.printerType,
                remark: this.form.remark,
                type: this.form.templateType
              };
              console.log(postData)
              PrintTemplate.update(postData)
                .then(res => {
                  console.log(res);
                  this.message("success", "修改模板成功");
                  this.$router.push({
                    name: "PrintList"
                  });
                })
                .catch(err => {
                  console.log(err);
                  this.$message.error(err.message);
                });
            }
          }
        } else {
          this.message("warning", "填写内容有误");
          return false;
        }
      });
    }
  },
  created() {
    if (this.$route.query.templateInfo) {
      this.orgDisabled = true;
      const templateInfo = JSON.parse(this.$route.query.templateInfo);
      this.form = {
        templateType: templateInfo.type,
        printerType: templateInfo.printerType,
        content: templateInfo.content,
        remark: templateInfo.remark,
        id: templateInfo.id
      };
      console.log(templateInfo);
      this.title = "修改打印模板";
    } else {
      this.orgDisabled = false;
    }
  }
};
</script>

<style lang="scss" scoped>
@import "src/styles/mixin.scss";
.role-add {
  // background-color: #ebeff3;
  min-width: 800px;
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
