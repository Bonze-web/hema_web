<template>
    <div>
        <div class="head" v-if="status === 'create'">
            <div style="margin-top:8px" v-if="status === 'create'">新建损耗单</div>
            <div style="margin-top:8px" v-else>编辑</div>
            <div>
                <el-button @click="back">取消</el-button>
                <el-button type="primary" @click="createBill(false)" v-if="hasPermission(PermIds.WMS_DECINVBILL_CREATE)">保存</el-button>
                <el-button type="primary" @click="createBill(true)" v-if="status === 'create' && hasPermission(PermIds.WMS_DECINVBILL_AUDIT)">保存并审核</el-button>
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
                                        <el-form-item label="损耗类型" prop="billTypeId">
                                          <el-select v-model="form.billTypeId" placeholder="请选择损耗类型">
                                            <el-option v-for="item in billTypeList" :key="item.id" :label="item.typeName" :value="item.id"></el-option>
                                          </el-select>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="6" class="info-box">
                                        <el-form-item label="仓库" prop="wrhId">
                                          <el-select v-model="form.wrhId" placeholder="请选择仓库" @visible-change="selectWrh">
                                            <el-option v-for="item in wrhList" :key="item.id" :label="'[' + item.code + ']' + item.name" :value="item.id"></el-option>
                                          </el-select>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="6" class="info-box">
                                        <el-form-item label="报损人" prop="decerName">
                                            <el-autocomplete
                                                class="inline-input"
                                                v-model="form.decerName"
                                                :fetch-suggestions="querySearch"
                                                placeholder="请输入报损人"
                                                :trigger-on-focus="false"
                                                @select="handleSelect"
                                            ></el-autocomplete>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                                <el-form-item label="备注">
                                    <textarea maxlength="200" v-model="form.remark"></textarea>
                                </el-form-item>
                                <div class="info-title">
                                    <div>
                                        商品
                                    <!-- <router-link @click="batchAddProduct" style="color:#409EFF" :to="{ path: '/wrhmanagement/lossbill/batchAdd' }"> -->
                                        <el-button size="mini" type="text" @click="batchAddProduct">批量添加</el-button>
                                    <!-- </router-link> -->
                                    </div>
                                    <div class="list-count">
                                        <div>总数:{{ form.totalQtystr ? form.totalQtystr : 0 }},</div>
                                        <div>总品相数:{{ form.totalProductCount ? form.totalProductCount : 0 }},</div>
                                        <div>总金额:{{ form.totalAmount ? form.totalAmount : 0 }}</div>
                                    </div>
                                </div>

                                    <el-table
                                        :data="productList"
                                        style="width: 100%;text-align:center"
                                    >
                                        <el-table-column fixed prop="billNumber" label="操作">
                                          <template slot-scope="scope">
                                            <el-button type="text" @click="deleteProduct(scope.$index)">删除</el-button>
                                          </template>
                                        </el-table-column>
                                        <el-table-column width="55" prop="billNumber" label="行">
                                          <template slot-scope="scope">
                                            {{ scope.$index + 1 }}
                                          </template>
                                        </el-table-column>
                                        <el-table-column width="100" prop="productName" label="商品"></el-table-column>
                                        <el-table-column width="100" prop="binCode" label="货位"></el-table-column>
                                        <el-table-column width="100" prop="binUsage" label="货位用途">
                                          <template slot-scope="scope">
                                            {{ scope.row.binUsage | binUsage }}
                                          </template>
                                        </el-table-column>
                                        <el-table-column width="100" prop="containerBarcode" label="容器"></el-table-column>
                                        <el-table-column width="100" prop="vendorName" label="供应商"></el-table-column>
                                        <el-table-column width="100" prop="productionBatch" label="批号"></el-table-column>
                                        <el-table-column width="100" prop="productionDate" label="生产日期"></el-table-column>
                                        <el-table-column width="100" prop="validDate" label="到效日期"></el-table-column>
                                        <el-table-column width="100" prop="qpcStr" label="规格/计量单位"></el-table-column>
                                        <el-table-column width="100" prop="price" label="单价"></el-table-column>
                                        <el-table-column width="100" prop="batch" label="批次"></el-table-column>
                                        <el-table-column width="100" prop="qty" label="可用库存数量"></el-table-column>
                                        <el-table-column width="100" prop="consumeQtystr" label="损耗件数">
                                          <template slot-scope="scope">
                                            <el-input type="number" max="100" @change="calcProduct" size="mini" v-model="scope.row.consumeQtystr"></el-input>
                                          </template>
                                        </el-table-column>
                                        <el-table-column width="100" prop="consumeQty" label="损耗数量">
                                          <template slot-scope="scope">
                                            <el-input type="number" max="100" @change="calcProduct" size="mini" v-model="scope.row.consumeQty"></el-input>
                                          </template>
                                        </el-table-column>
                                        <el-table-column width="100" prop="amount" label="损耗金额">
                                          <template slot-scope="scope">
                                            {{ ((Number(scope.row.consumeQtystr) * (scope.row.qpc) ? Number(scope.row.consumeQtystr) * (scope.row.qpc) : 0)  + (Number(scope.row.consumeQty) ? Number(scope.row.consumeQty) : 0)) * scope.row.price ? (((Number(scope.row.consumeQtystr) * (scope.row.qpc) ? Number(scope.row.consumeQtystr) * (scope.row.qpc) : 0)  + (Number(scope.row.consumeQty) ? Number(scope.row.consumeQty) : 0)) * scope.row.price).toFixed(2) : 0 }}
                                          </template>
                                        </el-table-column>
                                        <el-table-column width="100" prop="itemRemark" label="备注">
                                          <template slot-scope="scope">
                                            <textarea v-model="scope.row.itemRemark"></textarea>
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
import UserService from "@/api/service/UserService";
import BillTypeService from "@/api/service/BillTypeService"
import MemberService from "@/api/service/MemberService"
import StorageService from "@/api/service/StorageService"
import PermIds from "@/api/permissionIds";
import { mapGetters, mapActions } from "vuex";

export default {
  data() {
      return {
        restaurants: [], // 报损人列表
        wrhList: [], // 仓库列表
        deccerList: [], // 报损人列表
        PermIds: PermIds,
        dcList: [], // 中心仓列表
        status: '', // 页面状态
        form: {
          id: '',
          code: '',
          billType: '', // 损耗单据类型
          wrhId: '',
          decerName: '',
          decerId: '', // 报损员
          remark: '',
          version: '',
          billTypeId: '', // 损耗类型
          expireDate: '', // 到效期
          isTest: false, // 是否现场测试
          realTotalAmount: '', // 实际总金额
          realTotalProductCount: '', // 实际总品项数
          realTotalQtystr: '', // 实际总件数
          realTotalVolume: '', // 实际总体积
          realTotalWeight: '', // 实际总质量
          srcBillId: '', // 来源单据
          srcBillNumber: '', // 来源单号
          srcBillType: '', // 来源单据类型
          status: 'SAVED', // 状态
          stockList: [], // 损耗集合
          totalAmount: '', // 总金额
          totalProductCount: '', // 总品相数
          totalQtystr: '', // 总件数（1+1）
          totalVolume: '', // 总体积
          totalWeight: '' // 总质量
        },
        createRules: {
          billTypeId: [
            { required: true, message: '请选择损耗单类型', trigger: 'blur'}
          ],
          wrhId: [
            { required: true, message: '请选择所属仓库', trigger: 'blur'}
          ],
          decerName: [
            { required: true, message: '请选择报损人', trigger: 'blur'}
          ]
        },
        productList: [], // 报损商品列表
        billTypeList: [] // 损耗类型
      }
    },
    computed: {
      ...mapGetters(["hasPermission"])
    },
    methods: {
      ...mapActions(["deleteSelection", "clearSelection"]),
      selectWrh: function(e) {
        if (e && this.form.wrhId && this.productList.length > 0) {
          this.$confirm('更换仓库将会清空商品明细, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.clearSelection()
            this.productList = []
            this.form.wrhId = ''
            this.form.totalAmount = 0
            this.form.totalProductCount = 0
            this.form.totalQtystr = 0 + '+' + 0
          })
        }
      },
      batchAddProduct: function() {
        if (!this.form.wrhId) {
          this.$message.error('请选择仓库')
          return
        }
        this.$router.push({path: '/wrhmanagement/lossbill/batchAdd', query: {id: this.form.wrhId}})
      },
      handleSelect: function(e) {
        console.log(e)
        this.form.decerId = e.id
      },
      deleteProduct: function(index) {
        this.deleteSelection(index)
        this.productList.splice(index, 1)
        // let arr = []
        // this.productList.forEach(item => {
        //   arr.push()
        // })
        let arr = []
        this.productList.forEach(item => {
          arr.push(item.productId)
        })
        const arr1 = Array.from(new Set(this.productList))
        arr = Array.from(new Set(arr))
        this.productList = arr1
        this.form.totalProductCount = arr.length

        // const arr = Array.from(new Set(this.productList))
        // this.form.totalProductCount = arr.length
        // this.productList = arr
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
        }
        this.form.stockList = []
          this.productList.forEach((item) => {
            this.form.stockList.push({
              consumeAmount: item.consumeAmount,
              lineNum: item.lineNum,
              consumeQty: item.consumeQty ? item.consumeQty : 0,
              consumeQtystr: item.consumeQtystr ? item.consumeQtystr : 0,
              stockId: item.id,
              itemRemark: item.itemRemark
            })
          })
        for (const item in this.productList) {
          if (!this.productList[item].consumeQty && !this.productList[item].consumeQtystr) {
            this.$message.error('请填写商品数')
            return
          }
        }
        _this.$refs.form.validate(valid => {
          if (valid) {
            if (reset) {
              _this.form.realTotalAmount = _this.form.totalAmount
              _this.form.realTotalProductCount = _this.form.totalProductCount
            }
            BillService.createLossBill(this.form)
            .then((res) => {
              _this.$message.success('创建成功')
              _this.$store.dispatch("tagsView/delView", _this.$route);
              _this.$router.go(-1)
            })
            .catch((err) => {
              _this.form.stockList = []
              // const arr = Array.from(new Set(this.productList))
              // this.productList = arr
              // this.form.totalProductCount = arr.length
              let arr = []
              this.productList.forEach(item => {
                arr.push(item.productId)
              })
              const arr1 = Array.from(new Set(this.productList))
              arr = Array.from(new Set(arr))
              this.productList = arr1
              this.form.totalProductCount = arr.length
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
          // 搜索报损人
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
          type: 'DECINV'
        }
        BillTypeService.getQueryType(data)
        .then((res) => {
            this.billTypeList = res
        })
        .catch((err) => {
            this.$message.error('获取损耗类别失败' + err.message)
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
        this.form.totalAmount = ''
        this.form.totalQtystr = ''
        let consumeQtystr = ''
        let consumeQty = ''
        console.log(this.productList)
        this.productList.forEach(item => {
          // item.consumeQtystr = item.consumeQtystr ? item.consumeQtystr : 0
          // item.consumeQty = item.consumeQty ? item.consumeQty : 0
          item.lineNum = this.productList.indexOf(item) + 1
          item.consumeAmount = ((Number(item.consumeQtystr) * (item.price) * item.qpc ? Number(item.consumeQtystr) * (item.price) * item.qpc : 0) + (Number(item.consumeQty) * item.price ? Number(item.consumeQty) * item.price : 0)).toFixed(2) 
          // this.form.realTotalAmount += item.consumeAmount
          consumeQtystr = Number(consumeQtystr) + (Number(item.consumeQtystr) ? Number(item.consumeQtystr) : 0)
          consumeQty = Number(consumeQty) + (Number(item.consumeQty) ? Number(item.consumeQty) : 0)
          if (Number(item.consumeQtystr) * item.qpc > Number(item.qty) || Number(item.consumeQty) + Number(item.consumeQtystr) * item.qpc > Number(item.qty) || Number(item.consumeQty) < 0 || Number(item.consumeQtystr) < 0) {
            this.$message.error('请输入正确数据')
            consumeQtystr = Number(consumeQtystr) - Number(item.consumeQtystr)
            consumeQty = Number(consumeQty) - Number(item.consumeQty)
            if ('consumeQtystr' in item) {
              item.consumeQtystr = ''
            }
            if ('consumeQty' in item) {
              item.consumeQty = ''
            }
          }
          console.log(consumeQty)
          this.form.totalQtystr = consumeQtystr * item.qpc + consumeQty
          this.form.totalAmount = (Number(this.form.totalAmount) + Number(item.consumeAmount)).toFixed(2)
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
      },
      getLoginUser() {
        UserService.getLoginUser()
        .then((result) => {
          console.log(result)
          this.form.decerName = result.username
          this.form.decerId = result.id
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
      this.getUsers()
      for (const item in this.productList) {
        this.productList[item].consumeAmount = 0
        this.productList[item].lineNum = Number(item) + 1
        this.productList[item].consumeQty = 0
        this.productList[item].consumeQtystr = 0
        this.productList[item].stockId = this.productList[item].id
      }
      this.calcProduct(this.productList)
    },
    beforeRouteEnter(to, from, next) {
      next(vm => {
        // 通过 `vm` 访问组件实例
        vm.productList = vm.$store.state.bill.multipleSelection
        let arr = []
        vm.productList.forEach(item => {
          arr.push(item.productId)
        })
        const arr1 = Array.from(new Set(vm.productList))
        arr = Array.from(new Set(arr))
        vm.productList = arr1
        vm.form.totalProductCount = arr.length
      })
    },
    filters: {
      binUsage(type) {
      switch (type) {
        case "UNIFYRECEIVE":
          return "统配收货暂存位"
        case "PUTAWAY":
          return "上架中转位"
        case "PICK":
          return "拣货位"
        case "STORAGE":
          return "存储位"
        case "PICKSTORAGE":
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
        default:
          return "未知"
      }
    }
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
