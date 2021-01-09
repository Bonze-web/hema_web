<template>
  <div class="table-index _table-index">
    <div class="select-head">
      <el-form ref="form" style="display: flex;flex-wrap:wrap;" :model="form" label-width="180px" label-position="right" >

        <el-form-item label="单号：">
          <el-input type="text" placeholder="请输入单号" v-model="form.billNumberLike" class="input-width" ></el-input>
        </el-form-item>

        <el-form-item label="状态：">
          <el-select v-model="form.statusIn" placeholder="请选择质检状态" class="input-width" >
            <el-option value="" label="全部"></el-option>
            <el-option value="INITIAL" label="初始"></el-option>
            <el-option value="FINISHED" label="已完成"></el-option>
          </el-select>
        </el-form-item>
        <!-- 状态。INITIAL：初始；FINISHED：已完成。 -->

        <el-form-item label="商品：">
          <el-input type="text" placeholder="请输入商品代码/名称" v-model="form.productNameOrCodeLike" class="input-width" ></el-input>
        </el-form-item>

        <el-form-item label="来源容器：">
          <el-input type="text" placeholder="请输入容器代码" v-model="form.sourceCodeLike" class="input-width" ></el-input>
        </el-form-item>

        <el-form-item label="目标容器：">
          <el-input type="text" placeholder="请输入容器代码" v-model="form.targetCodeLike" class="input-width" ></el-input>
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
          <el-button style="margin: 18px 10px" type="primary" size="mini" >新建</el-button>
        </router-link>

        <el-button style="margin: 18px 10px" size="mini" @click="printingBtn" >打印</el-button> -->
      </el-row>


      <el-table :data="listData" style="width: 100%; text-align: center" :row-style="{ height: '16px', padding: '-4px' }" >
        <!-- <el-table-column type="selection" width="55"></el-table-column> -->
        <!-- <el-table-column type="index" label="序号"></el-table-column> -->

        <el-table-column prop="scope" sortable label="单号" style="height: 20px">
          <template slot-scope="scope">
            <router-link style="color: #409eff" :to="{ path: '/wrhmanagement/demolition-and/edit', query:{ id: scope.row.id } }" >
              <span>{{ scope.row.billNumber }}</span>
            </router-link>
          </template>
        </el-table-column>

        <el-table-column prop="scope" label="操作员">
          <template slot-scope="scope">
            {{ scope.row.billOperatorName }}
          </template>
        </el-table-column>

        <el-table-column prop="scope" label="开始拆并时间">
          <template slot-scope="scope">
            {{ scope.row.beginReceiveTime ? scope.row.beginReceiveTime : "&lt;空&gt;" }}
          </template>
        </el-table-column>

        <el-table-column prop="scope" label="结束拆并时间">
          <template slot-scope="scope">
            {{ scope.row.endReceiveTime ? scope.row.endReceiveTime : "&lt;空&gt;" }}
          </template>
        </el-table-column>

        <el-table-column v-if="type==='PALLET'" prop="scope" label="来源笼车">
          <template slot-scope="scope">
            {{ scope.row.fromPalletContainer ? scope.row.fromPalletContainer : "&lt;空&gt;" }}
          </template>
        </el-table-column>

        <el-table-column v-if="type==='PALLET'" prop="scope" label="目标笼车">
          <template slot-scope="scope">
            {{ scope.row.toPalletContainer ? scope.row.toPalletContainer : "&lt;空&gt;" }}
          </template>
        </el-table-column>


        <el-table-column prop="totalAmount" label="总金额"></el-table-column>
        <el-table-column prop="totalQtystr" label="总件数"></el-table-column>
        <el-table-column prop="totalVolume" label="总体积"></el-table-column>
        <el-table-column prop="totalWeight" label="总质量"></el-table-column>


        <el-table-column prop="wrhName" label="仓库名"></el-table-column>
        <el-table-column prop="totalAmount" label="总金额"></el-table-column>

        <el-table-column prop="scope" label="拆并类型">
          <template slot-scope="scope">
            {{ scope.row.type | setType }}
          </template>
        </el-table-column>

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
import DemolitionAndService from "@/api/service/DemolitionAndService";

export default {
  data() {
    return {
      listData: [], // 列表数据
      form: {
        billNumberLike: '', // 单号
        productNameOrCodeLike: '', // 商品名称或代码
        sourceCodeLike: '', // 来源容器代码
        statusIn: '', // 状态在。。之内
        targetCodeLike: '' // 目标容器代码
      },
      page: 1,
      pageSize: 10,
      totalCount: 0
    };
  },
  computed: {},
  methods: {
    onSubmit: function() {
      const _this = this;
      this.page = 1;

      this.$refs.form.validate((result) => {
        if (result) {
          _this.queryContainerMergerBill();
        }
      });
    },
    clearInput: function() {
      this.form = {
        billNumberLike: '', // 单号
        productNameOrCodeLike: '', // 商品名称或代码
        sourceCodeLike: '', // 来源容器代码
        statusIn: '', // 状态在。。之内
        targetCodeLike: '' // 目标容器代码
      };
    },
    // putFinish(billNumber, version) {
    //   // 确认收货
    //   const _this = this;
    //   this.$confirm('是否确认收货?', '提示', {
    //     confirmButtonText: '确定',
    //     cancelButtonText: '取消',
    //     type: 'warning'
    //   }).then(() => {
    //     const obj = {
    //       billNumber,
    //       version
    //     }
    //     DemolitionAndService.finishOrderBill(obj)
    //     .then(res => {
    //       this.$message.success("收货成功")
    //       _this.queryContainerMergerBill()
    //     })
    //     .catch(err => {
    //       this.$message.error("收货失败" + err.message)
    //     })
    //   }).catch(() => {
    //     this.$message({
    //       type: 'info',
    //       message: '已取消'
    //     })        
    //   })
    // },
    queryContainerMergerBill: function() {
      const _this = this;

      const data = {
        page: this.page,
        pageSize: this.pageSize,
        billNumberLike: this.form.billNumberLike, // 单号
        productNameOrCodeLike: this.form.productNameOrCodeLike, // 商品名称或代码
        sourceCodeLike: this.form.sourceCodeLike, // 来源容器代码
        statusIn: this.form.statusIn ? this.form.statusIn : null, // 状态在。。之内
        targetCodeLike: this.form.targetCodeLike, // 目标容器代码
        searchCount: true
      };

      DemolitionAndService.queryContainerMergerBill(data).then((res) => {
        const records = res.records;
        this.totalCount = res.totalCount;
        _this.listData = records;
      }).catch(err => {
        this.$message.error("数据请求失败" + err.message)
      });
    },
    handleCurrentChange: function(e) {
      this.page = Number(e);
      this.queryContainerMergerBill();
    },
    handleSizeChange: function(e) {
      this.pageSize = Number(e);
      this.page = 1;
      this.queryContainerMergerBill();
    },
    printingBtn() {
      // this.$message.error("打印功能还未开通")
    }
  },
  created() {
    this.queryContainerMergerBill();
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      // 通过 `vm` 访问组件实例
      vm.queryContainerMergerBill(0);
    })
  },
  filters: {
    setStatus(status) {
      // 状态。INITIAL：初始；FINISHED：已完成。
      switch (status) {
        case 'INITIAL':
          return "初始"
        case 'FINISHED':
          return "已完成"
        default:
          return '未知';
      }
    },
    setType(type) {
      // 拆并类型，CASE：整箱拆并，SPLIT：单品拆并
      switch (type) {
        case 'CASE':
          return "整箱拆并"
        case 'SPLIT':
          return "单品拆并"
        default:
          return '未知';
      }
    }
  }
};
</script>

<style lang="scss" scoped>
@import "src/styles/mixin.scss";
.input-width{
    width: 200px;

    // &.picker-time{
    //     width: 580px;
    // }
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
