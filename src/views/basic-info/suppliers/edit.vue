<template>
    <div>
        <div class="head" v-if="status === 'create' || status === 'edit'">
            <div style="margin-top:8px" v-if="status === 'create'">新建供应商</div>
            <div style="margin-top:8px" v-else>编辑</div>
            <div>
                <el-button @click="back">取消</el-button>
                <el-button type="primary" @click="createSuppliers">确认</el-button>
                <!-- <el-button type="primary" v-if="status === 'create'">确认并创建</el-button> -->
            </div>
        </div>
        <div class="head" v-if="status === 'read'">
            <div class="head-title">
                <div style="margin:8px">{{ '[' + suppliersInfo.code + ']' + suppliersInfo.name }}</div>
                <!-- <template>
                    <el-switch
                        v-model="suppliersInfo.status"
                        @change="statusChange"
                        active-color="#13ce66"
                        inactive-color="#eee">
                    </el-switch>
                </template> -->
                <template>
                  <el-button type="text" @click="statusChange" :disabled="!hasPermission(PermIds.PRODUCT_SUPPLIER_MODLIFY)" v-if="suppliersInfo.status">禁用</el-button>
                  <el-button type="text" @click="statusChange" :disabled="!hasPermission(PermIds.PRODUCT_SUPPLIER_MODLIFY)" v-if="!suppliersInfo.status">启用</el-button>
                </template>
            </div>
            <div>
                <el-button @click="back">返回</el-button>
                <el-button type="primary" @click="editSupplier" v-if="hasPermission(PermIds.PRODUCT_SUPPLIER_UPDATE) && suppliersInfo.status">编辑</el-button>
            </div>
        </div>
        <div style="height:20px" />
        <div class="info-content" v-if="status === 'create' || status === 'edit'">
            <div>
                <template>
                    <el-tabs v-model="tabActiveName" @tab-click="tabClick">
                        <el-tab-pane label="供应商" name="suppliers">
                            <div class="info-title">基本信息</div>
                            <el-form :model="form" :rules="createRules" ref="form" label-width="100px" class="demo-ruleForm">
                                <el-row :gutter="20">
                                    <el-col :span="6" class="info-box">
                                        <el-form-item label="代码" prop="code">
                                            <el-input maxlength="40" v-model="form.code"></el-input>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="6" class="info-box">
                                        <el-form-item label="名称" prop="name">
                                            <el-input maxlength="40" v-model="form.name"></el-input>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="6" class="info-box">
                                        <el-form-item label="简称">
                                            <el-input maxlength="40" v-model="form.anotherName"></el-input>
                                        </el-form-item>
                                    </el-col>
                                    <!-- <el-col :span="6" class="info-box">
                                        <el-form-item label="货主" prop="name">
                                            <el-input></el-input>
                                        </el-form-item>
                                    </el-col> -->
                                    <el-col :span="6" class="info-box">
                                        <el-form-item label="联系人" prop="contactName">
                                            <el-input maxlength="40" v-model="form.contactName"></el-input>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="6" class="info-box">
                                        <el-form-item label="联系方式" prop="mobile">
                                            <el-input v-model="form.mobile"></el-input>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="6" class="info-box">
                                        <el-form-item label="地址" prop="address">
                                            <el-input maxlength="40" v-model="form.address"></el-input>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="6" class="info-box">
                                        <el-form-item label="邮编" prop="postCode">
                                            <el-input maxlength="40" v-model="form.postCode"></el-input>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="6" class="info-box">
                                        <el-form-item label="主页">
                                            <el-input maxlength="40" v-model="form.homePage"></el-input>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="6" class="info-box">
                                        <el-form-item label="经营者备案码">
                                            <el-input maxlength="40" v-model="form.recordCode"></el-input>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="6" class="info-box">
                                        <el-form-item label="自定义字段1">
                                            <el-input maxlength="40" v-model="form.customField"></el-input>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                                <el-form-item label="备注">
                                    <textarea rows="5" maxlength="200" v-model="form.remark"></textarea>
                                </el-form-item>
                            </el-form>
                        </el-tab-pane>
                        <!-- <el-tab-pane label="配送中心范围" name="range">配置管理</el-tab-pane> -->
                        <!-- <el-tab-pane label="操作日志" name="log">角色管理</el-tab-pane> -->
                    </el-tabs>
                </template>
            </div>
        </div>
        <div class="info-content" v-if="status === 'read'">
            <div>
                <template>
                    <el-tabs v-model="tabActiveName" @tab-click="tabClick">
                        <el-tab-pane label="供应商" name="suppliers">
                            <div class="info-title">基本信息</div>
                            <el-col :span="6" class="info-box">
                                <div>代码:</div>
                                <div>{{ suppliersInfo.code }}</div>
                            </el-col>
                            <el-col :span="6" class="info-box">
                                <div>名称:</div>
                                <div>{{ suppliersInfo.name }}</div>
                            </el-col>
                            <el-col :span="6" class="info-box">
                                <div>简称:</div>
                                <div>{{ suppliersInfo.anotherName ? suppliersInfo.anotherName : "&lt;空&gt;"  }}</div>
                            </el-col>
                            <!-- <el-col :span="6" class="info-box">
                                <div>货主:</div>
                                <div></div>
                            </el-col> -->
                            <el-col :span="6" class="info-box">
                                <div>联系人:</div>
                                <div>{{ suppliersInfo.contactName }}</div>
                            </el-col>
                            <el-col :span="6" class="info-box">
                                <div>联系方式:</div>
                                <div>{{ suppliersInfo.mobile }}</div>
                            </el-col>
                            <el-col :span="6" class="info-box">
                                <div>地址:</div>
                                <div>{{ suppliersInfo.address }}</div>
                            </el-col>
                            <el-col :span="6" class="info-box">
                                <div>邮编:</div>
                                <div>{{ suppliersInfo.postCode ? suppliersInfo.postCode : "&lt;空&gt;" }}</div>
                            </el-col>
                            <el-col :span="6" class="info-box">
                                <div>主页:</div>
                                <div>{{ suppliersInfo.homePage ? suppliersInfo.homePage : "&lt;空&gt;" }}</div>
                            </el-col>
                            <el-col :span="6" class="info-box">
                                <div>经营者备案:</div>
                                <div>{{ suppliersInfo.recordCode ? suppliersInfo.recordCode : "&lt;空&gt;" }}</div>
                            </el-col>
                            <el-col :span="6" class="info-box">
                                <div>自定义字段1:</div>
                                <div>{{ suppliersInfo.customField ? suppliersInfo.customField : "&lt;空&gt;" }}</div>
                            </el-col>
                            <el-col class="info-box">
                                <div style="width:32px">备注:</div>
                                <div>{{ suppliersInfo.remark ? suppliersInfo.remark : "&lt;空&gt;" }}</div>
                            </el-col>
                        </el-tab-pane>
                        <!-- <el-tab-pane label="配送中心范围" name="range">配置管理</el-tab-pane> -->
                        <el-tab-pane label="操作日志" name="log">
                          <system-log modular="SUPPLIER" :id="id"></system-log>
                        </el-tab-pane>
                    </el-tabs>
                </template>
            </div>
        </div>
    </div>
</template>

<script>
import systemLog from "@/components/systemLog.vue";
import BasicService from "@/api/service/BasicService";
import PermIds from "@/api/permissionIds";
import { mapGetters } from "vuex";

export default {
  data() {
      return {
        status: '', // 页面状态
        id: '', // 供应商ID
        tabActiveName: 'suppliers', // tab栏名称
        form: {
          id: '',
          code: '',
          name: '',
          anotherName: '', // 简称
          contactName: '', // 联系人
          mobile: '',
          address: '',
          postCode: '',
          homePage: '',
          recordCode: '',
          customField: '',
          remark: '',
          version: ''
        },
        PermIds: PermIds,
        suppliersInfo: {}, // 供应商信息
        createRules: {
          code: [
            { required: true, message: '请输入类别代码', trigger: 'blur' }
          ],
          name: [
            { required: true, message: '请输入供应商名称', trigger: 'blur' }
          ],
          mobile: [
            { required: true, message: '请输入联系方式', trigger: 'blur' },
            { required: true, pattern: /^[1-9]\d{10}$/, message: '请输入正确的手机号格式', trigger: 'blur' }
          ],
          contactName: [
            { required: true, message: '请输入联系人名称', trigger: 'blur' }
          ],
          address: [
            { required: false, message: '请输入地址', trigger: 'blur' }
          ],
          postCode: [
            { pattern: /^[0-9]{6,6}$/, message: '请输入正确的邮编', trigger: 'blur' }
          ]
        }
      }
    },
    components: {
      systemLog
    },
    computed: {
      ...mapGetters(["hasPermission"])
    },
    methods: {
      back: function() {
        this.$store.dispatch("tagsView/delView", this.$route);
        this.$router.go(-1)
      },
      statusChange: function() {
        // 修改供应商状态
        const _this = this
        this.$confirm('此操作将改变供应商状态, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          if (_this.suppliersInfo.status) {
          BasicService.closeSuppliers(_this.id, _this.suppliersInfo.version)
          .then((res) => {
            _this.$message.success("禁用成功")
            _this.getSuppliers(_this.id)
          })
          .catch((err) => {
            _this.$message.error("禁用失败" + err.message)
            _this.getSuppliers(_this.id)
          })
        } else {
          BasicService.openSuppliers(_this.id, _this.suppliersInfo.version)
          .then((res) => {
            _this.$message.success("启用成功")
            _this.getSuppliers(_this.id)
          })
          .catch((err) => {
            _this.$message.error("启用失败" + err.message)
            _this.getSuppliers(_this.id)
          })
        }
        })
      },
      getQueryStatus: function() {
        this.status = this.$route.query.status
        if (this.status === 'read') {
          this.id = this.$route.query.id
          this.getSuppliers(this.id)
        }
      },
      getSuppliers: function(id) {
        // 获取供应商详情
        BasicService.getSuppliersDetail(id)
        .then((res) => {
          this.suppliersInfo = res
          // 根据状态修改供应商开启switch
          if (this.suppliersInfo.status === "ON") {
            this.suppliersInfo.status = true
          } else {
            this.suppliersInfo.status = false
          }
        })
        .catch((err) => {
          this.$message.error("获取详情失败" + err.message)
        })
      },
      tabClick: function() {  
      },
      createSuppliers: function() {
        // 创建新的供应商
        this.$refs.form.validate(valid => {
          if (valid) {
            if (this.status === 'create') {
              BasicService.createSuppliers(this.form)
              .then(res => {
                console.log(res)
                this.$message.success("创建成功")
                this.$store.dispatch("tagsView/delView", this.$route);
                this.$router.go(-1)
              })
              .catch(err => {
                this.$message.error("创建失败" + err.message)
              })
            } else {
              if (this.form.status) {
                this.form.status = "ON"
              } else {
                this.form.status = "OFF"
              }
              BasicService.updateSupplier(this.form)
              .then(res => {
                console.log(res)
                this.$message.success("更新成功")
                this.$store.dispatch("tagsView/delView", this.$route);
                this.$router.go(-1)
              })
              .catch(err => {
                this.$message.error("更新失败" + err.message)
              })
            }
          } else {
            console.log(2)
          }
        })
      },
      editSupplier() {
        this.status = "edit"
        this.tabActiveName = 'suppliers'
        this.form = Object.assign(this.form, this.suppliersInfo)
        console.log(this.form)
      }
    },
    created() {
      this.getQueryStatus()
    },
    // beforeRouteEnter(to, from, next) {
    //   next(vm => {
    //     // 通过 `vm` 访问组件实例
    //     vm.getQueryStatus();
    //   })
    // },
    filters: {
    
    }
};
</script>

<style lang="scss" scoped>
@import "src/styles/mixin.scss";
.head{
    background: #fff;
    padding: 15px 12px;
    border-radius: 12px;
    border: 1px #eee solid;
    display: flex;
    justify-content: space-between;
}
.head-title{
    display: flex;
    justify-content: left;
}
.info-content{
    background: #fff;
    border-radius: 12px;
    padding: 15px 12px;
}
.info-box{
    margin: 4px 0;
    font-size: 12px;
    display: flex;
    justify-content: left;
}
.info-title{
    margin: 12px 0;
}
</style>
