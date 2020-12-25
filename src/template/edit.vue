<template>
    <div>
        结构为标题和主题，头部为标题和按钮，左右布局






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
                  <el-button type="text" @click="statusChange" v-if="suppliersInfo.status">禁用</el-button>
                  <el-button type="text" @click="statusChange" v-if="!suppliersInfo.status">启用</el-button>
                </template>
            </div>
            <div>
                <el-button @click="back">返回</el-button>
                <el-button type="primary" @click="editSupplier">编辑</el-button>
            </div>
        </div>
        <div style="height:20px" />

        主体部分为form表单和内容显示，自定义form表单和内容显示需要根据控件要求使用规定的控件






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
                                            <el-input v-model="form.code"></el-input>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
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
          新建和编辑时需要对输入进行限制
        // createRules: {
        //   code: [
        //     { required: true, message: '请输入类别代码', trigger: 'blur' }
        //   ],
        //   name: [
        //     { required: true, message: '请输入供应商名称', trigger: 'blur' }
        //   ],
        //   mobile: [
        //     { required: true, message: '请输入联系方式', trigger: 'blur' },
        //     { required: true, pattern: /^[1-9]\d{10}$/, message: '请输入正确的手机号格式', trigger: 'blur' }
        //   ],
        //   contactName: [
        //     { required: true, message: '请输入联系人名称', trigger: 'blur' }
        //   ],
        //   address: [
        //     { required: true, message: '请输入地址', trigger: 'blur' }
        //   ]
        // }
      }
    }
};
</script>

<style lang="scss" scoped>
@import "src/styles/mixin.scss";
</style>




