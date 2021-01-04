<template>
    <div>
        <div class="head">
            <div class="head-title">
                <div style="margin:8px">{{ '[' + dataList.lockerCode  +']' + dataList.lockerName  }}</div>
                <div style="margin:11px 0 5px 0; font-size: 12px; color: #999">{{ dataList.status | setStatus }}</div>
            </div>
            <div>
              <!-- SAVED:已保存，AUDITED:已审核 -->
                <el-button @click="back">返回</el-button>
                <el-button type="primary" v-if="dataList.status === 'SAVED'" @click="esaminareBtn">审核通过</el-button>
                <el-button type="primary" v-if="dataList.status === 'SAVED'" @click="deleteBtn">删除</el-button>
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
                                    <textarea v-model="form.remark"></textarea>
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
                        <el-tab-pane label="解锁锁定单" name="category">
                            <div class="info-title">基本信息</div>
                            <el-col :span="6" class="info-box">
                                <div>单号:</div>
                                <div>{{ dataList.billNumber }}</div>
                            </el-col>
                            <el-col :span="6" class="info-box">
                                <div>锁定解锁类型:</div>
                                <div>{{ dataList.billType | setBillType }}</div>
                            </el-col>

                            <el-col :span="6" class="info-box">
                                <div>锁定解锁员:</div>
                                <div>{{ dataList.lockerName }}</div>
                            </el-col>

                            <el-col :span="6" class="info-box">
                                <div>原因:</div>
                                <div>{{dataList.reason | setReason}}</div>
                            </el-col>

                            <el-col class="info-box">
                                <div>备注:</div>
                                <div>{{ dataList.note ? dataList.note : "&lt;空&gt;" }}</div>
                            </el-col>


                            <el-col>
                                <div  class="info-title title">子容器</div>
                            </el-col>
                            <el-input type="text" v-model="iptVal" placeholder="请输入商品编号" class="input-width" ></el-input>
                            <el-button type="primary" size="mini" @click="onSubmit" >立即搜索</el-button>

                            <div style="height:20px" />

                            <el-table :data="orderBillItems" style="width: 100%; text-align: center" :row-style="{ height: '16px', padding: '-4px' }" >
                              <el-table-column type="index" label="序号"></el-table-column>

                              <!-- <el-table-column prop="lockBillNumber" label="解锁锁定单号" style="height: 20px"></el-table-column> -->
                              <el-table-column prop="productCode" label="商品编码" style="height: 20px"></el-table-column>
                              <el-table-column prop="productName" label="商品名称" style="height: 20px"></el-table-column>
                              <el-table-column prop="binUsage" label="货位用途" style="height: 20px"></el-table-column>
                              <el-table-column prop="price" label="单价" style="height: 20px"></el-table-column>
                              <el-table-column prop="qpc" label="规格" style="height: 20px"></el-table-column>
                              <el-table-column prop="qty" label="数量" style="height: 20px"></el-table-column>
                              <el-table-column prop="stockBatch" label="批次" style="height: 20px"></el-table-column>

                            </el-table>
                        </el-tab-pane>

                        <!-- <el-tab-pane label="操作日志" name="active">
                          <el-table :data="dataList.sonList" style="width: 100%; text-align: center" :row-style="{ height: '16px', padding: '-4px' }" >

                            <el-table-column prop="a" label="操作时间" style="height: 20px">
                              <template slot-scope="scope">
                                  <span>条码{{ scope.row.a }}</span>
                              </template>
                            </el-table-column>

                            <el-table-column prop="b" label="操作类型" style="height: 20px">
                              <template slot-scope="scope">
                                  <span>容器类型{{ scope.row.b }}</span>
                            </el-table-column>

                            <el-table-column prop="c" label="事件">
                              <template slot-scope="scope">
                                {{ scope.row.c }}
                              </template>
                            </el-table-column>

                            <el-table-column prop="d" label="修改">
                              <template slot-scope="scope">
                                {{ scope.row.d }}
                              </template>
                            </el-table-column>

                          </el-table>
                        </el-tab-pane> -->
                    </el-tabs>
                </template>
            </div>
        </div>
    </div>
</template>

<script>
import DemolitionAndService from "@/api/service/DemolitionAndService";

export default {
  data() {
      return {
        tabActiveName: 'category', // tab栏名称
        id: '', // 详情id
        iptVal: '', // 搜索
        dataList: {}, // 详情数据
        orderBillItems: []
      }
    },
    computed: {
    },
    methods: {
      back: function() {
        this.$store.dispatch("tagsView/delView", this.$route);
        this.$router.go(-1)
      },
      onSubmit() {
        if (this.iptVal === '') {
          this.orderBillItems = this.dataList.stockLockItemList
        } else {
          this.orderBillItems = this.dataList.stockLockItemList.filter((item) => {
            return item.productCode.indexOf(this.iptVal) !== -1
          })
        }
      },
      detailsStockLocjBill() {
        this.id = this.$route.query.id;

        DemolitionAndService.detailsStockLocjBill(this.id)
        .then(res => {
          console.log(res)
          this.dataList = res;
          this.orderBillItems = res.stockLockItemList;
        })
        .catch(err => {
          this.$message.error("查询失败" + err.message)
        });
      },
      esaminareBtn() {
        // 审核
         const stockLockBillAuditFilter = {
          ids: [this.id]
        }

        this.$confirm('是否审核锁定解锁单?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        .then(() => {
          DemolitionAndService.nauditStockLocjBill(stockLockBillAuditFilter)
          .then(res => {
            console.log(res)
            this.$message.success("操作成功")
            this.$store.dispatch("tagsView/delView", this.$route);
            this.$router.go(-1)
          })
          .catch(err => {
            this.$message.error("审核失败" + err.message)
          });
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          })        
        })
      },
      deleteBtn() {
        // 删除
        const stockLockBillAuditFilter = {
          ids: [this.id]
        }

        this.$confirm('是否删除锁定解锁单?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          DemolitionAndService.deleteStockLocjBill(stockLockBillAuditFilter)
          .then(res => {
            this.$message.success("操作成功")
            console.log(res)
            this.$store.dispatch("tagsView/delView", this.$route);
            this.$router.go(-1)
          })
          .catch(err => {
            this.$message.error("删除失败" + err.message)
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          })        
        })
      }
    },
    created() {
      this.detailsStockLocjBill()
    },
    filters: {
      setStatus(type) {
        // SAVED:已保存，AUDITED:已审核
        switch (type) {
          case 'SAVED':
            return "已保存"
          case 'AUDITED':
            return "已审核"
          default:
            return '未知';
        }
      },
      setBillType(type) {
        // LOCK:锁定 UNLOCK:解锁
        switch (type) {
          case 'LOCK':
            return "锁定"
          case 'UNLOCK':
            return "解锁"
          default:
            return '未知';
        }
      },
      setReason(type) {
        // 锁定解锁原因 LOCKUNLOCK:锁定解锁
        switch (type) {
          case 'LOCKUNLOCK':
            return "锁定解锁"
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