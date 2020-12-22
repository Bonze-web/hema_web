<template>
    <div>
        <div class="head" v-if="status === 'create' || status === 'edit'">
            <div style="margin-top:8px" v-if="status === 'create'">新建配置中心</div>
            <div style="margin-top:8px" v-else>编辑</div>
            <div>
                <el-button @click="back">取消</el-button>
                <el-button type="primary" @click="createSuppliers">确认</el-button>
                <!-- <el-button type="primary" v-if="status === 'create'">确认并创建</el-button> -->
            </div>
        </div>
        <div class="head" v-if="status === 'read'">
            <div class="head-title">
                <div style="margin-right:8px">{{ '[' + suppliersInfo.code + ']' + suppliersInfo.name }}</div>
                <template>
                    <el-switch
                        v-model="suppliersInfo.status"
                        @change="statusChange"
                        active-color="#13ce66"
                        inactive-color="#eee">
                    </el-switch>
                </template>
            </div>
            <div>
                <el-button @click="back">返回</el-button>
                <el-button type="primary" @click="editSupplier">编辑</el-button>
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
                                        <el-form-item label="类型" prop="type">
                                          <el-select v-model="form.type" placeholder="请选择类型" @change="dcChange">
                                            <el-option label="中心仓" value="dc"></el-option>
                                            <el-option label="网格仓" value="frontwrh"></el-option>
                                          </el-select>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="6" class="info-box" v-if="form.type === 'frontwrh'">
                                        <el-form-item label="所属仓库" prop="type">
                                          <el-select v-model="form.type" placeholder="请选择类型">
                                            <el-option label="中心仓" value="dc"></el-option>
                                            <el-option label="网格仓" value="frontwrh"></el-option>
                                          </el-select>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="6" class="info-box">
                                        <el-form-item label="代码" prop="code">
                                            <el-input v-model="form.code"></el-input>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="6" class="info-box">
                                        <el-form-item label="名称" prop="name">
                                            <el-input v-model="form.name"></el-input>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="6" class="info-box">
                                        <el-form-item label="来源代码" prop="name">
                                            <el-input v-model="form.name"></el-input>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="6" class="info-box">
                                        <el-form-item label="简称">
                                            <el-input v-model="form.anotherName"></el-input>
                                        </el-form-item>
                                    </el-col>
                                    <!-- <el-col :span="6" class="info-box">
                                        <el-form-item label="货主" prop="name">
                                            <el-input></el-input>
                                        </el-form-item>
                                    </el-col> -->
                                    <el-col :span="6" class="info-box">
                                        <el-form-item label="联系人" prop="contactName">
                                            <el-input v-model="form.contactName"></el-input>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="6" class="info-box">
                                        <el-form-item label="联系方式" prop="mobile">
                                            <el-input v-model="form.mobile"></el-input>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="6" class="info-box">
                                        <el-form-item label="地址" prop="address">
                                            <el-input v-model="form.address"></el-input>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="6" class="info-box">
                                        <el-form-item label="经营面积(m2)">
                                            <el-input placeholder="0.0000" v-model="form.homePage"></el-input>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="6" class="info-box">
                                        <el-form-item label="邮编">
                                            <el-input v-model="form.postCode"></el-input>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                                <el-form-item label="备注">
                                    <textarea v-model="form.remark"></textarea>
                                </el-form-item>
                            </el-form>
                        </el-tab-pane>
                        <!-- <el-tab-pane label="配送中心范围" name="range">配置管理</el-tab-pane>
                        <el-tab-pane label="操作日志" name="log">角色管理</el-tab-pane> -->
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
                                <div>{{ suppliersInfo.anotherName }}</div>
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
                                <div>备注:</div>
                                <div>{{ suppliersInfo.remark ? suppliersInfo.remark : "&lt;空&gt;" }}</div>
                            </el-col>
                        </el-tab-pane>
                        <!-- <el-tab-pane label="配送中心范围" name="range">配置管理</el-tab-pane>
                        <el-tab-pane label="操作日志" name="log">角色管理</el-tab-pane> -->
                    </el-tabs>
                </template>
            </div>
        </div>
    </div>
</template>

<script>
// import { mapGetters } from "vuex";
import BasicService from "@/api/service/BasicService";

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
          anotherName: '',
          contactName: '',
          mobile: '',
          address: '',
          postCode: '',
          homePage: '',
          recordCode: '',
          customField: '',
          remark: '',
          version: ''
        },
        suppliersInfo: {}, // 供应商信息
        createRules: {
          code: [
            { required: true, message: '请输入类别代码', trigger: 'blur' }
          ],
          name: [
            { required: true, message: '请输入供应商名称', trigger: 'blur' }
          ],
          mobile: [
            { required: true, message: '请输入联系方式', trigger: 'blur' }
          ],
          contactName: [
            { required: true, message: '请输入联系人名称', trigger: 'blur' }
          ],
          address: [
            { required: true, message: '请输入地址', trigger: 'blur' }
          ]
        }
      }
    },
    computed: {
    },
    methods: {
      back: function() {
        this.$router.go(-1)
      },
      statusChange: function() {
        // 修改供应商状态
        console.log(this.suppliersInfo.status)
        if (!this.suppliersInfo.status) {
          BasicService.closeSuppliers(this.id)
          .then((res) => {
            this.getSuppliers(this.id)
          })
          .catch((err) => {
            this.$message.error("禁用失败" + err.message)
            this.getSuppliers(this.id)
          })
        } else {
          BasicService.openSuppliers(this.id)
          .then((res) => {
            this.getSuppliers(this.id)
          })
          .catch((err) => {
            this.$message.error("启用失败" + err.message)
            this.getSuppliers(this.id)
          })
        }
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
          if (this.suppliersInfo.status === "OPEN") {
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
                this.$router.go(-1)
              })
              .catch(err => {
                this.$message.error("创建失败" + err.message)
              })
            } else {
              if (this.form.status) {
                this.form.status = "OPEN"
              } else {
                this.form.status = "CLOSED"
              }
              BasicService.updateSupplier(this.form)
              .then(res => {
                console.log(res)
                this.$message.success("更新成功")
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
        this.status = "edit";
        console.log(this.form);
        this.form = Object.assign(this.form, this.suppliersInfo)
        console.log(this.form)
      }
    },
    created() {
      this.getQueryStatus()
    },
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
