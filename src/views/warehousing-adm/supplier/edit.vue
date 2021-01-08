<template>
    <div>
        <div class="head">
            <div class="head-title">
                <div style="margin:8px">{{ dataList.billNumber  }}</div>
                <div style="margin:11px 0 5px 0; font-size: 12px; color: #999">{{ dataList.status | setStatus }}</div>
                
            </div>
            <div>
                <el-button type="primary"  @click="toExamine">审核</el-button>
                <el-button @click="back">返回</el-button>
            </div>
        </div>
        <div style="height:20px" />


        <!-- 编辑 -->
        <!-- <div class="info-content" v-if="status === 'create' || status === 'edit'">
            <div>
                <template>
                    <el-tabs v-model="tabActiveName">
                        <el-tab-pane label="货位类型" name="category">
                          <div class="info-title">基本信息</div>
                            <el-form :model="form" :rules="createRules" ref="form" label-width="100px" class="demo-ruleForm">
                                <el-row :gutter="20">
                                    <el-col :span="6" class="info-box">
                                        <el-form-item label="代码" prop="code">
                                            <el-input v-model="form.code"></el-input>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="6" class="info-box">
                                        <el-form-item label="名称" prop="name">
                                            <el-input v-model="form.name"></el-input>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="6" class="info-box">
                                      <el-form-item label="存储盘数" prop="storageNumber">
                                          <el-input v-model="form.storageNumber"></el-input>
                                      </el-form-item>
                                    </el-col>
                                </el-row>
                                <el-form-item label="备注" prop="remark">
                                    <textarea rows="5" v-model="form.remark"></textarea>
                                </el-form-item>

                             <div class="info-title">规格信息</div>

                                <el-row :gutter="20">
                                    <el-col :span="6" class="info-box">
                                        <el-form-item label="长度(cm)" prop="length">
                                            <el-input v-model="form.length"></el-input>
                                        </el-form-item>
                                    </el-col>

                                    <el-col :span="6" class="info-box">
                                        <el-form-item label="宽度(cm)" prop="widht">
                                            <el-input v-model="form.widht"></el-input>
                                        </el-form-item>
                                    </el-col>

                                    <el-col :span="6" class="info-box">
                                      <el-form-item label="高度(cm)" prop="height">
                                          <el-input v-model="form.height"></el-input>
                                      </el-form-item>
                                    </el-col>

                                    <el-col :span="6" class="info-box">
                                      <el-form-item label="承重(kg)" prop="weight">
                                          <el-input v-model="form.weight"></el-input>
                                      </el-form-item>
                                    </el-col>

                                    <el-col :span="6" class="info-box">
                                      <el-form-item label="容积率(%)" prop="plotRatio">
                                          <el-input v-model="form.plotRatio"></el-input>
                                      </el-form-item>
                                    </el-col>
                                </el-row>
                            </el-form>
                        </el-tab-pane>
                    </el-tabs>
                </template>
            </div>
        </div> -->


        <!-- 展示 -->
        <div class="info-content table-index _table-index">
            <div>
                <template>
                    <el-tabs v-model="tabActiveName">
                        <el-tab-pane label="供应商退货单详情" name="category">
                            <div class="info-title">基本信息</div>

                            <el-col :span="6" class="info-box">
                                <div>创建人名称:</div>
                                {{ dataList.creatorName }}
                            </el-col>

                            <el-col :span="6" class="info-box">
                                <div>供应商名字:</div>
                                <div>{{ dataList.vendorName ? dataList.vendorName : "&lt;空&gt;" }}</div>
                            </el-col>

                            <el-col :span="6" class="info-box">
                                <div>总金额:</div>
                                <div>{{ dataList.amount }}</div>
                            </el-col>

                            <el-col :span="6" class="info-box">
                                <div>创建时间:</div>
                                {{ dataList.createTime }}
                            </el-col>

                            <el-col :span="6" class="info-box">
                                <div>总数量:</div>
                                {{ dataList.qty }}
                            </el-col>

                            <el-col :span="6" class="info-box">
                                <div>总件数:</div>
                                {{ dataList.qtyStr }}
                            </el-col>

                            <el-col :span="6" class="info-box">
                                <div>实际金额:</div>
                                <div>{{ dataList.realAmount ? dataList.realAmount : "&lt;空&gt;" }}</div>
                            </el-col>

                            <el-col :span="6" class="info-box">
                                <div>实际品相数:</div>
                                <div>{{ dataList.realProductItemCount ? dataList.realProductItemCount : "&lt;空&gt;" }}</div>
                            </el-col>

                            <el-col :span="6" class="info-box">
                                <div>实际数量:</div>
                                <div>{{ dataList.realQty ? dataList.realQty : "&lt;空&gt;" }}</div>
                            </el-col>

                            <el-col :span="6" class="info-box">
                                <div>实际数量:</div>
                                <div>{{ dataList.realQty ? dataList.realQty : "&lt;空&gt;" }}</div>
                            </el-col>

                            <el-col :span="6" class="info-box">
                                <div>实际件数:</div>
                                <div>{{ dataList.realQtyStr ? dataList.realQtyStr : "&lt;空&gt;" }}</div>
                            </el-col>

                            <el-row :span="20">
                              <el-col :span="20" class="info-box">
                                  <div>备注:</div>
                                  <div>{{ dataList.remark ? dataList.remark : "&lt;空&gt;" }}</div>
                              </el-col>
                            </el-row>

                            <br>

                            <el-col>
                                <div  class="info-title title">子容器</div>
                            </el-col>

                            <div style="height:20px" />

                            <el-table :data="dataList.items" style="width: 100%; text-align: center" :row-style="{ height: '16px', padding: '-4px' }" >
                            
                            <el-table-column prop="scope" label="行" style="height: 20px">
                              <template slot-scope="scope">
                                <span>{{ scope.row.line }}</span>
                              </template>
                            </el-table-column>

                            <el-table-column prop="scope" label="商品" style="height: 20px">
                              <template slot-scope="scope">
                                <span>{{ scope.row.productName }}</span>
                              </template>
                            </el-table-column>

                            <el-table-column prop="scope" label="金额" style="height: 20px">
                              <template slot-scope="scope">
                                <span>{{ scope.row.amount }}</span>
                              </template>
                            </el-table-column>

                            <el-table-column prop="scope" label="计量单位" style="height: 20px">
                              <template slot-scope="scope">
                                <span>{{ scope.row.munit }}</span>
                              </template>
                            </el-table-column>

                            <el-table-column prop="scope" label="价格" style="height: 20px">
                              <template slot-scope="scope">
                                <span>{{ scope.row.price }}</span>
                              </template>
                            </el-table-column>

                            <el-table-column prop="scope" label="商品规格" style="height: 20px">
                              <template slot-scope="scope">
                                <span>{{ scope.row.qpcStr }}</span>
                              </template>
                            </el-table-column>

                            <el-table-column prop="scope" label="计划数量" style="height: 20px">
                              <template slot-scope="scope">
                                <span>{{ scope.row.qty }}</span>
                              </template>
                            </el-table-column>

                            <el-table-column prop="scope" label="计划件数" style="height: 20px">
                              <template slot-scope="scope">
                                <span>{{ scope.row.qtyStr }}</span>
                              </template>
                            </el-table-column>

                            <el-table-column prop="scope" label="实际数量" style="height: 20px">
                              <template slot-scope="scope">
                                <el-input type="number"  @change="calcProduct(scope.$index, 'realQty')" placeholder="请输入单号" v-model="scope.row.realQty" style="width: 80%" ></el-input>
                                <!-- <span>{{ scope.row.realQty }}</span> -->
                              </template>
                            </el-table-column>

                          </el-table>


                        </el-tab-pane>
                        
                        <!-- <el-tab-pane label="操作日志" name="log">
                          <system-log modular="CONTAINER" :id="id"></system-log>
                        </el-tab-pane> -->
                    </el-tabs>
                </template>
            </div>
        </div>
    </div>
</template>

<script>
import systemLog from "@/components/systemLog.vue";
import WarehousingAdmServers from "@/api/service/WarehousingAdmServers";

export default {
  data() {
      return {
        tabActiveName: 'category', // tab栏名称
        active: 'ccc',
        status: '', // 页面状态
        id: '', // 货位类别ID
        dataList: {} // 详情数据
      }
    },
    computed: {
    },
    components: {
      systemLog
    },
    methods: {
      back: function() {
        this.$store.dispatch("tagsView/delView", this.$route);
        this.$router.go(-1)
      },
      getQueryStatus: function() {
        this.id = this.$route.query.id;
        this.vendorReturnBillDetails(this.id) // 获取详情
      },
      vendorReturnBillDetails: function(id) {
        WarehousingAdmServers.vendorReturnBillDetails(id)
        .then((res) => {
          this.dataList = res;

          console.log(this.dataList.sonList)
        })
        .catch((err) => {
          this.$message.error("获取详情失败" + err.message)
        })
      },
      calcProduct(index, name) {
        if (this.dataList.items[index][name] > this.dataList.items[index].qty) {
          this.$message.error('退货数不能大于计划数量')
          this.dataList.items[index][name] = this.dataList.items[index].qty;
          return
        }

        if (this.dataList.items[index][name] < 0) {
          this.$message.error('请输入正确数据')
          this.dataList.items[index][name] = 0;
        }
      },
      toExamine() {
        const _this = this;

        this.$confirm('是否确认提交审核?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        .then(() => {
          const opt = {
            auditItems: [],
            id: _this.dataList.id,
            version: _this.dataList.version
          }
          
          this.dataList.items.forEach(item => {
            const obj = {
              itemId: item.id,
              qty: item.realQty
            }
            opt.auditItems.push(obj)
          })

          WarehousingAdmServers.vendorReturnBillAudit(opt)
          .then((res) => {
            this.$message.success("操作成功")
            this.vendorReturnBillQuery();
          })
          .catch((err) => {
            this.$message.error("操作失败功" + err.message)
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          })  
        })
      }
    },
    created() {
      this.getQueryStatus()
    },
    filters: {
      setSrcBillType(type) {
        // 配货出库单 DISTRIBUTE_ORDER, 调拨出库单 ALLOVATE_ORDER, 批发出库 WHOLESALE, 团购 GOURPBUY, 履约单 SALES_ORDER, 退仓单 RETURN_ORDER, 退供单 RETURN_SUPPLIER, 差异单 DIFF_ORDER
        switch (type) {
          case 'DISTRIBUTE_ORDER':
            return "配货出库单"
          case 'ALLOVATE_ORDER':
            return "调拨出库单"
          case 'WHOLESALE':
            return "批发出库"
          case 'GOURPBUY':
            return "团购"
          case 'SALES_ORDER':
            return "履约单"
          case 'RETURN_ORDER':
            return "退仓单"
          case 'RETURN_SUPPLIER':
            return "退供单"
          case 'DIFF_ORDER':
            return "差异单"
          default:
            return '未知';
        }
      },
      setStatus(type) {
        // 初始 INITIAL, 审核 AUDITED, 完成 FINISHED, 作废 ABORTED;
        switch (type) {
          case 'INITIAL':
            return "初始"
          case 'AUDITED':
            return "审核"
          case 'FINISHED':
            return "完成"
          case 'ABORTED':
            return "作废"
          default:
            return '未知';
        }
      }
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
}

</style>
<style lang="scss">
.table-index {
  @import "src/styles/mixin.scss";
  @include elTable;
}
._table-index .el-table .cell{
  padding: 7px 0;
}
</style>