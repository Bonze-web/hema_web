<template>
  <base-list>
    <div slot="header">
      <el-form ref="qryForm" :model="form" label-width="100px">
        <el-form-item prop="typeEquals" label="模板类型">
          <el-select v-model="form.typeEquals" placeholder="请选择模板类型">
            <el-option
              v-for="item in qryForm.templateType"
              :key="item.type"
              :label="item.name"
              :value="item.type"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="printerTypeEquals" label="打印机类型">
          <el-select v-model="form.printerTypeEquals" placeholder="请选择打印机类型">
            <el-option
              v-for="printer in qryForm.printerType"
              :key="printer.type"
              :label="printer.name"
              :value="printer.type"
            ></el-option>
          </el-select>
        </el-form-item>
        <!-- <el-form-item label="模板类型" prop="nameLike">
          <el-input v-model="qryForm.nameLike" placeholder="请输入模板类型" style="width:200px"></el-input>
        </el-form-item>
        <el-form-item label="打印机类型" prop="upperOrgIdEquals">
          <el-input v-model="qryForm.nameLike" placeholder="角色名称，支持模糊匹配" style="width:200px"></el-input>
        </el-form-item>-->
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="onQuery('qryForm')">搜索</el-button>
          <el-button @click="resetForm('qryForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div slot="body">
      <el-table :data="isSelect ? selectRecords : pageData.records" style="width: 100%" v-loading="listLoading">
        <!--checkbox 适当加宽，否则IE下面有省略号 https://github.com/ElemeFE/element/issues/1563-->
        <el-table-column prop="id" type="index" width="50"></el-table-column>
        <el-table-column label="模板类型">
          <template slot-scope="scope">
            <div>{{scope.row.type | typeName}}</div>
          </template>
        </el-table-column>
        <el-table-column label="打印机类型">
          <template slot-scope="scope">
            <div>{{scope.row.printerType | printerName}}</div>
          </template>
        </el-table-column>
        <el-table-column prop="content" label="模板内容" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="remark" label="备注" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column label="操作" width="300" align="center" header-align="center">
          <template slot-scope="scope">
            <el-button
              size="small"
              type="text"
              @click="handleEdit(scope.$index, scope.row)"
              v-if="hasPermission(PermIds.CATERING_PRINTER_TEMPLATE_UPDATE)"
            >编辑</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </base-list>
</template>

<script>
import BaseList from "@/components/bill/baseList.vue";
import pageBar from "@/components/pagebar.vue";
import PrintTemplate from "@/api/service/PrintTemplate";
import OrgSelect from "@/components/orgSelect";
import PermIds from "@/api/permissionIds";
import { mapGetters } from "vuex";

export default {
  components: {
    "page-bar": pageBar,
    "base-list": BaseList,
    OrgSelect
  },

  data() {
    return {
      qryForm: {
        templateType: [
          {
            name: "线下订单",
            type: "OFFLINE_ORDER"
          },
          {
            name: "立即取餐订单",
            type: "TAKE_MEAL_NOW_ORDER"
          },
          {
            name: "自提订单",
            type: "SELF_DRAW_ORDER"
          },
          {
            name: "外卖订单",
            type: "EXPRESS_ORDER"
          },
          {
            name: "立即取餐退单",
            type: "TAKE_MEAL_NOW_REFUND"
          },
          {
            name: "自提退单",
            type: "SELF_DRAW_REFUND"
          },
          {
            name: "外卖退单",
            type: "EXPRESS_REFUND"
          },
          {
            name: "待审核退款单",
            type: "WAIT_AUDIT_REFUND"
          },
          {
            name: "配送单",
            type: "DISTRIBUTION_ORDER"
          }
        ],
        printerType: [
          {
            name: "易联云",
            type: "YLY"
          },
          {
            name: "商米",
            type: "SUNMI"
          },
          {
            name: "POS自带打印机",
            type: "POS"
          }
        ]
      },

      form: {
        typeEquals: "",
        printerTypeEquals: ""
      },
      currentRow: {},
      listLoading: false,
      pageData: {
        records: []
      },
      selectRecords: [],
      isSelect: false,
      PermIds: PermIds
    };
  },

  computed: {
    ...mapGetters(["hasPermission", "user"])
  },

  filters: {
    printerName(value) {
      console.log(value);
      if (value === "YLY") {
        return "易联云";
      } else if (value === "SUNMI") {
        return "商米";
      } else if (value === "POS") {
        return "POS自带打印机";
      }
    },

    typeName(value) {
      if (value === "OFFLINE_ORDER") {
        return "线下订单";
      } else if (value === "TAKE_MEAL_NOW_ORDER") {
        return "立即取餐订单";
      } else if (value === "SELF_DRAW_ORDER") {
        return "自提订单";
      } else if (value === "EXPRESS_ORDER") {
        return "外卖订单";
      } else if (value === "TAKE_MEAL_NOW_REFUND") {
        return "立即取餐退单";
      } else if (value === "SELF_DRAW_REFUND") {
        return "自提退单";
      } else if (value === "EXPRESS_REFUND") {
        return "外卖退单";
      } else if (value === "WAIT_AUDIT_REFUND") {
        return "待审核退款单";
      } else if (value === "DISTRIBUTION_ORDER") {
        return "配送单";
      }
    }
  },

  methods: {
    message(type, msg) {
      this.$message({
        type: type,
        message: msg
      });
    },

    // 搜索框
    onQuery() {
      this.selectRecords = []
      const records = this.pageData.records;
      console.log(records)
      // 判断搜索的打印模板是否存在
      if (this.form.typeEquals !== "") {
        // 如果存在，循环找到一样的打印模板
        for (let i = 0; i < records.length; i++) {
          if (records[i].type === this.form.typeEquals) {
            if (this.form.printerTypeEquals !== "") {
              if (this.form.printerTypeEquals === records[i].printerType) {
                this.selectRecords.push(records[i])
                this.isSelect = true
              } else {
                this.message("warning", "没有你要搜索的内容")
                this.isSelect = false
              }
            } else {
              this.selectRecords.push(records[i])
              this.isSelect = true
            }
          }
        }
      } else {
        if (this.form.printerTypeEquals !== "") {
          for (let i = 0; i < records.length; i++) {
            if (this.form.printerTypeEquals === records[i].printerType) {
              this.selectRecords.push(records[i])
              this.isSelect = true
            } else {
              this.message("warning", "没有你要搜索的内容")
              this.isSelect = false
            }
          }
        } else {
          this.isSelect = false
        }
      }
      console.log(this.selectRecords, "搜索过后的数据")
    },

    /**
     * 重置搜索框
     */
    resetForm(formName) {
      this.$refs[formName].resetFields();
      this.isSelect = false;
      this.onQuery();
    },

    handleEdit(index, row) {
      console.log(row);
      this.$router.push({
        name: "PrintEdit",
        query: {
          templateInfo: JSON.stringify(row)
        }
      });
    },
    /**
     * 一次性加载完所有数据
     */
    templatead() {
      // const self = this
      PrintTemplate.getAll()
        .then(data => {
          console.log(data, "处理之前的数据");
          // data.forEach((item, index) => {
          //   console.log(item, "数据里面的每一项")
          //   const record = {}
          //   record.type = item.type;
          //   record.printerType = item.printerType;
          //   record.remark = item.remark;
          //   record.content = item.content;
          //   record.id = item.id;
          //   this.pageData.records[index] = record;
          // })
          this.pageData.records = data
          console.log(this.pageData.records, "处理完成的数据")
        })
        .catch(error => {
          this.$message.error(error.message);
        });
    }
  },

  created() {
    this.templatead();
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.el-pagination {
  float: right;
  margin-top: 15px;
}
</style>