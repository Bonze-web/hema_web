<template>
  <div class="definition-add">
    <div class="top-box">
      <span>新增报表</span>
      <el-button type="primary" @click="onSave('form')">保存</el-button>
      <el-button type="primary" v-if="form.state === 'OFFLINE'" @click="onSaveAndCreate('form')">保存并提交</el-button>
      <el-button @click="handleCancel">取消</el-button>
    </div>
    <div class="add-content">
      <p>基本信息</p>
      <el-form ref="form" :model="form" status-icon :rules="rules" label-width="160px">
        <el-form-item label="报表名称：" required prop="name">
          <el-input v-model="form.name" placeholder="请输入报表名称"></el-input>
        </el-form-item>
        <el-form-item label="报表SQL：" prop="sql">
          <div class="sqlcode-box">
            <codemirror ref="myCm" v-model="code" :options="cmOptions" class="code" @cursorActivity="handleCursorActivity"></codemirror>
          </div>
          <span class="remain">*查询语句，Freemarker语法</span>
        </el-form-item>
        <el-form-item label="报表排序：" prop="orderNumber">
          <el-input type="number" class="width210" v-model="form.orderNumber" placeholder="请输入数字序号，例如0、1"></el-input>
          <div class="remain">*数值越小报表越靠前</div>
        </el-form-item>
        <el-form-item label="是否支持分页">
          <el-switch v-model="form.pageable"></el-switch>
        </el-form-item>
        <el-form-item label="备注：" prop="remark">
          <el-input type="textarea" :rows="4" v-model="form.remark" placeholder="请输入备注"></el-input>
        </el-form-item>
        <el-form-item label="报表字段：" prop="fields">
          <el-table :data="form.fields" border style="width: 750px" v-show="form.fields.length > 0" max-height="260">
            <el-table-column prop="caption" label="字段标题" width="120"></el-table-column>
            <el-table-column prop="name" label="字段名称"></el-table-column>
            <!-- <el-table-column prop="componentType" label="控件类型" width="80">
              <template slot-scope="scope">{{scope.row.componentType | filtComponentType}}</template>
            </el-table-column>-->
            <el-table-column prop="type" label="字段类型" width="80">
              <template slot-scope="scope">{{scope.row.type | filtParamsType}}</template>
            </el-table-column>
            <el-table-column prop="hidden" label="是否隐藏" width="80">
              <template slot-scope="scope">{{scope.row.hidden | filtBoolean}}</template>
            </el-table-column>
            <!-- <el-table-column prop="multiple" label="是否多选" width="80">
              <template slot-scope="scope">{{scope.row.multiple | filtBoolean}}</template>
            </el-table-column>
            <el-table-column prop="sortable" label="是否可排序" width="100">
              <template slot-scope="scope">{{scope.row.sortable | filtBoolean}}</template>
            </el-table-column>-->
            <el-table-column prop="queryable" label="是否可搜索" width="100">
              <template slot-scope="scope">{{scope.row.queryable | filtBoolean}}</template>
            </el-table-column>
            <el-table-column fixed="right" label="操作" width="100">
              <template slot-scope="scope">
                <el-button @click="handleEditsParame(scope.$index,scope.row,'FIELDS')" type="text" size="small">编辑</el-button>
                <el-button @click="handleDeleteFields(scope.$index,scope.row,'FIELDS')" type="text" size="small">刪除</el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-button @click="addReportParams('FIELDS')">新增报表字段</el-button>
        </el-form-item>
        <el-form-item label="报表参数：" prop="params">
          <el-table :data="form.params" border style="width: 750px" v-show="form.params.length > 0" max-height="260">
            <el-table-column prop="caption" label="字段标题" width="120"></el-table-column>
            <el-table-column prop="name" label="字段名称"></el-table-column>
            <el-table-column prop="componentType" label="控件类型" width="80">
              <template slot-scope="scope">{{scope.row.componentType | filtComponentType}}</template>
            </el-table-column>
            <el-table-column prop="type" label="字段类型" width="80">
              <template slot-scope="scope">{{scope.row.type | filtParamsType}}</template>
            </el-table-column>
            <el-table-column prop="defaultValue" label="默认值" width="80"></el-table-column>
            <el-table-column prop="hidden" label="是否隐藏" width="80">
              <template slot-scope="scope">{{scope.row.hidden | filtBoolean}}</template>
            </el-table-column>
            <!-- <el-table-column prop="multiple" label="是否多选" width="80">
              <template slot-scope="scope">{{scope.row.multiple | filtBoolean}}</template>
            </el-table-column>-->
            <!-- <el-table-column prop="sortable" label="是否可排序" width="100">
              <template slot-scope="scope">{{scope.row.sortable | filtBoolean}}</template>
            </el-table-column>-->
            <!-- <el-table-column prop="options" label="可选项" width="80">
              <template slot-scope="scope">{{scope.row.options | filtOption}}</template>
            </el-table-column>-->
            <el-table-column prop="queryable" label="是否可搜索" width="100">
              <template slot-scope="scope">{{scope.row.queryable | filtBoolean}}</template>
            </el-table-column>
            <el-table-column fixed="right" label="操作" width="100">
              <template slot-scope="scope">
                <el-button @click="handleEditsParame(scope.$index,scope.row,'PARAMS')" type="text" size="small">编辑</el-button>
                <el-button @click="handleDeleteFields(scope.$index,scope.row,'PARAMS')" type="text" size="small">刪除</el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-button @click="addReportParams('PARAMS')">新增报表参数</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" width="50%" center>
      <div class="dialog-content">
        <el-scrollbar style="height:100%;width:100%;">
          <el-form ref="paramsForm" :model="paramsForm" status-icon :rules="paramsFormRules" label-width="120px">
            <el-form-item label="字段标题：" required prop="caption">
              <el-input v-model="paramsForm.caption" placeholder="请输入字段标题"></el-input>
            </el-form-item>
            <el-form-item label="字段名称：" required prop="name">
              <el-input v-model="paramsForm.name" placeholder="请输入字段名称"></el-input>
            </el-form-item>
            <el-form-item label="字段类型：">
              <el-select v-model="paramsForm.type" placeholder="请选择">
                <el-option v-for="item in paramsType" :key="item.value" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="控件类型：" v-if="dialogType==='PARAMS'">
              <el-select v-model="paramsForm.componentType" placeholder="请选择">
                <el-option v-for="item in componentType" :key="item.value" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="默认值：" prop="defaultValue" v-if="dialogType==='PARAMS'">
              <el-input v-model="paramsForm.defaultValue" placeholder="请输入字段默认值"></el-input>
            </el-form-item>
            <el-form-item label="字段扩展参数：" prop="extend" v-if="dialogType==='PARAMS'">
              <el-input v-model="paramsForm.extend" placeholder="请输入扩展参数"></el-input>
              <span class="remain">*前后端约定</span>
            </el-form-item>
            <el-form-item label="是否隐藏：">
              <el-switch v-model="paramsForm.hidden"></el-switch>
              <span class="remain">*如果为true，报表将隐藏该列</span>
            </el-form-item>
            <!-- <el-form-item label="是否允许多选：">
            <el-switch v-model="paramsForm.multiple"></el-switch>
            </el-form-item>-->
            <el-form-item label="是否可搜索：">
              <el-switch v-model="paramsForm.queryable"></el-switch>
              <span class="remain">*如果可搜索就相当于报表参数</span>
            </el-form-item>
            <!-- <el-form-item label="是否可排序：">
            <el-switch v-model="paramsForm.sortable"></el-switch>
            </el-form-item>-->
            <el-form-item label="可选项：">
              <el-row>
                <el-col :offset="0">
                  <div class="add-options">
                    <div class="self-table">
                      <div class="self-tr" v-show="paramsForm.options.length > 0">
                        <div class="self-td">标题</div>
                        <div class="self-td">值</div>
                        <div class="self-td"></div>
                      </div>
                      <div class="self-tr" v-for="(item, index) in paramsForm.options" :key="index">
                        <div class="self-td">
                          <el-input v-model="item.caption" type="text"></el-input>
                        </div>
                        <div class="self-td">
                          <el-input v-model="item.value" type="text"></el-input>
                        </div>
                        <div class="self-td">
                          <el-button type="text" @click="handleDeleteOptions(item, index)">删除</el-button>
                        </div>
                      </div>
                    </div>
                    <el-button size="small" icon="el-icon-plus" @click="handleAddOptions">添加可选项</el-button>
                  </div>
                </el-col>
              </el-row>
            </el-form-item>
            <el-form-item label="字段约束：" v-if="dialogType==='PARAMS'">
              <div class="constraint-box">
                <div>
                  <span>是否必填</span>
                  <el-switch v-model="paramsForm.constraint.required"></el-switch>
                </div>
                <div v-if="paramsForm.componentType==='INPUT' || paramsForm.componentType==='NUMBER'">
                  <span>最大值：</span>
                  <el-input v-model.number="paramsForm.constraint.max"></el-input>
                  <span>是否可以等于</span>
                  <el-switch v-model="paramsForm.constraint.maxEquals"></el-switch>
                </div>
                <div v-if="paramsForm.componentType==='INPUT' || paramsForm.componentType==='NUMBER'">
                  <span>最小值：</span>
                  <el-input v-model.number="paramsForm.constraint.min"></el-input>
                  <span>是否可以等于</span>
                  <el-switch v-model="paramsForm.constraint.minEquals"></el-switch>
                </div>
                <div class="column">
                  <span>字段长度</span>
                </div>
                <div>
                  <span>最大值：</span>
                  <el-input v-model.number="paramsForm.constraint.size.max"></el-input>
                  <span>是否可以等于</span>
                  <el-switch v-model="paramsForm.constraint.size.maxEquals"></el-switch>
                </div>
                <div class="remain">*&nbsp;&nbsp;字段长度的最大值</div>
                <div>
                  <span>最小值：</span>
                  <el-input v-model.number="paramsForm.constraint.size.min"></el-input>
                  <span>是否可以等于</span>
                  <el-switch v-model="paramsForm.constraint.size.minEquals"></el-switch>
                </div>
                <div class="remain">*&nbsp;&nbsp;字段长度的最小值</div>
              </div>
            </el-form-item>
          </el-form>
        </el-scrollbar>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleConfirm()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import OrgSelect from "@/components/orgSelect.vue";
import ReportService from "@/api/service/ReportService";
import "codemirror/theme/ambiance.css";
import "codemirror/lib/codemirror.css";
import "codemirror/addon/hint/show-hint.css";
import { codemirror } from "vue-codemirror";
import "codemirror/mode/sql/sql.js";
export default {
  data() {
    var validateName = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("门店名称不能为空"));
      } else {
        callback();
      }
    };
    const validateNumber = (rule, value, callback) => {
      const reg = /^[0-9]+$/; // 判断字符串是否为数字//判断正整数/[1−9]+[0−9]∗]∗/
      if (value && !reg.test(value)) {
        callback(new Error("排序数字必须为非负整数"));
      } else {
        callback();
      }
    };
    return {
      isEdit: false, // 如果为true 表明是编辑状态，否则是新增状态
      form: {
        id: null, // 报表id
        state: "", // 状态
        name: "", // 报表名称
        onlineOnCreate: false, // 创建的同时启用报表
        pageable: false, // 是否支持分页
        params: [], // 报表参数
        fields: [], // 报表字段
        remark: "", // 备注
        sql: "", // 查询语句，Freemarker语法
        type: "TABLE", // 报表类型 TABLE, CHART
        orderNumber: "" // 排序字段,数值越小越靠前
      },
      loading: false,
      upperOrgs: [], // 上级组织
      rules: {
        name: [{ validator: validateName, trigger: "blur" }],
        orderNumber: [{ validator: validateNumber, trigger: "blur" }]
      },
      code: "",
      cmOptions: {
        mode: "text/x-mysql", // 选择对应代码编辑器的语言，我这边选的是数据库，根据个人情况自行设置即可
        indentWithTabs: true,
        smartIndent: true,
        lineNumbers: true,
        matchBrackets: true,
        // autofocus: false,
        extraKeys: { Ctrl: "autocomplete" }, // 自定义快捷键
        hintOptions: {},
        lineWrapping: true, // 在长行时文字是换行(wrap)还是滚动(scroll)，默认为滚动(scroll)。
        styleActiveLine: true
      },
      paramsForm: {
        id: null,
        name: "", // 字段名称
        caption: "", // 字段标题
        type: null, // 字段类型 STRING, NUMBER, BOOLEAN, DATE, TIME, DATETIME, IMAGE
        componentType: null, // 控件类型，可空。为空时前端可自行根据值类型使用相应的控件显示，如果不为空，前端需根据控件显示输入框
        options: [], // 可选项
        constraint: {
          // 字段约束
          max: null, // 最大值
          maxEquals: false, // 是否可以等于最大值
          min: null, // 最小值
          minEquals: false, // 是否可以等于最小值
          required: false, // 是否必填
          size: {
            // 长度
            max: null, // 最大值
            maxEquals: false, // 是否可以等于最大值
            min: null, // 最小值
            minEquals: false // 是否可以等于最小值
          }
        },
        defaultValue: null, // 默认值
        extend: null, // 字段扩展参数，前后端约定
        hidden: false, // 是否隐藏，如果为true，报表将隐藏该列
        multiple: false, // 是否允许多选
        queryable: false, // 是否可搜索，如果可搜索就相当于报表参数
        sortable: false // 是否可排序
      },
      paramsFormRules: {
        name: [{ required: true, message: "请输入字段名称", trigger: "blur" }],
        caption: [
          { required: true, message: "请输入字段标题", trigger: "blur" }
        ]
      },
      componentType: [
        { label: "单选框", value: "RADIO" },
        { label: "多选框", value: "CHECKBOX" },
        { label: "输入框", value: "INPUT" },
        { label: "数字输入框", value: "NUMBER" },
        { label: "选择器", value: "SELECT" },
        { label: "开关", value: "SWITCH" },
        { label: "日期选择器", value: "DATE_PICKER" },
        { label: "时间选择器", value: "TIME_PICKER" },
        { label: "日期时间选择器", value: "DATETIME_PICKER" },
        { label: "组织选择器", value: "ORG_PICKER" },
        { label: "用户选择器", value: "USER_PICKER" },
        { label: "会员选择器", value: "MEMBER_PICKER" }
      ], // 控件类型，可空。为空时前端可自行根据值类型使用相应的控件显示，如果不为空，前端需根据控件显示输入框
      paramsType: [
        { label: "字符串", value: "STRING" },
        { label: "数字", value: "NUMBER" },
        { label: "布尔值", value: "BOOLEAN" },
        { label: "日期", value: "DATE" },
        { label: "时间类型", value: "TIME" },
        { label: "日期时间", value: "DATETIME" },
        { label: "图像", value: "IMAGE" }
      ],
      dialogVisible: false,
      dialogTitle: "新增报表参数",
      dialogType: "PARAMS", // PARAMS, FIELDS
      codeTips: true // 是否显示代码提示
    };
  },
  methods: {
    // 取消
    handleCancel() {
      this.$router.go(-1);
    },
    /* 保存并创建 */
    onSaveAndCreate(formName) {
      this.form.onlineOnCreate = true;
      this.onSave(formName);
    },
    // 保存
    onSave(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          var postData = {
            name: this.form.name,
            onlineOnCreate: this.form.onlineOnCreate,
            fields: this.form.fields,
            pageable: this.form.pageable,
            params: this.form.params,
            remark: this.form.remark,
            type: this.form.type,
            sql: this.code,
            orderNumber: this.form.orderNumber
          };
          console.log(postData);
          if (this.form.id) {
            // 编辑
            postData.id = this.form.id;
            ReportService.update(postData)
              .then(res => {
                this.$router.push({
                  path: "/report/designer"
                });
              })
              .catch(err => {
                this.$message.error(err.message);
              });
          } else {
            // 新增
            ReportService.create(postData)
              .then(res => {
                this.$router.push({
                  path: "/report/designer"
                });
              })
              .catch(err => {
                this.$message.error(err.message);
              });
          }
        } else {
          this.$message({
            type: "warning",
            message: "填写内容有误"
          });
          return false;
        }
      });
    },
    /* 新增报表参数或字段 */
    addReportParams(val) {
      this.dialogVisible = true;
      if (this.$refs["paramsForm"] !== undefined) {
        this.resetParamsData();
        this.$refs["paramsForm"].resetFields();
      }
      this.dialogType = val;
      if (val === "PARAMS") {
        this.dialogTitle = "新增报表参数";
      } else {
        this.dialogTitle = "新增报表字段";
      }
    },
    /* 编辑报表参数或字段 */
    handleEditsParame(index, row, type) {
      console.log(row);
      this.paramsForm.id = row.id ? row.id : index;
      this.paramsForm.name = row.name ? row.name : ""; // 字段名称
      this.paramsForm.caption = row.caption ? row.caption : ""; // 字段标题
      this.paramsForm.type = row.type ? row.type : ""; // 字段类型 STRING, NUMBER, BOOLEAN, DATE, TIME, DATETIME, IMAGE
      this.paramsForm.componentType = row.componentType
        ? row.componentType
        : null; // 控件类型，可空。为空时前端可自行根据值类型使用相应的控件显示，如果不为空，前端需根据控件显示输入框
      this.paramsForm.options =
        row.options && row.options.length > 0 ? row.options : []; // 可选项
      this.paramsForm.defaultValue = row.defaultValue ? row.defaultValue : null; // 默认值
      this.paramsForm.extend = row.componentType ? row.componentType : null; // 字段扩展参数，前后端约定
      this.paramsForm.hidden = row.hidden ? row.hidden : false; // 是否隐藏，如果为true，报表将隐藏该列
      this.paramsForm.multiple = row.multiple ? row.multiple : false; // 是否允许多选
      this.paramsForm.queryable = row.queryable ? row.queryable : false; // 是否可搜索，如果可搜索就相当于报表参数
      this.paramsForm.sortable = row.sortable ? row.sortable : false; // 是否可排序
      // 字段约束
      this.paramsForm.constraint.max =
        row.constraint && row.constraint.max ? row.constraint.max : null; // 最大值
      this.paramsForm.constraint.maxEquals =
        row.constraint && row.constraint.maxEquals
          ? row.constraint.maxEquals
          : false; // 是否可以等于最大值
      this.paramsForm.constraint.min =
        row.constraint && row.constraint.min ? row.constraint.min : null; // 最小值
      this.paramsForm.constraint.minEquals =
        row.constraint && row.constraint.minEquals
          ? row.constraint.minEquals
          : false; // 是否可以等于最小值
      this.paramsForm.constraint.required =
        row.constraint && row.constraint.required
          ? row.constraint.required
          : false; // 是否必填
      this.paramsForm.constraint.size.max =
        row.constraint && row.constraint.size.max
          ? row.constraint.size.max
          : null; // 长度最大值
      this.paramsForm.constraint.size.maxEquals =
        row.constraint && row.constraint.size.maxEquals
          ? row.constraint.size.maxEquals
          : false; // 是否可以等于长度最大值
      this.paramsForm.constraint.size.min =
        row.constraint && row.constraint.size.min
          ? row.constraint.size.min
          : null; // 长度最小值
      this.paramsForm.constraint.size.minEquals =
        row.constraint && row.constraint.size.minEquals
          ? row.constraint.size.minEquals
          : false; // 是否可以等于长度最小值
      this.dialogVisible = true;
      this.dialogType = type;
      if (type === "PARAMS") {
        this.dialogTitle = "编辑报表参数";
      } else {
        this.dialogTitle = "编辑报表字段";
      }
    },
    /* 确认添加参数 */
    handleConfirm() {
      this.$refs["paramsForm"].validate(valid => {
        if (valid) {
          this.dialogVisible = false;
          if (this.dialogType === "PARAMS") {
            if (this.paramsForm.id || this.paramsForm.id === 0) {
              this.form.params[this.paramsForm.id] = Object.assign(
                {},
                this.paramsForm
              );
            } else {
              this.form.params.push(Object.assign({}, this.paramsForm));
            }
          } else {
            console.log(this.paramsForm);
            if (this.paramsForm.id || this.paramsForm.id === 0) {
              this.form.fields[this.paramsForm.id] = Object.assign(
                {},
                this.paramsForm
              );
            } else {
              this.form.fields.push(Object.assign({}, this.paramsForm));
            }
          }
        } else {
          this.$message({
            type: "warning",
            message: "请检查输入内容"
          });
          return false;
        }
      });
    },

    handleCursorActivity: function(e) {
      // if (this.codeTips) {
      //   this.$refs.myCm.codemirror.showHint();
      // }
    },
    /* 重置参数弹框数据 */
    resetParamsData() {
      this.paramsForm.id = null;
      this.paramsForm.state = null;
      this.paramsForm.name = ""; // 字段名称
      this.paramsForm.caption = ""; // 字段标题
      this.paramsForm.type = ""; // 字段类型 STRING, NUMBER, BOOLEAN, DATE, TIME, DATETIME, IMAGE
      this.paramsForm.componentType = null; // 控件类型，可空。为空时前端可自行根据值类型使用相应的控件显示，如果不为空，前端需根据控件显示输入框
      this.paramsForm.options = []; // 可选项
      this.paramsForm.defaultValue = null; // 默认值
      this.paramsForm.extend = null; // 字段扩展参数，前后端约定
      this.paramsForm.hidden = false; // 是否隐藏，如果为true，报表将隐藏该列
      this.paramsForm.multiple = false; // 是否允许多选
      this.paramsForm.queryable = false; // 是否可搜索，如果可搜索就相当于报表参数
      this.paramsForm.sortable = false; // 是否可排序
      // 字段约束
      this.paramsForm.constraint.max = null; // 最大值
      this.paramsForm.constraint.maxEquals = false; // 是否可以等于最大值
      this.paramsForm.constraint.min = null; // 最小值
      this.paramsForm.constraint.minEquals = false; // 是否可以等于最小值
      this.paramsForm.constraint.required = false; // 是否必填
      this.paramsForm.constraint.size.max = null; // 长度最大值
      this.paramsForm.constraint.size.maxEquals = false; // 是否可以等于长度最大值
      this.paramsForm.constraint.size.min = null; // 长度最小值
      this.paramsForm.constraint.size.minEquals = false; // 是否可以等于长度最小值
    },
    // 删除可选项
    handleDeleteOptions(val, index) {
      this.paramsForm.options.splice(index, 1);
    },
    /* 删除字段 */
    handleDeleteFields(index, val, type) {
      if (type === "PARAMS") {
        this.form.params.splice(index, 1);
      } else if (type === "FIELDS") {
        this.form.fields.splice(index, 1);
      }
    },
    /* 删除参数 */
    handleDeleteParams(val, index) {
      this.form.params.splice(index, 1);
    },
    // 添加可选项
    handleAddOptions() {
      this.paramsForm.options.push({
        caption: "",
        value: ""
      });
    },

    /* 根据报表id查询报表详情 */
    getById(id) {
      this.isEdit = true;
      this.codeTips = false;
      this.form.id = id;
      ReportService.getById(id)
        .then(res => {
          this.form.name = res.name;
          this.form.state = res.state;
          this.form.onlineOnCreate = res.onlineOnCreate;
          this.form.fields = res.fields;
          this.form.pageable = res.pageable;
          this.form.params = res.params;
          this.form.remark = res.remark;
          this.form.type = res.type;
          // 查询语句，Freemarker模板
          this.form.sql = res.sql;
          this.form.orderNumber = res.orderNumber;
          this.code = res.sql;
          setTimeout(() => {
            this.codeTips = true;
          }, 100);
        })
        .then(res => {})
        .catch(err => {
          this.$message.error(err.message);
        });
    }
  },
  computed: {
    codemirror() {
      return this.$refs.myCm.codemirror;
    }
  },

  filters: {
    filtBoolean: function(val) {
      let res = "";
      if (val === true) {
        res = "是";
      } else if (val === false) {
        res = "否";
      }
      return res;
    },
    filtComponentType: function(val) {
      let res = "";
      if (val === "RADIO") {
        res = "单选框";
      } else if (val === "CHECKBOX") {
        res = "多选框";
      } else if (val === "INPUT") {
        res = "输入框";
      } else if (val === "NUMBER") {
        res = "数字输入框";
      } else if (val === "SELECT") {
        res = "选择器";
      } else if (val === "SWITCH") {
        res = "开关";
      } else if (val === "DATE_PICKER") {
        res = "日期选择器";
      } else if (val === "TIME_PICKER") {
        res = "时间选择器";
      } else if (val === "DATETIME_PICKER") {
        res = "日期时间选择器";
      } else if (val === "ORG_PICKER") {
        res = "组织选择器";
      } else if (val === "USER_PICKER") {
        res = "用户选择器";
      } else if (val === "MEMBER_PICKER") {
        res = "会员选择器";
      }
      return res;
    },
    filtParamsType: function(val) {
      let res = "";
      if (val === "STRING") {
        res = "字符串";
      } else if (val === "NUMBER") {
        res = "数字";
      } else if (val === "BOOLEAN") {
        res = "布尔值";
      } else if (val === "DATE") {
        res = "日期";
      } else if (val === "TIME") {
        res = "时间类型";
      } else if (val === "DATETIME") {
        res = "日期时间";
      } else if (val === "IMAGE") {
        res = "图像";
      }
      return res;
    },
    filtOption(options) {
      var res = "";
      if (Array.isArray(options)) {
        for (var opt of options) {
          res = res + opt.caption + ",";
        }
      }
      res = res.substring(0, res.length - 1);
      return res;
    }
  },

  mounted() {
    this.prj = process.env.PRJ;
    // 如果url中有id参数, 根据id查询商品详情
    if (this.$route.query.id) {
      this.getById(this.$route.query.id);
    }
  },
  components: {
    OrgSelect,
    codemirror
  }
};
</script>

<style lang="scss" scoped>
@import "src/styles/mixin.scss";
.definition-add {
  background-color: #ebeff3;
  min-width: 800px;
  > div {
    margin-bottom: 15px;
    padding: 15px;
    &:last-child {
      margin-bottom: 0;
    }
  }
  .top-box {
    @include titleSticky;
    background-color: #ffffff;
    border-radius: 8px;
    span {
      font-size: 20px;
      line-height: 40px;
    }
    .el-button {
      float: right;
      margin-left: 10px;
    }
  }
  .add-content {
    background-color: #ffffff;
    border-radius: 8px;
    > p {
      font-size: 18px;
      margin: 0px;
      padding: 0px;
      margin-bottom: 20px;
    }
  }
  .sqlcode-box {
    border: 1px solid #c0c4cc;
    line-height: 24px;
  }
  .remain {
    font-size: 12px;
    line-height: 18px;
    color: #999;
    margin: 8px 0;
  }

  .dialog-content {
    height: 360px;
    .el-form {
      padding: 0 20px;
    }
    .add-options {
      margin-bottom: 20px;
    }
    .constraint-box {
      > div {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        margin-bottom: 10px;
        > span {
          width: 84px;
          flex-shrink: 0;
          margin-right: 10px;
          text-align: right;
          &:first-of-type {
            width: 56px;
          }
        }
        .el-input {
          margin-right: 10px;
          width: 60px;
        }
        &.column {
          border-top: 1px solid #c0c4cc;
        }
        &.remain {
          padding-left: 50px;
        }
      }
    }
  }
  .self-table {
    .self-tr {
      overflow: hidden;
      margin-bottom: 10px;
      .self-td {
        width: 82px;
        float: left;
        margin-right: 10px;
      }
    }
  }
  .width210 {
    width: 210px;
  }
}
</style>
<style lang="scss">
.definition-add {
  .el-scrollbar__wrap {
    overflow-x: hidden;
  }
  .el-table {
    margin-bottom: 20px;
  }
}
</style>