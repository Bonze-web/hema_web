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
                                      <el-form-item label="锁定解锁员" prop="lockerIndex">
                                          <el-select v-model="form.lockerIndex" filterable remote :remote-method="getUsers" placeholder="请输入锁定解锁名称">
                                            <el-option v-for="(item, index) in restaurants" :key="item.id" :label="item.username" :value="index"></el-option>
                                          </el-select>
                                      </el-form-item>
                                  </el-col>

                                  <el-col :span="6" class="info-box">
                                    <el-form-item label="锁定解锁" prop="billType">
                                      <el-select v-model="form.billType" placeholder="请选择锁定解锁类型">
                                        <el-option label="锁定" value="LOCK"></el-option>
                                        <el-option label="解锁" value="UNLOCK"></el-option>
                                      </el-select>
                                    </el-form-item>
                                  </el-col>

                                  <el-col :span="6" class="info-box">
                                    <el-form-item label="原因" prop="reason">
                                      <el-select v-model="form.reason" placeholder="请选择原因">
                                        <el-option label="锁定解锁" value="LOCKUNLOCK"></el-option>
                                      </el-select>
                                    </el-form-item>
                                  </el-col>

                                  <el-col>
                                    <el-form-item label="备注" prop="note">
                                      <textarea v-model="form.note"></textarea>
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
          lockerIndex: '',
          billType: '',
          reason: '',
          note: ''
        },
        createRules: {
          lockerIndex: [
            { required: true, message: '请输入锁定解锁员', trigger: 'blur' }
          ],
          billType: [
            { required: true, message: '请输选择类型', trigger: 'blur' }
          ],
          reason: [
            { required: true, message: '请输入锁定解锁原因', trigger: 'blur' }
          ],
          note: [
            { required: true, message: '请输入备注', trigger: 'blur' }
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
        MemberService.query(1, 0, {nameLike: this.form.decerName})
        .then((res) => {
          this.restaurants = res.records
        }).catch((err) => {
          this.$message.error('获取用户列表失败' + err.message)
        })
      },
      confirm(toExamine) {
        if (this.dataList.length === 0) {
          this.$message.error("没有数据可以保存")
          return
        }

        const _this = this;
        const index = this.form.lockerIndex;

        this.$refs.form.validate(valid => {
          if (valid) {
            // lockerCode 锁定解锁人Code
            // lockerId* 锁定解锁人ID
            // lockerName	 锁定解锁人姓名
            console.log(this.form.locker)

            const addStockLockBillDTO = {
              lockerId: this.restaurants[index].id,
              lockerName: this.restaurants[index].username,
              // lockerCode: this.restaurants[index].code,
              billType: this.form.billType,
              reason: this.form.reason,
              note: this.form.note
            };
            
            addStockLockBillDTO.addStockLockItemList = this.dataList

            console.log(addStockLockBillDTO)

            DemolitionAndService.newStockLocjBill(addStockLockBillDTO)
            .then(res => {
              this.$message.success("操作成功")
              this.$router.push('/wrhmanagement/lockandunlock')
              _this.$store.state.lockandunlock.multipleSelection = [];
            })
            .catch(err => {
              this.$message.error("操作失败" + err.message)
            })
          }
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
