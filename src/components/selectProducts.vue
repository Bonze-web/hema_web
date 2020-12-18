<template>
  <el-dialog title="选择商品" :visible.sync="dialogVisible" width="600px" center>
    <el-input size="small" placeholder="请输入商品名称查询" prefix-icon="el-icon-search" v-model="searchValue" @keyup.enter.native="queryProducts(1)"></el-input>
    <div style="width: 100%;height:350px;margin-top:10px;">
      <el-scrollbar style="height:100%;">
        <el-table :data="productAll" style="width: 100%;" v-loading="selectGoodsLoading">
          <el-table-column prop="goods" label="商品">
            <template slot-scope="scope">
              <div class="goods-box">
                <img class="goods-img" :src="scope.row.imageUrl" />
                <div style="width:250px;float:left;">
                  <p class="goods-name" style="width:250px;">{{scope.row.name || scope.row.productName}}</p>
                  <p class="goods-code" style="width:250px;">商品代码:{{scope.row.productNumber}}</p>
                </div>
                <el-button v-if="scope.row.checked === false" size="small" style="float:right; margin-top:5px;" @click="handleAdd(scope.row)">选择</el-button>
                <el-button v-else-if="scope.row.checked === true" size="small" type="primary" style="float:right; margin-top:5px;" @click="handleRemove(scope.row)">已选择</el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>
        <page-bar :page-data="pageData" @onreload="queryProducts"></page-bar>
      </el-scrollbar>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button size="small" @click="handleProductCancel">取 消</el-button>
      <el-button size="small" type="primary" @click="handleProductConfirm">确认添加</el-button>
    </span>
  </el-dialog>
</template>
<script>
import pageBar from "@/components/pagebar.vue";
import ProductService from "@/api/service/ProductService";
import { mapGetters } from "vuex";

export default {
  data() {
    return {
      prj: "",
      dialogVisible: false,
      selectGoodsLoading: false,
      searchValue: "", // 搜索关键字
      productAll: [],
      pageData: {
        page: 1,
        pageSize: 100,
        pageCount: 1,
        records: []
      },
      choosedProduct: []
    };
  },
  props: ["visible", "multipleProducts", "productType"],
  computed: {
    ...mapGetters(["workingOrg"])
  },
  created() {
    this.prj = process.env.PRJ;
  },
  methods: {
    // 商品框添加按钮点击事件
    handleAdd(val) {
      let ishas = false;
      this.choosedProduct.forEach(item => {
        if (item.id === val.id) {
          ishas = true;
        }
      });
      if (!ishas) {
        this.choosedProduct.push(val);
        val.checked = true;
        this.$message.success("已添加");
      }
    },
    // 商品框移除按钮点击事件
    handleRemove(val) {
      var tempArr = [];
      this.choosedProduct.forEach(item => {
        if (item.id !== val.id) {
          tempArr.push(item);
        }
      });
      val.checked = false;
      this.choosedProduct = tempArr;
      this.$message.success("已移除");
    },
    /* 查询商品 */
    queryProducts(page, pageSize) {
      if (!page) {
        page = this.pageData.page;
      }
      if (!pageSize) {
        pageSize = this.pageData.pageSize;
      }

      this.selectGoodsLoading = true;
      this.productAll = [];
      // 如果是查询普通商品
      var tempBusiness = ["CATERING", "RETAIL"];
      var stylesIn = ["SINGLE", "MEALS"];
      if (this.productType && this.productType === "DISTRIBUTION") {
        tempBusiness = ["DISTRIBUTION"];
      }
      const options = {
        businessIn: tempBusiness,
        statusEquals: "NORMAL",
        keywordLikes: this.searchValue,
        includeChild: false,
        stylesIn: stylesIn
      };
      ProductService.queryProduct(page, pageSize, options)
        .then(res => {
          this.pageData = res;
          if (res.records && res.records.length > 0) {
            res.records.forEach(item => {
              this.productAll.push({
                ...item,
                showProducts: false,
                checked: this.checkProductSelect(item.id, item),
                products: []
              });
            });
          }
          this.selectGoodsLoading = false;
        })
        .catch(err => {
          this.selectGoodsLoading = false;
          this.$message.error(err.message);
        });
    },

    /* 点击取消 */
    handleProductCancel() {
      this.dialogVisible = false;
      this.choosedProduct = [];
    },
    /* 点击确认 */
    handleProductConfirm() {
      var choosedProduct = [];
      if (this.choosedProduct.length > 0) {
        this.choosedProduct.forEach(item => {
          var obj = {
            productId: item.productId || item.id,
            productName: item.productName || item.name,
            business: item.business,
            originalPrice: item.originalPrice,
            imageUrl: item.imageUrl,
            description: item.description,
            productNumber: item.productNumber
          };
          choosedProduct.push(obj);
        });
      }
      this.$emit("selectResult", choosedProduct);
      this.dialogVisible = false;
    },
    checkProductSelect(productId, product = null) {
      var isHas = false;
      var choosedProduct = this.choosedProduct;
      for (let i = 0; i < choosedProduct.length; i++) {
        const item = choosedProduct[i];
        if (item.id === productId || item.productId === productId) {
          isHas = true;
          if (product) {
            // 更新信息
            choosedProduct[i].imageUrl = product.imageUrl;
            choosedProduct[i].productName = product.name;
            choosedProduct[i].originalPrice = product.originalPrice;
            choosedProduct[i].description = product.description;
            choosedProduct[i].productNumber = product.productNumber;
          }
          break;
        }
      }
      return isHas;
    }
  },
  watch: {
    visible: function(val) {
      this.dialogVisible = val;
      if (val) {
        if (Array.isArray(this.multipleProducts)) {
          this.choosedProduct = [].concat(this.multipleProducts);
        }
        this.queryProducts();
      } else {
        this.choosedProduct = [];
      }
    },
    dialogVisible: function(val) {
      this.$emit("update:visible", val);
    }
  },
  components: {
    pageBar
  }
};
</script>
<style lang="scss" scoped>
.search-box {
  margin-top: 10px;
}
.goods-box {
  overflow: hidden;
}
.goods-img {
  width: 50px;
  height: 50px;
  margin-right: 10px;
  float: left;
  overflow: hidden;
}

.goods-name,
.goods-code {
  margin: 0px;
  padding: 0px;
  line-height: 25px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.goods-list {
  padding: 20px 10px;
  > div {
    overflow: hidden;
    padding: 12px 0;
    border-bottom: 1px solid #e9ecec;
    .goods-name {
      white-space: normal;
    }
    &:last-of-type {
      border-bottom: 0px;
    }
  }
}
.el-dialog__wrapper {
  background: transparent !important;
}
</style>
