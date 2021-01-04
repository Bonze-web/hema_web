<template>
    <div>
        <div class="head" v-if="status === 'create' || status === 'edit'">
            <div style="margin-top:8px" v-if="status === 'create'">新建商品类别</div>
            <div style="margin-top:8px" v-else>编辑</div>
            <div>
                <el-button @click="back">取消</el-button>
                <el-button type="primary" @click="createCategory">确认</el-button>
                <!-- <el-button type="primary" v-if="status === 'create'">确认并创建</el-button> -->
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
                                        <el-form-item label="级别" prop="level">
                                            <el-select v-model="form.level" placeholder="请选择级别" @change="levelChange">
                                                <el-option label="一级" value="one"></el-option>
                                                <el-option label="二级" value="two"></el-option>
                                                <el-option label="三级" value="three"></el-option>
                                                <el-option label="四级" value="four"></el-option>
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
                                    <textarea maxlength="128" v-model="form.remark"></textarea>
                                </el-form-item>
                            </el-form>
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
            { required: true, message: '请输入类别代码', trigger: 'blur' },
            { max: 20, message: '输入的字符不允许超过20', trigger: 'blur' }
          ],
          name: [
            { required: true, message: '请输入类别名称', trigger: 'blur' },
            { max: 20, message: '输入的字符不允许超过20', trigger: 'blur' }
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
        this.$store.dispatch("tagsView/delView", this.$route);
        this.$router.go(-1)
      },
      statusChange: function() {
        // 修改供应商状态
        const _this = this
        this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          if (_this.categoryInfo.status) {
          BasicService.closeCategory(_this.categoryInfo.id, _this.categoryInfo.version)
          .then((res) => {
            _this.$message.success("禁用成功")
            _this.getCategory(_this.id)
          })
          .catch((err) => {
            _this.$message.error("禁用失败" + err.message)
            _this.getCategory(_this.id)
          })
        } else {
          BasicService.openCategory(_this.categoryInfo.id, _this.categoryInfo.version)
          .then((res) => {
            _this.$message.success("启用成功")
            _this.getCategory(_this.id)
          })
          .catch((err) => {
            _this.$message.error("启用失败" + err.message)
            _this.getCategory(_this.id)
          })
        }
        })
      },
      getQueryStatus: function() {
        this.status = this.$route.query.status
        if (this.status === 'read') {
          this.id = this.$route.query.id
        }
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
              BasicService.createCategory(this.form)
              .then(res => {
                console.log(res)
                this.$message.success("创建成功")
                this.$store.dispatch("tagsView/delView", this.$route);
                this.$router.go(-1)
              })
              .catch(err => {
                this.$message.error("创建失败" + err.message)
              })
            } else {
              if (this.form.status) {
                this.form.status = "ON"
              } else {
                this.form.status = "OFF"
              }
              BasicService.updateCategory(this.form)
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
          } else {
            console.log(2)
          }
        })
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
          lowerLevelEquals: this.form.level,
          statusEquals: 'ON'
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
            this.$message.error("加载父级列表失败，请刷新页面重新尝试" + err.message)
        })
      }
    },
    created() {
      this.getQueryStatus()
    },
    // beforeRouteEnter(to, from, next) {
    //   next(vm => {
    //     // 通过 `vm` 访问组件实例
    //     vm.getQueryStatus();
    //   })
    // },
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
