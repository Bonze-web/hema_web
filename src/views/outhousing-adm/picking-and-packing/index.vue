<template>
  <div class="table-index _table-index">
    <div class="select-head">
      <el-form ref="form" style="display: flex;flex-wrap:wrap;" :model="form" label-width="120px" label-position="right" >

        <el-form-item label="拣货单：">
          <el-input type="text" placeholder="请输入拣货单" v-model="form.pickBillNumber" class="input-width" ></el-input>
        </el-form-item>

        <el-form-item label="容器码：">
          <el-input type="text" placeholder="请输入容器码" v-model="form.containerCode" class="input-width" ></el-input>
        </el-form-item>

        <el-form-item label="波次单号：">
          <el-input type="text" placeholder="请输入波次单号" v-model="form.waveBillNumber" class="input-width" ></el-input>
        </el-form-item>

        <el-form-item label="拣货方法：">
          <!-- 拣货方法，RF：RF拣货 ，BILL：单据拣货，DPS：电子标签拣货，LABEL：标签拣货 -->
          <el-select v-model="form.pickMode" placeholder="请选择拣货方法">
            <el-option label="RF拣货" value="RF"></el-option>
            <el-option label="单据拣货" value="BILL"></el-option>
            <el-option label="电子标签拣货" value="DPS"></el-option>
            <el-option label="标签拣货" value="LABEL"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="状态：">
          <!-- 状态 INITIAL: 初始，FINISHED: 已完成 -->
          <el-select v-model="form.status" placeholder="请选择状态">
            <el-option label="初始" value="INITIAL"></el-option>
            <el-option label="已完成" value="FINISHED"></el-option>
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
        <!-- <router-link :to="{ path: '/basicinfo/container/add' }" >
          <el-button style="margin: 18px 10px" type="primary" size="mini" v-if="hasPermission(PermIds.WMS_CONTAINER_CREATE)">新建</el-button>
        </router-link> -->

        <!-- <el-button style="margin: 18px 10px" size="mini" @click="printingBtn" >打印</el-button> -->
      </el-row>


      <el-table :data="listData" @selection-change="handleSelectionChange"  style="width: 100%; text-align: center" :row-style="{ height: '16px', padding: '-4px' }" >

        <el-table-column prop="scope" label="单号">
          <template slot-scope="scope">
            <router-link style="color: #409eff" :to="{ path: '/outhousing-adm/pickingandpacking/edit', query:{ id: scope.row.id} }" >
              <span>{{ scope.row.billNumber }}</span>
            </router-link>
          </template>
        </el-table-column>

        <el-table-column prop="containerCode" label="容器编码" style="height: 20px"></el-table-column>
        <el-table-column prop="finishTime" label="完成时间" style="height: 20px"></el-table-column>
        <el-table-column prop="pickBillNumber" label="拣货单号" style="height: 20px"></el-table-column>

        <el-table-column prop="waveBillNumber" label="波次单号" style="height: 20px"></el-table-column>
        <el-table-column prop="wrhName" label="仓区" style="height: 20px"></el-table-column>

        <el-table-column prop="scope" label="状态">
          <template slot-scope="scope">
            {{ scope.row.status | setStatus }}
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
import DeliveryService from "@/api/service/DeliveryService";
import PermIds from "@/api/permissionIds";
import { mapGetters } from "vuex";

export default {
  data() {
    return {    
      PermIds: PermIds,
      listData: [], // 列表数据
      form: {
        pickBillNumber: '', // 拣货单
        containerCode: '', // 容器码
        waveBillNumber: '', // 波次号
        pickMode: '', // 拣货方法
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
    handleSelectionChange(val) {
      console.log(val)
    },
    onSubmit: function() {
      const _this = this;
      this.page = 1;

      this.$refs.form.validate((result) => {
        if (result) {
          _this.pickContainerBill();
        }
      });
    },
    clearInput: function() {
      this.form = {
        pickBillNumber: '', // 拣货单
        containerCode: '', // 容器码
        waveBillNumber: '', // 波次号
        pickMode: '', // 拣货方法
        status: '' // 状态
      };

      this.pickContainerBill();
    },
    pickContainerBill: function() {
      // 获取容器列表
      this.suppliersData = []

      const _this = this;

      const data = {
        page: this.page,
        pageSize: this.pageSize,
        pickBillNumber: this.form.pickBillNumber, // 拣货单
        containerCode: this.form.containerCode, // 容器码
        waveBillNumber: this.form.waveBillNumber, // 波次号
        pickMode: this.form.pickMode, // 拣货方法
        status: this.form.status ? this.form.status : null, // 状态
        searchCount: true
      };
 
      DeliveryService.pickContainerBill(data).then((res) => {
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
      this.pickContainerBill(true);
    },
    handleSizeChange: function(e) {
      this.pageSize = Number(e);
      this.page = 1;
      this.pickContainerBill(true);
    },
    printingBtn() {
      this.$message.error("打印功能还未开通")
    }
  },
  created() {
    this.pickContainerBill();
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      // 通过 `vm` 访问组件实例
      vm.pickContainerBill();
    })
  },
  filters: {
    setStatus(type) {
      // 初始 INITIAL 已完成 FINISHED;
      switch (type) {
        case 'INITIAL ':
          return "初始"
        case 'FINISHED':
          return "已完成"
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
