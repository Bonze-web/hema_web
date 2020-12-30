<template>
    <div>
        <div class="head">
            <div class="head-title">
                <div style="margin:8px">{{ dataList.orderbillIdNumber }}</div>
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
                                <div>质检单号:</div>
                                <div>{{ dataList.orderNumber }}</div>
                            </el-col>

                            <el-col :span="6" class="info-box">
                                <div>创建时间:</div>
                                <div>{{ dataList.createTime }}</div>
                            </el-col>

                            <el-col :span="6" class="info-box">
                                <div>最后更新时间:</div>
                                <div>{{ dataList.updateTime ? dataList.updateTime : "&lt;空&gt;" }}</div>
                            </el-col>

                            <el-col :span="6" class="info-box">
                                <div>入库订单单号:</div>
                                <div>{{dataList.orderBillNumber}}</div>
                            </el-col>

                            <el-col :span="6" class="info-box">
                                <div>最后更新人:</div>
                                <div>{{ dataList.updatorName }}</div>
                            </el-col>

                            <el-col>
                                <div  class="info-title title">质检类型</div>
                            </el-col>
                            <el-input type="text" v-model="iptVal" placeholder="请输入商品编号" class="input-width" ></el-input>
                            <el-button type="primary" size="mini" @click="onSubmit" >立即搜索</el-button>

                            <div style="height:20px" />

                            <el-table :data="qualityInspectionTypeList" style="width: 100%; text-align: center" :row-style="{ height: '16px', padding: '-4px' }" >
                              <el-table-column type="index" label="序号"></el-table-column>

                              <el-table-column prop="productCode" label="商品编码" style="height: 20px"></el-table-column>
                              <el-table-column prop="productName" label="商品名称" style="height: 20px"></el-table-column>

                              <el-table-column prop="qualityInspectionType" label="质检类型" style="height: 20px">
                                <template slot-scope="qualityInspectionType">
                                  {{ qualityInspectionType | setQualityInspectionType }}
                                </template>
                              </el-table-column>

                              <el-table-column prop="actualInspectionNum" label="实检数量" style="height: 20px"></el-table-column>
                              <el-table-column prop="unqualifiedNum" label="不合格数量" style="height: 20px"></el-table-column>

                              <el-table-column prop="updateTime" label="最后更新时间" style="height: 20px"></el-table-column>
                              <el-table-column prop="updatorName" label="最后更新人名称" style="height: 20px"></el-table-column>

                              <el-table-column prop="vehicleExternalTemperature" label="车辆外部温度" style="height: 20px"></el-table-column>
                              <el-table-column prop="vehicleTemperature" label="车辆温度" style="height: 20px"></el-table-column>

                              <el-table-column prop="status" label="状态" style="height: 20px">
                                <template slot-scope="status">
                                  {{ status | setSonStatus }}
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
// DetailsqualityInspection  详情get（id）函数

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
          this.orderBillItems = this.dataList.orderBillItems
        } else {
          this.orderBillItems = this.dataList.orderBillItems.filter((item) => {
            return item.billNumber.indexOf(this.iptVal) !== -1
          })
        }
      },
      detailsqualityInspection() {
        this.id = this.$route.query.id;

        WarehousingAdmServers.detailsqualityInspection(this.id)
        .then(res => {
          console.log(res)
          this.dataList = res;
          this.orderBillItems = res.orderBillItems;
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
      this.detailsqualityInspection()
    },
    filters: {
      setStatus(status) {
      // 质检单状态，PENDING_QUALITY_INSPECTION:待质检，FINISHED:已完成，UNFINISHED:未完成
        switch (status) {
          case 'PENDING_QUALITY_INSPECTION':
            return "待质检"
          case 'FINISHED':
            return "已完成"
          case 'UNFINISHED':
            return "未完成"
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