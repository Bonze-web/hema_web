<template>
  <div class="integral-index">
    <div class="top-box">
      买商品赠积分
    </div>
    <div class="filter-box">
      <el-form label-width="140px" label-position="left">
        <el-form-item label="商品名称：">
          <el-input type="text" v-model="formData.nameLikes" clearable placeholder="输入商品名称查询"></el-input>
        </el-form-item>
        <el-form-item label="是否设置赠送积分：">
          <el-radio-group v-model="formData.productGiftScore">
            <el-radio :label="null">全部</el-radio>
            <el-radio :label="true">是</el-radio>
            <el-radio :label="false">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-button type="primary" @click="getGoods()">查询</el-button>
      </el-form>
    </div>
    <div class="add-content">
      <el-table :data="pageData.records" style="width: 100%">
        <el-table-column label="商品">
          <template slot-scope="scope">
            <div class="goods-info">
              <img :src="scope.row.productImage" alt="" class="goods-img">
              <div class="goods-name">
                <span> {{scope.row.productName}}</span>
                <span v-if="scope.row.productNumber">【{{scope.row.productNumber}}】</span>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="购买赠送积分">
          <template slot-scope="scope">
            <div class="productScore">
              <span>{{scope.row.score ? scope.row.score : '--'}}</span>
              <el-popover
                @show="handleScorePopoverShow(scope.row, scope.$index)"
                ref="popovePricer"
                v-model="scope.row.scorePopover"
                placement="bottom"
                width="320"
                trigger="click">
                <div class="popover-content">
                  <el-form label-position="left" label-width="120">
                    <el-form-item label="购买赠送积分：">
                      <el-input type="number" v-model="changedScore" placeholder="输入积分" clearable style="width: 100px;"></el-input> 分
                    </el-form-item>
                    <el-form-item label="标签：">
                      买1 <el-input v-model="unit" placeholder="输入单位" clearable style="width: 80px;"></el-input> 送{{changedScore ? changedScore : '--'}}积分
                    </el-form-item>
                  </el-form>
                  <div class="handle-popover">
                    <el-button @click="closePopover(scope.row)">取消</el-button>
                    <el-button type="primary" @click="editProductScore(scope.row)">确认</el-button>
                  </div>
                </div>
                <i class="el-icon-edit" slot="reference"></i>
              </el-popover>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="标签">
          <template slot-scope="scope">
            <div class="productScore">
              <span>{{scope.row.label ? scope.row.label : '--'}}</span>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <page-bar :page-data="pageData" @onreload="getGoods"></page-bar>
    </div>
  </div>
</template>

<script>
import ScoreProductService from "@/api/service/ScoreProductService";
import pageBar from "@/components/pagebar.vue";
import PermIds from "@/api/permissionIds";
import { mapGetters } from "vuex";
export default {
  components: {
    pageBar
  },
  data() {
    return {
      formData: {
        nameLikes: '',
        productGiftScore: null
      },
      changedScore: 0, // 积分
      quantity: 1, // 件数
      unit: '件', // 单位
      pageData: {
        page: 1,
        pageSize: 10,
        pageCount: 1,
        recordCount: 5,
        records: []
      },
      PermIds: PermIds
    }
  },
  computed: {
    ...mapGetters(["hasPermission", "workingOrg"])
  },
  methods: {
    getGoods(page, pageSize) {
      page = !page ? 1 : page;
      pageSize = !pageSize ? 10 : pageSize;
      ScoreProductService.queryProductScore(page, pageSize, this.formData).then(res => {
        if (res) {
          this.pageData = res;
        }
      }).catch(err => {
        this.$message.error(err.message);
      });
    },
    // 显示积分编辑框
    handleScorePopoverShow(val, index) {
      val.scorePopover = true;
      this.changedScore = val.score || val.score === 0 ? val.score : '';
      this.unit = val.label ? val.label && val.label.substring(2, 3) : '件';
    },
    // 取消编辑
    closePopover(item) {
      this.changedScore = '';
      this.quantity = 1;
      item.scorePopover = false;
    },
    // 确定编辑积分
    editProductScore(item) {
      if (!item.id && !this.hasPermission(PermIds.MBR_PRODUCT_GIFT_SCORE_CREATE)) {
        this.$message.warning('暂无新增赠积分权限');
        return false;
      }
      if (item.id && !this.hasPermission(PermIds.MBR_PRODUCT_GIFT_SCORE_UPDATE)) {
        this.$message.warning('暂无修改赠积分权限');
        return false;
      }
      if (!this.changedScore) {
        this.$message.error('请输入积分');
        return;
      }
      if (this.changedScore < 0) {
        this.$message.error('请输入正确的积分');
        return;
      }
      if (this.unit === '') {
        this.$message.error('请输入单位');
        return;
      }
      const params = {
        productId: item.productId,
        score: this.changedScore,
        quantity: this.quantity,
        label: Number(this.changedScore) !== 0 ? `买1${this.unit}送${this.changedScore}积分` : ''
      }
      if (item.id) {
        params.id = item.id;
        params.promotionId = item.promotionId;
      }
      this.postData(params, item);
    },
    postData(params, item) {
      if (!item.id) {
        // 新增
        ScoreProductService.addProductScore(params).then(res => {
          this.$message.success('操作成功');
          this.getGoods(this.pageData.page, this.pageData.pageSize);
        }).catch(err => {
          this.$message.error(err.message);
        })
      } else {
        // 修改
        ScoreProductService.updateProductScore(params).then(res => {
          this.$message.success('操作成功');
          this.getGoods(this.pageData.page, this.pageData.pageSize);
        }).catch(err => {
          this.$message.error(err.message);
        })
      }
    }
  },
  mounted() {
    this.getGoods();
  }
}
</script>

<style lang="scss" scoped>
  .integral-index {
    min-width: 800px;
    > div {
      margin-bottom: 15px;
      border-radius: 8px;
      padding: 15px;
      &:last-child {
        margin-bottom: 0;
      }
    }
    .top-box {
      overflow: hidden;
      line-height: 32px;
      background-color: #ffffff;
      > span {
        font-size: 18px;
      }
      > a {
        font-size: 16px;
        color: #999999;
      }

      .el-button {
        float: right;
        margin-left: 10px;
      }
    }
    .filter-box {
      background: #fff;
      .el-form {
        width: 350px;
      }
    }
    .add-content {
      background: #fff;
      .goods-info {
        display: flex;
        justify-content: start;
        .goods-img {
          width: 50px;
          height: 50px;
          margin-right: 10px;
          float: left;
          overflow: hidden;
        }
        .goods-name {
          display: flex;
          flex-direction: column;
        }
      }
      .productScore {
        font-size: 15px;
        height: 50px;
        line-height: 50px;
        cursor: pointer;
        .el-icon-edit {
          display: none;
          color: #409EFF;
        }
        &:hover {
          .el-icon-edit {
            display: inline-block;
          }
        }
      }
    }
  }
</style>

<style lang="scss">
  .popover-content {
    padding: 25px;
    .el-input {
      width: 220px;
    }
    .handle-popover {
      margin-top: 15px;
      text-align: center;
    }
  }
</style>