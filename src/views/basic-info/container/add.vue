<template>
    <div>
        <div class="head">
            <div class="head-title">
                <div style="margin:8px">新建容器</div>
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
                        <el-tab-pane label="容器" name="category">
                          <div class="info-title">基本信息</div>
                            <el-form :model="form" :rules="createRules" ref="form" label-width="100px" class="demo-ruleForm">

                                <el-row :gutter="20">
                                  <el-col :span="6" class="info-box">
                                    <el-form-item label="容器类型" prop="dcId">
                                      <el-select v-model="form.dcId" placeholder="请选择容器类型">
                                        <el-option v-for="(item, index) in records" :key="index" :label="item.name" :value="item.id"></el-option>
                                      </el-select>
                                    </el-form-item>
                                  </el-col>

                                  <el-col :span="6" class="info-box">
                                    <el-form-item label="前缀" prop="code">
                                        <el-input v-model="form.code" placeholder="请输入前缀"></el-input>
                                    </el-form-item>
                                  </el-col>

                                  <el-col :span="6" class="info-box">
                                    <el-form-item label="起始条码段" prop="code">
                                        <el-input v-model="form.code" placeholder="请输入起始条码段"></el-input>
                                    </el-form-item>
                                  </el-col>

                                  <el-col :span="6" class="info-box">
                                    <el-form-item label="生成数量" prop="code">
                                        <el-input v-model="form.code" placeholder="请输入生成数量"></el-input>
                                    </el-form-item>
                                  </el-col>

                                </el-row>

                                <el-form-item label="备注" prop="remark">
                                    <textarea v-model="form.remark"></textarea>
                                </el-form-item>

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
          width: '',
          height: '',
          weight: '',
          plotRatio: '',
          dcId: ''
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
            { pattern: /^\d{1,9}(\.\d+)?$/, message: '请输入1-999999999之间的数字', trigger: 'change' }
          ],
          remark: [
            { required: true, message: '请输入备注', trigger: 'blur' },
            { required: true, max: 200, message: '最多输入200位', trigger: 'change' }
          ],
          length: [
            { required: true, message: '请输入长度', trigger: 'blur' },
            { pattern: /^\d{1,4}(\.\d+)?$/, message: '请输入1-9999之间的数字', trigger: 'change' }
          ],
          width: [
            { required: true, message: '请输入宽度', trigger: 'blur' },
            { pattern: /^\d{1,4}(\.\d+)?$/, message: '请输入1-9999之间的数字', trigger: 'change' }
          ],
          height: [
            { required: true, message: '请输入高度', trigger: 'blur' },
            { pattern: /^\d{1,4}(\.\d+)?$/, message: '请输入1-9999之间的数字', trigger: 'change' }
          ],
          weight: [
            { required: true, message: '请输入承重', trigger: 'blur' },
            { pattern: /^\d{1,4}(\.\d+)?$/, message: '请输入1-9999之间的数字', trigger: 'change' }
          ],
          plotRatio: [
            { required: true, message: '请输入容积率', trigger: 'blur' },
            { pattern: /^\d{1,2}(\.\d+)?$/, message: '请输入1-99之间的数字', trigger: 'change' }
          ]
        },
        records: []
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
       // 创建新的仓位
        this.$refs.form.validate(valid => {
          if (valid) {
            StorageService.openWmsBintype(this.form)
            .then(res => {
              this.$message.success("创建成功")
              this.$store.dispatch("tagsView/delView", this.$route);
              this.$router.go(-1)
            })
            .catch(err => {
              this.$message.error("创建失败" + err)
            })
          }
        })
      }
    },
    created() {
      StorageService.getDcQuery()
      .then(res => {
        this.records = res.records;
      }).catch((err) => {
          this.$message.error("获取物流中心失败" + err)
      })
    },
    filters: {}
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
