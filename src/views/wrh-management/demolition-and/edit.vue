<template>
    <div>
        <div class="head">
            <div class="head-title">
                <div class="status">{{ dataList.status | setStatus }}</div>
                <div style="margin:8px">{{ '拆并单：' + dataList.billNumber }}</div>
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
                        <el-tab-pane label="拆并单详情" name="category">
                            <div class="info-title">基本信息</div>

                            <el-col :span="6" class="info-box">
                                <div>操作员:</div>
                                <div>{{ dataList.billOperatorName ? dataList.billOperatorName : "&lt;空&gt;" }}</div>
                            </el-col>

                            <el-col :span="6" class="info-box">
                                <div>创建日期:</div>
                                <div>{{ dataList.createTime ? dataList.createTime : "&lt;空&gt;" }}</div>
                            </el-col>

                            <el-col :span="6" class="info-box">
                                <div>创建人名称:</div>
                                <div>{{ dataList.creatorName ? dataList.creatorName : "&lt;空&gt;" }}</div>
                            </el-col>

      
                            <el-col :span="6" class="info-box">
                                <div>结束拆并时间:</div>
                                <div>{{ dataList.endReceiveTime ? dataList.endReceiveTime : "&lt;空&gt;" }}</div>
                            </el-col>

                            <el-col :span="6" class="info-box">
                                <div>备注:</div>
                                <div>{{ dataList.remark ? dataList.remark : "&lt;空&gt;" }}</div>
                            </el-col>

      
                            <el-col>
                                <div  class="info-title title">拆并单</div>
                            </el-col>
                            <el-input type="text" v-model="iptVal" placeholder="请输入商品编码" class="input-width" ></el-input>
                            <el-button type="primary" size="mini" @click="onSubmit" >立即搜索</el-button>

                            <div style="height:20px" />

                            <el-table :data="items" style="width: 100%; text-align: center" :row-style="{ height: '16px', padding: '-4px' }" >
                              <el-table-column type="index" label="序号"></el-table-column>

                              <el-table-column prop="productCode" label="商品编码" style="height: 20px"></el-table-column>

                              <!-- <el-table-column prop="createTime" label="创建时间" style="height: 20px"></el-table-column>
                              <el-table-column prop="creatorName" label="创建人名称" style="height: 20px"></el-table-column> -->

                              <el-table-column prop="munit" label="计量单位" style="height: 20px"></el-table-column>
                              <el-table-column prop="price" label="库存单价" style="height: 20px"></el-table-column>
                              <el-table-column prop="productDate" label="商品生产日期" style="height: 20px"></el-table-column>
                              <el-table-column prop="productName" label="商品名" style="height: 20px"></el-table-column>

                              <el-table-column prop="qty" label="数量" style="height: 20px"></el-table-column>
                              <el-table-column prop="qtystr" label="拆并件数" style="height: 20px"></el-table-column>


                            </el-table>
                        </el-tab-pane>
                        <!-- USER, DOCK, Inbound_Outbound, PRETYPE, PICK_ORDER, USER_PICKAREA, OTHER, SUPPLIER, CONTAINER, CONTAINERTYPE, DECINVBILL, INCINVBILL, PICKAREA, STORAGEAREA, PRODUCT, PRODUCTCATEGORY, BINTYPE, ZONE, PATH, SHELF, BIN, QUALITY, MOVESTOCK, LOCKSTOCK, VENDORRETURNBILL, ORDERBILL -->
                        <!-- <el-tab-pane label="操作日志" name="log">
                          <system-log modular="CONTAINER"></system-log>
                        </el-tab-pane> -->
                    </el-tabs>
                </template>
            </div>
        </div>
    </div>
</template>

<script>
import systemLog from "@/components/systemLog.vue";
import DemolitionAndService from "@/api/service/DemolitionAndService";

export default {
  data() {
      return {
        tabActiveName: 'category', // tab栏名称
        id: '', // 货位类别ID
        iptVal: '', // 搜索
        dataList: {}, // 详情数据
        items: []
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
      onSubmit() {
        if (this.iptVal === '') {
          this.items = this.dataList.items
        } else {
          this.items = this.dataList.items.filter((item) => {
            return item.productCode.indexOf(this.iptVal) !== -1
          })
        }
      },
      getByIdContainerMergerBill() {
        this.id = this.$route.query.id;

        DemolitionAndService.getByIdContainerMergerBill(this.id)
        .then(res => {
          console.log(res)
          this.dataList = res;
          this.items = res.items;
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
      this.getByIdContainerMergerBill()
    },
    filters: {
      setStatus(status) {
      // 状态。INITIAL：初始；FINISHED：已完成。
        switch (status) {
          case 'INITIAL':
            return "初始"
          case 'FINISHED':
            return "已完成"
          default:
            return '未知';
        }
      },
      setSonStatus(status) {
      // 质检列表 PENDING_QUALITY_INSPECTION：待质检，QUALIFIED：合格，UNQUALIFIED：不合格
        switch (status) {
          case '质检单状态，PENDING_QUALITY_INSPECTION':
            return "待质检"
          case 'QUALIFIED':
            return "合格"
          case 'UNQUALIFIED':
            return "不合格"
          default:
            return '未知';
        }
      },
      setQualityInspectionType(type) {
      // --质检项类型：1运输条件，2农残药残，3破坏检测，4外观检测，5食安检测
        switch (type) {
          case '1':
            return "运输条件"
          case '2':
            return "农残药残"
          case '3':
            return "破坏检测"
          case '4':
            return "外观检测"
          case '5':
            return "食安检测"
          default:
            return '未知';
        }
      },
      setOrderbillType(type) {
      // 收货方式，NOTTRUST：清点收货；TRUST：信任收货
        switch (type) {
          case 'NOTTRUST':
            return "清点收货"
          case 'TRUST':
            return "信任收货"
          default:
            return '未知';
        }
      }
    }
};
</script>

<style lang="scss" scoped>
@import "src/styles/mixin.scss";
.status{
  background: #008000;
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