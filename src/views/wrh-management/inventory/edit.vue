<template>
    <div>
        <div class="head">
            <div class="head-title">
                <div style="margin:8px">盘点单</div>
            </div>
            <div>
                <el-button @click="back">返回</el-button>
                <el-button type="primary" @click="editSupplier" v-if="inventoryStatus === 'start'" >编辑</el-button>
                <el-button type="primary" @click="editSupplierStart" v-if="inventoryStatus === 'start'">开始盘点</el-button>
                <el-button type="primary" @click="editSupplierEnd" v-if="inventoryStatus === 'end'">结束盘点</el-button>
                <el-button type="primary" @click="leadingChange" v-if="inventoryStatus === 'end'">导入实盘数</el-button>
                <el-button type="primary" v-if="inventoryStatus === 'end'" @click="spoilageChange">转为损耗单</el-button>
                <el-button type="primary" v-if="inventoryStatus === 'end'" @click="moveChange">转为移库单</el-button>
            </div>
        </div>
        <div style="height:20px" />
        <div class="info-content">
            <div>
                <template>
                    <el-tabs v-model="tabActiveName">
                        <el-tab-pane label="盘点单详情" name="suppliers">
                            <div class="info-title">基本信息</div>
                            <el-col :span="12" class="info-box">
                                <div>盘点单号:</div>
                                <div>{{ suppliersInfo.billNumber }}</div>
                            </el-col>
                            <el-col :span="6" class="info-box">
                                <div>创建人:</div>
                                <div>{{ suppliersInfo.creatorName }}</div>
                            </el-col>
                            <el-col :span="6" class="info-box">
                                <div>修改人:</div>
                                <div>{{ suppliersInfo.updatorName}}</div>
                            </el-col>
                            <el-col :span="12" class="info-box">
                                <div>货位范围:</div>
                                <div>{{ suppliersInfo.binRange }}</div>
                            </el-col>
                            <el-col :span="6" class="info-box">
                                <div>货位用途:</div>
                                <div>{{ suppliersInfo.binUsage | binUsageChange}}</div>
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
                                <div>{{ suppliersInfo.updateTime }}</div>
                            </el-col>
                            <el-col :span="6" class="info-box">
                              <div>创建时间:</div>
                              <div>{{ suppliersInfo.createTime }}</div>
                            </el-col>
                        </el-tab-pane>
                    </el-tabs>
                </template>
            </div>
        </div>
        <div style="height:20px;background:#fff" />
        <div class="info-content _info-content">
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
                                style="width: 100%;text-align:center;height:'500px'"
                            >
                             <el-table-column prop="lineNumber" label="行号">
                                  <template slot-scope="scope">
                                      <span>{{ scope.row.lineNumber}}</span>
                                  </template>
                              </el-table-column>
                              <el-table-column prop="status" label="状态">
                                  <template slot-scope="scope">
                                      <span>{{ scope.row.status | showStatusActive}}</span>
                                  </template>
                              </el-table-column>
                              <!-- <el-table-column prop="vendorCode" label="供应商编号">
                                  <template slot-scope="scope">
                                      <span>{{ scope.row.vendorCode }}</span>
                                  </template>
                              </el-table-column>
                              <el-table-column prop="vendorName" label="供应商名称">
                                  <template slot-scope="scope">
                                      <span>{{ scope.row.vendorName }}</span>
                                  </template>
                              </el-table-column> -->
                              <el-table-column prop="binUsage" label="货位用途">
                                  <template slot-scope="scope">
                                      <span>{{ scope.row.binUsage | binUsageChange }}</span>
                                  </template>
                              </el-table-column>
                              <el-table-column prop="containerBarcode" label="来源容器">
                                  <template slot-scope="scope">
                                      <span>{{ scope.row.containerBarcode }}</span>
                                  </template>
                              </el-table-column>
                              <el-table-column prop="productCode" label="商品代码">
                                  <template slot-scope="scope">
                                      <span>{{ scope.row.productCode}}</span>
                                  </template>
                              </el-table-column>
                              <el-table-column prop="productName" label="商品名称">
                                  <template slot-scope="scope">
                                      <span>{{ scope.row.productName}}</span>
                                  </template>
                              </el-table-column>
                              <el-table-column prop="productPrice" label="库存单件">
                                  <template slot-scope="scope">
                                      <span>{{ scope.row.productPrice}}</span>
                                  </template>
                              </el-table-column>
                              <el-table-column prop="productSpec" label="商品规格">
                                  <template slot-scope="scope">
                                      <span>{{ scope.row.productSpec}}</span>
                                  </template>
                              </el-table-column>
                              <el-table-column prop="productUnit" label="商品单位">
                                  <template slot-scope="scope">
                                      <span>{{ scope.row.productUnit}}</span>
                                  </template>
                              </el-table-column>
                              <!-- <el-table-column prop="productVolume" label="商品体积">
                                  <template slot-scope="scope">
                                      <span>{{ scope.row.productVolume}}</span>
                                  </template>
                              </el-table-column>
                              <el-table-column prop="productWeight" label="商品重量">
                                  <template slot-scope="scope">
                                      <span>{{ scope.row.productWeight}}</span>
                                  </template>
                              </el-table-column> -->
                              <el-table-column prop="productionBatch" label="批号">
                                  <template slot-scope="scope">
                                      <span>{{ scope.row.productionBatch}}</span>
                                  </template>
                              </el-table-column>
                              <el-table-column prop="stockBatch" label="库存批次">
                                  <template slot-scope="scope">
                                      <span>{{ scope.row.stockBatch}}</span>
                                  </template>
                              </el-table-column>
                              <el-table-column prop="binCode" label="货位">
                                  <template slot-scope="scope">
                                      <span>{{ scope.row.binCode}}</span>
                                  </template>
                              </el-table-column>
                              <el-table-column prop="qpc" label="包装件数">
                                  <template slot-scope="scope">
                                      <span>{{ scope.row.qpc}}</span>
                                  </template>
                              </el-table-column> 
                              <el-table-column prop="qpcStr" label="商品包装">
                                  <template slot-scope="scope">
                                      <span>{{ scope.row.qpcStr}}</span>
                                  </template>
                              </el-table-column>
                              <el-table-column prop="quantity" label="实盘数量">
                                  <template slot-scope="scope">
                                      <span v-if="statusNum === 'INPROGRESS'">
                                          <el-input type='text' style="width: 70px;padding:0;" placeholder="修改数量" v-model="scope.row.quantity" class="input-width" @change="reviseNum(scope.row)"></el-input>
                                      </span>
                                      <span v-else>{{ scope.row.quantity }}</span>
                                  </template>
                              </el-table-column>
                              <el-table-column prop="quantityStr" label="实盘件数">
                                  <template slot-scope="scope">
                                      <span>{{ scope.row.quantityStr}}</span>
                                  </template>
                              </el-table-column>
                              <el-table-column prop="snapQuantity" label="快照数量">
                                  <template slot-scope="scope">
                                      <span>{{ scope.row.snapQuantity}}</span>
                                  </template>
                              </el-table-column>
                              <el-table-column prop="snapQuantityStr" label="快照件数">
                                  <template slot-scope="scope">
                                      <span>{{ scope.row.snapQuantityStr}}</span>
                                  </template>
                              </el-table-column>
                               <el-table-column prop="diversityQuantity" label="差异数量">
                                  <template slot-scope="scope">
                                      <span>{{ scope.row.diversityQuantity }}</span>
                                  </template>
                              </el-table-column>
                              <el-table-column prop="diversityQuantityStr" label="差异件数">
                                  <template slot-scope="scope">
                                      <span>{{ scope.row.diversityQuantityStr }}</span>
                                  </template>
                              </el-table-column>
                              <el-table-column prop="handleResult" label="处理结果">
                                  <template slot-scope="scope">
                                      <span>{{ scope.row.handleResult | showHandleResult}}</span>
                                  </template>
                              </el-table-column>
                            </el-table>
                            </div>
                          </el-tab-pane>
                          <el-tab-pane label="操作日志" name="operational">
                                <system-log :modular="'STOCK_TAKE_BILL'" :id="id"></system-log>
                          </el-tab-pane>
                    </el-tabs>
                </template>
            </div>
        </div>
        <el-dialog title="收货地址" :visible.sync="Actual">
         <el-upload class="upload-demo" ref="upload" :auto-upload="false" :headers="myHeaders" :action="actionUrl" :on-preview="handlePreview" :on-remove="handleRemove" :before-remove="beforeRemove" multiple :limit="1" :on-exceed="handleExceed" :file-list="fileList" :on-success="handleSuccess">
              <el-button size="small" type="primary">点击上传</el-button>
          </el-upload>
          <!-- <input type="file" @change="getFile($event)" accept=".xlsx"> -->
          <div style="padding-top: 20px;">
            <a style="color: #409EFF;" :href="stockDownload" download="checkLines.xlsx">点击下载模块</a>
          </div>
          <div slot="footer" class="dialog-footer">
            <el-button @click="Actual = false">取 消</el-button>
            <el-button type="primary" @click="submitAddFile">确 定</el-button>
          </div>
        </el-dialog>
    </div>
</template>

<script>
import InventoryService from "@/api/service/InventoryService";
import systemLog from "@/components/systemLog.vue"
import * as Utils from "@/utils/index";
import store from '@/store'
import {
    getToken
} from '@/utils/auth'
// import PermIds from "@/api/permissionIds";
// import { mapGetters } from "vuex";
export default {
  data() {
      return {
        stockDownload: '',
        form: {
          configure: []
        },
        addArr: [],
        Actual: false,
        inventoryStatus: "start",
        tabActiveName: 'suppliers',
        detailed: 'suppliers',
        changeOne: 'INVENTORY_LOSS_SURPLUS',
        changeTwo: '',
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
        },
        fileList: [],
        storageList: [],
        // PermIds: PermIds,
        checkUrl: '',
        statusNum: ''
      }
    },
    methods: {
      reviseNum(numObj) {
        InventoryService.putBillDetail(numObj)
        .then((res) => {
          this.$message.success("修改数量成功");
          this.getDetail();
        }).catch((err) => {
          this.$message.error("修改数量失败" + err.message)
        })
      },
      handleSuccess() {
        this.$message.success("上传成功");
      },
      handlePreview(file) {
        Utils.downloadFile(file.url, file.name);
      },
      handleRemove(file, fileList) {
        console.log(file, fileList);
        // // 修改对应项的数据
        // this.form.configure.forEach(item => {
        //   item.options.forEach(ele => {
        //     // 有可选项
        //     if (ele.id === this.selectItems.id) {
        //       ele.value = ""
        //     }
        //   });
        // });
      },
      getFile(event) {
          var file = event.target.files;
          for (let i = 0; i < file.length; i++) {
             var imgName = file[i].name;
              var idx = imgName.lastIndexOf(".");  
              if (idx !== -1) {
                  var ext = imgName.substr(idx + 1).toUpperCase();   
                  ext = ext.toLowerCase(); 
                  if (ext !== 'xlsx') {
                      this.$message.warning(`只能选择xlsx文件`);
                  } else {
                    console.log(file[i]);
                        this.addArr.push(file[i]);
                  }   
              } else {
                  this.$message.warning(`请选择xlsx文件`);
              }
          }
      },
      submitAddFile() {
        this.$refs.upload.submit();
        this.Actual = false;
        // if (this.addArr.length === 0) {
        //   this.$message({
        //     type: 'info',
        //     message: '请选择要上传的文件'
        //   });
        //   return;
        // }
        // this.Actual = false;
        // var formData = new FormData();
        // formData.append('file', this.addArr);
        // InventoryService.uploadFileData({formData: formData, urlApi: this.checkUrl})
        // .then((res) => {
        //     console.log(res);
        // }).catch((err) => {
        //   this.$message.error("上传失败" + err.message)
        // })
      },
      handel(data) {
        console.log(data);
      },
      upClick() {
        console.log(this.$refs.upload)
      },
      handleExceed(files, fileList) {
        this.$message.warning("请删除当前文件再上传~");
      },
      beforeRemove(file, fileList) {
        return this.$confirm(`确定移除 ${file.name}？`);
      },
      leadingChange() {
        this.Actual = true;
      },
      editSupplier() {
        const obj = JSON.stringify(this.suppliersInfo);
        this.$store.dispatch("tagsView/delView", this.$route);
        this.$router.push({name: 'InventoryAdd', query: { suppliersInfo: encodeURIComponent(obj), status: 'edit'}});
      },
      editSupplierStart() {
        InventoryService.startInventory(this.id)
        .then((res) => {
          this.inventoryStatus = "end";
          this.$message.success("开始盘点");
        }).catch((err) => {
          this.$message.error("开始盘点失败" + err.message)
        })
      },
      editSupplierEnd() {
        InventoryService.closeInventory(this.id)
        .then((res) => {
          this.inventoryStatus = "null";
          this.$message.success("结束盘点");
        }).catch((err) => {
          this.$message.error("结束盘点失败" + err.message)
        })
      },
      spoilageChange() {
        InventoryService.updateOverflowBill(this.id)
        .then((res) => {
          this.inventoryStatus = "null";
          this.$message.success("转为损耗单成功");
        }).catch((err) => {
          this.$message.error("转为损耗单失败" + err.message)
        })
      },
      moveChange() {
        InventoryService.updatemove(this.id)
        .then((res) => {
          this.inventoryStatus = "null";
          this.$message.success("转为移库单成功");
        }).catch((err) => {
          this.$message.error("转为移库单失败" + err.message)
        })
      },
      back: function() {
        this.$store.dispatch("tagsView/delView", this.$route);
        this.$router.push({name: "InventoryView"});
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
        // this.suppliersInfo = {
        //   billNumber: 'string',
        //   binRange: 'string',
        //   binUsage: 'string',
        //   createTime: 'string',
        //   creatorName: 'string',
        //   operationMode: 'MANUALBILL',
        //   planDate: 'ZERO',
        //   realDefaultQuantity: 'ZERO',
        //   status: 'NORMAL',
        //   "takeSchema": "string",
        //   "updateTime": "2021-01-02T12:38:41.064Z",
        //   "updatorName": "string",
        //   "version": "string"
        // }
        // this.storageList = [
        //   {
        //     "binCode": "string",
        //     "binUsage": "string",
        //     "containerBarcode": "string",
        //     "diversityQuantity": 0,
        //     "diversityQuantityStr": "string",
        //     "handleResult": "INVENTORY_LOSS",
        //     "id": "string",
        //     "lineNumber": "string",
        //     "productCode": "string",
        //     "productName": "string",
        //     "productPrice": 0,
        //     "productSpec": "string",
        //     "productUnit": "string",
        //     "productVolume": 0,
        //     "productWeight": 0,
        //     "productionBatch": "string",
        //     "productionDate": "string",
        //     "qpc": 0,
        //     "qpcStr": "string",
        //     "quantity": 0,
        //     "quantityStr": "string",
        //     "snapQuantity": 0,
        //     "snapQuantityStr": "string",
        //     "status": "NORMAL",
        //     "stockBatch": "string",
        //     "validDate": "string",
        //     "vendorCode": "string",
        //     "vendorName": "string",
        //     "version": "string"
        //   }
        // ]
        InventoryService.getLossBillDetail(this.id)
        .then((res) => {
          this.statusNum = res.status;
          if (res.status === 'INITIAL') {
            this.inventoryStatus = "start";
          } else if (res.status === 'INPROGRESS') {
            this.inventoryStatus = "end";
          } else if (res.status === 'FINISHED' || res.status === 'ABORTED') {
            this.inventoryStatus = "null";
          }

          this.suppliersInfo = res;
          this.storageList = res.stockTakeBillItemCheckDTOList;
        }).catch((err) => {
          this.$message.error("获取详情失败" + err.message)
        })
      }
    },
    created() {
      InventoryService.stockDownload()
      .then((res) => {
        this.stockDownload = res;
      }).catch((err) => {
        this.$message.error("获取链接失败" + err.message)
      })
      this.id = this.$route.query.id;
      this.getDetail();
    },
    components: {
      "system-log": systemLog
    },
    computed: {
      actionUrl() {
        return process.env.BASE_API + "/stock-take-bill-item-check/importByTakeBillId?takeBillId=" + this.id;
      },
      myHeaders() {
        if (store.getters.token) {
          const token = getToken() // 让每个请求携带自定义token
          return {Authorization: token, 'access-token': token}
        }
      }
    },
    filters: {
      binUsageChange(status) {
        switch (status) {
        case "UNIFYRECEIVE":
          return "统配收货暂存位"
        case "PUTAWAY":
          return "上架中转位"
        case "PICK":
          return "拣货位"
        case "STORAGE":
          return "存储位"
        case "PICK_STORAGE":
          return "拣货存储位"
        case "UNIFYPICK":
          return "统配拣货暂存位"
        case "UNIFYCOLLECT":
          return "统配集货存储位"
        case "RPL":
          return "补货暂存位"
        case "TRANSFERRECEIVE":
          return "中转收货暂存位"
        case "TRANSFERCOLLECT":
          return "中转集货暂存位"
        case "DIRECTRECEIVE":
          return "直通收货暂存位"
        case "STORECROSSALLOCATE":
          return "门店分拨位"
        case "STORERTN":
          return "门店退货收货暂存位"
        case "VENDORRTN":
          return "供应商退货位"
        case "VENDORCOLLECT":
          return "供应商集货位"
        default :
          return status
        }
      },
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
          case "SNAP":
            return "快照"
          case "NORMAL":
            return "正常"
          case "HANDLED":
            return "已处理"
          case "UNHANDLED":
            return "未处理"
        }
      },
      timeChange(val) {
        console.log(val);
      },
      updateTimeType(val) {
        console.log(val);
      }
    },
    beforeRouteEnter(to, from, next) {
      next(vm => {
        vm.getDetail();
      })
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
._info-content {
  /deep/ .el-tabs__content  {
    height: 300px;
    overflow-y: scroll;
  }
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
/deep/ .el-input__inner {
  padding:0;
  text-align: center;
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
