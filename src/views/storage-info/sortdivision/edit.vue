<template>
    <div>
        <div class="head" v-if="status === 'edit'">
            <div style="margin-top:8px" v-if="status === 'create'">编辑拣货分区</div>
            <div style="margin-top:8px" v-else>编辑</div>
            <div>
                <el-button @click="back">取消</el-button>
                <el-button type="primary" @click="createSuppliers">确认</el-button>
                <!-- <el-button type="primary" v-if="status === 'create'">确认并创建</el-button> -->
            </div>
        </div>
        <div class="head" v-if="status === 'read'">
            <div class="head-title">
                <div style="margin:8px">{{ '[' + suppliersInfo.code + ']' + suppliersInfo.name }}</div>
            </div>
            <div>
                <el-button @click="back">返回</el-button>
                <el-button type="primary" @click="editSupplier">编辑</el-button>
            </div>
        </div>
        <div style="height:20px" />


        <div class="info-content" v-if="status === 'create' || status === 'edit'">
            <div>
                <template>
                    <el-tabs v-model="tabActiveName">
                        <el-tab-pane label="拣货分区" name="suppliers">
                            <div class="info-title">基本信息</div>
                             <el-form :model="form" :rules="createRules" ref="form" label-width="100px" class="demo-ruleForm">
                                <el-row :gutter="20">
                                    <el-col :span="6" class="info-box">
                                        <el-form-item label="代码" prop="code">
                                            <el-input v-model="form.code" maxlength="32"></el-input>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="6" class="info-box">
                                        <el-form-item label="名称" prop="name">
                                            <el-input v-model="form.name" maxlength="32"></el-input>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="6" class="info-box">
                                        <el-form-item label="货位范围" prop="binScope">
                                            <el-input v-model="form.binScope" maxlength="64"></el-input>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                            </el-form>
                        </el-tab-pane>
                    </el-tabs>
                </template>
            </div>
        </div>
        <div class="info-content" v-if="status === 'read'">
            <div>
                <template>
                    <el-tabs v-model="tabActiveName">
                        <el-tab-pane label="拣货分区" name="suppliers">
                            <div class="info-title">基本信息</div>
                            <el-col :span="6" class="info-box">
                                <div>代码:</div>
                                <div>{{ suppliersInfo.code }}</div>
                            </el-col>
                            <el-col :span="6" class="info-box">
                                <div>名称:</div>
                                <div>{{ suppliersInfo.name }}</div>
                            </el-col>
                            <el-col :span="6" class="info-box">
                                <div>货位范围:</div>
                                <div>{{ suppliersInfo.binScope }}</div>
                            </el-col>
                        </el-tab-pane>
                        <el-pagination
                          style="float:right"
                          @size-change="handleSizeChange"
                          @current-change="handleCurrentChange"
                          :current-page="1"
                          :page-sizes="[10, 20, 30, 50]"
                          :page-size="pageSize"
                          layout="total, sizes, prev, pager, next, jumper"
                          :total="totalCount">
                        </el-pagination>
                    </el-tabs>
                    <el-tabs v-model="tabActiveName">
                      <el-tab-pane label="操作日志" name="suppliers">
                          <el-col :span="6" class="info-box">
                                <div>操作时间:</div>
                                <div>{{ suppliersInfo.code }}</div>
                            </el-col>
                            <el-col :span="6" class="info-box">
                                <div>操作人:</div>
                                <div>{{ suppliersInfo.name }}</div>
                            </el-col>
                            <el-col :span="6" class="info-box">
                                <div>事件:</div>
                                <div>{{ suppliersInfo.binScope }}</div>
                            </el-col>
                            <el-col :span="6" class="info-box">
                                <div>详情:</div>
                                <div>{{ suppliersInfo.binScope }}</div>
                            </el-col>
                      </el-tab-pane>
                      <el-pagination
                          style="float:right"
                          @size-change="handleSizeChange"
                          @current-change="handleCurrentChange"
                          :current-page="1"
                          :page-sizes="[10, 20, 30, 50]"
                          :page-size="pageSize"
                          layout="total, sizes, prev, pager, next, jumper"
                          :total="totalCount">
                      </el-pagination>
                    </el-tabs>
                </template>
            </div>
        </div>
        <!-- 下面是添加存储分区的顺序页面 -->
        <div style="height:20px;background:#fff" />
        <div style="background:#fff" class="table-index">
          <el-row>
             <el-button style="margin:18px 10px" type="primary" size="mini" @click="establish = true"><span class="iconfont iconplus-fill" style="font-size:12px;"></span> 新建</el-button>
          </el-row>
          <el-table
              :data="storageList"
              style="width: 100%;text-align:center"
          >
            <el-table-column prop="name" label="存储分区">
                <template slot-scope="scope">
                     <span style="color:#409EFF">{{ scope.row.name }}</span>
                </template>
            </el-table-column>
            <el-table-column prop="orderNumber" label="顺序">
                <template slot-scope="scope">
                    {{ scope.row.orderNumber}}
                </template>
            </el-table-column>
            <el-table-column label="操作" width="200">
                <template slot-scope="scope">
                  <el-button
                    size="mini"
                    type="text"
                    @click="
                     dialogFormVisible = true
                    "
                    class="setting-up-procedure"
                    >调序</el-button
                  >
                  <el-button
                    size="mini"
                    type="text"
                    @click="
                      statusChange(scope.row.status, scope.row.id, scope.row.version)
                    "
                    >删除</el-button
                  >
                </template>
            </el-table-column>
          </el-table>
          <!-- 下面这个是翻页 -->
          <el-pagination
              style="float:right"
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="1"
              :page-sizes="[10, 20, 30, 50]"
              :page-size="pageSize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="totalCount">
          </el-pagination>
        </div>
        <!-- 添加存储分区 -->
         <el-dialog title="添加存储分区" :visible.sync="establish">
            <div style="text-align: center">
              <el-transfer
                style="text-align: left; display: inline-block; height : 400px;"
                v-model="value"
                filterable
                :left-default-checked="[2, 3]"
                :right-default-checked="[1]"
                :render-content="renderFunc"
                :titles="['存储分区', '存储分区']"
                :format="{
                  noChecked: '${total}',
                  hasChecked: '${checked}/${total}'
                }"
                @change="handleChange"
                :data="data">
                <el-pagination
                :small="true"
                slot="left-footer"
                layout="prev, pager, next"
                :total="1000">
                </el-pagination>
                <el-pagination
                :small="true"
                slot="right-footer"
                layout="prev, pager, next"
                :total="1000">
                </el-pagination>
                <!-- <el-button class="transfer-footer" slot="left-footer" size="small">操作</el-button> -->
                <!-- <el-button class="transfer-footer" slot="right-footer" size="small">操作</el-button> -->
              </el-transfer>
            </div>
            <div slot="footer" class="dialog-footer">
              <el-button @click="establish = fasle;">取 消</el-button>
              <el-button type="primary" @click="establish = fasle;">确 定</el-button>
            </div>
        </el-dialog>
        <el-dialog title="存储方案调序" :visible.sync="dialogFormVisible">
          <el-form :model="form">
            <el-form-item label="存储方案:" :label-width="formLabelWidth">
              {{'[' + numberPop.code + ']' + numberPop.name}}
            </el-form-item>
            <el-form-item label="存储方案数量:" :label-width="formLabelWidth">
              {{numberPop.totality}}
            </el-form-item>
            <el-form-item label="当前序号:" :label-width="formLabelWidth">
              {{numberPop.curNum}}
            </el-form-item>
            <el-form-item label="调整序号:" :label-width="formLabelWidth">
               <el-input-number size="mini" v-model="numberPop.afterNum" :max="numberPop.totality" :min="1"></el-input-number>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisible = fasle;">取 消</el-button>
            <el-button type="primary" @click="Cancellation">确 定</el-button>
          </div>
        </el-dialog>
    </div>
</template>

<script>
// import { mapGetters } from "vuex";
import SortdivisionService from "@/api/service/SortdivisionService";

export default {
  data() {
      return {
        dialogFormVisible: false,
        establish: false,
        // 弹出页面的存储
        popShow: false,
        popstorgeList: [],
        popstorge: {
          checkedOne: false,
          checkedTwo: false,
          pageSize: 10,
          totalCount: 0,
          searchOne: "",
          searchTwo: ""
        },
        // 存储分区页面的展示 开始
        storageList: [
          {
            code: "999",
            name: "天心区域",
            orderNumber: 1,
            storageId: "111"
          }
        ],
        // 调序的弹出框
        numberPop: {
          code: "999",
          name: "天心区域",
          orderNumber: 0,
          storageId: "111",
          totality: 2,
          curNum: 1,
          afterNum: 1
        },
        // 存储分区页面的展示 结束
        status: '', // 页面状态
        id: '', 
        materials: [],
        form: {
          code: '',
          name: '',
          remark: '',
          binScope: ''
        },
        suppliersInfo: {}, 
        createRules: {
          code: [
            { required: true, message: '请输入代码', trigger: 'blur' }
          ],
          name: [
            { required: true, message: '请输入拣货分区名称', trigger: 'blur' }
          ],
          binScope: [
            { required: true, message: '请填写货位范围', trigger: 'blur' }
          ]
        }
      }
    },
    computed: {

    },
    methods: {
      // 计数区域的修改
      Cancellation(idx) {
        this.numberPop.curNum = this.numberPop.afterNum;
        this.dialogFormVisible = false;
      },
      levelChange() {
        console.log(this.form)
      },
      back: function() {
        this.$router.go(-1)
      },
      statusChange: function() {
        // 这个地方是已经点击了之后传过来的值,本来是打开的,点击之后已经成了false传递到这里,所以应该执行关闭键
        // 当状态为关闭的时候,点击的时候应该是让它打开
        if (!this.suppliersInfo.status) {
          // 修改状态,将id传过去就可以
          SortdivisionService.closeSuppliers(this.id)      
          .then((res) => {
            this.getSuppliers(this.id)    
          })
          .catch((err) => {
            this.$message.error("禁用失败" + err)
            this.getSuppliers(this.id)
          })
        } else {
           SortdivisionService.openSuppliers(this.id)
            .then((res) => {
              this.getSuppliers(this.id)
            })
            .catch((err) => {
              this.$message.error("启用失败" + err)
              this.getSuppliers(this.id)
            })
        }
      },
      // 详情页面
      // 这个地方用来获取到之前那个页面传递过来的数据,也就是id和状态
      getQueryStatus: function() {
        this.status = this.$route.query.status
         console.log(this.id);
        if (this.status === 'read') {
          // 如果是编辑的话,还要将id传递过来
          this.id = this.$route.query.id;
          console.log(this.id);
          this.getSuppliers(this.id)
        }
      },
      // 渲染,下面这个也是修改禁用于开启的接口调用
      getSuppliers: function(id) {
        // 如果是只读的模式,就要调取后台的数据,将数据渲染到页面上
        SortdivisionService.getSuppliersDetail(id)
        .then((res) => {
          console.log(res);
          this.suppliersInfo = res
          // 根据状态修改供应商开启switch
          // 首先是根据数据去修改名字后面的两个按钮
          if (this.suppliersInfo.status === "OPEN") {
            this.suppliersInfo.status = true
          } else {
            this.suppliersInfo.status = false
          }
        })
        .catch((err) => {
          this.$message.error("获取详情失败" + err)
        })
      },
      // 创建拣货分区
      createSuppliers: function() {
        // 创建新的拣货分区的按钮
        this.$refs.form.validate(valid => {
          if (valid) {
            if (this.status === 'create') {
              // 创建新的拣货分区的按钮
              const reg = /^([1-9a-zA-Z]{1,64})$|^([1-9a-zA-Z]{1,64}[,]+[1-9a-zA-Z]{1,64})$|^([1-9a-zA-Z]{1,64}[-]+[1-9a-zA-Z]{1,64})$|^([1-9a-zA-Z]{1,64}[(]+[1-9]+\/[1-9]+[)]+)$/;
              console.log();
              if (!reg.test(this.form.binScope)) {
                this.$message.error("满足格式10、10(1/2)、10-20，多个以逗号隔开");
                return false;
              }
               
              SortdivisionService.createSuppliers(this.form)
              .then(res => {
                this.$message.success("创建成功")
                this.$router.go(-1)
              })
              .catch(err => {
                this.$message.error("创建失败" + err)
              })
            } else {
              console.log(this.form, this.form.status);
              // 因为提交的时候,需要传递状态值,所以先转换一下,这里是编辑
              if (this.form.status) {
                this.form.status = "OPEN"
              } else {
                this.form.status = "CLOSED"
              }
              SortdivisionService.updateSupplier(this.form)
              .then(res => {
                console.log(res)
                this.$message.success("更新成功")
                this.$router.go(-1)
              })
              .catch(err => {
                this.$message.error("更新失败" + err)
              })
            }
          } else {
            console.log(2)
          }
        })
      },
      // 详情页面跳转到编辑页面
      editSupplier() {
        this.status = "edit"
        // 这个form肯定就是编辑页面的数据,suppliersInfo是前一个页面传递过来的数据
        // 传递的是form是用户填写的数据
        console.log(this.status);
        this.form = Object.assign(this.form, this.suppliersInfo)
        console.log(this.form, this.suppliersInfo)
      },
      // 弹出界面的方法
      handleSizeChange() {

      },
      handleCurrentChange() {
        
      }
    },
    created() {
      this.getQueryStatus();
      const _this = this;
      SortdivisionService.getdcdata().then(function(res) {
        res.records.forEach(function(ele, idx) {
           _this.materials.push({
              name: ele.name,
              id: ele.id
           })
        })
      })
    },
    filters: {
    
    }
};
</script>

<style lang="scss" scoped>
@import "src/styles/mixin.scss";
.pop-up-pag {
  position: absolute;
  left: 50%;
  margin-top: -300px;
  transform: translateX(-50%);
  background-color: skyblue;
  width: 800px;
  // height: 600px;
  display: flex;
  justify-content: space-between;
  .right-popstorge,
  .left-popstorge {
    .count-tatle{
      padding: 10px;
      font-size: 12px;
    }
    .center-pag {
      padding: 0 10px;
    }
    .list-pop-ui {
      margin: 0;
      li {
        display: flex;
        align-items: center;
        padding: 20px;
        .content-checked-one {
          font-size: 12px;
        }
      }
    }
    border: #E4E7ED solid 1px;
    width: 350px;
    height: 600px;
  }
  .right-popstorge {
    margin-left: 20px;
  }
  .left-popstorge {
    margin-right: 20px;
  }
  ul {
    list-style: none;
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
// 弹出框
/deep/ .el-transfer-panel {
  height : 100% !important;
}
</style>
<style lang="scss">
.table-index{
@import "src/styles/mixin.scss";
@include elTable;
}
</style>
