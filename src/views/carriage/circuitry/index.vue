<template>
    <div class="table-index _table-index">   
        <el-container style="height: 500px; border: 1px solid #eee">
          <el-aside width="300px" style="background-color: #fff;padding: 0 20px;border: 1px #eee solid;">
            <div class="seriation-left-header" style="padding-top:20px;display:flex;align-items: center;">
              <div class="seriation-left-title">路线方案</div>
              <el-button type="primary" @click.stop="newProjectsChange">新建方案</el-button>
            </div>
            <el-input v-model="codeEqOrNameLike" placeholder="请输入团点代码/名称" @change="searchScheme"><i slot="prefix" class="el-input__icon el-icon-search" style="right:0" @click="searchScheme"></i></el-input>
            <el-collapse accordion style="margin-top:15px;">
              <el-collapse-item v-for="(ele, idx) in storeAllSchemeAll" :key="idx">
                <template slot="title">
                    <div class="sequential-programme" style="font-size:14px;">
                      <span class="el-icon-folder" style="display:flex;align-items: center;max-width: 160px;overflow:hidden;color:#409EFF;cursor: pointer;"><span style="padding-left:10px;" @click.stop="schemeOrStore('scheme', ele.schemeList, ele)">{{'[' + ele.schemeList.code + ']' + ele.schemeList.name}}</span></span> 
                      <div class="operation-button">
                         <el-button
                            size="mini"
                            type="text"
                            style="font-size:14px"
                            @click.stop="editProjectsChange(ele.schemeList)"
                            >编辑</el-button
                          >
                          <el-button
                            size="mini"
                            type="text"
                            style="font-size:14px"
                            @click.stop="deleteProjectsChange(ele.schemeList)"
                            >删除</el-button
                          >
                      </div>
                    </div>
                </template>
                <div>
                  <div class="content-operation" v-for="(item, index) in ele.store" :key="index">
                      <span class="el-icon-sort" style="display:flex;align-items: center;max-width: 150px;overflow:hidden;color:#409EFF;cursor: pointer;"><span style="padding-left:10px;" @click.stop="schemeOrStore('store', item, ele)">{{'[' + item.code + ']' + item.name}}</span></span> 
                      <div class="operation-button">
                         <el-button
                            size="mini"
                            type="text"
                            @click.stop="editStoreChange(item, ele, index)"
                            >编辑</el-button
                          >
                          <el-button
                            size="mini"
                            type="text"
                            @click.stop="deleteGroupChange(item)"
                            >删除</el-button
                          >
                      </div>
                  </div>
                </div>
              </el-collapse-item>
            </el-collapse>
          </el-aside>
    
          <el-container>
            <el-main style="background-color: #fff;font-size:14px">
                  <el-header style="font-size: 16px;height: 30px;"  v-if="changeActive === 'scheme'">
                    <div class="store-header">
                      <div>
                        {{headerScheme}}
                      </div>
                      <el-button type="primary" @click="newStoreChange">新建线路</el-button>
                    </div>
                  </el-header>
                  <el-header style="font-size: 16px;height:30px;" v-if="changeActive === 'store'">
                    <div>{{headerStore}}</div>
                  </el-header>
                  <div v-if="changeActive === 'scheme'">
                    <div class="store-content">
                      <el-row>
                        <el-col :span="6" style="text-align: right;padding-right:20px;"><div>方案代码: </div></el-col>
                        <el-col :span="18"><div>{{getByIdDetail.code}}</div></el-col>
                      </el-row>
                      <el-row>
                        <el-col :span="6" style="text-align: right;padding-right:20px;"><div>方案名称: </div></el-col>
                        <el-col :span="18"><div>{{getByIdDetail.name}}</div></el-col>
                      </el-row>
                      <el-row>
                        <el-col :span="6" style="text-align: right;padding-right:20px;"><div>备注: </div></el-col>
                        <el-col :span="18"><div>{{getByIdDetail.remark}}</div></el-col>
                      </el-row>
                    </div>
                  </div>
                  <div class="info-content" v-if="changeActive === 'store'">
                    <div style="padding-left:15px;">
                      <template>
                          <el-tabs v-model="tabActiveName">
                              <el-tab-pane label="配置信息" name="suppliers">
                                  <!-- <div class="info-title" style="padding:15px 0;">基本信息</div>
                                  <el-col :span="6" class="info-box">
                                      <div>代码:</div>
                                      <div>{{ getGrpByIdDetail.code }}</div>
                                  </el-col>
                                  <el-col :span="6" class="info-box">
                                      <div>名称:</div>
                                      <div>{{ getGrpByIdDetail.name }}</div>
                                  </el-col>
                                  <el-col :span="6" class="info-box">
                                      <div>货位范围:</div>
                                      <div>{{ getGrpByIdDetail.remark }}</div>
                                  </el-col> -->
                              </el-tab-pane>
                              <el-tab-pane label="操作日志" name="operational">
                                    <!-- <system-log :modular="'PICK_ORDER'" :id="storeArmy.id"></system-log> -->
                                    <system-log :modular="'PICK_ORDER'" :id="editProjectsInfo.schemeList.id"></system-log>
                              </el-tab-pane>
                          </el-tabs>
                      </template>
                    </div>
                  </div>
                  <div style="background:#fff;padding:15px;" class="table-index" v-if="tabActiveName === 'suppliers' && changeActive === 'store'">
                    <el-row>
                      <el-button style="margin:18px 0" type="primary" size="mini" @click="establishChange"><span class="iconfont iconplus-fill" style="font-size:12px;"></span> 新建</el-button>
                    </el-row>
                    <el-table
                        lable="网格仓"
                        :data="storeOption"
                        :default-sort = "{prop: 'idx', order: 'descending'}"
                        style="width: 100%;text-align:center"
                    >
                     <el-table-column label="序号" sortable prop="idx">
                          <template slot-scope="scope">
                              {{ scope.row.idx }}
                          </template>
                      </el-table-column>
                      <el-table-column label="网格仓">
                          <template slot-scope="scope">
                              <span style="color:#409EFF">{{ "[" + scope.row.storeCode + "]" + scope.row.storeName}}</span>
                          </template>
                      </el-table-column>
                      <el-table-column label="顺序">
                          <template slot-scope="scope">
                              {{ scope.row.storeOrder}}
                          </template>
                      </el-table-column>
                      <!-- <el-table-column label="状态">
                          <template slot-scope="scope">
                              {{ scope.row.status | statusType}}
                          </template>
                      </el-table-column> -->
                      <el-table-column label="操作" width="200">
                          <template slot-scope="scope">
                            <el-button
                              size="mini"
                              type="text"
                              @click="sequencingProgramme(scope.row)"
                              class="setting-up-procedure"
                              >调序</el-button
                            >
                            <el-button
                              size="mini"
                              type="text"
                              @click="deleteItem(scope.row)"
                              >删除</el-button
                            >
                          </template>
                      </el-table-column>
                    </el-table>
                  </div>
            </el-main>
          </el-container>
        </el-container>
        <el-dialog title="新建方案" :visible.sync="newProjects">
          <el-form :model="newProjectsList" :rules="newProjectsRules">
            <el-form-item label="方案代码" :label-width="formLabelWidth" prop="code">
              <el-input v-model="newProjectsList.code" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="方案名称" :label-width="formLabelWidth" prop="name">
              <el-input v-model="newProjectsList.name" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="是否默认" :label-width="formLabelWidth">
              <el-select v-model="newProjectsList.def" placeholder="请选择">
                <el-option label="是" :value="true"></el-option>
                <el-option label="否" :value="false"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="备注" :label-width="formLabelWidth" prop="remark">
              <el-input
                type="textarea"
                :autosize="{ minRows: 2, maxRows: 4}"
                placeholder="请输入内容"
                v-model="newProjectsList.remark">
              </el-input>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="canNewProjects">取 消</el-button>
            <el-button type="primary" @click="newProjectsFlag">确 定</el-button>
          </div>
        </el-dialog>
        <el-dialog title="编辑方案" :visible.sync="editProjects">
          <el-form :model="editProjectsObj">
            <el-form-item label="方案代码" :label-width="formLabelWidth">
              <el-input v-model="editProjectsObj.code" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="方案名称" :label-width="formLabelWidth">
              <el-input v-model="editProjectsObj.name" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="是否默认" :label-width="formLabelWidth">
              <el-select v-model="editProjectsObj.def" placeholder="请选择">
                <el-option label="是" :value="true"></el-option>
                <el-option label="否" :value="false"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="备注" :label-width="formLabelWidth">
              <el-input
                type="textarea"
                :autosize="{ minRows: 2, maxRows: 4}"
                placeholder="请输入内容"
                v-model="editProjectsObj.remark">
              </el-input>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click.stop="setSchemeInfo">取 消</el-button>
            <el-button type="primary" @click="submitEditPro">确 定</el-button>
          </div>
        </el-dialog>
        <el-dialog title="新建线路" :visible.sync="newStore">
          <el-form :model="newStoreInfo" :rules="newStoreRules" ref="ruleForm">
            <el-form-item label="代码" :label-width="formLabelWidth" prop="code">
              <el-input v-model="newStoreInfo.code" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="名称" :label-width="formLabelWidth" prop="name">
              <el-input v-model="newStoreInfo.name" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="方案" :label-width="formLabelWidth">
              <div>
                {{ '[' + getByIdDetail.code + ']' + getByIdDetail.name }}
              </div>
            </el-form-item>
            <el-form-item label="备注" :label-width="formLabelWidth">
              <el-input
                type="textarea"
                :autosize="{ minRows: 2, maxRows: 4}"
                placeholder="请输入内容"
                v-model="newStoreInfo.remark">
              </el-input>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="canNewStoreInfo">取 消</el-button>
            <el-button type="primary" @click="submintNewStoreInfo">确 定</el-button>
          </div>
        </el-dialog>
        <el-dialog title="编辑线路" :visible.sync="editStore">
          <el-form :model="editStoreObj" >
            <el-form-item label="路线方案" :label-width="formLabelWidth">
              <div>
                {{ editStoreObj.getByIdMes }}
              </div>
            </el-form-item>
            <el-form-item label="线路代码" :label-width="formLabelWidth">
              <el-input v-model="editStoreObj.code" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="线路名称" :label-width="formLabelWidth">
              <el-input v-model="editStoreObj.name" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="线路数量" :label-width="formLabelWidth">
              <div>
                {{ editStoreObj.totalNum }}
              </div>
            </el-form-item>
            <el-form-item label="当前序号" :label-width="formLabelWidth">
              <div>
                {{ editStoreObj.index }}
              </div>
            </el-form-item>
            <el-form-item label="调整序号" :label-width="formLabelWidth">
              <el-input-number v-model="editStoreObj.afterNum" :min="1" :max="editStoreObj.totalNum"></el-input-number>
            </el-form-item>
            <el-form-item label="备注" :label-width="formLabelWidth">
              <el-input
                type="textarea"
                :autosize="{ minRows: 2, maxRows: 4}"
                placeholder="请输入内容"
                v-model="editStoreObj.remark">
              </el-input>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click.stop="setStoreInfo">取 消</el-button>
            <el-button type="primary" @click.stop="submitEditStoreChange">确 定</el-button>
          </div>
        </el-dialog>
        <el-dialog title="线路调序" :visible.sync="dialogFormVisible">
          <el-form :model="storeMesAll">
            <el-form-item label="方案:" >
              {{storeMesAll.getByIdMesName}}
            </el-form-item>
            <el-form-item label="线路:">
              {{storeMesAll.getGrpByIdMesName}}
            </el-form-item>
            <el-form-item label="团点:" >
              {{'[' + storeMesAll.storeCode + ']' + storeMesAll.storeName}}
            </el-form-item>
            <el-form-item label="团点数量:" >
              {{storeMesAll.mylength}}
            </el-form-item>
            <el-form-item label="当前序号:" >
              {{storeMesAll.curIdx}}
            </el-form-item>
            <el-form-item label="调整序号:" >
               <el-input-number size="mini" v-model="storeMesAll.adjustOrder" :max="storeMesAll.mylength" :min="1"></el-input-number>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisible = fasle;">取 消</el-button>
            <el-button type="primary" @click="Cancellation">确 定</el-button>
          </div>
        </el-dialog>
         <el-dialog title="添加网格仓" :visible.sync="establish" style="margin-top: 7vh" class="shuttle-box">
            <div style="text-align: center; position: relative">
              <div class="shuttle">
                  <div class="shuttle-left">
                    <div class="shuttle-left-header">
                        {{leftSelect.length}}/{{storedContentTotalCount}} 项
                    </div>
                    <el-input v-model="nameOrCodeLike" placeholder="请输入代码或名称" @change="searchDataLeftChange"><i slot="prefix" class="el-input__icon el-icon-search" style="right:0" @click="searchDataLeftChange"></i></el-input>
                    <div style="margin-top:20px;">
                      <el-table
                        ref="multipleTable"
                        :data="storedContent"
                        tooltip-effect="dark"
                        style="width: 100%"
                        class="addtable"
                        :row-key="getRowKeys"
                        @selection-change="handleSelectionChange"
                      >
                        <el-table-column
                          :reserve-selection="true"
                          type="selection"
                          width="55">
                        </el-table-column>
                        <el-table-column
                          label="网格仓"
                          width="calc(100% - 55px)"
                          style="padding: 7px 0;">
                          <template slot-scope="scope">
                              {{ '[' + scope.row.code + ']' + scope.row.name }}
                          </template>
                        </el-table-column>
                      </el-table>
                    </div>
                    <div class="block">
                      <el-pagination
                        small
                        @size-change="handleSizeChangeOne"
                        @current-change="handleCurrentChangeOne"
                        :current-page="mySelfPage"
                        :page-sizes="[10, 20, 30, 50]"
                        :page-size="mySelfPageSize"
                        layout="prev, pager, next"
                        :total="storedContentTotalCount">
                      </el-pagination>
                    </div>
                  </div>
              </div>
            </div>
            <div slot="footer" class="dialog-footer">
              <el-button @click="establish = fasle;">取 消</el-button>
              <el-button type="primary" @click="leftHandleComfirm">确 定</el-button>
            </div>
        </el-dialog>
</div>
</template>

<script>
// 引入公共模块
import CircuitryService from "@/api/service/CircuitryService";
import systemLog from "@/components/systemLog.vue"
export default {
  data() {
      return {
        adjustOrderFlag: {},
        afterNum: 1,
        editProjectsObj: {
          code: '',
          name: '',
          remark: '',
          def: false
        },
        editStoreObj: {
          code: '',
          name: '',
          remark: '',
          def: false,
          afterNum: 1
        },
        headerSchemeOneFlag: 0,
        mySelfPage: 1,
        mySelfPageSize: 10,
        storedContent: [],
        nameOrCodeLike: "",
        storedContentTotalCount: 0,
        leftSelect: [],
        establish: false,
        storeMesAll: {},
        dialogFormVisible: false,
        changeActive: "scheme",
        tabActiveName: "suppliers",
        codeEqOrNameLike: "",
        storeArmy: {},
        // 新建方案
        newProjectsList: {
          code: "",
          name: "",
          remark: "",
          def: false
        },
        // 所有的方案请求
        getAllScheme: [],
        storeAllSchemeAll: [],
        storeOption: [],
        getByIdDetail: {},
        getGrpByIdDetail: {},
        headerScheme: "",
        headerStore: "",
        newStoreInfo: {
          code: "",
          name: "",
          remark: "",
          def: false
        },
        editProjectsInfo: {},
        editStoreInfo: {},
        schemeInfo: {
          code: "111",
          name: "999",
          remark: "yyy"
        },
        storageList: [
          {
            code: "",
            name: "",
            orderNumber: 1
          }
        ],
        newProjects: false, 
        editProjects: false,
        newStore: false,
        editStore: false,
        formLabelWidth: '120px',
        newProjectsRules: {
          code: [
            {required: true, message: '代码不能为空', trigger: 'blur'}
          ],
          name: [
            {required: true, message: '名称不能为空', trigger: 'blur'}
          ]
        },
        newStoreRules: {
          code: [
            {required: true, message: '代码不能为空', trigger: 'blur'}
          ],
          name: [
            {required: true, message: '名称不能为空', trigger: 'blur'}
          ]
        }
      }
  },
  computed: {
  },
  methods: {
   newProjectsChange() {
    this.newProjects = true;
   },
   newProjectsFlag() {
    this.newProjects = false;
    this.newProjectsList.status = 'ON';
    CircuitryService.requestNewProjectsList(this.newProjectsList)
    .then((res) => {
      this.$message.success("新建成功");
      this.getAllPickOrder();
    }).catch((err) => {
      this.$message.error("新建失败" + err.message)
    })
   },
   canNewProjects() {
      this.newProjects = false;
      this.newProjectsList = {
          code: "",
          name: "",
          remark: ""
      }
   },
   canNewStoreInfo() {
      this.newStore = false;
      this.newStoreInfo = {
            code: "",
            name: "",
            remark: ""
      }
   },
   setStoreInfo() {
      this.editStore = false;
   },
   setSchemeInfo() {
      this.editProjects = false;
   },
   // 通过搜索接口来所有方案
   searchScheme() {
      const searchData = {
        codeEqOrNameLike: this.codeEqOrNameLike,
        page: 1,
        pageSize: 0
      }
      CircuitryService.searchData(searchData)
      .then((res) => {
        this.getAllScheme = res.records;
        this.getAllGrpByPickId(this.getAllScheme);
      }).catch((err) => {
        this.$message.error("请求失败" + err.message)
      })
   },
   getAllPickOrder() {
     const postData = {
       storeCodeEqOrNameLk: this.codeEqOrNameLike || null
     }
     CircuitryService.getAllPickOrder(postData)
      .then((res) => {
        this.getAllGrpByPickId(res);
      }).catch((err) => {
        this.$message.error("请求失败" + err.message)
      })
   },
   // 获取指定方案顺序下的门店组
   getAllGrpByPickId(schemeArr) {
     // schemeArr是所有方案的信息
        if (schemeArr.length <= 0) return false;
        this.storeAllSchemeAll = [];
        schemeArr.forEach((ele, idx) => {
          CircuitryService.getAllGrpByPickId(ele.id)
          .then((res) => {
            // 这里是所有的门店组的信息
            this.storeAllSchemeAll.push({schemeList: ele, store: res});
            // console.log(this.storeAllSchemeAll[0].schemeList);
            // this.editProjectsInfo = this.storeAllSchemeAll[0].schemeList;
          }).catch((err) => {
            this.$message.error("请求所有的方案失败" + err.message)
          })
          if (idx === 0) {
            // if (this.headerSchemeOneFlag !== 0) return false; 
            this.getById(ele.id);
            this.headerScheme = "[" + ele.code + "]" + ele.name;
            // this.headerSchemeOneFlag = 1;
          }
        })
   },
   // 获取门店组下面所有的所有的门店
   getAllStoreByGrpId(id) {
      CircuitryService.getAllStoreByGrpId(id)
      .then((res) => {
          const storeOptionArr = res;
          storeOptionArr.forEach((ele, idx) => {
              ele.idx = idx + 1;
              this.storeOption.push(ele);
          })
        this.storeOption = storeOptionArr;
      }).catch((err) => {
        this.$message.error("请求失败" + err.message)
      })
   },
   // 获取方案详情
   getById(id) {
      CircuitryService.getById(id)
      .then((res) => {
        this.getByIdDetail = res;
      }).catch((err) => {
        this.$message.error("方案详情获取失败" + err.message)
      })
   },
   getGrpById(id) {
      CircuitryService.getGrpById(id)
      .then((res) => {
        this.getGrpByIdDetail = res;
      }).catch((err) => {
        this.$message.error("详情获取失败" + err.message)
      })
   },
   editProjectsChange(obj) {
    this.editProjects = true;
    for (const k in obj) {
      this.editProjectsObj[k] = obj[k];
    }
   },
   deleteGroupChange(obj) {
     this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
            CircuitryService.deleteGroupItem(obj)
            .then((res) => {
              this.$message.success("删除成功");
              this.getAllPickOrder();
            }).catch((err) => {
              this.$message.error("删除失败" + err.message)
            })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
   },
   deleteProjectsChange(obj) {
     this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
            CircuitryService.deleteSchemeItem(obj)
            .then((res) => {
              this.$message.success("删除成功");
              this.getAllPickOrder();
            }).catch((err) => {
              this.$message.error("删除失败" + err.message)
            })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
   },
   submitEditPro() {
      this.editProjects = false;
      this.editProjectsInfo = this.editProjectsObj;
      console.log(this.editProjectsInfo);
      CircuitryService.updateScheme(this.editProjectsInfo)
      .then((res) => {
        this.$message.success("修改成功");
        this.getAllPickOrder();
      }).catch((err) => {
        this.$message.error("失败" + err.message)
      })
   },
   newStoreChange() {
      this.newStore = true;
   },
   submintNewStoreInfo() {
     this.$refs.ruleForm.validate((valid) => {
          if (valid) {
            this.newStoreInfo.pickorderId = this.getByIdDetail.id;
            this.newStoreInfo.status = this.getByIdDetail.status;
            CircuitryService.createGrp(this.newStoreInfo)
            .then((res) => {
              this.$message.success("创建成功");
              this.getByIdDetail = {
                code: "",
                name: "",
                remark: ""
              }
              this.getAllPickOrder();
              this.newStore = false;
            }).catch((err) => {
              this.$message.error("创建失败" + err.message)
            })
          }
        });
   },
    editStoreChange(obj, schemeOpt, index) {
    this.editStore = true;
    for (const k in obj) {
      this.editStoreObj[k] = obj[k];
    }
    // this.editStoreInfo = obj;
    this.editStoreObj.getByIdMes = '[' + schemeOpt.schemeList.code + ']' + schemeOpt.schemeList.name;
    this.editStoreObj.totalNum = schemeOpt.store.length;
    this.editStoreObj.index = index + 1;
    this.editStoreObj.afterNum = index + 1;
    this.afterNum = index + 1;
   },
   submitEditStoreChange() {
     this.editStore = false;
     this.editStoreInfo = this.editStoreObj;
     CircuitryService.updateGrpScheme(this.editStoreInfo)
      .then((res) => {
        this.$message.success("修改成功");
        this.editStoreInfo = {};
        this.getAllPickOrder();
      }).catch((err) => {
        this.$message.error("失败" + err.message)
      })
   },
   schemeOrStore(item, obj, schemeOpt) {
     this.changeActive = item;
     // 存储方案的字段
     this.editProjectsInfo = schemeOpt;
     this.storeArmy = obj;
     console.log(schemeOpt.schemeList.dcId);
     if (item === 'scheme') {
        this.getById(obj.id);
        this.headerScheme = "[" + obj.code + "]" + obj.name;
     } else {
        this.getAllStoreByGrpId(obj.id);
        this.headerStore = "[" + obj.code + "]" + obj.name;
     }
   },
    sequencingProgramme(obj) {
      this.dialogFormVisible = true;
      // "createTime": "string",
      // "creatorId": "string",
      // "creatorName": "string",
      // "dcCode": "string",
      // "dcId": "string",
      // "dcName": "string",
      // "grpId": "string",
      // "id": "string",
      // "orgId": "string",
      // "pickOrderId": "string",
      // "remark": "string",
      // "status": "ON",
      // "storeCode": "string",
      // "storeId": "string",
      // "storeName": "string",
      // "storeOrder": 0,
      // "updateTime": "string",
      // "updatorId": "string",
      // "updatorName": "string",
      // "version": "string"
      this.adjustOrderFlag = obj;
      this.storeMesAll = {
        adjustOrder: obj.storeOrder,
        grpId: obj.grpId,
        id: obj.id,
        pickorderId: obj.pickorderId,
        remark: obj.remark,
        status: obj.status,
        storeCode: obj.storeCode,
        storeName: obj.storeName,
        storeOrder: obj.storeOrder,
        version: obj.version,
        getByIdMesName: '[' + this.editProjectsInfo.schemeList.code + ']' + this.editProjectsInfo.schemeList.name,
        getGrpByIdMesName: '[' + this.storeArmy.code + ']' + this.storeArmy.name,
        mylength: this.storeOption.length,
        curIdx: obj.storeOrder
      }
   },
   Cancellation() {
    this.dialogFormVisible = false;
    this.adjustOrderFlag.adjustOrder = this.storeMesAll.adjustOrder;
    CircuitryService.adjustOrder(this.adjustOrderFlag)
    .then((res) => {
     this.schemeOrStore(this.changeActive, this.storeArmy, this.editProjectsInfo)
      this.$message.success("调序成功");
    }).catch((err) => {
      this.$message.error("调序失败" + err.message)
    });
  },
   deleteItem(obj) {
     this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          CircuitryService.deleteItem(obj.id, obj.version)
          .then((res) => {
            this.$message.success("删除成功");
            this.schemeOrStore(this.changeActive, this.storeArmy, this.editProjectsInfo)
          }).catch((err) => {
            this.$message.error("删除失败" + err.message)
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
   },
    handleSizeChangeOne(e) {
        this.mySelfPageSize = Number(e)
        this.mySelfPage = 1
        this.storedContentChange()
    },
    handleCurrentChangeOne(e) {
      this.mySelfPage = Number(e);
      this.storedContentChange()
    },
    handleSelectionChange(val) {
        this.leftSelect = val;
    },
    searchDataLeftChange() {
      this.storedContentChange();
    },
    storedContentChange() {
        this.storedContent = [];
        const mySelfData = {
          nameOrCodeLike: this.nameOrCodeLike,
          dcId: this.editProjectsInfo.schemeList.dcId,
          page: this.mySelfPage,
          pageSize: this.mySelfPageSize,
          searchCount: true
        }
        CircuitryService.getFrontByDcId(mySelfData)
        .then((res) => {
          this.storedContent = res.records;
          this.storedContentTotalCount = res.totalCount;
        }).catch((err) => {
          this.$message.error("获取信息失败" + err.message);
        })
    },
    establishChange() {
      this.establish = true;
      this.storedContentChange();
    },
    getRowKeys(row) {
      return row.id
    },
    leftHandleComfirm() {
      this.establish = false;
      const postData = [];
      this.leftSelect.forEach((ele, idx) => {
        postData.push({
          pickorderId: this.editProjectsInfo.schemeList.id,
          grpId: this.storeArmy.id,
          storeCode: ele.code,
          storeName: ele.name,
          storeId: ele.id,
          storeOrder: idx + 1 + this.storeOption.length
        })
      })
      const postDataObj = {
        createGrpItemDTOs: postData,
        grpId: this.storeArmy.id
      }
      CircuitryService.addGrpItems(postDataObj)
      .then((res) => {
        // console.log(this.changeActive, this.storeArmy, this.editProjectsInfo);
        this.$message.success("添加成功");
        this.schemeOrStore(this.changeActive, this.storeArmy, this.editProjectsInfo)
      }).catch((err) => {
        this.$message.error("添加失败" + err.message)
      })
      // const lenthRecodes = this.storageList.length;
      // if (this.storageList.length > 0) { 
      //   this.storageList.push(...this.leftSelect)
      //   const newobj = {}; 
      //   this.storageList = this.storageList.reduce((preVal, curVal) => {
      //     newobj[curVal.id] ? '' : newobj[curVal.id] = preVal.push(curVal); 
      //     return preVal 
      //   }, [])
      // } else {
      //   this.leftSelect.forEach((ele, idx) => {
      //     this.storageList.push({id: ele.id, storageId: ele.id, name: ele.name, orderNumber: lenthRecodes + idx + 1, code: ele.code, version: ele.version});
      //   })
      // }
      this.$refs.multipleTable.clearSelection();
    }
  },
  created() {
    this.getAllPickOrder();
  },
  filters: {
    statusType(status) {
      switch (status) {
        case "ON":
          return "启用"
        case "OFF":
          return "禁用"
      }
    }
  },
  components: {
    "system-log": systemLog
  }
};
</script>

<style lang="scss" scoped>
@import "src/styles/mixin.scss";
._table-index .el-table .cell{
  padding:  7px 0 !important;
}
._table-index {
  .seriation-left-header {
    display: flex;
    justify-content: space-between;
    margin-bottom: 15px;
  }
  .sequential-programme {
    width: 230px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .operation-button{
      display: flex;
    }
  }
  .store-content {
    >div {
      padding-top: 20px;
    }
  }
  .store-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .content-operation {
    padding-left: 20px;
    padding-right: 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .content-operation:hover {
    color: #409EFF;
    background-color: #ecf5ff !important;
    font-weight: bold;
  }
  // .seriation-left-title {
  //   padding: 9px 15px;
  // }
  // /deep/ .el-collapse-item__header {
  //   padding-left: 30px;
  // }
  /deep/ .el-collapse-item__header:hover {
    color: #409EFF;
    background-color: #ecf5ff !important;
    font-weight: bold;
  }
}
.head{
    background: #fff;
    padding: 15px 12px;
    border-radius: 12px;
    border: 1px #eee solid;
    display: flex;
    justify-content: space-between;
}
.head-title{
    display: flex;
    justify-content: left;
}
.info-content{
    background: #fff;
    border-radius: 12px;
    padding: 15px 12px;
}
.info-box{
    margin: 4px 0;
    font-size: 12px;
    display: flex;
    justify-content: left;
}
.info-title{
    margin: 12px 0;
}
/deep/ .el-input__prefix {
    width: 30px;
    left: calc(100% - 30px);
}
/deep/ .el-input--prefix .el-input__inner {
  padding-left: 20px;
}
.shuttle-box {
  margin-top: -10vh !important;
  /deep/ .el-dialog {
    min-width: 670px;
    width: 70%;
  }
  /deep/ .el-table .cell {
    padding: 7px 0;
  }
  .shuttle {
    width: 100%;
    height: 510px;
    display: flex;
    justify-content: space-between;
    border: 1px solid #eee;
    border-radius: 10px;
    .shuttle-left {
      border-radius: 10px;
      // width: 250px;
      flex: 1;
      .shuttle-left-header {
        text-align: left;
        padding: 10px 20px 10px 20px;
        border-bottom: 1px solid #eee;
        margin-bottom: 10px;
      }
    }
    .shuttle-center {
      margin : 0 10px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
    }
    .shuttle-right {
      border-radius: 10px;
      .shuttle-right-header {
        text-align: left;
        padding: 10px 20px 10px 20px;
        border-bottom: 1px solid #eee;
        margin-bottom: 10px;
      }
      // width: 250px;
      flex: 1;
    }
    /deep/ .block {
      margin-top: 10px;
    }
    /deep/ .el-input__prefix {
      width: 30px;
      left: calc(100% - 30px);
    }
    /deep/ .el-input--prefix .el-input__inner {
      padding-left: 20px;
    }
  }
}
</style>
<style lang="scss">
.table-index{
@import "src/styles/mixin.scss";
@include elTable;
}
</style>
