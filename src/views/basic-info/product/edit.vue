<template>
  <div class="product-edit">
    <div class="head" v-if="status === 'edit'">
      <div style="margin-top:8px">编辑</div>
      <div>
        <el-button @click="back">取消</el-button>
        <el-button type="primary" @click="updateProduct">确认</el-button>
      </div>
    </div>
    <div class="head" v-if="status === 'read'">
      <div class="head-title">
        <div style="margin:8px">{{ '[' + productInfo.code + ']' + productInfo.name }}</div>
        <!-- <template>
                    <el-switch
                        v-model="productInfo.status"
                        @change="statusChange"
                        active-color="#13ce66"
                        inactive-color="#eee">
                    </el-switch>
        </template>-->
        <template>
          <el-button type="text" @click="statusChange" v-if="productInfo.status === 'ON' && hasPermission(PermIds.PRODUCT_PRODUCT_ENABLE) && workingOrg.type === 'GROUP'">禁用</el-button>
          <el-button type="text" @click="statusChange" v-if="productInfo.status  === 'OFF' && hasPermission(PermIds.PRODUCT_PRODUCT_DISABLE) && workingOrg.type === 'GROUP'">启用</el-button>
        </template>
      </div>
      <div>
        <el-button @click="back">返回</el-button>
        <el-button type="primary" @click="clickEdit" v-if="hasPermission(PermIds.PRODUCT_PRODUCT_UPDATE) && workingOrg.type === 'GROUP'">编辑</el-button>
      </div>
    </div>
    <div style="height:20px" />
    <div class="info-content" v-if="status === 'edit'">
      <div>
        <el-tabs v-model="tabActiveName" @tab-click="tabClick">
          <el-tab-pane label="商品信息" name="product">
            <el-form :model="form" :rules="createRules" ref="form" label-width="100px" class="demo-ruleForm">
              <div class="info-title">基本信息</div>
              <el-row :gutter="20">
                <el-col :span="6" class="info-box">
                  <el-form-item label="代码" prop="code">
                    <span>{{form.code}}</span>
                  </el-form-item>
                </el-col>
                <el-col :span="6" class="info-box">
                  <el-form-item label="名称" prop="name">
                    <el-input v-model="form.name"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="6" class="info-box">
                  <el-form-item label="简称" prop="shortName">
                    <el-input v-model="form.shortName"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="6" class="info-box">
                  <el-form-item label="规格" prop="spec">
                    <el-input v-model="form.spec"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="6" class="info-box">
                  <el-form-item label="类别" prop="categoryCode">
                    <product-category-select :categoryValue.sync="form.categoryCode" @onselected="onProductCategorySelected"></product-category-select>
                  </el-form-item>
                </el-col>
                <el-col :span="6" class="info-box">
                  <el-form-item label="第二代码" prop="barcode">
                    <el-input v-model="form.barcode"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="6" class="info-box">
                  <el-form-item label="默认供应商" prop="defaultVendorCode">
                    <vendor-select :vendorValue.sync="form.defaultVendorCode" @onselected="onSelected"></vendor-select>
                  </el-form-item>
                </el-col>
                <el-col :span="6" class="info-box">
                  <el-form-item label="进价" prop="purchasePrice">
                    <el-input v-model="form.purchasePrice"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="6" class="info-box">
                  <el-form-item label="售价" prop="salePrice">
                    <el-input v-model="form.salePrice"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="6" class="info-box">
                  <el-form-item label="产地" prop="origin">
                    <el-input v-model="form.origin"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="6" class="info-box">
                  <el-form-item label="产生追溯码" prop="trackRecord">
                    <el-switch v-model="form.trackRecord" active-color="#13ce66" inactive-color="#eee"></el-switch>
                  </el-form-item>
                </el-col>
                <el-col :span="24" class="info-box">
                  <el-form-item label="备注">
                    <textarea rows="5" v-model="form.remark"></textarea>
                  </el-form-item>
                </el-col>
              </el-row>
              <div class="height20"></div>
              <div class="info-title">保质期</div>
              <el-row :gutter="20">
                <el-col :span="6" class="info-box">
                  <el-form-item label="保质期类型" prop="shelfLifeType">
                    <el-select v-model="form.shelfLifeType" placeholder="请选择">
                      <el-option label="不管理保质期" value="NO_CARE"></el-option>
                      <el-option label="按到效期" value="VALID_DATE"></el-option>
                      <el-option label="按生产日期" value="PRODUCT_DATE"></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="6" class="info-box" v-show="form.shelfLifeType !== 'NO_CARE'">
                  <el-form-item label="保质期天数" prop="shelfLifeDays">
                    <el-input v-model="form.shelfLifeDays"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="6" class="info-box" v-show="form.shelfLifeType !== 'NO_CARE'">
                  <el-form-item label="收货控制天数" prop="receiveControlDays">
                    <el-input v-model="form.receiveControlDays"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="6" class="info-box" v-show="form.shelfLifeType !== 'NO_CARE'">
                  <el-form-item label="配货控制天数" prop="deliverControlDays">
                    <el-input v-model="form.deliverControlDays"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="6" class="info-box" v-show="form.shelfLifeType !== 'NO_CARE'">
                  <el-form-item label="退货控制天数" prop="returnControlDays">
                    <el-input v-model="form.returnControlDays"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
    <div class="info-content" v-show="status === 'read'">
      <div>
        <template>
          <el-tabs v-model="tabActiveName" @tab-click="tabClick">
            
            <el-tab-pane label="商品信息" name="product">
              <div class="info-title">基本信息</div>
              <el-row :gutter="20">
                <el-col :span="6" class="info-box">
                  <div>代码:</div>
                  <div>{{ productInfo.code }}</div>
                </el-col>
                <el-col :span="6" class="info-box">
                  <div>名称:</div>
                  <div>{{ productInfo.name }}</div>
                </el-col>
                <el-col :span="6" class="info-box">
                  <div>简称:</div>
                  <div>{{ productInfo.shortName }}</div>
                </el-col>
                <el-col :span="6" class="info-box">
                  <div>规格:</div>
                  <div>{{ productInfo.spec }}</div>
                </el-col>
                <el-col :span="6" class="info-box">
                  <div>类别:</div>
                  <div>{{ productInfo.categoryName }}</div>
                </el-col>
                <el-col :span="6" class="info-box">
                  <div>第二代码:</div>
                  <div>{{ productInfo.barcode }}</div>
                </el-col>
                <el-col :span="6" class="info-box">
                  <div>默认供应商:</div>
                  <div>{{ productInfo.defaultVendorName }}</div>
                </el-col>
                <el-col :span="6" class="info-box">
                  <div>进价:</div>
                  <div>{{ productInfo.purchasePrice }}</div>
                </el-col>
                <el-col :span="6" class="info-box">
                  <div>售价:</div>
                  <div>{{ productInfo.salePrice }}</div>
                </el-col>
                <el-col :span="6" class="info-box">
                  <div>产地:</div>
                  <div>{{ productInfo.origin ? productInfo.origin : "&lt;空&gt;" }}</div>
                </el-col>
                <el-col :span="6" class="info-box">
                  <div>产生追溯码:</div>
                  <div>{{ productInfo.trackRecord | filterBoolean}}</div>
                </el-col>
                <el-col :span="24" class="info-box">
                  <div>备注:</div>
                  <div>{{ productInfo.remark ? productInfo.remark : "&lt;空&gt;" }}</div>
                </el-col>
              </el-row>
              <div class="height20"></div>
              <div class="info-title">
                <div>保质期</div>
                <div class="edit-box" @click="clickEditShelfLife" v-if="workingOrg.type === 'DC'">
                  <i class="el-icon-edit-outline" v-show="!isEditShelfLife"></i>
                  <span v-show="isEditShelfLife" @click.stop="handleCancelShelfLife" style="margin-right:3px">取消</span>
                  <span v-show="isEditShelfLife" @click.stop="handleSaveShelfLife">确认</span>
                  <span v-show="!isEditShelfLife">编辑</span>
                </div>
              </div>
              <el-form :model="shelfLifeForm" :rules="shelfLifeRules" ref="shelfLifeForm" label-width="130px" class="demo-ruleForm" v-if="isEditShelfLife">
                <el-row :gutter="20">
                  <el-col :span="6" class="info-box">
                    <el-form-item label="保质期类型" prop="shelfLifeType">
                      <el-select v-model="shelfLifeForm.shelfLifeType" placeholder="请选择">
                        <el-option label="不管理保质期" value="NO_CARE"></el-option>
                        <el-option label="按到效期" value="VALID_DATE"></el-option>
                        <el-option label="按生产日期" value="PRODUCT_DATE"></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="6" class="info-box" v-show="shelfLifeForm.shelfLifeType !== 'NO_CARE'">
                    <el-form-item label="保质期天数" prop="shelfLifeDays">
                      <el-input v-model="shelfLifeForm.shelfLifeDays"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="6" class="info-box" v-show="shelfLifeForm.shelfLifeType !== 'NO_CARE'">
                    <el-form-item label="收货控制天数" prop="receiveControlDays">
                      <el-input v-model="shelfLifeForm.receiveControlDays"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="6" class="info-box" v-show="shelfLifeForm.shelfLifeType !== 'NO_CARE'">
                    <el-form-item label="配货控制天数" prop="deliveryControlDays">
                      <el-input v-model="shelfLifeForm.deliveryControlDays"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="6" class="info-box" v-show="shelfLifeForm.shelfLifeType !== 'NO_CARE'">
                    <el-form-item label="退货控制天数" prop="returnControlDays">
                      <el-input v-model="shelfLifeForm.returnControlDays"></el-input>
                    </el-form-item>
                  </el-col>

                  <!-- 包装类型，可选值：ORIGINAL（原箱）、STANDAD（标准箱） -->
                  <el-col :span="6" class="info-box" v-show="shelfLifeForm.shelfLifeType !== 'NO_CARE'">
                    <el-form-item label="包装类型" prop="packType">
                      <el-select v-model="shelfLifeForm.packType" placeholder="请选择">
                        <el-option label="原箱" value="ORIGINAL"></el-option>
                        <el-option label="标准箱" value="STANDAD"></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>

                </el-row>
              </el-form>
              <el-row :gutter="20" v-if="!isEditShelfLife">
                <el-col :span="6" class="info-box">
                  <div>保质期类型:</div>
                  <div>{{ shelfLifeInfo.shelfLifeType | filterShelfLifeType }}</div>
                </el-col>
                <el-col :span="6" class="info-box">
                  <div>保质期天数:</div>
                  <div>{{ shelfLifeInfo.shelfLifeDays }}</div>
                </el-col>
                <el-col :span="6" class="info-box">
                  <div>收货控制天数:</div>
                  <div>{{ shelfLifeInfo.receiveControlDays }}</div>
                </el-col>
                <el-col :span="6" class="info-box">
                  <div>配货控制天数:</div>
                  <div>{{ shelfLifeInfo.deliveryControlDays }}</div>
                </el-col>
                <el-col :span="6" class="info-box">
                  <div>退货控制天数:</div>
                  <div>{{ shelfLifeInfo.returnControlDays }}</div>
                </el-col>
                <!-- <el-col :span="6" class="info-box">
                  <div>包装类型:</div>
                  <div>{{ shelfLifeInfo.packType | setPackTppe}}</div>
                </el-col> -->
              </el-row>
              <div class="height20"></div>
              <div class="info-title" v-if="workingOrg.type === 'DC'">
                <div>业务信息</div>
                <div class="edit-box" @click="showEditProductBusinessDialog">
                  <i class="el-icon-edit-outline"></i>
                  <span>编辑</span>
                </div>
              </div>
              <el-row :gutter="20" v-if="workingOrg.type === 'DC'">
                <el-col :span="6" class="info-box">
                  <div>上架货位:</div>
                  <div>{{ businessInfo.putawayBin | filterPutawayBin }}</div>
                </el-col>
                <el-col :span="6" class="info-box">
                  <div>整件拣货位:</div>
                  <div>{{ businessInfo.casePickBin }}</div>
                </el-col>
                <el-col :span="6" class="info-box">
                  <div>拆零拣货位:</div>
                  <div>{{ businessInfo.splitPickBin }}</div>
                </el-col>
                <el-col :span="6" class="info-box">
                  <div>收货后加工:</div>
                  <div>{{ businessInfo.processe | filterBoolean}}</div>
                </el-col>
                <el-col :span="6" class="info-box">
                  <div>结算单位:</div>
                  <div>{{ businessInfo.settleUnit | filterSettleUnit}}</div>
                </el-col>
                <el-col :span="6" class="info-box">
                  <div>标准规格:</div>
                  <div>{{ businessInfo.settleQpcStr }}</div>
                </el-col>
                <el-col :span="6" class="info-box">
                  <div>超收比例(%):</div>
                  <div>{{ businessInfo.overReceiveRate }}</div>
                </el-col>
                <el-col :span="6" class="info-box">
                  <div>超出比例(%):</div>
                  <div>{{ businessInfo.overDeliveryRate }}</div>
                </el-col>
                <el-col :span="6" class="info-box">
                  <div>整件拣货分区:</div>
                  <div>{{ businessInfo.casePickAreaName }}</div>
                </el-col>
                <el-col :span="6" class="info-box">
                  <div>拆零拣货分区:</div>
                  <div>{{ businessInfo.splitPickAreaName }}</div>
                </el-col>
                <el-col :span="6" class="info-box">
                  <div>包装类型:</div>
                  <div>{{ businessInfo.packType | setPackTppe }}</div>
                </el-col>
              </el-row>
            </el-tab-pane>

            <el-tab-pane label="包装数量" name="qpc">

              <el-button icon="el-icon-circle-plus-outline" type="text" @click="addSpec" v-if="workingOrg.type==='GROUP'">新增</el-button>

              <el-table :data="specList" style="width: 100%; text-align: center" :row-style="{ height: '16px', padding: '-4px' }">
                <el-table-column prop="qpcStr" label="商品包装" style="height: 20px">
                  <template slot-scope="scope">
                    <el-input v-if="!scope.row.id || (scope.row.isEdit && workingOrg.type === 'GROUP')" v-model="scope.row.qpcStr" placeholder="格式为1*m*n"></el-input>
                    <span v-else>{{ scope.row.qpcStr }}</span>
                  </template>
                </el-table-column>
                <el-table-column prop="munit" label="计量单位" style="height: 20px">
                  <template slot-scope="scope">
                    <el-input v-if="!scope.row.id || (scope.row.isEdit && workingOrg.type === 'GROUP')" v-model="scope.row.munit"></el-input>
                    <span v-else>{{ scope.row.munit }}</span>
                  </template>
                </el-table-column>

                <el-table-column prop="qpc" label="包装件数">
                  <template slot-scope="scope">
                    <el-input v-if="!scope.row.id || (scope.row.isEdit && workingOrg.type === 'GROUP')" v-model="scope.row.qpc"></el-input>
                    <span v-else>{{ scope.row.qpc }}</span>
                  </template>
                </el-table-column>

                <!-- <el-table-column prop="qpc" label="包装件数" v-if="workingOrg.type !== 'GROUP'">
                  <template slot-scope="scope">
                    <span v-if="scope.row.id && !scope.row.isEdit">{{ scope.row.qpc }}</span>
                    <el-input v-else v-model="scope.row.qpc" ></el-input>
                  </template>
                </el-table-column> -->


                <el-table-column prop="length" label="长(cm)">
                  <template slot-scope="scope">
                    <el-input v-if="!scope.row.id || (scope.row.isEdit && workingOrg.type === 'GROUP')" v-model="scope.row.length"></el-input>
                    <span v-else>{{ scope.row.length }}</span>
                  </template>
                </el-table-column>
                <el-table-column prop="width" label="宽(cm)">
                  <template slot-scope="scope">
                    <el-input v-if="!scope.row.id || (scope.row.isEdit && workingOrg.type === 'GROUP')" v-model="scope.row.width"></el-input>
                    <span v-else>{{ scope.row.width }}</span>
                  </template>
                </el-table-column>
                <el-table-column prop="height" label="高(cm)">
                  <template slot-scope="scope">
                    <el-input v-if="!scope.row.id || (scope.row.isEdit && workingOrg.type === 'GROUP')" v-model="scope.row.height"></el-input>
                    <span v-else>{{ scope.row.height }}</span>
                  </template>
                </el-table-column>
                <el-table-column prop="weight" label="重(g)">
                  <template slot-scope="scope">
                    <el-input v-if="!scope.row.id || (scope.row.isEdit && workingOrg.type === 'GROUP')" v-model="scope.row.weight"></el-input>
                    <span v-else>{{ scope.row.weight }}</span>
                  </template>
                </el-table-column>
                <el-table-column prop="defaultQpcStr" label="默认规格">
                  <template slot-scope="scope">
                    <div v-show="(scope.row.isEdit || scope.row.defaultQpcStr) || workingOrg.type !== 'GROUP'">
                      <span>{{ scope.row.defaultQpcStr | filterBoolean}}</span>
                    </div>
                    <div v-show="!((scope.row.isEdit || scope.row.defaultQpcStr) || workingOrg.type !== 'GROUP')">
                      <el-button type="text" :disabled="!scope.row.id" @click="setDefaultProductQpc(scope.row)">设为默认</el-button>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column prop="plateAdvice" label="装盘建议" v-if="workingOrg.type !== 'GROUP'">
                  <template slot-scope="scope">
                    <span v-if="scope.row.id && !scope.row.isEdit">{{ scope.row.plateAdvice ? scope.row.plateAdvice : "&lt;空&gt;" }}</span>
                    <el-input v-else v-model="scope.row.plateAdvice" @blur="handlePlateAdviceBlur(scope.$index,scope.row)"></el-input>
                  </template>
                </el-table-column>
                <el-table-column prop="plate" label="装盘件数" v-if="workingOrg.type !== 'GROUP'">
                  <template slot-scope="scope">
                    <el-input v-if="!scope.row.id || (scope.row.isEdit && workingOrg.type === 'GROUP')" v-model="scope.row.plate"></el-input>
                    <span v-else>{{ scope.row.plate ? scope.row.plate : "&lt;空&gt;"}}</span>
                  </template>
                </el-table-column>
                <el-table-column label="操作">
                  <template slot-scope="scope">
                    <el-button type="text" v-if="scope.row.id && !scope.row.isEdit" @click="handleEditSpec(scope.$index,scope.row)">编辑</el-button>
                    <el-button type="text" v-else-if="hasPermission(PermIds.PRODUCT_QPC_UPDATE)" @click="handleSaveSpec(scope.row)">保存</el-button>
                    <el-button type="text" @click="handleDeleteSpec(scope.$index,scope.row)" v-if="hasPermission(PermIds.PRODUCT_QPC_REMOVE) && workingOrg.type === 'GROUP'">删除</el-button>
                  </template>
                </el-table-column>
              </el-table>
              <div class="height20"></div>
              <el-pagination style="float:right" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="1" :page-sizes="[10, 20, 30, 50]" :page-size="qpcPageData.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="qpcPageData.totalCount"></el-pagination>
            </el-tab-pane>

            <el-tab-pane label="条码详情" name="barcode">
              <el-button icon="el-icon-circle-plus-outline" type="text" @click="addBarcode" v-if="hasPermission(PermIds.PRODUCT_BARCODE_CREATE) && workingOrg.type === 'GROUP'">新增</el-button>
              <el-table :data="barcodeList" style="width: 100%; text-align: center" :row-style="{ height: '16px', padding: '-4px' }">
                <el-table-column prop="barcode" label="条码" style="height: 20px" width="200">
                  <template slot-scope="scope">
                    <span v-if="scope.row.id && !scope.row.isEdit">{{ scope.row.barcode }}</span>
                    <el-input v-else v-model="scope.row.barcode" placeholder="条码" :max="32"></el-input>
                  </template>
                </el-table-column>
                <el-table-column prop="qpcStr" label="商品包装">
                  <template slot-scope="scope">
                    <span v-if="scope.row.id && !scope.row.isEdit">{{ scope.row.qpcStr }}</span>
                    <product-spec-select v-else :specValue.sync="scope.row.qpcStr" :productId="id"></product-spec-select>
                    <!-- <el-select v-else v-model="scope.row.qpcStr" placeholder="请选择">
                      <el-option v-for="item in specList" :key="item.id" :label="item.qpcStr" :value="item.qpcStr"></el-option>
                    </el-select>-->
                  </template>
                </el-table-column>
                <el-table-column label="操作">
                  <template slot-scope="scope">
                    <el-button type="text" v-if="scope.row.id && !scope.row.isEdit && hasPermission(PermIds.PRODUCT_BARCODE_UPDATE) && workingOrg.type === 'GROUP'" @click="handleEditBarcode(scope.$index,scope.row)">编辑</el-button>
                    <el-button type="text" v-if="(!scope.row.id || scope.row.isEdit) && (hasPermission(PermIds.PRODUCT_BARCODE_CREATE) || hasPermission(PermIds.PRODUCT_BARCODE_UPDATE)) && workingOrg.type === 'GROUP'" @click="handleSaveBarcode(scope.row)">保存</el-button>
                    <el-button type="text" v-if="hasPermission(PermIds.PRODUCT_BARCODE_REMOVE) && workingOrg.type === 'GROUP'" @click="handleDeleteBarcode(scope.$index,scope.row)">删除</el-button>
                  </template>
                </el-table-column>
              </el-table>
              <div class="height20"></div>
              <el-pagination style="float:right" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="1" :page-sizes="[10, 20, 30, 50]" :page-size="barcodePageData.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="barcodePageData.totalCount"></el-pagination>
            </el-tab-pane>

            <el-tab-pane label="供应商详情" name="vendor">
              <el-button icon="el-icon-circle-plus-outline" type="text" @click="addVendor" v-if="hasPermission(PermIds.PRODUCT_VENDOR_CREATE) && workingOrg.type === 'GROUP'">新增</el-button>
              <el-table :data="vendorList" style="width: 100%; text-align: center" :row-style="{ height: '16px', padding: '-4px' }">
                <el-table-column prop="vendorCode" label="供应商" style="height: 20px">
                  <template slot-scope="scope">
                    <span v-show="scope.row.id && !scope.row.isEdit">{{ '[' + scope.row.vendorCode + ']' + scope.row.vendorName}}</span>
                    <div :hidden="scope.row.id && !scope.row.isEdit">
                      <vendor-select :vendorValue.sync="scope.row.vendorCode" :index="scope.$index" @onselected="onVendorSelected"></vendor-select>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column prop="defaultReceive" label="首选收货" style="height: 20px">
                  <template slot-scope="scope">
                    <div v-show="(scope.row.isEdit || scope.row.defaultReceive) || workingOrg.type !== 'GROUP'">
                      <span>{{ scope.row.defaultReceive | filterBoolean}}</span>
                    </div>
                    <div v-show="!((scope.row.isEdit || scope.row.defaultReceive) || workingOrg.type !== 'GROUP')">
                      <el-button type="text" :disabled="!scope.row.id" @click="setReceiveDefault(scope.row)">设为首选</el-button>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column prop="defaultReturn" label="首选退货">
                  <template slot-scope="scope">
                    <div v-show="(scope.row.isEdit || scope.row.defaultReturn) || workingOrg.type !== 'GROUP'">
                      <span>{{ scope.row.defaultReturn | filterBoolean}}</span>
                    </div>
                    <div v-show="!((scope.row.isEdit || scope.row.defaultReturn) || workingOrg.type !== 'GROUP')">
                      <el-button type="text" :disabled="!scope.row.id" @click="setReturnDefault(scope.row)">设为首选</el-button>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column prop="defaultReceivePrice" label="默认入库价格(元)">
                  <template slot-scope="scope">
                    <span v-if="scope.row.id && !scope.row.isEdit">{{ scope.row.defaultReceivePrice }}</span>
                    <el-input v-else v-model="scope.row.defaultReceivePrice"></el-input>
                  </template>
                </el-table-column>
                <el-table-column prop="defaultReturnPrice" label="默认退货价格(元)">
                  <template slot-scope="scope">
                    <span v-if="scope.row.id && !scope.row.isEdit">{{ scope.row.defaultReturnPrice }}</span>
                    <el-input v-else v-model="scope.row.defaultReturnPrice"></el-input>
                  </template>
                </el-table-column>

                <!-- <el-table-column prop="defaultReceive" label="默认供应商"> 最初代码
                  <template slot-scope="scope">
                      <span v-if="productInfo.defaultVendorCode === scope.row.vendorCode">是</span>
                      <span v-else>
                         <el-button type="text" :disabled="!scope.row.id" @click="setSupplier(scope.row)">设为首选</el-button>
                      </span>
                  </template>
                </el-table-column> -->

                <el-table-column prop="defaultReceive" label="默认供应商"> 最初代码
                  <template slot-scope="scope">
                      <div v-show="!scope.row.isEdit">
                        <span v-if="productInfo.defaultVendorCode === scope.row.vendorCode">是</span>
                        <span v-else>
                          <el-button type="text" :disabled="!scope.row.id" @click="setSupplier(scope.row)">设为首选</el-button>
                        </span>
                      </div>
                      <div v-show="scope.row.isEdit">
                        <span v-if="productInfo.defaultVendorCode === scope.row.vendorCode">是</span>
                        <span v-else>否</span>
                      </div>
                      
                  </template>
                </el-table-column>

                <el-table-column label="操作">
                  <template slot-scope="scope">
                    <el-button type="text" v-if="scope.row.id && !scope.row.isEdit && hasPermission(PermIds.PRODUCT_VENDOR_UPDATE) && workingOrg.type === 'GROUP'" @click="handleEditVendor(scope.$index,scope.row)">编辑</el-button>
                    <el-button type="text" v-else-if="(hasPermission(PermIds.PRODUCT_VENDOR_CREATE) || hasPermission(PermIds.PRODUCT_VENDOR_UPDATE)) && workingOrg.type === 'GROUP'" @click="handleSaveVendor(scope.row)">保存</el-button>
                    <!-- 如果是默认供应商 则不允许删除 -->
                    <el-button type="text" :disabled="productInfo.defaultVendorCode === scope.row.vendorCode" v-if="hasPermission(PermIds.PRODUCT_VENDOR_REMOVE) && workingOrg.type === 'GROUP'" @click="handleDeleteVendor(scope.$index,scope.row)">删除</el-button>
                  </template>
                </el-table-column>
              </el-table>
              <div class="height20"></div>
              <el-pagination style="float:right" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="1" :page-sizes="[10, 20, 30, 50]" :page-size="vendorPageData.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="vendorPageData.totalCount"></el-pagination>
            </el-tab-pane>
            <el-tab-pane label="操作日志" name="log">
              <system-log modular="PRODUCT" :id="id"></system-log>
            </el-tab-pane>
          </el-tabs>
        </template>
      </div>
    </div>
    <el-dialog title="业务信息" :visible.sync="businessDialogVisible" width="1000px" :before-close="handleClose">
      <div>
        <el-form :model="businessForm" :rules="businessFormRules" ref="businessForm" label-width="100px" class="demo-ruleForm">
          <el-row :gutter="20">
            <el-col :span="6" class="info-box">
              <el-form-item label="上架货位" prop="putawayBin">
                <el-select v-model="businessForm.putawayBin" placeholder="请选择">
                  <el-option label="拣货位" value="PICKUPBIN"></el-option>
                  <el-option label="存储位" value="STORAGEBIN"></el-option>
                  <el-option label="优先拣货位" value="FIRSTPICKUP"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <!-- <el-col :span="6" class="info-box">
              <el-form-item label="卸货指导" prop="unloadAdvice">
                <el-input v-model="businessForm.unloadAdvice"></el-input>
              </el-form-item>
            </el-col>-->
            <el-col :span="6" class="info-box">
              <el-form-item label="整件拣货位" prop="casePickBin">
                <pick-bin-select stockType="CASE" :selectValue.sync="businessForm.casePickBin" @onselected="onCasePickBinSelected"></pick-bin-select>
              </el-form-item>
            </el-col>
            <el-col :span="6" class="info-box">
              <el-form-item label="拆零拣货位" prop="splitPickBin">
                <pick-bin-select stockType="CASE" :selectValue.sync="businessForm.splitPickBin" @onselected="onSplitPickBinSelected"></pick-bin-select>
              </el-form-item>
            </el-col>

            <!-- 包装类型，可选值：ORIGINAL（原箱）、STANDAD（标准箱） -->
            <el-col :span="6" class="info-box">
              <el-form-item label="包装类型" prop="packType">
                <el-select v-model="businessForm.packType" placeholder="请选择">
                  <el-option label="原箱" value="ORIGINAL"></el-option>
                  <el-option label="标准箱" value="STANDAD"></el-option>
                </el-select>
              </el-form-item>
            </el-col>

            <el-col :span="6" class="info-box">
              <el-form-item label="收货后加工" prop="processe">
                <el-checkbox v-model="businessForm.processe"></el-checkbox>
              </el-form-item>
            </el-col>
            <el-col :span="6" class="info-box">
              <el-form-item label="结算单位" prop="settleUnit">
                <el-select v-model="businessForm.settleUnit" placeholder="请选择">
                  <el-option label="数量" value="QTY"></el-option>
                  <el-option label="重量" value="WEIGHT"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6" class="info-box" v-if="businessForm.settleUnit === 'WEIGHT'">
              <el-form-item label="标准规格" prop="settleQpcStr">
                <product-spec-select :specValue.sync="businessForm.settleQpcStr" :productId="id"></product-spec-select>
              </el-form-item>
            </el-col>
            <el-col :span="6" class="info-box" v-if="businessForm.settleUnit === 'WEIGHT'">
              <el-form-item label="超收比例(%)" prop="overReceiveRate">
                <el-input v-model="businessForm.overReceiveRate"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6" class="info-box" v-if="businessForm.settleUnit === 'WEIGHT'">
              <el-form-item label="超出比例(%)" prop="overDeliveryRate">
                <el-input v-model="businessForm.overDeliveryRate"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6" class="info-box">
              <el-form-item label="整件拣货分区" prop="casePickAreaCode">
                <pickarea-select stockType="CASE" :selectValue.sync="businessForm.casePickAreaCode" @onselected="onCasePickareaSelected"></pickarea-select>
              </el-form-item>
            </el-col>
            <el-col :span="6" class="info-box">
              <el-form-item label="拆零拣货分区" prop="splitPickAreaCode">
                <pickarea-select stockType="SPLIT" :selectValue.sync="businessForm.splitPickAreaCode" @onselected="onSplitPickareaSelected"></pickarea-select>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="businessDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleBusinessConfirm">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import ProductService from "@/api/service/ProductService";
import { mapGetters } from "vuex";
import PermIds from "@/api/permissionIds";
import vendorSelect from "@/components/vendorSelect.vue";
import productCategorySelect from "@/components/productCategorySelect.vue";
import productSpecSelect from "@/components/productSpecSelect.vue";
import pickareaSelect from "@/components/pickareaSelect.vue";
import pickBinSelect from "@/components/pickBinSelect.vue";
import systemLog from "@/components/systemLog.vue";

export default {
  data() {
    return {
      id: "",
      PermIds: PermIds,
      status: "create",
      productInfo: {},
      form: {
        barcode: "",
        categoryCode: "",
        categoryId: "",
        categoryName: "",
        code: "",
        defaultVendorCode: "",
        defaultVendorId: "",
        defaultVendorName: "",
        deliverControlDays: 0,
        name: "",
        origin: "",
        purchasePrice: 0,
        receiveControlDays: 0,
        remark: "",
        returnControlDays: 0,
        salePrice: 0,
        shelfLifeDays: 0,
        shelfLifeType: "NO_CARE",
        shortName: "",
        sourceWay: "CREATE",
        spec: "",
        trackRecord: true,
        status: ""
      },
      tabActiveName: "product",
      createRules: {
        code: [
          { required: true, message: "请输入商品代码", trigger: "blur" },
          {
            required: true,
            max: 128,
            message: "最多输入128位",
            trigger: "blur"
          }
        ],
        name: [
          { required: true, message: "请输入商品名称", trigger: "blur" },
          {
            required: true,
            max: 128,
            message: "最多输入128位",
            trigger: "blur"
          }
        ],
        spec: [
          { required: true, message: "请输入商品规格", trigger: "blur" },
          {
            required: true,
            max: 128,
            message: "最多输入128位",
            trigger: "blur"
          }
        ],
        categoryCode: [
          { required: true, message: "请选择类别", trigger: "blur" }
        ],
        barcode: [
          { required: true, message: "请输入第二代码", trigger: "blur" },
          {
            required: true,
            max: 32,
            message: "最多输入32位",
            trigger: "blur"
          }
        ],
        defaultVendorCode: [
          {
            required: true,
            patten: /^(([1-9][0-9]*)|(([0]\.\d{1,4}|[1-9][0-9]*\.\d{1,4})))$/,
            message: "请选择默认供应商",
            trigger: "blur"
          }
        ],
        salePrice: [
          {
            pattern: /^(([1-9][0-9]*)|(([0]\.\d{1,4}|[1-9][0-9]*\.\d{1,4})))$/,
            message: "请输入大于零的数，最多输入四位小数",
            trigger: "blur"
          }
        ],
        purchasePrice: [
          {
            pattern: /^(([1-9][0-9]*)|(([0]\.\d{1,4}|[1-9][0-9]*\.\d{1,4})))$/,
            message: "请输入大于零的数，最多输入四位小数",
            trigger: "blur"
          }
        ],
        origin: [
          { required: true, message: "请输入产地", trigger: "blur" },
          {
            required: true,
            max: 128,
            message: "最多输入128位",
            trigger: "blur"
          }
        ],
        shelfLifeDays: [
          {
            pattern: /^([1-9]\d*|[0]{1,1})$/,
            message: "请输入非零整数",
            trigger: "blur"
          }
        ],
        receiveControlDays: [
          {
            pattern: /^([1-9]\d*|[0]{1,1})$/,
            message: "请输入非零整数",
            trigger: "blur"
          }
        ],
        deliverControlDays: [
          {
            pattern: /^([1-9]\d*|[0]{1,1})$/,
            message: "请输入非零整数",
            trigger: "blur"
          }
        ],
        returnControlDays: [
          {
            pattern: /^([1-9]\d*|[0]{1,1})$/,
            message: "请输入非零整数",
            trigger: "blur"
          }
        ]
      },
      shelfLifeForm: {
        shelfLifeType: "NO_CARE",
        shelfLifeDays: 0,
        receiveControlDays: 0,
        deliveryControlDays: 0,
        returnControlDays: 0,
        packType: '' // 包装类型
      },
      shelfLifeInfo: {
        shelfLifeType: "NO_CARE",
        shelfLifeDays: 0,
        receiveControlDays: 0,
        deliveryControlDays: 0,
        returnControlDays: 0,
        packType: '' // 包装类型
      },
      shelfLifeRules: {
        shelfLifeDays: [
          {
            pattern: /^([1-9]\d*|[0]{1,1})$/,
            message: "请输入非零整数",
            trigger: "blur"
          }
        ],
        receiveControlDays: [
          {
            pattern: /^([1-9]\d*|[0]{1,1})$/,
            message: "请输入非零整数",
            trigger: "blur"
          }
        ],
        deliveryControlDays: [
          {
            pattern: /^([1-9]\d*|[0]{1,1})$/,
            message: "请输入非零整数",
            trigger: "blur"
          }
        ],
        returnControlDays: [
          {
            pattern: /^([1-9]\d*|[0]{1,1})$/,
            message: "请输入非零整数",
            trigger: "blur"
          }
        ],
        packType: [
          { required: true, message: "请选择包装类型", trigger: "change" }
        ]
      },
      isEditShelfLife: false,
      businessDialogVisible: false,
      businessInfo: {
        putawayBin: "STORAGEBIN"
      },
      businessForm: {
        id: "",
        dcId: "",
        deliveryControlDays: 0,
        overDeliveryRate: 0,
        overReceiveRate: 0,
        processe: true,
        productId: "",
        putawayBin: "STORAGEBIN",
        receiveControlDays: 0,
        returnControlDays: 0,
        settleQpcStr: "",
        settleUnit: "QTY",
        shelfLifeDays: 0,
        shelfLifeType: "NO_CARE",
        unloadAdvice: "",
        casePickAreaCode: "",
        casePickAreaId: "",
        casePickAreaName: "",
        casePickBin: "",
        splitPickAreaCode: "",
        splitPickAreaId: "",
        splitPickAreaName: "",
        splitPickBin: "",
        packType: '' // 包装类型
      },
      businessFormRules: {
        putawayBin: [
          { required: true, message: "请选择上架货位", trigger: "change" }
        ],
        settleUnit: [
          { required: true, message: "请输入结算单位", trigger: "change" }
        ],
        settleQpcStr: [
          { required: true, message: "请输入标准规格", trigger: "change" }
        ],
        packType: [
          { required: true, message: "请选择包装类型", trigger: "change" }
        ],
        overReceiveRate: [
          {
            required: true,
            pattern: /^\d{1,3}(\.\d+)?$/,
            message: "请输入0-999之间的数字",
            trigger: "change"
          }
        ],
        overDeliveryRate: [
          {
            required: true,
            pattern: /^\d{1,3}(\.\d+)?$/,
            message: "请输入0-999之间的数字",
            trigger: "change"
          }
        ]
      },
      specList: [],
      barcodeList: [],
      vendorList: [],
      qpcPageData: {
        page: 1,
        pageSize: 10,
        totalCount: 0
      },
      barcodePageData: {
        page: 1,
        pageSize: 10,
        totalCount: 0
      },
      vendorPageData: {
        page: 1,
        pageSize: 10,
        totalCount: 0
      },
      businessPageData: {
        page: 1,
        pageSize: 10,
        totalCount: 0
      }
    };
  },
  computed: {
    ...mapGetters(["hasPermission", "workingOrg"])
  },
  methods: {
    getQueryStatus: function() {
      this.status = this.$route.query.status;
      if (this.status === "read") {
        this.id = this.$route.query.id;
      }
      this.getProductById();
      this.getProductSpec();
      this.getProductBarcode();
      this.getProductVendor();
      if (this.workingOrg.type === "DC") {
        this.getProductBusiness();
      }
    },
    statusChange: function() {
      // 修改仓区状态
      const self = this;
      this.$confirm("此操作将改变商品状态, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          if (self.productInfo.status === "OFF") {
            ProductService.on(self.id)
              .then(res => {
                self.$message.success("启用成功");
                self.getProductById(self.id);
              })
              .catch(err => {
                self.$message.error("禁用失败" + err.message);
                self.getProductById(self.id);
              });
          } else {
            ProductService.off(self.id)
              .then(res => {
                self.$message.success("禁用成功");
                self.getProductById(self.id);
              })
              .catch(err => {
                self.$message.error("启用失败" + err.message);
                self.getProductById(self.id);
              });
          }
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    getProductById() {
      ProductService.getById(this.id)
        .then(res => {
          this.productInfo = res;
          if (this.workingOrg.type !== "DC") {
            this.shelfLifeInfo.shelfLifeType = res.shelfLifeType;
            this.shelfLifeInfo.shelfLifeDays = res.shelfLifeDays;
            this.shelfLifeInfo.receiveControlDays = res.receiveControlDays;
            this.shelfLifeInfo.deliveryControlDays = res.deliverControlDays;
            this.shelfLifeInfo.returnControlDays = res.returnControlDays;
          }
        })
        .catch(err => {
          this.$message.error("查询失败" + err.message);
        });
    },
    getProductBusiness() {
      // const self = this;
      const opts = {
        productIdEquals: this.id,
        dcIdEquals: this.workingOrg.id
      };
      ProductService.queryBusiness(
        this.businessPageData.page,
        this.businessPageData.pageSize,
        opts
      )
        .then(res => {
          // this.productInfo = res;
          this.businessPageData.totalCount = res.totalCount;
          if (res.records.length > 0) {
            this.businessInfo = res.records[0];
            // 登录用户是物流中心时，保质期信息区商品业务信息
            this.shelfLifeInfo.shelfLifeType = this.businessInfo.shelfLifeType;
            this.shelfLifeInfo.shelfLifeDays = this.businessInfo.shelfLifeDays;
            this.shelfLifeInfo.receiveControlDays = this.businessInfo.receiveControlDays;
            this.shelfLifeInfo.deliveryControlDays = this.businessInfo.deliveryControlDays;
            this.shelfLifeInfo.returnControlDays = this.businessInfo.returnControlDays;
            this.shelfLifeInfo.packType = this.businessInfo.packType; // 包装类型
          }
        })
        .catch(err => {
          this.$message.error("查询失败" + err.message);
        });
    },
    getProductSpec() {
      const self = this;
      const opts = {
        productIdEquals: this.id
      };
      if (this.workingOrg.type === "DC") {
        queryDcProductQpc();
      } else {
        queryProductQpc();
      }
      function queryProductQpc() {
        ProductService.queryProductQpc(
          self.qpcPageData.page,
          self.qpcPageData.pageSize,
          opts
        )
          .then(res => {
            self.specList = [];
            self.qpcPageData.totalCount = res.totalCount;
            if (res.records.length > 0) {
              res.records.forEach(item => {
                const obj = {
                  ...item,
                  isEdit: false,
                  plateAdvice: item.plateAdvice ? item.plateAdvice : "",
                  plate: item.plate ? item.plate : ""
                };
                self.specList.push(obj);
              });
            }
          })
          .catch(err => {
            self.$message.error("查询失败" + err.message);
          });
      }
      function queryDcProductQpc() {
        ProductService.queryDcProductQpc(
          self.qpcPageData.page,
          self.qpcPageData.pageSize,
          opts
        )
          .then(res => {
            self.specList = [];
            self.qpcPageData.totalCount = res.totalCount;
            if (res.records.length > 0) {
              res.records.forEach(item => {
                const obj = {
                  ...item,
                  isEdit: false
                };
                self.specList.push(obj);
              });
            }
          })
          .catch(err => {
            self.$message.error("查询失败" + err.message);
          });
      }
    },
    setDefaultProductQpc(val) {
      const self = this;
      ProductService.setDefaultProductQpc(val.id)
        .then(res => {
          self.$message.success("设置成功");
          self.getProductSpec();
        })
        .catch(err => {
          this.$message.error("查询失败" + err.message);
        });
    },
    getProductVendor() {
      const self = this;
      const opts = {
        productIdEquals: this.id
      };
      ProductService.queryVendor(
        this.vendorPageData.page,
        this.vendorPageData.pageSize,
        opts
      )
        .then(res => {
          self.vendorList = [];
          this.vendorPageData.totalCount = res.totalCount;
          if (res.records.length > 0) {
            res.records.forEach(item => {
              const obj = {
                ...item,
                isEdit: false
              };
              self.vendorList.push(obj);
            });
          }
        })
        .catch(err => {
          this.$message.error("查询失败" + err.message);
        });
    },

    getProductBarcode() {
      console.log('获取条码详情')
      const self = this;
      const opts = {
        productIdEquals: this.id
      };
      ProductService.queryBarcode(
        this.barcodePageData.page,
        this.barcodePageData.pageSize,
        opts
      )
        .then(res => {
          // this.productInfo = res;
          self.barcodeList = [];
          this.barcodePageData.totalCount = res.totalCount;
          if (res.records.length > 0) {
            res.records.forEach(item => {
              const obj = {
                ...item,
                isEdit: false
              };
              self.barcodeList.push(obj);
            });
          }
        })
        .catch(err => {
          this.$message.error("查询失败" + err.message);
        });
    },

    clickEdit() {
      this.tabActiveName = "product";
      this.status = "edit";
      this.form = Object.assign(this.form, this.productInfo);
      this.getProductById();
    },
    updateProduct() {
      const _this = this;
      this.$refs.form.validate(valid => {
        if (valid) {
          const postData = {
            ..._this.form
          };
          ProductService.update(postData)
            .then(res => {
              this.$message.success("编辑成功");
              this.$store.dispatch("tagsView/delView", this.$route);
              this.$router.go(-1);
            })
            .catch(err => {
              this.$message.error("编辑失败" + err.message);
            });
        }
      });
    },
    back: function() {
      this.$store.dispatch("tagsView/delView", this.$route);
      this.$router.go(-1);
    },
    tabClick() {},
    onSelected(val) {
      console.log(val);
      this.form.defaultVendorCode = val.code ? val.code : "";
      this.form.defaultVendorId = val.id ? val.id : "";
      this.form.defaultVendorName = val.name ? val.name : "";
    },
    onProductCategorySelected(val) {
      this.form.categoryCode = val.code ? val.code : "";
      this.form.categoryId = val.id ? val.id : "";
      this.form.categoryName = val.name ? val.name : "";
    },
    onCasePickareaSelected(val) {
      this.businessForm.casePickAreaCode = val.code ? val.code : "";
      this.businessForm.casePickAreaId = val.id ? val.id : "";
      this.businessForm.casePickAreaName = val.name ? val.name : "";
    },
    onSplitPickareaSelected(val) {
      this.businessForm.splitPickAreaCode = val.code ? val.code : "";
      this.businessForm.splitPickAreaId = val.id ? val.id : "";
      this.businessForm.splitPickAreaName = val.name ? val.name : "";
    },
    onCasePickBinSelected(val) {
      this.businessForm.casePickBin = val.code ? val.code : "";
    },
    onSplitPickBinSelected(val) {
      this.businessForm.splitPickBin = val.code ? val.code : "";
    },
    // 保质期处理
    clickEditShelfLife() {
      this.isEditShelfLife = true;
      this.shelfLifeForm = Object.assign(
        this.shelfLifeForm,
        this.shelfLifeInfo
      );
    },
    handleCancelShelfLife() {
      this.isEditShelfLife = false;
    },
    handleSaveShelfLife() {
      const _this = this;
      this.$refs.shelfLifeForm.validate(valid => {
        if (valid) {
          _this.isEditShelfLife = false;
          _this.handleSaveBusiness("shelfLife");
        }
      });
    },
    // 业务信息处理
    showEditProductBusinessDialog: function() {
      this.businessForm = Object.assign(this.businessForm, this.businessInfo);
      this.businessDialogVisible = true;
    },
    handleClose() {
      this.businessDialogVisible = false;
    },
    handleBusinessConfirm(type) {
      const _this = this;
      this.$refs.businessForm.validate(valid => {
        if (valid) {
          _this.isEditShelfLife = false;
          _this.handleSaveBusiness();
        }
      });
    },
    handleSaveBusiness(type) {
      var postData = {
        dcId: this.workingOrg.id,
        productId: this.id
      };
      if (type === "shelfLife") {
        // 保质期
        postData = {
          ...postData,
          putawayBin: this.businessForm.putawayBin,
          deliveryControlDays: this.shelfLifeForm.deliveryControlDays,
          receiveControlDays: this.shelfLifeForm.receiveControlDays,
          returnControlDays: this.shelfLifeForm.returnControlDays,
          shelfLifeDays: this.shelfLifeForm.shelfLifeDays,
          shelfLifeType: this.shelfLifeForm.shelfLifeType,
          packType: this.shelfLifeForm.packType
        };
      } else {
        postData = {
          ...postData,
          shelfLifeType: this.businessForm.shelfLifeType,
          processe: this.businessForm.processe,
          putawayBin: this.businessForm.putawayBin,
          settleUnit: this.businessForm.settleUnit,
          unloadAdvice: this.businessForm.unloadAdvice,
          casePickAreaCode: this.businessForm.casePickAreaCode,
          casePickAreaId: this.businessForm.casePickAreaId,
          casePickAreaName: this.businessForm.casePickAreaName,
          casePickBin: this.businessForm.casePickBin,
          splitPickAreaCode: this.businessForm.splitPickAreaCode,
          splitPickAreaId: this.businessForm.splitPickAreaId,
          splitPickAreaName: this.businessForm.splitPickAreaName,
          splitPickBin: this.businessForm.splitPickBin,
          packType: this.businessForm.packType
        };

        // 业务信息
        if (this.businessForm.settleUnit === "WEIGHT") {
          postData = {
            ...postData,
            settleQpcStr: this.businessForm.settleQpcStr,
            overDeliveryRate: this.businessForm.overDeliveryRate,
            overReceiveRate: this.businessForm.overReceiveRate
          };
        } else {
          postData = {
            ...postData,
            settleQpcStr: "",
            overDeliveryRate: 0,
            overReceiveRate: 0
          };
        }
      }

      if (this.businessInfo.id) {
        postData.id = this.businessInfo.id;
        postData.version = this.businessInfo.version;
        ProductService.updateBusiness(postData)
          .then(res => {
            if (type === "shelfLife") {
              this.$message.success("编辑保质期成功");
            } else {
              this.$message.success("编辑业务信息成功");
            }
            this.businessDialogVisible = false;
            this.getProductBusiness();
          })
          .catch(err => {
            this.$message.error("编辑失败" + err.message);
          });
      } else {
        ProductService.createBusiness(postData)
          .then(res => {
            if (type === "shelfLife") {
              this.$message.success("编辑保质期成功");
            } else {
              this.$message.success("编辑业务信息成功");
            }
            this.getProductBusiness();
            this.businessDialogVisible = false;
          })
          .catch(err => {
            this.$message.error("编辑失败" + err.message);
          });
      }
    },
    // 规格相关操作
    addSpec() {
      const spec = {
        defaultQpcStr: false,
        height: 0,
        length: 0,
        munit: "",
        qpc: 0,
        productId: "",
        qpcStr: "",
        weight: 0,
        width: 0,
        plateAdvice: "",
        plate: ""
      };
      this.specList.push(spec);
    },
    handlePlateAdviceBlur(index, val) {
      const regMN = /^(\d+(\.\d+)*)\*(\d+(\.\d+)*)$/;
      if (!val.plateAdvice) {
        this.$message.error("请填写装盘建议");
      } else if (!regMN.test(val.plateAdvice)) {
        this.$message.error("请填写正确的装盘建议，例如m*n,m,n为数字！");
      } else if (regMN.test(val.plateAdvice)) {
        const numArr = val.plateAdvice.split("*");
        this.specList[index].plate = Number(numArr[0]) * Number(numArr[1]);
      }
    },
    handleEditSpec(index, val) {
      console.log(index, val);
      this.specList[index].isEdit = true;
    },
    qpcStrToNumber(qpcStr) {
      const arr = qpcStr.split("*");
      let res = 1;
      for (let i = 0; i < arr.length; i++) {
        const ele = arr[i];
        res = res * Number(ele);
      }
      return res;
    },
    checkSpecData(val) {
      const reg = /^(1\*(\d+(\.\d+)*)\*(\d+(\.\d+)*))|(1\*(\d+(\.\d+)*))$/;
      const regMN = /^(\d+(\.\d+)*)\*(\d+(\.\d+)*)$/;

      if (!val.qpcStr) {
        this.$message.error("请填写商品包装规格！");
        return false;
      } else if (!reg.test(val.qpcStr)) {
        this.$message.error("请填写正确的商品包装规格，例如1*m*n,m,n为数字！");
        return false;
      } else if (!val.munit) {
        this.$message.error("请填写计量单位！");
        return false;
      } else if (val.munit.length > 32) {
        this.$message.error("计量单位的长度不能超过32位");
        return false;
      } else if (!val.qpc) {
        this.$message.error("请填写商品包装件数！");
        return false;
      } else if (!(Number(val.qpc) >= 0)) {
        this.$message.error("商品包装件数为数字且不能小于0！");
        return false;
      } else if (this.qpcStrToNumber(val.qpcStr) !== Number(val.qpc)) {
        console.log(this.qpcStrToNumber(val.qpcStr), Number(val.qpc));
        this.$message.error("商品包装规格和包装件数不一致！");
        return false;
      } else if (!val.length) {
        this.$message.error("请填写商品包装的长！");
        return false;
      } else if (!(Number(val.length) >= 0)) {
        this.$message.error("商品包装的长为数字且不能小于0！");
        return false;
      } else if (!val.width) {
        this.$message.error("请填写商品包装的宽！");
        return false;
      } else if (!(Number(val.width) >= 0)) {
        this.$message.error("商品包装的宽为数字且不能小于0！");
        return false;
      } else if (!val.height) {
        this.$message.error("请填写商品包装的高！");
        return false;
      } else if (!(Number(val.height) >= 0)) {
        this.$message.error("商品包装的高为数字且不能小于0！");
        return false;
      } else if (this.workingOrg.type === "DC" && !val.plateAdvice) {
        this.$message.error("请填写装盘建议！");
        return false;
      } else if (
        this.workingOrg.type === "DC" &&
        !regMN.test(val.plateAdvice)
      ) {
        this.$message.error("请填写正确的装盘建议，例如m*n,m,n为数字！");
        return false;
      } else {
        return true;
      }
    },
    handleSaveSpec(val) {
      if (!this.checkSpecData(val)) {
        return;
      }
      if (this.workingOrg.type === "DC") {
        this.handleSaveDcSpec(val);
        return;
      }
      const postData = {
        defaultQpcStr: val.defaultQpcStr,
        height: val.height,
        length: val.length,
        munit: val.munit,
        qpc: val.qpc,
        productId: this.id,
        qpcStr: val.qpcStr,
        weight: val.weight,
        width: val.width
      };
      if (val.id) {
        // 更新
        postData.id = val.id;
        ProductService.updateProductQpc(postData)
          .then(res => {
            this.$message.success("编辑成功");
            this.getProductSpec();
            // this.getProductBarcode(); // 更新条码详情
          })
          .catch(err => {
            this.$message.error("编辑失败" + err.message);
          });
      } else {
        // 创建
        ProductService.createProuctQpc(postData)
          .then(res => {
            this.$message.success("编辑成功");
            this.getProductSpec();
            // this.getProductBarcode(); // 更新条码详情
          })
          .catch(err => {
            this.$message.error("编辑失败" + err.message);
          });
      }
    },
    /* 物流中心商品保存 */
    handleSaveDcSpec(val) {
      const postData = {
        defaultQpcStr: val.defaultQpcStr,
        height: val.height,
        length: val.length,
        munit: val.munit,
        qpc: val.qpc,
        productId: this.id,
        qpcStr: val.qpcStr,
        weight: val.weight,
        width: val.width,
        plate: val.plate,
        plateAdvice: val.plateAdvice,
        dcId: this.workingOrg.id
      };
      if (val.id) {
        // 更新
        postData.id = val.id;
        postData.dcId = val.dcId;
        ProductService.updateDcProductQpc(postData)
          .then(res => {
            this.$message.success("编辑成功");
            this.getProductSpec();
          })
          .catch(err => {
            this.$message.error("编辑失败" + err.message);
          });
      } else {
        // 创建
        ProductService.createDcProuctQpc(postData)
          .then(res => {
            this.$message.success("编辑成功");
            this.getProductSpec();
          })
          .catch(err => {
            this.$message.error("编辑失败" + err.message);
          });
      }
    },
    handleDeleteSpec(index, val) {
      this.$confirm("此操作将改变删除该规格, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          if (val.id) {
            if (this.workingOrg.type === "DC") {
              ProductService.deleteDcProductQpc(val.id)
                .then(res => {
                  this.$message.success("删除成功");
                  this.getProductSpec();
                })
                .catch(err => {
                  this.$message.error("删除失败" + err.message);
                });
            } else {
              ProductService.deleteProductQpc(val.id)
                .then(res => {
                  this.$message.success("删除成功");
                  this.getProductSpec();
                })
                .catch(err => {
                  this.$message.error("删除失败" + err.message);
                });
            }
          } else {
            this.specList.splice(index, 1);
          }
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消"
          });
        });
    },
    // 条码相关操作
    addBarcode() {
      const barcode = {
        barcode: "",
        productId: this.id,
        qpcStr: ""
      };
      this.barcodeList.push(barcode);
    },
    handleEditBarcode(index, val) {
      this.barcodeList[index].isEdit = true;
    },
    handleSaveBarcode(val) {
      if (val.id) {
        // 更新
        const postData = {
          barcode: val.barcode,
          id: val.id,
          qpcStr: val.qpcStr,
          version: val.version
        };
        ProductService.updateBarcode(postData)
          .then(res => {
            this.$message.success("编辑成功");
            this.getProductBarcode();
          })
          .catch(err => {
            this.$message.error("编辑失败" + err.message);
          });
      } else {
        const postData = {
          barcode: val.barcode,
          productId: this.id,
          qpcStr: val.qpcStr
        };
        // 创建
        ProductService.createBarcode(postData)
          .then(res => {
            this.$message.success("编辑成功");
            this.getProductBarcode();
          })
          .catch(err => {
            this.$message.error("编辑失败" + err.message);
          });
      }
    },
    handleDeleteBarcode(index, val) {
      this.$confirm("此操作将改变删除该规格, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          if (val.id) {
            ProductService.deleteBarcode(val.id)
              .then(res => {
                this.$message.success("删除成功");
                this.getProductBarcode();
              })
              .catch(err => {
                this.$message.error("删除失败" + err.message);
              });
          } else {
            this.barcodeList.splice(index, 1);
          }
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消"
          });
        });
    },
    setReceiveDefault(val) {
      const self = this;
      ProductService.setReceiveDefault(val.id)
        .then(res => {
          self.$message.success("设置首选收货成功");
          self.getProductVendor();
        })
        .catch(err => {
          this.$message.error("设置失败" + err.message);
        });
    },
    setReturnDefault(val) {
      const self = this;
      ProductService.setReturnDefault(val.id)
        .then(res => {
          self.$message.success("设置首选退货成功");
          self.getProductVendor();
        })
        .catch(err => {
          this.$message.error("设置失败" + err.message);
        });
    },
    setSupplier(val) {
      const self = this;
      ProductService.setSupplier(val.id)
        .then(res => {
          self.$message.success("设置首选供应商成功");
          // self.getProductVendor();
          this.getQueryStatus();
        })
        .catch(err => {
          this.$message.error("设置失败" + err.message);
        });
    },
    // 供应商相关处理
    addVendor() {
      const vendor = {
        defaultReceive: false,
        defaultReceivePrice: 0,
        defaultReturn: false,
        defaultReturnPrice: 0,
        productId: this.id,
        vendorCode: "",
        vendorId: "",
        vendorName: ""
      };
      this.vendorList.push(vendor);
    },
    handleEditVendor(index, val) {
      this.vendorList[index].isEdit = true;
    },
    checkVendorData(val) {
      if (!val.vendorCode) {
        this.$message.error("请选择供应商！");
        return false;
      } else if (!val.defaultReceivePrice) {
        this.$message.error("请填写默认入库价格！");
        return false;
      } else if (Number(val.defaultReceivePrice) < 0) {
        this.$message.error("默认入库价格不能小于0！");
        return false;
      } else if (!val.defaultReturnPrice) {
        this.$message.error("请填写默认退货价格！");
        return false;
      } else if (Number(val.defaultReturnPrice) < 0) {
        this.$message.error("默认退货价格不能小于0！");
        return false;
      } else {
        return true;
      }
    },
    handleSaveVendor(val) {
      if (!this.checkVendorData(val)) {
        return;
      }
      const postData = {
        defaultReceive: val.defaultReceive,
        defaultReceivePrice: val.defaultReceivePrice,
        defaultReturn: val.defaultReturn,
        defaultReturnPrice: val.defaultReturnPrice,
        productId: val.productId,
        vendorCode: val.vendorCode,
        vendorId: val.vendorId,
        vendorName: val.vendorName
      };
      if (val.id) {
        // 更新
        postData.id = val.id;
        postData.version = val.version;
        ProductService.updateVendor(postData)
          .then(res => {
            this.$message.success("编辑成功");
            this.getProductVendor();
          })
          .catch(err => {
            this.$message.error("编辑失败" + err.message);
          });
      } else {
        // 创建
        ProductService.createVendor(postData)
          .then(res => {
            this.$message.success("编辑成功");
            this.getProductVendor();
          })
          .catch(err => {
            this.$message.error("编辑失败" + err.message);
          });
      }
    },
    handleDeleteVendor(index, val) {
      this.$confirm("此操作将改变删除该供应商, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          if (val.id) {
            ProductService.deleteVendor(val.id)
              .then(res => {
                this.$message.success("删除成功");
                this.getProductVendor();
              })
              .catch(err => {
                this.$message.error("删除失败" + err.message);
              });
          } else {
            this.vendorList.splice(index, 1);
          }
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消"
          });
        });
    },
    onVendorSelected(val) {
      this.vendorList[val.index].vendorCode = val.code ? val.code : "";
      this.vendorList[val.index].vendorId = val.id ? val.id : "";
      this.vendorList[val.index].vendorName = val.name ? val.name : "";
    },
    // 分页相关处理
    handleCurrentChange: function(e) {
      if (this.tabActiveName === "qpc") {
        this.qpcPageData.page = Number(e);
        this.getProductSpec();
      } else if (this.tabActiveName === "barcode") {
        this.qpcPageData.page = Number(e);
        this.getProductBarcode();
      } else if (this.tabActiveName === "vendor") {
        this.vendorPageData.page = Number(e);
        this.getProductVendor();
      }
    },
    handleSizeChange: function(e) {
      if (this.tabActiveName === "qpc") {
        this.qpcPageData.pageSize = Number(e);
        this.qpcPageData.page = 1;
        this.getProductSpec();
      } else if (this.tabActiveName === "barcode") {
        this.qpcPageData.pageSize = Number(e);
        this.qpcPageData.page = 1;
        this.getProductBarcode();
      } else if (this.tabActiveName === "vendor") {
        this.vendorPageData.pageSize = Number(e);
        this.vendorPageData.page = 1;
        this.getProductVendor();
      }
    }
  },
  created() {
    this.getQueryStatus();
  },
  filters: {
    filterShelfLifeType(val) {
      if (val === "NO_CARE") {
        return "不管理保质期";
      } else if (val === "VALID_DATE") {
        return "按到效期";
      } else if (val === "PRODUCT_DATE") {
        return "按生产日期";
      } else {
        return "";
      }
    },
    filterBoolean(val) {
      if (val === true) {
        return "是";
      } else if (val === false) {
        return "否";
      } else {
        return "";
      }
    },
    filterPutawayBin(val) {
      if (val === "PICKUPBIN") {
        return "拣货位";
      } else if (val === "STORAGEBIN") {
        return "存储位";
      } else if (val === "FIRSTPICKUP") {
        return "优先拣货位";
      } else {
        return "";
      }
    },
    filterSettleUnit(val) {
      if (val === "QTY") {
        return "数量";
      } else if (val === "WEIGHT") {
        return "重量";
      } else {
        return "";
      }
    },
    setPackTppe(val) {
      // 可选值：ORIGINAL（原箱）、STANDAD（标准箱）
      if (val === "ORIGINAL") {
        return "原箱";
      } else if (val === "STANDAD") {
        return "标准箱";
      } else {
        return "";
      }
    }
  },
  components: {
    vendorSelect,
    productCategorySelect,
    systemLog,
    productSpecSelect,
    pickareaSelect,
    pickBinSelect
  }
};
</script>

<style lang="scss" scoped>
@import "src/styles/mixin.scss";
.product-edit {
  .head {
    background: #fff;
    padding: 15px 12px;
    border-radius: 12px;
    border: 1px #eee solid;
    display: flex;
    justify-content: space-between;
  }
  .head-title {
    display: flex;
    justify-content: left;
  }
  .info-content {
    background: #fff;
    border-radius: 12px;
    padding: 15px 12px;
  }
  .info-box {
    margin: 4px 0;
    font-size: 12px;
    display: flex;
    justify-content: left;
  }
  .info-title {
    margin: 12px 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .height20 {
    height: 20px;
  }
  .weight200 {
    width: 200px;
  }
  .edit-box {
    font-size: 14px;
    cursor: pointer;
    color: #409eff;
    display: flex;
    align-items: center;
    > span {
      font-size: 12px;
      margin-left: 2px;
    }
  }
}
</style>
<style lang="scss">
.product-edit {
  @import "src/styles/mixin.scss";
  @include elTable;
  .el-icon-circle-plus-outline {
    font-size: 14px;
  }
  .el-table tr,
  .el-table th {
    height: 32px !important;
    // line-height: 32px !important;
  }
}
</style>




