<template>
    <div>
        <div v-if="status === 'read'">
          <div class="head" v-if="status === 'edit'">
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
                <div class="status">{{ billInfo.status | billStatus }}</div>
                <div style="margin:8px">{{ '溢余单：' + billInfo.billNumber }}</div>
            </div>
            <div v-show="!check">
                <el-button @click="back" >返回</el-button>
                <!-- <el-button @click="statusChange" >打印</el-button> -->
                <!-- <el-button @click="removeLossBill" >删除</el-button> -->
                <el-button v-if="form.status !== 'AUDITED' && hasPermission(PermIds.WMS_INCINVBILL_UPDATE)" @click="editLossBill" >编辑</el-button>
                <el-button type="primary" v-if="form.status !== 'AUDITED'" @click="check = true">审核</el-button>
                <!-- <el-button type="primary" @click="editContainerType" :disabled="!billInfo.status" v-if="hasPermission(PermIds.WMS_CONTAINER_TYPE_UPDATE)">编辑</el-button> -->
            </div>
            <div v-show="check">
                <el-button @click="closeCheck" >取消</el-button>
                <el-button type="primary" @click="subCheck">审核</el-button>
                <!-- <el-button type="primary" @click="editContainerType" :disabled="!billInfo.status" v-if="hasPermission(PermIds.WMS_CONTAINER_TYPE_UPDATE)">编辑</el-button> -->
            </div>
        </div>
        <div style="height:20px" />
        <div class="info-content" v-if="status === 'read'">
            <div>
                <template>
                    <el-tabs v-model="tabActiveName" @tab-click="tabClick">
                        <el-tab-pane label="溢余单" name="containerType">
                            <div class="info-title">概要</div>
                            <el-col :span="6" class="info-box">
                                <div>溢余类型:</div>
                                <div>{{ billInfo.billTypeName }}</div>
                            </el-col>
                            <el-col :span="6" class="info-box">
                                <div>仓库:</div>
                                <div>{{ billInfo.wrhName }}</div>
                            </el-col>
                            <el-col :span="6" class="info-box">
                                <div>报告员:</div>
                                <div>{{ billInfo.incerName }}</div>
                            </el-col>
                            <el-col :span="6" class="info-box">
                                <div>创建时间:</div>
                                <div>{{ billInfo.createTime }}</div>
                            </el-col>
                            <el-col :span="6" class="info-box">
                                <div>单据来源:</div>
                                <div>{{ billInfo.srcBillNumber ? billInfo.srcBillNumber : "&lt;空&gt;" }}</div>
                            </el-col>
                            <div>
                              <el-col class="info-box">
                                <div>备注:</div>
                                <div>{{ billInfo.remark ? billInfo.remark : "&lt;空&gt;" }}</div>
                              </el-col>
                            </div>
                            <el-col>
                              <div class="info-title">商品</div>
                            </el-col>
                            <el-table
                                        :data="productList"
                                        style="width: 100%;text-align:center"
                                    >
                                        <el-table-column width="55" prop="line" label="行">
                                          <template slot-scope="scope">
                                            {{ scope.$index + 1 }}
                                          </template>
                                        </el-table-column>
                                        <el-table-column width="100" prop="productName" label="商品/商品规格"></el-table-column>
                                        <el-table-column width="100" prop="qpcStr" label="规格/计量单位"></el-table-column>
                                        <el-table-column width="100" prop="binCode" label="货位"></el-table-column>
                                        <el-table-column width="100" prop="containerBarcode" label="容器"></el-table-column>
                                        <el-table-column width="100" prop="productionDate" label="生产日期"></el-table-column>
                                        <el-table-column width="100" prop="validDate" label="到效日期"></el-table-column>
                                        <el-table-column width="100" prop="productionBatch" label="批号"></el-table-column>
                                        <el-table-column width="100" prop="batch" label="批次"></el-table-column>
                                        <el-table-column width="100" prop="consumeQtystr" label="溢余件数"></el-table-column>
                                        <el-table-column width="100" prop="consumeQty" label="溢余数量"></el-table-column>
                                        <el-table-column width="100" prop="realQtystr" label="实际件数" v-if="form.status === 'AUDITED'">
                                          <template slot-scope="scope">
                                            {{ scope.row.realQtystr }}
                                          </template>
                                        </el-table-column>
                                        <el-table-column width="100" prop="realQty" label="实际数量"  v-if="form.status === 'AUDITED'">
                                          <template slot-scope="scope">
                                            {{ scope.row.realQty }}
                                          </template>
                                        </el-table-column>
                                        <el-table-column width="100" prop="realQtystr" label="实际件数" v-if="check">
                                          <template slot-scope="scope">
                                            <el-input type="number" max="100" @input="calcProduct" size="mini" v-model="scope.row.realQtystr"></el-input>
                                          </template>
                                        </el-table-column>
                                        <el-table-column width="100" prop="realQty" label="实际数量" v-if="check">
                                          <template slot-scope="scope">
                                            <el-input type="number" max="100" @input="calcProduct" size="mini" v-model="scope.row.realQty"></el-input>
                                          </template>
                                        </el-table-column>
                                        <el-table-column width="100" prop="price" label="单价"></el-table-column>
                                        <el-table-column width="100" prop="consumeAmount" label="溢余金额"></el-table-column>
                                        <el-table-column width="100" prop="realAmount" label="实际溢余金额"></el-table-column>
                                        <el-table-column width="100" prop="remark" label="备注"></el-table-column>
                                    </el-table>
                        </el-tab-pane>
                        <!-- <el-tab-pane label="配送中心范围" name="range">配置管理</el-tab-pane> -->
                        <el-tab-pane label="操作日志" name="log">
                          <system-log modular="DECINVBILL"></system-log>
                        </el-tab-pane>
                    </el-tabs>
                </template>
            </div>
        </div>
        </div>
        <div  v-if="status === 'edit'">
          <div>
        <div class="head">
            <div style="margin-top:8px" v-if="status === 'create'">新建溢余单</div>
            <div style="margin-top:8px" v-else>编辑</div>
            <div>
                <el-button @click="close">取消</el-button>
                <el-button type="primary" @click="createBill(false)">保存</el-button>
                <el-button type="primary" @click="createBill(true)" v-if="status === 'create'">保存并审核</el-button>
            </div>
        </div>
        <div style="height:20px" />
        <div class="info-content">
            <div>
                <template>
                    
                            <el-form :model="form" :rules="createRules" ref="form" label-width="100px" class="demo-ruleForm">
                                <div class="info-title">基本信息</div>
                                <el-row :gutter="20">
                                    <el-col :span="6" class="info-box">
                                        <el-form-item label="溢余类型" prop="billTypeId">
                                          <el-select v-model="form.billTypeId" placeholder="请选择溢余类型">
                                            <el-option v-for="item in billTypeList" :key="item.id" :label="item.typeName" :value="item.id"></el-option>
                                          </el-select>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="6" class="info-box">
                                        <el-form-item label="仓库" prop="wrhId">
                                          <el-select v-model="form.wrhId" placeholder="请选择仓库">
                                            <el-option v-for="item in wrhList" :key="item.id" :label="'[' + item.code + ']' + item.name" :value="item.id"></el-option>
                                          </el-select>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="6" class="info-box">
                                        <el-form-item label="报告人" prop="incerName">
                                            <el-autocomplete
                                                class="inline-input"
                                                v-model="form.incerName"
                                                :fetch-suggestions="querySearch"
                                                placeholder="请输入报告人"
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
                                        <el-table-column width="100" prop="binUsage" label="货位用途"></el-table-column>
                                        <el-table-column width="100" prop="containerBarcode" label="容器"></el-table-column>
                                        <el-table-column width="100" prop="vendorName" label="供应商"></el-table-column>
                                        <el-table-column width="100" prop="productionBatch" label="批号"></el-table-column>
                                        <el-table-column width="100" prop="productionDate" label="生产日期"></el-table-column>
                                        <el-table-column width="100" prop="validDate" label="到效日期"></el-table-column>
                                        <el-table-column width="100" prop="qpcStr" label="规格/计量单位"></el-table-column>
                                        <el-table-column width="100" prop="price" label="单价"></el-table-column>
                                        <el-table-column width="100" prop="batch" label="批次"></el-table-column>
                                        <el-table-column width="100" prop="stockQty" label="可用库存数量">
                                          <template slot-scope="scope">
                                            {{ scope.row.qty ? scope.row.qty : scope.row.stockQty }}
                                          </template>
                                        </el-table-column>
                                        <el-table-column width="100" prop="consumeQtystr" label="溢余件数">
                                          <template slot-scope="scope">
                                            <el-input type="number" max="100" @change="calcProductEdit" size="mini" v-model="scope.row.consumeQtystr"></el-input>
                                          </template>
                                        </el-table-column>
                                        <el-table-column width="100" prop="consumeQty" label="溢余数量">
                                          <template slot-scope="scope">
                                            <el-input type="number" max="100" @change="calcProductEdit" size="mini" v-model="scope.row.consumeQty"></el-input>
                                          </template>
                                        </el-table-column>
                                        <el-table-column width="100" prop="consumeAmount" label="溢余金额">
                                          <template slot-scope="scope">
                                            {{ (Number(scope.row.consumeQtystr) + Number(scope.row.consumeQty)) * scope.row.price ? (Number(scope.row.consumeQtystr) + Number(scope.row.consumeQty)) * scope.row.price : 0 }}
                                          </template>
                                        </el-table-column>
                                        <el-table-column width="100" prop="remark" label="备注">
                                          <template slot-scope="scope">
                                            <textarea v-model="scope.row.remark"></textarea>
                                          </template>
                                        </el-table-column>
                                    </el-table>
                            </el-form>      
                </template>
            </div>
        </div>
    </div>
        </div>
    </div>
</template>

<script>
import systemLog from "@/components/systemLog.vue";
import BillService from "@/api/service/BillService";
import BillTypeService from "@/api/service/BillTypeService"
import StorageService from "@/api/service/StorageService"
import MemberService from "@/api/service/MemberService"
import PermIds from "@/api/permissionIds";
import { mapGetters, mapActions } from "vuex";

export default {
  data() {
      return {
        check: false,
        PermIds: PermIds,
        status: '', // 页面状态
        id: '', // 单据ID
        tabActiveName: 'containerType', // tab栏名称
        billInfo: '',
        wrhList: [], // 仓库列表
        deccerList: [], // 报告人列表
        dcList: [], // 中心仓列表
        form: {
          id: '',
          code: '',
          billType: '', // 溢余单据类型
          wrhId: '',
          incerId: '', // 报告员
          remark: '',
          version: '',
          billTypeId: '', // 溢余类型
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
          status: '', // 状态
          stockList: [], // 溢余集合
          totalAmount: '', // 总金额
          totalProductCount: '', // 总品相数
          totalQtystr: '', // 总件数（1+1）
          totalVolume: '', // 总体积
          totalWeight: '' // 总质量
        },
        restaurants: [],
        createRules: {
          billType: [
            { required: true, message: '请选择溢余单类型', trigger: 'blur'}
          ],
          wrhId: [
            { required: true, message: '请选择所属仓库', trigger: 'blur'}
          ],
          incerId: [
            { required: true, message: '请选择报告人', trigger: 'blur'}
          ]
        },
        productList: [], // 报告商品列表
        billTypeList: [] // 溢余类型
      }
    },
    components: {
      systemLog
    },
    computed: {
      ...mapGetters(["hasPermission"])
    },
    methods: {
      close: function() {
        this.clearSelection()
        this.getBillDetail()
        // this.calcProduct(this.$store.state.bill.multipleSelection)
        this.status = 'read'
      },
      closeCheck: function() {
        this.check = false
        for (const item in this.productList) {
            this.productList[item].realAmount = this.productList[item].consumeAmount
            this.productList[item].lineNum = 0
            this.productList[item].realQty = this.productList[item].qty
            this.productList[item].realQtystr = this.productList[item].qtystr
            this.productList[item].stockId = this.productList[item].id
          }
      },
      subCheck: function() {
        this.createBill(true)
      },
      getQueryStatus: function() {
        this.status = this.$route.query.status
        if (this.status === 'read') {
          this.id = this.$route.query.id
          this.getBillDetail(this.id)
        }
      },
      ...mapActions(["deleteSelection", "addSelection", "clearSelection"]),
      batchAddProduct: function() {
        if (!this.form.wrhId) {
          this.$message.error('请选择仓库')
          return
        }
        this.$router.push({path: '/wrhmanagement/overflowbill/batchAdd', query: {id: this.form.wrhId}})
      },
      handleSelect: function(e) {
        console.log(e)
        this.form.incerId = e.id
      },
      deleteProduct: function(index) {
        this.deleteSelection(index)
        const arr = Array.from(new Set(this.productList))
        this.form.realtotalProductCount = arr.length
        this.productList = arr
        this.productList.splice(index, 1)
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
          this.form.stockList = []
          this.productList.forEach((item) => {
            this.form.stockList.push({
              consumeAmount: item.consumeAmount,
              lineNum: item.lineNum,
              consumeQty: item.consumeQty,
              consumeQtystr: item.consumeQtystr,
              stockId: item.stockId ? item.stockId : item.id,
              realQty: item.realQty,
              realQtystr: item.realQtystr,
              realAmount: item.realAmount
            })
          })
        }
        if (this.check) {
          BillService.updateOverflowBill(this.form)
          .then((result) => {
            _this.$message.success('审核成功')
              _this.$store.dispatch("tagsView/delView", _this.$route);
              _this.$router.go(-1)
          }).catch((err) => {
            _this.$message.error('审核失败' + err.message)
          });
        } else {
          _this.$refs.form.validate(valid => {
            if (valid) {
              BillService.updateOverflowBill(this.form)
              .then((res) => {
                _this.$message.success('更新成功')
                _this.clearSelection()
                _this.$store.dispatch("tagsView/delView", _this.$route);
                _this.$router.go(-1)
              })
              .catch((err) => {
                _this.$message.error('更新失败' + err.message)
              })
            }
          })
        } 
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
            this.$message.error('获取溢余类别失败' + err.message)
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
        this.form.realTotalAmount = ''
        this.form.realtotalQtystr = ''
        let realQtystr = ''
        let realQty = ''
        this.productList.forEach(item => {
          console.log(item)
          item.lineNum = this.productList.indexOf(item) + 1
          item.realAmount = Number(item.realQtystr) * item.price + Number(item.realQty) * item.price 
          this.form.realTotalAmount += item.realAmount
          realQtystr = Number(realQtystr) + Number(item.realQtystr)
          realQty = Number(realQty) + Number(item.realQty)
          console.log(realQty)
          this.form.realTotalQtystr = realQtystr + '+' + realQty
          this.form.realTotalAmount = Number(this.form.totalAmount) + Number(item.realAmount)
          console.log(item)
        });
      },
      calcProductEdit: function(productList) {
        this.form.totalAmount = ''
        this.form.totalQtystr = ''
        let consumeQtystr = ''
        let consumeQty = ''
        this.productList.forEach(item => {
          item.lineNum = this.productList.indexOf(item) + 1
          item.consumeAmount = Number(item.consumeQtystr) * item.price + Number(item.consumeQty) * item.price 
          this.form.realTotalAmount += item.consumeAmount
          consumeQtystr = Number(consumeQtystr) + Number(item.consumeQtystr)
          consumeQty = Number(consumeQty) + Number(item.consumeQty)
          if (Number(item.consumeQty) + Number(item.consumeQtystr) > Number(item.qty) || Number(item.consumeQty) < 0 || Number(item.consumeQtystr) < 0) {
            this.$message.error('请输入正确的数据')
            consumeQtystr = 0
            consumeQty = 0
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
        MemberService.query(1, 0, {nameLike: this.form.incerName})
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
      tabClick: function() {  
      },
      getBillDetail: function(id) {
        BillService.getOverflowBillDetail(this.id)
        .then((result) => {
          this.billInfo = result
          this.productList = result.stockList
          for (const item in this.productList) {
            this.productList[item].realAmount = result.status === "AUDITED" ? this.productList[item].realAmount : this.productList[item].consumeAmount
            this.productList[item].lineNum = 0
            this.productList[item].realQty = this.productList[item].consumeQty
            this.productList[item].realQtystr = this.productList[item].consumeQtystr
            this.productList[item].stockId = this.productList[item].stockId ? this.productList[item].stockId : this.productList[item].id
          }
          this.form.totalAmount = result.totalAmount
          this.form.realtotalQtystr = result.realTotalQtystr
          const arr = Array.from(new Set(this.productList))
          this.form.realtotalProductCount = arr.length
          this.form = Object.assign(this.form, this.billInfo)
        }).catch((err) => {
          this.$message.error('获取详情失败' + err.message)
        });
      },
      editLossBill: function() {
        this.status = 'edit'
        this.getWrhList()
        this.addSelection(this.productList)
      }
    },
    created() {
      this.getUsers()
      this.getAllBillType()
      this.getQueryStatus()
      this.getWrhList()
    },
    beforeRouteEnter(to, from, next) {
      next(vm => {
        // 通过 `vm` 访问组件实例
        // if ()
        vm.productList = vm.$store.state.bill.multipleSelection
        const arr = Array.from(new Set(vm.productList))
        vm.productList = arr
        vm.form.totalProductCount = arr.length
      })
    },
    filters: {
      billStatus(status) {
        switch (status) {
          case "SAVED":
            return "已保存"
          case "AUDITED":
            return "已审核"
          default:
            return "未知";
        }
      }
    }
};
</script>

<style lang="scss" scoped>
// @import "src/styles/mixin.scss";
.status{
  background: #66ff99;
  border-radius: 8px;
  padding: 4px;
  height: 32px;
  line-height: 26px;
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
    display: flex;
    justify-content: space-between;
}
.list-count{
    display: flex;
}
</style>
