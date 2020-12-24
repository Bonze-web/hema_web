<template>
  <div>
    <iframe name="ifm_Test" src="url1" width="100%" :height="iframe.height" scrolling="yes" frameborder="0" @load="load"></iframe>
  </div>
</template>

<script>
import BaseModule from "@/utils/baseModule";
import * as Utils from "@/utils/index";
import PermIds from "@/api/permissionIds";
import * as DateUtil from "@/utils/dateUtil";
import PageBar from "@/components/pagebar.vue";
import BaseList from "@/components/bill/baseList.vue";
import OrgSelect from "@/components/orgSelect";
import ReportService from "@/api/service/CustomReportService";
import { mapGetters } from "vuex";

export default {
  extends: BaseModule,

  components: {
    "page-bar": PageBar,
    "base-list": BaseList,
    OrgSelect
  },

  data: function() {
    return {
      qryForm: {},
      // 报表定义
      definition: {
        /** 是否支持分页 */
        pageable: true,
        params: [],
        fields: []
      },
      pageData: {
        page: 1,
        pageSize: 10,
        pageCount: 1,
        recordCount: 0,
        records: []
      },
      PermIds: PermIds
    };
  },

  computed: {
    ...mapGetters(["hasPermission", "workingOrg"]),

    /** 报表参数 */
    params() {
      var params = [];
      if (Array.isArray(this.definition.params)) {
        params.push(...this.definition.params);
      }
      if (Array.isArray(this.definition.fields)) {
        var searchableFields = this.definition.fields.filter(f => {
          return f.queryable;
        });
        params.push(...searchableFields);
      }

      var model = {};
      params.forEach(p => {
        model[p.name] =
          typeof p.defaultValue === "undefined" ? null : p.defaultValue;
      });
      this.qryForm = model;
      return params;
    },

    /** 参数校验规则 */
    rules() {
      var rules = {};
      for (var p of this.params) {
        var comp = this.compType(p);

        if (p.constraint) {
          var fieldRules = [];
          var type = "string";
          var trigger = "blur";
          if (comp === "SELECT") {
            type = p.multiple ? "array" : "string";
            trigger = "change";
          } else if (comp === "NUMBER") {
            type = "number";
          } else if (
            comp === "DATE_PICKER" ||
            comp === "TIME_PICKER" ||
            comp === "DATETIME_PICKER"
          ) {
            type = "date";
            trigger = "change";
          }

          if (p.constraint.required) {
            fieldRules.push({
              type: type,
              trigger: trigger,
              required: true,
              message: "请输入" + p.caption
            });
          }
          if (typeof p.constraint.max !== "undefined") {
            fieldRules.push({
              type: type,
              trigger: trigger,
              max: p.constraint.max,
              message: "最大值:" + p.constraint.max
            });
          }
          if (typeof p.constraint.min !== "undefined") {
            fieldRules.push({
              type: type,
              trigger: trigger,
              min: p.constraint.min,
              message: "最小值:" + p.constraint.min
            });
          }
          if (p.constraint.size) {
            if (typeof p.constraint.size.min !== "undefined") {
              fieldRules.push({
                type: type,
                trigger: trigger,
                min: p.constraint.size.min,
                message: "最小长度:" + p.constraint.size.min
              });
            }
            if (typeof p.constraint.size.max !== "undefined") {
              fieldRules.push({
                type: type,
                trigger: trigger,
                max: p.constraint.size.max,
                message: "最大长度:" + p.constraint.size.max
              });
            }
          }
          rules[p.name] = fieldRules;
        }
      }
      return rules;
    },

    /** 计算参数的控件类型 */
    compType() {
      return function(field) {
        if (field.componentType) {
          return field.componentType;
        } else if (field.type === "STRING") {
          return "INPUT";
        } else if (field.type === "NUMBER") {
          return "NUMBER";
        } else if (field.type === "BOOLEAN") {
          return "RADIO";
        } else if (field.type === "DATE") {
          return "DATE_PICKER";
        } else if (field.type === "TIME") {
          return "TIME_PICKER";
        } else if (field.type === "DATETIME") {
          return "DATETIME_PICKER";
        } else if (field.type === "IMAGE") {
          return "IMAGE";
        } else {
          return "INPUT";
        }
      };
    }
  },

  filters: {
    showOption([value, options]) {
      if (Array.isArray(options)) {
        for (var opt of options) {
          if (opt.value === value) {
            return opt.caption;
          }
        }
      }
      return value;
    }
  },

  watch: {
    $route: function(to, from) {
      console.log("id=" + this.$route.params.id);
      if (this.$route.params.id) {
        this.getDefinitionById(this.$route.params.id);
      }
    }
  },

  methods: {
    onQuery() {
      var self = this;
      if (!this.definition || !this.definition.id) {
        Utils.showError("找不到指定的报表");
        return;
      }

      this.$refs["qryForm"].validate(valid => {
        if (!valid) {
          return false;
        } else {
          var pageSize = self.definition.pageable ? 10 : 0;
          self.reload(1, pageSize);
        }
      });
    },

    /**
     * 重置搜索框
     */
    resetForm(formName) {
      this.$refs[formName].resetFields();
      this.onQuery();
    },

    /**
     * 重置表格数据
     */
    resetPageData() {
      this.pageData = {
        page: 1,
        pageSize: 10,
        pageCount: 1,
        recordCount: 0,
        records: []
      };
    },

    /**
     *  根据id取得报表定义
     */
    getDefinitionById(id) {
      if (id === "" || typeof id === "undefined") {
        Utils.showError("报表id不能为空");
        return;
      }

      var self = this;
      self.resetPageData();
      return ReportService.getDefinitionById(id)
        .then(data => {
          self.definition = data;
          console.log("成功加载报表：" + data.name);
        })
        .catch(err => {
          Utils.showError(err);
        });
    },

    /**
     * 查询报表
     */
    reload(page = 1, pageSize = 10) {
      var self = this;

      var bizParams = this.getQueryBizParams();
      console.log("业务参数: " + JSON.stringify(bizParams));
      var params = {
        page: page,
        pageSize: pageSize,
        searchCount: false,
        params: bizParams,
        reportId: self.definition.id
      };
      return ReportService.queryReport(params)
        .then(data => {
          if (!self.definition.fields || self.definition.fields.length <= 0) {
            if (data.records.length > 0) {
              self.initFieldsByData(data.records[0]);
            }
          }
          self.pageData = data;
        })
        .catch(error => {
          Utils.showError(error);
        });
    },

    /** 取得当前查询的业务参数 */
    getQueryBizParams() {
      var self = this;

      var bizParams = [];
      for (var key in this.qryForm) {
        var value = self.qryForm[key];
        if (value == null || value === '') {
          continue;
        }

        if (value instanceof Date) {
          value = DateUtil.formatDate(value);
        }
        bizParams.push({
          name: key,
          value: value
        });
      }
      return bizParams;
    },

    /**
     * 当没有定义字段时，则可从数据中初始化字段
     */
    initFieldsByData(dataRow) {
      if (!this.definition.fields) {
        this.definition.fields = [];
      }
      for (var key in dataRow) {
        this.definition.fields.push({
          name: key,
          caption: key
        });
      }
    },

    /**
     * 导出当前报表
     */
    exportToFile(type) {
      var self = this;

      var bizParams = this.getQueryBizParams();
      var params = {
        page: 1,
        pageSize: 0, // 导出全部
        searchCount: false,
        params: bizParams,
        reportId: self.definition.id,
        type: type
      };

      return ReportService.exportReport(params)
        .then(() => {
          this.$confirm(
            "导出请求已经成功提交，请耐心等待后台处理结果。点击“确定”立即查看导出结果。",
            "提示",
            {
              type: "success"
            }
          ).then(() => {
            self.$router.push({
              name: "DfsList",
              query: {
                category: "REPORT_EXPORT",
                bizId: self.definition.id,
                bizName: self.definition.name
              }
            });
          });
        })
        .catch(error => {
          Utils.showError(error);
        });
    }
  },

  created() {
    console.log("on create: " + this.$route.params.id);
    var defintionId = this.$route.params.id;
    if (defintionId) {
      this.getDefinitionById(defintionId);
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.qry-form {
  .width203 {
    width: 203px;
  }
}
.body{
  .svg-icon{
    margin-right: 5px;
  }
}
.el-pagination {
  float: right;
  margin-top: 15px;
}
.toolbar {
  margin: 10px 0;
}
</style>
