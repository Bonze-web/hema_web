<template>
    <div>
        <div class="head" v-if="status === 'create'">
            <div style="margin-top:8px" v-if="status === 'create'">新建移库单</div>
            <div>
                <el-button @click="back">取消</el-button>
                <el-button type="primary" @click="createBill(false)" v-if="hasPermission(PermIds.WMS_INCINVBILL_CREATE)">保存</el-button>
                <el-button type="primary" @click="createBill(true)" v-if="status === 'create' && hasPermission(PermIds.WMS_INCINVBILL_AUDIT)">保存并审核</el-button>
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
                                        <el-form-item label="移库类型" prop="billTypeId">
                                          <el-select v-model="form.moveType" placeholder="请选择移库类型">
                                            <el-option v-for="item in billTypeList" :key="item.id" :label="item.typeName" :value="item.id"></el-option>
                                          </el-select>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="6" class="info-box">
                                        <el-form-item label="移库员" prop="decerName">
                                            <el-autocomplete
                                                class="inline-input"
                                                v-model="form.moverName"
                                                :fetch-suggestions="querySearch"
                                                placeholder="请输入移库员"
                                                :trigger-on-focus="false"
                                                @select="handleSelect"
                                            ></el-autocomplete>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                                <div class="info-title">
                                    <div>
                                    <!-- <router-link @click="batchAddProduct" style="color:#409EFF" :to="{ path: '/wrhmanagement/lossbill/batchAdd' }"> -->
                                        <el-button size="mini" type="text" icon="el-icon-circle-plus" @click="AddProduct">添加</el-button>
                                        <el-button size="mini" type="text" icon="el-icon-remove" @click="removeProduct">删除</el-button>
                                    <!-- </router-link> -->
                                    </div>
                                    <div class="list-count">
                                        <div>总件数:{{ form.totalQtystr ? form.totalQtystr : 0 }},</div>
                                        <div>总数量:{{ form.totalProductCount ? form.totalProductCount : 0 }},</div>
                                        <div>总金额:{{ form.totalAmount ? form.totalAmount : 0 }}</div>
                                    </div>
                                </div>
                                    <el-table
                                      ref="productTable"
                                      :data="productList"
                                      style="width: 100%;text-align:center"
                                      @selection-change="handleSelectionChange"
                                    >
                                    <el-table-column
                                      fixed
                                      type="selection"
                                      width="55">
                                    </el-table-column>
                                    <el-table-column label="行" width="120">
                                      <template slot-scope="scope">
                                        {{ scope.$index + 1 }}
                                      </template>
                                    </el-table-column>
                                    <el-table-column label="商品" width="200">
                                      <template>
                                        <product-select @productSelect="productSelect"></product-select>
                                      </template>
                                    </el-table-column>
                                    <el-table-column label="来源货位" width="120">
                                      <template slot-scope="scope">
                                        {{ scope.$index + 1 }}
                                      </template>
                                    </el-table-column>
                                    <el-table-column label="来源货位用途" width="120">
                                      <template slot-scope="scope">
                                        {{ scope.$index + 1 }}
                                      </template>
                                    </el-table-column>
                                    <el-table-column label="来源容器" width="120">
                                      <template slot-scope="scope">
                                        {{ scope.$index + 1 }}
                                      </template>
                                    </el-table-column>
                                    <el-table-column label="门店" width="120">
                                      <template slot-scope="scope">
                                        {{ scope.$index + 1 }}
                                      </template>
                                    </el-table-column>
                                    <el-table-column label="供应商" width="120">
                                      <template slot-scope="scope">
                                        {{ scope.$index + 1 }}
                                      </template>
                                    </el-table-column>
                                    <el-table-column label="批号" width="120">
                                      <template slot-scope="scope">
                                        {{ scope.$index + 1 }}
                                      </template>
                                    </el-table-column>
                                    <el-table-column label="生产日期" width="120">
                                      <template slot-scope="scope">
                                        {{ scope.$index + 1 }}
                                      </template>
                                    </el-table-column>
                                    <el-table-column label="到效日期" width="120">
                                      <template slot-scope="scope">
                                        {{ scope.$index + 1 }}
                                      </template>
                                    </el-table-column>
                                    <el-table-column label="规格/计量单位" width="120">
                                      <template slot-scope="scope">
                                        {{ scope.$index + 1 }}
                                      </template>
                                    </el-table-column>
                                    <el-table-column label="件数" width="120">
                                      <template slot-scope="scope">
                                        {{ scope.$index + 1 }}
                                      </template>
                                    </el-table-column>
                                    <el-table-column label="数量" width="120">
                                      <template slot-scope="scope">
                                        {{ scope.$index + 1 }}
                                      </template>
                                    </el-table-column>
                                    <el-table-column label="目标货位" width="120">
                                      <template slot-scope="scope">
                                        {{ scope.$index + 1 }}
                                      </template>
                                    </el-table-column>
                                    <el-table-column label="目标容器" width="120">
                                      <template slot-scope="scope">
                                        {{ scope.$index + 1 }}
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
// import BasicService from "@/api/service/BasicService"
import PermIds from "@/api/permissionIds";
import productSelect from '../../../components/productSelect.vue';
import { mapGetters } from "vuex";

export default {
  data() {
      return {
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
      productSelect: function(data) {
        this.productList
      },
      handleSelect: function(e) {
        console.log(e)
        this.form.moverId = e.id
      },
      AddProduct: function() {
        this.productList.push({index: this.productList.length})
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
        this.deleteSelection(index)
        this.productList.splice(index, 1)
        const arr = Array.from(new Set(this.productList))
        this.productList = arr
        this.form.totalProductCount = arr.length
        this.calcProduct()
      },
      createBill: function(reset) {
        const _this = this
        if (reset) {
          this.form.status = "AUDITED"
        } else {
          this.form.status = "SAVED"
        }
        if (_this.productList.length <= 0) {
          _this.$message.error('请至少添加一个商品')
          return
        } else {
          this.productList.forEach((item) => {
            this.form.stockList.push({
              consumeAmount: item.consumeAmount,
              lineNum: item.lineNum,
              consumeQty: item.consumeQty,
              consumeQtystr: item.consumeQtystr,
              stockId: item.id
            })
          })
        }
        _this.$refs.form.validate(valid => {
          if (valid) {
            BillService.createOverflowBill(this.form)
            .then((res) => {
              _this.$message.success('创建成功')
              _this.$store.dispatch("tagsView/delView", _this.$route);
              _this.$router.go(-1)
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
      querySearch: function(queryString, cb) {
          // 搜索报告人
          const restaurants = this.restaurants;
          const results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants;
          // 调用 callback 返回建议列表的数据
          cb(results);
      },
      createFilter(queryString) {
        return (restaurant) => {
          return (restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
        };
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
        this.form.totalAmount = 0
        this.form.totalQtystr = 0
        let consumeQtystr = 0
        let consumeQty = 0
        this.productList.forEach(item => {
          item.lineNum = this.productList.indexOf(item) + 1
          item.consumeAmount = Number(item.consumeQtystr) * item.price + Number(item.consumeQty) * item.price 
          this.form.realTotalAmount += item.consumeAmount
          consumeQtystr = Number(consumeQtystr) + Number(item.consumeQtystr)
          consumeQty = Number(consumeQty) + Number(item.consumeQty)
          if (Number(item.consumeQty) < 0 || Number(item.consumeQtystr) < 0) {
            this.$message.error('请输入正确的数据')
            consumeQtystr = Number(consumeQtystr) - Number(item.consumeQtystr)
            consumeQty = Number(consumeQty) - Number(item.consumeQty)
            item.consumeQtystr = 0
            item.consumeQty = 0
          }
          console.log(consumeQty)
          this.form.totalQtystr = consumeQtystr + '+' + consumeQty
          this.form.totalAmount = Number(this.form.totalAmount) + Number(item.consumeAmount)
          console.log(item)
        });
      },
      getUsers: function() {
        MemberService.query(1, 0, {nameLike: this.form.decerName})
        .then((res) => {
          res.records.forEach((item) => {
            const obj = {
              value: item.username,
              id: item.id
            }
            this.restaurants.push(obj)
          })
        }).catch((err) => {
          this.$message.error('获取用户列表失败' + err.message)
        })
      }
    },
    created() {
      this.getAllBillType()
      this.getQueryStatus()
      this.getWrhList()
      this.getUsers()
      this.clearSelection()
      // for (const item in this.productList) {
      //   this.productList[item].consumeAmount = 0
      //   this.productList[item].lineNum = Number(item) + 1
      //   this.productList[item].consumeQty = 0
      //   this.productList[item].consumeQtystr = 0
      //   this.productList[item].stockId = this.productList[item].id
      // }
      this.calcProduct(this.productList)
    },
    beforeRouteEnter(to, from, next) {
      next(vm => {
        // 通过 `vm` 访问组件实例
        vm.productList = vm.$store.state.bill.multipleSelection.concat(vm.productList)
        const arr = Array.from(new Set(vm.productList))
        // for (const item in arr) {
        //   arr[item].consumeAmount = 0
        //   arr[item].lineNum = Number(item) + 1
        //   arr[item].consumeQty = 0
        //   arr[item].consumeQtystr = 0
        //   arr[item].stockId = arr[item].id
        // }
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
