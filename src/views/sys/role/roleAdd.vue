<template>
  <div class="role-add">
    <div class="top-box">
      <span>新增角色</span>
      <el-button size="small" type="primary" @click="handleSave('form')">保存</el-button>
      <el-button size="small" type="text" @click="handleCancel()">取消</el-button>
    </div>
    <div class="add-content">
      <p>基本信息</p>
      <el-row>
        <el-col style="width:500px;" :offset="5">
          <el-form ref="form" :model="form" status-icon :rules="rules" label-width="120px">
            <el-form-item label="角色名称" prop="name">
              <el-input v-model="form.name"></el-input>
            </el-form-item>
            <el-form-item label="所属组织：" prop="superOrg">
              <org-select :disabled.sync="orgDisabled" :orgValue.sync="form.orgId" :includeLowerOrg="true" style="width:100%;"></org-select>
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
import panel from "@/components/panel.vue";
import BaseEdit from "@/components/bill/baseEdit.vue";
import RoleService from "@/api/service/RoleService";
import OrgSelect from "@/components/orgSelect.vue";

export default {
  components: {
    "imp-panel": panel,
    "base-edit": BaseEdit,
    OrgSelect
  },
  data() {
    var validateName = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("角色名称不能为空"));
      } else {
        callback();
      }
    };
    var checkSuperOrg = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("请选择所属组织"));
      } else {
        callback();
      }
    };
    return {
      orgDisabled: false,
      form: {
        name: "",
        orgId: "",
        remark: ""
      },
      rules: {
        name: [{ validator: validateName, trigger: "blur" }],
        orgId: [{ validator: checkSuperOrg, trigger: "blur" }]
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
      // this.$router.push({ path: "/sys/role" });
      this.$store.dispatch("tagsView/delView", this.$route);
      this.$router.go(-1);
    },

    /** 保存 */
    handleSave(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {          
          if (!this.$route.query.roleInfo) {
            const postData = {
              name: this.form.name, // 门店名称
              orgId: this.form.orgId, // 上级组织
              remark: this.form.remark // 备注
            };

            RoleService.create(postData)
              .then(res => {
                console.log(res);
                this.message("success", "创建角色成功");                
                // this.$router.push({
                //   name: "RoleList"
                // });
                this.$store.dispatch("tagsView/delView", this.$route);
                this.$router.go(-1);
              })
              .catch(err => {
                console.log(err);                
                this.$message.error(err.message)
              });
          } else {
            const postData = {
              id: this.form.id,
              name: this.form.name,
              remark: this.form.remark
            };
            RoleService.update(postData)
              .then(res => {
                console.log(res);                
                this.message("success", "修改角色成功");
                // this.$router.push({
                //   name: "RoleList"
                // });
                this.$store.dispatch("tagsView/delView", this.$route);
                this.$router.go(-1);
              })
              .catch(err => {
                console.log(err);                
                this.$message.error(err.message)
              });
          }
        } else {
          this.message("warning", "填写内容有误");
          return false;
        }
      });
    }
  },
  created() {
    if (this.$route.query.roleInfo) {
      this.orgDisabled = true;
      const roleInfo = JSON.parse(this.$route.query.roleInfo);
      this.form = {
        id: roleInfo.id,
        name: roleInfo.name,
        orgId: roleInfo.orgId,
        remark: roleInfo.remark
      };
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
