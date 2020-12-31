<template>
    <div class="table-index" style="background:#fff">
        <div class="title">批量添加</div>
        <div class="">
            <el-form ref="form" style="display:flex;flex-wrap:wrap" :model="form" label-width="80px" label-position="right">
                <el-form-item label="商品">
                    <el-input type='text' placeholder="请输入商品编号/名称" v-model="form.productNameOrCode" class="input-width"></el-input>
                </el-form-item>
                <el-form-item label="货位">
                    <el-input type='text' placeholder="请输入货位编号" v-model="form.binCode" class="input-width"></el-input>
                </el-form-item>
                <el-form-item label="容器">
                    <el-input type='text' placeholder="请输入容器条码" v-model="form.containerBarcode" class="input-width"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" size="mini" @click="onSelect">立即搜索</el-button>
                    <el-button size="mini"  @click="clearInput">重置</el-button>
                </el-form-item>
            </el-form>
        </div>
        <div>
            <el-table
                ref="multipleTable"
                :data="productList"
                tooltip-effect="dark"
                :row-key="getRowKeys"
                style="width: 100%"
                @selection-change="handleSelectionChange">
                <el-table-column
                    type="selection"
                    width="40"
                    :reserve-selection="true"
                >
                </el-table-column>
                <el-table-column prop="productName" label="商品"></el-table-column>
                <el-table-column prop="binCode" label="货位"></el-table-column>
                <el-table-column prop="containerBarcode" label="容器"></el-table-column>
                <el-table-column prop="vendorName" label="供应商"></el-table-column>
                <el-table-column prop="productionBatch" label="批号"></el-table-column>
                <el-table-column prop="productionDate" label="生产日期"></el-table-column>
                <el-table-column prop="validDate" label="到效日期"></el-table-column>
                <el-table-column prop="qpcStr" label="规格"></el-table-column>
                <el-table-column prop="qty" label="数量"></el-table-column>
                <el-table-column prop="batch" label="批次"></el-table-column>
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
        <div>
            <el-button size="mini" @click="goBack">取消</el-button>
            <el-button type="primary" size="mini"  @click="batchAddMove">添加</el-button>
        </div>
    </div>
</template>

<script>
import ProductService from "@/api/service/ProductService";
import PermIds from "@/api/permissionIds";
import { mapGetters, mapActions } from "vuex";

export default {
  data() {
      return {
        totalCount: 0,
        PermIds: PermIds,
        form: {
            productNameOrCode: '',
            binCode: '',
            containerBarcode: '',
            statusIn: 'NORMAL',
            searchCount: true
        },
        page: 1,
        pageSize: 10,
        productList: [],
        moveSelection: [] // 被选中的商品
      }
    },
  components: {
  },
  computed: {
    ...mapGetters(["hasPermission"])
  },
  methods: {
    ...mapActions(["addMove", "clearMove"]),
    getRowKeys(row) {
      return row.id
    },
    goBack: function() {
      this.$store.dispatch("tagsView/delView", this.$route);
      this.$router.go(-1)
    },
    clearInput: function() {
      this.form = {
        productNameOrCode: '',
        binCode: '',
        containerBarcode: '',
        statusIn: 'NORMAL',
        searchCount: true
      }
      this.onSelect()
    },
    getProduct: function() {
      ProductService.query(this.page, this.pageSize, this.form)
      .then((res) => {
        this.productList = res.records
      }).catch((err) => {
        this.$message.error('获取商品列表失败' + err.message)
      });
    },
    batchAddMove: function() {
      this.addMove(this.moveSelection)
      this.$store.dispatch("tagsView/delView", this.$route);
      this.$router.go(-1)
    },
    handleSelectionChange(val) {
      // 列表进行选择保存数据
      console.log(val)
      this.moveSelection = val;
    },
    onSelect: function() {
      if (this.form.productNameOrCode || this.form.binCode || this.form.containerBarcode) {
        console.log(this.moveSelection)
        this.form.page = this.page
        this.form.pageSize = this.pageSize
        ProductService.getAllStock(this.form)
        .then((result) => {
          this.productList = result.records
          this.totalCount = result.totalCount
          this.toggleSelection(this.moveSelection)
        }).catch((err) => {
          this.$message.error('获取商品列表失败' + err.message)
        });
      } else {
        this.$message.error('请至少填写一项以进行筛选搜索')
      }
    },
    toggleSelection(rows) {
      if (rows) {
        console.log(rows, 'rows')
        rows.forEach(row => {
            this.$refs.multipleTable.toggleRowSelection(row);
        });
      }
    }, 
    handleCurrentChange: function(e) {
        this.page = Number(e)
        this.onSelect()
        this.toggleSelection()
      },
      handleSizeChange: function(e) {
        this.pageSize = Number(e)
        this.page = 1
        this.onSelect()
        this.toggleSelection()
      }
  },
  created() {
    this.moveSelection = this.$store.state.bill.moveSelection
    this.toggleSelection(this.moveSelection)
  },
  filters: {
  }
};
</script>

<style lang="scss" scoped>
.title{
    margin: 18px 12px;
    padding-top: 18px;
}
</style>
<style lang="scss">
.table-index{
@import "src/styles/mixin.scss";
@include elTable;
}
</style>