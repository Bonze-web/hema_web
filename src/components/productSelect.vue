<template>
  <div>
    <div>
        <el-select
            v-model="selectProduct"
            filterable
            remote
            placeholder="请输入商品信息"
            :remote-method="getProductList"
            @change="productSelect"
            :loading="loading">
            <el-option
              v-for="item in productList"
              :key="item.id"
              :label="'[' + item.code + ']' + item.name"
              :value="item.id">
            </el-option>
              <el-pagination
                  style="float:right"
                  @current-change="handleCurrentChange"
                  :current-page="1"
                  :page-size="pageSize"
                  layout="prev,next,total"
                  :total="totalCount">
              </el-pagination>
        </el-select>
    </div>
  </div>
</template>

<script>
import ProductService from '@/api/service/ProductService';
// import PermIds from "@/api/permissionIds";
// import { mapGetters } from "vuex";

export default {
  data() {
    return {
      page: 1,
      pageSize: 10,
      totalCount: 0,
      productList: [],
      selectProduct: '',
      productInfo: {}
    };
  },
  props: {
    // keyWords: String
  },
  computed: {
    // ...mapGetters(["hasPermission"])
  },
  methods: {
    getProductList: function(query) {
      const data = {
        statusEquals: 'ON',
        codeOrNameOrBarcodeLike: query
      }
      ProductService.query(this.page, 10, data)
      .then((res) => {
        this.productList = res.records
        this.totalCount = res.totalCount
      })
    },
    productSelect: function() {
      this.productList.forEach((item) => {
        if (this.selectProduct === item.id) {
          this.productInfo = item
        }
      })
      this.$emit('productSelect', this.productInfo)
    }
  },
  watch: {
    selectProduct(newV, oldV) {
      console.log(newV, oldV)
    }
  }
};
</script>

<style lang="scss" scoped>

</style>