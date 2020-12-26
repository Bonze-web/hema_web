<template>
    <div class="table-index" style="background:#fff">
        <div class="title">批量添加</div>
        <div class="">
            <el-form ref="form" style="display:flex;flex-wrap:wrap" :model="form" label-width="80px" label-position="right">
                <el-form-item label="商品">
                    <el-input type='text' placeholder="请输入商品编号/名称" v-model="form.product" class="input-width"></el-input>
                </el-form-item>
                <el-form-item label="货位">
                    <el-input type='text' placeholder="请输入货位编号" v-model="form.bin" class="input-width"></el-input>
                </el-form-item>
                <el-form-item label="容器">
                    <el-input type='text' placeholder="请输入容器条码" v-model="form.container" class="input-width"></el-input>
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
                <el-table-column label="商品">
                    <template slot-scope="scope">{{ scope.row.date }}</template>
                </el-table-column>
                <el-table-column label="货位">
                    <template slot-scope="scope">{{ scope.row.date }}</template>
                </el-table-column>
                <el-table-column label="容器">
                    <template slot-scope="scope">{{ scope.row.date }}</template>
                </el-table-column>
                <el-table-column label="供应商">
                    <template slot-scope="scope">{{ scope.row.date }}</template>
                </el-table-column>
                <el-table-column label="批号">
                    <template slot-scope="scope">{{ scope.row.date }}</template>
                </el-table-column>
                <el-table-column label="生产日期">
                    <template slot-scope="scope">{{ scope.row.date }}</template>
                </el-table-column>
                <el-table-column label="到效日期">
                    <template slot-scope="scope">{{ scope.row.date }}</template>
                </el-table-column>
                <el-table-column label="规格">
                    <template slot-scope="scope">{{ scope.row.date }}</template>
                </el-table-column>
                <el-table-column label="数量">
                    <template slot-scope="scope">{{ scope.row.date }}</template>
                </el-table-column>
                <el-table-column label="批次">
                    <template slot-scope="scope">{{ scope.row.date }}</template>
                </el-table-column>
            </el-table>
        </div>
        <div style="float:right">
            <el-button size="mini" @click="goBack">取消</el-button>
            <el-button type="primary" size="mini"  @click="batchAddLoss">添加</el-button>
        </div>
    </div>
</template>

<script>
// import BillTypeService from '@/api/service/BillTypeService'
// import BillService from "@/api/service/BillService";
import ProductService from "@/api/service/ProductService";
import PermIds from "@/api/permissionIds";
import { mapGetters, mapActions } from "vuex";

export default {
  data() {
      return {
        PermIds: PermIds,
        form: {
            product: '',
            bin: '',
            container: '',
            statusEquals: 'ON'
        },
        page: 1,
        pageSize: 10,
        productList: [],
        multipleSelection: [{}, {}, {}, {}, {}] // 被选中的商品
      }
    },
  components: {
  },
  computed: {
    ...mapGetters(["hasPermission"])
  },
  methods: {
    ...mapActions(["addSelection"]),
    getRowKeys(row) {
      return row.id
    },
    goBack: function() {
      this.$store.dispatch("tagsView/delView", this.$route);
      this.$router.go(-1)
    },
    clearInput: function() {
      this.form = {
        product: '',
        bin: '',
        container: '',
        statusEquals: 'ON'
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
    batchAddLoss: function() {
      this.addSelection(this.multipleSelection)
      console.log(this.multipleSelection)
      this.$store.dispatch("tagsView/delView", this.$route);
      this.$router.go(-1)
    },
    handleSelectionChange(val) {
      // 列表进行选择保存数据
      this.multipleSelection = val;
    },
    onSelect: function() {
      if (this.form.product || this.form.bin || this.form.container) {
        console.log(1)
        // ProductService.getAllProduct()
        // .then((result) => {
          
        // }).catch((err) => {
          
        // });
      } else {
        this.$message.error('请至少填写一项以进行筛选搜索')
      }
    }
  },
  created() {
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