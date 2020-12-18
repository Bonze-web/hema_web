<template>
  <el-dialog title="选择商品" :visible.sync="dialogVisible" width="600px" center>
    <div class="search-box" v-if="queryType === 'normal'">
      <el-input size="small" placeholder="请输入商品名称查询" prefix-icon="el-icon-search" v-model="searchValue" @keyup.enter.native="queryProducts(1)"></el-input>
    </div>
    <div class="search-box" v-if="queryType ==='team'">
      <el-input size="small" placeholder="请输入团购活动名称查询" prefix-icon="el-icon-search" v-model="searchValue" @keyup.enter.native="queryProducts(1)"></el-input>
    </div>
    <div style="width: 100%;height:350px;margin-top:10px;">
      <el-scrollbar style="height:100%;">
        <el-table :data="productAll" style="width: 100%;" v-loading="selectGoodsLoading">
          <el-table-column prop="goods" label="商品">
            <template slot-scope="scope">
              <div class="goods-box">
                <img class="goods-img" :src="scope.row.imageUrl" />
                <div style="width:250px;float:left;">
                  <p class="goods-name" style="width:250px;">{{scope.row.name || scope.row.productName}}</p>
                  <p class="goods-code" v-if="queryType !== 'team'" style="width:250px;">商品代码:{{scope.row.productNumber}}</p>
                  <p class="goods-code" v-else style="width:250px;">拼团价:{{scope.row.teamMemberPrice}}</p>
                </div>
                <div v-if="goodStyle !== 'SPEC' && scope.row.style === 'SPEC_PARENT' && showChildren" style="float:right; margin-top:5px;margin-right:20px;">
                  <div class="show-hide" v-show="scope.row.showProducts" @click="handleShowProducts(scope.row, scope.$index)">
                    <i class="el-icon-arrow-up"></i>
                    收起
                  </div>
                  <div class="show-hide" v-show="!scope.row.showProducts" @click="handleShowProducts(scope.row, scope.$index)">
                    <i class="el-icon-arrow-down"></i>
                    展开
                  </div>
                </div>
                <template v-else>
                  <el-button v-if="!multiple" size="small" style="float:right; margin-top:5px;" @click="handleSelect(scope.row)">选择</el-button>
                  <template v-else>
                    <el-button v-if="scope.row.checked === false" size="small" style="float:right; margin-top:5px;" @click="handleAdd(scope.row)">选择</el-button>
                    <el-button v-else-if="scope.row.checked === true" size="small" type="primary" style="float:right; margin-top:5px;" @click="handleRemove(scope.row)">已选择</el-button>
                  </template>
                </template>
              </div>
              <div class="goods-list" v-show="goodStyle !== 'SPEC' && scope.row.showProducts">
                <div v-for="it in scope.row.products" :key="it.productId">
                  <img class="goods-img" :src="it.imageUrl" />
                  <div style="width:75%;float:left;">
                    <p class="goods-name" style="width:100%;">{{it.name || it.productName}}</p>
                    <p class="goods-code" v-if="queryType !== 'team'" style="width:100%;">商品代码:{{it.productNumber}}</p>
                    <p class="goods-code" v-else style="width:100%;">拼团价:{{it.teamMemberPrice}}</p>
                  </div>
                  <el-button v-if="!multiple" size="small" style="float:right; margin-top:5px;" @click="handleSelect(it)">选择</el-button>
                  <template v-else>
                    <el-button v-if="it.checked === false" size="small" style="float:right; margin-top:5px;" @click="handleAdd(it)">选择</el-button>
                    <el-button v-else-if="it.checked === true" size="small" type="primary" style="float:right; margin-top:5px;" @click="handleRemove(it)">已选择</el-button>
                  </template>
                </div>
              </div>
            </template>
          </el-table-column>
        </el-table>
        <page-bar v-if="queryType === 'normal'" :page-data="pageData" @onreload="queryProducts"></page-bar>
      </el-scrollbar>
    </div>
    <span slot="footer" class="dialog-footer" v-if="multiple">
      <el-button size="small" @click="handleProductCancel">取 消</el-button>
      <el-button size="small" type="primary" @click="handleProductConfirm">确认添加</el-button>
    </span>
  </el-dialog>
</template>
<script>
import pageBar from "@/components/pagebar.vue";
import ProductService from "@/api/service/ProductService";
import GrabActivityService from "@/api/service/GrabActivityService";
import TeamBuyingService from "@/api/service/TeamBuyingService";
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
  props: [
    "visible",
    "queryType",
    "showChildren",
    "includeChild",
    "goodStyle",
    "multiple",
    "multipleProducts",
    "multipleType"
  ],
  computed: {
    ...mapGetters(["workingOrg"])
  },
  created() {
    this.prj = process.env.PRJ;
  },
  methods: {
    /* 选择操作 */
    handleSelect(val) {
      console.log(val);
      var obj = {};
      if (this.queryType === "normal") {
        obj = {
          productId: val.id,
          productName: val.name,
          business: val.business,
          originalPrice: val.originalPrice,
          imageUrl: val.imageUrl,
          description: val.description
        };
      } else if (this.queryType === "grab") {
        obj = {
          productId: val.productId,
          productName: val.productName,
          business: val.business,
          originalPrice: val.originalPrice,
          activityId: val.activityId, // 秒杀活动id
          imageUrl: val.imageUrl,
          description: val.productDescription
        };
        if (val.type === "SPEC") {
          obj.originalPrice = val.price;
        }
      } else if (this.queryType === "team") {
        obj = {
          productId: val.productId,
          productName: val.productName, // 拼团商品名称
          business: val.business,
          originalPrice: val.originalPrice,
          activityId: val.activityId, // 拼团活动id
          imageUrl: val.imageUrl,
          description: val.description
        };
      } else if (this.queryType === "live") {
        obj = {
          id: val.id,
          productId: val.productId,
          productName: val.name,
          originalPrice: val.originalPrice,
          imageUrl: val.imageUrl
        };
      }
      this.$emit("selectResult", obj);
      this.dialogVisible = false;
    },
    // 商品框添加按钮点击事件
    handleAdd(val) {
      let ishas = false;
      this.choosedProduct.forEach(item => {
        if (item.id === val.id) {
         if (this.multipleType === "grab") {
            ishas = true;
         } else {
           if (this.queryType === "normal" && item.linkType === "PRODUCT") {
            ishas = true;
          } else if (
            this.queryType === "grab" &&
            item.linkType === "GRADPRODUCT"
          ) {
            ishas = true;
          } else if (
            this.queryType === "team" &&
            item.linkType === "TEAMPRODUCT"
          ) {
            ishas = true;
          } else if (this.queryType === "live") {
            ishas = true;
          } 
         }
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
        } else {
          if (this.multipleType !== "grab") {
            if (this.queryType === "normal" && item.linkType === "PRODUCT") {
              // 普通
            } else if (
              this.queryType === "grab" &&
              item.linkType === "GRADPRODUCT"
            ) {
              // 秒杀
            } else if (
              this.queryType === "team" &&
              item.linkType === "TEAMPRODUCT"
            ) {
              // 拼团
            } else {
              tempArr.push(item);
            }
          }
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
      if (this.queryType === "normal") {
        // 如果是查询普通商品
        const tempBusiness = "CATERING";
        // 选择商品业态放开对餐饮商品的限制
        // if (this.prj === "36524") {
        //   tempBusiness = null;
        // } else {
        //   tempBusiness = "RETAIL";
        // }
        var stylesIn = null;
        if (this.goodStyle) {
          if (this.goodStyle === "COMMON") {
            stylesIn = ["SINGLE", "MEALS"];
          } else {
            stylesIn = "SPEC_PARENT";
          }
        } else {
          stylesIn = ["SINGLE", "MEALS", "SPEC_PARENT"];
        }
        const options = {
          business: tempBusiness,
          statusIn: ["NORMAL"],
          keywordLikes: this.searchValue,
          includeChild: this.includeChild ? this.includeChild : false,
          stylesIn: stylesIn
          // .replace(/\(/g, "%28")
          // .replace(/\)/g, "%29")
          // .replace(/\#/g, "%23")
          // .replace(/\[/g, "%5B")
          // .replace(/\]/g, "%5D")
        };
        ProductService.queryProduct(page, pageSize, options)
          .then(res => {
            this.pageData = res;
            if (res.records && res.records.length > 0) {
              res.records.forEach(item => {
                this.productAll.push({
                  ...item,
                  showProducts: false,
                  checked: this.checkProductSelect(item.id),
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
      } else if (this.queryType === "grab") {
        // 如果是查询秒杀商品
        var opts = {
          createOrgIdEquals: this.workingOrg.id
        };
        GrabActivityService.queryActivity(opts)
          .then(res => {
            var tempActivityIds = [];
            if (res && res.length > 0) {
              res.forEach(item => {
                if (item.status === "CREATED" || item.status === "STARTED") {
                  tempActivityIds.push(item.id);
                }
              });
            }
            console.log(tempActivityIds);
            var tempProducts = [];
            if (tempActivityIds.length > 0) {
              tempActivityIds.forEach(ele => {
                const params = {
                  createOrgIdEquals: this.workingOrg.id,
                  activityIdEquals: ele
                };
                const products = GrabActivityService.queryActivityProduct(
                  params
                )
                  .then(res => {
                    if (res) {
                      return res;
                    } else {
                      return [];
                    }
                  })
                  .catch(err => {
                    console.log(err.message);
                    return [];
                  });
                tempProducts.push(products);
              });
            }
            return Promise.all(tempProducts);
          })
          .then(res => {
            console.log(res);
            if (res && res.length > 0) {
              res.forEach(item => {
                if (Array.isArray(item) && item.length > 0) {
                  item.forEach(ele => {
                    this.productAll.push({
                      ...ele,
                      checked: this.checkProductSelect(
                        ele.productId,
                        ele.activityId
                      )
                    });
                  });
                }
              });
            }
            this.selectGoodsLoading = false;
          })
          .catch(err => {
            this.$message.error(err.message);
            this.selectGoodsLoading = false;
          });
      } else if (this.queryType === "team") {
        // 如果是查询拼团商品
        const opts = {
          status: "SUBMIT",
          teamBuyingStatus: "STARTED",
          nameLike: this.searchValue
        };
        TeamBuyingService.query(page, pageSize, opts)
          .then(res => {
            this.productAll = [];
            if (res.records && res.records.length > 0) {
              res.records.forEach(item => {
                this.productAll.push({
                  productId: item.productId,
                  productName: item.productName, // 拼团商品名称
                  business: item.business,
                  originalPrice: item.teamMemberPrice,
                  activityId: item.id, // 拼团活动id
                  imageUrl: item.picture,
                  description: item.description,
                  checked: this.checkProductSelect(item.productId, item.id),
                  teamMemberPrice: item.teamMemberPrice
                });
              });
            }
            this.selectGoodsLoading = false;
          })
          .catch(err => {
            this.selectGoodsLoading = false;
            this.$message.error(err.message);
          });
      }
    },
    // 处理展开收起点击事件
    handleShowProducts(row, index) {
      row.showProducts = !row.showProducts;
      if (row.showProducts && row.products.length === 0) {
        const options = {
          business: null,
          statusIn: ["NORMAL"],
          includeChild: true,
          parentProductId: row.id
        };
        ProductService.queryProduct(1, 0, options)
          .then(res => {
            if (res.records && res.records.length > 0) {
              var tempList = [];
              res.records.forEach(ele => {
                tempList.push({
                  ...ele,
                  checked: this.checkProductSelect(ele.id)
                });
              });
              row.products = tempList;
            }
            console.log(row);
            console.log(this.productAll);
          })
          .catch(err => {
            this.$message.error(err.message);
          });
      }
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
          var obj = {};
          if (!item.linkType) {
            // 不是广告页中已经选择的商品
            if (this.queryType === "normal") {
              obj = {
                productId: item.id,
                productName: item.name,
                business: item.business,
                originalPrice: item.originalPrice,
                imageUrl: item.imageUrl,
                description: item.description
              };
            } else if (this.queryType === "grab") {
              obj = {
                productId: item.productId,
                productName: item.productName,
                business: item.business,
                originalPrice: item.originalPrice,
                activityId: item.activityId, // 秒杀活动id
                imageUrl: item.imageUrl,
                description: item.productDescription
              };
              if (item.type === "SPEC") {
                obj.originalPrice = item.price;
              }
            } else if (this.queryType === "team") {
              obj = {
                productId: item.productId,
                productName: item.productName, // 拼团商品名称
                business: item.business,
                originalPrice: item.originalPrice,
                activityId: item.activityId, // 拼团活动id
                imageUrl: item.imageUrl,
                description: item.description
              };
            }
          } else {
            // 处理之前的数据
            if (item.linkType === "PRODUCT") {
              obj = {
                productId: item.productId,
                productName: item.productName,
                business: item.business,
                originalPrice: item.originalPrice,
                imageUrl: item.imageUrl,
                description: item.description,
                linkType: item.linkType
              };
            } else if (item.linkType === "GRADPRODUCT") {
              obj = {
                productId: item.productId,
                productName: item.productName,
                business: item.business,
                originalPrice: item.originalPrice,
                activityId: item.activityId, // 秒杀活动id
                imageUrl: item.imageUrl,
                description: item.productDescription,
                linkType: item.linkType
              };
              if (item.type === "SPEC") {
                obj.originalPrice = item.price;
              }
            } else if (item.linkType === "TEAMPRODUCT") {
              obj = {
                productId: item.productId,
                productName: item.productName, // 拼团商品名称
                business: item.business,
                originalPrice: item.originalPrice,
                activityId: item.activityId, // 拼团活动id
                imageUrl: item.imageUrl,
                description: item.description,
                linkType: item.linkType
              };
            }
          }
          choosedProduct.push(obj);
        });
      }
      this.$emit("selectResult", choosedProduct);
      this.dialogVisible = false;
    },
    checkProductSelect(productId, activityId = null) {
      var isHas = false;
      var choosedProduct = this.choosedProduct;
      for (let i = 0; i < choosedProduct.length; i++) {
        const item = choosedProduct[i];
        if (this.queryType === "normal") {
          if (item.linkType) {
            if (
              item.linkType === "PRODUCT" &&
              (item.id === productId || item.productId === productId)
            ) {
              isHas = true;
              break;
            }
          } else if (item.id === productId || item.productId === productId) {
            isHas = true;
            break;
          }
        } else if (this.queryType === "grab") {
          if (item.linkType) {
            if (
              item.linkType === "GRADPRODUCT" &&
              item.id === productId &&
              item.grabActivityId === activityId
            ) {
              isHas = true;
              break;
            }
          } else if (item.id === productId) {
            isHas = true;
            break;
          }
        } else if (this.queryType === "team") {
          if (item.linkType) {
            if (
              item.linkType === "TEAMPRODUCT" &&
              item.id === productId &&
              item.teamActivityId === activityId
            ) {
              isHas = true;
              break;
            }
          } else if (item.id === productId) {
            isHas = true;
            break;
          }
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
          this.choosedProduct = this.multipleProducts;
          console.log(this.choosedProduct);
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
