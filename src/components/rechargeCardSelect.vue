<template>
  <el-select @change="changeValues" v-model="value" filterable clearable remote placeholder="输入充值卡名称查询" :loading="loading" :remote-method="searchActivity" @focus="handleFocus" @clear="handleClear">
    <el-option v-for="item in options" :key="item.id" :label="item.name" :value="item.id"></el-option>
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
import RechargeCardService from "@/api/service/RechargeCardService";
import request from "@/utils/request";

export default {
  data() {
    return {
      value: "",
      loading: false,
      options: [],
      disabledPrev: true,
      disabledNext: false,
      page: 1,
      status: "next",
      qryForm: {
        nameLikes: "",
        disabled: "false",
        activityIdEquals: ""
      }
    };
  },
  props: ["activityId"],
  methods: {
    searchActivity(query) {
      this.qryForm.nameLikes = query;
      this.reload();
    },
    handleFocus() {
      if (!this.value) {
        this.page = 1;
        this.options = [];
        this.disabledPrev = true;
        this.disabledNext = false;
        this.qryForm.nameLikes = "";
        this.reload();
      }
    },
    reload(page = 1, pageSize = 5) {
      request.hideLoadingOnce();
      this.loading = true;
      RechargeCardService.queryActivity(page, pageSize, this.qryForm)
        .then(res => {
          this.disabledNext = false;
          if (
            res.records &&
            res.records.length <= 5 &&
            res.records.length > 0
          ) {
            this.options = res.records;
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
        })
        .catch(error => {
          this.loading = false;
          this.$message.error(error.message);
        });
    },
    handlePrevPage() {
      this.status = "prev";
      if (this.page > 1) {
        this.page--;
      }
      this.reload(this.page);
    },
    handleNextPage() {
      this.status = "next";
      this.page++;
      this.reload(this.page);
    },
    changeValues() {
      this.$emit("selected", this.value);
    },
    handleClear() {
      this.value = "";
      this.qryForm.nameLikes = "";
      this.options = [];
      this.reload();
      this.$emit("cleared");
    }
  },
  watch: {
    activityId(nv, ov) {
      this.value = nv;
      this.qryForm.activityIdEquals = nv;
      if (nv) {
        this.reload();
      }
    }
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