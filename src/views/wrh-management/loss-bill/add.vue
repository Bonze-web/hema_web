<template>
    <div>
        <div class="head" v-if="status === 'create'">
            <div style="margin-top:8px" v-if="status === 'create'">新建损耗单</div>
            <div style="margin-top:8px" v-else>编辑</div>
            <div>
                <el-button @click="back">取消</el-button>
                <el-button type="primary" @click="createBill(false)">保存</el-button>
                <el-button type="primary" @click="createBill(true)" v-if="status === 'create'">保存并审核</el-button>
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
                                        <el-form-item label="损耗类型" prop="billType">
                                          <el-select v-model="form.billTypeId" placeholder="请选择损耗类型">
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
                                        <el-form-item label="报损人" prop="decerId">
                                            <el-autocomplete
                                                class="inline-input"
                                                v-model="form.decerId"
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
                                        <div>总品相数:{{ form.totalQtystr ? form.totalQtystr : 0 }},</div>
                                        <div>总金额:{{ form.totalQtystr ? form.totalQtystr : 0 }}</div>
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
                                        <el-table-column width="100" prop="billNumber" label="商品"></el-table-column>
                                        <el-table-column width="100" prop="billType" label="货位"></el-table-column>
                                        <el-table-column width="100" prop="billType" label="货位用途"></el-table-column>
                                        <el-table-column width="100" prop="billType" label="容器"></el-table-column>
                                        <el-table-column width="100" prop="billType" label="供应商"></el-table-column>
                                        <el-table-column width="100" prop="billType" label="批号"></el-table-column>
                                        <el-table-column width="100" prop="billType" label="生产日期"></el-table-column>
                                        <el-table-column width="100" prop="billType" label="到效日期"></el-table-column>
                                        <el-table-column width="100" prop="billType" label="规格/计量单位"></el-table-column>
                                        <el-table-column width="100" prop="billType" label="单价"></el-table-column>
                                        <el-table-column width="100" prop="billType" label="批次"></el-table-column>
                                        <el-table-column width="100" prop="billType" label="可用库存数量"></el-table-column>
                                        <el-table-column width="100" prop="billType" label="损耗件数">
                                          <template slot-scope="scope">
                                            {{ scope.$index + 1 }}
                                          </template>
                                        </el-table-column>
                                        <el-table-column width="100" prop="billType" label="损耗数量">
                                          <template slot-scope="scope">
                                            {{ scope.$index + 1 }}
                                          </template>
                                        </el-table-column>
                                        <el-table-column width="100" prop="billType" label="损耗金额"></el-table-column>
                                        <el-table-column width="100" prop="billType" label="备注"></el-table-column>
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
import StorageService from "@/api/service/StorageService"
import PermIds from "@/api/permissionIds";
import { mapGetters, mapActions } from "vuex";

export default {
  data() {
      return {
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
          decerId: '', // 报损员
          remark: '',
          version: '',
          billTypeId: '', // 损耗类型
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
          status: '', // 状态
          stockList: [], // 损耗集合
          totalAmount: '', // 总金额
          totalProductCount: '', // 总品相数
          totalQtystr: '', // 总件数（1+1）
          totalVolume: '', // 总体积
          totalWeight: '' // 总质量
        },
        createRules: {
          billType: [
            { required: true, message: '请选择损耗单类型', trigger: 'blur'}
          ],
          wrhId: [
            { required: true, message: '请选择所属仓库', trigger: 'blur'}
          ],
          decerId: [
            { required: true, message: '请选择报损人', trigger: 'blur'}
          ]
        },
        productList: [{billType: 1}, {}], // 报损商品列表
        billTypeList: [] // 损耗类型
      }
    },
    computed: {
      ...mapGetters(["hasPermission"])
    },
    methods: {
      ...mapActions(["deleteSelection"]),
      batchAddProduct: function() {
        if (!this.form.wrhId) {
          this.$message.error('请选择仓库')
          return
        }
        this.$router.push({path: '/wrhmanagement/lossbill/batchAdd', query: {id: this.form.wrhId}})
      },
      handleSelect: function() {
        console.log(1)
      },
      deleteProduct: function(index) {
        this.deleteSelection(index)
      },
      createBill: function(reset) {
        const _this = this
        if (reset) {
          this.form.status = ""
        } else {
          this.form.status = ""
        }
        if (_this.productList.length <= 0) {
          _this.$message.error('请至少添加一个商品')
          return
        }
        _this.$refs.form.validate(valid => {
          if (valid) {
            BillService.createLossBill()
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
          // 搜索报损人
        BillService.getDeccer()
        .then((res) => {
          this.deccerList = res.records
        })
        .catch((err) => {
          this.$message.error('搜索报损人失败' + err.message)
        })
      },
      getQueryStatus: function() {
        this.status = this.$route.query.status
        if (this.status === 'read') {
          this.id = this.$route.query.id
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
        productList.forEach(item => {
          this.form.totalAmount += item.amount
          this.form.totalAmount += item.amount
          this.form.totalAmount += item.amount
          this.form.totalAmount += item.amount
          this.form.totalAmount += item.amount
        });
      }
    },
    created() {
      this.getAllBillType()
      this.getQueryStatus()
      this.getWrhList()
      this.productList = this.$store.state.bill.multipleSelection
      console.log(this.$store.state.bill.multipleSelection)
      this.calcProduct(this.$store.state.bill.multipleSelection)
    },
    beforeRouteEnter(to, from, next) {
      next(vm => {
        // 通过 `vm` 访问组件实例
        vm.productList = vm.$store.state.bill.multipleSelection
      })
    },
    filters: {
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
    display: flex;
    justify-content: space-between;
}
.list-count{
    display: flex;
}
</style>
