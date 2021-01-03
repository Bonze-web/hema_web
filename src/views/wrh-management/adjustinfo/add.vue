<template>
    <div>
        <div class="head">
            <div class="head-title">
                <div style="margin:8px">新建货库存信息调整单</div>
            </div>
            <div>
                <el-button @click="back">取消</el-button>
                <el-button type="primary" @click="confirm">保存</el-button>
                <el-button type="primary" @click="confirm('审核')">保存并审核</el-button>
            </div>
        </div>
        <div style="height:20px" />

        <div class="info-content">
            <div>
                <template>
                    <el-tabs v-model="tabActiveName">
                        <!-- <div class="info-title">基本信息</div> -->
                          <el-form :model="form" :rules="createRules" ref="form" label-width="100px" class="demo-ruleForm">
                              <!-- <el-row :gutter="20">
                                  <el-col :span="6" class="info-box">
                                      <el-form-item label="损耗类型" prop="code">
                                          <el-input v-model="form.code"></el-input>
                                      </el-form-item>
                                  </el-col>
                                  <el-col :span="6" class="info-box">
                                      <el-form-item label="仓库" prop="name">
                                          <el-input v-model="form.name"></el-input>
                                      </el-form-item>
                                  </el-col>
                                  <el-col :span="6" class="info-box">
                                      <el-form-item label="报损人" prop="name">
                                          <el-input v-model="form.name"></el-input>
                                      </el-form-item>
                                  </el-col>
                                  <el-col :span="6" class="info-box">
                                    <el-form-item label="存储托盘数" prop="storageNumber">
                                        <el-input v-model="form.storageNumber"></el-input>
                                    </el-form-item>
                                  </el-col>
                              </el-row>

                              <el-form-item label="备注" prop="remark">
                                  <textarea v-model="form.remark"></textarea>
                              </el-form-item> -->

                               <div class="info-title">
                                  <div>商品
                                  <!-- <router-link style="color:#409EFF" :to="{ path: '/wrhmanagement/adjustinfo/batchAdd', query:{ id: this.id } }">
                                      <el-button size="mini" type="text" >批量添加</el-button>
                                  </router-link> -->
                                  </div>
                                  <!-- <div class="list-count">
                                      <div>总数:{{ form.totalQtystr ? form.totalQtystr : 0 }},</div>
                                      <div>总品相数:{{ form.totalProductCount ? form.totalProductCount : 0 }},</div>
                                      <div>总金额:{{ form.totalAmount ? form.totalAmount : 0 }}</div>
                                  </div> -->
                              </div>

                              <el-table :data="dataList" style="width: 100%;text-align:center">

                                  <el-table-column fixed prop="scope" label="操作">
                                    <template slot-scope="scope">
                                      <el-button type="text" @click="deleteProduct(scope.$index)">删除</el-button>
                                    </template>
                                  </el-table-column>

                                  <!-- 可以修改的字段：备注--，供应商(选)、生成批号、批次、生产日期、到效日期、计量单位、价格、规格描述、重量、体积、入库时间--、状态(选)。 -->

                                  <!-- <el-table-column width="200" prop="scope" label="备注">
                                    <template slot-scope="scope">
                                      <el-input type="textarea" placeholder="请输入内容" v-model="scope.row.a"></el-input>
                                    </template>
                                  </el-table-column> -->

                                  <el-table-column width="180" prop="scope" label="供应商">
                                    <template slot-scope="scope">
                                      <!-- vendorName -->
                                      <el-select v-model="scope.row.vendorName" placeholder="请选择状态" class="input-width" >
                                        <el-option v-for="item in productSupplier" :key="item.id" :value="item.id" :label="item.name"></el-option>
                                      </el-select>
                                      <!-- <el-input type="text" size="mini" v-model="scope.row.vendorName"></el-input> -->
                                    </template>
                                  </el-table-column>

                                  <el-table-column width="180" prop="scope" label="生成批号">
                                    <template slot-scope="scope">
                                      <el-input type="text"  size="mini" v-model="scope.row.productionBatch"></el-input>
                                    </template>
                                  </el-table-column>

                                  <el-table-column width="180" prop="scope" label="批次">
                                    <template slot-scope="scope">
                                      <el-input type="text" size="mini" v-model="scope.row.batch"></el-input>
                                    </template>
                                  </el-table-column>

                                  <el-table-column width="180" prop="scope" label="生产日期">
                                    <template slot-scope="scope">
                                      <el-input type="text" size="mini" v-model="scope.row.productionDate"></el-input>
                                    </template>
                                  </el-table-column>

                                  <el-table-column width="180" prop="scope" label="到效日期">
                                    <template slot-scope="scope">
                                      <el-input type="text" size="mini" v-model="scope.row.validDate"></el-input>
                                    </template>
                                  </el-table-column>

                                  <el-table-column width="180" prop="scope" label="计量单位">
                                    <template slot-scope="scope">
                                      <el-input type="text" size="mini" v-model="scope.row.munit"></el-input>
                                    </template>
                                  </el-table-column>

                                  <el-table-column width="180" prop="scope" label="价格">
                                    <template slot-scope="scope">
                                      <el-input type="text" size="mini" v-model="scope.row.price"></el-input>
                                    </template>
                                  </el-table-column>

                                  <el-table-column width="180" prop="scope" label="规格描述">
                                    <template slot-scope="scope">
                                      <el-input type="text" size="mini" v-model="scope.row.productSpec"></el-input>
                                    </template>
                                  </el-table-column>

                                  <el-table-column width="180" prop="scope" label="重量">
                                    <template slot-scope="scope">
                                      <el-input type="number" @change="calcProduct('qty', scope.$index)" size="mini" v-model="scope.row.qty"></el-input>
                                    </template>
                                  </el-table-column>

                                  <el-table-column width="180" prop="scope" label="体积">
                                    <template slot-scope="scope">
                                      <el-input type="number" @change="calcProduct('volume', scope.$index)" size="mini" v-model="scope.row.volume"></el-input>
                                    </template>
                                  </el-table-column>

                                  <el-table-column width="180" prop="scope" label="入库时间">
                                    <template slot-scope="scope">
                                      <el-input type="text" size="mini" v-model="scope.row.instockTime"></el-input>
                                    </template>
                                  </el-table-column>


                                  <el-table-column width="200" prop="scope" label="状态">
                                    <template slot-scope="scope">
                                      <el-select v-model="scope.row.statusIn" placeholder="请选择状态" class="input-width" >
                                        <el-option value="NORMAL" label="正常"></el-option>
                                        <el-option value="LOCKED" label="锁定"></el-option>
                                        <el-option value="FOR_MOVE_OUT" label="待移库出"></el-option>
                                        <el-option value="FOR_MOVE_IN" label="待移库入"></el-option>
                                        <el-option value="FOR_PICK" label="待拣货"></el-option>
                                        <el-option value="FOR_RPL_OUT" label="待补货出"></el-option>
                                        <el-option value="FOR_RPL_IN" label="待补货入"></el-option>
                                      </el-select>
                                    </template>
                                  </el-table-column>
                              </el-table>
                          </el-form>
                    </el-tabs>
                </template>
            </div>
        </div>
    </div>
</template>

<script>
// import { mapGetters } from "vuex";
import { mapActions } from "vuex";
import DemolitionAndService from "@/api/service/DemolitionAndService"

export default {
  data() {
      return {
        dataList: [],
        productSupplier: [], // 供应商
        tabActiveName: 'category',
        form: {
          code: '',
          name: '',
          storageNumber: '',
          remark: '',
          length: '',
          width: '',
          height: '',
          weight: '',
          plotRatio: ''
        },
        createRules: {
          code: [
            { required: true, message: '请输入类别代码', trigger: 'blur' },
            { required: true, max: 16, message: '最多输入16位', trigger: 'change' }
          ],
          name: [
            { required: true, message: '请输入类别名称', trigger: 'blur' },
            { required: true, max: 40, message: '最多输入40位', trigger: 'change' }
          ],
          storageNumber: [
            { required: true, message: '请输入存储托盘数量', trigger: 'blur' },
            { pattern: /^[1-9]\d*$/, message: '请输入正整数', trigger: 'change' }
          ],
          // remark: [
          //   { required: true, message: '请输入备注', trigger: 'blur' },
          //   { required: true, max: 200, message: '最多输入200位', trigger: 'change' }
          // ],
          length: [
            { required: true, message: '请输入长度', trigger: 'blur' },
            { pattern: /^\d{1,4}(\.\d+)?$/, message: '请输入1-9999之间的数字', trigger: 'change' }
          ],
          width: [
            { required: true, message: '请输入宽度', trigger: 'blur' },
            { pattern: /^\d{1,4}(\.\d+)?$/, message: '请输入1-9999之间的数字', trigger: 'change' }
          ],
          height: [
            { required: true, message: '请输入高度', trigger: 'blur' },
            { pattern: /^\d{1,4}(\.\d+)?$/, message: '请输入1-9999之间的数字', trigger: 'change' }
          ],
          weight: [
            { required: true, message: '请输入承重', trigger: 'blur' },
            { pattern: /^\d{1,4}(\.\d+)?$/, message: '请输入1-9999之间的数字', trigger: 'change' }
          ],
          plotRatio: [
            { required: true, message: '请输入容积率', trigger: 'blur' },
            { pattern: /^100$|^(\d|[1-9]\d)(\.\d+)*$/, message: '请输入1-100之间的数字', trigger: 'change' }
          ]
        }
      }
    },
    computed: {
    },
    methods: {
      ...mapActions(["deleteSelection"]),
      back: function() {
        this.$store.dispatch("tagsView/delView", this.$route);
        this.$router.go(-1)
      },
      confirm(toExamine) {
        // 保存
        if (this.dataList.length === 0) {
          this.$message.error("没有数据可以保存")
          return
        }

        const arr = [];
        const _this = this;

        this.dataList.forEach((item) => {
          const obj = {
            stockId: item.id, // 库存记录id
            updateBatch: item.batch, // 批次
            updateInstockTime: item.instockTime, // 入库时间
            updateMunit: item.munit, // 计量单位
            updatePrice: item.price, // 价格
            updateProductSpec: item.productSpec, // 规格描述
            updateProductionBatch: item.productionBatch, // 生产批号
            updateProductionDate: item.productionDate, // 生产日期
            updateStockStatus: item.statusIn ? item.statusIn : null, // 状态
            updateValidDate: item.validDate, // 到效日期
            updateVendorId: item.name ? item.name : null, // 供应商名字
            updateVolume: item.volume, // 体积
            updateWeight: item.qty // 重量
          }

          arr.push(obj)
        })

        DemolitionAndService.createUpdateInfoBill(arr)
        .then(res => {
          this.$message.success("操作成功")
          this.$router.push('/wrhmanagement/adjustinfo')
          _this.$store.state.adjustinfo.multipleSelection = [];
          if (toExamine !== '审核') return;
          // 审核通过========================================

          setTimeout(() => {
            const arrId = [];

            arr.forEach(item => {
              arrId.push(item.stockId)
            })

            DemolitionAndService.passUpdateInfoBill(arrId)
            .then((res) => {
              this.$message.success("操作成功")
              _this.stockUpdateInfoBillQuery()
            }).catch(err => {
              this.$message.error("操作失败" + err.message)
            });
          }, 500)
          // 审核通过========================================
        })
        .catch(err => {
          this.$message.error("操作失败" + err.message)
        })
      },
      calcProduct: function(name, index) {
        if (this.dataList[index][name] < 0) {
          this.$message.error('请输入正确数据')
          this.dataList[index][name] = 0;
        }
      },
      deleteProduct(index) {
        this.deleteSelection(index)
        this.dataList.splice(index, 1)
      }
    },
    created() {
      DemolitionAndService.productSupplierQuery({
        page: 1,
        pageSize: 0,
        statusEquals: 'OPEN',
        searchCount: true
      })
      .then(res => {
        console.log(res)
        this.$message.success("供应商查询成功")
        this.productSupplier = res.records;
      })
      .catch(err => {
        this.$message.error("供应商查询失败" + err.message)
      })
    },
    beforeRouteEnter(to, from, next) {
      next(vm => {
        // 通过 `vm` 访问组件实例
        vm.dataList = vm.$store.state.adjustinfo.multipleSelection
        const arr = Array.from(new Set(vm.dataList))
        vm.dataList = arr
      })
    },
    filters: {}
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
