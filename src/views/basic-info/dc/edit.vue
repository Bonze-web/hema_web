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
        <div class="head" v-if="status === 'read'">
            <div class="head-title">
                <div style="margin:8px">{{ '[' + dcInfo.code + ']' + dcInfo.name }}</div>
                <!-- <template>
                    <el-switch
                        v-model="dcInfo.status"
                        @change="statusChange"
                        active-color="#13ce66"
                        inactive-color="#eee">
                    </el-switch>
                </template> -->
                <template>
                  <el-button type="text" @click="statusChange" :disabled="!hasPermission(PermIds.SYS_DC_DISABLE)" v-if="dcInfo.status">禁用</el-button>
                  <el-button type="text" @click="statusChange" :disabled="!hasPermission(PermIds.SYS_DC_ENABLE)" v-if="!dcInfo.status">启用</el-button>
                </template>
            </div>
            <div>
                <el-button @click="back">返回</el-button>
                <el-button type="primary" @click="editDc" v-if="hasPermission(PermIds.SYS_DC_UPDATE) && dcInfo.status">编辑</el-button>
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
                                        <el-form-item label="所属仓区" prop="type">
                                          <el-select v-model="form.dcId" placeholder="请选择仓区">
                                            <el-option v-for="item in dcList" :key="item.id" :label="'[' + item.code + ']' + item.name" :value="item.id"></el-option>
                                          </el-select>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="6" class="info-box">
                                        <el-form-item label="代码" prop="code">
                                            <el-input maxlength="16" v-model="form.code"></el-input>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="6" class="info-box">
                                        <el-form-item label="名称" prop="name">
                                            <el-input maxlength="40" v-model="form.name"></el-input>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="6" class="info-box">
                                        <el-form-item label="来源代码">
                                            <el-input maxlength="40" v-model="form.sourceCode"></el-input>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="6" class="info-box">
                                        <el-form-item label="简称">
                                            <el-input maxlength="40" v-model="form.shortName"></el-input>
                                        </el-form-item>
                                    </el-col>
                                    <!-- <el-col :span="6" class="info-box">
                                        <el-form-item label="货主" prop="name">
                                            <el-input></el-input>
                                        </el-form-item>
                                    </el-col> -->
                                    <el-col :span="6" class="info-box">
                                        <el-form-item label="联系人" prop="contactor">
                                            <el-input maxlength="40" v-model="form.contactor"></el-input>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="6" class="info-box">
                                        <el-form-item label="联系方式" prop="contactPhone">
                                            <el-input maxlength="40" v-model="form.contactPhone"></el-input>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="6" class="info-box">
                                        <el-form-item label="地址" prop="address">
                                            <el-input maxlength="100" v-model="form.address"></el-input>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="6" class="info-box">
                                        <el-form-item label="经营面积(㎡)">
                                            <el-input @change="areaChange" type="number" placeholder="0.000" v-model="form.operatingArea"></el-input>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="6" class="info-box">
                                        <el-form-item label="邮编" prop="zipCode">
                                            <el-input maxlength="6" v-model="form.zipCode"></el-input>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="6" class="info-box">
                                        <el-form-item label="主体码">
                                            <el-input maxlength="40" v-model="form.subjectCode"></el-input>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                                <el-form-item label="备注">
                                    <textarea rows="5" maxlength="200" v-model="form.remark"></textarea>
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
                        <el-tab-pane label="物流中心" name="dc">
                            <div class="info-title">基本信息</div>
                            <el-col :span="6" class="info-box">
                                <div>类型:</div>
                                <div>{{ dcInfo.type | dcType }}</div>
                            </el-col>
                            <el-col :span="6" v-if="dcInfo.type === 'FRONT'" class="info-box">
                                <div>所属仓区:</div>
                                <div>{{ dcInfo.dcName }}</div>
                            </el-col>
                            <el-col :span="6" class="info-box">
                                <div>代码:</div>
                                <div>{{ dcInfo.code }}</div>
                            </el-col>
                            <el-col :span="6" class="info-box">
                                <div>名称:</div>
                                <div>{{ dcInfo.name }}</div>
                            </el-col>
                            <el-col :span="6" class="info-box">
                                <div>来源代码:</div>
                                <div>{{ dcInfo.sourceCode ? dcInfo.sourceCode : "&lt;空&gt;" }}</div>
                            </el-col>
                            <el-col :span="6" class="info-box">
                                <div>简称:</div>
                                <div>{{ dcInfo.shortName ? dcInfo.shortName : "&lt;空&gt;" }}</div>
                            </el-col>
                            <!-- <el-col :span="6" class="info-box">
                                <div>货主:</div>
                                <div></div>
                            </el-col> -->
                            <el-col :span="6" class="info-box">
                                <div>联系人:</div>
                                <div>{{ dcInfo.contactor }}</div>
                            </el-col>
                            <el-col :span="6" class="info-box">
                                <div>联系方式:</div>
                                <div>{{ dcInfo.contactPhone }}</div>
                            </el-col>
                            <el-col :span="6" class="info-box">
                                <div>地址:</div>
                                <div>{{ dcInfo.address }}</div>
                            </el-col>
                            <el-col :span="6" class="info-box">
                                <div>经营面积:</div>
                                <div>{{ dcInfo.operatingArea ? dcInfo.operatingArea : "&lt;空&gt;" }}</div>
                            </el-col>
                            <el-col :span="6" class="info-box">
                                <div>邮编:</div>
                                <div>{{ dcInfo.zipCode ? dcInfo.zipCode : "&lt;空&gt;" }}</div>
                            </el-col>
                            <el-col :span="6" class="info-box">
                                <div>主体码:</div>
                                <div>{{ dcInfo.subjectCode ? dcInfo.subjectCode : "&lt;空&gt;" }}</div>
                            </el-col>
                            <el-col class="info-box">
                                <div style="width:32px">备注:</div>
                                <div>{{ dcInfo.remark ? dcInfo.remark : "&lt;空&gt;" }}</div>
                            </el-col>
                        </el-tab-pane>
                        <!-- <el-tab-pane label="配送中心范围" name="range">配置管理</el-tab-pane> -->
                        <el-tab-pane label="操作日志" name="log">
                          <system-log modular="DC" :id="id"></system-log>
                        </el-tab-pane>
                    </el-tabs>
                </template>
            </div>
        </div>
    </div>
</template>

<script>
import PermIds from "@/api/permissionIds";
import { mapGetters } from "vuex";
import BasicService from "@/api/service/BasicService";
import systemLog from "@/components/systemLog.vue";

export default {
  data() {
      return {
        PermIds: PermIds,
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
            { required: true, message: '请输入物流中心名称', trigger: 'blur' }
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
            { required: true, message: '请选择物流中心类型', trigger: 'blur' }
          ],
          zipCode: [
            { pattern: /^[0-9]{6}$/, message: '请输入正确的邮编', trigger: 'blur' }
          ]
        }
      }
    },
    components: {
      systemLog
    },
    computed: {
      ...mapGetters(["hasPermission"])
    },
    methods: {
      back: function() {
        this.$store.dispatch("tagsView/delView", this.$route);
        this.$router.go(-1)
      },
      areaChange: function() {
        if (!this.form.operatingArea) {
          return
        }
        this.form.operatingArea = Number(this.form.operatingArea).toFixed(3)
      },
      statusChange: function() {
        // 修改仓区状态
        const self = this
        this.$confirm('此操作将改变物流中心状态, 是否继续?', '提示', {
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
            self.$message.error("禁用失败" + err.message)
            self.getDc(self.id)
          })
        } else {
          BasicService.openDc(self.id)
          .then((res) => {
            self.$message.success("启用成功")
            self.getDc(self.id)
          })
          .catch((err) => {
            self.$message.error("启用失败" + err.message)
            self.getDc(self.id)
          })
        }
        })
      },
      getQueryStatus: function() {
        this.status = this.$route.query.status
        if (this.status === 'read') {
          this.id = this.$route.query.id
          this.getDc(this.id)
        }
      },
      getDc: function(id) {
        // 获取配送中心详情
        BasicService.getDcDetail(id)
        .then((res) => {
          this.dcInfo = res
          // 根据状态修改
          if (this.dcInfo.status === "ON") {
            this.dcInfo.status = true
          } else {
            this.dcInfo.status = false
          }
        })
        .catch((err) => {
          this.$message.error("获取详情失败" + err.message)
        })
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
              BasicService.updateDc(this.form)
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
      editDc() {
        this.status = "edit"
        this.tabActiveName = 'dc'
        this.form = Object.assign(this.form, this.dcInfo)
        console.log(this.form)
        this.getDcCenter()
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
      dcType(type) {
        switch (type) {
          case 'CENTER':
            return "中心仓"
          case 'FRONT':
            return "网格仓"
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
