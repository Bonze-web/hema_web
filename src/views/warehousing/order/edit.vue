<template>
    <div>
        <div class="head">
            <div class="head-title">
                <div style="margin:8px">入库订单{{ dataList.barcode  }}</div>
                <div style="margin:11px 0 5px 0; font-size: 12px; color: #999">状态{{ state }}</div>
            </div>
            <div>
                <el-button @click="back">返回</el-button>
                <el-button type="primary"  @click="printingBtn">打印</el-button>
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
                        <el-tab-pane label="入库订单" name="category">
                            <div class="info-title">摘要</div>
                            <el-col :span="6" class="info-box">
                                <div>订单类型:</div>
                                <div>{{ dataList.parentId ? dataList.parentId : "&lt;空&gt;" }}</div>
                            </el-col>
                            <el-col :span="6" class="info-box">
                                <div>供应商:</div>
                                <div>供应商 {{ '[' + dataList.useStatus + ']' + dataList.containerTypeName }}</div>
                            </el-col>
                            <el-col :span="6" class="info-box">
                                <div>物流方式:</div>
                                <div>一步越库{{ dataList.storageNumber }}</div>
                            </el-col>
                            <el-col :span="6" class="info-box">
                                <div>仓:</div>
                                <div>[01]正常仓</div>
                            </el-col>

                            <el-col :span="6" class="info-box">
                                <div>收效日期:</div>
                                <div>{{ dataList.positionCode }}2019-12-31</div>
                            </el-col>

                            <el-col :span="6" class="info-box">
                                <div>到货日期:</div>
                                <div>{{ dataList.toPositionCode ? dataList.toPositionCode : "&lt;空&gt;" }}</div>
                            </el-col>

                            <el-col :span="6" class="info-box">
                                <div>送达日期:</div>
                                <div>{{ dataList.toPositionCode ? dataList.toPositionCode : "&lt;空&gt;" }}</div>
                            </el-col>

                            <el-col :span="6" class="info-box">
                                <div>来源单:</div>
                                <div>P202011111111</div>
                            </el-col>

                            <el-col :span="6" class="info-box">
                                <div>来源方式:</div>
                                <div>手工创建</div>
                            </el-col>

                            <el-col class="info-box">
                                <div>备注:</div>
                                <div>备注备注备注备注备注备注备注备注备注备注备注{{ "&lt;空&gt;" }}</div>
                            </el-col>


                            <el-col>
                                <div  class="info-title title">子容器</div>
                            </el-col>

                            <div style="height:20px" />

                            <el-table :data="dataList.sonList" style="width: 100%; text-align: center" :row-style="{ height: '16px', padding: '-4px' }" >

                            <el-table-column prop="a" label="行" style="height: 20px">
                              <template slot-scope="scope">
                                  <span>行{{ scope.row.a }}</span>
                              </template>
                            </el-table-column>

                            <el-table-column prop="b" label="商品/商品规格" style="height: 20px">
                              <template slot-scope="scope">
                                  <span>商品/商品规格{{ scope.row.b }}</span>
                              </template>
                            </el-table-column>

                            <el-table-column prop="b" label="规格/计量单位" style="height: 20px">
                              <template slot-scope="scope">
                                  <span>规格/计量单位{{ scope.row.b }}</span>
                              </template>
                            </el-table-column>

                            <el-table-column prop="b" label="单价" style="height: 20px">
                              <template slot-scope="scope">
                                  <span>单价{{ scope.row.b }}</span>
                              </template>
                            </el-table-column>

                            <el-table-column prop="b" label="件数" style="height: 20px">
                              <template slot-scope="scope">
                                  <span>件数{{ scope.row.b }}</span>
                              </template>
                            </el-table-column>

                            <el-table-column prop="b" label="数量" style="height: 20px">
                              <template slot-scope="scope">
                                  <span>数量{{ scope.row.b }}</span>
                              </template>
                            </el-table-column>

                            <el-table-column prop="b" label="收货件数" style="height: 20px">
                              <template slot-scope="scope">
                                  <span>收货件数{{ scope.row.b }}</span>
                              </template>
                            </el-table-column>

                            <el-table-column prop="b" label="收货数量" style="height: 20px">
                              <template slot-scope="scope">
                                  <span>收货数量{{ scope.row.b }}</span>
                              </template>
                            </el-table-column>

                            <el-table-column prop="b" label="拒收件数" style="height: 20px">
                              <template slot-scope="scope">
                                  <span>拒收件数{{ scope.row.b }}</span>
                              </template>
                            </el-table-column>

                            <el-table-column prop="b" label="拒收数量" style="height: 20px">
                              <template slot-scope="scope">
                                  <span>拒收数量{{ scope.row.b }}</span>
                              </template>
                            </el-table-column>

                            <el-table-column prop="b" label="供应商" style="height: 20px">
                              <template slot-scope="scope">
                                  <span>供应商{{ scope.row.b }}</span>
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
// import BasicService from "@/api/service/BasicService";

export default {
  data() {
      return {
        state: '', // 状态
        tabActiveName: 'category', // tab栏名称
        active: 'ccc',
        status: '', // 页面状态
        form: {
          remark: 'pppppppppppppppppppppppp'
        },
        id: '', // 货位类别ID
        dataList: {} // 详情数据
      }
    },
    computed: {
    },
    methods: {
      back: function() {
        this.$store.dispatch("tagsView/delView", this.$route);
        this.$router.go(-1)
      },
      printingBtn() {
        this.$message.error("打印功能还未开通")
      }
    },
    created() {
      // this.getQueryStatus()
    },
    filters: {
      dcStatus(status) {
        switch (status) {
          case 'ON':
            return "已使用"
          case 'OFF':
            return "未使用"
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