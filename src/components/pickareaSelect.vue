<template>
  <el-select :disabled="disable" v-model="value" filterable clearable remote :remote-method="remoteMethod" @focus="handleFocus" :loading="loading" @change="handleChange" @clear="handleClear" :placeholder="placeholder" :multiple="multiple">
    <el-option v-for="item in resultList" :key="item.id" :label="item.name" :value="item.code"></el-option>
    <div class="select-pagination">
      <button type="button" class="btn-prev" :disabled="disabledPrev" @click="handlePrevPage">
        <i class="el-icon-arrow-left"></i>
      </button>
      <button type="button" class="btn-next" :disabled="disabledNext" @click="handleNextPage">
        <i class="el-icon-arrow-right"></i>
      </button>
    </div>
  </el-select>
</template>
<script>
import PersonnelbindService from "@/api/service/PersonnelbindService";
import request from "@/utils/request";
import { mapGetters } from "vuex";

export default {
  data() {
    return {
      loading: false,
      resultList: [],
      value: this.selectValue,
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
  props: ["selectValue", "disabled", "multiple", "stockType"],
  methods: {
    handleQuery(nameLike, selectValue) {
      const opts = {
        codeOrNameEquals: selectValue,
        stockTypeEquals: this.stockType,
        searchCount: false
      };
      request.hideLoadingOnce();
      this.hasQuery = true;
      PersonnelbindService.queryPickarea(this.page, 5, opts)
        .then(res => {
          if (
            res.records &&
            res.records.length <= 5 &&
            res.records.length > 0
          ) {
            this.resultList = res.records;
            if (this.status === "prev") {
              if (this.page === 1) {
                this.disabledPrev = true;
              }
              if (this.disabledNext === true) {
                this.disabledNext = false;
              }
            } else if (this.status === "next") {
              if (this.page > 1 && this.disabledPrev === true) {
                this.disabledPrev = false;
              }
            }
            if (res.records.length < 5) {
              this.disabledNext = true;
            }
          } else if (this.status === "next") {
            this.disabledNext = true;
          } else {
            this.disabledNext = true;
          }
          this.loading = false;
          this.hasQuery = false;
        })
        .catch(err => {
          this.$message.error(err.message);
        });
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
        this.handleQuery("", this.selectValue);
      }
    },
    handleChange() {
      this.$emit("update:selectValue", this.value);
      var selectedObj = this.getSelectedObj();
      selectedObj = !selectedObj ? {} : selectedObj;
      this.$emit("onselected", selectedObj);
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
    },
    handlePrevPage() {
      const nameLike = this.nameLike ? this.nameLike : "";
      this.status = "prev";
      if (this.page > 1) {
        this.page--;
      }
      this.value = this.selectValue;
      this.handleQuery(nameLike, this.selectValue);
    },
    handleNextPage() {
      const nameLike = this.nameLike ? this.nameLike : "";
      this.status = "next";
      this.page++;
      this.value = this.selectValue;
      this.handleQuery(nameLike, this.selectValue);
    }
  },
  mounted() {
    console.log(this.selectValue);
    if (this.selectValue) {
      this.value = this.selectValue;
      this.handleQuery("", this.selectValue);
    }
  },
  watch: {
    // selectValue: function(value, oldValue) {
    //   if (this.selectValue === "") {
    //     this.value = this.selectValue;
    //     this.handleQuery("", this.selectValue);
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
