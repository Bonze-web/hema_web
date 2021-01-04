<template>
    <div>
        <div class="head" v-if="status === 'create'">
            <div style="margin-top:8px" v-if="status === 'create'">新建移库单</div>
            <div>
                <el-button @click="back">取消</el-button>
                <el-button type="primary" @click="createBill(false)" v-if="hasPermission(PermIds.WMS_INCINVBILL_CREATE)">保存</el-button>
                <!-- <el-button type="primary" @click="createBill(true)" v-if="status === 'create' && hasPermission(PermIds.WMS_INCINVBILL_AUDIT)">保存并审核</el-button> -->
            </div>
        </div>
        <div style="height:20px" />
        <div class="info-content" v-if="status === 'create'">
            <div>
                <template>
                  <el-form :model="form" :rules="createRules" ref="form" label-width="100px" class="demo-ruleForm">
                                <div class="info-title">基本信息</div>
                                <el-row :gutter="20">
                                    <el-col :span="6" class="info-box">
                                        <el-form-item label="移库类型" prop="moveType">
                                          <el-select v-model="form.moveType" placeholder="请选择移库类型">
                                            <el-option v-for="item in billTypeList" :key="item.id" :label="item.typeName" :value="item.typeName"></el-option>
                                          </el-select>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="6" class="info-box">
                                        <el-form-item label="移库员" prop="moverId">
                                             <el-select
                                              v-model="form.moverName"
                                              filterable
                                              remote
                                              placeholder="请输入移库员名称"
                                              :remote-method="getUsers"
                                              @change="moverChange">
                                              <el-option
                                                v-for="item in restaurants"
                                                :key="item.id"
                                                :label="item.username"
                                                :value="item.username">
                                              </el-option>
                                            </el-select>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                                <div class="info-title">
                                    <div>
                                      商品明细
                                    <!-- <router-link @click="batchAddProduct" style="color:#409EFF" :to="{ path: '/wrhmanagement/lossbill/batchAdd' }"> -->
                                        <el-button size="mini" type="text" @click="bacthAddProduct">批量添加</el-button>
                                    <!-- </router-link> -->
                                    </div>
                                </div>
                                    <el-table
                                      ref="productTable"
                                      :data="productList"
                                      style="width: 100%;text-align:center"
                                      @selection-change="handleSelectionChange"
                                    >
                                    <el-table-column fixed prop="billNumber" label="操作">
                                      <template slot-scope="scope">
                                        <el-button type="text" @click="deleteProduct(scope.$index)">删除</el-button>
                                      </template>
                                    </el-table-column>
                                    <el-table-column label="行" width="55">
                                      <template slot-scope="scope">
                                        {{ scope.$index + 1 }}
                                      </template>
                                    </el-table-column>
                                    <el-table-column label="商品" width="120" prop="productName"></el-table-column>
                                    <el-table-column label="来源货位" width="120" prop="binCode"></el-table-column>
                                    <el-table-column label="来源货位用途" width="120" prop="productName"></el-table-column>
                                    <el-table-column label="来源容器" width="120" prop="containerBarcode"></el-table-column>
                                    <el-table-column label="门店" width="120" prop="productName"></el-table-column>
                                    <el-table-column label="供应商" width="120" prop="vendorName"></el-table-column>
                                    <el-table-column label="批号" width="120" prop="batch"></el-table-column>
                                    <el-table-column label="生产日期" width="120" prop="productionDate"></el-table-column>
                                    <el-table-column label="到效日期" width="120" prop="validDate"></el-table-column>
                                    <el-table-column label="规格/计量单位" width="120" prop="qpcStr"></el-table-column>
                                    <el-table-column label="件数" width="200" style="diaplay:flex">
                                      <template slot-scope="scope">
                                        <el-input type="number" style="width:80px" max="100" @change="calcProduct" size="mini" v-model="scope.row.consumeQty"></el-input>
                                        <el-input type="number" style="width:80px" max="100" @change="calcProduct" size="mini" v-model="scope.row.consumeQtystr"></el-input>
                                      </template>
                                    </el-table-column>
                                    <el-table-column label="目标仓库" width="120" prop="toWarehouseCode">
                                      <template slot-scope="scope">
                                        {{ scope.row.toWarehouseCode ? '[' + scope.row.toWarehouseCode + ']' + scope.row.toWarehouseName : ''}}
                                      </template>
                                    </el-table-column>
                                    <el-table-column label="目标货位" width="180">
                                      <template slot-scope="scope">
                                        <el-select
                                          v-model="scope.row.toBinId"
                                          filterable
                                          remote
                                          placeholder="请输入货位"
                                          @change="selectBin"
                                          :remote-method="getBinList">
                                          <el-option
                                            v-for="item in binList"
                                            :key="item.id"
                                            :label="item.code"
                                            :value="item.id">
                                          </el-option>
                                        </el-select>
                                      </template>
                                    </el-table-column>
                                    <el-table-column label="目标容器" width="180">
                                      <template slot-scope="scope">
                                        <el-select
                                          v-model="scope.row.toContainerId"
                                          filterable
                                          remote
                                          @change="selectContainer"
                                          placeholder="请输入容器"
                                          :remote-method="getContainerList">
                                          <el-option
                                            v-for="item in containerList"
                                            :key="item.id"
                                            :label="item.barcode"
                                            :value="item.id">
                                          </el-option>
                                        </el-select>
                                      </template>
                                    </el-table-column>
                                    </el-table>
                            </el-form>     
                               
                </template>
            </div>
        </div>
    </div>
</template>

<script>
import BillService from "@/api/service/BillService";
import BillTypeService from "@/api/service/BillTypeService"
import MemberService from "@/api/service/MemberService"
import StorageService from "@/api/service/StorageService"
// import ProductService from "@/api/service/ProductService"
import UserService from "@/api/service/UserService";
import BasicService from "@/api/service/BasicService"
import PermIds from "@/api/permissionIds";
import productSelect from '../../../components/productSelect.vue';
import { mapActions, mapGetters } from "vuex";

export default {
  data() {
      return {
        restaurants: [], // 移库员列表
        PermIds: PermIds,
        form: {
          moveType: '', // 移库类型
          moveBillItemList: [], // 商品明细
          moverId: '', // 移库员ID
          moverName: '', // 移库员姓名
          fromWarehouseCode: '', // 来源仓编码
          fromWarehouseId: '', // 来源仓id
          fromWarehouseName: '', // 来源仓名称
          toWarehouseCode: '', // 目标仓编码
          toWarehouseId: '', // 目标仓id
          toWarehouseName: '' // 目标仓名称
        },
        createRules: {
          moveType: [
            { required: true, message: '请选择移库类型', trigger: 'blur' }
          ],
          moverId: [
            { required: true, message: '请选择移库员', trigger: 'blur' }
          ]
        },
        containerList: [],
        binList: [],
        billTypeList: [], // 单据类型列表
        productList: [], // 临时的商品明细
        removeProductList: [] // 临时存储选中的商品明细
      }
    },
    components: {
      productSelect
    },
    computed: {
      ...mapGetters(["hasPermission"])
    },
    methods: {
      ...mapActions(["deleteMove", "clearMove"]),
      moverChange() {
        this.restaurants.forEach(item => {
          if (item.id === this.form.moverId) {
            this.form.moverId = item.id
          }
        })
      },
      getContainerList: function(query) {
        const data = {
          barCodeLikes: query,
          page: 1,
          pageSize: 20
        }
        BasicService.quertOcntainer(data)
        .then((result) => {
          this.containerList = result.records
        }).catch((err) => {
          this.$message.error('获取容器失败' + err.message)
        });
      },
      selectContainer: function() {
        this.containerList.forEach(item => {
          this.productList.forEach(value => {
            if (item.id === value.toBinId) {
              value.toContainerBarcode = item.toContainerBarcode
            }
          })
        })
        this.containerList = []
      },
      getBinList: function(query) {
        const data = {
          page: 1,
          pageSize: 20,
          codeLike: query
        }
        StorageService.getAllFreightSpace(data)
        .then((result) => {
          this.binList = result.records
        }).catch((err) => {
          this.$message.error('获取货位失败' + err.message)
        });
      },
      selectBin: function() {
        this.binList.forEach(item => {
          this.productList.forEach(value => {
            if (item.id === value.toBinId) {
              console.log(value)
              value.toBinCode = item.code
              value.toBinUsage = item.binusage
              value.toWarehouseId = item.wrhId
              value.toWarehouseName = item.wrhName
              value.toWarehouseCode = item.wrhCode
              value.fromBinId = value.binId
              value.fromBinCode = value.binCode
              value.fromBinUsage = value.binUsage
              value.stockBatch = value.batch
              value.fromContainerBarcode = value.containerBarcode
              value.fromContainerId = value.containerId
            }
          })
        })
        this.binList = []
      }, 
      handleSelect: function(e) {
        console.log(e)
        this.form.moverId = e.id
      },
      bacthAddProduct: function() {
        this.$router.push({path: '/wrhmanagement/movebill/batchAdd', query: {id: this.form.wrhId}})
      },
      handleSelectionChange: function(val) {
        this.removeProductList = val
      },
      removeProduct: function() {
        this.removeProductList.forEach((item) => {
          this.productList.forEach((val, index) => {
            if (val.index === item.index) {
              this.productList.splice(index, 1)
            }
          })
        })
        this.removeProductList = []
      },
      deleteProduct: function(index) {
        this.deleteMove(index)
        this.productList.splice(index, 1)
        const arr = Array.from(new Set(this.productList))
        this.productList = arr
        this.form.totalProductCount = arr.length
        this.calcProduct()
      },
      createBill: function(reset) {
        this.form.moveBillItemList = []
        const _this = this
        if (reset) {
          this.form.status = "AUDITED"
        } else {
          this.form.status = "INITIAL"
        }
        if (_this.productList.length <= 0) {
          _this.$message.error('请至少添加一个商品')
          return
        } else {
          // this.productList.forEach((item) => {
            
          // })
          for (const item in this.productList) {
            if (!Number(this.productList[item].qty)) {
              this.$message.error(`请输入${this.productList[item].productName}的数量`)
              this.form.moveBillItemList = []
              return
            }
            if (!this.productList[item].toBinId) {
              this.$message.error(`请输入${this.productList[item].productName}的目标货位`)
              this.form.moveBillItemList = []
              return
            }
            this.form.moveBillItemList.push(this.productList[item])
          }
        }
        _this.$refs.form.validate(valid => {
          if (valid) {
            BillService.createMoveBill(this.form)
            .then((res) => {
              _this.$message.success('创建成功')
              _this.$store.dispatch("tagsView/delView", _this.$route);
              _this.$router.go(-1)
              _this.clearMove()
            })
            .catch((err) => {
              _this.$message.error('创建失败' + err.message)
            })
          }
        })
      },
      back: function() {
        this.$store.dispatch("tagsView/delView", this.$route);
        this.$router.go(-1)
      },
      getQueryStatus: function() {
        this.status = this.$route.query.status
        if (this.status === 'read') {
          this.id = this.$route.query.id
          // this.form.wrhId = this.id
        }
      },
      getAllBillType: function() {
          // 加载单据类型
        const data = {
          type: 'MOVESTOCK'
        }
        BillTypeService.getQueryType(data)
        .then((res) => {
            this.billTypeList = res
        })
        .catch((err) => {
            this.$message.error('获取移库类别失败' + err.message)
        })
      },
      getWrhList: function() {
        const postData = {
          page: 1,
          pageSize: 0,
          statusEquals: 'ON'
        }
        StorageService.warehouseInit(postData)
        .then((res) => {
          this.wrhList = res.records
        })
        .catch((err) => {
          this.$message.error('加载仓库失败' + err.message)
        })
      },
      calcProduct: function(productList) {
        this.productList.forEach(item => {  
          if (Number(item.consumeQty) < 0 || Number(item.consumeQtystr) < 0) {
            item.consumeQty = 0
            item.consumeQtystr = 0
          }
          item.qty = Number(item.consumeQty) * Number(item.qpc) + Number(item.consumeQtystr)
        });
      },
      getUsers: function() {
        this.restaurants = []
        MemberService.query(1, 0, {nameLike: this.form.decerName})
        .then((res) => {
          this.restaurants = res.records
        }).catch((err) => {
          this.$message.error('获取用户列表失败' + err.message)
        })
      },
      getLoginUser() {
        UserService.getLoginUser()
        .then((result) => {
          console.log(result)
          this.form.moverName = result.username
          this.form.moverId = result.id
        }).catch((err) => {
          this.$message.error('获取当前用户失败' + err.message)
        });
      }
    },
    created() {
      this.getLoginUser()
      this.getAllBillType()
      this.getQueryStatus()
      this.getWrhList()
    },
    beforeRouteEnter(to, from, next) {
      next(vm => {
        // 通过 `vm` 访问组件实例
        vm.productList = vm.$store.state.bill.moveSelection
        const arr = Array.from(new Set(vm.productList))
        vm.productList = arr
        vm.form.totalProductCount = arr.length
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
.product-box{
  display: flex;
  // justify-content: left;
  margin-bottom: 12px;
}
.title-box{
  width: 30%;
  text-align: right;
}
</style>
