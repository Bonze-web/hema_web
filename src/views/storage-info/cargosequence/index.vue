<template>
    <div class="table-index _table-index">   
        <el-container style="height: 500px; border: 1px solid #eee">
          <el-aside width="300px" style="background-color: #fff;padding: 0 20px;border: 1px #eee solid;">
            <div class="seriation-left-header" style="padding-top:20px;display:flex;align-items: center;">
              <div class="seriation-left-title">拣货顺序方案</div>
              <el-button type="primary" @click.stop="newProjectsChange">新建方案</el-button>
            </div>
            <el-input v-model="codeEqOrNameLike" placeholder="请输入门店代码/名称" @change="searchScheme"><i slot="prefix" class="el-input__icon el-icon-search" style="right:0" @click="searchScheme"></i></el-input>
            <el-collapse accordion style="margin-top:15px;">
              <el-collapse-item v-for="(ele, idx) in storeAllSchemeAll" :key="idx">
                <template slot="title">
                    <div class="sequential-programme" style="font-size:14px;">
                      <span class="el-icon-folder" style="display:flex;align-items: center;max-width: 120px;overflow:hidden;color:#409EFF;cursor: pointer;"><span style="padding-left:15px;" @click.stop="schemeOrStore('scheme', ele.schemeList, ele)">{{'[' + ele.schemeList.code + ']' + ele.schemeList.name}}</span></span> 
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
                            >删除</el-button
                          >
                      </div>
                    </div>
                </template>
                <div>
                  <div class="content-operation" v-for="(item, index) in ele.store" :key="index">
                      <span class="el-icon-sort" style="display:flex;align-items: center;max-width: 100px;overflow:hidden;color:#409EFF;cursor: pointer;"><span style="padding-left:15px;" @click.stop="schemeOrStore('store', item, ele)">{{'[' + item.code + ']' + item.name}}</span></span> 
                      <div class="operation-button">
                         <el-button
                            size="mini"
                            type="text"
                            @click.stop="editStoreChange(item, ele)"
                            >编辑</el-button
                          >
                          <el-button
                            size="mini"
                            type="text"
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
                      <el-button type="primary" @click="newStoreChange">添加门店组</el-button>
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
                                    <system-log :modular="'PICKAREA'"></system-log>
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
                        lable="拣货顺序"
                        :data="storeOption"
                        style="width: 100%;text-align:center"
                    >
                      <el-table-column label="序号">
                          <template slot-scope="scope">
                              {{ scope.row.idx}}
                          </template>
                      </el-table-column>
                      <el-table-column label="门店">
                          <template slot-scope="scope">
                              <span style="color:#409EFF">{{ "[" + scope.row.storeCode + "]" + scope.row.storeName}}</span>
                          </template>
                      </el-table-column>
                      <el-table-column label="拣货顺序">
                          <template slot-scope="scope">
                              {{ scope.row.storeOrder}}
                          </template>
                      </el-table-column>
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
            <el-button @click="newProjects = false">取 消</el-button>
            <el-button type="primary" @click="newProjectsFlag">确 定</el-button>
          </div>
        </el-dialog>
        <el-dialog title="拣货顺序方案" :visible.sync="editProjects">
          <el-form :model="editProjectsInfo">
            <el-form-item label="方案代码" :label-width="formLabelWidth">
              <el-input v-model="editProjectsInfo.code" autocomplete="off"></el-input>
            </el-form-item>
              <el-form-item label="方案名称" :label-width="formLabelWidth">
              <el-input v-model="editProjectsInfo.name" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="备注" :label-width="formLabelWidth">
              <el-input
                type="textarea"
                :autosize="{ minRows: 2, maxRows: 4}"
                placeholder="请输入内容"
                v-model="editProjectsInfo.remark">
              </el-input>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisible = false">取 消</el-button>
            <el-button type="primary" @click="submitEditPro">确 定</el-button>
          </div>
        </el-dialog>
        <el-dialog title="新建门店组" :visible.sync="newStore">
          <el-form :model="newStoreInfo" :rules="newStoreRules" ref="ruleForm">
            <el-form-item label="代码" :label-width="formLabelWidth" prop="code">
              <el-input v-model="newStoreInfo.code" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="名称" :label-width="formLabelWidth" prop="name">
              <el-input v-model="newStoreInfo.name" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="拣货顺序方案" :label-width="formLabelWidth">
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
            <el-button @click="setStoreInfo">取 消</el-button>
            <el-button type="primary" @click="submintNewStoreInfo">确 定</el-button>
          </div>
        </el-dialog>
        <el-dialog title="编辑门店组" :visible.sync="editStore">
          <el-form :model="editStoreInfo">
            <el-form-item label="代码" :label-width="formLabelWidth">
              <el-input v-model="editStoreInfo.code" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="名称" :label-width="formLabelWidth">
              <el-input v-model="editStoreInfo.name" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="拣货顺序方案" :label-width="formLabelWidth">
              <div>
                {{ editStoreInfo.getByIdMes }}
              </div>
            </el-form-item>
            <el-form-item label="备注" :label-width="formLabelWidth">
              <el-input
                type="textarea"
                :autosize="{ minRows: 2, maxRows: 4}"
                placeholder="请输入内容"
                v-model="editStoreInfo.remark">
              </el-input>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisible = false">取 消</el-button>
            <el-button type="primary" @click="submitEditStoreChange">确 定</el-button>
          </div>
        </el-dialog>
        <el-dialog title="门店调序" :visible.sync="dialogFormVisible">
          <el-form :model="storeMesAll">
            <el-form-item label="拣货顺序方案:" >
              {{storeMesAll.getByIdMesName}}
            </el-form-item>
            <el-form-item label="拣货顺序门店组:">
              {{storeMesAll.getGrpByIdMesName}}
            </el-form-item>
            <el-form-item label="门店:" >
              {{'[' + storeMesAll.storeCode + ']' + storeMesAll.storeName}}
            </el-form-item>
            <el-form-item label="门店数量:" >
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
         <el-dialog title="添加门店" :visible.sync="establish" style="margin-top: 7vh" class="shuttle-box">
            <div style="text-align: center; position: relative">
              <div class="shuttle">
                  <div class="shuttle-left">
                    <div class="shuttle-left-header">
                        {{leftSelect.length}}/{{storedContentTotalCount}} 项
                    </div>
                    <el-input v-model="mySelfcodeOrName" placeholder="请输入代码或名称" @change="searchDataLeftChange"><i slot="prefix" class="el-input__icon el-icon-search" style="right:0" @click="searchDataLeftChange"></i></el-input>
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
                          label="门店"
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
import CargosequenceService from "@/api/service/CargosequenceService";
import systemLog from "@/components/systemLog.vue"
export default {
  data() {
      return {
        headerSchemeOneFlag: 0,
        mySelfPage: 1,
        mySelfPageSize: 10,
        storedContent: [],
        mySelfcodeOrName: "",
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
          remark: ""
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
          remark: ""
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
    CargosequenceService.requestNewProjectsList(this.newProjectsList)
    .then((res) => {
      this.$message.success("新建成功");
      this.getAllPickOrder();
    }).catch((err) => {
      this.$message.error("新建失败" + err.message)
    })
   },
   setStoreInfo() {
     this.newStore = false;
   },
   // 通过搜索接口来所有方案
   searchScheme() {
      const searchData = {
        codeEqOrNameLike: this.codeEqOrNameLike,
        page: 1,
        pageSize: 0
      }
      CargosequenceService.searchData(searchData)
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
     CargosequenceService.getAllPickOrder(postData)
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
          CargosequenceService.getAllGrpByPickId(ele.id)
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
      CargosequenceService.getAllStoreByGrpId(id)
      .then((res) => {
        console.log(res);
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
      CargosequenceService.getById(id)
      .then((res) => {
        this.getByIdDetail = res;
      }).catch((err) => {
        this.$message.error("方案详情获取失败" + err.message)
      })
   },
   getGrpById(id) {
      CargosequenceService.getGrpById(id)
      .then((res) => {
        this.getGrpByIdDetail = res.data;
      }).catch((err) => {
        this.$message.error("方案详情获取失败" + err.message)
      })
   },
   editProjectsChange(obj) {
    this.editProjects = true;
    this.editProjectsInfo = obj;
   },
   submitEditPro() {
      this.editProjects = false;
      CargosequenceService.updateScheme(this.editProjectsInfo)
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
            CargosequenceService.createGrp(this.newStoreInfo)
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
    editStoreChange(obj, schemeOpt) {
    this.editStore = true;
    this.editStoreInfo = obj;
    this.editStoreInfo.getByIdMes = '[' + schemeOpt.schemeList.code + ']' + schemeOpt.schemeList.name;
   },
   submitEditStoreChange() {
     this.editStore = false;
     CargosequenceService.updateGrpScheme(this.editStoreInfo)
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
      this.storeMesAll = {
        adjustOrder: obj.idx,
        grpId: obj.grpId,
        id: obj.id,
        pickOrderId: obj.pickOrderId,
        remark: obj.remark,
        status: obj.status,
        storeCode: obj.storeCode,
        storeName: obj.storeName,
        storeOrder: obj.storeOrder,
        version: obj.version,
        getByIdMesName: '[' + this.editProjectsInfo.code + ']' + this.editProjectsInfo.name,
        getGrpByIdMesName: '[' + this.storeArmy.code + ']' + this.storeArmy.name,
        mylength: this.storeOption.length,
        curIdx: obj.idx
      }
   },
   Cancellation() {
    this.dialogFormVisible = false;
    this.postAdjustOrder(this.storeMesAll);
    this.getAllStoreByGrpId(this.storeMesAll.id);
   },
   deleteItem(obj) {
      CargosequenceService.deleteItem(obj.id, obj.version)
      .then((res) => {
        this.$message.success("删除成功");
        this.getAllStoreByGrpId(obj.id);
      }).catch((err) => {
        this.$message.error("删除失败" + err.message)
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
          codeEqOrNameLike: this.mySelfcodeOrName || null,
          page: this.mySelfPage,
          pageSize: this.mySelfPageSize,
          searchCount: true
        }
        CargosequenceService.queryItem(mySelfData)
        .then((res) => {
          this.storedContent = res.records;
          this.storedContentTotalCount = res.totalCount;
        }).catch((err) => {
          this.$message.error("获取信息失败" + err.message)
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
       CargosequenceService.addGrpItems(this.leftSelect)
        .then((res) => {
          this.$message.success("添加成功");
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
    padding-left: 40px;
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
  /deep/ .el-collapse-item__header {
    padding-left: 30px;
  }
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
