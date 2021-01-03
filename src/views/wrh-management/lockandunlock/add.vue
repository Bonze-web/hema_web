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
                        <div class="info-title">基本信息</div>
                          <el-form :model="form" :rules="createRules" ref="form" label-width="100px" class="demo-ruleForm">
                              <el-row :gutter="20">
                                  <el-col :span="6" class="info-box">

                                      <el-form-item label="锁定解锁员" prop="moverId">
                                          <el-select v-model="form.moverId" filterable remote placeholder="请输入锁定解锁名称" :remote-method="getUsers">
                                            <el-option v-for="item in restaurants" :key="item.id" :label="item.username" :value="item.id"></el-option>
                                          </el-select>
                                      </el-form-item>

                                  </el-col>
                              </el-row>

                               <div class="info-title">商品</div>

                              <el-table :data="dataList" style="width: 100%;text-align:center">

                                  <el-table-column fixed prop="scope" label="操作">
                                    <template slot-scope="scope">
                                      <el-button type="text" @click="deleteProduct(scope.$index)">删除</el-button>
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
                                  <el-table-column label="批次" width="120" prop="batch"></el-table-column>
                                  <el-table-column label="价格" width="120" prop="price"></el-table-column>
                                  <el-table-column label="入库时间" width="120" prop="instockTime"></el-table-column>
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
import MemberService from "@/api/service/MemberService"

export default {
  data() {
      return {
        dataList: [],
        restaurants: [], // 锁定解锁员列表
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
      getUsers: function() {
        this.restaurants = []
        MemberService.query(1, 0, {nameLike: this.form.decerName})
        .then((res) => {
          this.restaurants = res.records
        }).catch((err) => {
          this.$message.error('获取用户列表失败' + err.message)
        })
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
          this.$router.push('/wrhmanagement/lockandunlock')
          _this.$store.state.lockandunlock.multipleSelection = [];
          if (toExamine !== '审核') return;
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
    },
    beforeRouteEnter(to, from, next) {
      next(vm => {
        // 通过 `vm` 访问组件实例
        console.log(vm.$store.state)
        vm.dataList = vm.$store.state.lockandunlock.multipleSelection
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
