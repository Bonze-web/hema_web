<template>
    <div>
        <div class="head">
            <div class="head-title">
                <div style="margin:8px">新建货位类型</div>
            </div>
            <div>
                <el-button @click="back">取消</el-button>
                <el-button type="primary" @click="confirm">确认</el-button>
            </div>
        </div>
        <div style="height:20px" />

        <div class="info-content">
            <div>
                <template>
                    <el-tabs v-model="tabActiveName">
                        <el-tab-pane label="货位类型" name="category">
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
                                      <el-form-item label="存储盘数" prop="storageNumber">
                                          <el-input v-model="form.storageNumber"></el-input>
                                      </el-form-item>
                                    </el-col>
                                </el-row>
                                <el-form-item label="备注" prop="remark">
                                    <textarea v-model="form.remark"></textarea>
                                </el-form-item>

                             <div class="info-title">规格信息</div>

                                <el-row :gutter="20">
                                    <el-col :span="6" class="info-box">
                                        <el-form-item label="长度(cm)" prop="length">
                                            <el-input v-model="form.length"></el-input>
                                        </el-form-item>
                                    </el-col>

                                    <el-col :span="6" class="info-box">
                                        <el-form-item label="宽度(cm)" prop="widht">
                                            <el-input v-model="form.widht"></el-input>
                                        </el-form-item>
                                    </el-col>

                                    <el-col :span="6" class="info-box">
                                      <el-form-item label="高度(cm)" prop="height">
                                          <el-input v-model="form.height"></el-input>
                                      </el-form-item>
                                    </el-col>

                                    <el-col :span="6" class="info-box">
                                      <el-form-item label="承重(kg)" prop="weight">
                                          <el-input v-model="form.weight"></el-input>
                                      </el-form-item>
                                    </el-col>

                                    <el-col :span="6" class="info-box">
                                      <el-form-item label="容积率(%)" prop="plotRatio">
                                          <el-input v-model="form.plotRatio"></el-input>
                                      </el-form-item>
                                    </el-col>
                                </el-row>
                            </el-form>
                        </el-tab-pane>
                    </el-tabs>
                </template>
            </div>
        </div>
    </div>
</template>

<script>
// import { mapGetters } from "vuex";
import StorageService from "@/api/service/StorageService";

export default {
  data() {
      return {
        tabActiveName: 'category',
        form: {
          code: '',
          name: '',
          storageNumber: '',
          remark: '',
          length: '',
          widht: '',
          height: '',
          weight: '',
          plotRatio: ''
        },
        createRules: {
          code: [
            { required: true, message: '请输入类别代码', trigger: 'blur' },
            { required: true, max: 16, message: '最多输入16位', trigger: 'change' }
          ],
          name: [
            { required: true, message: '请输入类别名称', trigger: 'blur' },
            { required: true, max: 40, message: '最多输入40位', trigger: 'change' }
          ],
          storageNumber: [
            { required: true, message: '请选输入存储盘数量', trigger: 'blur' },
            { pattern: /^[0-9]{9}$/, message: '请输入1-999999999之间的数字', trigger: 'change' }
          ],
          remark: [
            { required: true, message: '请输入备注', trigger: 'blur' },
            { required: true, max: 200, message: '最多输入200位', trigger: 'change' }
          ],
          length: [
            { required: true, message: '请输入长度', trigger: 'blur' },
            { pattern: /^\d{1,6}(\.\d+)?$/, message: '请输入1-99999之间的数字', trigger: 'change' }
          ],
          widht: [
            { required: true, message: '请输入宽度', trigger: 'blur' },
            { pattern: /^\d{1,6}(\.\d+)?$/, message: '请输入1-99999之间的数字', trigger: 'change' }
          ],
          height: [
            { required: true, message: '请输入高度', trigger: 'blur' },
            { pattern: /^\d{1,6}(\.\d+)?$/, message: '请输入1-99999之间的数字', trigger: 'change' }
          ],
          weight: [
            { required: true, message: '请输入承重', trigger: 'blur' },
            { pattern: /^\d{1,6}(\.\d+)?$/, message: '请输入1-99999之间的数字', trigger: 'change' }
          ],
          plotRatio: [
            { required: true, message: '请输入容积率', trigger: 'blur' },
            { pattern: /^[0-9]{2}$/, message: '请输入1-9999之间的数字', trigger: 'change' }
          ]
        }
      }
    },
    computed: {
    },
    methods: {
      back: function() {
        this.$store.dispatch("tagsView/delView", this.$route);
        this.$router.go(-1)
      },
      confirm() {
        // 确认
       // 创建新的仓位
        this.$refs.form.validate(valid => {
          if (valid) {
            StorageService.openWmsBintype(this.form)
            .then(res => {
              console.log(res)
            })
            .catch(err => {
              this.$message.error("创建失败" + err)
            })
          }
        })
      }
    },
    created() {},
    filters: {
      categoryLevel(level) {
        switch (level) {
          case "one":
            return "一级"
          case "two":
            return "二级"
          case "three":
            return "三级"
          case "four":
            return "四级"
          default:
            return '未知';
        }
      }
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
