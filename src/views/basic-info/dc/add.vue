<template>
    <div>
        <div class="head" v-if="status === 'create' || status === 'edit'">
            <div style="margin-top:8px" v-if="status === 'create'">新建物流中心</div>
            <div style="margin-top:8px" v-else>编辑</div>
            <div>
                <el-button @click="back">取消</el-button>
                <el-button type="primary" @click="createDc">确认</el-button>
                <!-- <el-button type="primary" v-if="status === 'create'">确认并创建</el-button> -->
            </div>
        </div>
        <div style="height:20px" />
        <div class="info-content" v-if="status === 'create' || status === 'edit'">
            <div>
                <template>
                    <el-tabs v-model="tabActiveName" @tab-click="tabClick">
                        <el-tab-pane label="物流中心" name="dc">
                            <div class="info-title">基本信息</div>
                            <el-form :model="form" :rules="createRules" ref="form" label-width="100px" class="demo-ruleForm">
                                <el-row :gutter="20">
                                    <el-col :span="6" class="info-box">
                                        <el-form-item label="类型" prop="type">
                                          <el-select v-model="form.type" placeholder="请选择类型" @change="getDcCenter">
                                            <el-option label="中心仓" value="CENTER"></el-option>
                                            <el-option label="网格仓" value="FRONT"></el-option>
                                          </el-select>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="6" class="info-box" v-if="form.type === 'FRONT'">
                                        <el-form-item label="所属仓库" prop="type">
                                          <el-select v-model="form.dcId" placeholder="请选择仓库">
                                            <el-option v-for="item in dcList" :key="item.id" :label="'[' + item.code + ']' + item.name" :value="item.id"></el-option>
                                          </el-select>
                                        </el-form-item>
                                    </el-col>
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
                                        <el-form-item label="来源代码">
                                            <el-input v-model="form.sourceCode"></el-input>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="6" class="info-box">
                                        <el-form-item label="简称">
                                            <el-input v-model="form.shortName"></el-input>
                                        </el-form-item>
                                    </el-col>
                                    <!-- <el-col :span="6" class="info-box">
                                        <el-form-item label="货主" prop="name">
                                            <el-input></el-input>
                                        </el-form-item>
                                    </el-col> -->
                                    <el-col :span="6" class="info-box">
                                        <el-form-item label="联系人" prop="contactor">
                                            <el-input v-model="form.contactor"></el-input>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="6" class="info-box">
                                        <el-form-item label="联系方式" prop="contactPhone">
                                            <el-input v-model="form.contactPhone"></el-input>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="6" class="info-box">
                                        <el-form-item label="地址" prop="address">
                                            <el-input v-model="form.address"></el-input>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="6" class="info-box">
                                        <el-form-item label="经营面积(m2)">
                                            <el-input @change="areaChange" type="number" placeholder="0.000" v-model="form.operatingArea"></el-input>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="6" class="info-box">
                                        <el-form-item label="邮编">
                                            <el-input v-model="form.zipCode"></el-input>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="6" class="info-box">
                                        <el-form-item label="主体码">
                                            <el-input v-model="form.subjectCode"></el-input>
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
    </div>
</template>

<script>
// import { mapGetters } from "vuex";
import BasicService from "@/api/service/BasicService";

export default {
  data() {
      return {
        dcList: [], // 中心仓列表
        status: '', // 页面状态
        id: '', // 配送中心ID
        tabActiveName: 'dc', // tab栏名称
        form: {
          id: '',
          code: '',
          name: '',
          dcId: '',
          dcName: '',
          type: '',
          sourceCode: '',
          shortName: '',
          contactor: '',
          contactPhone: '',
          address: '',
          operatingArea: '',
          zipCode: '',
          subjectCode: '',
          remark: '',
          version: ''
        },
        dcInfo: {}, // 配送中心信息
        createRules: {
          code: [
            { required: true, message: '请输入类别代码', trigger: 'blur' }
          ],
          name: [
            { required: true, message: '请输入供应商名称', trigger: 'blur' }
          ],
          contactPhone: [
            { required: true, message: '请输入联系方式', trigger: 'blur' },
            { required: true, pattern: /^[1-9]\d{10}$/, message: '请输入正确的手机号格式', trigger: 'blur' }
          ],
          contactor: [
            { required: true, message: '请输入联系人名称', trigger: 'blur' }
          ],
          address: [
            { required: true, message: '请输入地址', trigger: 'blur' }
          ],
          type: [
            { required: true, message: '请选择配送中心类型', trigger: 'blur' }
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
      areaChange: function() {
        if (!this.form.operatingArea) {
          return
        }
        this.form.operatingArea = Number(this.form.operatingArea).toFixed(3)
      },
      statusChange: function() {
        // 修改仓库状态
        const self = this
        this.$confirm('此操作将改变物流中心仓库状态, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          if (self.dcInfo.status) {
          BasicService.closeDc(self.id)
          .then((res) => {
            self.$message.success("禁用成功")
            self.getDc(self.id)
          })
          .catch((err) => {
            self.$message.error("禁用失败" + err)
            self.getDc(self.id)
          })
        } else {
          BasicService.openDc(self.id)
          .then((res) => {
            self.$message.success("启用成功")
            self.getDc(self.id)
          })
          .catch((err) => {
            self.$message.error("启用失败" + err)
            self.getDc(self.id)
          })
        }
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        })
      },
      getQueryStatus: function() {
        this.status = this.$route.query.status
        if (this.status === 'read') {
          this.id = this.$route.query.id
          this.getDc(this.id)
        }
      },
      getDcCenter: function() {
        // 获取所有中心仓
        // const _this = this
        const data = {
          page: this.page,
          pageSize: 0,
          searchCount: true,
          typeEquals: "CENTER"
        }
        BasicService.getWrhQuery(data)
        .then((res) => {
          this.dcList = res.records
        })
      },
      tabClick: function() {  
      },
      createDc: function() {
        // 创建新的供应商
        this.$refs.form.validate(valid => {
          if (valid) {
            // 判断创建和更新
            if (this.status === 'create') {
              BasicService.creatDc(this.form)
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
                this.form.status = "ON"
              } else {
                this.form.status = "OFF"
              }
              BasicService.updateDc(this.form)
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
      }
    },
    created() {
      this.getQueryStatus()
    },
    filters: {
      dcType(type) {
        switch (type) {
          case 'CENTER':
            return "中心仓"
          case 'FRONT':
            return "前置仓"
          default:
            return "未知"
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
