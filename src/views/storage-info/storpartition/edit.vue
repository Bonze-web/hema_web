<template>
    <div>
        <div class="head" v-if="status === 'create' || status === 'edit'">
            <div style="margin-top:8px" v-if="status === 'create'">新建存储分区</div>
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
            </div>
            <div>
                <el-button @click="back">返回</el-button>
                <el-button type="primary" @click="editSupplier" v-if="hasPermission(PermIds.WMS_STORAGEAREA_UPDATE)">编辑</el-button>
            </div>
        </div>
        <div style="height:20px" />
        <div class="info-content" v-if="status === 'create' || status === 'edit'">
            <div>
                <template>
                    <el-tabs v-model="tabActiveName">
                        <el-tab-pane label="存储分区" name="suppliers">
                            <div class="info-title">基本信息</div>
                             <el-form :model="form" :rules="createRules" ref="form" label-width="100px" class="demo-ruleForm">
                                <el-row :gutter="20">
                                    <el-col :span="6" class="info-box">
                                        <el-form-item label="代码" prop="code">
                                            <el-input v-model="form.code" maxlength="32"></el-input>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="6" class="info-box">
                                        <el-form-item label="名称" prop="name">
                                            <el-input v-model="form.name" maxlength="32"></el-input>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="6" class="info-box">
                                        <el-form-item label="货位范围" prop="binScope">
                                            <el-input v-model="form.binScope" maxlength="256"></el-input>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                            </el-form>
                        </el-tab-pane>
                    </el-tabs>
                </template>
            </div>
        </div>
        <div class="info-content" v-if="status === 'read'">
            <div>
                <template>
                    <el-tabs v-model="tabActiveName">
                        <el-tab-pane label="存储分区" name="suppliers">
                            <div class="info-title">基本信息</div>
                            <el-col :span="6" class="info-box">
                                <div>代码:</div>
                                <div>{{ suppliersInfo.code }}</div>
                            </el-col>
                            <el-col :span="6" class="info-box">
                                <div>名称:</div>
                                <div>{{ suppliersInfo.name }}</div>
                            </el-col>
                            <el-col :span="6" class="info-box">
                                <div>货位范围:</div>
                                <div>{{ suppliersInfo.binScope }}</div>
                            </el-col>
                        </el-tab-pane>
                        <el-tab-pane label="操作日志" name="operational">
                            <system-log :modular="'STORAGEAREA'" :id="id"></system-log>
                        </el-tab-pane>
                    </el-tabs>
                </template>
            </div>
        </div>
    </div>
</template>

<script>
// import { mapGetters } from "vuex";
import StorpartitionService from "@/api/service/StorpartitionService";
import PermIds from "@/api/permissionIds";
import { mapGetters } from "vuex";
import systemLog from "@/components/systemLog.vue"

export default {
  data() {
      return {
        PermIds: PermIds,
        status: '', // 页面状态
        id: '', 
        tabActiveName: 'suppliers', // tab栏名
        materials: [],
        form: {
          code: '',
          name: '',
          binScope: ''
        },
        suppliersInfo: {}, 
        createRules: {
          code: [
            { required: true, message: '请输入代码', trigger: 'blur' }
          ],
          name: [
            { required: true, message: '请输入码头名称', trigger: 'blur' }
          ],
          binScope: [
            { required: true, message: '请填写货位范围', trigger: 'blur' },
            { required: true, pattern: /^(([0-9a-zA-Z]+[-]+[0-9a-zA-Z]+){0,256}[0-9a-zA-Z]{0,256}([(]+[0-9]+\/[0-9]+[)]+)?[,]?[0-9a-zA-Z]{0,256}[,]?){0,256}$/, message: '格式10、10(1/2)、10-20，多个以逗号隔开', trigger: 'blur' }
          ]
        }
      }
    },
    computed: {
      ...mapGetters(["hasPermission", "workingOrg"])
    },
    components: {
      "system-log": systemLog
    },
    methods: {
      levelChange() {
        console.log(this.form)
      },
      back: function() {
        this.$store.dispatch("tagsView/delView", this.$route);
        this.$router.go(-1)
      },
      statusChange: function() {
        // 这个地方是已经点击了之后传过来的值,本来是打开的,点击之后已经成了false传递到这里,所以应该执行关闭键
        // 当状态为关闭的时候,点击的时候应该是让它打开
        if (!this.suppliersInfo.status) {
          // 修改状态,将id传过去就可以
          StorpartitionService.closeSuppliers(this.id)      
          .then((res) => {
            this.getSuppliers(this.id)    
          })
          .catch((err) => {
            this.$message.error("禁用失败" + err)
            this.getSuppliers(this.id)
          })
        } else {
           StorpartitionService.openSuppliers(this.id)
            .then((res) => {
              this.getSuppliers(this.id)
            })
            .catch((err) => {
              this.$message.error("启用失败" + err)
              this.getSuppliers(this.id)
            })
        }
      },
      // 详情页面
      // 这个地方用来获取到之前那个页面传递过来的数据,也就是id和状态
      getQueryStatus: function() {
        this.status = this.$route.query.status
        if (this.status === 'read') {
          // 如果是编辑的话,还要将id传递过来
          this.id = this.$route.query.id;
          this.getSuppliers(this.id)
        }
      },
      // 渲染,下面这个也是修改禁用于开启的接口调用
      getSuppliers: function(id) {
        StorpartitionService.getSuppliersDetail(id)
        .then((res) => {
          console.log(res);
          this.suppliersInfo = res;
        })
        .catch((err) => {
          this.$message.error("获取详情失败" + err)
        })
      },
      createSuppliers: function() {
        this.$refs.form.validate(valid => {
          if (valid) {
            if (this.status === 'create') {
              // 创建验证货位范围
              // const reg = /^([1-9a-zA-Z]{1,256})$|^([1-9a-zA-Z]{1,256}[,]+[1-9a-zA-Z]{1,256})$|^([1-9a-zA-Z]{1,256}[-]+[1-9a-zA-Z]{1,256})$|^([1-9a-zA-Z]{1,256}[(]+[1-9]+\/[1-9]+[)]+)$/;
              // if (!reg.test(this.form.binScope)) {
              //   this.$message.error("满足格式10、10(1/2)、10-20，多个以逗号隔开");
              //   return false;
              // }
              StorpartitionService.createSuppliers(this.form)
              .then(res => {
                this.$message.success("创建成功")
                this.$router.go(-1)
              })
              .catch(err => {
                console.log(err);
                this.$message.error("创建失败" + err)
              })
            } else {
              // 因为提交的时候,需要传递状态值,所以先转换一下,这里是编辑
              StorpartitionService.updateSupplier(this.form)
              .then(res => {
                console.log(res)
                this.$message.success("更新成功")
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
      // 详情页面跳转到编辑页面
      editSupplier() {
        this.status = "edit"
        // 这个form肯定就是编辑页面的数据,suppliersInfo是前一个页面传递过来的数据
        // 传递的是form是用户填写的数据
        this.form = Object.assign(this.form, this.suppliersInfo)
      }
    },
    created() {
      this.getQueryStatus();
      // const _this = this;
      // StorpartitionService.getdcdata().then(function(res) {
      //   res.records.forEach(function(ele, idx) {
      //      _this.materials.push({
      //         name: ele.name,
      //         id: ele.id
      //      })
      //   })
      // })
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
    margin: 4px 0;
    font-size: 12px;
    display: flex;
    justify-content: left;
}
.info-title{
    margin: 12px 0;
}
</style>
