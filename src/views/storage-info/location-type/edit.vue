<template>
    <div>
        <div class="head" v-if="status === 'create' || status === 'edit'">
            <div style="margin-top:8px" v-if="status === 'create'">新建类别</div>
            <div style="margin-top:8px" v-else>编辑</div>
            <div>
                <el-button @click="back">取消</el-button>
                <el-button type="primary" @click="createCategory">确认</el-button>
            </div>
        </div>

        <div class="head" v-if="status === 'read'">
            <div class="head-title">
                <div style="margin:8px">{{ '[' + wmsBintypeInfo.code + ']' + wmsBintypeInfo.name }}</div>
                <template>
                  <el-button type="text" @click="deleteWmsBintype">删除</el-button>
                </template>
            </div>
            <div>
                <el-button @click="back">返回</el-button>
                <el-button type="primary" @click="editCategory" v-if="hasPermission(PermIds.WMS_BINTYPE_UPDATE)">编辑</el-button>
            </div>
        </div>
        <div style="height:20px" />

        <!-- 编辑 -->
        <div class="info-content" v-if="status === 'create' || status === 'edit'">
            <div>
                <template>
                    <el-tabs v-model="tabActiveName">
                        <el-tab-pane label="货位类型" name="category">
                          <div class="info-title">基本信息</div>
                            <el-form :model="form" :rules="createRules" ref="form" label-width="100px" class="demo-ruleForm">
                                <el-row :gutter="20">
                                    <el-col :span="6" class="info-box">
                                        <el-form-item label="代码" prop="code">
                                            <el-input disabled="true" v-model="form.code"></el-input>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="6" class="info-box">
                                        <el-form-item label="名称" prop="name">
                                            <el-input v-model="form.name"></el-input>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="6" class="info-box">
                                      <el-form-item label="存储托盘数" prop="storageNumber">
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
                                            <el-input v-model="form.width"></el-input>
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


        <!-- 展示 -->
        <div class="info-content" v-if="status === 'read'">
            <div>
                <template>
                    <el-tabs v-model="tabActiveName">
                        <el-tab-pane label="货位类型" name="category">
                            <div class="info-title">基本信息</div>
                            <el-col :span="6" class="info-box">
                                <div>代码:</div>
                                <div>{{ wmsBintypeInfo.code }}</div>
                            </el-col>
                            <el-col :span="6" class="info-box">
                                <div>名称:</div>
                                <div>{{ wmsBintypeInfo.name }}</div>
                            </el-col>
                            <el-col :span="6" class="info-box">
                                <div>存储托盘数:</div>
                                <div>{{ wmsBintypeInfo.storageNumber }}</div>
                            </el-col>
                            <el-col class="info-box">
                                <div>备注:</div>
                                <div>{{ wmsBintypeInfo.remark ? wmsBintypeInfo.remark : "&lt;空&gt;" }}</div>
                            </el-col>
                            </br>
                            <div class="info-title" style="padding-top:22px">规格信息</div>
                            <el-col :span="6" class="info-box">
                                <div>长度(cm):</div>
                                <div>{{ wmsBintypeInfo.length }}</div>
                            </el-col>
                            <el-col :span="6" class="info-box">
                                <div>宽度(cm):</div>
                                <div>{{ wmsBintypeInfo.width }}</div>
                            </el-col>
                            <el-col :span="6" class="info-box">
                                <div>高度(cm):</div>
                                <div>{{ wmsBintypeInfo.height }}</div>
                            </el-col>
                            <el-col :span="6" class="info-box">
                                <div>承重(kg):</div>
                                <div>{{ wmsBintypeInfo.weight }}</div>
                            </el-col>
                            <el-col :span="6" class="info-box">
                                <div>容积率(%):</div>
                                <div>{{ wmsBintypeInfo.plotRatio }}</div>
                            </el-col>
                        </el-tab-pane>

                        <!-- <el-tab-pane label="消息中心">消息中心</el-tab-pane> -->
                    </el-tabs>
                </template>
            </div>
        </div>
    </div>
</template>

<script>
import StorageService from "@/api/service/StorageService";
import PermIds from "@/api/permissionIds";
import { mapGetters } from "vuex";

export default {
  data() {
      return {
        PermIds: PermIds,
        tabActiveName: 'category', // tab栏名称
        active: 'ccc',
        status: '', // 页面状态
        id: '', // 货位类别ID
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
            { required: true, message: '请输入存储托盘数量', trigger: 'blur' },
            { pattern: /^[1-9]\d*$/, message: '请输入正整数', trigger: 'change' }
          ],
          // remark: [
          //   { required: true, message: '请输入备注', trigger: 'blur' },
          //   { required: true, max: 200, message: '最多输入200位', trigger: 'change' }
          // ],
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
            { pattern: /^100$|^(\d|[1-9]\d)(\.\d+)*$/, message: '请输入1-100之间的数字', trigger: 'change' }
          ]
        },
        wmsBintypeInfo: {} // 货位
      }
    },
    computed: {
      ...mapGetters(["hasPermission"])
    },
    methods: {
      back: function() {
        this.$store.dispatch("tagsView/delView", this.$route);
        this.$router.go(-1)
      },
      deleteWmsBintype: function() {
        // 删除货位
        const _this = this;
        this.$confirm('操作将删除此货位，是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          StorageService.deleteWmsBintype(_this.wmsBintypeInfo.id, _this.wmsBintypeInfo.version)
          .then(res => {
            this.$message.success("删除成功")
            this.$store.dispatch("tagsView/delView", this.$route);
            this.$router.go(-1)
          })
          .catch(err => {
            this.$message.error("删除失败" + err.message)
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          })        
        })
      },
      getQueryStatus: function() {
        this.status = this.$route.query.status

        if (this.status === 'read') {
          this.id = this.$route.query.id;
          this.getWmsBintypeDetails(this.id)
        }
      },
      getWmsBintypeDetails: function(id) {
        StorageService.getWmsBintypeDetails(id)
        .then((res) => {
          console.log(res)
          this.wmsBintypeInfo = res;
          // 根据状态修改仓库开启switch
          if (this.wmsBintypeInfo.status === "OFF") {
            this.wmsBintypeInfo.status = true
          } else {
            this.wmsBintypeInfo.status = false
          }

          this.form = this.wmsBintypeInfo;
        })
        .catch((err) => {
          this.$message.error("获取详情失败" + err)
        })
      },
      createCategory: function() {
        // 更新货位
        this.$refs.form.validate(valid => {
          if (valid) {
            const opt = Object.assign(this.wmsBintypeInfo, this.from)
            opt.status = 'NORMAL';

            StorageService.updateWmsBintype(opt)
            .then(res => {
              this.$message.success("更新成功")
              this.$store.dispatch("tagsView/delView", this.$route);
              this.$router.go(-1)
            })
            .catch(err => {
              this.$message.error("更新失败" + err.message)
            })
          }
        })
      },
      editCategory() {
        this.status = "edit"
        this.form = Object.assign(this.form, this.categoryInfo)
      }
    },
    created() {
      this.getQueryStatus()
    },
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
