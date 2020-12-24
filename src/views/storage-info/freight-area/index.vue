<template>
    <div class="table-index">
     <div class="block">
    <div class="select-head">
      <el-form ref="form" style="display: flex" :model="form" label-width="10px" label-position="right" >

        <el-form-item>
          <el-input placeholder="请输入内容" v-model="form.keyWord">
            <i slot="prefix" class="el-input__icon el-icon-search"></i>
          </el-input>
        </el-form-item>


        <el-form-item>
          <el-button type="primary" size="mini" @click="onSubmit" >立即搜索</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div style="height:16px"></div>
    <el-dropdown @command="createCommand" size="mini" :split-button="true" type="primary">
      <span>新建</span>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item command="area">新建货区</el-dropdown-item>
        <el-dropdown-item command="lane">新建货道</el-dropdown-item>
        <el-dropdown-item command="shelf">新建货架</el-dropdown-item>
        <el-dropdown-item command="space">新建货位</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
    <div style="height:16px"></div>

    <el-tree
      :data="treeData"
      node-key="id"
      lazy
      :props="props"
      accordion
      :load="loadNode">
      <span class="custom-tree-node" slot-scope="{ node, data }">
        <span>{{ node.label }}</span>
        <span class="tree-content">
          <div class="content-info">
            <div class="tree-box">
              代码:{{ data.code }}
            </div>
            <div class="tree-box">
              仓库:{{ data.name }}
            </div>
            <div class="tree-box" v-if="node.level === 1">
              名称:{{ data.name }}
            </div>
            <div class="tree-box" v-if="node.level === 4">
              货位类型{{ data.name }}
            </div>
            <div class="tree-box" v-if="node.level === 1">
              备注:{{ data.remark ? data.remark : '&lt;空&gt;'}}
            </div>
            <div class="tree-box" v-if="node.level === 4">
              货位用途
            </div>
          </div>
          <div>
            <el-button
              type="text"
              size="mini"
              v-if="node.level === 1 || node.level === 4"
              @click="() => append(data)">
              编辑
            </el-button>
            <el-button
              type="text"
              size="mini"
              @click="() => remove(node, data)">
              删除
            </el-button>
          </div>
        </span>
      </span>
    </el-tree>
    <!-- 新增货区 -->
      <el-dialog width="40%" title="新增货区" :visible.sync="dialogFormArea">
        <el-form :model="formArea" ref="formArea" :rules="areaRules">
          <el-form-item label="代码" :label-width="formLabelWidth" prop="code">
            <el-input v-model="formArea.code" placeholder="请输入代码" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="名称" :label-width="formLabelWidth" prop="name">
            <el-input v-model="formArea.name" placeholder="请输入名称" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="所属仓库" :label-width="formLabelWidth" prop="wrhId">
            <el-select v-model="formArea.wrhId" placeholder="请选择所属仓库">
              <el-option v-for="item in wrhList" :key="item.id" :label="item.name" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="备注" :label-width="formLabelWidth">
            <textarea v-model="formArea.remark"></textarea>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="cancelDialog">取 消</el-button>
          <el-button type="primary" @click="subDialog">确 定</el-button>
        </div>
      </el-dialog>


    <!-- 新增货道 -->
      <el-dialog width="40%" title="新增货道" :visible.sync="dialogFormLane">
        <el-form :model="formLane" :rules="laneRules" ref="formLane">
          <el-form-item label="起始货区" :label-width="formLabelWidth" prop="statrAreaAndEnd">
            <el-input v-model="formLane.startZoneCode" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="截止货区" :label-width="formLabelWidth" prop="statrAreaAndEnd">
            <el-input v-model="formLane.endZoneCode" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="起始货道" :label-width="formLabelWidth" prop="startLane">
            <el-input v-model="formLane.startPath" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="平均货道数" :label-width="formLabelWidth" prop="averageLane">
            <el-input v-model="formLane.size" autocomplete="off"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="cancelDialog">取 消</el-button>
          <el-button type="primary" @click="subDialog">确 定</el-button>
        </div>
      </el-dialog>


    <!-- 新增货架 -->
      <el-dialog width="40%" title="新增货架" :visible.sync="dialogFormShelf">
        <el-form :model="formShelf" :rules="shelfRules" ref="formShelf">
          <el-form-item label="起始货道" :label-width="formLabelWidth" prop="statrLaneAndEnd">
            <el-input v-model="formLane.startPathCode" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="截止货道" :label-width="formLabelWidth" prop="statrLaneAndEnd">
            <el-input v-model="formLane.endPathCode" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="起始货架" :label-width="formLabelWidth" prop="startShelf">
            <el-input v-model="formLane.startShelf" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="平均货道数" :label-width="formLabelWidth" prop="averageShelf">
            <el-input v-model="formLane.szie" autocomplete="off"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="cancelDialog">取 消</el-button>
          <el-button type="primary" @click="subDialog">确 定</el-button>
        </div>
      </el-dialog>


    <!-- 新增货位 -->
      <el-dialog width="40%" title="新增货位" :visible.sync="dialogFormSpace">
        <el-form :model="formSpace" ref="formSpace" :rules="spaceRules">
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="货架范围" :label-width="formLabelWidth" prop="statrShelfAndEnd">
                <el-input v-model="formSpace.startShelfCode" autocomplete="off"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="7">
            <el-form-item label="" prop="statrShelfAndEnd">
              <el-input v-model="formSpace.endShelfCode" autocomplete="off"></el-input>
            </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="列码范围" :label-width="formLabelWidth" prop="startAndEndRow">
                <el-input v-model="formSpace.startRowCode" autocomplete="off"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="7">
            <el-form-item label="" prop="startAndEndRow">
              <el-input v-model="formSpace.endRowCode" autocomplete="off"></el-input>
            </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="层码范围" :label-width="formLabelWidth" prop="startAndEndFloor">
                <el-input v-model="formSpace.startFloorCode" autocomplete="off"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="7">
            <el-form-item label="" prop="startAndEndFloor">
              <el-input v-model="formSpace.endFloorCode" autocomplete="off"></el-input>
            </el-form-item>
            </el-col>
          </el-row>
          
          <el-form-item label="货位用途" :label-width="formLabelWidth" prop="spaceUsage">
            <el-select v-model="formSpace.binusage" placeholder="请选择货位用途">
              <el-option v-for="item in binUsage" :key="item.value" :label="item.name" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="货位类型" :label-width="formLabelWidth" prop="spaceType">
            <el-select v-model="formSpace.bintypeId" placeholder="请选择货位类型">
              <el-option v-for="item in bintypeList" :key="item.id" :label="item.name" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
          
          <el-form-item label="备注" :label-width="formLabelWidth">
            <textarea v-model="formSpace.remark"></textarea>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="cancelDialog">取 消</el-button>
          <el-button type="primary" @click="subDialog">确 定</el-button>
        </div>
      </el-dialog>


  </div>
    </div>
</template>

<script>
// import BasicService from "@/api/service/BasicService";
import StorageService from "@/api/service/StorageService";
// import { mapGetters } from "vuex";

// let id = 1000;

  export default {
    data() {
      return {
        bintypeList: [], // 货位类型
        binUsage: [
          { name: "统配收货暂存位", value: "UNIFYRECEIVE" },
          { name: "上架中转位", value: "PUTAWAY" },
          { name: "拣货位", value: "PICK" },
          { name: "存储位", value: "STORAGE" },
          { name: "拣货存储位", value: "PICK_STORAGE" },
          { name: "统配拣货暂存位", value: "UNIFYPICK" },
          { name: "统配集货存储位", value: "UNIFYCOLLECT" },
          { name: "补货暂存位", value: "RPL" },
          { name: "中转收货暂存位", value: "TRANSFERRECEIVE" },
          { name: "中转集货暂存位", value: "TRANSFERCOLLECT" },
          { name: "直通收货暂存位", value: "DIRECTRECEIVE" },
          { name: "门店分拨位", value: "STORECROSSALLOCATE" },
          { name: "门店退货收货暂存位", value: "STORERTN" },
          { name: "供应商退货位", value: "VENDORRTN" },
          { name: "供应商集货位", value: "VENDORCOLLECT" }
        ], // 货位用途
        wrhList: [], // 仓库列表
        formLabelWidth: '120px',
        props: {
          label: 'name',
          children: [],
          isLeaf: 'leaf'
        },
        form: {
          // 搜索筛选
          keyWord: ''
        },
        formArea: {
          // 货区
          code: '',
          name: '',
          wrhId: '',
          remark: ''
        },
        areaRules: {
          code: [
            { required: true, pattern: /^[A-Z0-9]{0,2}$/, message: '请输入最多两位的数字和大写字母的组合(例:H1)', trigger: 'change' }
          ],
          name: [
            { required: true, max: 40, message: '请输入最多40位字符' }
          ],
          wrhId: [
            { required: true, message: '请选择所属仓库', trigger: 'blur' }
          ]
        },
        dialogFormArea: false,
        formLane: {
          // 货道
          startZoneCode: '', // 起始
          endZoneCode: '', // 截止
          size: '', // 平均货道数
          startPath: '' // 起始货道
        },
        laneRules: {
          statrAreaAndEnd: [
            { required: true, pattern: /^[A-Z0-9]{0,2}$/, message: '请输入最多两位的数字和大写字母的组合(例:H1)', trigger: 'change' }
          ],
          averageLane: [
            { required: true, pattern: /^([1-9]|[1-9]\\d|100)$/, message: '请输入1-100的整数', trigger: 'change' }
          ],
          startLane: [
            { required: true, max: 2, message: '最多输入两位数字', trigger: 'change' },
            { type: 'number', message: '只能输入数字', trigger: 'change' }
          ]
        },
        dialogFormLane: false,
        formShelf: {
          // 货架
          startPathCode: '',
          endPathCode: '',
          size: '',
          startShelf: ''
        },
        shelfRules: {
          statrLaneAndEnd: [
            { required: true, pattern: /^[A-Z0-9]{0,2}$/, message: '请输入最多两位的数字和大写字母的组合(例:H1)', trigger: 'change' }
          ],
          averageShelf: [
            { required: true, pattern: /^([1-9]|[1-9]\\d|100)$/, message: '请输入1-100的整数', trigger: 'change' }
          ],
          startShelf: [
            { required: true, max: 2, message: '最多输入两位数字', trigger: 'change' },
            { type: 'number', message: '只能输入数字', trigger: 'change' }
          ]
        },
        dialogFormShelf: false,
        formSpace: {
          // 货位
          startShelfCode: '', // 起始货架
          endShelfCode: '', // 截止货架
          startRowCode: '', // 起始列
          endRowCode: '', // 截止列
          startFloorCode: '', // 起始层
          endFloorCode: '', // 结束层
          binusage: '', // 货位用途
          bintypeId: '', // 货位类型
          remark: ''
        },
        spaceRules: {
          statrShelfAndEnd: [
            { required: true, pattern: /^[A-Z0-9]{6,6}$/, message: '请输入六位的数字和大写字母的组合(例:H1H1H1)', trigger: 'change' }
          ],
          startAndEndRow: [
            { required: true, pattern: /^[1-9]{1}$/, message: '请输入1-9的数字', trigger: 'change' }
          ],
          startAndEndFloor: [
            { required: true, pattern: /^[1-9]{1}$/, message: '请输入1-9的数字', trigger: 'change' }
          ],
          spaceType: [
            { required: true, message: '请选择货位类型', trigger: 'blur' }
          ],
          spaceUsage: [
            { required: true, message: '请选择货位用途', trigger: 'blur' }
          ]
        },
        dialogFormSpace: false,
        treeData: [] // 树结构
      }
    },
  computed: {
  },
  methods: {
    onSubmit: function() {

    },
    createCommand: function(command) {
      if (command === "area") {
        this.dialogFormArea = true
      } else if (command === "lane") {
        this.dialogFormLane = true
      } else if (command === "shelf") {
        this.dialogFormShelf = true
      } else if (command === "space") {
        this.dialogFormSpace = true
      }
    },
    cancelDialog: function() {
      if (this.dialogFormArea) {
        this.dialogFormArea = false
      } else if (this.dialogFormLane) {
        this.dialogFormLane = false
      } else if (this.dialogFormShelf) {
        this.dialogFormShelf = false
      } else if (this.dialogFormSpace) {
        this.dialogFormSpace = false
      }
    },
    subDialog: function() {
      if (this.dialogFormArea) {
        // this.dialogFormArea = false
        this.createArea()
      } else if (this.dialogFormLane) {
        this.dialogFormLane = false
      } else if (this.dialogFormShelf) {
        this.dialogFormShelf = false
      } else if (this.dialogFormSpace) {
        this.dialogFormSpace = false
      }
    },
    loadNode: function(node, resolve) {
      console.log(node)
      if (node.level === 1) {
      // 获取货道
      StorageService.getAllFreightLane()
      .then((res) => {
        node.children = res.records
        if (res.records.length === 0) {
          resolve()
        }
      })
      .catch((err) => {
        resolve()
      })
      }
    },
    getFreightArea: function() {
      // 查询所有分区
      const data = {
        codeOrNameLike: this.form.keyWord
      }
      StorageService.getAllFreightArea(data)
      .then((res) => {
        for (const item in res.records) {
          const obj = {
            label: '[' + res.records[item].code + ']' + res.records[item].name,
            code: res.records[item].code,
            name: res.records[item].name,
            wrhName: res.records[item].name,
            remark: res.records[item].remark
          }
          this.treeData.push(obj)
        }
      })
      .catch((err) => {
        this.$message.error('加载货区失败' + err.message)
      })
    },
    createArea: function() {
      // 新建货区
      this.$refs.formArea.validate(valid => {
        if (valid) {
          StorageService.createArea(this.formArea)
          .then((res) => {
            this.$message.success('新建货区成功')
            this.dialogFormArea = false
            this.formArea = {
              // 货区
              code: '',
              name: '',
              wrhId: '',
              remark: ''
            }
          })
          .catch((err) => {
            this.$message.error('新建货区失败' + err.message)
          })
        }
      })
    },
    createLane: function() {
      // 新建货道
      this.$refs.formLane.validate(valid => {
        if (valid) {
          StorageService.createLane(this.formLane)
          .then((res) => {
            this.$message.success('新建货道成功')
            this.dialogFormLane = false
            this.formLane = {
              // 货道
              startZoneCode: '', // 起始
              endZoneCode: '', // 截止
              size: '', // 平均货道数
              startPath: '' // 起始货道
            }
          })
          .catch((err) => {
            this.$message.error('新建货道失败' + err.message)
          })
        }
      })
    },
    createShelf: function() {
      // 新建货架
      this.$refs.formLane.validate(valid => {
        if (valid) {
          StorageService.createShelf(this.formLane)
          .then((res) => {
            this.$message.success('新建货架成功')
            this.dialogFormShelf = false
            this.formShelf = {
              // 货架
              startPathCode: '',
              endPathCode: '',
              size: '',
              startShelf: ''
            }
          })
          .catch((err) => {
            this.$message.error('新建货架失败' + err.message)
          })
        }
      })
    },
    createSpace: function() {
       // 新建货位
      this.$refs.formLane.validate(valid => {
        if (valid) {
          StorageService.createSpace(this.formLane)
          .then((res) => {
            this.$message.success('新建货位成功')
            this.dialogFormSpace = false
            this.formSpace = {
              // 货位
              startShelfCode: '', // 起始货架
              endShelfCode: '', // 截止货架
              startRowCode: '', // 起始列
              endRowCode: '', // 截止列
              startFloorCode: '', // 起始层
              endFloorCode: '', // 结束层
              binusage: '', // 货位用途
              bintypeId: '', // 货位类型
              remark: ''
            }
          })
          .catch((err) => {
            this.$message.error('新建货位失败' + err.message)
          })
        }
      })
    },
    getWrhQuery: function() {
      const data = {
        page: 1,
        pageSize: 0
      }
      StorageService.warehouseInit(data)
      .then((res) => {
        this.wrhList = res.records
      })
      .catch((err) => {
        this.$message('获取仓库列表失败' + err.message)
      })
    },
    getBinType: function() {
      const data = {
        page: 1,
        pageSize: 0
      }
      StorageService.getWmsBintypeQuery(data)
      .then((res) => {
        this.bintypeList = res.records
      })
      .catch((err) => {
        this.$message.error('获取货位类型失败' + err.message)
      })
    }
  },
  created() {
    this.getFreightArea()
    this.getWrhQuery()
    this.getBinType()
  },
  filters: {
  }
};
</script>

<style lang="scss" scoped>
@import "src/styles/mixin.scss";
.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
}
.select-head{
  background: #fff;
  padding: 15px 0 0px 0;
  border-radius: 12px;
  border: 1px #eee solid;
}
.tree-content{
  width: 70%;
  display: flex;
  justify-content: space-between;
}
.content-info{
  width: 80%;
  display: flex;
  justify-content: space-between;
}
.content-info .tree-box{
  width: 120px;
  margin-top: 6px;
}
</style>