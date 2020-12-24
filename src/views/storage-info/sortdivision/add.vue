<template>
    <div>
        <div class="head" v-if="status === 'create' || status === 'edit'">
            <div style="margin-top:8px" v-if="status === 'create'">新建拣货分区</div>
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
                        <el-tab-pane label="码头" name="suppliers">
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
                        <el-tab-pane label="码头" name="suppliers">
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
                    </el-tabs>
                </template>
            </div>
        </div>
        <!-- 下面是添加存储分区的顺序页面 -->
        <div style="height:20px;background:#fff" />
        <div style="background:#fff">
          <el-row>
             <el-button style="margin:18px 10px" type="primary" size="mini"><span class="iconfont iconplus-fill" style="font-size:12px;"></span> 新建</el-button>
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
                      statusChange(scope.row.status, scope.row.id, scope.row.version)
                    "
                    >启用</el-button
                  >
                  <el-button
                    size="mini"
                    type="text"
                    @click="
                      statusChange(scope.row.status, scope.row.id, scope.row.version)
                    "
                    >禁用</el-button
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
        <div class="pop-up-pag" v-show="popShow">
           <!-- 左边的按钮 -->
            <div class="right-popstorge">
              <div class="count-tatle">
                {{'1'}}/{{'625'}}项
              </div>
              <div class="center-pag">
                 <el-input
                  placeholder="请输入内容"
                  v-model="popstorge.searchOne">
                  <i slot="prefix" class="el-input__icon el-icon-search"></i>
                </el-input>
                <div>
                    <el-checkbox v-model="popstorge.checkedOne">存储分区</el-checkbox>
                </div>
                <ul class="list-pop-ui">
                  <li>
                    <el-checkbox v-model="popstorge.checkedOne"></el-checkbox>
                    <div class="content-checked-one">
                        狗蛋
                    </div>
                  </li>
                </ul>
              </div>
               <!-- 下面这个是翻页 -->
              <el-pagination
                  style="float:right"
                  @size-change="handleSizeChange"
                  @current-change="handleCurrentChange"
                  :current-page="1"
                  :page-size="pageSize"
                  layout="prev, pager, next"
                  :total="totalCount">
              </el-pagination>
            </div>
            <!-- 右边的按钮 -->
            <div class="left-popstorge">
              <div class="count-tatle">
                {{'1'}}/{{'625'}}项
              </div>
               <el-input
                  placeholder="请输入内容"
                  v-model="popstorge.searchTwo">
                  <i slot="prefix" class="el-input__icon el-icon-search"></i>
              </el-input>
              <div>
                 <el-checkbox v-model="popstorge.checkedTwo">存储分区</el-checkbox>
              </div>
              <ul>
                <li>
                  <div>
                      
                  </div>
                </li>
              </ul>
               <!-- 下面这个是翻页 -->
              <el-pagination
                  style="float:right"
                  @size-change="handleSizeChange"
                  @current-change="handleCurrentChange"
                  :current-page="1"
                  :page-size="pageSize"
                  layout="prev, pager, next"
                  :total="totalCount">
              </el-pagination>
            </div>
        </div>
    </div>
</template>

<script>
// import { mapGetters } from "vuex";
import SortdivisionService from "@/api/service/SortdivisionService";

export default {
  data() {
      return {
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
            name: "天心区域",
            orderNumber: 0,
            storageId: "111"
          }
        ],
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
            { required: true, message: '请输入码头名称', trigger: 'blur' }
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
      // 创建码头
      createSuppliers: function() {
        // 创建新的码头的按钮
        this.$refs.form.validate(valid => {
          if (valid) {
            if (this.status === 'create') {
              // 创建新的码头的按钮
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
// 弹出框
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

</style>
