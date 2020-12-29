<template>
    <div class="table-index">
      <div class="select-head">
            <el-form ref="form" style="display:flex;flex-wrap:wrap" :model="form" label-width="80px" label-position="right">
                <el-form-item label="单号">
                    <el-input type='text' placeholder="请输入类别编号/名称" v-model="form.billNumLikes" class="input-width"></el-input>
                </el-form-item>
                <el-form-item label="仓库">
                    <el-input type='text' placeholder="请输入上级类别编号/名称" v-model="form.wareCodeOrNameLikes" class="input-width"></el-input>
                </el-form-item>
                <el-form-item label="报告员">
                    <el-input type='text' placeholder="请输入上级类别编号/名称" v-model="form.decerNameLikes" class="input-width"></el-input>
                </el-form-item>
                <el-form-item label="状态">
                    <el-select v-model="form.statusEquals" placeholder="请选择状态">
                      <!-- <el-option label="已批准" value="APPROVED"></el-option> -->
                      <el-option label="已保存" value="SAVED"></el-option>
                      <el-option label="已审核" value="AUDITED"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="商品">
                    <el-input type='text' placeholder="请输入类别编号/名称" v-model="form.productCodeOrname" class="input-width"></el-input>
                </el-form-item>
                <el-form-item label="货位">
                    <el-input type='text' placeholder="请输入上级类别编号/名称" v-model="form.binCode" class="input-width"></el-input>
                </el-form-item>
                <el-form-item label="容器">
                    <el-input type='text' placeholder="请输入上级类别编号/名称" v-model="form.containerCodeOrNameLikes" class="input-width"></el-input>
                </el-form-item>
                <el-form-item label="创建时间">
                    <el-date-picker
                      v-model="form.beginAndEndDate"
                      type="daterange"
                      range-separator="至"
                      start-placeholder="开始日期"
                      end-placeholder="结束日期">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="来源单号">
                    <el-input type='text' placeholder="请输入上级类别编号/名称" v-model="form.srcBillNumber" class="input-width"></el-input>
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
              <router-link :to="{ path: '/wrhmanagement/overflowbill/add', query:{ status: 'create'} }">
                  <!-- <span v-if="child.meta&&child.meta.title" :title="child.meta.title">{{child.meta.title}}</span> -->
                  <el-button type="primary" size="mini" v-if="hasPermission(PermIds.PRODUCT_CATEGORY_CREATE)">新建</el-button>
              </router-link>
            </el-row>
            <el-row style="margin-left:12px">
              <el-button type="primary" size="mini" @click="table = true">管理溢余类型</el-button>
            </el-row>
          </div>
          <el-table
                :data="lossBill"
                style="width: 100%;text-align:center"
                :row-style="{height: '16px',padding: '-4px'}"
                :default-sort = "{prop: 'billNumber'}"
            >
                <el-table-column sortable prop="billNumber" label="单号">
                    <template slot-scope="scope">
                        <router-link style="color:#409EFF" :to="{ path: '/wrhmanagement/overflowbill/edit', query:{ status: 'read', id: scope.row.id} }">
                            <span>{{ scope.row.billNumber }}</span>
                        </router-link>
                    </template>
                </el-table-column>
                <el-table-column prop="billType" label="溢余类型"></el-table-column>
                <el-table-column prop="wrhCode" label="仓库">
                  <template slot-scope="scope">
                    {{ '[' + scope.row.wrhCode + ']' + scope.row.wrhName }}
                  </template>
                </el-table-column>
                <el-table-column prop="decerCode" label="报告员">
                  <template slot-scope="scope">
                    {{ scope.row.decerName }}
                  </template>
                </el-table-column>
                <el-table-column prop="createTime" label="创建时间"></el-table-column>
                <el-table-column prop="status" label="状态">
                  <template slot-scope="scope">
                    {{ scope.row.status | billStatus }}
                  </template>
                </el-table-column>
                <el-table-column prop="srcBillNumber" label="来源单号"></el-table-column>
            </el-table>
        </div>




  <!-- 管理溢余类型抽屉 -->
        <el-drawer
            :visible.sync="table"
            direction="rtl"
            :with-header="false"
            size="50%"
          >
            <div class="loss-type-box"><bill-type billTitle="溢余类型" :billList="billList" lossType="INCINV" @getAlllossType="getAlllossType" @goBack="goBack"></bill-type></div>
          </el-drawer>
    </div>
</template>

<script>
import billType from '../../../components/billType.vue';
import BillTypeService from '@/api/service/BillTypeService'
import BillService from "@/api/service/BillService";
import PermIds from "@/api/permissionIds";
import { mapGetters } from "vuex";

export default {
  data() {
      return {
        PermIds: PermIds,
        table: false,
        billList: [],
        form: {
          billNumLikes: '', // 单据号
          wareCodeOrNameLikes: '',
          decerNameLikes: '', // 报告员
          statusEquals: '',
          productCodeOrname: '', // 商品
          containerBarcode: '', // 容器
          binCode: '', // 货位
          beginAndEndDate: [],
          srcBillNumber: '' // 来源单号
        },
        lossBill: []
      }
    },
  components: {
    billType
  },
  computed: {
    ...mapGetters(["hasPermission"])
  },
  methods: {
    goBack: function() {
      this.table = false
    },
    onSelect: function() {
     if (this.form.beginAndEndDate.length > 0) {
        this.form.beginTime = this.form.beginAndEndDate[0]
        this.form.endTime = this.form.beginAndEndDate[1]
      }
      this.getOverflowBillList()
    },
    clearInput: function() {
      this.form = {
          billNumber: '', // 单据号
          wrhCodeOrName: '',
          decerCodeOrName: '', // 报告员
          statusEquals: '',
          productCodeOrname: '', // 商品
          containerCodeOrNameLikes: '', // 容器
          binCode: '', // 货位
          beginAndEndDate: [],
          srcBillNumber: '' // 来源单号
        }
      this.getOverflowBillList()
    },
    getAlllossType: function() {
      const data = {
        type: 'INCINV'
      }
      BillTypeService.getQueryType(data)
      .then((res) => {
        this.billList = res
      })
      .catch((err) => {
        this.$message.error('获取溢余类别失败' + err.message)
      })
    },
    getOverflowBillList: function() {
      const _this = this
      _this.form.page = 1
      _this.form.pageSize = 0
      BillService.getOverflowBillList(_this.form)
      .then((res) => {
        _this.lossBill = res.records
      })
      .catch((err) => {
        _this.$message.error('获取单据列表失败' + err.message)
      })
    }
  },
  created() {
    this.getAlllossType()
    this.getOverflowBillList()
  },
  beforeRouteEnter(to, from, next) {
      next(vm => {
        // 通过 `vm` 访问组件实例
        vm.getOverflowBillList();
        vm.getAlllossType()
      })
    },
  filters: {
    billStatus(status) {
      switch (status) {
        case "SAVED":
          return "已保存"
        case "APPROVED":
          return "已批准"
        case "AUDITED":
          return "已审核"
        default:
          return "未知"
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