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
                <el-button @click="deleteOverflowBill" v-if="hasPermission(PermIds.WMS_INCINVBILL_DELETE)">删除</el-button>
                <el-button v-if="form.status !== 'AUDITED' && hasPermission(PermIds.WMS_INCINVBILL_UPDATE)" @click="editOverflowBill" >编辑</el-button>
                <el-button type="primary" v-if="form.status !== 'AUDITED' && hasPermission(PermIds.WMS_INCINVBILL_AUDIT)" @click="check = true">审核</el-button>
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
                        <el-tab-pane label="溢余单" name="overflowBill">
                            <div class="info-title">概要</div>
                            <el-col :span="6" class="info-box">
                                <div>溢余类型:</div>
                                <div>{{ billInfo.billTypeName }}</div>
                            </el-col>
                            <!-- <el-col :span="6" class="info-box">
                                <div>仓区:</div>
                                <div>{{ billInfo.wrhName }}</div>
                            </el-col> -->
                            <el-col :span="6" class="info-box">
                                <div>报溢员:</div>
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
                                        <el-table-column prop="productName" label="商品/商品规格">
                                          <template slot-scope="scope">
                                            {{ scope.row.productName + '/' + scope.row.spec }}
                                          </template>
                                        </el-table-column>
                                        <el-table-column prop="qpcStr" label="商品包装/计量单位">
                                          <template slot-scope="scope">
                                            {{ scope.row.qpcStr + '/' + scope.row.munit }}
                                          </template>
                                        </el-table-column>
                                        <el-table-column prop="binCode" label="货位"></el-table-column>
                                        <el-table-column prop="containerBarcode" label="容器"></el-table-column>
                                        <!-- <el-table-column prop="productionDate" label="生产日期"></el-table-column> -->
                                        <!-- <el-table-column prop="validDate" label="到效日期"></el-table-column> -->
                                        <!-- <el-table-column prop="productionBatch" label="批号"></el-table-column> -->
                                        <!-- <el-table-column prop="batch" label="批次"></el-table-column> -->
                                        <el-table-column prop="consumeQtystr" label="溢余件数"></el-table-column>
                                        <el-table-column prop="consumeQty" label="溢余数量"></el-table-column>
                                        <el-table-column prop="realQtystr" label="实际件数" v-if="form.status === 'AUDITED'">
                                          <template slot-scope="scope">
                                            {{ scope.row.realQtystr }}
                                          </template>
                                        </el-table-column>
                                        <el-table-column prop="realQty" label="实际数量"  v-if="form.status === 'AUDITED'">
                                          <template slot-scope="scope">
                                            {{ scope.row.realQty }}
                                          </template>
                                        </el-table-column>
                                        <el-table-column prop="realQtystr" label="实际件数" v-if="check">
                                          <template slot-scope="scope">
                                            <el-input type="number" max="100" @input="calcProduct" size="mini" v-model="scope.row.realQtystr"></el-input>
                                          </template>
                                        </el-table-column>
                                        <el-table-column prop="realQty" label="实际数量" v-if="check">
                                          <template slot-scope="scope">
                                            <el-input type="number" max="100" @input="calcProduct" size="mini" v-model="scope.row.realQty"></el-input>
                                          </template>
                                        </el-table-column>
                                        <!-- <el-table-column prop="price" label="单价"></el-table-column> -->
                                        <!-- <el-table-column prop="consumeAmount" label="溢余金额"></el-table-column> -->
                                        <el-table-column prop="realAmount" label="实际溢余金额"></el-table-column>
                                        <el-table-column prop="remark" label="备注"></el-table-column>
                                    </el-table>
                        </el-tab-pane>
                        <!-- <el-tab-pane label="配送中心范围" name="range">配置管理</el-tab-pane> -->
                        <el-tab-pane label="操作日志" name="log">
                          <system-log modular="INCINVBILL" :id="id"></system-log>
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
                                    <!-- <el-col :span="6" class="info-box">
                                        <el-form-item label="仓区" prop="wrhId">
                                          <el-select v-model="form.wrhId" placeholder="请选择仓区" @visible-change="selectWrh">
                                            <el-option v-for="item in wrhList" :key="item.id" :label="'[' + item.code + ']' + item.name" :value="item.id"></el-option>
                                          </el-select>
                                        </el-form-item>
                                    </el-col> -->
                                    <el-col :span="6" class="info-box">
                                        <el-form-item label="报溢员" prop="incerName">
                                          <el-select
                                              v-model="form.incerName"
                                              filterable
                                              remote
                                              placeholder="请输入报溢员名称"
                                              :remote-method="getUsers"
                                              @change="handleSelect">
                                              <el-option
                                                v-for="item in restaurants"
                                                :key="item.id"
                                                :label="'[' + item.username + ']' + item.realName"
                                                :value="item.username">
                                              </el-option>
                                            </el-select>
                                            <!-- <el-autocomplete
                                                class="inline-input"
                                                v-model="form.incerName"
                                                :fetch-suggestions="querySearch"
                                                placeholder="请输入报溢员"
                                                :trigger-on-focus="false"
                                                @select="handleSelect"
                                            ></el-autocomplete> -->
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                                <el-form-item label="备注">
                                    <textarea rows="5" maxlength="200" v-model="form.remark"></textarea>
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
                                        <div>总金额:{{ form.realTotalAmount ? form.realTotalAmount : 0 }}</div>
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
                                        <el-table-column prop="productName" label="商品"></el-table-column>
                                        <el-table-column prop="binCode" label="货位"></el-table-column>
                                        <el-table-column prop="binUsage" label="货位用途">
                                          <template slot-scope="scope">
                                            {{ scope.row.binUsage | binUsage }}
                                          </template>
                                        </el-table-column>
                                        <el-table-column prop="containerBarcode" label="容器"></el-table-column>
                                        <!-- <el-table-column prop="vendorName" label="供应商"></el-table-column> -->
                                        <!-- <el-table-column prop="productionBatch" label="批号"></el-table-column> -->
                                        <!-- <el-table-column prop="productionDate" label="生产日期"></el-table-column> -->
                                        <!-- <el-table-column prop="validDate" label="到效日期"></el-table-column> -->
                                        <el-table-column prop="qpcStr" label="商品包装/计量单位">
                                          <template slot-scope="scope">
                                            {{ scope.row.qpcStr + '/' + scope.row.munit }}
                                          </template>
                                        </el-table-column>
                                        <!-- <el-table-column prop="price" label="单价"></el-table-column> -->
                                        <!-- <el-table-column prop="batch" label="批次"></el-table-column> -->
                                        <el-table-column prop="stockQty" label="数量">
                                          <template slot-scope="scope">
                                            {{ scope.row.qty ? scope.row.qty : scope.row.stockQty }}
                                          </template>
                                        </el-table-column>
                                        <el-table-column prop="consumeQtystr" label="溢余件数">
                                          <template slot-scope="scope">
                                            <el-input type="number" max="100" @change="calcProductEdit" size="mini" v-model="scope.row.consumeQtystr"></el-input>
                                          </template>
                                        </el-table-column>
                                        <el-table-column prop="consumeQty" label="溢余数量">
                                          <template slot-scope="scope">
                                            <el-input type="number" max="100" @change="calcProductEdit" size="mini" v-model="scope.row.consumeQty"></el-input>
                                          </template>
                                        </el-table-column>
                                        <el-table-column prop="consumeAmount" label="溢余金额">
                                          <template slot-scope="scope">
                                            {{ (Number(scope.row.consumeQtystr) * scope.row.qpc + Number(scope.row.consumeQty)) * scope.row.price ? ((Number(scope.row.consumeQtystr) * scope.row.qpc + Number(scope.row.consumeQty)) * scope.row.price).toFixed(2) : 0 }}
                                          </template>
                                        </el-table-column>
                                        <el-table-column prop="remark" label="备注">
                                          <template slot-scope="scope">
                                            <textarea rows="2" maxlength="50" v-model="scope.row.remark"></textarea>
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
        tabActiveName: 'overflowBill', // tab栏名称
        billInfo: '',
        wrhList: [], // 仓区列表
        deccerList: [], // 报告人列表
        dcList: [], // 中心仓列表
        form: {
          id: '',
          code: '',
          billType: '', // 溢余单据类型
          // wrhId: '',
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
          // wrhId: [
          //   { required: true, message: '请选择所属仓区', trigger: 'blur'}
          // ],
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
      deleteOverflowBill: function() {
        this.$confirm("该操作将删除改损耗单据, 是否继续?", "提示", {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          BillService.deleteOverflowBill(this.id)
          .then((result) => {
            this.$message.success('删除成功')
            this.$store.dispatch("tagsView/delView", this.$route);
            this.$router.go(-1)
          }).catch((err) => {
            this.$message.error('删除失败' + err.message)
          });
        })
      },
      selectWrh: function(e) {
        if (e && this.form.wrhId) {
          this.$confirm('更换仓区将会清空商品明细, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.clearSelection()
            this.productList = []
            this.form.wrhId = ''
            this.form.totalAmount = 0
            this.form.totalProductCount = 0
            this.form.totalQtystr = 0
          })
        }
      },
      closeCheck: function() {
        this.check = false
        for (const item in this.productList) {
            this.productList[item].realAmount = this.productList[item].consumeAmount
            this.productList[item].lineNum = 0
            this.productList[item].realQty = this.productList[item].consumeQty
            this.productList[item].realQtystr = this.productList[item].consumeQtystr
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
        // if (!this.form.wrhId) {
        //   this.$message.error('请选择仓区')
        //   return
        // }
        this.$router.push({path: '/wrhmanagement/overflowbill/batchAdd'})
      },
      handleSelect: function(e) {
        console.log(e)
        this.form.incerId = e.id
      },
      deleteProduct: function(index) {
        this.deleteSelection(index)
        // const arr = Array.from(new Set(this.productList))
        // this.form.realtotalProductCount = arr.length
        // this.productList = arr
        let arr = []
        this.productList.forEach(item => {
          arr.push(item.productId)
        })
        const arr1 = Array.from(new Set(this.productList))
        arr = Array.from(new Set(arr))
        this.productList = arr1
        this.form.realtotalProductCount = arr.length
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
              consumeQty: item.consumeQty ? item.consumeQty : 0,
              consumeQtystr: item.consumeQtystr ? item.consumeQtystr : 0,
              stockId: item.stockId ? item.stockId : item.id,
              realQty: item.realQty ? item.realQty : 0,
              realQtystr: item.realQtystr ? item.realQtystr : 0,
              realAmount: item.realAmount
            })
          })
        }
        for (const item in this.productList) {
          if (!this.productList[item].consumeQty && !this.productList[item].consumeQtystr) {
            this.$message.error('请填写商品数')
            return
          }
        }
        if (reset) {
          _this.form.realTotalAmount = _this.form.totalAmount
          _this.form.realTotalProductCount = _this.form.totalProductCount
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
          this.$message.error('加载仓区失败' + err.message)
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
          item.realAmount = ((Number(item.realQtystr) * item.price * Number(item.qpc) ? Number(item.realQtystr) * item.price * Number(item.qpc) : 0) + (Number(item.realQty) * item.price ? Number(item.realQty) * item.price : 0)).toFixed(2) 
          // this.form.realTotalAmount += item.realAmount
          realQtystr = Number(realQtystr) + (Number(item.realQtystr) ? Number(item.realQtystr) : 0)
          realQty = Number(realQty) + (Number(item.realQty) ? Number(item.realQty) : 0)
          console.log(realQty)
          this.form.realTotalQtystr = realQtystr * item.qpc + realQty
          this.form.realTotalAmount = Number(this.form.totalAmount) + Number(item.realAmount)
          console.log(item)
        });
      },
      calcProductEdit: function(productList) {
        this.form.realTotalAmount = ''
        this.form.totalQtystr = ''
        let consumeQtystr = ''
        let consumeQty = ''
        this.productList.forEach(item => {
          item.lineNum = this.productList.indexOf(item) + 1
          // this.form.realTotalAmount += item.consumeAmount
          consumeQtystr = Number(consumeQtystr) + (Number(item.consumeQtystr) ? Number(item.consumeQtystr) : 0)
          consumeQty = Number(consumeQty) + (Number(item.consumeQty) ? Number(item.consumeQty) : 0)
          if (Number(item.consumeQty) < 0 || Number(item.consumeQtystr) < 0) {
            this.$message.error('请输入正确的数据')
            consumeQtystr = 0
            consumeQty = 0
            if ('consumeQtystr' in item) {
              item.consumeQtystr = ''
            }
            if ('consumeQty' in item) {
              item.consumeQty = ''
            }
            // item.consumeQtystr = 0
            // item.consumeQty = 0
          }
          item.consumeAmount = ((Number(item.consumeQtystr) * item.price * Number(item.qpc) ? Number(item.consumeQtystr) * item.price * Number(item.qpc) : 0) + (Number(item.consumeQty) * item.price ? Number(item.consumeQty) * item.price : 0)).toFixed(2) 
          console.log(item.consumeAmount)
          this.form.totalQtystr = consumeQtystr * item.qpc + consumeQty
          this.form.realTotalAmount = (Number(this.form.realTotalAmount) + Number(item.consumeAmount)).toFixed(2)
          console.log(item)
        });
      },
      getUsers: function(query) {
        this.restaurants = []
        MemberService.query(1, 0, {nameLike: query})
        .then((res) => {
          this.restaurants = res.records
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
            this.productList[item].realQty = this.productList[item].realQty ? this.productList[item].realQty : this.productList[item].consumeQty
            this.productList[item].realQtystr = this.productList[item].realQtystr ? this.productList[item].realQtystr : this.productList[item].consumeQtystr
            this.productList[item].stockId = this.productList[item].stockId ? this.productList[item].stockId : this.productList[item].id
          }
          this.form.realTotalAmount = result.realTotalAmount
          this.form.realtotalQtystr = result.realTotalQtystr
          // const arr = Array.from(new Set(this.productList))
          // this.form.realtotalProductCount = arr.length
          let arr = []
            this.productList.forEach(item => {
              arr.push(item.productId)
            })
            // const arr1 = Array.from(new Set(this.productList))
            arr = Array.from(new Set(arr))
            // this.productList = arr1
            this.form.realtotalProductCount = arr.length
          this.form = Object.assign(this.form, this.billInfo)
        }).catch((err) => {
          this.$message.error('获取详情失败' + err.message)
        });
      },
      editOverflowBill: function() {
        this.status = 'edit'
        this.tabActiveName = "overflowBill"
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
        if (vm.status !== "edit") {
          vm.getQueryStatus()
        }
        vm.productList = vm.$store.state.bill.multipleSelection
        // const arr = Array.from(new Set(vm.productList))
        // vm.productList = arr
        // vm.form.totalProductCount = arr.length
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
      billStatus(status) {
        switch (status) {
          case "SAVED":
            return "已保存"
          case "AUDITED":
            return "已审核"
          default:
            return "未知";
        }
      },
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
.status{
  background:#008000;
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
