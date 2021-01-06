<template>
    <div>
        <div class="head" v-if="status === 'create' || status === 'edit'">
            <div style="margin-top:8px" v-if="status === 'create'">新建仓区</div>
            <div style="margin-top:8px" v-else>编辑</div>
            <div>
                <el-button @click="back">取消</el-button>
                <el-button type="primary" @click="createCategory">确认</el-button>
                <!-- <el-button type="primary" v-if="status === 'create'">确认并创建</el-button> -->
            </div>
        </div>
        <div class="head" v-if="status === 'read'">
            <div class="head-title">
                <div style="margin:8px">{{ '[' + warehouseInfo.code + ']' + warehouseInfo.name }}</div>
                <!-- <template>
                    <el-switch
                        v-model="warehouseInfo.status"
                        @change="statusChange"
                        active-color="#13ce66"
                        inactive-color="#eee">
                    </el-switch>
                </template> -->
                <template>
                  <el-button type="text" @click="statusChange" v-if="warehouseInfo.status">禁用</el-button>
                  <el-button type="text" @click="statusChange" v-if="!warehouseInfo.status">启用</el-button>
                </template>
            </div>
            <div>
                <el-button @click="back">返回</el-button>
                <el-button type="primary" @click="editCategory">编辑</el-button>
            </div>
        </div>
        <div style="height:20px" />

        <div class="info-content" v-if="status === 'create' || status === 'edit'">
            <div>
                <template>
                    <el-tabs v-model="tabActiveName" @tab-click="tabClick">
                        <el-tab-pane label="仓区" name="category">
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
                                        <el-form-item label="物流中心" prop="dcId">
                                          <el-select v-model="form.dcId" placeholder="请选择物流中心" @change="levelChange">
                                            <el-option v-for="(item, index) in records" :key="index" :label="item.name" :value="item.id"></el-option>
                                          </el-select>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                                <el-form-item label="备注" prop="remark">
                                    <textarea rows="5" v-model="form.remark"></textarea>
                                </el-form-item>
                            </el-form>
                        </el-tab-pane>
                    </el-tabs>
                </template>
            </div>
        </div>

        <div class="info-content" v-if="status === 'read'">
            <div>
                <template>
                    <el-tabs v-model="tabActiveName" @tab-click="tabClick">
                        <el-tab-pane label="仓区" name="category">
                            <div class="info-title">基本信息</div>
                            <el-col :span="6" class="info-box">
                                <div>代码:</div>
                                <div>{{ warehouseInfo.code }}</div>
                            </el-col>
                            <el-col :span="6" class="info-box">
                                <div>名称:</div>
                                <div>{{ warehouseInfo.name }}</div>
                            </el-col>

                            <el-col class="info-box">
                                <div>备注:</div>
                                <div>{{ warehouseInfo.remark ? warehouseInfo.remark : "&lt;空&gt;" }}</div>
                            </el-col>
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
        parentList: [], // 父级类别列表
        level: "one", // 新建类别级别
        status: '', // 页面状态
        id: '', // 仓区ID
        tabActiveName: 'category', // tab栏名称
        form: {
          code: '',
          name: '',
          dcId: '',
          remark: ''
        },
        page: 0,
        pageSize: 10,
        warehouseInfo: {}, // 仓区信息
        createRules: {
          code: [
            { required: true, message: '请输入类别代码', trigger: 'blur' },
            { required: true, max: 16, message: '请输入1到16位字符', trigger: 'change' }
          ],
          name: [
            { required: true, message: '请输入类别名称', trigger: 'blur' },
            { required: true, max: 40, message: '请输入1到4位字符', trigger: 'change' }
          ],
          level: [
            { required: true, message: '请选择类别级别', trigger: 'blur' }
          ]
          // remark: [
          //   { required: true, message: '请输入备注', trigger: 'blur' },
          //   { required: true, max: 200, message: '最多输入200位', trigger: 'change' }
          // ]
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
      statusChange: function() {
        // 修改仓区状态
        const _this = this;
        this.$confirm('此操作将改变仓区状态，是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          if (_this.warehouseInfo.status) {
            // 禁用
            StorageService.closeWarehouse(_this.warehouseInfo.id, _this.warehouseInfo.version)
            .then((res) => {
              _this.$message.success("禁止用成功")
              _this.getCategory(_this.id)
            })
            .catch((err) => {
              _this.$message.error("禁用失败" + err.message)
              _this.getCategory(_this.id)
            })
          } else {
            // 启用
            StorageService.openWarehouse(_this.warehouseInfo.id, _this.warehouseInfo.version)
            .then((res) => {
              _this.$message.success("启用成功")
              _this.getCategory(_this.id)
            })
            .catch((err) => {
              _this.$message.error("启用失败" + err.message)
              _this.getCategory(_this.id)
            })
          }
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

          this.getCategory(this.id)
        }
      },
      getCategory: function(id) {
        StorageService.warehouseDetails(id)
        .then((res) => {
          console.log(res)
          this.warehouseInfo = res;
          // 根据状态修改仓区开启switch
          if (this.warehouseInfo.status === "OFF") {
            this.warehouseInfo.status = true
          } else {
            this.warehouseInfo.status = false
          }

          this.form = this.warehouseInfo;
          // if (res.level !== "one") {
          //   this.level = res.level
          // }
        })
        .catch((err) => {
          this.$message.error("获取详情失败" + err.message)
        })
      },
      tabClick: function() {  
      },
      createCategory: function() {
        // 创建新的仓位
        this.$refs.form.validate(valid => {
          if (valid) {
            if (!this.form.dcId) {
              this.$message.error("请选择一个物流中心")
              return
            }

            if (this.status === 'create') {
              StorageService.createWarehouse(this.form)
              .then(res => {
                this.$message.success("创建成功")
                this.$store.dispatch("tagsView/delView", this.$route);
                this.$router.go(-1)
              })
              .catch(err => {
                this.$message.error("创建失败" + err.message)
              })
            } else {
              if (this.form.status) {
                this.form.status = "OFF"
              } else {
                this.form.status = "OFF"
              }
              StorageService.updateWarehouse(this.form)
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
          }
        })
      },
      editCategory() {
        this.status = "edit"
        this.form = Object.assign(this.form, this.categoryInfo)
        console.log(this.form)
        if (this.level !== "one") {
          this.getParentCategory()
        }
      },
      levelChange() {
        this.level = this.form.level
        console.log(this.form)
      }
    },
    created() {
      this.getQueryStatus()

      StorageService.getDcQuery()
        .then(res => {
          this.records = res.records;
          console.log(this.records)
        }).catch((err) => {
            this.$message.error("获取物流中心失败" + err.message)
        })
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
