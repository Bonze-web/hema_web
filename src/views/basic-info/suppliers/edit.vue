<template>
    <div>
        <div class="head" v-if="status === 'create'">
            <div style="margin-top:8px">新建供应商</div>
            <div>
                <el-button @click="back">取消</el-button>
                <el-button type="primary" @click="createSuppliers">确认</el-button>
                <el-button type="primary">确认并创建</el-button>
            </div>
        </div>
        <div class="head" v-if="status === 'read'">
            <div class="head-title">
                <div style="margin-right:8px">[A004]4号供应商</div>
                <template>
                    <el-switch
                        v-model="sellerInfo"
                        active-color="#13ce66"
                        inactive-color="#eee">
                    </el-switch>
                </template>
            </div>
            <div>
                <el-button @click="back">返回</el-button>
                <el-button type="primary">编辑</el-button>
            </div>
        </div>
        <div style="height:20px" />
        <div class="info-content" v-if="status === 'create'">
            <div>
                <template>
                    <el-tabs v-model="tabActiveName" @tab-click="tabClick">
                        <el-tab-pane label="供应商" name="suppliers">
                            <div class="info-title">基本信息</div>
                            <el-form :model="form" :rules="createRules" ref="form" label-width="100px" class="demo-ruleForm">
                                <el-row :gutter="20">
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
                                        <el-form-item label="简称">
                                            <el-input></el-input>
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
                                        <el-form-item label="邮编">
                                            <el-input></el-input>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="6" class="info-box">
                                        <el-form-item label="主页">
                                            <el-input></el-input>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="6" class="info-box">
                                        <el-form-item label="经营者备案码">
                                            <el-input></el-input>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="6" class="info-box">
                                        <el-form-item label="自定义字段1">
                                            <el-input></el-input>
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
                                <div></div>
                            </el-col>
                            <el-col :span="6" class="info-box">
                                <div>名称:</div>
                                <div></div>
                            </el-col>
                            <el-col :span="6" class="info-box">
                                <div>简称:</div>
                                <div></div>
                            </el-col>
                            <!-- <el-col :span="6" class="info-box">
                                <div>货主:</div>
                                <div></div>
                            </el-col> -->
                            <el-col :span="6" class="info-box">
                                <div>联系人:</div>
                                <div></div>
                            </el-col>
                            <el-col :span="6" class="info-box">
                                <div>联系方式:</div>
                                <div></div>
                            </el-col>
                            <el-col :span="6" class="info-box">
                                <div>地址:</div>
                                <div></div>
                            </el-col>
                            <el-col :span="6" class="info-box">
                                <div>邮编:</div>
                                <div></div>
                            </el-col>
                            <el-col :span="6" class="info-box">
                                <div>主页:</div>
                                <div></div>
                            </el-col>
                            <el-col :span="6" class="info-box">
                                <div>经营者备案:</div>
                                <div></div>
                            </el-col>
                            <el-col :span="6" class="info-box">
                                <div>自定义字段1:</div>
                                <div></div>
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
// import SellerService from "@/api/service/SellerService";

export default {
  data() {
      return {
        status: '', // 页面状态
        sellerInfo: true,
        tabActiveName: 'suppliers', // tab栏名称
        form: {
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
          remark: ''
        },
        suppliersInfo: {},
        createRules: {
          code: [
            { required: true, message: '请输入活动名称', trigger: 'blur' }
          ],
          name: [
            { required: true, message: '请输入供应商名称', trigger: 'blur' }
          ],
          mobile: [
            { type: 'number', required: true, message: '请输入联系方式', trigger: 'blur' }
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
      getQueryStatus: function() {
        this.status = this.$route.query.status
        if (this.status === 'read') {
          this.getSuppliers()
        }
      },
      getSuppliers: function() {
        
      },
      tabClick: function() {  
      },
      createSuppliers: function() {
        if (this.$refs.form.validate) {
            console.log(1)
        } else {
            this.$message.error('请检查填写信息')
        }  
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
    margin: 12px 0;
    font-size: 12px;
}
.info-title{
    margin: 12px 0;
}
</style>
