<template>
  <base-edit :title="title">
    <span slot="toolbox">
      <el-button @click="goback" type="text" size="small">取消</el-button>
      <el-button @click="onSave" type="primary" icon="el-icon-check" size="small">保存</el-button>
    </span>
    <el-form class="edit-form" ref="form" :model="form" :rules="rules" label-width="180px" slot="body">
      <el-form-item label="组织名称：" required prop="name">
        <el-input v-model="form.name" placeholder="请输入组织名称"></el-input>
      </el-form-item>
      <el-form-item label="组织代码：" required prop="code">
        <el-input v-model="form.code" :disabled="isEdit" maxlength="20" placeholder="请输入组织代码"></el-input>
      </el-form-item>
      <el-form-item label="组织地址：" prop="address">
        <el-input v-model="form.address" placeholder="请输入组织地址"></el-input>
      </el-form-item>
      <el-form-item label="组织类型：" required prop="type">
        <el-select v-model="orgType" :disabled="isEdit" placeholder="请选择组织类型" @change="handleOrgTypeSelect">
          <el-option v-for="item in orgTypes" :key="item.key" :label="item.label" :value="item.key"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="上级组织：" prop="upperOrgId">
        <el-select v-model="upperOrgId" placeholder="请选择上级组织" :disabled="isEdit || orgType==='GROUP'" @change="handleChange" clearable filterable remote :remote-method="remoteMethod" @focus="handleFocus" :loading="loading" @clear="handleClear">
          <el-option v-for="item in orgsList" :key="item.id" :label="item.name" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="经度：" prop="longitude">
        <el-input v-model="form.longitude" placeholder="请输入经度" type="number"></el-input>
      </el-form-item>
      <el-form-item label="纬度：" prop="latitude">
        <el-input v-model="form.latitude" placeholder="请输入纬度" type="number"></el-input>
      </el-form-item>
      <el-form-item label="联系人：" prop="contact">
        <el-input v-model="form.contact" placeholder="请输入联系人"></el-input>
      </el-form-item>
      <el-form-item label="联系电话：" prop="tel">
        <el-input v-model="form.tel" placeholder="请输入联系电话"></el-input>
      </el-form-item>
      <el-form-item label="组织介绍：" prop="remark">
        <el-input type="textarea" :rows="4" v-model="form.remark" maxlength="128" placeholder="请输入组织介绍"></el-input>
      </el-form-item>
    </el-form>
  </base-edit>
</template>
<script>
import BaseEdit from "@/components/bill/baseEdit.vue";
import OrgService from "@/api/service/OrgService";
import * as Utils from "@/utils/index";
import { mapGetters } from "vuex";

export default {
  components: {
    "base-edit": BaseEdit
  },

  data() {
    const validateName = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("组织名称不能为空"));
      } else {
        callback();
      }
    };
    const checkCode = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("组织代码不能为空"));
      } else {
        callback();
      }
    };
    const checkPhoneNum = (rule, value, callback) => {
      const reg = /^((0\d{2,3}-\d{7,8})|(1([38][0-9]|4[579]|5[0-3,5-9]|6[6]|7[0135678]|9[89])\d{8}))$/;
      const reg400 = /^[48]00\d{7,8}$/;
      const reg4002 = /^400(-\d{3,4}){2}$/;
      if (!this.form.tel) {
        return callback(new Error("客服电话不能为空"));
      } else if (!reg.test(value) && !reg400.test(value) && !reg4002.test(value)) {
        callback(new Error("请输入正确的客服电话"));
      } else {
        callback();
      }
    };
    return {
      form: {
        id: null, // 组织id
        code: "", // 组织代码
        name: "", // 组织名称
        type: "", // 组织类型,可用值:GROUP,COMPANY,STORE,DEPART
        address: "", // 地址
        contact: "", // 联系人
        latitude: "", // 纬度
        longitude: "", // 经度
        remark: "", // 备注
        tel: "", // 联系电话
        upperOrgId: "" // 上级组织ID
      },
      isEdit: false,
      orgType: "",
      orgTypes: [
        { id: "1", key: "COMPANY", label: "分公司" },
        { id: "2", key: "DEPART", label: "部门" }
      ],
      upperOrgId: "", // 上级组织ID
      orgsList: [], // 组织列表
      queryFrom: {
        nameLike: "",
        orgTypesIn: []
      },
      rules: {
        name: [{ validator: validateName, trigger: "blur" }],
        code: [{ validator: checkCode, trigger: "blur" }],
        tel: [{ validator: checkPhoneNum, trigger: "blur" }]
      },
      loading: false,
      currentStoreId: ""
    };
  },

  computed: {
    ...mapGetters(["workingOrg"]),
    /** 页面标题 */
    title() {
      if (!this.form.id) {
        return "新增组织";
      } else {
        return "编辑组织";
      }
    }
  },

  filters: {
    /**
     * 格式化组织状态
     */
    formatState(org) {
      return org.disabled ? "已禁用" : "已激活";
    }
  },
  methods: {
    /** 回退 */
    goback() {
      this.$router.go(-1);
    },
    /** 处理组织类型选择 */
    handleOrgTypeSelect() {
      this.form.type = this.orgType;
      // 组织类型为总部时 上级组织不可选
      // 组织类型为分公司时，上级组织可选总部
      // 组织类型为部门时，上级组织可选总部和分公司
      if (this.orgType === "COMPANY") {
        this.queryFrom.orgTypesIn = "GROUP";
      } else {
        this.queryFrom.orgTypesIn = "GROUP,COMPANY";
      }
      this.queryFrom.nameLike = "";
      this.upperOrgId = "";
      this.orgsList = [];
      this.form.upperOrgId = "";
    },

    /** 保存组织 */
    onSave() {
      if (this.form.id) {
        this.update();
      } else {
        this.create();
      }
    },

    /** 新增组织 */
    create() {
      var self = this;
      this.doValidate()
        .then(() => {
          return OrgService.create(self.form);
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

    /** 更新组织 */
    update() {
      var self = this;
      this.doValidate()
        .then(() => {
          return OrgService.update(self.form);
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

    /** 校验表单 */
    doValidate() {
      var self = this;
      return new Promise(function(resolve, reject) {
        self.$refs["form"].validate(valid => {
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
    getById(id) {
      OrgService.getById(id)
        .then(res => {
          if (res) {
            this.form = {
              id: res.id, // 组织id
              code: res.code, // 组织代码
              name: res.name, // 组织名称
              type: res.type, // 组织类型,可用值:GROUP,COMPANY,STORE,DEPART
              address: res.address, // 地址
              contact: res.contact, // 联系人
              latitude: res.latitude, // 纬度
              longitude: res.longitude, // 经度
              remark: res.remark, // 备注
              tel: res.tel, // 联系电话
              upperOrgId: res.orgId // 上级组织ID
            };
            this.orgType = res.type;
            // 根据上级组织id获取上级组织名称
            if (res.orgId) {
              OrgService.getById(res.orgId)
                .then(res => {
                  this.upperOrgId = res.name;
                })
                .catch(error => {
                  this.$message.error(error.message);
                });
            }
          }
        })
        .catch(error => {
          this.$message.error(error.message);
        });
    },

    remoteMethod(query) {
      this.loading = true;
      this.queryOrgs(query);
    },

    handleFocus() {
      if (!this.queryFrom.nameLike) {
        this.queryOrgs("");
      }
    },

    handleClear() {
      this.queryFrom.nameLike = "";
    },

    handleChange(val) {
      this.form.upperOrgId = val;
    },
    /**
     * 查询组织
     */
    queryOrgs(query) {
      this.queryFrom.nameLike = query;
      OrgService.query(1, 0, this.queryFrom)
        .then(res => {
          this.loading = false;
          var tempList = [];
          if (res.records.length > 0) {
            res.records.forEach(item => {
              tempList.push(item);
            });
          }
          this.orgsList = tempList;
        })
        .catch(error => {
          this.$message.error(error.message);
        });
    }
  },

  created() {
    if (this.workingOrg) {
      this.currentStoreId = this.workingOrg.id; // 当前门店的id
      console.log(this.currentStoreId);
      if (this.currentStoreId === "0") {
        this.orgTypes = [
          { id: "0", key: "GROUP", label: "总部" },
          { id: "1", key: "COMPANY", label: "分公司" },
          { id: "2", key: "DEPART", label: "部门" }
        ];
      }
    }
    var id = this.$route.query.id;
    if (id) {
      this.isEdit = true;
      this.orgTypes = [
        { id: "0", key: "GROUP", label: "总部" },
        { id: "1", key: "COMPANY", label: "分公司" },
        { id: "2", key: "DEPART", label: "部门" }
      ];
      this.getById(id);
    }
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

.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
