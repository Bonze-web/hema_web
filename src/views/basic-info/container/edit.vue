<template>
    <div>
        <!-- <div class="head">
            <div style="margin-top:8px" v-if="status === 'create'">新建类别</div>
            <div style="margin-top:8px" v-else>编辑</div>
            <div>
                <el-button @click="back">返回</el-button>
                <el-button type="primary" @click="createCategory">打印</el-button>
            </div>
        </div> -->

        <div class="head">
            <div class="head-title">
                <div style="margin:8px">{{ '[' + wmsBintypeInfo.code + ']' + wmsBintypeInfo.name }}</div>
                <template>
                  <el-button type="text" @click="deleteWmsBintype">状态</el-button>
                </template>
            </div>
            <div>
                <el-button @click="back">返回</el-button>
                <el-button type="primary" @click="editCategory">打印</el-button>
            </div>
        </div>
        <div style="height:20px" />


        <!-- 编辑 -->
        <!-- <div class="info-content" v-if="status === 'create' || status === 'edit'">
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
        </div> -->


        <!-- 展示 -->
        <div class="info-content table-index">
            <div>
                <template>
                    <el-tabs v-model="tabActiveName">
                        <el-tab-pane label="货位类型" name="category">
                            <div class="info-title">基本信息</div>
                            <el-col :span="6" class="info-box">
                                <div>条码:</div>
                                <div>{{ wmsBintypeInfo.code }}</div>
                            </el-col>
                            <el-col :span="6" class="info-box">
                                <div>容器类型:</div>
                                <router-link style="color: #409eff" :to="{ path: '/basicinfo/container/edit' }" >
                                  {{ '[' + wmsBintypeInfo.code + ']' + wmsBintypeInfo.name }}
                                </router-link>
                            </el-col>
                            <el-col :span="6" class="info-box">
                                <div>所属对象:</div>
                                <div>{{ wmsBintypeInfo.storageNumber }}</div>
                            </el-col>
                            <el-col :span="6" class="info-box">
                                <div>父容器:</div>
                                <div>{{ wmsBintypeInfo.remark ? wmsBintypeInfo.remark : "&lt;空&gt;" }}</div>
                            </el-col>

                            <el-col :span="6" class="info-box">
                                <div>当前位置:</div>
                                <div>{{ wmsBintypeInfo.height }}</div>
                            </el-col>

                            <el-col :span="6" class="info-box">
                                <div>目标位置:</div>
                                <div>{{ wmsBintypeInfo.remark ? wmsBintypeInfo.remark : "&lt;空&gt;" }}</div>
                            </el-col>
                            <br>

                            <el-col>
                                <div  class="info-title title">子容器</div>
                            </el-col>

                            <div style="height:20px" />

                            <el-table :data="listData" @selection-change="handleSelectionChange"  style="width: 100%; text-align: center" :row-style="{ height: '16px', padding: '-4px' }" >


                            <el-table-column prop="code" label="条码" style="height: 20px">
                              <template slot-scope="scope">
                                <router-link style="color: #409eff" :to="{ path: '/basicinfo/container/edit' }" >
                                  <span>条码{{ scope.row.code }}</span>
                                </router-link>
                              </template>
                            </el-table-column>

                            <el-table-column prop="code" label="容器类型" style="height: 20px">
                              <template slot-scope="scope">
                                <router-link style="color: #409eff" :to="{ path: '/basicinfo/container-type' }" >
                                  <span>容器类型{{ scope.row.code }}</span>
                                </router-link>
                              </template>
                            </el-table-column>

                            <el-table-column prop="height" label="状态"></el-table-column>

                          </el-table>


                        </el-tab-pane>

                        <el-tab-pane label="操作日志" name="active">
                          1111
                        </el-tab-pane>
                    </el-tabs>
                </template>
            </div>
        </div>
    </div>
</template>

<script>
import StorageService from "@/api/service/StorageService";

export default {
  data() {
      return {
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
        wmsBintypeInfo: {} // 货位
      }
    },
    computed: {
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
<style lang="scss">
.table-index {
  @import "src/styles/mixin.scss";
  @include elTable;
}
</style>