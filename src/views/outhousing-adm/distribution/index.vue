<template>
  <div class="table-index _table-index">
    <div class="select-head">
      <el-form ref="form" style="display: flex;flex-wrap:wrap;" :model="form" label-width="90px" label-position="right" >

        <el-form-item label="单号：">
          <el-input type="text" placeholder="请输入单号" v-model="form.billNumber" class="input-width" ></el-input>
        </el-form-item>

        <el-form-item label="波次单号：">
          <el-input type="text" placeholder="请输入波次单号" v-model="form.waveBillNumber" class="input-width" ></el-input>
        </el-form-item>

        <!-- 状态 INITIAL: 初始, LOCKED: 已占货, PICKING：拣货中，FINISHED: 已完成 -->
        <el-form-item label="状态：">
          <el-select v-model="form.status" placeholder="请选择状态">
            <el-option label="全部" value=""></el-option>
            <el-option value="INITIAL" label="初始"></el-option>
            <el-option value="LOCKED" label="已占货"></el-option>
            <el-option value="PICKING" label="拣货中"></el-option>
            <el-option value="FINISHED" label="已完成"></el-option>
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
            <router-link style="color: #409eff" :to="{ path: '/outhousing-adm/pickingProcess/edit', query:{ id: scope.row.id} }" >
              <span>{{ scope.row.billNumber }}</span>
            </router-link>
          </template>
        </el-table-column>

        <el-table-column prop="scope" label="业务类型">
          <template slot-scope="scope">
            {{ scope.row.bizType | setBizType }}
          </template>
        </el-table-column>


        <el-table-column prop="finishTime" label="完成时间" style="height: 20px"></el-table-column>
        <el-table-column prop="frontDcName" label="网络仓" style="height: 20px"></el-table-column>
        <el-table-column prop="lockTime" label="暂用存库时间" style="height: 20px"></el-table-column>
        
        <el-table-column prop="scope" label="拣货方法">
          <template slot-scope="scope">
            {{ scope.row.pickType | setPickType }}
          </template>
        </el-table-column>

        <el-table-column prop="pickUserName" label="拣货人" style="height: 20px"></el-table-column>

        <el-table-column prop="scope" label="拣货类型">
          <template slot-scope="scope">
            {{ scope.row.type | setType }}
          </template>
        </el-table-column>

        <el-table-column prop="scope" label="状态">
          <template slot-scope="scope">
            {{ scope.row.status | setStatus }}
          </template>
        </el-table-column>
  
        <!-- <el-table-column prop="scope" label="XX">
          <template slot-scope="scope">
            {{ scope.row.XX !== ' ' ? scope.row.XX : "&lt;空&gt;" }}
          </template>
        </el-table-column> -->

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
      listData: [{}], // 列表数据
      containerType: [], // 容器类型
      form: {
        billNumber: '', // 单号
        waveBillNumber: '', // 波次单号
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
          _this.sowingPickBillQuery();
        }
      });
    },
    clearInput: function() {
      this.form = {
        billNumber: '', // 单号
        waveBillNumber: '', // 波次单号
        status: '' // 状态
      };

      this.sowingPickBillQuery();
    },
    sowingPickBillQuery: function() {
      // 获取容器列表
      this.suppliersData = []

      const _this = this;

      const data = {
        page: this.page,
        pageSize: this.pageSize,
        // billNumber: this.form.billNumber, // 单号
        // waveBillNumber: this.form.waveBillNumber, // 波次单号
        // status: this.form.status ? this.form.status : null, // 状态
        searchCount: true
      };

      DeliveryService.sowingPickBillQuery(data).then((res) => {
        const records = res.records;

        this.totalCount = res.totalCount;

        console.log(records)

        _this.listData = records;
      }).catch(err => {
        this.$message.error("数据请求失败" + err.message)
      });
    },
    handleCurrentChange: function(e) {
      this.page = Number(e);
      this.sowingPickBillQuery(true);
    },
    handleSizeChange: function(e) {
      this.pageSize = Number(e);
      this.page = 1;
      this.sowingPickBillQuery(true);
    },
    printingBtn() {
      this.$message.error("打印功能还未开通")
    }
  },
  created() {
    this.sowingPickBillQuery();
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      // 通过 `vm` 访问组件实例
      vm.sowingPickBillQuery();
    })
  },
  filters: {
    setBizType(type) {
      // 业务类型。取值：DIST：配货；RETURN：退供应商
      switch (type) {
        case 'DIST':
          return "配货"
        case 'RETURN':
          return "退供应商"
        default:
          return '未知';
      }
    },
    setPickType(type) {
      // ‘拣货方法，RF：RF ，BILL：拣货单’
      switch (type) {
        case 'RF':
          return "RF"
        case 'BILL':
          return "拣货单"
        default:
          return '未知';
      }
    },
    setStatus(type) {
      // 状态 INITIAL: 初始, LOCKED: 已占货, PICKING：拣货中，FINISHED: 已完成
      switch (type) {
        case 'INITIAL':
          return "初始"
        case 'LOCKED':
          return "已占货"
        case 'PICKING':
          return "拣货中"
        case 'FINISHED':
          return "已完成"
        default:
          return '未知';
      }
    },
    setType(type) {
      // 拣货类型，PALLET：整托 ，CASE：整件 ，SPLIT：拆零
      switch (type) {
        case 'PALLET':
          return "整托"
        case 'CASE':
          return "整件"
        case 'SPLIT':
          return "拆零"
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
