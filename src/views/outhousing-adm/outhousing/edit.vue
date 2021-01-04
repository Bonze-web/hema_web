<template>
    <div>
        <div class="head" v-if="status === 'create' || status === 'edit'">
            <!-- <div style="margin-top:8px" v-if="status === 'create'">新建</div>
            <div style="margin-top:8px" v-else>编辑码头</div> -->
            <div>
                <el-button @click="back">取消</el-button>
                <!-- <el-button type="primary" @click="createSuppliers"  v-if="hasPermission(PermIds.WMS_DOCK_UPDATE) && workingOrg.type === 'DC'">确认</el-button> -->
                <!-- <el-button type="primary" v-if="status === 'create'">确认并创建</el-button> -->
            </div>
        </div>
        <div class="head">
            <div class="head-title" style="display:flex;align-items: center;">
                <!-- <div style="margin:8px">{{ '[' + suppliersInfo.code + ']' + suppliersInfo.name }}</div> -->
                仓库作业单详情
            </div>
            <div>
                <el-button @click="back">返回</el-button>
            </div>
        </div>
        <div style="height:20px" />
        <div class="info-content">
            <div>
                <template>
                    <el-tabs v-model="tabActiveName">
                        <el-tab-pane label="仓库作业单" name="suppliers">
                            <div class="info-title">基本信息</div>
                            <el-col :span="6" class="info-box">
                                <div>盘点单号:</div>
                                <div>{{ suppliersInfo.billNumber }}</div>
                            </el-col>
                            <el-col :span="6" class="info-box">
                                <div>所属区块编码:</div>
                                <div>{{ suppliersInfo.blockCode }}</div>
                            </el-col>
                            <el-col :span="6" class="info-box">
                                <div>所属网格仓:</div>
                                <div>{{ '[' + suppliersInfo.frontDcCode + ']' + suppliersInfo.frontDcName }}</div>
                            </el-col>
                            <el-col :span="6" class="info-box">
                                <div>是否测试单:</div>
                                <div>{{ suppliersInfo.isTest | isTestType }}</div>
                            </el-col>
                            <el-col :span="6" class="info-box">
                                <div>外部单号(物流单):</div>
                                <div>{{ suppliersInfo.sourceOrderId }}</div>
                            </el-col>
                            <el-col :span="6" class="info-box">
                                <div>外部单号(子物流单):</div>
                                <div>{{ suppliersInfo.sourceSubBillId }}</div>
                            </el-col>
                            <el-col :span="6" class="info-box">
                                <div>状态:</div>
                                <div>{{ suppliersInfo.status | suppliersStatus}}</div>
                            </el-col>
                            <el-col :span="6" class="info-box">
                                <div>门店:</div>
                                <div>{{ '[' + suppliersInfo.storeCode + ']' + suppliersInfo.storeName }}</div>
                            </el-col>
                            <el-col class="info-box">
                                <div>仓库:</div>
                                <div>{{ '[' + suppliersInfo.wrhCode + ']' + suppliersInfo.wrhName }}</div>
                            </el-col>
                            <el-col class="info-box">
                                <div>配送日期:</div>
                                <div>{{ suppliersInfo.distDate }}</div>
                            </el-col>
                        </el-tab-pane>
                    </el-tabs>
                </template>
            </div>
        </div>
        <div style="height:20px;background:#fff" />
        <div style="background:#fff" class="table-index">
          <el-table
              lable="仓库作业单"
              :data="storageList"
              style="width: 100%;text-align:center"
          >
            <el-table-column prop="name" label="商品">
                <template slot-scope="scope">
                     <span style="color:#409EFF">{{ '[' + scope.row.productCode + ']' + scope.row.productName }}</span>
                </template>
            </el-table-column>
            <el-table-column prop="canceledQty" label="已取消数量">
                <template slot-scope="scope">
                     <span style="color:#409EFF">{{ scope.row.canceledQty }}</span>
                </template>
            </el-table-column>
            <el-table-column prop="frozenQty" label="已占货数量">
                <template slot-scope="scope">
                    {{ scope.row.frozenQty}}
                </template>
            </el-table-column>
            <el-table-column prop="frozenQty" label="缺货数量">
                <template slot-scope="scope">
                    {{ scope.row.lackQty}}
                </template>
            </el-table-column>
            <el-table-column prop="pickedQty" label="已拣货数量">
                <template slot-scope="scope">
                    {{ scope.row.pickedQty}}
                </template>
            </el-table-column>
            <el-table-column prop="qpc" label="规格数">
                <template slot-scope="scope">
                    {{ scope.row.qpc}}
                </template>
            </el-table-column>
            <el-table-column prop="qpcStr" label="规格">
                <template slot-scope="scope">
                    {{ scope.row.qpcStr}}
                </template>
            </el-table-column>
            <el-table-column prop="qty" label="数量">
                <template slot-scope="scope">
                    {{ scope.row.qpcStr}}
                </template>
            </el-table-column>
            <el-table-column prop="qtyStr" label="件数">
                <template slot-scope="scope">
                    {{ scope.row.qtyStr }}
                </template>
            </el-table-column>
            <el-table-column prop="sourceOrderId" label="外部单号(物流单)">
                <template slot-scope="scope">
                    {{ scope.row.sourceOrderId }}
                </template>
            </el-table-column>
            <el-table-column prop="sourceSubOrderId" label="外部单号(子物流单)">
                <template slot-scope="scope">
                    {{ scope.row.sourceSubOrderId }}
                </template>
            </el-table-column>
            <el-table-column prop="status" label="状态">
                <template slot-scope="scope">
                    {{ scope.row.status }}
                </template>
            </el-table-column>
            <el-table-column prop="status" label="备注">
                <template slot-scope="scope">
                    {{ scope.row.remark }}
                </template>
            </el-table-column>
          </el-table>
        </div>
    </div>
</template>

<script>
import { mapGetters } from "vuex";
import OuthousingService from "@/api/service/OuthousingService";
import PermIds from "@/api/permissionIds";
import systemLog from "@/components/systemLog.vue"
export default {
  data() {
      return {
        PermIds: PermIds,
        status: '', // 页面状态
        id: '', 
        tabActiveNameOne: 'suppliers',
        tabActiveName: 'suppliers', // tab栏名称
        // dcId: '',
        form: {
          // dcId: '',
          code: '',
          name: '',
          remark: '',
          // 用途
          usages: ''
        },
        suppliersInfo: {}, 
        createRules: {
          code: [
            { required: true, message: '请输入代码', trigger: 'blur' }
          ],
          name: [
            { required: true, message: '请输入码头名称', trigger: 'blur' }
          ],
          usages: [
            { required: true, message: '请选择用途', trigger: 'blur' }
          ]
        },
        storageList: []
      }
    },
    computed: {
       ...mapGetters(["hasPermission", "workingOrg"])
    },
    methods: {
      back: function() {
        this.$store.dispatch("tagsView/delView", this.$route);
        this.$router.go(-1)
      },
      // 详情页面
      // 这个地方用来获取到之前那个页面传递过来的数据,也就是id和状态
      getQueryStatus: function() {
        this.id = this.$route.query.id;
        this.getSuppliers(this.id)
      },
      // 渲染,下面这个也是修改禁用于开启的接口调用
      getSuppliers: function(id) {
        // 如果是只读的模式,就要调取后台的数据,将数据渲染到页面上
        OuthousingService.getSuppliersDetail(id)
        .then((res) => {
          this.suppliersInfo = res;
          this.storageList = res.operateBillItemDTOList;
        })
        .catch((err) => {
          this.$message.error("获取详情失败" + err.message)
        })
      }
    },
    components: {
      "system-log": systemLog
    },
    created() {
      this.getQueryStatus()
    },
    filters: {
      isTestType(status) {
      switch (status) {
        case true:
          return "是"
        case false:
          return "否"
      }
      },
      suppliersStatus(status) {
      switch (status) {
        case "INITIAL":
          return "初始"
        case "RUNNING":
          return "进行中"
        case "FINISHED":
          return '已完成';
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
