<template>
    <div>
        <div class="head">
            <div style="margin-top:8px">新建盘点单</div>
            <div>
                <el-button @click="back">取消</el-button>
                <el-button type="primary" @click="editInventory" v-if="status === 'edit'">编辑</el-button>
                <el-button type="primary" @click="createInventory" v-if="status === 'create'">保存</el-button>
                <el-button type="primary" @click="createInventoryAnd" v-if="status === 'create'">保存并创建</el-button>
            </div>
        </div>
        <div style="height:20px" />
        <div class="info-content">
            <div>
                <template>
                  <el-form :model="form" :rules="createRules" ref="form" label-width="110px" class="demo-ruleForm">
                      <div class="info-title">基本信息</div>
                      <el-row :gutter="20">
                          <el-col :span="6" class="info-box">
                              <el-form-item label="货位范围" prop="binRange">
                                  <el-input type='text' placeholder="请输入单号编号" v-model="form.binRange" class="input-width"></el-input>
                              </el-form-item>
                          </el-col>
                          <el-col :span="6" class="info-box">
                              <el-form-item label="货位用途" prop="binUsage">
                                    <el-select v-model="form.binUsage" placeholder="请选择实盘默认值">
                                    <el-option label="统配收货暂存位" value="UNIFYRECEIVE"></el-option>
                                    <el-option label="上架中转位" value="PUTAWAY"></el-option>
                                    <el-option label="拣货位" value="PICK"></el-option>
                                    <el-option label="存储位" value="STORAGE"></el-option>
                                    <el-option label="拣货存储位" value="PICK_STORAGE"></el-option>
                                    <el-option label="统配拣货暂存位" value="UNIFYPICK"></el-option>
                                    <el-option label="统配集货存储位" value="UNIFYCOLLECT"></el-option>
                                    <el-option label="补货暂存位" value="RPL"></el-option>
                                    <el-option label="中转收货暂存位" value="TRANSFERRECEIVE"></el-option>
                                    <el-option label="中转集货暂存位" value="TRANSFERCOLLECT"></el-option>
                                    <el-option label="直通收货暂存位" value="DIRECTRECEIVE"></el-option>
                                    <el-option label="门店分拨位" value="STORECROSSALLOCATE"></el-option>
                                    <el-option label="门店退货收货暂存位" value="STORERTN"></el-option>
                                    <el-option label="供应商退货位" value="VENDORRTN"></el-option>
                                    <el-option label="供应商集货位" value="VENDORCOLLECT"></el-option>
                                  </el-select>
                              </el-form-item>
                          </el-col>
                          <!-- <el-col :span="6" class="info-box" >
                            <el-form-item label="库存处理方式"  prop="binUsage">
                              <el-select v-model="form.inventoryHandlingMethod" placeholder="请选择库存处理方式">
                                <el-option label="损耗溢余" value="INVENTORY_LOSS_SURPLUS"></el-option>
                                <el-option label="转为移库单" value="MOVE_BILL"></el-option>
                              </el-select>
                            </el-form-item>
                          </el-col> -->
                          <el-col :span="6" class="info-box">
                            <el-form-item label="操作方式"  prop="operationMode">
                              <el-select v-model="form.operationMode" placeholder="请选择操作方式">
                                <el-option label="手工单据" value="MANUALBILL"></el-option>
                                <el-option label="手持终端" value="HANDTERMINAL"></el-option>
                              </el-select>
                            </el-form-item>
                          </el-col>
                      </el-row>
                      <el-row>
                        <el-col :span="6" class="info-box">
                            <el-form-item label="实盘模式"  prop="takeSchema">
                              <el-select v-model="form.takeSchema" placeholder="请选择实盘模式">
                                <el-option label="盲盘" value="BLINDTAKE"></el-option>
                                <el-option label="明盘" value="BRIGHTTAKE"></el-option>
                              </el-select>
                            </el-form-item>
                          </el-col>
                           <el-col :span="6" class="info-box">
                            <el-form-item label="实盘默认值"  prop="realDefaultQuantity">
                              <el-select v-model="form.realDefaultQuantity" placeholder="请选择实盘默认值">
                                <el-option label="按照0处理" value="ZERO"></el-option>
                                <el-option label="按照等同于库存处理" value="EQUAL_INVENTORY"></el-option>
                              </el-select>
                            </el-form-item>
                          </el-col>
                          <el-col :span="6" class="info-box">
                            <el-form-item label="计划盘点日期"  prop="planDate">
                              <el-date-picker
                                v-model="form.planDate"
                                type="date"
                                placeholder="选择计划盘点日期">
                              </el-date-picker>
                            </el-form-item>
                          </el-col>
                      </el-row>
                      <el-form-item label="备注">
                          <textarea maxlength="200" v-model="form.remark"></textarea>
                      </el-form-item>
                  </el-form>      
                </template>
            </div>
        </div>
    </div>
</template>

<script>
import InventoryService from "@/api/service/InventoryService";
// import PermIds from "@/api/permissionIds";
// import { mapGetters, mapActions } from "vuex";

export default {
  data() {
      return {
        dcList: [], // 中心仓列表
        status: '', // 页面状态
        form: {
          binRange: "",
          binUsage: "",
          operationMode: "",
          planDate: "",
          realDefaultQuantity: "",
          takeSchema: ""
        },
        createRules: {
          binRange: [
            { required: true, message: '请填写货位范围', trigger: 'blur'}
          ],
          binUsage: [
            { required: true, message: '请填写货位用途', trigger: 'blur'}
          ],
          operationMode: [
            { required: true, message: '请选择操作方式', trigger: 'blur'}
          ],
          planDate: [
            { required: true, message: '请填写计划盘点日期', trigger: 'blur'}
          ],
          realDefaultQuantity: [
            { required: true, message: '请选择实盘默认值', trigger: 'blur'}
          ],
          takeSchema: [
            { required: true, message: '请选择盘点模式', trigger: 'blur'}
          ]
        }
      }
    },
    methods: {
      geshiChange(date) {
        var d = new Date(date);
        var realMonth = d.getMonth() + 1;
        var h = d.getHours() < 10 ? ('0' + d.getHours()) : d.getHours();
        var m = d.getMinutes() < 10 ? ('0' + d.getMinutes()) : d.getMinutes();
        var s = d.getSeconds() < 10 ? ('0' + d.getSeconds()) : d.getSeconds();
        var M = realMonth < 10 ? ('0' + realMonth) : realMonth;
        var D = d.getDate() < 10 ? ('0' + d.getDate()) : d.getDate();
        var datetime = d.getFullYear() + '-' + M + '-' + D + ' ' + h + ':' + m + ':' + s;
        return datetime;
      },
      back: function() {
        this.$store.dispatch("tagsView/delView", this.$route);
        this.$router.go(-1)
      },
      createInventory() {
        // this.$router.push({name: 'InventoryEdit'});
        this.form.planDate = this.geshiChange(this.form.planDate);
        InventoryService.createLossBill(this.form)
        .then((res) => {
          this.$message.success("创建成功");
          this.$store.dispatch("tagsView/delView", this.$route);
          console.log(res);
          this.$router.push({name: 'InventoryEdit', query: {id: res}});
        }).catch((err) => {
          this.$message.error("创建失败" + err.message)
        })
      },
      createInventoryAnd() {
        InventoryService.createLossBill(this.form)
        .then((res) => {
          this.$message.success("创建成功");
          this.form = {
            binRange: "",
            binUsage: "",
            // inventoryHandlingMethod: "",
            operationMode: "",
            planDate: "",
            realDefaultQuantity: "",
            takeSchema: ""
          }
        }).catch((err) => {
          this.$message.error("创建失败" + err.message)
        })
      },
      editInventory() {
        this.form.planDate = this.geshiChange(this.form.planDate);
        InventoryService.updateLossBill(this.form)
        .then((res) => {
          this.$message.success("修改成功");
        }).catch((err) => {
          this.$message.error("创建失败" + err.message)
        })
      }
    },
    created() {
        this.status = this.$route.query.status;
        if (this.status === 'edit') {
          var list = decodeURIComponent(this.$route.query.suppliersInfo);
          console.log(list);
          this.form = JSON.parse(list);
          console.log(this.form);
        }
    },
    beforeRouteEnter(to, from, next) {
      next(vm => {
        
      })
    },
    filters: {
    }
};
</script>

<style lang="scss" scoped>
// @import "src/styles/mixin.scss";
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
    display: flex;
    justify-content: space-between;
}
.list-count{
    display: flex;
}
</style>
