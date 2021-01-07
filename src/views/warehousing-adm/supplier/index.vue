<template>
  <div class="table-index _table-index">
    <div class="select-head">
      <el-form ref="form" style="display: flex;flex-wrap:wrap;" :model="form" label-width="90px" label-position="right" >

        <el-form-item label="单号：">
          <el-input type="text" placeholder="请输入单号" v-model="form.billNumberEquals" class="input-width" ></el-input>
        </el-form-item>

        <el-form-item label="商铺：">
          <el-input type="text" placeholder="请输入商铺编码或编码" v-model="form.productCodeEqualsOrNameLike" class="input-width" ></el-input>
        </el-form-item>

        <el-form-item label="供应商：">
          <el-input type="text" placeholder="请输入供应商或编码" v-model="form.vendorCodeEqualsOrNameLike" class="input-width" ></el-input>
        </el-form-item>

        <!-- //初始 INITIAL, 审核 AUDITED, 完成 FINISHED, 作废 ABORTED;  -->
        <el-form-item label="状态：">
          <el-select v-model="form.statusEquals" placeholder="请选择状态">
            <el-option label="全部" value=""></el-option>
            <el-option value="INITIAL" label="初始"></el-option>
            <el-option value="AUDITED" label="审核"></el-option>
            <el-option value="FINISHED" label="完成"></el-option>
            <el-option value="ABORTED" label="作废"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" size="mini" @click="onSubmit" >立即搜索</el-button>
          <el-button size="mini" @click="clearInput">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    
    <div style="height: 20px" />

    <div style="background: #fff;">
      <el-row>
        <router-link :to="{ path: '/basicinfo/container/add' }" >
          <el-button style="margin: 18px 10px" type="primary" size="mini" v-if="hasPermission(PermIds.WMS_CONTAINER_CREATE)">新建</el-button>
        </router-link>

        <el-button style="margin: 18px 10px" size="mini" @click="printingBtn" >打印</el-button>
      </el-row>


      <el-table :data="listData" @selection-change="handleSelectionChange"  style="width: 100%; text-align: center" :row-style="{ height: '16px', padding: '-4px' }" >
        <el-table-column prop="scope" label="条码" style="height: 20px">
          <template slot-scope="scope">
            <router-link style="color: #409eff" :to="{ path: '/warehousing-adm/supplier/edit', query:{ id: scope.row.id} }" >
              <span>{{ scope.row.billNumber }}</span>
            </router-link>
          </template>
        </el-table-column>

  
        <el-table-column prop="scope" label="总金额">
          <template slot-scope="scope">
            {{ scope.row.amount !== ' ' ? scope.row.amount : "&lt;空&gt;" }}
          </template>
        </el-table-column>

        <!-- <el-table-column prop="scope" label="创建时间">
          <template slot-scope="scope">
            {{ scope.row.createTime !== ' ' ? scope.row.createTime : "&lt;空&gt;" }}
          </template>
        </el-table-column> -->

        <el-table-column prop="scope" label="商品品相数">
          <template slot-scope="scope">
            {{ scope.row.productItemCount !== '0' ? scope.row.productItemCount : "&lt;空&gt;" }}
          </template>
        </el-table-column>

        <el-table-column prop="scope" label="总件数">
          <template slot-scope="scope">
            {{ scope.row.qtyStr !== '0' ? scope.row.qtyStr : "&lt;空&gt;" }}
          </template>
        </el-table-column>

        <el-table-column prop="scope" label="总数量">
          <template slot-scope="scope">
            {{ scope.row.qty !== '0' ? scope.row.qty : "&lt;空&gt;" }}
          </template>
        </el-table-column>

        <el-table-column prop="scope" label="备注">
          <template slot-scope="scope">
            {{ scope.row.remark !== '0' ? scope.row.remark : "&lt;空&gt;" }}
          </template>
        </el-table-column>

        <el-table-column prop="scope" label="商品品相数">
          <template slot-scope="scope">
            {{ scope.row.productItemCount !== '0' ? scope.row.productItemCount : "&lt;空&gt;" }}
          </template>
        </el-table-column>

        <el-table-column prop="scope" label="来源单类型">
          <template slot-scope="scope">
            {{ scope.row.srcBillType | setSrcBillType }}
          </template>
        </el-table-column>
        
        <el-table-column prop="scope" label="状态">
          <template slot-scope="scope">
            {{ scope.row.status | setStatus }}
          </template>
        </el-table-column>

        <el-table-column label="操作">
          <template slot-scope="scope">
            <!-- <el-button size="mini" type="text">审核</el-button> -->
            <el-button size="mini" type="text" v-if="scope.row.status === 'AUDITED'" @click="complete(scope.row.id, scope.row.version)">完成</el-button>
            <el-button v-else style="border: none; cursor: auto"></el-button>
          </template>
        </el-table-column>

      </el-table>

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
import WarehousingAdmServers from "@/api/service/WarehousingAdmServers";
import PermIds from "@/api/permissionIds";
import { mapGetters } from "vuex";

export default {
  data() {
    return {
      PermIds: PermIds,
      listData: [], // 列表数据
      form: {
        billNumberEquals: '', // 单号
        productCodeEqualsOrNameLike: '', // 商铺或编码
        positionCodeOrNameEquals: '', // 当前位置
        statusEquals: '', // 状态
        vendorCodeEqualsOrNameLike: '' // 供应商或编码
      },
      page: 1,
      pageSize: 10,
      totalCount: 0
    };
  },
  computed: {
    ...mapGetters(["hasPermission"])
  },
  methods: {
    handleSelectionChange(val) {
      console.log(val)
    },
    onSubmit: function() {
      const _this = this;
      this.page = 1;

      this.$refs.form.validate((result) => {
        if (result) {
          _this.vendorReturnBillQuery();
        }
      });
    },
    clearInput: function() {
      this.form = {
        billNumberEquals: '', // 单号
        productCodeEqualsOrNameLike: '', // 商铺或编码
        positionCodeOrNameEquals: '', // 当前位置
        statusEquals: '', // 状态
        vendorCodeEqualsOrNameLike: '' // 供应商或编码
      };

      this.vendorReturnBillQuery();
    },
    vendorReturnBillQuery: function() {
      // 获取容器列表
      this.suppliersData = []

      const _this = this;

      const data = {
        page: this.page,
        pageSize: this.pageSize,
        billNumberEquals: this.form.billNumberEquals, // 单号
        productCodeEqualsOrNameLike: this.form.productCodeEqualsOrNameLike, // 商铺或编码
        positionCodeOrNameEquals: this.form.positionCodeOrNameEquals, // 当前位置
        vendorCodeEqualsOrNameLike: this.form.vendorCodeEqualsOrNameLike, // 供应商或编码
        statusEquals: this.form.statusEquals ? this.form.statusEquals : null, // 状态
        searchCount: true
      };

      WarehousingAdmServers.vendorReturnBillQuery(data).then((res) => {
        console.log(res)
        const records = res.records;

        this.totalCount = res.totalCount;
        _this.listData = records;
      }).catch(err => {
        this.$message.error("数据请求失败" + err.message)
      });
    },
    handleCurrentChange: function(e) {
      this.page = Number(e);
      this.vendorReturnBillQuery(true);
    },
    handleSizeChange: function(e) {
      this.pageSize = Number(e);
      this.page = 1;
      this.vendorReturnBillQuery(true);
    },
    complete(id, version) {
      this.$confirm('此操作将改变数据状态，是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
      .then(() => {
        WarehousingAdmServers.vendorReturnBillFinish(id, version)
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
    },
    printingBtn() {
      this.$message.error("打印功能还未开通")
    }
  },
  created() {
    this.vendorReturnBillQuery();
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      // 通过 `vm` 访问组件实例
      vm.vendorReturnBillQuery(0);
    })
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
</style>
<style lang="scss">
.table-index {
  @import "src/styles/mixin.scss";
  @include elTable;
}

// ._table-index .el-table .cell{
//   padding: 7px 0;
// }
</style>
