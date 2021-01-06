<template>
  <div class="product-add">
    <div class="head">
      <div style="margin-top:8px">新建商品</div>
      <div>
        <el-button @click="back">取消</el-button>
        <el-button type="primary" @click="createProduct">确认</el-button>
      </div>
    </div>
    <div style="height:20px" />
    <div class="info-content">
      <div>
        <el-tabs v-model="tabActiveName" @tab-click="tabClick">
          <el-tab-pane label="商品信息" name="product">
            <el-form :model="form" :rules="createRules" ref="form" label-width="100px" class="demo-ruleForm">
              <div class="info-title">基本信息</div>
              <el-row :gutter="20">
                <el-col :span="6" class="info-box">
                  <el-form-item label="代码" prop="code">
                    <el-input v-model="form.code"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="6" class="info-box">
                  <el-form-item label="名称" prop="name">
                    <el-input v-model="form.name"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="6" class="info-box">
                  <el-form-item label="简称" prop="shortName">
                    <el-input v-model="form.shortName"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="6" class="info-box">
                  <el-form-item label="规格" prop="spec">
                    <el-input v-model="form.spec"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="6" class="info-box">
                  <el-form-item label="类别" prop="categoryCode">
                    <product-category-select :vendorValue.sync="form.categoryCode" @onselected="onProductCategorySelected"></product-category-select>
                  </el-form-item>
                </el-col>
                <el-col :span="6" class="info-box">
                  <el-form-item label="第二代码" prop="barcode">
                    <el-input v-model="form.barcode"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="6" class="info-box">
                  <el-form-item label="默认供应商" prop="defaultVendorCode">
                    <vendor-select :vendorValue.sync="form.defaultVendorCode" @onselected="onSelected"></vendor-select>
                  </el-form-item>
                </el-col>
                <el-col :span="6" class="info-box">
                  <el-form-item label="进价" prop="purchasePrice">
                    <el-input v-model="form.purchasePrice"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="6" class="info-box">
                  <el-form-item label="售价" prop="salePrice">
                    <el-input v-model="form.salePrice"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="6" class="info-box">
                  <el-form-item label="产地" prop="origin">
                    <el-input v-model="form.origin"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="6" class="info-box">
                  <el-form-item label="产生追溯码" prop="trackRecord">
                    <el-switch v-model="form.trackRecord" active-color="#13ce66" inactive-color="#eee"></el-switch>
                  </el-form-item>
                </el-col>
                <el-col :span="6" class="info-box">
                  <el-form-item label="备注">
                    <textarea rows="5" v-model="form.remark"></textarea>
                  </el-form-item>
                </el-col>
              </el-row>
              <div class="info-title">保质期</div>
              <el-row :gutter="20">
                <el-col :span="6" class="info-box">
                  <el-form-item label="保质期类型" prop="shelfLifeType">
                    <el-select v-model="form.shelfLifeType" placeholder="请选择">
                      <el-option label="不管理保质期" value="NO_CARE"></el-option>
                      <el-option label="按到效期" value="VALID_DATE"></el-option>
                      <el-option label="按生产日期" value="PRODUCT_DATE"></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="6" class="info-box" v-show="form.shelfLifeType !== 'NO_CARE'">
                  <el-form-item label="保质期天数" prop="shelfLifeDays">
                    <el-input v-model="form.shelfLifeDays"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="6" class="info-box" v-show="form.shelfLifeType !== 'NO_CARE'">
                  <el-form-item label="收货控制天数" prop="receiveControlDays">
                    <el-input v-model="form.receiveControlDays"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="6" class="info-box" v-show="form.shelfLifeType !== 'NO_CARE'">
                  <el-form-item label="配货控制天数" prop="deliverControlDays">
                    <el-input v-model="form.deliverControlDays"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="6" class="info-box" v-show="form.shelfLifeType !== 'NO_CARE'">
                  <el-form-item label="退货控制天数" prop="returnControlDays">
                    <el-input v-model="form.returnControlDays"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
  </div>
</template>

<script>
import ProductService from "@/api/service/ProductService";
import { mapGetters } from "vuex";
import PermIds from "@/api/permissionIds";
import vendorSelect from "@/components/vendorSelect.vue";
import productCategorySelect from "@/components/productCategorySelect.vue";

export default {
  data() {
    return {
      PermIds: PermIds,
      status: "create",
      form: {
        barcode: "",
        categoryCode: "",
        categoryId: "",
        categoryName: "",
        code: "",
        defaultVendorCode: "",
        defaultVendorId: "",
        defaultVendorName: "",
        deliverControlDays: 0,
        name: "",
        origin: "",
        purchasePrice: 0,
        receiveControlDays: 0,
        remark: "",
        returnControlDays: 0,
        salePrice: 0,
        shelfLifeDays: 0,
        shelfLifeType: "NO_CARE",
        shortName: "",
        sourceWay: "CREATE",
        spec: "",
        trackRecord: true
      },
      tabActiveName: "product",
      createRules: {
        code: [{ required: true, message: "请输入商品代码", trigger: "blur" }],
        name: [{ required: true, message: "请输入商品名称", trigger: "blur" }],
        spec: [{ required: true, message: "请输入商品规格", trigger: "blur" }],
        categoryCode: [
          { required: true, message: "请选择类别", trigger: "blur" }
        ],
        barcode: [
          { required: true, message: "请输入第二代吗", trigger: "blur" }
        ],
        defaultVendorCode: [
          { required: true, message: "请选择默认供应商", trigger: "blur" }
        ]
      }
    };
  },
  computed: {
    ...mapGetters(["hasPermission", "workingOrg"])
  },
  methods: {
    createProduct() {
      const _this = this;
      this.$refs.form.validate(valid => {
        if (valid) {
          ProductService.create(_this.form)
            .then(res => {
              this.$message.success("创建成功");
              this.$store.dispatch("tagsView/delView", this.$route);
              this.$router.go(-1);
            })
            .catch(err => {
              this.$message.error("创建失败" + err.message);
            });
        }
      });
    },
    back: function() {
      this.$store.dispatch("tagsView/delView", this.$route);
      this.$router.go(-1);
    },
    tabClick() {},
    onSelected(val) {
      this.form.defaultVendorCode = val.code;
      this.form.defaultVendorId = val.id;
      this.form.defaultVendorName = val.name;
    },
    onProductCategorySelected(val) {
      this.form.categoryCode = val.code;
      this.form.categoryId = val.id;
      this.form.categoryName = val.name;
    }
  },
  components: {
    vendorSelect,
    productCategorySelect
  }
};
</script>

<style lang="scss" scoped>
@import "src/styles/mixin.scss";
.product-add {
  .head {
    background: #fff;
    padding: 15px 12px;
    border-radius: 12px;
    border: 1px #eee solid;
    display: flex;
    justify-content: space-between;
  }
  .head-title {
    display: flex;
    justify-content: left;
  }
  .info-content {
    background: #fff;
    border-radius: 12px;
    padding: 15px 12px;
  }
  .info-box {
    margin: 4px 0;
    font-size: 12px;
    display: flex;
    justify-content: left;
  }
  .info-title {
    margin: 12px 0;
  }
}
</style>
<style lang="scss">
.product-add {
}
</style>




