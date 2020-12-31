<template>
    <div class="table-index">
      <div class="select-head">
            <el-form ref="form" style="display:flex;flex-wrap:wrap" :model="form" label-width="110px" label-position="right">
                <el-form-item label="单号">
                    <el-input type='text' placeholder="请输入单号编号" v-model="form.billNumber" class="input-width"></el-input>
                </el-form-item>
                <!-- <el-form-item label="库存处理方式">
                     <el-select v-model="form.inventoryHandlingMethod" placeholder="请选择方式">
                      <el-option label="损耗溢余" value="INVENTORY_LOSS_SURPLUS"></el-option>
                      <el-option label="转为移库单" value="MOVE_BILL"></el-option>
                    </el-select>
                </el-form-item> -->
                <el-form-item label="商品编码/名称">
                    <el-input type='text' placeholder="请输入编码/名称" v-model="form.productInfo" class="input-width"></el-input>
                </el-form-item>
                <el-form-item label="状态">
                    <el-select v-model="form.status" placeholder="请选择状态">
                      <el-option label="初始" value="INITIAL"></el-option>
                      <el-option label="进行中" value="INPROGRESS"></el-option>
                      <el-option label="已完成" value="FINISHED"></el-option>
                      <el-option label="已作废" value="ABORTED"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="计划盘点时间">
                    <el-date-picker
                      v-model="form.planDate"
                      type="daterange"
                      range-separator="至"
                      start-placeholder="开始日期"
                      end-placeholder="结束日期">
                    </el-date-picker>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" size="mini" @click="onSelect">立即搜索</el-button>
                    <el-button size="mini"  @click="clearInput">重置</el-button>
                </el-form-item>
            </el-form>
        </div>
        <div style="height:20px" />
        <div style="background:#fff;">
          <div class="btn">
            <el-row>
              <router-link :to="{ path: '/wrhmanagement/inventory/add', query:{ status: 'create'} }">
                  <!-- <span v-if="child.meta&&child.meta.title" :title="child.meta.title">{{child.meta.title}}</span> -->
                  <el-button type="primary" size="mini" @click="createBill">新建</el-button>
              </router-link>
            </el-row>
            <!-- <el-row style="margin-left:12px">
              <el-button type="primary" size="mini" @click="table = true">管理损耗类型</el-button>
            </el-row> -->
          </div>
          <el-table
                :data="lossBill"
                style="width: 100%;text-align:center"
                :row-style="{height: '16px',padding: '-4px'}"
                :default-sort = "{prop: 'billNumber'}"
            >
                <el-table-column  prop="billNumber" label="单号">
                    <template slot-scope="scope">
                        <router-link style="color:#409EFF" :to="{ path: '/wrhmanagement/lossbill/edit', query:{ status: 'read', id: scope.row.id} }">
                            <span>{{ scope.row.billNumber }}</span>
                        </router-link>
                    </template>
                </el-table-column>
                <el-table-column prop="creatorName" label="创建人">
                  <template slot-scope="scope">
                    {{ scope.row.creatorName }}
                  </template>
                </el-table-column>
                <el-table-column prop="createTime" label="创建时间">
                  <template slot-scope="scope">
                    {{ scope.row.createTime }}
                  </template>
                </el-table-column>
                  <el-table-column prop="binRange" label="货位范围">
                  <template slot-scope="scope">
                    {{ scope.row.binRange }}
                  </template>
                </el-table-column>
                <el-table-column prop="binUsage" label="货位用途">
                  <el-select v-model="form.binUsage" placeholder="请选择实盘默认值">
                      <el-option label="统配收货暂存位" value="UNIFYRECEIVE"></el-option>
                      <el-option label="上架中转位" value="PUTAWAY"></el-option>
                      <el-option label="拣货位" value="PICK"></el-option>
                      <el-option label="存储位" value="STORAGE"></el-option>
                      <el-option label="拣货存储位" value="PICK_STORAGE"></el-option>
                      <el-option label="统配拣货暂存位" value="UNIFYPICK"></el-option>
                      <el-option label="统配集货存储位" value="UNIFYCOLLECT"></el-option>
                      <el-option label="补货暂存位" value="RPL"></el-option>
                      <el-option label="中转收货暂存位" value="TRANSFERRECEIVE"></el-option>
                      <el-option label="中转集货暂存位" value="TRANSFERCOLLECT"></el-option>
                      <el-option label="直通收货暂存位" value="DIRECTRECEIVE"></el-option>
                      <el-option label="门店分拨位" value="STORECROSSALLOCATE"></el-option>
                      <el-option label="门店退货收货暂存位" value="STORERTN"></el-option>
                      <el-option label="供应商退货位" value="VENDORRTN"></el-option>
                      <el-option label="供应商集货位" value="VENDORCOLLECT"></el-option>
                    </el-select>
                </el-table-column>
                <!-- <el-table-column prop="inventoryHandlingMethod" label="库存方式">
                  <template slot-scope="scope">
                    {{ scope.row.inventoryHandlingMethod }}
                  </template>
                </el-table-column> -->
                <el-table-column prop="operationMode" label="操作方式">
                  <template slot-scope="scope">
                    {{ scope.row.operationMode | handleStatus}}
                  </template>
                </el-table-column>
                <el-table-column prop="operationMode" label="计划盘点">
                  <template slot-scope="scope">
                    {{ scope.row.operationMode}}
                  </template>
                </el-table-column>
                <el-table-column prop="realDefaultQuantity" label="实盘默认值">
                  <template slot-scope="scope">
                    {{ scope.row.realDefaultQuantity | planStatus}}
                  </template>
                </el-table-column>
                <el-table-column prop="status" label="状态">
                  <template slot-scope="scope">
                    {{ scope.row.status | showStatus}}
                  </template>
                </el-table-column>
                <el-table-column prop="takeSchema" label="盘点模式">
                  <template slot-scope="scope">
                    {{ scope.row.takeSchema | showtakeSchema}}
                  </template>
                </el-table-column>
          </el-table>
           <!-- 下面这个是翻页 -->
            <el-pagination
                style="float:right"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="1"
                :page-sizes="[10, 20, 30, 50]"
                :page-size="pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="totalCount">
            </el-pagination>
        </div>
    </div>
</template>

<script>
import InventoryService from "@/api/service/InventoryService";
import PermIds from "@/api/permissionIds";
import { mapGetters, mapActions } from "vuex";

export default {
  data() {
      return {
        PermIds: PermIds,
        table: false,
        billList: [],
        page: 1,
        pageSize: 10,
        form: {
          billNumber: null, // 盘点单号
          // inventoryHandlingMethod: null,
          planDate: [], // 盘点日期
          productInfo: null,
          searchCount: true,
          status: null
        },
        totalCount: 0,
        lossBill: []
      }
  },
  computed: {
    ...mapGetters(["hasPermission"])
  },
  methods: {
    ...mapActions(["clearSelection"]),
    createBill: function() {
      this.clearSelection()
    },
    goBack: function() {
      this.table = false
    },
    onSelect: function() {
     if (this.form.beginAndEndDate.length > 0) {
        this.form.beginTime = this.form.beginAndEndDate[0]
        this.form.endTime = this.form.beginAndEndDate[1]
      }
      this.getBillList()
    },
    clearInput: function() {
      this.form = {
          billNumber: null, // 盘点单号
          // inventoryHandlingMethod: null,
          planDate: [], // 盘点日期
          productInfo: null,
          searchCount: true,
          status: null
        }
      this.getBillList()
    },
    getAlllossType: function() {
     
    },
    getBillList: function() {
      const _this = this
      _this.form.page = 1
      _this.form.pageSize = 10
      InventoryService.getBillList(_this.form)
      .then((res) => {
        _this.lossBill = res.records;
        _this.totalCount = res.totalCount;
      })
      .catch((err) => {
        _this.$message.error('获取单据列表失败' + err.message)
      })
    },
    // 这里是修改当前值的地方
    handleCurrentChange: function(e) {
      this.page = Number(e)
      this.getSuppliersList()
    },
    handleSizeChange: function(e) {
      this.pageSize = Number(e)
      this.page = 1
      this.getSuppliersList()
    }
  },
  created() {
    // this.getAlllossType()
    // this.getBillList()
  },
  beforeRouteEnter(to, from, next) {
      next(vm => {
        // 通过 `vm` 访问组件实例
        // vm.getBillList();
        // vm.getAlllossType()
      })
    },
  filters: {
    handleStatus(status) {
      switch (status) {
        case "MANUALBILL":
          return "手工单据"
        case "HANDTERMINAL":
          return "手持终端"
      }
    },
    showStatus(status) {
      switch (status) {
        case "INITIAL":
          return "初始"
        case "INPROGRESS":
          return "进行中"
        case "FINISHED":
          return "已完成"
        case "ABORTED":
          return "已作废"
      }
    },
    showtakeSchema(status) {
      switch (status) {
        case "BLINDTAKE":
          return "盲盘"
        case "BRIGHTTAKE":
          return "明盘"
      }
    },
    planStatus(status) {
      switch (status) {
        case "ZERO":
          return "按照0处理"
        case "EQUAL_INVENTORY":
          return "按照等同于库存处理"
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.loss-type-box{
    padding: 16px;
}
.btn{
  display:flex;
  padding:18px 10px
}
/deep/ .el-table .cell{
  height: 24px;
}
</style>
<style lang="scss">
.table-index{
@import "src/styles/mixin.scss";
@include elTable;
}
</style>