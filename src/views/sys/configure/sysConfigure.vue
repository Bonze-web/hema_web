<template>
  <div class="configure-index">
    <div class="top-box">
      系统配置管理
      <el-button size="small" type="primary" @click="handleSave()" :hasSave="true" v-if="hasPermission(PermIds.SYS_OPTIONS_UPDATE)">{{isEdit ? '保存' : '编辑'}}</el-button>
      <el-button size="small" type="primary" @click="handleCancel()" v-if="isEdit">取消</el-button>
    </div>
    <div class="content">
      <div class="content-main">
        <el-form ref="form" :model="form" status-icon :rules="rules" label-width="340px">
          <el-collapse>
            <el-collapse-item :title="item.groupName" :name="item.groupName" v-for="item in form.configure" :key="item.groupName">
              <div class="configure-box">
                <!-- <div class="configure-title">{{item.groupName}}</div> -->
                <div class="configure-item">
                  <el-form-item v-for="opts in item.options" :key="opts.key" :label="opts.caption + '：'">
                    <!--根据控件类型设置不同的输入框 -->

                    <!-- 单选 -->
                    <template v-if="opts.valueType === 'BOOLEAN'">
                      <el-radio-group v-model="opts.value" :disabled="!isEdit || opts.readonly">
                        <el-radio label="FALSE">否</el-radio>
                        <el-radio label="TRUE">是</el-radio>
                      </el-radio-group>
                      <span class="tips">{{opts.remark}}</span>
                    </template>

                    <!-- 数字 -->
                    <div v-if="opts.valueType === 'NUMBER'">
                      <el-input class="width180" type="number" v-model="opts.value" :disabled="!isEdit || opts.readonly"></el-input>
                      <span class="tips">{{opts.remark}}</span>
                    </div>

                    <!-- 字符串 -->
                    <template v-if="opts.valueType === 'STRING'">
                      <div v-if="!opts.valueOptions">
                        <el-input class="width340" v-model="opts.value" :disabled="!isEdit || opts.readonly"></el-input>
                      </div>

                      <el-radio-group v-model="opts.value" v-else-if="opts.valueOptions && !opts.multiSelect && opts.options.length < 4" :disabled="!isEdit || opts.readonly">
                        <el-radio :label="it.value" v-for="it in opts.options" :key="it.value">{{it.label}}</el-radio>
                      </el-radio-group>

                      <el-select v-model="opts.value" v-else-if="opts.valueOptions && !opts.multiSelect && opts.options.length >= 4" @change="handleChange(opts.value)" :disabled="!isEdit || opts.readonly">
                        <el-option v-for="it in opts.options" :key="it.value" :label="it.label" :value="it.value"></el-option>
                      </el-select>

                      <div v-if="opts.valueOptions && opts.multiSelect">
                        <el-checkbox-group v-model="opts.selects" :disabled="!isEdit || opts.readonly">
                          <el-checkbox :label="it.value" v-for="it in opts.options" :key="it.value">{{it.label}}</el-checkbox>
                        </el-checkbox-group>
                      </div>

                      <div class="tips no-margin">{{opts.remark}}</div>
                    </template>

                    <!-- TEXT -->
                    <template v-if="opts.valueType === 'TEXT'">
                      <div>
                        <el-input type="textarea" class="width340" :rows="4" v-model="opts.value" :disabled="!isEdit || opts.readonly"></el-input>
                      </div>
                    </template>

                    <!-- FILE -->
                    <template v-if="opts.valueType === 'FILE'">
                      <div @click="clickItem(opts)">
                        <el-upload class="upload-demo" :action="actionUrl" :on-preview="handlePreview" :on-remove="handleRemove" :before-remove="beforeRemove" multiple :limit="1" :on-exceed="handleExceed" :file-list="opts.fileList" :on-success="handleSuccess" :disabled="!isEdit || opts.readonly">
                          <el-button size="small" type="primary">点击上传</el-button>
                        </el-upload>
                      </div>
                    </template>

                    <!-- IMAGE -->
                    <template v-if="opts.valueType === 'IMAGE'">
                      <div @click="clickItem(opts)">
                        <el-upload :action="actionUrl" list-type="picture-card" :limit="1" :on-exceed="handleExceed" :file-list="opts.fileList" :on-success="handleSuccess" :disabled="!isEdit || opts.readonly">
                          <i slot="default" class="el-icon-plus"></i>
                          <div slot="file" slot-scope="{file}">
                            <img class="el-upload-list__item-thumbnail" :src="file.url" alt />
                            <span class="el-upload-list__item-actions">
                              <span class="el-upload-list__item-preview" @click="handlePictureCardPreview(file)">
                                <i class="el-icon-zoom-in"></i>
                              </span>
                              <span v-if="!(!isEdit || opts.readonly)" class="el-upload-list__item-delete" @click="handleImageRemove(file, opts)">
                                <i class="el-icon-delete"></i>
                              </span>
                            </span>
                          </div>
                        </el-upload>
                      </div>
                    </template>
                  </el-form-item>
                </div>
              </div>
            </el-collapse-item>
          </el-collapse>
        </el-form>
      </div>
      <el-dialog :visible.sync="dialogVisible">
        <img width="100%" :src="dialogImageUrl" alt />
      </el-dialog>
    </div>
  </div>
</template>
<script>
import OptionsService from "@/api/service/OptionsService";
import PermIds from "@/api/permissionIds";
import { mapGetters } from "vuex";
import * as Utils from "@/utils/index";

export default {
  data() {
    return {
      form: {
        configure: []
      },
      existingConfigure: [], // 原有配置
      rules: {},
      isEdit: false,
      PermIds: PermIds,
      selectItems: {},
      dialogImageUrl: '',
      dialogVisible: false
    };
  },
  computed: {
    actionUrl() {
      return process.env.BASE_API + "/dfs/upload";
    },
    ...mapGetters(["hasPermission", "workingOrg"])
  },
  methods: {
    handleChange: function(val) {
      console.log(val);
    },
    getGroupOptions: function() {
      OptionsService.getGroupOptions()
        .then(res => {
          var tempList = [];
          var existings = [];
          res.forEach(item => {
            var allOptions = [];
            item.options.forEach(ele => {
              if (ele.valueType !== "OBJECT") {
                if (!ele.valueType) {
                  ele.valueType = "STRING";
                }
                // 有可选项
                if (ele.valueOptions) {
                  var options = [];
                  const optionArr = ele.valueOptions.split(",");
                  optionArr.forEach(it => {
                    if (it.indexOf("|") < 0) {
                      options.push({
                        value: it,
                        label: it
                      });
                    } else {
                      options.push({
                        value: it.split("|")[0],
                        label: it.split("|")[1]
                      });
                    }
                  });
                  ele.options = options;
                  if (ele.multiSelect) {
                    if (ele.value) {
                      ele.selects = ele.value.split(",") || [];
                    } else {
                      ele.selects = [];
                    }
                  }
                }
                if (ele.valueType === "BOOLEAN") {
                  if (ele.value !== "TRUE" && ele.value !== "FALSE") {
                    if (ele.value === true || ele.value === "true") {
                      ele.value = "TRUE";
                    } else {
                      ele.value = "FALSE";
                    }
                  }
                }
                if (ele.valueType === "FILE" || ele.valueType === "IMAGE") {
                  if (ele.value) {
                    console.log(ele.value)
                    var fileName = ""
                    if (ele.valueType === "FILE") {
                      const url = fileName = decodeURIComponent(ele.value)
                      const urlArr = url.split('/')
                      fileName = urlArr[urlArr.length - 1]
                      fileName = fileName.split('.')[0]
                    }
                    ele.fileList = [{ name: fileName, url: ele.value }];
                  }
                }
                ele.readonly = ele.readonly || false;
                existings.push({
                  id: ele.id,
                  value: ele.value
                });
                allOptions.push(ele);
              }
            });
            item.options = allOptions;
            tempList.push(item);
          });
          this.form.configure = tempList;
          this.existingConfigure = existings;
        })
        .catch(err => {
          this.$message.error(err.message);
        });
    },
    handlePostData: function() {
      const that = this;
      var configure = [];
      this.form.configure.forEach(item => {
        item.options.forEach(ele => {
          // 有可选项
          if (ele.selects) {
            ele.value = ele.selects.join();
          }
          for (let i = 0; i < that.existingConfigure.length; i++) {
            const it = that.existingConfigure[i];
            if (ele.id === it.id && ele.value !== it.value) {
              configure.push({
                // id: ele.id,
                key: ele.key,
                value: ele.value
              });
            }
          }
        });
      });
      return configure;
    },
    // 保存信息
    handleSave() {
      if (!this.isEdit) {
        this.isEdit = true;
        return;
      }

      this.$refs["form"].validate(valid => {
        if (valid) {
          var postData = this.handlePostData();
          console.log(postData);
          if (postData.length > 0) {
            OptionsService.batchUpdate(postData)
              .then(res => {
                this.$message.success("修改成功！");
                this.isEdit = false;
                this.getGroupOptions();
              })
              .catch(err => {
                this.$message.error(err.message);
              });
          } else {
            this.$message.warning("请对配置进行修改后再进行保存操作~");
          }
        }
      });
    },
    // 取消保存
    handleCancel() {
      this.isEdit = false;
      this.getGroupOptions();
    },
    handleRemove(file, fileList) {
      console.log(file, fileList);
      // 修改对应项的数据
      this.form.configure.forEach(item => {
        item.options.forEach(ele => {
          // 有可选项
          if (ele.id === this.selectItems.id) {
            ele.value = ""
          }
        });
      });
    },
    handlePreview(file) {
      Utils.downloadFile(file.url, file.name);
    },
    handleExceed(files, fileList) {
      this.$message.warning("请删除当前文件再上传~");
    },
    handleImageRemove(file, val) {
      this.form.configure.forEach(item => {
        item.options.forEach(ele => {
          // 有可选项
          if (ele.id === val.id) {
            ele.value = ""
            ele.fileList = []
          }
        });
      });
    },
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`);
    },

    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    handleDownload(file) {
      console.log(file)
    },
    handleSuccess(response, file, fileList) {
      if (response.data) {
        const res = response.data;
        // 修改对应项的数据
        this.form.configure.forEach(item => {
          item.options.forEach(ele => {
            // 有可选项
            if (ele.id === this.selectItems.id) {
              ele.value = res.url
            }
          });
        });
      } else {
        this.$message.error(response.message);
      }
    },
    clickItem(opts) {
      this.selectItems = opts
    }
  },
  mounted() {
    this.getGroupOptions();
  }
};
</script>
<style lang="scss" scoped>
@import "src/styles/mixin.scss";
.configure-index {
  @include common;
  .top-box {
    @include titleSticky;
    .el-button {
      float: right;
      margin-left: 10px;
    }
  }
  .content {
    color: #333333;
    font-family: SourceHanSansCN-Regular;
    padding: 15px 26px;
    .content-main {
      .configure {
        &-box {
          padding-bottom: 10px;
          .el-form-item {
            margin: 10px 0;
          }
          .tips {
            font-size: 12px;
            color: #999999;
            margin-left: 15px;
            &.no-margin {
              margin-left: 0;
            }
          }
        }
        &-title {
          font-size: 16px;
          line-height: 36px;
          color: #333333;
          line-height: 10px 0;
          font-weight: bold;
        }
      }
      .width500 {
        width: 500px;
      }
      .width180 {
        width: 180px;
      }
      .width340 {
        width: 340px;
      }
    }
  }
}
</style>
<style lang="scss">
.configure-index {
  .el-collapse-item__header {
    font-size: 16px;
    line-height: 36px;
    color: #333333;
    line-height: 10px 0;
    // font-weight: bold;
  }
  .el-upload-list--picture-card .el-upload-list__item,
  .el-upload--picture-card {
    width: 80px;
    height: 80px;
    line-height: 80px;
  }
}
</style>