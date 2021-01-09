<template>
  <div class="table-index _table-index">
    <div class="select-head">
      <el-form ref="form" style="display: flex;flex-wrap:wrap;" :model="form" label-width="120px" label-position="right" >

        <el-form-item label="装笼单：">
          <el-input type="text" placeholder="请输入装笼单" v-model="form.billNumber" class="input-width" ></el-input>
        </el-form-item>

        <el-form-item label="所属区块码：">
          <el-input type="text" placeholder="请输入所属区块码" v-model="form.blockCode" class="input-width" ></el-input>
        </el-form-item>

        <el-form-item label="集货位条码：">
          <el-input type="text" placeholder="请输入集货位条码" v-model="form.collectBinCode" class="input-width" ></el-input>
        </el-form-item>

        <el-form-item label="容器码：">
          <el-input type="text" placeholder="请输入容器码" v-model="form.containerCode" class="input-width" ></el-input>
        </el-form-item>

        <!-- <el-form-item label="装车人：">
          <el-input type="text" placeholder="请输入装车人" v-model="form.entrunckUserInfo" class="input-width" ></el-input>
        </el-form-item> -->

        <el-form-item label="状态：">
          <!-- 状态 CREATED:创建, PALLETED : 装笼完成；COLLECTED: 集货完成, ENTRUNCKED：已装车，SHIPED: 已发运，RECEIVED：已收货，MERGE_PALLETED 已拼笼 -->
          <el-select v-model="form.status" placeholder="请选择状态">
            <el-option label="创建" value="CREATED"></el-option>
            <el-option label="装笼完成" value="PALLETED"></el-option>
            <el-option label="集货完成" value="COLLECTED"></el-option>
            <el-option label="已装车" value="ENTRUNCKED"></el-option>
            <el-option label="已发运" value="SHIPED"></el-option>
            <el-option label="已收货" value="RECEIVED"></el-option>
            <el-option label="已拼笼" value="MERGE_PALLETED"></el-option>
          </el-select>
        </el-form-item>
        <!-- <el-form-item label="拣货分区：">
          <el-select v-model="form.pickarea" placeholder="请选择拣货分区">
            <el-option label="全部" value=""></el-option>
            <el-option v-for="item in pickareaList" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item> -->

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

        <el-table-column prop="scope" label="装笼单">
          <template slot-scope="scope">
            <router-link style="color: #409eff" :to="{ path: '/outhousing-adm/thecage/edit', query:{ id: scope.row.id} }" >
              <span>{{ scope.row.billNumber }}</span>
            </router-link>
          </template>
        </el-table-column>

        <el-table-column prop="blockCode" label="所属区块码" style="height: 20px"></el-table-column>
        <el-table-column prop="collectBinCode" label="集货位条码" style="height: 20px"></el-table-column>
        <el-table-column prop="collectUserName" label="集货人" style="height: 20px"></el-table-column>
        <el-table-column prop="containerCode" label="容器码" style="height: 20px"></el-table-column>
        <!-- <el-table-column prop="frontDcName" label="装车人码" style="height: 20px"></el-table-column> -->
        <el-table-column prop="collectBinCode" label="所属网格仓" style="height: 20px"></el-table-column>
        <el-table-column prop="palletUserName" label="装笼人" style="height: 20px"></el-table-column>
        <el-table-column prop="receiveTime" label="收货时间" style="height: 20px"></el-table-column>
        <el-table-column prop="shipUserName" label="发运人" style="height: 20px"></el-table-column>

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
      // pickareaList: [], // 拣货分区列表
      listData: [], // 列表数据
      form: {
        billNumber: '', // 装笼单
        blockCode: '', // 所属区块码
        collectBinCode: '', // 集货位条码
        containerCode: '', // 容器码
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
          _this.loadPalletList();
        }
      });
    },
    clearInput: function() {
      this.form = {
        billNumber: '', // 装笼单
        blockCode: '', // 所属区块码
        collectBinCode: '', // 集货位条码
        containerCode: '', // 容器码
        status: '' // 状态
      };

      this.loadPalletList();
    },
    loadPalletList: function() {
      // 获取容器列表
      this.suppliersData = []

      // const _this = this;

      const data = {
        page: this.page,
        pageSize: this.pageSize,
        billNumber: '', // 装笼单
        blockCode: this.form.blockCode, // 所属区块码
        collectBinCode: this.form.collectBinCode, // 集货位条码
        containerCode: this.form.containerCode, // 容器码
        status: this.form.status ? this.form.status : null, // 状态
        searchCount: true
      };

      DeliveryService.loadPalletList(data).then((res) => {
        console.log(res)
        // const records = res.records;

        // this.totalCount = res.totalCount;

        // _this.listData = records;
      }).catch(err => {
        this.$message.error("数据请求失败" + err.message)
      });
    },
    handleCurrentChange: function(e) {
      this.page = Number(e);
      this.loadPalletList(true);
    },
    handleSizeChange: function(e) {
      this.pageSize = Number(e);
      this.page = 1;
      this.loadPalletList(true);
    },
    printingBtn() {
      this.$message.error("打印功能还未开通")
    }
  },
  created() {
    this.loadPalletList();
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      // 通过 `vm` 访问组件实例
      vm.loadPalletList();
    })
  },
  filters: {
    setStatus(type) {
      // 状态 CREATED:创建, PALLETED : 装笼完成；COLLECTED: 集货完成, ENTRUNCKED：已装车，SHIPED: 已发运，RECEIVED：已收货，MERGE_PALLETED 已拼笼
      switch (type) {
        case 'CREATED':
          return "创建"
        case 'PALLETED':
          return "装笼完成"
        case 'COLLECTED':
          return "集货完成"
        case 'ENTRUNCKED':
          return "已装车"
        case 'SHIPED':
          return "已发运"
        case 'RECEIVED':
          return "已收货"
        case 'MERGE_PALLETED':
          return "已拼笼"
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
