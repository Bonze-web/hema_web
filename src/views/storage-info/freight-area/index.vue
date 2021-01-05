<template>
    <div class="table-index">
     <div class="block">
    <div class="select-head">
      <el-form ref="form" style="display: flex" :model="form" label-width="10px" label-position="right" >

        <el-form-item>
          <el-input placeholder="请输入货区/货道/货架/货位的编号" v-model="form.keyword">
            <i slot="prefix" class="el-input__icon el-icon-search"></i>
          </el-input>
        </el-form-item>


        <el-form-item>
          <el-button type="primary" size="mini" @click="onSubmit" >立即搜索</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div style="height:16px"></div>
    <el-dropdown @command="createCommand" size="mini" :split-button="true" v-if="hasPermission(PermIds.WMS_BIN_CREATE)" type="primary">
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
      ref="customTree"
      :props="props"
      :load="loadNode">
      <span class="custom-tree-node" slot-scope="{ node, data }">
        <span style="width: 200px;overflow: hidden;white-space: nowrap;text-overflow: ellipsis;">{{ node.label }}</span>
        <span class="tree-content">
          <div class="content-info">
            <div class="tree-box" v-if="node.level === 1">
              名称：{{ data.name }}
            </div>
            <div class="tree-box" v-if="node.level === 4" style="margin-right:48px;">
              货位类型：{{ data.bintypeName }}
            </div>
            <div class="tree-box" v-if="node.level === 1">
              备注：{{ data.remark ? data.remark : '&lt;空&gt;'}}
            </div>
            <div class="tree-box" v-if="node.level === 4">
              货位用途：{{ data.binusage | binUsage }}
            </div>
            <div class="tree-box" v-if="node.level === 4">
              状态：{{ data.status | binStatus }}
            </div>
            <!-- <div class="tree-box" v-if="node.level === 4">
              <el-select v-model="formEditSpace.binusage" placeholder="请选择货位用途">
                <el-option v-for="item in binUsage" :key="item.value" :label="item.name" :value="item.value"></el-option>
              </el-select>
            </div> -->
          </div>
          <div>
            <el-button
              type="text"
              size="mini"
              v-if="hasPermission(PermIds.WMS_BIN_UPDATE)"
              @click.stop="() => edit(node, data)">
              编辑
            </el-button>
            <el-button
              v-if="hasPermission(PermIds.WMS_BIN_DELETE)"
              type="text"
              size="mini"
              @click.stop="() => remove(node, data)">
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
              <el-option v-for="item in wrhList" :key="item.id" :label="'[' + item.code + ']' + item.name" :value="item.id"></el-option>
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
          <el-form-item label="起始货区" :label-width="formLabelWidth" prop="startZoneCode">
            <el-input v-model="formLane.startZoneCode" placeholder="请输入起始货区"></el-input>
          </el-form-item>
          <el-form-item label="截止货区" :label-width="formLabelWidth" prop="endZoneCode">
            <el-input v-model="formLane.endZoneCode" placeholder="请输入截止货区"></el-input>
          </el-form-item>
          <el-form-item label="起始货道" :label-width="formLabelWidth" prop="startPath">
            <el-input v-model="formLane.startPath" placeholder="请输入起始货道"></el-input>
          </el-form-item>
          <el-form-item label="平均货道数" :label-width="formLabelWidth" prop="size">
            <el-input v-model="formLane.size" placeholder="请输入平均货道数"></el-input>
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
          <el-form-item label="起始货道" :label-width="formLabelWidth" prop="startPathCode">
            <el-input v-model="formShelf.startPathCode" placeholder="请输入起始货道"></el-input>
          </el-form-item>
          <el-form-item label="截止货道" :label-width="formLabelWidth" prop="endPathCode">
            <el-input v-model="formShelf.endPathCode" placeholder="请输入截止货道"></el-input>
          </el-form-item>
          <el-form-item label="起始货架" :label-width="formLabelWidth" prop="startShelf">
            <el-input v-model="formShelf.startShelf" placeholder="请输入起始货架"></el-input>
          </el-form-item>
          <el-form-item label="平均货道数" :label-width="formLabelWidth" prop="size">
            <el-input v-model="formShelf.size" placeholder="请输入平均货道数"></el-input>
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
              <el-form-item label="货架范围" :label-width="formLabelWidth" prop="startShelfCode">
                <el-input v-model="formSpace.startShelfCode" placeholder="请输入起始货架" autocomplete="off"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="7">
            <el-form-item label="" prop="endShelfCode">
              <el-input v-model="formSpace.endShelfCode" placeholder="请输入截止货架" autocomplete="off"></el-input>
            </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="列码范围" :label-width="formLabelWidth" prop="startRowCode">
                <el-input v-model="formSpace.startRowCode" placeholder="请输入起始列" autocomplete="off"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="7">
            <el-form-item label="" prop="endRowCode">
              <el-input v-model="formSpace.endRowCode" placeholder="请输入截止列" autocomplete="off"></el-input>
            </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="层码范围" :label-width="formLabelWidth" prop="startFloorCode">
                <el-input v-model="formSpace.startFloorCode" placeholder="请输入起始层" autocomplete="off"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="7">
            <el-form-item label="" prop="endFloorCode">
              <el-input v-model="formSpace.endFloorCode" placeholder="请输入截止层" autocomplete="off"></el-input>
            </el-form-item>
            </el-col>
          </el-row>
          
          <el-form-item label="货位用途" :label-width="formLabelWidth" prop="binusage">
            <el-select v-model="formSpace.binusage" placeholder="请选择货位用途">
              <el-option v-for="item in binUsage" :key="item.value" :label="item.name" :value="item.value"></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="货位类型" :label-width="formLabelWidth" prop="bintypeId">
            <el-select v-model="formSpace.bintypeId" placeholder="请选择货位类型">
              <el-option v-for="item in bintypeList" :key="item.id" :label="item.name" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
          
          <el-form-item label="备注" :label-width="formLabelWidth">
            <textarea v-model="formSpace.remark"  placeholder="请输入备注"></textarea>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="cancelDialog">取 消</el-button>
          <el-button type="primary" @click="subDialog">确 定</el-button>
        </div>
      </el-dialog>


    <!-- 更新货区 -->
      <el-dialog width="40%" title="修改" :visible.sync="editFormSpace">
        <el-form :model="formEditSpace" ref="formArea" :rules="editRules">

          <!-- <el-form-item v-if="level === 4" label="货道" :label-width="formLabelWidth">
            {{ ShelfName }}
          </el-form-item> -->

          <el-form-item v-if="level === 1" label="名称" :label-width="formLabelWidth" prop="name">
            <el-input v-model="formEditSpace.name" placeholder="请输入名称" ></el-input>
          </el-form-item>

          <el-form-item label="货位类型" :label-width="formLabelWidth" prop="bintypeId">
            <el-select v-model="formEditSpace.bintypeId" placeholder="请选择货位类型">
              <el-option v-for="item in bintypeList" :key="item.id" :label="item.name" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
  
          <el-form-item label="货位用途" :label-width="formLabelWidth" prop="binusage">
            <el-select v-model="formEditSpace.binusage" placeholder="请选择货位用途">
              <el-option v-for="item in binUsage" :key="item.value" :label="item.name" :value="item.value"></el-option>
            </el-select>
          </el-form-item>

          <el-form-item v-if="level === 1" label="备注" :label-width="formLabelWidth">
            <el-input v-model="formEditSpace.remark" placeholder="请输入备注" ></el-input>
          </el-form-item>
          
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="cancelEdit">取 消</el-button>
          <el-button type="primary" @click="subEdit">确 定</el-button>  
        </div>
      </el-dialog>

    <!-- 更新货位 -->

  </div>
    </div>
</template>

<script>
// import BasicService from "@/api/service/BasicService";
import StorageService from "@/api/service/StorageService";
import { mapGetters } from "vuex";
import PermIds from "@/api/permissionIds";

// let id = 1000;

  export default {
    data() {
      return {
        maps: new Map(),
        level: '',
        PermIds: PermIds,
        treeDataId: '', // 保存树结构货位ID以便后期修改时改变页面数据
        ShelfName: '',
        formEditSpace: {
          name: '',
          remark: '',
          id: '',
          binusage: '',
          version: '',
          bintypeId: ''
        },
        editRules: {
          name: [
            { required: true, message: '请输入名称', trigger: 'blur'}
          ],
          binusage: [
            { required: true, message: '请输选择货位用途', trigger: 'blur'}
          ],
          bintypeId: [
            { required: true, message: '请输选择货位类型', trigger: 'blur'}
          ]
        },
        editFormSpace: false,
        bintypeList: [], // 货位类型
        binUsage: [
          { name: "统配收货暂存位", value: "UNIFYRECEIVE" },
          { name: "上架中转位", value: "PUTAWAY" },
          { name: "拣货位", value: "PICK" },
          { name: "存储位", value: "STORAGE" },
          { name: "拣货存储位", value: "PICKSTORAGE" },
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
          label: 'label',
          children: [],
          isLeaf: 'isLeaf'
        },
        form: {
          // 搜索筛选
          keyword: ''
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
          startZoneCode: [
            { required: true, pattern: /^[A-Z0-9]{0,2}$/, message: '请输入最多两位的数字和大写字母的组合(例:H1)', trigger: 'change' }
          ],
          endZoneCode: [
            { required: true, pattern: /^[A-Z0-9]{0,2}$/, message: '请输入最多两位的数字和大写字母的组合(例:H1)', trigger: 'change' }
          ],
          size: [
            { required: true, pattern: /^([1-9]|[1-9]{2,2}|100)$/, message: '请输入1-100的整数', trigger: 'change' }
          ],
          startPath: [
            { required: true, pattern: /^[A-Z0-9]{0,2}$/, message: '只能输入最多两位数字', trigger: 'change' }
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
          startPathCode: [
            { required: true, pattern: /^[A-Z0-9]{2,2}[0-9]{2,2}$/, message: '请输入四位的数字和大写字母的组合后两位必须是数字', trigger: 'change' }
          ],
          endPathCode: [
            { required: true, pattern: /^[A-Z0-9]{2,2}[0-9]{2,2}$/, message: '请输入四位的数字和大写字母的组合后两位必须是数字', trigger: 'change' }
          ],
          size: [
            { required: true, pattern: /^([1-9]|[1-9]{2,2}|100)$/, message: '请输入1-100的整数', trigger: 'change' }
          ],
          startShelf: [
            { required: true, pattern: /^[A-Z0-9]{0,2}$/, message: '只能输入最多两位数字', trigger: 'change' }
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
          startShelfCode: [
            { required: true, pattern: /^[A-Z0-9]{6,6}$/, message: '请输入六位数字与字母', trigger: 'change' }
          ],
          endShelfCode: [
            { required: true, pattern: /^[A-Z0-9]{6,6}$/, message: '请输入六位数字与字母', trigger: 'change' }
          ],
          startRowCode: [
            { required: true, pattern: /^[1-9]{1}$/, message: '请输入1-9的数字', trigger: 'change' }
          ],
          endRowCode: [
            { required: true, pattern: /^[1-9]{1}$/, message: '请输入1-9的数字', trigger: 'change' }
          ],
          startFloorCode: [
            { required: true, pattern: /^[1-9]{1}$/, message: '请输入1-9的数字', trigger: 'change' }
          ],
          endFloorCode: [
            { required: true, pattern: /^[1-9]{1}$/, message: '请输入1-9的数字', trigger: 'change' }
          ],
          bintypeId: [
            { required: true, message: '请选择货位类型', trigger: 'blur' }
          ],
          binusage: [
            { required: true, message: '请选择货位用途', trigger: 'blur' }
          ]
        },
        dialogFormSpace: false,
        treeData: [] // 树结构
      }
    },
  computed: {
    ...mapGetters(["hasPermission"])
  },
  methods: {
    onSubmit: function() {
      this.getFreightArea()
    },
    edit: function(node, data) {
      console.log(node)
      this.ShelfName = data.code.substring(0, 4)
      this.editFormSpace = true
      this.formEditSpace.id = data.id
      this.formEditSpace.version = data.version
      this.formEditSpace.bintypeId = data.bintypeId
      this.formEditSpace.binusage = data.binusage
      this.formEditSpace.name = data.name
      this.formEditSpace.remark = data.remark
      this.level = node.level
      this.treeDataId = node.id
    },
    cancelEdit: function() {
      this.editFormSpace = false
    },
    subEdit: function() {
      if (this.level === 1) {
        StorageService.updateArea(this.formEditSpace)
        .then((res) => {
          this.$message.success('修改成功')
          this.editFormSpace = false
          // this.treeData
          this.getFreightArea()
        })
        .catch((err) => {
          this.$message.error('修改失败' + err.message)
        })
      } else if (this.level === 2) {
        StorageService.updateLane(this.formEditSpace)
        .then((res) => {
          this.$message.success('修改成功')
          this.editFormSpace = false
          // this.treeData
          this.getFreightArea()
        })
        .catch((err) => {
          this.$message.error('修改失败' + err.message)
        })
      } else if (this.level === 3) {
        StorageService.updateShelf(this.formEditSpace)
        .then((res) => {
          this.$message.success('修改成功')
          this.editFormSpace = false
          // this.treeData
          this.getFreightArea()
        })
        .catch((err) => {
          this.$message.error('修改失败' + err.message)
        })
      } else if (this.level === 4) {
        StorageService.updateSpace(this.formEditSpace)
        .then((res) => {
          this.$message.success('修改成功')
          this.editFormSpace = false
          // this.treeData
          this.getFreightArea()
        })
        .catch((err) => {
          this.$message.error('修改失败' + err.message)
        })
      }
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
        // this.dialogFormLane = false
        this.createLane()
      } else if (this.dialogFormShelf) {
        // this.dialogFormShelf = false
        this.createShelf()
      } else if (this.dialogFormSpace) {
        // this.dialogFormSpace = false
        this.createSpace()
      }
    },
    loadNode: function(node, resolve) {
      console.log(node)
      // 点击树结构结点
      if (node.level === 1) {
      // 获取货道
        const data = {
          zoneIdEquals: node.key,
          keyword: this.form.keyword  
        }
        StorageService.getAllFreightLane(data)
        .then((res) => {
          node.children = res.records
          if (res.records.length === 0) {
            resolve([])
          } else {
            res.records.forEach((item) => {
              item.label = item.code
            })
            resolve(res.records)
          }
        })
        .catch((err) => {
          this.$message.error('加载失败' + err.message)
          resolve([])
        })
      } else if (node.level === 2) {
        // 获取货架
        const data = {
          pathIdEquals: node.key,
          keyword: this.form.keyword
        }
        StorageService.getAllFreightShelf(data)
        .then((res) => {
          node.children = res.records
          if (res.records.length === 0) {
            resolve([])
          } else {
            res.records.forEach((item) => {
              item.label = item.code
            })
            resolve(res.records)
          }
        })
        .catch((err) => {
          this.$message.error('加载失败' + err.message)
          resolve([])
        })
      } else if (node.level === 3) {
        // 获取货位
        const data = {
          shelfIdEquals: node.key,
          codeLike: this.form.keyword
        }
        StorageService.getAllFreightSpace(data)
        .then((res) => {
          node.children = res.records
          if (res.records.length === 0) {
            resolve([])
          } else {
            res.records.forEach((item) => {
              item.label = item.code
              item.isLeaf = true
            })
            resolve(res.records)
          }
        })
        .catch((err) => {
          this.$message.error('加载失败' + err.message)
          resolve([])
        })
      }
    },
    getFreightArea: function() {
      // 查询所有分区
      const data = {
        keyword: this.form.keyword
      }
      this.treeData = []
      StorageService.getAllFreightArea(data)
      .then((res) => {
        for (const item in res.records) {
          const obj = {
            id: res.records[item].id,
            label: '[' + res.records[item].code + ']' + res.records[item].name,
            code: res.records[item].code,
            name: res.records[item].name,
            wrhName: res.records[item].name,
            remark: res.records[item].remark,
            version: res.records[item].version
          }
          this.treeData.push(obj)
        }
      })
      .catch((err) => {
        this.$message.error('加载货区失败' + err.message)
      })
    },
    // 创建
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
            this.getFreightArea()
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
            this.getFreightArea()
          })
          .catch((err) => {
            this.$message.error('新建货道失败' + err.message)
          })
        }
      })
    },
    createShelf: function() {
      // 新建货架
      this.$refs.formShelf.validate(valid => {
        if (valid) {
          StorageService.createShelf(this.formShelf)
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
            this.getFreightArea()
          })
          .catch((err) => {
            this.$message.error('新建货架失败' + err.message)
          })
        }
      })
    },
    createSpace: function() {
       // 新建货位
      this.$refs.formSpace.validate(valid => {
        if (valid) {
          StorageService.createSpace(this.formSpace)
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
            this.getFreightArea()
          })
          .catch((err) => {
            this.$message.error('新建货位失败' + err.message)
          })
        }
      })
    },
    // 货区所有仓库
    getWrhQuery: function() {
      const data = {
        page: 1,
        pageSize: 0,
        statusEquals: 'ON'
      }
      StorageService.warehouseInit(data)
      .then((res) => {
        this.wrhList = res.records
      })
      .catch((err) => {
        this.$message('获取仓库列表失败' + err.message)
      })
    },
    // 货区货位类型
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
    },
    remove: function(node, data) {
      console.log(node, data)
      const _this = this
      _this.$confirm('此操作将进行删除, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          if (node.level === 1) {
            _this.removeArea(data, node)
          } else if (node.level === 2) {
            _this.removeLane(data, node)
          } else if (node.level === 3) {
            _this.removeShelf(data, node)
          } else if (node.level === 4) {
            _this.removeSpace(data, node)
          }         
        });
    },
    // 删除
    removeArea: function(data, node) {
      StorageService.removeArea(data.id, data.version)
      .then((res) => {
        this.$message.success('删除成功')
        this.$refs.customTree.remove(data)
      })
      .catch((err) => {
        this.$message.error('删除失败' + err.message)
      })
    },
    removeSpace: function(data, node) {
      StorageService.removeSpace(data.id, data.version)
      .then((res) => {
        this.$message.success('删除成功')
        this.$refs.customTree.remove(data)
      })
      .catch((err) => {
        this.$message.error('删除失败' + err.message)
      })
    },
    removeLane: function(data, node) {
      StorageService.removeLane(data.id, data.version)
      .then((res) => {
        this.$message.success('删除成功')
        this.$refs.customTree.remove(data)
      })
      .catch((err) => {
        this.$message.error('删除失败' + err.message)
      })
    },
    removeShelf: function(data, node) {
      StorageService.removeShelf(data.id, data.version)
      .then((res) => {
        this.$message.success('删除成功')
        this.$refs.customTree.remove(data)
      })
      .catch((err) => {
        this.$message.error('删除失败' + err.message)
      })
    }
  },
  created() {
    this.getFreightArea()
    this.getWrhQuery()
    this.getBinType()
  },
  filters: {
    binStatus(status) {
      switch (status) {
        case "FREE":
          return "空闲"
        case "LOCKED":
          return "锁定"
        case "STOP":
          return "异常"
        case "USING":
          return "使用中"
        case "DELETE":
          return "已删除"
        default:
          return "未知"
      }
    },
    binUsage(type) {
      switch (type) {
        case "UNIFYRECEIVE":
          return "统配收货暂存位"
        case "PUTAWAY":
          return "上架中转位"
        case "PICK":
          return "拣货位"
        case "STORAGE":
          return "存储位"
        case "PICKSTORAGE":
          return "拣货存储位"
        case "UNIFYPICK":
          return "统配拣货暂存位"
        case "UNIFYCOLLECT":
          return "统配集货存储位"
        case "RPL":
          return "补货暂存位"
        case "TRANSFERRECEIVE":
          return "中转收货暂存位"
        case "TRANSFERCOLLECT":
          return "中转集货暂存位"
        case "DIRECTRECEIVE":
          return "直通收货暂存位"
        case "STORECROSSALLOCATE":
          return "门店分拨位"
        case "STORERTN":
          return "门店退货收货暂存位"
        case "VENDORRTN":
          return "供应商退货位"
        case "VENDORCOLLECT":
          return "供应商集货位"
        default:
          return "未知"
      }
    }
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
  width: 200px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
</style>