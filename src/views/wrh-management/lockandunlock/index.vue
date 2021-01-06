<template>
  <div class="table-index _table-index">
    <div class="select-head">
      <el-form ref="form" style="display: flex;flex-wrap:wrap;" :model="form" label-width="110px" label-position="right" >

        <el-form-item label="单号：">
          <el-input type="text" placeholder="请输入单号" v-model="form.billNumber" class="input-width" ></el-input>
        </el-form-item>

        <el-form-item label="锁定人ID：">
          <el-input type="text" placeholder="请输入锁定人ID" v-model="form.lockerId" class="input-width" ></el-input>
        </el-form-item>


        <!-- 单据类型 LOCK 锁定 UNLOCK 解锁 -->
        <el-form-item label="单据类型：">
          <el-select v-model="form.billType" placeholder="请选择单据类型" class="input-width" >
            <el-option value="" label="全部"></el-option>
            <el-option value="LOCK" label="锁定"></el-option>
            <el-option value="UNLOCK" label="解锁"></el-option>
          </el-select>
        </el-form-item>

        <!-- 状态 SAVED 已保存 AUDITED 已审核-->
        <el-form-item label="单据类型：">
          <el-select v-model="form.status" placeholder="请选择单据类型" class="input-width" >
            <el-option value="" label="全部"></el-option>
            <el-option value="SAVED" label="已保存"></el-option>
            <el-option value="AUDITED" label="已审核"></el-option>
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
        <router-link :to="{ path: '/wrhmanagement/lockandunlock/batchAdd'}" >
          <el-button style="margin: 18px 10px" type="primary" size="mini" v-if="hasPermission(PermIds.STOCK_LOCK_BILL_CREATE)" >新建</el-button>
        </router-link>

        <el-button style="margin: 18px 10px" size="mini" @click="adopt" v-if="hasPermission(PermIds.STOCK_LOCK_BILL_UPDATE)">审核通过</el-button>
        <el-button style="margin: 18px 10px" size="mini" @click="toVoid" v-if="hasPermission(PermIds.STOCK_LOCK_BILL_DELETE)" >作废</el-button>
      </el-row>


      <el-table :data="listData" style="width: 100%; text-align: center" @selection-change="handleSelectionChange" :row-style="{ height: '16px', padding: '-4px' }" >

        <el-table-column type="selection" :selectable='checkboxSelect'  width="55"></el-table-column>

        <el-table-column prop="scope" label="单号" style="height: 20px">
          <template slot-scope="scope">
            <router-link style="color: #409eff" :to="{ path: '/wrhmanagement/lockandunlock/edit', query:{ id: scope.row.id } }" >
              <span>{{ scope.row.billNumber }}</span>
            </router-link>
          </template>
        </el-table-column>

        <el-table-column prop="scope" label="单据类型">
          <template slot-scope="scope">
            {{ scope.row.billType | setBillType }}
          </template>
        </el-table-column>


        <el-table-column prop="scope" label="操作员">
          <template slot-scope="scope">
            {{ scope.row.lockerName ? scope.row.lockerName : "&lt;空&gt;" }}
          </template>
        </el-table-column>

        <el-table-column prop="scope" label="原因" style="height: 20px">
          <template slot-scope="scope">{{ scope.row.reason | setReason }}</template>
        </el-table-column>

        <el-table-column prop="scope" label="状态" style="height: 20px">
          
          <template slot-scope="scope">{{ scope.row.status | setStatus }}</template>
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
import DemolitionAndService from "@/api/service/DemolitionAndService";
import PermIds from "@/api/permissionIds";
import { mapGetters } from "vuex";

export default {
  data() {
    return {
      PermIds: PermIds,
      listData: [], // 列表数据
      activeArr: [], // 选中的数据
      form: {
        billNumber: '', // 单号
        lockerId: '', // 锁定人ID
        billType: '', // 单据类型
        status: '' // 状态
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
    onSubmit: function() {
      const _this = this;
      this.page = 1;

      this.$refs.form.validate((result) => {
        if (result) {
          _this.stockLocjBill();
        }
      });
    },
    handleSelectionChange(val) {
      this.activeArr = val
    },
    clearInput: function() {
      this.form = {
        billNumber: '', // 单号
        lockerId: '', // 锁定人ID
        billType: '', // 单据类型
        status: '' // 状态
      };
    },
    stockLocjBill: function() {
      const data = {
        page: this.page,
        pageSize: this.pageSize,
        // billNumber: this.form.billNumber, // 单号
        // lockerId: this.form.lockerId, // 锁定人ID
        // billType: this.form.billType ? this.form.billType : null, // 单据类型
        // status: this.form.status ? this.form.status : null, // 状态
        searchCount: true
      };

      DemolitionAndService.stockLocjBill(data).then((res) => {
        console.log(res)
        const records = res.records;
        this.totalCount = res.totalCount;
        this.listData = records;
      }).catch(err => {
        this.$message.error("数据请求失败" + err.message)
      });
    },
    handleCurrentChange: function(e) {
      this.page = Number(e);
      this.stockLocjBill(true);
    },
    handleSizeChange: function(e) {
      this.pageSize = Number(e);
      this.page = 1;
      this.stockLocjBill(true);
    },
    checkboxSelect(opt) {
      // SAVED:已保存，AUDITED:已审核  已保存状态禁止选中
      if (opt.status === 'SAVED') {
        return true
      }
    },
    adopt() {
      // 审核通过
      if (this.activeArr.length === 0) return;

      const stockLockBillAuditFilter = {
        ids: []
      }

      this.activeArr.forEach(item => {
        stockLockBillAuditFilter.ids.push(item.id)
      })

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
          this.stockLocjBill();
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
    toVoid() {
      // 作废
      if (this.activeArr.length === 0) return;

      const stockLockBillAuditFilter = {
        ids: []
      }

      this.activeArr.forEach(item => {
        stockLockBillAuditFilter.ids.push(item.id)
      })

      this.$confirm('是否作废锁定解锁单?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        DemolitionAndService.deleteStockLocjBill(stockLockBillAuditFilter)
        .then(res => {
          this.$message.success("操作成功")
          this.stockLocjBill();
        })
        .catch(err => {
          this.$message.error("作废失败" + err.message)
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
    this.stockLocjBill();
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      // 通过 `vm` 访问组件实例
      vm.stockLocjBill(0);
    })
  },
  filters: {
    setStatus(type) {
      // INITIAL: 初始；AUDITED：已审核，ABORTED: 已作废
      switch (type) {
        case 'INITIAL':
          return "已作废"
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
