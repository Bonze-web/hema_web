<template>
    <div>
        <div class="head" v-if="status === 'create'">
            <div style="margin-top:8px" v-if="status === 'create'">新建溢余单</div>
            <div style="margin-top:8px" v-else>编辑</div>
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
                                        <el-form-item label="报告人" prop="decerName">
                                          <el-select
                                              v-model="form.decerName"
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
                                                v-model="form.decerName"
                                                :fetch-suggestions="querySearch"
                                                placeholder="请输入报告人"
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
                                        <el-button size="mini" type="text" @click="addProduct">单个添加</el-button>
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
                                        <!-- <el-table-column width="100" prop="vendorName" label="供应商"></el-table-column> -->
                                        <!-- <el-table-column width="100" prop="productionBatch" label="批号"></el-table-column> -->
                                        <!-- <el-table-column width="100" prop="productionDate" label="生产日期"></el-table-column> -->
                                        <!-- <el-table-column width="100" prop="validDate" label="到效日期"></el-table-column> -->
                                        <el-table-column width="100" prop="qpcStr" label="商品包装/计量单位">
                                          <template slot-scope="scope">
                                            {{ scope.row.spec ? scope.row.spec : scope.row.qpcStr }}
                                          </template>
                                        </el-table-column>
                                        <!-- <el-table-column width="100" prop="price" label="单价"></el-table-column> -->
                                        <!-- <el-table-column width="100" prop="batch" label="批次"></el-table-column> -->
                                        <el-table-column width="100" prop="qty" label="数量"></el-table-column>
                                        <el-table-column width="100" prop="consumeQtystr" label="溢余件数">
                                          <template slot-scope="scope">
                                            <el-input type="number" max="100" @change="calcProduct" size="mini" v-model="scope.row.consumeQtystr"></el-input>
                                          </template>
                                        </el-table-column>
                                        <el-table-column width="100" prop="consumeQty" label="溢余数量">
                                          <template slot-scope="scope">
                                            <el-input type="number" max="100" @change="calcProduct" size="mini" v-model="scope.row.consumeQty"></el-input>
                                          </template>
                                        </el-table-column>
                                        <el-table-column width="100" prop="amount" label="溢余金额">
                                          <template slot-scope="scope">
                                            {{ (Number(scope.row.consumeQtystr) + Number(scope.row.consumeQty)) * scope.row.price ? ((Number(scope.row.consumeQtystr) + Number(scope.row.consumeQty)) * scope.row.price).toFixed(2) : 0 }}
                                          </template>
                                        </el-table-column>
                                        <el-table-column width="100" prop="remark" label="备注">
                                          <template slot-scope="scope">
                                            <textarea rows="5" v-model="scope.row.remark"></textarea>
                                          </template>
                                        </el-table-column>
                                    </el-table>
                            </el-form>      
                </template>
            </div>
            <el-dialog title="单个新增商品" width="600px" :visible.sync="addProductDialog">

              <el-form :model="product" :rules="rules" ref="product">
                <el-form-item label="商品" :label-width="formLabelWidth" prop="productUuid">
                  <el-select
                    v-model="product.productUuid"
                    filterable
                    remote
                    placeholder="请输入商品"
                    :remote-method="getProduct"
                    @change="handleSelect1">
                    <el-option
                      v-for="item in allProducet"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id">
                    </el-option>
                  </el-select>
                  <!-- <el-autocomplete
                    class="inline-input"
                    v-model="product.productName"
                    :fetch-suggestions="querySearchProduct"
                    placeholder="请输入商品"
                    :trigger-on-focus="false"
                    @select="handleSelect1"
                ></el-autocomplete> -->
                </el-form-item>
                <el-form-item label="生产批号" :label-width="formLabelWidth" prop="productBirthBatch">
                  <el-input v-model="product.productBirthBatch"></el-input> 
                </el-form-item>
                <el-form-item label="生产日期" :label-width="formLabelWidth">
                  <el-date-picker
                    v-model="product.productBirthDate"
                    type="datetime"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    placeholder="选择日期时间">
                  </el-date-picker>
                </el-form-item>
                <el-form-item label="到效日期" :label-width="formLabelWidth">
                  <el-date-picker
                    v-model="product.productValidDate"
                    type="datetime"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    placeholder="选择日期时间">
                  </el-date-picker>
                </el-form-item>
                <el-form-item label="货位" :label-width="formLabelWidth" prop="binCode">
                  <el-select
                    v-model="product.binCode"
                    filterable
                    remote
                    placeholder="请输入货位"
                    :remote-method="getBin">
                    <el-option
                      v-for="item in selectBin"
                      :key="item.id"
                      :label="item.code"
                      :value="item.code">
                    </el-option>
                  </el-select>
                  <!-- <el-autocomplete
                    class="inline-input"
                    v-model="product.binCode"
                    :fetch-suggestions="querySearchBin"
                    placeholder="请输入货位"
                    :trigger-on-focus="false"
                ></el-autocomplete> -->
                </el-form-item>
                <el-form-item label="容器" :label-width="formLabelWidth" prop="containerBarcode">
                  <el-select
                    v-model="product.containerBarcode"
                    filterable
                    remote
                    placeholder="请输入容器编码"
                    :remote-method="getContainer">
                    <el-option
                      v-for="item in selectContainer"
                      :key="item.id"
                      :label="item.barcode"
                      :value="item.barcode">
                    </el-option>
                  </el-select>
                  <!-- <el-autocomplete
                    class="inline-input"
                    v-model="product.containerBarcode"
                    :fetch-suggestions="querySearchContainer"
                    placeholder="请输入容器编码"
                    :trigger-on-focus="false"
                ></el-autocomplete> -->
                </el-form-item>
                <el-form-item label="件数" :label-width="formLabelWidth" prop="consumeQtystr">
                  <el-input v-model="product.consumeQtystr"></el-input>
                </el-form-item>
                <el-form-item :label-width="formLabelWidth" prop="consumeQty">
                  <el-input v-model="product.consumeQty"></el-input> 
                </el-form-item>
                <el-form-item label="数量" :label-width="formLabelWidth">
                  <div>{{ Number(product.consumeQtystr) + '+' + Number(product.consumeQty) }}</div>
                </el-form-item>
                <el-form-item label="备注" :label-width="formLabelWidth">
                  <textarea rows="5" v-model="product.remark"></textarea>
                </el-form-item>
              </el-form>
              <div slot="footer" class="dialog-footer">
                <el-button @click="cancelAdd">取 消</el-button>
                <el-button type="primary" @click="subAdd">确 定</el-button>
              </div>
            </el-dialog>
        </div>
    </div>
</template>

<script>
import BillService from "@/api/service/BillService";
import UserService from "@/api/service/UserService";
import BillTypeService from "@/api/service/BillTypeService"
import MemberService from "@/api/service/MemberService"
import StorageService from "@/api/service/StorageService"
import ProductService from "@/api/service/ProductService"
import BasicService from "@/api/service/BasicService"
import PermIds from "@/api/permissionIds";
import { mapGetters, mapActions } from "vuex";

export default {
  data() {
      return {
        allProducet: [],
        formLabelWidth: '120px',
        selectProduct: [],
        selectBin: [],
        selectContainer: [],
        product: {
          qty: 0,
          remark: '',
          productName: '',
          productUuid: '',
          productValidDate: '',
          productBirthDate: '',
          consumeQtystr: '',
          consumeQty: '',
          consumeAmount: '',
          binCode: '',
          containerBarcode: '',
          productBirthBatch: ''
        },
        rules: {
          productName: [
            { required: true, message: '请选择商品' }
          ],
          productBirthBatch: [
            { required: true, message: '输入生产批号' }
          ],
          binCode: [
            { required: true, message: '请选择货位' }
          ],
          containerBarcode: [
            { required: true, message: '请选择容器' }
          ],
          consumeQtystr: [
            { required: true, message: '请输入件数' }
          ],
          consumeQty: [
            { required: true, message: '请输入数量' }
          ]
        },
        addProductDialog: false,
        restaurants: [], // 报告人列表
        wrhList: [], // 仓区列表
        deccerList: [], // 报告人列表
        PermIds: PermIds,
        dcList: [], // 中心仓列表
        status: '', // 页面状态
        form: {
          id: '',
          code: '',
          billType: '', // 溢余单据类型
          // wrhId: '',
          decerName: '',
          incerId: '', // 报告员
          remark: '',
          version: '',
          billTypeId: '', // 溢余类型
          expireDate: '', // 到效期
          isTest: false, // 是否现场测试
          // realTotalAmount: '', // 实际总金额
          // realTotalProductCount: '', // 实际总品项数
          // realTotalQtystr: '', // 实际总件数
          // realTotalVolume: '', // 实际总体积
          // realTotalWeight: '', // 实际总质量
          srcBillId: '', // 来源单据
          srcBillNumber: '', // 来源单号
          srcBillType: '', // 来源单据类型
          status: 'SAVED', // 状态
          stockList: [], // 溢余集合
          totalAmount: '', // 总金额
          totalProductCount: '', // 总品相数
          totalQtystr: '', // 总件数（1+1）
          totalVolume: '', // 总体积
          totalWeight: '' // 总质量
        },
        createRules: {
          billTypeId: [
            { required: true, message: '请选择溢余单类型', trigger: 'blur'}
          ],
          // wrhId: [
          //   { required: true, message: '请选择所属仓区', trigger: 'blur'}
          // ],
          decerName: [
            { required: true, message: '请选择报告人', trigger: 'blur'}
          ]
        },
        productList: [], // 报告商品列表
        billTypeList: [] // 溢余类型
      }
    },
    computed: {
      ...mapGetters(["hasPermission"])
    },
    methods: {
      ...mapActions(["deleteSelection", "addSelection", "clearSelection"]),
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
            this.form.totalQtystr = 0 + '+' + 0
          })
        }
      },
      cancelAdd: function() {
        this.addProductDialog = false
        this.product = {
          remark: '',
          productName: '',
          productUuid: '',
          productValidDate: '',
          productBirthDate: '',
          consumeQtystr: '',
          consumeQty: '',
          consumeAmount: '',
          binCode: '',
          containerBarcode: '',
          productBirthBatch: ''
        }
      },
      handleSelect1: function(e) {
        let obj = {}
        this.allProducet.forEach(item => {
          if (item.id === e.id) {
            obj = item
          }
        })
        this.product = Object.assign(this.product, obj)
        console.log(this.product)
      },
      subAdd: function() {
        this.$refs.product.validate(value => {
          if (value) {
            this.productList.push(this.product)
            this.addSelection(this.product)
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
            this.product = {
              remark: '',
              productName: '',
              productUuid: '',
              productValidDate: '',
              productBirthDate: '',
              consumeQtystr: '',
              consumeQty: '',
              consumeAmount: '',
              binCode: '',
              containerBarcode: '',
              productBirthBatch: ''
            }
            this.addProductDialog = false
            this.calcProduct()
          }
        })
      },
      getProduct: function(query) {
        ProductService.query(1, 20, {codeOrNameOrBarcodeLike: query})
        .then((result) => {
          // result.records.forEach((item) => {
          //   // const obj = {
          //   //   value: item.name,
          //   //   id: item.id
          //   // }
          //   // this.selectProduct.push(obj)
          // })
          this.allProducet = result.records
        }).catch((err) => {
          this.$message.error('获取商品列表失败' + err.message)
        });
      },
      getBin: function(query) {
        StorageService.getAllFreightSpace({codeLike: query})
        .then((result) => {
          // result.records.forEach((item) => {
          //   const obj = {
          //     value: item.name,
          //     id: item.id
          //   }
          //   this.selectBin.push(obj)
          // })
          this.selectBin = result.records
        }).catch((err) => {
          this.$message.error('获取货位列表失败' + err.message)
        });
      },
      getContainer: function(query) {
        BasicService.quertOcntainer({page: 1, pageSize: 20, barCodeLikes: query})
        .then((result) => {
          // result.records.forEach((item) => {
          //   const obj = {
          //     value: item.barcode,
          //     id: item.id
          //   }
          //   this.selectContainer.push(obj)
          // })
          this.selectContainer = result.records
        }).catch((err) => {
          this.$message.error('获取容器列表失败' + err.message)
        });
      },
      querySearchProduct: function(queryString, cb) {
          const selectProduct = this.selectProduct;
          const results = queryString ? selectProduct.filter(this.createFilter(queryString)) : selectProduct;
          // 调用 callback 返回建议列表的数据
          cb(results);
      },
      querySearchBin: function(queryString, cb) {
          const selectBin = this.selectBin;
          const results = queryString ? selectBin.filter(this.createFilter(queryString)) : selectBin;
          // 调用 callback 返回建议列表的数据
          cb(results);
      },
      querySearchContainer: function(queryString, cb) {
          const selectContainer = this.selectContainer;
          const results = queryString ? selectContainer.filter(this.createFilter(queryString)) : selectContainer;
          // 调用 callback 返回建议列表的数据
          cb(results);
      },
      addProduct: function() {
        this.addProductDialog = true
        this.getProduct()
        this.getBin()
        this.getContainer()
      },
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
        this.productList.splice(index, 1)
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
              consumeQty: item.consumeQty ? item.consumeQty : 0,
              consumeQtystr: item.consumeQtystr ? item.consumeQtystr : 0,
              stockId: item.id
            })
          })
        }
        for (const item in this.productList) {
          if (!this.productList[item].consumeQty && !this.productList[item].consumeQtystr) {
            this.$message.error('请填写商品数')
            this.form.stockList = []
            return
          }
        }
        _this.$refs.form.validate(valid => {
          if (valid) {
            if (reset) {
              _this.form.realTotalAmount = _this.form.totalAmount
              _this.form.realTotalProductCount = _this.form.totalProductCount
            }
            BillService.createOverflowBill(this.form)
            .then((res) => {
              _this.$message.success('创建成功')
              _this.$store.dispatch("tagsView/delView", _this.$route);
              _this.$router.go(-1)
            })
            .catch((err) => {
              _this.$message.error('创建失败' + err.message)
              _this.form.stockList = []
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
          type: 'INCINV'
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
        this.form.totalAmount = 0
        this.form.totalQtystr = 0
        let consumeQtystr = 0
        let consumeQty = 0
        this.productList.forEach(item => {
          item.lineNum = this.productList.indexOf(item) + 1
          item.consumeAmount = ((Number(item.consumeQtystr) * (item.price) * item.qpc ? Number(item.consumeQtystr) * (item.price) * item.qpc : 0) + (Number(item.consumeQty) * item.price ? Number(item.consumeQty) * item.price : 0)).toFixed(2) 
          // this.form.realTotalAmount += item.consumeAmount
          consumeQtystr = Number(consumeQtystr) + (Number(item.consumeQtystr) ? Number(item.consumeQtystr) : 0)
          consumeQty = Number(consumeQty) + (Number(item.consumeQty) ? Number(item.consumeQty) : 0)
          if (Number(item.consumeQty) < 0 || Number(item.consumeQtystr) < 0) {
            this.$message.error('请输入正确的数据')
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
      getUsers: function(query) {
        this.restaurants = []
        MemberService.query(1, 0, {nameLike: query})
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
          this.form.decerName = '[' + result.username + ']' + result.realName
          this.form.incerId = result.id
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
