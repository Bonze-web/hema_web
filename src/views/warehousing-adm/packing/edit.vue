<template>
    <div>
        <div class="head">
            <div class="head-title">
                <div style="margin:8px">{{ '[' + dataList.wrhCode  +']' + dataList.wrhName  }}</div>
                <div style="margin:11px 0 5px 0; font-size: 12px; color: #999">{{ dataList.status | setStatus }}</div>
            </div>
            <div>
                <el-button @click="back">返回</el-button>
                <!-- <el-button type="primary"  @click="printingBtn">打印</el-button> -->
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
                        <el-tab-pane label="收货装箱单" name="category">
                            <div class="info-title">基本信息</div>
                            <el-col :span="6" class="info-box">
                                <div>供应商:</div>
                                <div>{{ '[' + dataList.vendorCode + ']' + dataList.vendorName }}</div>
                            </el-col>
                            <el-col :span="6" class="info-box">
                                <div>物流方式:</div>
                                <div>{{ dataList.logisticMode | setLogisticMode }}</div>
                            </el-col>

                            <el-col :span="6" class="info-box">
                                <div>到效日期:</div>
                                <div>{{ dataList.endReceiveTime }}</div>
                            </el-col>

                            <el-col :span="6" class="info-box">
                                <div>送达日期:</div>
                                <div>{{ dataList.updateTime ? dataList.updateTime : "&lt;空&gt;" }}</div>
                            </el-col>

                            <el-col :span="6" class="info-box">
                                <div>入库订单单号:</div>
                                <div>{{dataList.orderBillNumber}}</div>
                            </el-col>

                            <el-col :span="6" class="info-box">
                                <div>收货方式:</div>
                                <div>{{ dataList.method | setMethod }}</div>
                            </el-col>

                            <el-col class="info-box">
                                <div>备注:</div>
                                <div>{{ dataList.remark ? dataList.remark : "&lt;空&gt;" }}</div>
                            </el-col>


                            <el-col>
                                <div  class="info-title title">子容器</div>
                            </el-col>
                            <el-input type="text" v-model="iptVal" placeholder="请输入商品编号" class="input-width" ></el-input>
                            <el-button type="primary" size="mini" @click="onSubmit" >立即搜索</el-button>

                            <div style="height:20px" />

                            <el-table :data="orderBillItems" style="width: 100%; text-align: center" :row-style="{ height: '16px', padding: '-4px' }" >
                              <el-table-column type="index" label="序号"></el-table-column>

                              <el-table-column prop="billNumber" label="商品编码" style="height: 20px"></el-table-column>
                              <el-table-column prop="productName" label="商品名称" style="height: 20px"></el-table-column>
                              <el-table-column prop="munit" label="单位" style="height: 20px"></el-table-column>
                              <el-table-column prop="spec" label="规格" style="height: 20px"></el-table-column>

                              <el-table-column prop="qtystr" label="收货件数" style="height: 20px"></el-table-column>
 
                              <el-table-column prop="qty" label="数量" style="height: 20px"></el-table-column>

                              <el-table-column prop="productDate" label="生产日期" style="height: 20px"></el-table-column>


                              <el-table-column prop="validDate" label="到效日期" style="height: 20px"></el-table-column>

                              <el-table-column prop="scope" label="保质天数" style="height: 20px">
                                <template slot-scope="scope">
                                  {{ scope.row.shelfLifeDays }}天
                                </template>
                              </el-table-column>

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
import WarehousingAdmServers from "@/api/service/WarehousingAdmServers";

export default {
  data() {
      return {
        tabActiveName: 'category', // tab栏名称
        id: '', // 货位类别ID
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
          this.orderBillItems = this.dataList.items
        } else {
          this.orderBillItems = this.dataList.items.filter((item) => {
            return item.billNumber.indexOf(this.iptVal) !== -1
          })
        }
      },
      packingReceiveBill() {
        this.id = this.$route.query.id;

        WarehousingAdmServers.packingReceiveBill(this.id)
        .then(res => {
          console.log(res)
          this.dataList = res;
          this.orderBillItems = res.items;
        })
        .catch(err => {
          this.$message.error("查询失败" + err.message)
        });
      },
      printingBtn() {
        this.$message.error("打印功能还未开通")
      }
    },
    created() {
      this.packingReceiveBill()
    },
    filters: {
      setStatus(status) {
        // 状态。INITIAL:初始，RECEIVED:暂存，PUTAWAY:上架完成
        switch (status) {
          case 'INITIAL':
            return "初始"
          case 'RECEIVED':
            return "暂存"
          case 'PUTAWAY':
            return "上架完成"
          default:
            return '未知';
        }
      },
      // 收货方式，MANUAL：手工单据，RF：手持终端
      setMethod(method) {
        switch (method) {
          case 'MANUAL':
            return "手工单据"
          case 'RF':
            return "手持终端"
          default:
            return '未知';
        }
      },
      // 物流模式，UNIFY：统配、CROSS：越库
      setLogisticMode(logisticMode) {
        switch (logisticMode) {
          case 'UNIFY':
            return "统配"
          case 'CROSS':
            return "越库"
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