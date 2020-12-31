<template>
    <div>
        <div class="head">
            <div class="head-title">
                <div style="margin:8px">盘点单</div>
            </div>
            <div>
                <el-button @click="back">返回</el-button>
                <el-button type="primary" @click="editSupplier" >编辑</el-button>
                <el-button type="primary" @click="editSupplierStart" v-if="inventoryStatus === 'start'">开始盘点</el-button>
                <el-button type="primary" @click="editSupplierEnd" v-if="inventoryStatus === 'end'">结束盘点</el-button>
                <el-button type="primary" @click="leadingChange">导入实盘数</el-button>
            </div>
        </div>
        <div style="height:20px" />
        <div class="info-content">
            <div>
                <template>
                    <el-tabs v-model="tabActiveName">
                        <el-tab-pane label="盘点单详情" name="suppliers">
                            <div class="info-title">基本信息</div>
                            <el-col :span="6" class="info-box">
                                <div>盘点单号:</div>
                                <div>{{ suppliersInfo.billNumber }}</div>
                            </el-col>
                            <el-col :span="6" class="info-box">
                                <div>创建人:</div>
                                <div>{{ suppliersInfo.creatorName }}</div>
                            </el-col>
                            <el-col :span="6" class="info-box">
                                <div>创建时间:</div>
                                <div>{{ suppliersInfo.createTime }}</div>
                            </el-col>
                            <el-col :span="6" class="info-box">
                                <div>货位范围:</div>
                                <div>{{ suppliersInfo.binRange }}</div>
                            </el-col>
                            <el-col :span="6" class="info-box">
                                <div>货位用途:</div>
                                <div>{{ suppliersInfo.binUsage }}</div>
                            </el-col>
                            <el-col :span="6" class="info-box">
                                <div>操作方式:</div>
                                <div>{{ suppliersInfo.operationMode | handleStatus}}</div>
                            </el-col>
                            <el-col :span="6" class="info-box">
                                <div>实盘默认值:</div>
                                <div>{{ suppliersInfo.realDefaultQuantity | planStatus}}</div>
                            </el-col>
                            <el-col :span="6" class="info-box">
                                <div>状态:</div>
                                <div>{{ suppliersInfo.status | showStatus}}</div>
                            </el-col>
                            <el-col :span="6" class="info-box">
                                <div>修改时间:</div>
                                <div>{{ suppliersInfo.updateTime}}</div>
                            </el-col>
                            <el-col :span="6" class="info-box">
                                <div>修改人:</div>
                                <div>{{ suppliersInfo.updatorName}}</div>
                            </el-col>
                        </el-tab-pane>
                    </el-tabs>
                </template>
            </div>
        </div>
        <div style="height:20px;background:#fff" />
        <div class="info-content">
            <div>
                <template>
                    <el-tabs v-model="detailed">
                          <el-tab-pane label="盘点行明细" name="suppliers">
                            <div style="background:#fff" class="table-index">
                            <!-- <el-row>
                                <div style="padding:15px">
                                  对应存储分区
                                </div>
                            </el-row> -->
                            <el-table
                                :data="storageList"
                                style="width: 100%;text-align:center"
                            >
                             <el-table-column prop="lineNumber" label="行号">
                                  <template slot-scope="scope">
                                      <span style="color:#409EFF">{{ scope.row.lineNumber}}</span>
                                  </template>
                              </el-table-column>
                              <el-table-column prop="vendorCode" label="供应商编号">
                                  <template slot-scope="scope">
                                      <span style="color:#409EFF">{{ scope.row.binCode }}</span>
                                  </template>
                              </el-table-column>
                              <el-table-column prop="vendorName" label="供应商名称">
                                  <template slot-scope="scope">
                                      <span style="color:#409EFF">{{ scope.row.binCode }}</span>
                                  </template>
                              </el-table-column>
                              <el-table-column prop="binUsage" label="货位用途">
                                  <template slot-scope="scope">
                                      <span style="color:#409EFF">{{ scope.row.binUsage }}</span>
                                  </template>
                              </el-table-column>
                              <el-table-column prop="containerBarcode" label="来源容器">
                                  <template slot-scope="scope">
                                      <span style="color:#409EFF">{{ scope.row.containerBarcode }}</span>
                                  </template>
                              </el-table-column>
                              <el-table-column prop="diversityQuantity" label="差异数量">
                                  <template slot-scope="scope">
                                      <span style="color:#409EFF">{{ scope.row.diversityQuantity }}</span>
                                  </template>
                              </el-table-column>
                              <el-table-column prop="diversityQuantityStr" label="差异件数">
                                  <template slot-scope="scope">
                                      <span style="color:#409EFF">{{ scope.row.diversityQuantityStr }}</span>
                                  </template>
                              </el-table-column>
                              <el-table-column prop="handleResult" label="处理结果">
                                  <template slot-scope="scope">
                                      <span style="color:#409EFF">{{ scope.row.handleResult | showHandleResult}}</span>
                                  </template>
                              </el-table-column>
                              <el-table-column prop="lineNumber" label="处理结果">
                                  <template slot-scope="scope">
                                      <span style="color:#409EFF">{{ scope.row.lineNumber}}</span>
                                  </template>
                              </el-table-column>
                              <el-table-column prop="productCode" label="商品代码">
                                  <template slot-scope="scope">
                                      <span style="color:#409EFF">{{ scope.row.productCode}}</span>
                                  </template>
                              </el-table-column>
                              <el-table-column prop="productName" label="商品名称">
                                  <template slot-scope="scope">
                                      <span style="color:#409EFF">{{ scope.row.productName}}</span>
                                  </template>
                              </el-table-column>
                              <el-table-column prop="productPrice" label="商品单件">
                                  <template slot-scope="scope">
                                      <span style="color:#409EFF">{{ scope.row.productPrice}}</span>
                                  </template>
                              </el-table-column>
                              <el-table-column prop="productSpec" label="商品规格">
                                  <template slot-scope="scope">
                                      <span style="color:#409EFF">{{ scope.row.productSpec}}</span>
                                  </template>
                              </el-table-column>
                              <el-table-column prop="productUnit" label="商品单位">
                                  <template slot-scope="scope">
                                      <span style="color:#409EFF">{{ scope.row.productUnit}}</span>
                                  </template>
                              </el-table-column>
                              <el-table-column prop="productVolume" label="商品体积">
                                  <template slot-scope="scope">
                                      <span style="color:#409EFF">{{ scope.row.productVolume}}</span>
                                  </template>
                              </el-table-column>
                              <el-table-column prop="productWeight" label="商品重量">
                                  <template slot-scope="scope">
                                      <span style="color:#409EFF">{{ scope.row.productWeight}}</span>
                                  </template>
                              </el-table-column>
                              <el-table-column prop="productionBatch" label="批号">
                                  <template slot-scope="scope">
                                      <span style="color:#409EFF">{{ scope.row.productionBatch}}</span>
                                  </template>
                              </el-table-column>
                              <el-table-column prop="stockBatch" label="批次">
                                  <template slot-scope="scope">
                                      <span style="color:#409EFF">{{ scope.row.stockBatch}}</span>
                                  </template>
                              </el-table-column>
                              <el-table-column prop="productionDate" label="生产日期">
                                  <template slot-scope="scope">
                                      <span style="color:#409EFF">{{ scope.row.productionDate}}</span>
                                  </template>
                              </el-table-column>
                              <el-table-column prop="validDate" label="到效日期">
                                  <template slot-scope="scope">
                                      <span style="color:#409EFF">{{ scope.row.validDate}}</span>
                                  </template>
                              </el-table-column>
                              <el-table-column prop="qpcStr" label="规格">
                                  <template slot-scope="scope">
                                      <span style="color:#409EFF">{{ scope.row.qpcStr}}</span>
                                  </template>
                              </el-table-column>
                              <el-table-column prop="quantity" label="数量">
                                  <template slot-scope="scope">
                                      <span style="color:#409EFF">{{ scope.row.quantity}}</span>
                                  </template>
                              </el-table-column>
                              <el-table-column prop="quantityStr" label="件量">
                                  <template slot-scope="scope">
                                      <span style="color:#409EFF">{{ scope.row.quantityStr}}</span>
                                  </template>
                              </el-table-column>
                              <el-table-column prop="snapQuantity" label="快照数量">
                                  <template slot-scope="scope">
                                      <span style="color:#409EFF">{{ scope.row.snapQuantity}}</span>
                                  </template>
                              </el-table-column>
                              <el-table-column prop="snapQuantity" label="快照数量">
                                  <template slot-scope="scope">
                                      <span style="color:#409EFF">{{ scope.row.snapQuantity}}</span>
                                  </template>
                              </el-table-column>
                              <el-table-column prop="status" label="状态">
                                  <template slot-scope="scope">
                                      <span style="color:#409EFF">{{ scope.row.status | showStatusActive}}</span>
                                  </template>
                              </el-table-column>
                            </el-table>
                            </div>
                          </el-tab-pane>
                          <el-tab-pane label="操作日志" name="operational">
                                <system-log :modular="'PICKAREA'"></system-log>
                          </el-tab-pane>
                    </el-tabs>
                </template>
            </div>
        </div>
        <el-dialog title="收货地址" :visible.sync="dialogFormVisible">
          <el-upload
            class="upload-demo"
            action="https://jsonplaceholder.typicode.com/posts/"
            :on-preview="handlePreview"
            :on-remove="handleRemove"
            :before-remove="beforeRemove"
            multiple
            :limit="3"
            :on-exceed="handleExceed"
            :file-list="fileList">
            <el-button size="small" type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
          </el-upload>
          <el-link type="primary">主要链接</el-link>
          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisible = false">取 消</el-button>
            <el-button type="primary" @click="dialogFormVisible = false">确 定</el-button>
          </div>
        </el-dialog>
    </div>
</template>

<script>
// import InventoryService from "@/api/service/InventoryService";
import systemLog from "@/components/systemLog.vue"
// import PermIds from "@/api/permissionIds";
// import { mapGetters } from "vuex";
export default {
  data() {
      return {
        inventoryStatus: "start",
        tabActiveName: 'suppliers',
        detailed: 'suppliers',
        id: '',
        suppliersInfo: {
          billNumber: '',
          binRange: '',
          binUsage: '',
          createTime: '',
          creatorName: '',
          operationMode: '',
          planDate: '',
          realDefaultQuantity: '',
          status: ''

        }
        // PermIds: PermIds,
      }
    },
    methods: {
      leadingChange() {

      },
      editSupplierStart() {
        this.inventoryStatus = "end";
        // InventoryService.startInventory(this.id)
        // .then((res) => {
        //   this.$message.success("开始盘点");
        // }).catch((err) => {
        //   this.$message.error("开始盘点失败" + err.message)
        // })
        console.log("这里是开始盘点");
      },
      editSupplierEnd() {
        this.inventoryStatus = "start";
        // InventoryService.closeInventory(this.id)
        // .then((res) => {
        //   this.$message.success("结束盘点");
        // }).catch((err) => {
        //   this.$message.error("结束盘点失败" + err.message)
        // })
        // console.log("这里是结束盘点");
      },
      back: function() {
        this.$store.dispatch("tagsView/delView", this.$route);
        this.$router.go(-1)
      },
      // 弹出界面的方法
      handleSizeChangeOne(e) {
        this.mySelfPageSize = Number(e)
        this.mySelfPage = 1
      },
      handleCurrentChangeOne(e) {
        for (let i = 0; i < this.leftSelect.length; i++) {
          this.leftSelected.push(this.leftSelect[i]);
        }
        this.mySelfPage = Number(e);
      },
      getDetail() {
        // InventoryService.getLossBillDetail(this.id)
        // .then((res) => {
        //   console.log(res);
        // }).catch((err) => {
        //   this.$message.error("获取详情失败" + err.message)
        // })
      }
    },
    created() {
      this.id = this.$route.query.id;
      // this.getDetail();
    },
    components: {
      "system-log": systemLog
    },
    filters: {
      handleStatus(status) {
      switch (status) {
        case "MANUALBILL":
          return "手工单据"
        case "HANDTERMINAL":
          return "手持终端"
      }
      },
      showStatus(status) {
        switch (status) {
          case "INITIAL":
            return "初始"
          case "INPROGRESS":
            return "进行中"
          case "FINISHED":
            return "已完成"
          case "ABORTED":
            return "已作废"
        }
      },
      showtakeSchema(status) {
        switch (status) {
          case "BLINDTAKE":
            return "盲盘"
          case "BRIGHTTAKE":
            return "明盘"
        }
      },
      planStatus(status) {
        switch (status) {
          case "ZERO":
            return "按照0处理"
          case "EQUAL_INVENTORY":
            return "按照等同于库存处理"
        }
      },
      showHandleResult(status) {
        switch (status) {
          case "INVENTORY_LOSS":
            return "盘亏"
          case "INVENTORY_PROFIT":
            return "盘盈"
          case "MOVE_BILL":
            return "移库"
        }
      },
      showStatusActive(status) {
        switch (status) {
          case "NORMAL":
            return "正常"
          case "HANDLED":
            return "已处理"
          case "UNHANDLED":
            return "未处理"
        }
      }
    }
};
</script>

<style lang="scss" scoped>
@import "src/styles/mixin.scss";
.pop-up-pag {
  position: absolute;
  left: 50%;
  margin-top: -300px;
  transform: translateX(-50%);
  background-color: skyblue;
  width: 800px;
  // height: 600px;
  display: flex;
  justify-content: space-between;
  .right-popstorge,
  .left-popstorge {
    .count-tatle{
      padding: 10px;
      font-size: 12px;
    }
    .center-pag {
      padding: 0 10px;
    }
    .list-pop-ui {
      margin: 0;
      li {
        display: flex;
        align-items: center;
        padding: 20px;
        .content-checked-one {
          font-size: 12px;
        }
      }
    }
    border: #E4E7ED solid 1px;
    width: 350px;
    height: 600px;
  }
  .right-popstorge {
    margin-left: 20px;
  }
  .left-popstorge {
    margin-right: 20px;
  }
  ul {
    list-style: none;
  }
}
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
// 弹出框
/deep/ .el-transfer-panel {
  height : 100% !important;
}
/deep/ .el-transfer__buttons .el-button {
  display: block;
  margin: 10px auto;
}
/deep/ .el-transfer__buttons {
  padding: 0 10px;
}


.shuttle-box {
  margin-top: -10vh !important;
  /deep/ .el-dialog {
    min-width: 670px;
    width: 70%;
  }
  .shuttle {
    width: 100%;
    height: 530px;
    display: flex;
    justify-content: space-between;
    border: 1px solid #eee;
    border-radius: 10px;
    .shuttle-left {
      border-radius: 10px;
      // width: 250px;
      flex: 1;
      .shuttle-left-header {
        text-align: left;
        padding: 10px 20px 10px 20px;
        border-bottom: 1px solid #eee;
        margin-bottom: 10px;
      }
    }
    .shuttle-center {
      margin : 0 10px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
    }
    .shuttle-right {
      border-radius: 10px;
      .shuttle-right-header {
        text-align: left;
        padding: 10px 20px 10px 20px;
        border-bottom: 1px solid #eee;
        margin-bottom: 10px;
      }
      // width: 250px;
      flex: 1;
    }
    /deep/ .block {
      margin-top: 10px;
    }
    /deep/ .el-input__prefix {
      width: 30px;
      left: calc(100% - 30px);
    }
    /deep/ .el-input--prefix .el-input__inner {
      padding-left: 20px;
    }
  }
}
</style>
<style lang="scss">
.table-index{
@import "src/styles/mixin.scss";
@include elTable;
}
</style>
