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
                                    <el-form-item label="容器类型" prop="containerTypeId">
                                      <el-select v-model="form.containerTypeId" placeholder="请选择容器类型">
                                        <el-option v-for="(item, index) in containerType" :key="index" :label="item.name" :value="item.id"></el-option>
                                      </el-select>
                                    </el-form-item>
                                  </el-col>

                                  <el-col :span="6" class="info-box">
                                    <el-form-item label="前缀" prop="prefix">
                                        <el-input v-model="form.prefix" placeholder="请输入前缀"></el-input>
                                    </el-form-item>
                                  </el-col>

                                  <el-col :span="6" class="info-box">
                                    <el-form-item label="起始条码段" prop="startCode">
                                        <el-input v-model="form.startCode" placeholder="请输入起始条码段"></el-input>
                                    </el-form-item>
                                  </el-col>

                                  <el-col :span="6" class="info-box">
                                    <el-form-item label="生成数量" prop="num">
                                        <el-input v-model="form.num" placeholder="请输入生成数量"></el-input>
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
import BasicService from "@/api/service/BasicService";

export default {
  data() {
      return {
        tabActiveName: 'category',
        form: {
          containerTypeId: '',
          num: '',
          prefix: '',
          startCode: ''
        },
        createRules: {
          containerTypeId: [
            { required: true, message: '请选择容器类型', trigger: 'blur' }
          ],
          num: [
            { required: true, pattern: /^\d{1,4}(\.\d+)?$/, message: '请输入1-4位数字', trigger: 'change' }
          ],
          prefix: [
            { required: true, message: '请输入前缀', trigger: 'blur' },
            { required: true, max: 4, message: '请输入1-4位前缀', trigger: 'change' }
          ],
          startCode: [
            { required: true, message: '请输入起始条码段', trigger: 'blur' },
            { pattern: /^\d{1,12}(\.\d+)?$/, message: '请输入1-12位之间的数字', trigger: 'change' }
          ]
        },
        containerType: []
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
       // 创建新的容器
        this.$refs.form.validate(valid => {
          if (valid) {
            BasicService.batchCreateOcntainer(this.form)
            .then(res => {
              this.$message.success(`容器创建成功${res.successNum}个,失败${res.failNum}个`)
              this.$store.dispatch("tagsView/delView", this.$route);
              this.$router.go(-1)
            })
            .catch(err => {
              this.$message.error("创建失败" + err.message)
            })
          }
        })
      }
    },
    created() {
      BasicService.getContainerTypeList({
        page: 1,
        pageSize: 0,
        statusEquals: 'ON'
      })
      .then(res => {
        console.log(res)
        this.containerType = res.records
      })
      .catch(err => {
        this.$message.error("获取容器类型失败" + err.message)
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
<style lang="scss">
.table-index {
  @import "src/styles/mixin.scss";
  @include elTable;
}
</style>
