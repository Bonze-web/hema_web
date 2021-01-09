<template>
  <div class="table-index _table-index">
    <div class="select-head">
      <el-form ref="form" style="display: flex;flex-wrap:wrap;" :model="form" label-width="90px" label-position="right" >

        <el-form-item label="商品：">
          <el-input type="text" placeholder="请输入商品或商品编码" v-model="form.productCodeEqualsOrNameLike" class="input-width" ></el-input>
        </el-form-item>

        <el-form-item label="拣货分区：">
          <el-select v-model="form.pickarea" placeholder="请选择拣货分区">
            <el-option label="全部" value=""></el-option>
            <el-option v-for="item in pickareaList" :key="item.id" :label="item.name" :value="item.id"></el-option>
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

        <div style="margin: 18px 10px; float: right; font-size: 14px; color: #909399;">共{{ totalCount }}条数据</div>
      </el-row>


      <el-table :data="listData" @selection-change="handleSelectionChange"  style="width: 100%; text-align: center" :row-style="{ height: '16px', padding: '-4px' }" >

        <el-table-column label="序号" type="index" width="50"> </el-table-column>
        
        <!-- <el-table-column prop="scope" label="">
          <template slot-scope="scope">
            <router-link style="color: #409eff" :to="{ path: '/outhousing-adm/to-picked/edit', query:{ id: scope.row.id} }" >
              <span>{{ scope.row.billNumber }}</span>
            </router-link>
          </template>
        </el-table-column> -->

        <el-table-column prop="scope" label="创建人">
          <template slot-scope="scope">
            {{ scope.row.creatorName }}
          </template>
        </el-table-column>

        <el-table-column prop="scope" label="收货方式">
          <template slot-scope="scope">
            {{ scope.row.method | setMethod }}
          </template>
        </el-table-column>

        <el-table-column prop="beginPickTime" label="开始拣货时间" style="height: 20px"></el-table-column>
        <el-table-column prop="endPickTime" label="结束拣货时间" style="height: 20px"></el-table-column>


        <el-table-column prop="pickUserName" label="拣货员" style="height: 20px"></el-table-column>

        <el-table-column prop="scope" label="备注">
          <template slot-scope="scope">
            {{ scope.row.remark ? scope.row.remark : "&lt;空&gt;" }}
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
      pickareaList: [], // 拣货分区列表
      listData: [], // 列表数据
      containerType: [], // 容器类型
      form: {
        productCodeEqualsOrNameLike: '', // 商品
        pickarea: '' // 拣货分区
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
        productCodeEqualsOrNameLike: '', // 商品
        pickarea: '' // 拣货分区
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
        productCodeEqualsOrNameLike: this.form.productCodeEqualsOrNameLike, // 商品
        pickarea: this.form.pickarea ? this.form.pickarea : null, // 商品
        searchCount: true
      };

      console.log(data)

      DeliveryService.sowingPickBillQuery(data).then((res) => {
        const records = res.records;

        this.totalCount = res.totalCount;

        _this.listData = records;

        console.log(_this.listData)
      }).catch(err => {
        this.$message.error("数据请求失败" + err.message)
      });
    },
    pickareaQuery() {
      DeliveryService.pickareaQuery({
        page: 1,
        pageSize: 0,
        searchCount: true
      })
      .then((res) => {
        console.log(res)
        this.pickareaList = res.records;
      }).catch(err => {
        this.$message.error("拣货分区列表获取失败" + err.message)
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
    // this.sowingPickBillQuery();
    // this.pickareaQuery() // 获取拣货分区列表
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      // 通过 `vm` 访问组件实例
      // vm.sowingPickBillQuery();
    })
  },
  filters: {
    setMethod(type) {
      // 拣货方式，MANUAL：手工单据，RF：手持终端
      switch (type) {
        case 'MANUAL':
          return "手工单据"
        case 'RF':
          return "手持终端"
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
