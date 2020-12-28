<template>
  <el-select :disabled="disable" v-model="value" filterable clearable remote :remote-method="remoteMethod" @focus="handleFocus" :loading="loading" @change="handleChange" @clear="handleClear" :placeholder="placeholder" :multiple="multiple">
    <el-option v-for="item in resultList" :key="item.id" :label="item.qpcStr" :value="item.qpcStr"></el-option>
    <!-- <div class="select-pagination">
      <button type="button" class="btn-prev" :disabled="disabledPrev" @click="handlePrevPage">
        <i class="el-icon-arrow-left"></i>
      </button>
      <button type="button" class="btn-next" :disabled="disabledNext" @click="handleNextPage">
        <i class="el-icon-arrow-right"></i>
      </button>
    </div>-->
  </el-select>
</template>
<script>
import ProductService from "@/api/service/ProductService";
import request from "@/utils/request";
import { mapGetters } from "vuex";

export default {
  data() {
    return {
      loading: false,
      resultList: [],
      value: this.specValue,
      disable: Boolean(this.disabled),
      page: 1,
      status: "next",
      disabledPrev: true,
      disabledNext: false,
      hasQuery: false,
      placeholder: "请选择",
      nameLike: ""
    };
  },
  props: ["specValue", "disabled", "multiple", "productId"],
  methods: {
    handleQuery(nameLike, specValue) {
      const opts = {
        productIdEquals: this.productId
      };
      request.hideLoadingOnce();
      this.hasQuery = true;
      if (this.workingOrg.type === "GROUP") {
        ProductService.queryProductQpc(1, 0, opts)
          .then(res => {
            this.resultList = res.records;
            this.loading = false;
            this.hasQuery = false;
          })
          .catch(err => {
            this.$message.error(err.message);
          });
      } else if (this.workingOrg.type === "DC") {
        ProductService.queryDcProductQpc(1, 0, opts)
          .then(res => {
            this.resultList = res.records;
            this.loading = false;
            this.hasQuery = false;
          })
          .catch(err => {
            this.$message.error(err.message);
          });
      } else {
        ProductService.queryProductQpc(1, 0, opts)
          .then(res => {
            this.resultList = res.records;
            this.loading = false;
            this.hasQuery = false;
          })
          .catch(err => {
            this.$message.error(err.message);
          });
      }
    },
    remoteMethod(query) {
      this.loading = true;
      this.handleQuery("", query);
    },
    handleFocus() {
      if (!this.value || this.value.length === 0) {
        this.page = 1;
        this.resultList = [];
        this.disabledPrev = true;
        this.disabledNext = false;
        this.handleQuery("", this.specValue);
      }
    },
    handleChange() {
      this.$emit("update:specValue", this.value);
      // var selectedObj = this.getSelectedObj();
      // selectedObj = !selectedObj ? {} : selectedObj;
      // this.$emit("onselected", selectedObj);
    },
    getSelectedObj() {
      var data = "";
      if (this.multiple) {
        data = [];
        this.value.forEach(ele => {
          const tempData = this.resultList.find(
            item => item.code === this.value
          );
          data.push(tempData);
        });
      } else {
        data = this.resultList.find(item => item.code === this.value);
      }
      return data;
    },
    handleClear() {
      this.value = "";
    }
  },
  mounted() {
    console.log(this.specValue);
    if (this.specValue) {
      this.value = this.specValue;
      this.handleQuery("", this.specValue);
    }
  },
  watch: {
    // specValue: function(value, oldValue) {
    //   if (this.specValue === "") {
    //     this.value = this.specValue;
    //     this.handleQuery("", this.specValue);
    //   }
    // },
    disable: function(value, oldValue) {
      if (this.disabled) {
        this.disable = Boolean(this.disabled);
      }
    }
  },
  computed: {
    ...mapGetters(["workingOrg"])
  }
};
</script>
<style lang="scss" scoped>
.select-pagination {
  text-align: center;
  > button {
    background: center center no-repeat #fff;
    background-size: 16px;
    margin: 0;
    color: #303133;
    border: none;
    padding: 0 6px;
    display: inline-block;
    font-size: 13px;
    min-width: 35.5px;
    height: 28px;
    line-height: 28px;
    vertical-align: top;
    box-sizing: border-box;
    cursor: pointer;
    outline: 0;
    > i {
      font-weight: 700;
    }
    &:hover {
      color: #2299dd;
    }
    &:disabled {
      color: #c0c4cc;
      background-color: #fff;
      cursor: not-allowed;
    }
  }
}
</style>
