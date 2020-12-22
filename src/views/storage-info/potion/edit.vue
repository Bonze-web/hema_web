<template>
    <div>
        <div class="head" v-if="status === 'create' || status === 'edit'">
            <div style="margin-top:8px" v-if="status === 'create'">新建类别</div>
            <div style="margin-top:8px" v-else>编辑</div>
            <div>
                <el-button @click="back">取消</el-button>
                <el-button type="primary" @click="createCategory">确认</el-button>
                <!-- <el-button type="primary" v-if="status === 'create'">确认并创建</el-button> -->
            </div>
        </div>
        <div class="head" v-if="status === 'read'">
            <div class="head-title">
                <div style="margin-right:8px">{{ '[' + categoryInfo.code + ']' + categoryInfo.name }}</div>
                <template>
                    <el-switch
                        v-model="categoryInfo.status"
                        @change="statusChange"
                        active-color="#13ce66"
                        inactive-color="#eee">
                    </el-switch>
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
                        <el-tab-pane label="商品类别" name="category">
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
                                        <el-form-item label="配送中心" prop="level">
                                            <el-select v-model="form.level" placeholder="情选择配送中心" @change="levelChange">
                                                <el-option label="配送中心一级" value="one"></el-option>
                                                <el-option label="配送中心二级" value="two"></el-option>
                                                <el-option label="配送中心三级" value="three"></el-option>
                                                <el-option label="配送中心四级" value="four "></el-option>
                                            </el-select>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="6" class="info-box" v-if="level !== 'one'">
                                        <el-form-item label="上级类别">
                                            <el-select v-model="form.parentId">
                                                <el-option v-for="item in parentList" :key="item.value" :label="item.name" :value="item.id"></el-option>
                                            </el-select>
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
                        <el-tab-pane label="商品类别" name="category">
                            <div class="info-title">基本信息</div>
                            <el-col :span="6" class="info-box">
                                <div>代码:</div>
                                <div>{{ categoryInfo.code }}</div>
                            </el-col>
                            <el-col :span="6" class="info-box">
                                <div>名称:</div>
                                <div>{{ categoryInfo.name }}</div>
                            </el-col>
                            <el-col :span="6" class="info-box">
                                <div>级别:</div>
                                <div>{{ categoryInfo.level | categoryLevel }}</div>
                            </el-col>
                            <!-- <el-col :span="6" class="info-box">
                                <div>货主:</div>
                                <div></div>
                            </el-col> -->
                            <el-col :span="6" class="info-box">
                                <div>上级类别:</div>
                                <div>{{ categoryInfo.parentName ? categoryInfo.parentName : "&lt;空&gt;" }}</div>
                            </el-col>
                            <el-col class="info-box">
                                <div>备注:</div>
                                <div>{{ categoryInfo.remark ? categoryInfo.remark : "&lt;空&gt;" }}</div>
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
        parentList: [], // 父级类别列表
        level: "one", // 新建类别级别
        status: '', // 页面状态
        id: '', // 商品类别ID
        tabActiveName: 'category', // tab栏名称
        form: {
          id: '',
          code: '',
          name: '',
          level: 'one',
          parentId: '',
          remark: ''
        },
        page: 0,
        pageSize: 10,
        categoryInfo: {}, // 供应商信息
        createRules: {
          code: [
            { required: true, message: '请输入类别代码', trigger: 'blur' }
          ],
          name: [
            { required: true, message: '请输入类别名称', trigger: 'blur' }
          ],
          level: [
            { required: true, message: '请选择类别级别', trigger: 'blur' }
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
        console.log(this.categoryInfo.status)
        if (!this.categoryInfo.status) {
          BasicService.closeSuppliers(this.id)
          .then((res) => {
            this.getCategory(this.id)
          })
          .catch((err) => {
            this.$message.error("禁用失败" + err)
          })
        } else {
          BasicService.openSuppliers(this.id)
          .then((res) => {
            this.getCategory(this.id)
          })
          .catch((err) => {
            this.$message.error("启用失败" + err)
          })
        }
      },
      getQueryStatus: function() {
        this.status = this.$route.query.status

        if (this.status === 'read') {
          this.id = this.$route.query.id;

          this.getCategory(this.id)
        }
      },
      getCategory: function(id) {
        console.log(id)
      },
      getDc: function(id) {
        // 获取商品类别详情
        BasicService.getCategoryDatail(id)
        .then((res) => {
          this.categoryInfo = res
          // 根据状态修改供应商开启switch
          if (this.categoryInfo.status === "enabled") {
            this.categoryInfo.status = true
          } else {
            this.categoryInfo.status = false
          }
          if (res.level !== "one") {
            this.level = res.level
          }
        })
        .catch((err) => {
          this.$message.error("获取详情失败" + err)
        })
      },
      tabClick: function() {  
      },
      createCategory: function() {
        // 创建新的类别
        this.$refs.form.validate(valid => {
          if (valid) {
            if (this.level !== 'one' && !this.form.parentId) {
              this.$message.error("请选择一个父级类别")
              return
            }
            if (this.status === 'create') {
              console.log(this.form)
              BasicService.createCategory(this.form)
              .then(res => {
                console.log(res)
                this.$message.success("创建成功")
                this.$router.go(-1)
              })
              .catch(err => {
                this.$message.error("创建失败" + err)
              })
            } else {
              if (this.form.status) {
                this.form.status = "enabled"
              } else {
                this.form.status = "disabled"
              }
              BasicService.updateCategory(this.form)
              .then(res => {
                console.log(res)
                this.$message.success("更新成功")
                this.$router.go(-1)
              })
              .catch(err => {
                this.$message.error("更新失败" + err)
              })
            }
          } else {
            console.log(2)
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
        if (this.form.level === "one") {
          return
        }
        this.form.parentId = ""
        this.getParentCategory()
      },
      getParentCategory() {
        const data = {
          page: this.page,
          pageSize: 0,
          lowerLevelEquals: this.form.level
        }
        BasicService.getCateGoryQuery(data)
        .then((res) => {
          this.parentList = res.records
          for (const item in res.records) {
            // 处理供应商数据
            this.parentList[item].name = '[' + this.parentList[item].code + ']' + this.parentList[item].name
          }
        })
        .catch((err) => {
            this.$message.error("加载父级列表失败，请刷新页面重新尝试" + err)
        })
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
