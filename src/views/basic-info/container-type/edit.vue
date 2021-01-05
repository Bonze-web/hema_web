<template>
    <div>
        <div class="head" v-if="status === 'create' || status === 'edit'">
            <div style="margin-top:8px" v-if="status === 'create'">新建</div>
            <div style="margin-top:8px" v-else>编辑</div>
            <div>
                <el-button @click="back">取消</el-button>
                <el-button type="primary" @click="createContainerType">确认</el-button>
                <!-- <el-button type="primary" v-if="status === 'create'">确认并创建</el-button> -->
            </div>
        </div>
        <div class="head" v-if="status === 'read'">
            <div class="head-title">
                <div style="margin:8px">{{ '[' + containerTypeInfo.code + ']' + containerTypeInfo.name }}</div>
                <!-- <template>
                    <el-switch
                        v-model="containerTypeInfo.status"
                        @change="statusChange"
                        active-color="#13ce66"
                        inactive-color="#eee">
                    </el-switch>
                </template> -->
                <template>
                  <el-button type="text" @click="statusChange" v-if="containerTypeInfo.status">禁用</el-button>
                  <el-button type="text" @click="statusChange" v-if="!containerTypeInfo.status">启用</el-button>
                </template>
            </div>
            <div>
                <el-button @click="back">返回</el-button>
                <el-button type="primary" @click="editContainerType" v-if="hasPermission(PermIds.WMS_CONTAINER_TYPE_UPDATE) && containerTypeInfo.status">编辑</el-button>
            </div>
        </div>
        <div style="height:20px" />
        <div class="info-content" v-if="status === 'create' || status === 'edit'">
            <div>
                <template>
                    <el-tabs v-model="tabActiveName" @tab-click="tabClick">
                        <el-tab-pane label="容器类型" name="containerType">
                            <el-form :model="form" :rules="createRules" ref="form" label-width="100px" class="demo-ruleForm">
                                <div class="info-title">基本信息</div>
                                <el-row :gutter="20">
                                    <el-col :span="6" class="info-box">
                                        <el-form-item label="代码" prop="code">
                                            <el-input :disabled="containerTypeInfo.code" v-model="form.code"></el-input>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="6" class="info-box">
                                        <el-form-item label="名称" prop="name">
                                            <el-input v-model="form.name"></el-input>
                                        </el-form-item>
                                    </el-col>
                                    <!-- <el-col :span="6" class="info-box">
                                        <el-form-item label="所属仓库" prop="wrhId">
                                            <el-select v-model="form.wrhId" placeholder="请选择所属仓库">
                                              <el-option v-for="item in wrhList" :key="item.id" :label="item.name" :value="item.id"></el-option>
                                            </el-select>
                                        </el-form-item>
                                    </el-col> -->
                                    <el-col :span="6" class="info-box">
                                        <el-form-item label="条码前缀" prop="barcodeprefix">
                                            <el-input v-model="form.barcodeprefix"></el-input>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="6" class="info-box">
                                        <el-form-item label="条码类型" prop="barcodetype">
                                            <el-select v-model="form.barcodetype" placeholder="请选择条码类型">
                                              <el-option label="一次性" value="ONCE"></el-option>
                                              <el-option  label="永久" value="FOREVER"></el-option>
                                            </el-select>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="6" class="info-box">
                                        <el-form-item label="条码长度" prop="barcodelength">
                                            <el-input v-model="form.barcodelength"></el-input>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="6" class="info-box">
                                        <el-form-item label="回收类型" prop="recycletype">
                                            <!-- <el-input v-model="form.recycletype"></el-input> -->
                                            <el-select v-model="form.recycletype" placeholder="请选择回收类型">
                                              <el-option label="按数量" value="BY_QTY"></el-option>
                                              <el-option label="按条码" value="BY_BARCODE"></el-option>
                                            </el-select>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="6" class="info-box">
                                        <el-form-item label="是否随车">
                                            <!-- <el-input v-model="form.shipflage"></el-input> -->
                                            <el-select v-model="form.shipflage" placeholder="请选择是否随车">
                                              <el-option label="是" :value="true"></el-option>
                                              <el-option label="否" :value="false"></el-option>
                                            </el-select>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="6" class="info-box">
                                        <el-form-item label="是否为附件">
                                            <!-- <el-input v-model="form.attachment"></el-input> -->
                                            <el-select v-model="form.attachment" placeholder="请选择是否为附件">
                                              <el-option label="是" :value="true"></el-option>
                                              <el-option label="否" :value="false"></el-option>
                                            </el-select>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                                <el-form-item label="备注">
                                    <textarea v-model="form.remark"></textarea>
                                </el-form-item>
                                <div class="info-title">规格信息</div>
                                <el-row :gutter="20">
                                    <el-col :span="6" class="info-box">
                                        <el-form-item label="内长(cm)" prop="inlength">
                                            <el-input v-model="form.inlength"></el-input>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="6" class="info-box">
                                        <el-form-item label="外长(cm)" prop="outlength">
                                            <el-input v-model="form.outlength"></el-input>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="6" class="info-box">
                                        <el-form-item label="内宽(cm)" prop="inwidth">
                                            <el-input v-model="form.inwidth"></el-input>
                                        </el-form-item>
                                    </el-col>
                                    <!-- <el-col :span="6" class="info-box">
                                        <el-form-item label="货主" prop="name">
                                            <el-input></el-input>
                                        </el-form-item>
                                    </el-col> -->
                                    <el-col :span="6" class="info-box">
                                        <el-form-item label="外宽(cm)" prop="outwidth">
                                            <el-input v-model="form.outwidth"></el-input>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="6" class="info-box">
                                        <el-form-item label="内高(cm)" prop="inheight">
                                            <el-input v-model="form.inheight"></el-input>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="6" class="info-box">
                                        <el-form-item label="外高(cm)" prop="outheight">
                                            <el-input v-model="form.outheight"></el-input>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="6" class="info-box">
                                        <el-form-item label="自重(kg)" prop="weight">
                                            <el-input v-model="form.weight"></el-input>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="6" class="info-box">
                                        <el-form-item label="承重(kg)" prop="bearingweight">
                                            <el-input v-model="form.bearingweight"></el-input>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="6" class="info-box">
                                        <el-form-item label="容积率(%)" prop="plotratio">
                                            <el-input v-model="form.plotratio"></el-input>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
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
                        <el-tab-pane label="容器类型" name="containerType">
                            <div class="info-title">基本信息</div>
                            <el-col :span="6" class="info-box">
                                <div>代码:</div>
                                <div>{{ containerTypeInfo.code }}</div>
                            </el-col>
                            <el-col :span="6" class="info-box">
                                <div>名称:</div>
                                <div>{{ containerTypeInfo.name }}</div>
                            </el-col>
                            <!-- <el-col :span="6" class="info-box">
                                <div>所属仓库:</div>
                                <div>{{ containerTypeInfo.name }}</div>
                            </el-col> -->
                            <el-col :span="6" class="info-box">
                                <div>条码前缀:</div>
                                <div>{{ containerTypeInfo.barcodeprefix }}</div>
                            </el-col>
                            <!-- <el-col :span="6" class="info-box">
                                <div>货主:</div>
                                <div></div>
                            </el-col> -->
                            <el-col :span="6" class="info-box">
                                <div>条码类型:</div>
                                <div>{{ containerTypeInfo.barcodetype | barcodetype }}</div>
                            </el-col>
                            <el-col :span="6" class="info-box">
                                <div>条码长度:</div>
                                <div>{{ containerTypeInfo.barcodelength }}</div>
                            </el-col>
                            <el-col :span="6" class="info-box">
                                <div>回收类型:</div>
                                <div>{{ containerTypeInfo.recycletype | recycletype}}</div>
                            </el-col>
                            <el-col :span="6" class="info-box">
                                <div>随车:</div>
                                <div>{{ containerTypeInfo.shipflage ? "是" : "否" }}</div>
                            </el-col>
                            <el-col :span="6" class="info-box">
                                <div>附件:</div>
                                <div>{{ containerTypeInfo.attachment ? "是" : "否" }}</div>
                            </el-col>
                            <el-col class="info-box" style="margin-bottom:20px">
                                <div style="width:32px">备注:</div>
                                <div>{{ containerTypeInfo.remark ? containerTypeInfo.remark : "&lt;空&gt;" }}</div>
                            </el-col>
                            <el-col>
                              <div class="info-title">规格信息</div>
                            </el-col>
                            <el-col :span="6" class="info-box">
                                <div>内长(cm):</div>
                                <div>{{ containerTypeInfo.inlength }}</div>
                            </el-col>
                            <el-col :span="6" class="info-box">
                                <div>外长(cm):</div>
                                <div>{{ containerTypeInfo.outlength }}</div>
                            </el-col>
                            <el-col :span="6" class="info-box">
                                <div>内宽(cm):</div>
                                <div>{{ containerTypeInfo.inwidth }}</div>
                            </el-col>
                            <el-col :span="6" class="info-box">
                                <div>外宽(cm):</div>
                                <div>{{ containerTypeInfo.outwidth }}</div>
                            </el-col>
                            <el-col :span="6" class="info-box">
                                <div>内高(cm):</div>
                                <div>{{ containerTypeInfo.inheight }}</div>
                            </el-col>
                            <el-col :span="6" class="info-box">
                                <div>外高(cm):</div>
                                <div>{{ containerTypeInfo.outheight }}</div>
                            </el-col>
                            <el-col :span="6" class="info-box">
                                <div>自重(kg):</div>
                                <div>{{ containerTypeInfo.weight }}</div>
                            </el-col>
                            <el-col :span="6" class="info-box">
                                <div>承重(kg):</div>
                                <div>{{ containerTypeInfo.bearingweight }}</div>
                            </el-col>
                            <el-col :span="6" class="info-box">
                                <div>容积率(%):</div>
                                <div>{{ containerTypeInfo.plotratio }}</div>
                            </el-col>
                        </el-tab-pane>
                        <!-- <el-tab-pane label="配送中心范围" name="range">配置管理</el-tab-pane> -->
                        <el-tab-pane label="操作日志" name="log">
                          <system-log modular="CONTAINERTYPE" :id="id"></system-log>
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
import StorageService from "@/api/service/StorageService";
import systemLog from "@/components/systemLog.vue";

export default {
  data() {
      return {
        wrhList: [],
        PermIds: PermIds,
        status: '', // 页面状态
        id: '', // 供应商ID
        tabActiveName: 'containerType', // tab栏名称
        form: {
          id: '',
          code: '',
          name: '',
          barcodeprefix: '', // 条码前缀
          barcodetype: 'FOREVER', // 条码类型
          barcodelength: '', // 条码长度
          recycletype: 'BY_QTY', // 回收类型
          shipflage: '', // 是否随车
          attachment: '', // 是否为附件
          inlength: '', // 内长
          outlength: '',
          inwidth: '', // 内宽
          outwidth: '',
          inheight: '', // 内高
          outheight: '',
          bearingweight: '', // 承重
          plotratio: '', // 容积率
          weight: '', // 自重
          remark: '',
          version: ''
          // wrhId: ''
        },
        containerTypeInfo: {}, // 供应商信息
        createRules: {
          code: [
            { required: true, message: '请输入代码', trigger: 'blur' },
            { required: true, max: 32, message: '最多输入32位', trigger: 'change' }
          ],
          name: [
            { required: true, message: '请输入名称', trigger: 'blur' },
            { required: true, max: 32, message: '最多输入32位', trigger: 'change' }
          ],
          // wrhId: [
          //   { required: true, message: '请选择所属仓库', trigger: 'blur' }
          // ],
          barcodeprefix: [
            { required: true, message: '请输入联系方式', trigger: 'blur' },
            { required: true, pattern: /^[A-Z0-9]{0,2}$/, message: '请输入最多两位的数字和大写字母的组合', trigger: 'change' }
          ],
          barcodetype: [
            { required: true, message: '请选择条码类型', trigger: 'blur' }
          ],
          barcodelength: [
            { required: true, pattern: /^(7|([7-9]?)|10)$/, message: '请输入7-10之间的数字', trigger: 'change' }
          ],
          recycletype: [
            { required: true, message: '请选择回收类型', trigger: 'blur' }
          ],
          inlength: [
            { required: true, message: '请输入内长', trigger: 'blur' },
            { pattern: /^\d{1,6}(\.\d+)?$/, message: '请输入1-999999之间的数字', trigger: 'change' }
          ],
          outlength: [
            { required: true, message: '请输入外长', trigger: 'blur' },
            { pattern: /^\d{1,6}(\.\d+)?$/, message: '请输入1-999999之间的数字', trigger: 'change' }
          ],
          inwidth: [
            { required: true, message: '请输入内宽', trigger: 'blur' },
            { pattern: /^\d{1,6}(\.\d+)?$/, message: '请输入1-999999之间的数字', trigger: 'change' }
          ],
          outwidth: [
            { required: true, message: '请输入外宽', trigger: 'blur' },
            { pattern: /^\d{1,6}(\.\d+)?$/, message: '请输入1-999999之间的数字', trigger: 'change' }
          ],
          inheight: [
            { required: true, message: '请输入内高', trigger: 'blur' },
            { pattern: /^\d{1,6}(\.\d+)?$/, message: '请输入1-999999之间的数字', trigger: 'change' }
          ],
          outheight: [
            { required: true, message: '请输入外高', trigger: 'blur' },
            { pattern: /^\d{1,6}(\.\d+)?$/, message: '请输入1-999999之间的数字', trigger: 'change' }
          ],
          weight: [
            { required: true, message: '请输入自重', trigger: 'blur' },
            { pattern: /^\d{1,6}(\.\d+)?$/, message: '请输入1-999999之间的数字', trigger: 'change' }
          ],
          plotratio: [
            { required: true, message: '请输入容积率', trigger: 'blur' },
            { pattern: /^100$|^(\d|[1-9]\d)(\.\d+)*$/, message: '请输入1-100之间的数字', trigger: 'change' }
          ],
          bearingweight: [
            { required: true, message: '请输入承重', trigger: 'blur' },
            { pattern: /^\d{1,6}(\.\d+)?$/, message: '请输入1-999999之间的数字', trigger: 'change' }
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
        this.$router.go(-1)
      },
      statusChange: function() {
        // 修改供应商状态
        const _this = this
        this.$confirm('此操作将改变供应商状态, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          const data = [{
            id: _this.id,
            version: _this.containerTypeInfo.version
          }]
          if (_this.containerTypeInfo.status) {
          BasicService.closeContainerType(data)
          .then((res) => {
            _this.$message.success("禁用成功")
            _this.getContainerTypeDetail(_this.id)
          })
          .catch((err) => {
            _this.$message.error("禁用失败" + err.message)
            _this.getContainerTypeDetail(_this.id)
          })
        } else {
          BasicService.openContainerType(data)
          .then((res) => {
            _this.$message.success("启用成功")
            _this.getContainerTypeDetail(_this.id)
          })
          .catch((err) => {
            _this.$message.error("启用失败" + err.message)
            _this.getContainerTypeDetail(_this.id)
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
          this.id = this.$route.query.id
          this.getContainerTypeDetail(this.id)
        }
      },
      getContainerTypeDetail: function(id) {
        // 获取容器类型详情
        BasicService.getContainerTypeDetail(id)
        .then((res) => {
          this.containerTypeInfo = res
          // 根据状态修改
          // if (this.containerTypeInfo.shipflage) {
          //   this.containerTypeInfo.shipflage = "true"
          // } else {
          //   this.containerTypeInfo.shipflage = "false"
          // }
          if (this.containerTypeInfo.status === "ON") {
            this.containerTypeInfo.status = true
          } else {
            this.containerTypeInfo.status = false
          }
        })
        .catch((err) => {
          this.$message.error("获取详情失败" + err.message)
        })
      },
      tabClick: function() {  
      },
      getWrhQuery: function() {
      const data = {
        page: 1,
        pageSize: 0
      }
      StorageService.warehouseInit(data)
      .then((res) => {
        this.wrhList = res.records
      })
      .catch((err) => {
        this.$message('获取仓库列表失败' + err.message)
      })
    },
      createContainerType: function() {
        // 创建新的供应商
        this.$refs.form.validate(valid => {
          if (valid) {
            if (this.status === 'create') {
              BasicService.createContainerType(this.form)
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
              if (!(Number(this.form.inlength) <= Number(this.form.outlength))) {
                this.$message.error('容器内长需要小于等于外长，请检查')
                return
              }
              if (!(Number(this.form.inwidth) <= Number(this.form.outwidth))) {
                this.$message.error('容器内宽需要小于等于外宽，请检查')
                return
              }
              if (!(Number(this.form.inheight) <= Number(this.form.outheight))) {
                this.$message.error('容器内高需要小于等于外高，请检查')
                return
              }
              BasicService.updateContainerType(this.form)
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
      editContainerType() {
        this.status = "edit"
        this.form = Object.assign(this.form, this.containerTypeInfo)
        console.log(this.form)
      }
    },
    created() {
      this.getQueryStatus()
      this.getWrhQuery()
    },
    // beforeRouteEnter(to, from, next) {
    //   next(vm => {
    //     // 通过 `vm` 访问组件实例
    //     vm.getQueryStatus();
    //   })
    // },
    filters: {
      recycletype(type) {
        switch (type) {
          case "BY_QTY":
            return "按数量"
          case "BY_BARCODE":
            return "按条码"
          default:
            return "未知"
        }
      },
      barcodetype(type) {
        switch (type) {
          case "ONCE":
            return "一次性"
          case "FOREVER":
            return "永久"
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
