/**
 * 权限常量 
 */
export default {
  /** ******************************* 系统组件 *******************************************/
  SYS: "sys",

  /**
   * 系统组件-菜单管理
   */
  SYS_MENU: "sys:menu",
  SYS_MENU_VIEW: "sys:menu:view",
  SYS_MENU_CREATE: "sys:menu:create",
  SYS_MENU_UPDATE: "sys:menu:update",
  SYS_MENU_REMOVE: "sys:menu:remove",

  /**
   * 系统组件-角色
   */
  SYS_ROLE: "sys:role",
  SYS_ROLE_VIEW: "sys:role:view",
  SYS_ROLE_CREATE: "sys:role:create",
  SYS_ROLE_UPDATE: "sys:role:update",
  SYS_ROLE_REMOVE: "sys:role:remove",
  SYS_ROLE_EDIT_PERMISSION: "sys:role:edit_permission",

  /**
   * 系统组件-组织
   */
  SYS_ORG: "sys:org",
  SYS_ORG_VIEW: "sys:org:view",
  SYS_ORG_CREATE: "sys:org:create",
  SYS_ORG_UPDATE: "sys:org:update",
  SYS_ORG_UPDATE_UPPER: "sys:org:updateUpper",
  SYS_ORG_DISABLE: "sys:org:disable",
  SYS_ORG_ENABLE: "sys:org:enable",
  SYS_ORG_EDIT_ROLE: "sys:org:edit_role",

  /**
   * 系统组件-用户
   */
  SYS_USER: "sys:user",
  SYS_USER_VIEW: "sys:user:view",
  SYS_USER_CREATE: "sys:user:create",
  SYS_USER_UPDATE: "sys:user:update",
  SYS_USER_UPDATE_ORG: "sys:user:update_org",
  SYS_USER_DISABLE: "sys:user:disable",
  SYS_USER_ENABLE: "sys:user:enable",
  SYS_USER_RESET_PWD: "sys:user:reset_pwd",
  SYS_USER_EDIT_ROLE: "sys:user:edit_role",
  SYS_USER_EXPORT: "sys:user:export",

  /**
   * 系统组件-监控管理
   */
  SYS_MONITOR: "sys:monitor",
  /**
   * 系统组件-监控管理-缓存管理
   */
  SYS_MONITOR_CAE: "sys:monitor:cache",

  /**
   * 系统组件-监控管理-SQL管理
   */
  SYS_MONITOR_DRUID: "sys:monitor:druid",

  /**
   * 系统组件-上传文件
   */
  // SYS_DFS_UPLOAD: "sys:dfs:upload",

  /**
   * 系统组件-自定义服务通知模块
   */
  SYS_NOTIFY: "sys:notify",
  SYS_NOTIFY_CREATE: "sys:notify:create",
  SYS_NOTIFY_UPDATE: "sys:notify:update",
  SYS_NOTIFY_SUBMIT: "sys:notify:submit",
  SYS_NOTIFY_ABORT: "sys:notify:abort",
  SYS_NOTIFY_VIEW: "sys:notify:view",
  SYS_NOTIFY_SYS_EDIT: "sys:notify:sys:edit",

  /**
   * 系统组件-系统配置项
   */
  SYS_OPTIONS_UPDATE: "sys:options:update",
  SYS_OPTIONS_VIEW: "sys:options:view",

  /**
   * 系统组件-上传文件
   */
  // SYS_DFS_UPLOAD: "sys:dfs:upload",
  // SYS_OPTIONS_UPDATE: "sys:options:update",
  /**
   * 物流中心模块
   */
  SYS_DC: "sys:dc",
  SYS_DC_CREATE: "sys:dc:create",
  SYS_DC_UPDATE: "sys:dc:update",
  SYS_DC_VIEW: "sys:dc:view",
  SYS_DC_DISABLE: "sys:dc:disable",
  SYS_DC_ENABLE: "sys:dc:enable",

    /**
   * 货位管理模块
   */
  WMS_BIN: "wms:bin",
  WMS_BIN_VIEW: "wms:bin:view",
  WMS_BIN_CREATE: "wms:bin:create",
  WMS_BIN_UPDATE: "wms:bin:update",
  WMS_BIN_DELETE: "wms:bin:delete",
  /**
   * 系统组件-日志查询
   */
  SYS_LOG: "sys:log",
  SYS_LOG_VIEW: "sys:log:view",

  REPORT: "report",
  /**
   * 报表组件-商品
   */
  REPORT_PRODUCT: "report:product",
  /**
   * 商品排行榜
   */
  REPORT_PRODUCT_LIST_VIEW: "report:product:list_view",
  /**
   * 商品滞销列表
   */
  REPORT_PRODUCT_UNSALE_LIST_VIEW: "report:product:unsale_list_view",
  /**
   * 待自提商品列表
   */
  REPORT_PRODUCT_PENDING_LIST_VIEW: "report:product:penging_list_view",
  /**
   * 报表组件-订单
   */
  REPORT_ORDER: "report:order",
  /**
   * 分享订单报表列表
   */
  REPORT_ORDER_SHARE_LIST: "report:order:share_list",
  /**
   * 报表组件-门店销售额
   */
  REPORT_STORE_SALES: "report:store_sales",
  /**
   * 报表组件-门店销售额-门店销售额报表详情
   */
  REPORT_STORE_SALES_VIEW: "report:store_sales:view",
  /**
   * 报表组件-门店客流量
   */
  REPORT_MEMBERS_FLOW: "report:members_flow",
  /**
   * 报表组件-查看门店客流量
   */
  REPORT_MEMBERS_FLOW_VIEW: "report:members_flow:view",
  /**
   * 报表组件-动态报表
   */
  REPORT_DYNAMIC: "report:dynamic",
  REPORT_DYNAMIC_DESIGNER: "report:dynamic:designer",

  /**
   * 商品模块
   */
  PRODUCT: "product",
  /**
   * 商品模块
   */
  PRODUCT_PRODUCT: "product:product",
  PRODUCT_PRODUCT_VIEW: "product:product:view",
  PRODUCT_PRODUCT_CREATE: "product:product:create",
  PRODUCT_PRODUCT_UPDATE: "product:product:update",
  PRODUCT_PRODUCT_ENABLE: "product:product:enable",
  PRODUCT_PRODUCT_DISABLE: "product:product:disable",
  /**
   * 商品规格明细模块
   */
  PRODUCT_QPC: "product:qpc",
  PRODUCT_QPC_VIEW: "product:qpc:view",
  PRODUCT_QPC_CREATE: "product:qpc:create",
  PRODUCT_QPC_UPDATE: "product:qpc:update",
  PRODUCT_QPC_REMOVE: "product:qpc:remove",
  PRODUCT_QPC_SET_DEFAULT: "product:qpc:set_default",
  PRODUCT_QPC_CANCEL_DEFAULT: "product:qpc:cancel_default",
  /**
   * 商品条码模块
   */
  PRODUCT_BARCODE: "product:barcode",
  PRODUCT_BARCODE_VIEW: "product:barcode:view",
  PRODUCT_BARCODE_CREATE: "product:barcode:create",
  PRODUCT_BARCODE_UPDATE: "product:barcode:update",
  PRODUCT_BARCODE_REMOVE: "product:barcode:remove",

  /**
   * 商品类别模块
   */
  PRODUCT_CATEGORY: "product:category",
  PRODUCT_CATEGORY_VIEW: "product:category:view",
  PRODUCT_CATEGORY_CREATE: "product:category:create",
  PRODUCT_CATEGORY_UPDATE: "product:category:update",
  PRODUCT_CATEGORY_ENABLE: "product:category:enable",
  PRODUCT_CATEGORY_DISABLE: "product:category:disable",
  PRODUCT_CATEGORY_REMOVE: "product:category:remove",
  /**
   * 商品供应商模块
   */
  PRODUCT_SUPPLIER: "product:supplier",
  PRODUCT_SUPPLIER_CREATE: "product:supplier:create",
  PRODUCT_SUPPLIER_UPDATE: "product:supplier:update",
  PRODUCT_SUPPLIER_VIEW: "product:supplier:view",
  PRODUCT_SUPPLIER_MODLIFY: "product:supplier:modlify",

  /**
   * 商品供应商关系明细模块
   */
  PRODUCT_VENDOR: "product:vendor",
  PRODUCT_VENDOR_VIEW: "product:vendor:view",
  PRODUCT_VENDOR_CREATE: "product:vendor:create",
  PRODUCT_VENDOR_UPDATE: "product:vendor:update",
  PRODUCT_VENDOR_REMOVE: "product:vendor:remove",
  PRODUCT_VENDOR_SET_RECEIVE_DEFAULT: "product:vendor:set_receive_default",
  PRODUCT_VENDOR_SET_RETURN_DEFAULT: "product:vendor:cancel_return_default",

    /**
   * 供应商退货单模块
   */
  WMS_VENDOR_RETURN_BILL: "wms:vendor_return_bill",
  WMS_VENDOR_RETURN_BILL_VIEW: "wms:vendor_return_bill:view",
  WMS_VENDOR_RETURN_BILL_AUDIT: "wms:vendor_return_bill:audit",
  WMS_VENDOR_RETURN_BILL_FINISH: "wms:vendor_return_bill:finish",

  /**
   * 商品业务模块
   */
  PRODUCT_BUSINESS: "product:business",
  PRODUCT_BUSINESS_VIEW: "product:business:view",
  PRODUCT_BUSINESS_CREATE: "product:business:create",
  PRODUCT_BUSINESS_UPDATE: "product:business:update",
  PRODUCT_BUSINESS_REMOVE: "product:business:remove",
  /**
   * 物流中心商品规格明细模块
   */
  PRODUCT_DC_QPC: "product:dc_qpc",
  PRODUCT_DC_QPC_VIEW: "product:dc_qpc:view",
  PRODUCT_DC_QPC_CREATE: "product:dc_qpc:create",
  PRODUCT_DC_QPC_UPDATE: "product:dc_qpc:update",
  PRODUCT_DC_QPC_REMOVE: "product:dc_qpc:remove",
  /**
   * 资料模块
   */
  WMS: "wms",

  // WMS_PICKAREA: "wms:pickarea",
  // WMS_PICKAREA_CREATE: "wms:pickarea:create",
  // WMS_PICKAREA_VIEW: "wms:pickarea_view",
  // WMS_PICKAREA_UPDATE: "wms:pickarea_update",
  // WMS_PICKAREA_DELETE: "wms:pickarea_delete",

  /**
   * 容器类型
   */
  WMS_CONTAINER_TYPE: "wms:container:type",
  WMS_CONTAINER_TYPE_CREATE: "wms:container:type:create",
  WMS_CONTAINER_TYPE_UPDATE: "wms:container:type:update",
  WMS_CONTAINER_TYPE_VIEW: "wms:container:type:view",
  WMS_CONTAINER_TYPE_MODIFY: "wms:container:type:modify",

  /**
   * 容器模块
   */
  WMS_CONTAINER: "wms:container",
  WMS_CONTAINER_CREATE: "wms:container:create",
  WMS_CONTAINER_VIEW: "wms:container:view",

    /**
   * 容器拆并单模块
   */
  WMS_CONTAINER_MERGER_BILL: "wms:container_merger_bill",
  WMS_CONTAINER_MERGER_BILL_VIEW: "wms:container_merger_bill:view",
  WMS_CONTAINER_MERGER_BILL_BOX_MERGER: "wms:container_merger_bill:box_merger",
  WMS_CONTAINER_MERGER_BILL_PRODUCT_MERGER: "wms:container_merger_bill:product_merger",

  /**
   * 仓区模块
   */
  WMS_WAREHOUSE: "wms:warehouse",
  WMS_WAREHOUSE_CREATE: "wms:warehouse:create",
  WMS_WAREHOUSE_UPDATE: "wms:warehouse:update",
  WMS_WAREHOUSE_VIEW: "wms:warehouse:view",
  WMS_WAREHOUSE_MODIFY: "wms:warehouse:modify",
  WMS_WAREHOUSE_DELETE: "wms:warehouse:delete",

   /**
   * 入库订单模块
   */
  WMS_ORDERBILL: "wms:orderbill",
  WMS_ORDERBILL_VIEW: "wms:orderbill:view",
  WMS_ORDERBILL_ARRIVE: "wms:orderbill:arrive",
  WMS_ORDERBILL_FINISH: "wms:orderbill:finish",  

  /**
   * 收货装箱单模块
   */
  WMS_RECEIVE_BILL: "wms:receive_bill",
  WMS_RECEIVE_BILL_VIEW: "wms:receive_bill:view",
  WMS_RECEIVE_BILL_RECEIVE: "wms:receive_bill:receive",
  WMS_RECEIVE_BILL_FAST_RECEIVE: "wms:receive_bill:fast_receive",

   /**
   * 网格仓分播单模块
   */
  WMS_SOWING_PICK_Bill: "wms:sowing_pick_bill",
  WMS_SOWING_PICK_Bill_VIEW: "wms:sowing_pick_bill:view",
  WMS_SOWING_PICK_Bill_CREATE: "wms:sowing_pick_bill:pick",

  /**
   * 装笼单模块
   */
  WMS_LOAD_PALLET: "wms:load_pallet",
  WMS_LOAD_PALLET_VIEW: "wms:load_pallet:view",

  /**
   * 质检类型
   */
  WMS_QUALITY_INSPECTION_ORDER: "wms:quality-inspection-order",
  WMS_QUALITY_INSPECTION_ORDER_CREATE: "wms:quality-inspection-order:create",
  WMS_QUALITY_INSPECTION_ORDER_UPDATE: "wms:quality-inspection-order:update",
  WMS_QUALITY_INSPECTION_ORDER_VIEW: "wms:quality-inspection-order:view",
  
  /**
   * 仓区作业单
   */
  WMS_OPERATE_BILL: "wms:operate_bill",
  WMS_OPERATE_BILL_VIEW: "wms:operate_bill:view",

  /**
   * 上架单模块
   */
  WMS_PUTAWAY_BILL: "wms:putaway_bill",
  WMS_PUTAWAY_BILL_VIEW: "wms:putaway_bill:view",
  WMS_PUTAWAY_BILL_PUTAWAY: "wms:putaway_bill:putaway",
  WMS_PUTAWAY_BILL_FINISHED: "wms:putaway_bill:finished",

  /**
   * 码头模块
   */
  WMS_DOCK: "wms:dock",
  WMS_DOCK_CREATE: "wms:dock:create",
  WMS_DOCK_UPDATE: "wms:dock:update",
  WMS_DOCK_VIEW: "wms:dock:view",
  WMS_DOCK_MODIFY: "wms:dock:modify",

  /**
   * 货位类型模块
   */
  WMS_BINTYPE: "wms:bintype",
  WMS_BINTYPE_VIEW: "wms:bintype:view",
  WMS_BINTYPE_CREATE: "wms:bintype:create",
  WMS_BINTYPE_UPDATE: "wms:bintype:update",
  WMS_BINTYPE_DELETE: "wms:bintype:remove",

  /**
   * 存储分区
   */
  WMS_STORAGEAREA: "wms:storagearea",
  WMS_STORAGEAREA_CREATE: "wms:storagearea:create",
  WMS_STORAGEAREA_UPDATE: "wms:storagearea:update",
  WMS_STORAGEAREA_VIEW: "wms:storagearea:view",
  WMS_STORAGEAREA_DELETE: "wms:storagearea:delete",

  /**
   * 拣货分区
   */
  WMS_PICKAREA: "wms:pickarea",
  WMS_PICKAREA_CREATE: "wms:pickarea:create",
  WMS_PICKAREA_VIEW: "wms:pickarea:view",
  WMS_PICKAREA_UPDATE: "wms:pickarea:update",
  WMS_PICKAREA_DELETE: "wms:pickarea:delete",

   /**
   * 用户拣货分区
   */
  WMS_USER_PICKAREA: "wms:user:pickarea",
  WMS_USER_PICKAREA_CREATE: "wms:user:pickarea:create",
  WMS_USER_PICKAREA_VIEW: "wms:user:pickarea:view",
  WMS_USER_PICKAREA_UPDATE: "wms:user:pickarea:update",
  WMS_USER_PICKAREA_DELETE: "wms:user:pickarea:delete",

   /**
   * 拣货顺序方案
   */
  WMS_PICKORDER: "wms:pickorder",
  WMS_PICKORDER_CREATE: "wms:pickorder:create",
  WMS_PICKORDER_UPDATE: "wms:pickorder:update",
  WMS_PICKORDER_VIEW: "wms:pickorder:view",
  WMS_PICKORDER_MODIFY: "wms:pickorder:modify",
  WMS_PICKORDER_DELETE: "wms:pickorder:remove",

  /**
   * 查看自提点接口
   */
  WMS_STORE: "wms:store",
  WMS_STORE_VIEW: "wms:store:view",

  /**
   * 盘点
   */
  STOCK_TAKE_BILL: "stock:take_bill",
  STOCK_TAKE_BILL_VIEW: "stock:take_bill:view",
  STOCK_TAKE_BILL_CREATE: "stock:take_bill:create",
  STOCK_TAKE_BILL_UPDATE: "stock:take_bill:update",

  /**
   * 拣货单模块
   */
  WMS_PICK_BILL: "wms:pick_bill",
  WMS_PICK_BILL_VIEW: "wms:pick_bill:view",
  WMS_PICK_BILL_CREATE: "wms:pick_bill:create",
  WMS_PICK_BILL_UPDATE: "wms:pick_bill:receive",

  /**
   * 拣货单模块
   */
  WMS_PICK_BILL_ITEM: "wms:pick_bill_item",
  WMS_PICK_BILL_ITEM_VIEW: "wms:pick_bill_item:view",
  WMS_PICK_BILL_ITEM_CREATE: "wms:pick_bill_item:create",
  WMS_PICK_BILL_ITEM_UPDATE: "wms:pick_bill_item:receive",

    /**
   * 查看区块
   */
  WMS_BLOCK: "wms:block",
  WMS_BLOCK_VIEW: "wms:block:view",

  /**
   * 库存模块
   */
  STOCK: "stock",
  STOCK_STOCK: "stock:stock",
  STOCK_STOCK_VIEW: "stock:stock:view",

  /**
   * 修改申请单模块
   */
  STOCK_UPDATE_INFO_BILL: "stock:update_info_bill",
  STOCK_UPDATE_INFO_BILL_VIEW: "stock:update_info_bill:view",
  STOCK_UPDATE_INFO_BILL_CREATE: "stock:update_info_bill:create",
  STOCK_UPDATE_INFO_BILL_AUDIT: "stock:update_info_bill:audit",

  // STOCK_TAKE_BILL: "stock:take_bill",
  // STOCK_TAKE_BILL_VIEW: "stock:take_bill:view",
  // STOCK_TAKE_BILL_CREATE: "stock:take_bill:create",
  // STOCK_TAKE_BILL_UPDATE: "stock:take_bill:update",

  /**
   * 库存锁定解锁模块
   */
  STOCK_LOCK_BILL: "stock:lock_bill",
  STOCK_LOCK_BILL_CREATE: "stock:lock_bill:create",
  STOCK_LOCK_BILL_UPDATE: "stock:lock_bill:update",
  STOCK_LOCK_BILL_VIEW: "stock:lock_bill:view",
  STOCK_LOCK_BILL_DELETE: "stock:lock_bill:delete",
  /** ******************************* 微信小程序组件 *******************************************/

  /**
   * 微信小程序组件-微信小程序账户管理
   */
  WXA_ACCOUNT: "wxa:account",
  WXA_ACCOUNT_CREATE: "wxa:account:create",
  WXA_ACCOUNT_UPDATE: "wxa:account:update",
  WXA_ACCOUNT_VIEW: "wxa:account:view",
  WXA_ACCOUNT_DELETE: "wxa:account:delete",

  /**
   * 系统组件-APP版本管理
   */
  SYS_APP: "sys:app",
  SYS_APP_VIEW: "sys:app:view",
  SYS_APP_CREATE: "sys:app:create",
  SYS_APP_UPDATE: "sys:app:update",
  SYS_APP_REMOVE: "sys:app:remove",

    /**
   * 损耗单
   */
  WMS_DECINVBILL: "wms:decinvbill",
  WMS_DECINVBILL_CREATE: "wms:decinvbill:create",
  WMS_DECINVBILL_UPDATE: "wms:decinvbill:update",
  WMS_DECINVBILL_VIEW: "wms:decinvbill:view",
  WMS_DECINVBILL_AUDIT: "wms:decinvbill:audit",
  WMS_DECINVBILL_DELETE: "wms:decinvbill:delete",
  /**
   * 溢余单
   */
  WMS_INCINVBILL: "wms:incinvbill",
  WMS_INCINVBILL_CREATE: "wms:incinvbill:create",
  WMS_INCINVBILL_UPDATE: "wms:incinvbill:update",
  WMS_INCINVBILL_VIEW: "wms:incinvbill:view",
  WMS_INCINVBILL_AUDIT: "wms:incinvbill:audit",
  WMS_INCINVBILL_DELETE: "wms:incinvbill:delete",
  /**
   * 单据类型
   */
  WMS_PRETYPE: "wms:pretype",
  WMS_PRETYPE_CREATE: "wms:pretype:create",
  WMS_PRETYPE_UPDATE: "wms:pretype:update",
  WMS_PRETYPE_DELETE: "wms:pretype:delete",
  WMS_PRETYPE_VIEW: "wms:pretype:view",
  /**
   * 移库模块
   */
  WMS_MOVE_BILL: "wms:move-bill",
  WMS_MOVE_BILL_CREATE: "wms:move-bill:create",
  WMS_MOVE_BILL_UPDATE: "wms:move-bill:update",
  WMS_MOVE_BILL_VIEW: "wms:move-bill:view",
  WMS_MOVE_BILL_DELETE: "wms:move-bill:delete"
}
