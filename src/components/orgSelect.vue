<template>
  <el-select :disabled="disable" v-model="value" filterable clearable remote :remote-method="remoteMethod" @focus="handleFocus" :loading="loading" @change="handleChange" @clear="handleClear" :placeholder="placeholder">
    <el-option v-for="item in orgs" :key="item.id" :label="item.name" :value="item.id"></el-option>
    <div class="select-pagination" v-if="orgTypesIn==='STORE'">
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
import OrgService from "@/api/service/OrgService";
import StoreService from "@/api/service/StoreService";
import request from "@/utils/request";
import { mapGetters } from "vuex";

export default {
  data() {
    return {
      loading: false,
      orgs: [],
      value: this.orgValue,
      disable: Boolean(this.disabled),
      page: 1,
      status: "next",
      disabledPrev: true,
      disabledNext: false,
      hasQuery: false,
      placeholder: "请选择",
      nameLike: ''
    };
  },
  props: ["orgValue", "orgTypesIn", "disabled", "includeLowerOrg", "orgRange"],
  methods: {
    queryOrg(nameLike, orgTypesIn, orgValue) {
      this.nameLike = nameLike
      console.log(nameLike, orgTypesIn, orgValue)
      let upperOrgId = "";
      if (this.workingOrg) {
        upperOrgId = this.workingOrg.id;
      } else {
        upperOrgId = "";
      }
      if (!nameLike) {
        nameLike = "";
      }
      if (orgTypesIn === "STORE") {
        // 查询门店
        const opt = {
          idEquals: orgValue,
          nameLike: nameLike,
          searchCount: false
        };
        request.hideLoadingOnce();
        this.hasQuery = true;
        StoreService.query(this.page, 5, opt)
          .then(res => {
            // console.log(res);
            if (
              res.records &&
              res.records.length <= 5 &&
              res.records.length > 0
            ) {
              this.orgs = res.records;
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
      } else if (orgTypesIn === "COMPANY") {
        // 查询分公司
        const opt = {
          upperOrgIdEquals: upperOrgId,
          includeLowerOrg:
            this.includeLowerOrg === true ? this.includeLowerOrg : false,
          orgTypesIn: orgTypesIn,
          idEquals: this.orgRange === "ALL" ? "" : orgValue,
          nameLike: nameLike,
          searchCount: false
        };
        console.log(opt);
        request.hideLoadingOnce();
        OrgService.query(1, 100, opt)
          .then(res => {
            // console.log(res);
            this.orgs = res.records;
            this.loading = false;
          })
          .catch(err => {
            this.$message.error(err.message);
          });
      } else {
        // 查询分公司
        const opt = {
          upperOrgIdEquals: upperOrgId,
          includeLowerOrg:
            this.includeLowerOrg === true ? this.includeLowerOrg : false,
          orgTypesIn: orgTypesIn,
          idEquals: this.orgRange === "ALL" ? "" : orgValue,
          nameLike: nameLike,
          searchCount: false
        };
        request.hideLoadingOnce();
        OrgService.query(1, 100, opt)
          .then(res => {
            // console.log(res);
            this.orgs = res.records;
            this.loading = false;
          })
          .catch(err => {
            this.$message.error(err.message);
          });
      }
    },
    remoteMethod(query) {
      this.loading = true;
      this.queryOrg(query, this.orgTypesIn);
    },
    handleFocus() {
      if (!this.value) {
        this.page = 1;
        this.orgs = [];
        this.disabledPrev = true;
        this.disabledNext = false;
        this.queryOrg("", this.orgTypesIn, this.orgValue);
      }
    },
    handleChange() {
      this.$emit("update:orgValue", this.value);
    },
    handleClear() {
      this.value = "";
    },
    handlePrevPage() {
      const nameLike = this.nameLike ? this.nameLike : ''
      this.status = "prev";
      if (this.page > 1) {
        this.page--;
      }
      this.value = this.orgValue;
      this.queryOrg(nameLike, this.orgTypesIn, this.orgValue);
    },
    handleNextPage() {
      const nameLike = this.nameLike ? this.nameLike : ''
      this.status = "next";
      this.page++;
      this.value = this.orgValue;
      this.queryOrg(nameLike, this.orgTypesIn, this.orgValue);
    }
  },
  mounted() {
    console.log(this.orgValue);
    if (this.orgTypesIn === "STORE") {
      this.placeholder = "请选择门店";
    }
    if (this.orgValue) {
      this.value = this.orgValue;
      this.queryOrg("", this.orgTypesIn, this.orgValue);
    }
  },
  watch: {
    // orgValue: function(value, oldValue) {
    //   if (this.orgValue === "") {
    //     this.value = this.orgValue;
    //     this.queryOrg("", this.orgTypesIn, this.orgValue);
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
