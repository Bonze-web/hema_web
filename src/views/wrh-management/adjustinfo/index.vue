<template>
  <div class="table-index _table-index">
    <div class="select-head">
      <el-form ref="form" style="display: flex;flex-wrap:wrap;" :model="form" label-width="180px" label-position="right" >

        <el-form-item label="商品：">
          <el-input type="text" placeholder="请输入商品或名称" v-model="form.productCodeEqualsOrNameLike" class="input-width" ></el-input>
        </el-form-item>

        <el-form-item label="货位：">
          <el-input type="text" placeholder="请输入货位" v-model="form.containerBarcodeLike" class="input-width" ></el-input>
        </el-form-item>

        <!-- 申请单状态等于：APPLYING申请中、PASS审核通过、NO_PASS作废 -->
        <el-form-item label="状态：">
          <el-select v-model="form.status" placeholder="请选择状态" class="input-width" >
            <el-option value="" label="全部"></el-option>
            <el-option value="APPLYING" label="申请中"></el-option>
            <el-option value="PASS" label="审核通过"></el-option>
            <el-option value="NO_PASS" label="作废"></el-option>
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
        <router-link :to="{ path: '/wrhmanagement/adjustinfo/batchAdd'}" >
          <el-button style="margin: 18px 10px" type="primary" size="mini" >新建</el-button>
        </router-link>

        <el-button style="margin: 18px 10px" size="mini" @click="adopt" >审核通过</el-button>
        <el-button style="margin: 18px 10px" size="mini" @click="toVoid" >作废</el-button>
      </el-row>


      <el-table :data="listData" style="width: 100%; text-align: center" @selection-change="handleSelectionChange" :row-style="{ height: '16px', padding: '-4px' }" >
        <el-table-column type="selection" width="55"></el-table-column>

        <el-table-column prop="scope" label="调整单单号" style="height: 20px">
          <template slot-scope="scope">
            <router-link style="color: #409eff" :to="{ path: '/warehousing-adm/packing/edit', query:{ id: scope.row.id } }" >
              <span>{{ scope.row.billNumber }}33333333333333</span>
            </router-link>
          </template>
        </el-table-column>

        <el-table-column prop="scope" label="操作人">
          <template slot-scope="scope">
            {{ scope.row.applyOptName }}
          </template>
        </el-table-column>

        <el-table-column prop="scope" label="操作时间">
          <template slot-scope="scope">
            {{ scope.row.modifiedDate ? scope.row.modifiedDate : "&lt;空&gt;" }}
          </template>
        </el-table-column>

        <el-table-column prop="scope" label="货位">
          <template slot-scope="scope">
            {{ scope.row.binCode ? scope.row.binCode : "&lt;空&gt;" }}
          </template>
        </el-table-column>

        <el-table-column prop="scope" label="货位用途">
          <template slot-scope="scope">
            {{ scope.row.binUsage ? scope.row.binUsage : "&lt;空&gt;" }}
          </template>
        </el-table-column>

        <el-table-column prop="productName" label="商品"></el-table-column>

        <el-table-column prop="scope" label="供应商">
          <template slot-scope="scope">
            {{ scope.row.vendorName }}
          </template>
        </el-table-column>

        <el-table-column prop="containerBarcode" label="容器条码"></el-table-column>

        <el-table-column prop="scope" label="状态" style="height: 20px">
          <template slot-scope="scope">{{ scope.row.status | setStatus }}</template>
        </el-table-column>

        <el-table-column prop="scope" label="规格描述">
          <template slot-scope="scope">
            {{ scope.row.updateProductSpec ? scope.row.updateProductSpec : "&lt;空&gt;" }}
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
      activeArr: [], // 选中的数据
      form: {
        containerBarcodeLike: '', // 容器码
        productCodeEqualsOrNameLike: '', // 商品或名称
        status: '' // 状态
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
          _this.stockUpdateInfoBillQuery();
        }
      });
    },
    handleSelectionChange(val) {
      this.activeArr = val
    },
    clearInput: function() {
      this.form = {
        containerBarcodeLike: '', // 容器码
        productCodeEqualsOrNameLike: '', // 商品或名称
        status: '' // 状态
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
    //     DemolitionAndService.stockUpdateInfoBillQuery(obj)
    //     .then(res => {
    //       this.$message.success("收货成功")
    //       _this.stockUpdateInfoBillQuery()
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
    stockUpdateInfoBillQuery: function() {
      const _this = this;

      const data = {
        page: this.page,
        pageSize: this.pageSize,
        containerBarcodeLike: this.form.containerBarcodeLike, // 容器码
        productCodeEqualsOrNameLike: this.form.productCodeEqualsOrNameLike, // 商品或名称
        status: this.form.status ? this.form.status : null, // 状态
        searchCount: true
      };

      DemolitionAndService.stockUpdateInfoBillQuery(data).then((res) => {
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
      this.stockUpdateInfoBillQuery(true);
    },
    handleSizeChange: function(e) {
      this.pageSize = Number(e);
      this.page = 1;
      this.stockUpdateInfoBillQuery(true);
    },
    adopt() {
      // 通过
      if (this.activeArr.length === 0) return;

      this.$confirm('此操作将数据状态,是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
      .then(() => {
        const arrId = [];
        const _this = this;

        this.activeArr.forEach(item => {
          arrId.push(item.id)
        })

        DemolitionAndService.passUpdateInfoBill(arrId)
        .then((res) => {
          this.$message.success("操作成功")
          _this.stockUpdateInfoBillQuery()
        }).catch(err => {
          this.$message.error("操作失败" + err.message)
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
      const arrId = [];
      const _this = this;

      this.$prompt('请输入作废备注', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消'
        })
        .then(({ value }) => {
          this.activeArr.forEach(item => {
            arrId.push(item.id)
          })

          DemolitionAndService.noPassUpdateInfoBill(arrId)
          .then((res) => {
            this.$message.success("操作成功")
            _this.stockUpdateInfoBillQuery()
          })
          .catch(err => {
            this.$message.error("操作失败" + err.message)
          });
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
        }); 
      })
    }
  },
  created() {
    this.stockUpdateInfoBillQuery();
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      // 通过 `vm` 访问组件实例
      vm.stockUpdateInfoBillQuery(0);
    })
  },
  filters: {
    setStatus(type) {
      // 申请单状态：APPLYING申请中、PASS审核通过、NO_PASS作废
      switch (type) {
        case 'APPLYING':
          return "申请中"
        case 'PASS':
          return "审核通过"
        case 'NO_PASS':
          return "作废"
        default:
          return '未知';
      }
    },
    setType(type) {
      // 收货类型，FAST：快速收货，NORMAL：正常收货，TRUST：信任收货
      switch (type) {
        case 'FAST':
          return "快速收货"
        case 'NORMAL':
          return "正常收货"
        case 'TRUST':
          return "信任收货"
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
