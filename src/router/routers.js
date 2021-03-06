import Layout from '@/views/layout/Layout'
import AModule from '@/components/module'
import PermIds from "@/api/permissionIds";

/**
 * hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
 * path: '',
 * query: {},                     directly pass to router-link  
 * alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
 *                                if not set alwaysShow, only more than one route under the children
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noredirect           if `redirect:noredirect` will no redirct in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
 *   title: 'title'               the name show in submenu and breadcrumb (recommend set)
 *   icon: 'svg-name'             the icon show in the sidebar,
 * }
 */

/** 静态路由 */
export const constantRouterMap = [{
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [{
      path: '/redirect/:path(.*)',
      component: () => import('@/views/redirect/index')
    }]
  }, {
    path: '/login',
    component: () =>
      import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/404',
    component: () =>
      import('@/views/404'),
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    name: 'Dashboard',
    hidden: true,
    children: [{
      path: 'dashboard',
      name: 'dashboard',
      component: () =>
        import('@/views/dashboard/index'),
      meta: {
        title: '首页',
        affix: true
      }
    }]
  }
]

/**
 * 系统管理包
 */
const SystemPackage = {
  path: '/sys',
  component: Layout,
  name: 'System',
  alwaysShow: true,
  meta: {
    title: '系统管理',
    icon: 'system'
  },
  children: [{
    path: 'user',
    name: 'User',
    component: AModule,
    meta: {
      title: '用户',
      icon: 'table',
      permission: PermIds.SYS_USER
    },
    children: [{
      path: '',
      name: 'UserList',
      component: () =>
        import('@/views/sys/user/index'),
      hidden: true,
      meta: {
        title: '用户',
        icon: 'table',
        permission: PermIds.SYS_USER_VIEW
      }
    }, {
      path: 'add',
      name: 'UserAdd',
      component: () =>
        import('@/views/sys/user/userAdd'),
      hidden: true,
      meta: {
        title: '新增用户',
        icon: 'table',
        permission: PermIds.SYS_USER_CREATE
      }
    }, {
      path: 'edit',
      name: 'UserEdit',
      component: () =>
        import('@/views/sys/user/userAdd'),
      hidden: true,
      meta: {
        title: '编辑',
        icon: 'table',
        permission: PermIds.SYS_USER_UPDATE
      }
    }]
  },
  {
    path: 'role',
    name: 'Role',
    component: AModule,
    meta: {
      title: '角色',
      icon: 'table',
      permission: PermIds.SYS_ROLE
    },
    children: [{
      path: '',
      name: 'RoleList',
      hidden: true,
      component: () =>
        import('@/views/sys/role/index'),
      meta: {
        title: '角色',
        icon: 'table',
        permission: PermIds.SYS_ROLE_VIEW
      }
    }, {
      path: 'add',
      name: 'RoleAdd',
      hidden: true,
      component: () =>
        import('@/views/sys/role/roleAdd'),
      meta: {
        title: '新增角色',
        icon: 'table',
        permission: PermIds.SYS_ROLE_CREATE
      }
    }, {
      path: 'authorManage',
      name: 'AuthorManage',
      hidden: true,
      component: () =>
        import('@/views/sys/role/authorManage'),
      meta: {
        title: '权限管理',
        icon: 'table',
        permission: PermIds.SYS_ROLE_EDIT_PERMISSION
      }
    }]
  },
  {
    path: 'org',
    name: 'Org',
    component: AModule,
    meta: {
      title: '组织',
      icon: 'table',
      permission: PermIds.SYS_ORG
    },
    children: [{
      path: '',
      name: 'OrgList',
      hidden: true,
      component: () =>
        import('@/views/sys/org/index'),
      meta: {
        title: '组织列表',
        icon: 'table',
        permission: PermIds.SYS_ORG_VIEW
      }
    }, {
      path: 'add',
      name: 'OrgAdd',
      hidden: true,
      component: () =>
        import('@/views/sys/org/orgAdd'),
      meta: {
        title: '新增组织',
        icon: 'table',
        permission: PermIds.SYS_ORG_CREATE
      }
    }]
  }, {
    path: 'sysConfigure',
    name: 'SysConfigure',
    component: AModule,
    meta: {
      title: '系统配置',
      icon: 'table',
      permission: PermIds.SYS_OPTIONS_VIEW
    },
    children: [{
      path: '',
      name: 'SysConfigure',
      component: () =>
        import('@/views/sys/configure/sysConfigure'),
      hidden: true,
      meta: {
        title: "系统配置",
        icon: 'table',
        permission: PermIds.SYS_OPTIONS_VIEW
      }
    }]
  }
  ]
}

/**
 * 基础资料管理包
 */

const BasicInfoPackage = {
  path: '/basicinfo',
  component: Layout,
  name: 'BasicInfo',
  alwaysShow: true,
  meta: {
    title: '基本资料',
    icon: 'basic-info'
  },
  children: [
    {
      path: "dc",
      name: "Dc",
      component: AModule,
      meta: {
        title: '物流中心',
        icon: 'table',
        permission: PermIds.SYS_DC
      },
      children: [{
        path: "",
        name: "DcView",
        component: () =>
          import('@/views/basic-info/dc/index'),
        hidden: true,
        meta: {
          title: '物流中心',
          icon: 'table',
          permission: PermIds.SYS_DC_VIEW
        }
      }, {
        path: "edit",
        name: "DcEdit",
        component: () =>
          import('@/views/basic-info/dc/edit'),
        hidden: true,
        meta: {
          title: '查看物流中心',
          icon: 'table',
          permission: PermIds.SYS_DC_VIEW
        }
      }, {
        path: "add",
        name: "DcAdd",
        component: () =>
          import('@/views/basic-info/dc/edit'),
        hidden: true,
        meta: {
          title: '新建物流中心',
          icon: 'table',
          permission: PermIds.SYS_DC_CREATE
        }
      }]
    },
    {
      path: "reseau",
      name: "Reseau",
      component: AModule,
      meta: {
        title: '网格仓信息',
        icon: 'table'
        // permission: PermIds.SYS_DC
      },
      children: [{
        path: "",
        name: "ReseauView",
        component: () =>
          import('@/views/basic-info/reseau/index'),
        hidden: true,
        meta: {
          title: '网格仓信息',
          icon: 'table'
          // permission: PermIds.SYS_DC_VIEW
        }
      }, {
        path: "edit",
        name: "ReseauEdit",
        component: () =>
          import('@/views/basic-info/reseau/edit'),
        hidden: true,
        meta: {
          title: '查看网格仓信息',
          icon: 'table'
          // permission: PermIds.SYS_DC_VIEW
        }
      }, {
        path: "add",
        name: "ReseauAdd",
        component: () =>
          import('@/views/basic-info/reseau/edit'),
        hidden: true,
        meta: {
          title: '新建物流中心',
          icon: 'table'
          // permission: PermIds.SYS_DC_CREATE
        }
      }]
    },
    {
      path: "block",
      name: "Block",
      component: AModule,
      meta: {
        title: '区块',
        icon: 'table',
        permission: PermIds.WMS_BLOCK
      },
      children: [{
        path: "",
        name: "BlockView",
        component: () =>
          import('@/views/basic-info/block/index'),
        hidden: true,
        meta: {
          title: '区块',
          icon: 'table',
          permission: PermIds.WMS_BLOCK_VIEW
        }
      }]
    },
    {
    path: "suppliers",
    name: "Suppliers",
    component: AModule,
    meta: {
      title: '供应商',
      icon: 'table',
      permission: PermIds.PRODUCT_SUPPLIER
    },
    children: [{
      path: "",
      name: "SuppliersView",
      component: () =>
        import('@/views/basic-info/suppliers/index'),
      hidden: true,
      meta: {
        title: '供应商',
        icon: 'table',
        permission: PermIds.PRODUCT_SUPPLIER_VIEW
      }
    }, {
      path: "edit",
      name: "SuppliersEdit",
      component: () =>
        import('@/views/basic-info/suppliers/edit'),
      hidden: true,
      meta: {
        title: '查看供应商',
        icon: 'table',
        permission: PermIds.PRODUCT_SUPPLIER_VIEW
      }
    }, {
      path: "add",
      name: "SuppliersAdd",
      component: () =>
        import('@/views/basic-info/suppliers/add'),
      hidden: true,
      meta: {
        title: '新建供应商',
        icon: 'table',
        permission: PermIds.PRODUCT_SUPPLIER_CREATE
      }
    }]
    }, {
      path: "category",
      name: "Category",
      component: AModule,
      meta: {
        title: '商品类别',
        icon: 'table',
        permission: PermIds.PRODUCT_CATEGORY
      },
      children: [{
        path: "",
        name: "CategoryView",
        component: () =>
          import('@/views/basic-info/category/index'),
        hidden: true,
        meta: {
          title: '商品类别',
          icon: 'table',
          permission: PermIds.PRODUCT_CATEGORY_VIEW
        }
      }, {
        path: "edit",
        name: "CategoryEdit",
        component: () =>
          import('@/views/basic-info/category/edit'),
        hidden: true,
        meta: {
          title: '查看商品类别',
          icon: 'table',
          permission: PermIds.PRODUCT_CATEGORY_VIEW
        }
      }, {
        path: "add",
        name: "CategoryAdd",
        component: () =>
          import('@/views/basic-info/category/add'),
        hidden: true,
        meta: {
          title: '新建商品类别',
          icon: 'table',
          permission: PermIds.PRODUCT_CATEGORY_CREATE
        }
      }]
    }, {
      path: "product",
      name: "Product",
      component: AModule,
      meta: {
        title: '商品',
        icon: 'table',
        permission: PermIds.PRODUCT_PRODUCT
      },
      children: [
        {
        path: "",
        name: "productView",
        component: () =>
          import('@/views/basic-info/product/index'),
        hidden: true,
        meta: {
          title: '商品',
          icon: 'table',
          permission: PermIds.PRODUCT_PRODUCT
        }
      }, {
        path: "edit",
        name: "productEdit",
        component: () =>
          import('@/views/basic-info/product/edit'),
        hidden: true,
        meta: {
          title: '查看商品',
          icon: 'table',
          permission: PermIds.PRODUCT_PRODUCT_VIEW
        }
      }, {
        path: "add",
        name: "productAdd",
        component: () =>
          import('@/views/basic-info/product/add'),
        hidden: true,
        meta: {
          title: '新建商品',
          icon: 'table',
          permission: PermIds.PRODUCT_PRODUCT_CREATE
        }
      }] 
    }, {
      path: "containertype",
      name: "ContainerType",
      component: AModule,
      meta: {
        title: '容器类型',
        icon: 'table',
        permission: PermIds.WMS_CONTAINER_TYPE
      },
      children: [{
        path: "",
        name: "ContainerTypeView",
        component: () =>
          import('@/views/basic-info/container-type/index'),
        hidden: true,
        meta: {
          title: '容器类型',
          icon: 'table',
          permission: PermIds.WMS_CONTAINER_TYPE_VIEW
        }
      }, {
        path: "edit",
        name: "ContainerTypeEdit",
        component: () =>
          import('@/views/basic-info/container-type/edit'),
        hidden: true,
        meta: {
          title: '查看容器类型',
          icon: 'table',
          permission: PermIds.WMS_CONTAINER_TYPE_VIEW
        }
      }, {
        path: "add",
        name: "ContainerTypeAdd",
        component: () =>
          import('@/views/basic-info/container-type/add'),
        hidden: true,
        meta: {
          title: '新建容器类型',
          icon: 'table',
          permission: PermIds.WMS_CONTAINER_TYPE_CREATE
        }
      }]
    }, 
    {
      path: "container",
      name: "Container",
      component: AModule,
      meta: {
        title: '容器',
        icon: 'table',
        permission: PermIds.WMS_CONTAINER
      },
      children: [
        {
        path: "",
        name: "View",
        component: () =>
          import('@/views/basic-info/container/index'),
        hidden: true,
        meta: {
          title: '容器',
          icon: 'table',
          permission: PermIds.WMS_CONTAINER_VIEW
        }
      }, {
        path: "edit",
        name: "Edit",
        component: () =>
          import('@/views/basic-info/container/edit'),
        hidden: true,
        meta: {
          title: '查看容器',
          icon: 'table',
          permission: PermIds.WMS_CONTAINER_VIEW
        }
      }, {
        path: "add",
        name: "Add",
        component: () =>
          import('@/views/basic-info/container/add'),
        hidden: true,
        meta: {
          title: '新建容器',
          icon: 'table',
          permission: PermIds.WMS_CONTAINER_CREATE
        }
      }] 
    }, 
    {
      path: "accumulpoint",
      name: "Accumulpoint",
      component: AModule,
      meta: {
        title: '团点',
        icon: 'table',
        permission: PermIds.WMS_STORE
      },
      children: [
        {
        path: "",
        name: "accumulpointView",
        component: () =>
          import('@/views/basic-info/accumulpoint/index'),
        hidden: true,
        meta: {
          title: '团点',
          icon: 'table',
          permission: PermIds.WMS_STORE_VIEW
        }
      }] 
    }
  ]
}

/**
 * 仓储资料管理包
 */
const StorageInfoPackage = {
  path: '/storageinfo',
  component: Layout,
  name: 'StorageInfo',
  alwaysShow: true,
  meta: {
    title: '仓储资料',
    icon: 'storage-info'
  },
  children: [
    {
      path: "wrh",
      name: "Warehouse",
      component: AModule,
      meta: {
        title: '仓区',
        icon: 'table',
        permission: PermIds.WMS_WAREHOUSE
      },
      children: [
        {
        path: "",
        name: "View",
        component: () =>
          import('@/views/storage-info/wrh/index'),
        hidden: true,
        meta: {
          title: '仓区',
          icon: 'table',
          permission: PermIds.WMS_WAREHOUSE_VIEW
        }
      }, {
        path: "edit",
        name: "Edit",
        component: () =>
          import('@/views/storage-info/wrh/edit'),
        hidden: true,
        meta: {
          title: '查看仓区',
          icon: 'table',
          permission: PermIds.WMS_WAREHOUSE_VIEW
        }
      }, 
      {
        path: "add",
        name: "Add",
        component: () =>
          import('@/views/storage-info/wrh/add'),
        hidden: true,
        meta: {
          title: '新建仓区',
          icon: 'table',
          permission: PermIds.WMS_WAREHOUSE_CREATE
        }
      }] 
    },
    {
      path: "locationtype",
      name: "locationType",
      component: AModule,
      meta: {
        title: '货位类型',
        icon: 'table',
        permission: PermIds.WMS_BINTYPE
      },
      children: [
        {
        path: "",
        name: "View",
        component: () =>
          import('@/views/storage-info/location-type/index'),
        hidden: true,
        meta: {
          title: '货位类型',
          icon: 'table',
          permission: PermIds.WMS_BINTYPE_VIEW
        }
      }, {
        path: "edit",
        name: "Edit",
        component: () =>
          import('@/views/storage-info/location-type/edit'),
        hidden: true,
        meta: {
          title: '查看货位',
          icon: 'table',
          permission: PermIds.WMS_BINTYPE_VIEW
        }
      }, {
        path: "add",
        name: "Add",
        component: () =>
          import('@/views/storage-info/location-type/add'),
        hidden: true,
        meta: {
          title: '新建货位类型',
          icon: 'table',
          permission: PermIds.WMS_BINTYPE_CREATE
        }
      }] 
    }, {
      path: "wharf",
      name: "Wharf",
      component: AModule,
      meta: {
        title: '码头',
        icon: 'table',
        permission: PermIds.WMS_DOCK
      },
      children: [{
        path: "",
        name: "WharfView",
        component: () =>
          import('@/views/storage-info/wharf/index'),
          hidden: true,
        meta: {
          title: '码头',
          icon: 'table',
          permission: PermIds.WMS_DOCK_VIEW
        }
      }, {
        path: "edit",
        name: "WharfEdit",
        component: () =>
          import('@/views/storage-info/wharf/edit'),
          hidden: true,
          meta: {
            title: '编辑码头',
            icon: 'table',
            permission: PermIds.WMS_DOCK_VIEW
          }
        },
        {
          path: "add",
          name: "WharfAdd",
          component: () =>
            import('@/views/storage-info/wharf/add'),
          hidden: true,
          meta: {
            title: '新建码头',
            icon: 'table',
            permission: PermIds.WMS_DOCK_CREATE
          }
        }] 
    },
    {
      path: "sortdivision",
      name: "Sortdivision",
      component: AModule,
      meta: {
        title: '拣货分区',
        icon: 'table',
        permission: PermIds.WMS_PICKAREA
      },
      children: [{
        path: "",
        name: "SortdivisionView",
        component: () =>
          import('@/views/storage-info/sortdivision/index'),
          hidden: true,
        meta: {
          title: '拣货分区',
          icon: 'table',
          permission: PermIds.WMS_PICKAREA_VIEW
        }
      }, {
        path: "edit",
        name: "SortdivisionEdit",
        component: () =>
          import('@/views/storage-info/sortdivision/edit'),
          hidden: true,
          meta: {
            title: '编辑拣货分区',
            icon: 'table',
          permission: PermIds.WMS_PICKAREA_VIEW
          }
        },
        {
          path: "add",
          name: "SortdivisionAdd",
          component: () =>
            import('@/views/storage-info/sortdivision/add'),
          hidden: true,
          meta: {
            title: '新建拣货分区',
            icon: 'table',
            permission: PermIds.WMS_PICKAREA_CREATE
          }
        }] 
    },
    {
      path: "personnelbind",
      name: "Personnelbind",
      component: AModule,
      meta: {
        title: '用户拣货分区绑定',
        icon: 'table',
        permission: PermIds.WMS_USER_PICKAREA
      },
      children: [{
        path: "",
        name: "PersonnelbindView",
        component: () =>
          import('@/views/storage-info/personnelbind/index'),
          hidden: true,
        meta: {
          title: '用户拣货分区绑定',
          icon: 'table',
          permission: PermIds.WMS_USER_PICKAREA_VIEW
        }
      }, {
        path: "edit",
        name: "PersonnelbindEdit",
        component: () =>
          import('@/views/storage-info/personnelbind/edit'),
          hidden: true,
          meta: {
            title: '编辑用户拣货分区',
            icon: 'table',
            permission: PermIds.WMS_USER_PICKAREA_VIEW
          }
        },
        {
          path: "add",
          name: "PersonnelbindAdd",
          component: () =>
            import('@/views/storage-info/personnelbind/add'),
          hidden: true,
          meta: {
            title: '新建用户拣货分区',
            icon: 'table',
            permission: PermIds.WMS_USER_PICKAREA_CREATE
          }
        }] 
    },
    {
      path: "storpartition",
      name: "Storpartition",
      component: AModule,
      meta: {
        title: '存储分区',
        icon: 'table',
        permission: PermIds.WMS_STORAGEAREA
      },
      children: [{
        path: "",
        name: "StorpartitionView",
        component: () =>
          import('@/views/storage-info/storpartition/index'),
          hidden: true,
        meta: {
          title: '存储分区',
          icon: 'table',
          permission: PermIds.WMS_STORAGEAREA_VIEW
        }
      }, {
        path: "edit",
        name: "StorpartitionEdit",
        component: () =>
          import('@/views/storage-info/storpartition/edit'),
          hidden: true,
          meta: {
            title: '编辑存储分区',
            icon: 'table',
            permission: PermIds.WMS_STORAGEAREA_VIEW
          }
        },
        {
          path: "add",
          name: "StorpartitionAdd",
          component: () =>
            import('@/views/storage-info/storpartition/add'),
          hidden: true,
          meta: {
            title: '新建存储分区',
            icon: 'table',
            permission: PermIds.WMS_STORAGEAREA_CREATE
          }
        }] 
    }, {
      path: "freightarea",
      name: "FreightArea",
      component: AModule,
      meta: {
        title: '货区',
        icon: 'table',
        permission: PermIds.WMS_BIN
      },
      children: [{
        path: "",
        name: "FreightAreaView",
        component: () =>
          import('@/views/storage-info/freight-area/index'),
          hidden: true,
        meta: {
          title: '货区',
          icon: 'table',
          permission: PermIds.WMS_BIN_VIEW
        }
      }]
    }
  ]
}

/**
 * 报表管理包
 */
const ReportModule = {
  path: '/report',
  component: Layout,
  name: 'Report',
  alwaysShow: true,
  meta: {
    title: '报表管理',
    icon: 'report',
    permission: PermIds.REPORT_DYNAMIC
  },
  children: [{
    path: "preview/:id",
    name: "Preview",
    hidden: true,
    component: () =>
      import('@/views/report/custom/customReportPreview'),
    meta: {
      title: '预览报表',
      icon: 'table'
    }
  }]
}

/**
 * 入库管理
 */
const warehousingAdm = {
  path: '/warehousing-adm',
  component: Layout,
  name: 'warehousingAdm',
  alwaysShow: true,
  meta: {
    title: '入库管理',
    icon: 'wrhing'
  },
  children: [
    {
    path: "oeder",
    name: "Oeder",
    component: AModule,
    meta: {
      title: '入库订单',
      icon: 'table',
      permission: PermIds.WMS_ORDERBILL
    },
    children: [
      {
      path: "",
      name: "OrderView",
      component: () =>
        import('@/views/warehousing-adm/order/index'),
      hidden: true,
      meta: {
        title: '入库订单列表',
        icon: 'table',
        permission: PermIds.WMS_ORDERBILL_VIEW
      }
    }, {
      path: "edit",
      name: "入库订单详情",
      component: () =>
        import('@/views/warehousing-adm/order/edit'),
      hidden: true,
      meta: {
        title: '入库订单详情',
        icon: 'table',
        permission: PermIds.WMS_ORDERBILL_VIEW
      }
    }
  ]
    },
    {
    path: "grounding",
    name: "Grounding",
    component: AModule,
    meta: {
      title: '上架单',
      icon: 'table',
      permission: PermIds.WMS_PUTAWAY_BILL
    },
    children: [
      {
      path: "",
      name: "GroundingView",
      component: () =>
        import('@/views/warehousing-adm/grounding/index'),
      hidden: true,
      meta: {
        title: '上架单列表',
        icon: 'table',
        permission: PermIds.WMS_PUTAWAY_BILL_VIEW
      }
    }, {
      path: "edit",
      name: "GroundingEdit",
      component: () =>
        import('@/views/warehousing-adm/grounding/edit'),
      hidden: true,
      meta: {
        title: '上架单详情',
        icon: 'table',
        permission: PermIds.WMS_PUTAWAY_BILL_VIEW
      }
    }, {
      path: "add",
      name: "GroundingAdd",
      component: () =>
        import('@/views/warehousing-adm/grounding/add'),
      hidden: true,
      meta: {
        title: '新建上架单',
        icon: 'table',
        permission: PermIds.WMS_PUTAWAY_BILL_PUTAWAY
      }
    }]
    },
    {
      path: "register",
      name: "Pegister",
      component: AModule,
      meta: {
        title: '到货登记',
        icon: 'table',
        permission: PermIds.WMS_ORDERBILL_ARRIVE
      },
      children: [
        {
          path: "",
          name: "RegisterView",
          component: () =>
            import('@/views/warehousing-adm/register/index'),
          hidden: true,
          meta: {
            title: '到货登记',
            icon: 'table',
            permission: PermIds.WMS_ORDERBILL_ARRIVE
          }
        }
      ]
    },
    {
      path: "packing",
      name: "Packing",
      component: AModule,
      meta: {
        title: '收货装箱',
        icon: 'table',
        permission: PermIds.WMS_RECEIVE_BILL
      },
      children: [
        {
          path: "",
          name: "PackingView",
          component: () =>
            import('@/views/warehousing-adm/packing/index'),
          hidden: true,
          meta: {
            title: '收货装箱',
            icon: 'table',
            permission: PermIds.WMS_RECEIVE_BILL_VIEW
          }
        },
        {
          path: "edit",
          name: "PackingEdit",
          component: () =>
            import('@/views/warehousing-adm/packing/edit'),
          hidden: true,
          meta: {
            title: '装箱详情',
            icon: 'table',
            permission: PermIds.WMS_RECEIVE_BILL_VIEW
          }
        }
      ]
    },
    {
      path: "quality",
      name: "Quality",
      component: AModule,
      meta: {
        title: '质检单',
        icon: 'table',
        permission: PermIds.WMS_QUALITY_INSPECTION_ORDER
      },
      children: [
        {
          path: "",
          name: "QualityView",
          component: () =>
            import('@/views/warehousing-adm/quality/index'),
          hidden: true,
          meta: {
            title: '质检单',
            icon: 'table',
            permission: PermIds.WMS_QUALITY_INSPECTION_ORDER_VIEW
          }
        },
        {
          path: "edit",
          name: "QualityEdit",
          component: () =>
            import('@/views/warehousing-adm/quality/edit'),
          hidden: true,
          meta: {
            title: '质检详情',
            icon: 'table',
            permission: PermIds.WMS_QUALITY_INSPECTION_ORDER_VIEW
          }
        }
      ]
    },
    {
      path: "supplier",
      name: "Supplier",
      component: AModule,
      meta: {
        title: '供应商退货单',
        icon: 'table',
        permission: PermIds.WMS_VENDOR_RETURN_BILL
      },
      children: [
        {
          path: "",
          name: "View",
          component: () =>
            import('@/views/warehousing-adm/supplier/index'),
          hidden: true,
          meta: {
            title: '供应商退货单',
            icon: 'table',
            permission: PermIds.WMS_VENDOR_RETURN_BILL_VIEW
          }
        },
        {
          path: "edit",
          name: "Edit",
          component: () =>
            import('@/views/warehousing-adm/supplier/edit'),
          hidden: true,
          meta: {
            title: '供应商退货单详情',
            icon: 'table',
            permission: PermIds.WMS_VENDOR_RETURN_BILL_VIEW
          }
        }
      ]
    }
]}
/**
 * 出库管理
 */
const outhousingAdm = {
  path: '/outhousing-adm',
  component: Layout,
  name: 'outhousingAdm',
  alwaysShow: true,
  meta: {
    title: '出库管理',
    icon: 'outhous'
  },
  children: [
    {
    path: "outhousing",
    name: "Outhousing",
    component: AModule,
    meta: {
      title: '仓库作业单',
      icon: 'table',
      permission: PermIds.WMS_OPERATE_BILL
    },
    children: [
      {
      path: "",
      name: "OuthousingView",
      component: () =>
        import('@/views/outhousing-adm/outhousing/index'),
      hidden: true,
      meta: {
        title: '仓库作业单列表',
        icon: 'table',
        permission: PermIds.WMS_OPERATE_BILL_VIEW
      }
      }, {
        path: "edit",
        name: "仓库作业单详情",
        component: () =>
          import('@/views/outhousing-adm/outhousing/edit'),
        hidden: true,
        meta: {
          title: '仓库作业单详情',
          icon: 'table',
          permission: PermIds.WMS_OPERATE_BILL_VIEW
        }
      }
    ]
    },
    {
      path: "pickingprocess",
      name: "PickingProcess",
      component: AModule,
      meta: {
        title: '拣货单',
        icon: 'table'
        // permission: PermIds.WMS_PICK_BILL_ITEM
      },
      children: [
        {
          path: "",
          name: "PickingProcessView",
          component: () =>
            import('@/views/outhousing-adm/picking-process/index'),
          hidden: true,
          meta: {
            title: '拣货单',
            icon: 'table'
            // permission: PermIds.WMS_PICK_BILL_ITEM_VIEW
          }
        },
        {
          path: "edit",
          name: "PickingProcessEdit",
          component: () =>
            import('@/views/outhousing-adm/picking-process/edit'),
          hidden: true,
          meta: {
            title: '拣货单详情',
            icon: 'table'
            // permission: PermIds.WMS_PICK_BILL_ITEM_VIEW
          }
        }
      ]
    },
    {
      path: "distribution",
      name: "Distribution",
      component: AModule,
      meta: {
        title: '分播单',
        icon: 'table',
        permission: PermIds.WMS_SOWING_PICK_Bill
      },
      children: [
        {
          path: "",
          name: "DistributionView",
          component: () =>
            import('@/views/outhousing-adm/distribution/index'),
          hidden: true,
          meta: {
            title: '分播单',
            icon: 'table',
            permission: PermIds.WMS_SOWING_PICK_Bill_VIEW
          }
        },
        {
          path: "edit",
          name: "DistributionEdit",
          component: () =>
            import('@/views/outhousing-adm/distribution/edit'),
          hidden: true,
          meta: {
            title: '分播单详情',
            icon: 'table',
            permission: PermIds.WMS_SOWING_PICK_Bill_VIEW
          }
        }
      ]
    },
    {
      path: "topicked",
      name: "ToPicked",
      component: AModule,
      meta: {
        title: '待拣货容器',
        icon: 'table'
      },
      children: [
        {
          path: "",
          name: "ToPickedView",
          component: () =>
            import('@/views/outhousing-adm/to-picked/index'),
          hidden: true,
          meta: {
            title: '待拣货容器',
            icon: 'table'
          }
        }
      ]
    },
    {
      path: "thecage",
      name: "TheCage",
      component: AModule,
      meta: {
        title: '装笼单',
        icon: 'table'
        // permission: PermIds.WMS_LOAD_PALLET
      },
      children: [
        {
          path: "",
          name: "TheCageView",
          component: () =>
            import('@/views/outhousing-adm/the-cage/index'),
          hidden: true,
          meta: {
            title: '装笼单',
            icon: 'table'
            // permission: PermIds.WMS_LOAD_PALLET_VIEW
          }
        },
        {
          path: "edit",
          name: "TheCageEdit",
          component: () =>
            import('@/views/outhousing-adm/the-cage/edit'),
          hidden: true,
          meta: {
            title: '装笼单详情',
            icon: 'table'
            // permission: PermIds.WMS_LOAD_PALLET_VIEW
          }
        }
      ]
    },
    {
      path: "loading",
      name: "Loading",
      component: AModule,
      meta: {
        title: '装车单',
        icon: 'table'
        // permission: PermIds.WMS_ENTRUCK_BILL_ITEM
      },
      children: [
        {
          path: "",
          name: "LoadingView",
          component: () =>
            import('@/views/outhousing-adm/loading/index'),
          hidden: true,
          meta: {
            title: '装车单',
            icon: 'table'
            // permission: PermIds.WMS_ENTRUCK_BILL_ITEM_VIEW
          }
        },
        {
          path: "edit",
          name: "LoadingEdit",
          component: () =>
            import('@/views/outhousing-adm/loading/edit'),
          hidden: true,
          meta: {
            title: '装车单详情',
            icon: 'table'
            // permission: PermIds.WMS_ENTRUCK_BILL_ITEM_VIEW
          }
        }
      ]
    },
    {
      path: "pickingandpacking",
      name: "PickingAndPacking",
      component: AModule,
      meta: {
        title: '拣货装箱单',
        icon: 'table'
        // permission: PermIds.WMS_ENTRUCK_BILL_ITEM====
      },
      children: [
        {
          path: "",
          name: "PickingAndPackingView",
          component: () =>
            import('@/views/outhousing-adm/picking-and-packing/index'),
          hidden: true,
          meta: {
            title: '拣货装箱单',
            icon: 'table'
            // permission: PermIds.WMS_ENTRUCK_BILL_ITEM_VIEW====
          }
        },
        {
          path: "edit",
          name: "PickingAndPackingEdit",
          component: () =>
            import('@/views/outhousing-adm/picking-and-packing/edit'),
          hidden: true,
          meta: {
            title: '拣货装箱单详情',
            icon: 'table'
            // permission: PermIds.WMS_ENTRUCK_BILL_ITEM_VIEW====
          }
        }
      ]
    }
]}
  
  /*
 * 单据管理包
 */
const BillManagement = {
  path: '/wrhmanagement',
  component: Layout,
  name: 'WrhManagement',
  alwaysShow: true,
  meta: {
    title: '库内管理',
    icon: 'bill'
  },
  children: [
    {
    path: "lossbill",
    name: "LossBill",
    component: AModule,
    meta: {
      title: '损耗单',
      icon: 'table',
      permission: PermIds.WMS_DECINVBILL
    },
    children: [{
      path: "",
      name: "LossBillView",
      component: () =>
        import('@/views/wrh-management/loss-bill/index'),
      hidden: true,
      meta: {
        title: '损耗单',
        icon: 'table',
        permission: PermIds.WMS_DECINVBILL_VIEW
      }
    }, {
      path: "edit",
      name: "LossBillEdit",
      component: () =>
        import('@/views/wrh-management/loss-bill/edit'),
      hidden: true,
      meta: {
        title: '查看损耗单',
        icon: 'table',
        permission: PermIds.WMS_DECINVBILL_VIEW
      }
    }, {
      path: "add",
      name: "LossBillAdd",
      component: () =>
        import('@/views/wrh-management/loss-bill/add'),
      hidden: true,
      meta: {
        title: '新建损耗单',
        icon: 'table',
        permission: PermIds.WMS_DECINVBILL_CREATE
      }
    }, {
      path: "batchadd",
      name: "BatchAdd",
      component: () =>
        import('@/views/wrh-management/loss-bill/batch-add'),
      hidden: true,
      meta: {
        title: '批量增加商品',
        icon: 'table',
        permission: PermIds.PRODUCT_SUPPLIER_VIEW
      }
    }]
    },
    {
      path: "overflowbill",
      name: "OverflowBill",
      component: AModule,
      meta: {
        title: '溢余单',
        icon: 'table',
        permission: PermIds.WMS_INCINVBILL
      },
      children: [{
        path: "",
        name: "OverflowView",
        component: () =>
          import('@/views/wrh-management/overflow-bill/index'),
        hidden: true,
        meta: {
          title: '溢余单',
          icon: 'table',
          permission: PermIds.WMS_INCINVBILL_VIEW
        }
      }, {
        path: "edit",
        name: "OverflowBillEdit",
        component: () =>
          import('@/views/wrh-management/overflow-bill/edit'),
        hidden: true,
        meta: {
          title: '查看溢余单',
          icon: 'table',
          permission: PermIds.WMS_INCINVBILL_VIEW
        }
      }, {
        path: "add",
        name: "OverflowBillAdd",
        component: () =>
          import('@/views/wrh-management/overflow-bill/add'),
        hidden: true,
        meta: {
          title: '新建溢余单',
          icon: 'table',
          permission: PermIds.WMS_INCINVBILL_CREATE
        }
      }, {
        path: "batchadd",
        name: "BatchAdd",
        component: () =>
          import('@/views/wrh-management/loss-bill/batch-add'),
        hidden: true,
        meta: {
          title: '批量增加商品',
          icon: 'table',
          permission: PermIds.PRODUCT_SUPPLIER_VIEW
        }
      }]
    },
    {
      path: "movebill",
      name: "MoveBill",
      component: AModule,
      meta: {
        title: '移库单',
        icon: 'table',
        permission: PermIds.WMS_MOVE_BILL
      },
      children: [{
        path: "",
        name: "MoveView",
        component: () =>
          import('@/views/wrh-management/move-bill/index'),
        hidden: true,
        meta: {
          title: '移库单',
          icon: 'table',
          permission: PermIds.WMS_MOVE_BILL_VIEW
        }
      }, {
        path: "edit",
        name: "MoveBillEdit",
        component: () =>
          import('@/views/wrh-management/move-bill/edit'),
        hidden: true,
        meta: {
          title: '查看移库单',
          icon: 'table',
          permission: PermIds.WMS_MOVE_BILL_VIEW
        }
      }, {
        path: "add",
        name: "MoveBillAdd",
        component: () =>
          import('@/views/wrh-management/move-bill/add'),
        hidden: true,
        meta: {
          title: '新建移库单',
          icon: 'table',
          permission: PermIds.WMS_MOVE_BILL_CREATE
        }
      }, {
        path: "batchadd",
        name: "MoveBillBatchAdd",
        component: () =>
          import('@/views/wrh-management/move-bill/batch-add'),
        hidden: true,
        meta: {
          title: '批量添加',
          icon: 'table',
          permission: PermIds.WMS_INCINVBILL_CREATE
        }
      }]
    },
    {
      path: "adjustinfo",
      name: "Adjustinfo",
      component: AModule,
      meta: {
        title: '库存信息调整单',
        icon: 'table',
        permission: PermIds.STOCK_UPDATE_INFO_BILL
      },
      children: [{
        path: "",
        name: "AdjustinfoView",
        component: () =>
          import('@/views/wrh-management/adjustinfo/index'),
        hidden: true,
        meta: {
          title: '库存信息调整单',
          icon: 'table',
          permission: PermIds.STOCK_UPDATE_INFO_BILL_VIEW
        }
      },
      {
        path: "edit",
        name: "AdjustinfoEdit",
        component: () =>
          import('@/views/wrh-management/adjustinfo/edit'),
        hidden: true,
        meta: {
          title: '调整单详情',
          icon: 'table',
          permission: PermIds.STOCK_UPDATE_INFO_BILL_VIEW
        }
      },
      {
        path: "add",
        name: "AdjustinfoAdd",
        component: () =>
          import('@/views/wrh-management/adjustinfo/add'),
        hidden: true,
        meta: {
          title: '库存信息调整单',
          icon: 'table',
          permission: PermIds.STOCK_UPDATE_INFO_BILL_VIEW
        }
      },
      {
        path: "batchadd",
        name: "AdjustinfoBatchAdd",
        component: () =>
          import('@/views/wrh-management/adjustinfo/batch-add'),
        hidden: true,
        meta: {
          title: '新建库存信息调整单',
          icon: 'table',
          permission: PermIds.STOCK_UPDATE_INFO_BILL_VIEW
        }
      }
    ]
    },
    {
      path: "demolition-and",
      name: "AemolitionAnd",
      component: AModule,
      meta: {
        title: '容器拆并单',
        icon: 'table',
        permission: PermIds.WMS_CONTAINER_MERGER_BILL
      },
      children: [{
        path: "",
        name: "AemolitionAndView",
        component: () =>
          import('@/views/wrh-management/demolition-and/index'),
        hidden: true,
        meta: {
          title: '容器拆并单',
          icon: 'table',
          permission: PermIds.WMS_CONTAINER_MERGER_BILL_VIEW
        }
      }, {
        path: "edit",
        name: "AemolitionAndEdit",
        component: () =>
          import('@/views/wrh-management/demolition-and/edit'),
        hidden: true,
        meta: {
          title: '查看容器拆并单',
          icon: 'table',
          permission: PermIds.WMS_CONTAINER_MERGER_BILL_VIEW
        }
      }]
    },
    {
      path: "inventory",
      name: "Inventory",
      component: AModule,
      meta: {
        title: '盘点单',
        icon: 'table',
        permission: PermIds.STOCK_TAKE_BILL
      },
      children: [{
        path: "",
        name: "InventoryView",
        component: () =>
          import('@/views/wrh-management/inventory/index'),
        hidden: true,
        meta: {
          title: '盘点单',
          icon: 'table',
          permission: PermIds.STOCK_TAKE_BILL_VIEW
        }
      }, {
        path: "edit",
        name: "InventoryEdit",
        component: () =>
          import('@/views/wrh-management/inventory/edit'),
        hidden: true,
        meta: {
          title: '查看盘点单',
          icon: 'table',
          permission: PermIds.STOCK_TAKE_BILL_VIEW
        }
      }, {
        path: "add",
        name: "InventoryAdd",
        component: () =>
          import('@/views/wrh-management/inventory/add'),
        hidden: true,
        meta: {
          title: '新建盘点单',
          icon: 'table',
          permission: PermIds.STOCK_TAKE_BILL_CREATE
        }
      }]
    },
    {
      path: "lockandunlock",
      name: "LockAndUnlock",
      component: AModule,
      meta: {
        title: '锁定解锁单',
        icon: 'table',
        permission: PermIds.STOCK_LOCK_BILL
      },
      children: [{
        path: "",
        name: "LockAndUnlockView",
        component: () =>
          import('@/views/wrh-management/lockandunlock/index'),
        hidden: true,
        meta: {
          title: '锁定解锁单',
          icon: 'table',
          permission: PermIds.STOCK_LOCK_BILL_VIEW
        }
      },
      {
        path: "edit",
        name: "LockAndUnlockEdit",
        component: () =>
          import('@/views/wrh-management/lockandunlock/edit'),
        hidden: true,
        meta: {
          title: '锁定解锁单详情',
          icon: 'table',
          permission: PermIds.STOCK_LOCK_BILL_VIEW
        }
      },
      {
        path: "add",
        // replace: true,
        name: "LockAndUnlockAdd",
        component: () =>
          import('@/views/wrh-management/lockandunlock/add'),
        hidden: true,
        meta: {
          title: '新建锁定解锁单',
          icon: 'table',
          permission: PermIds.STOCK_LOCK_BILL_VIEW
        }
      },
      {
        path: "batchadd",
        name: "LockAndUnlockBatchAdd",
        component: () =>
          import('@/views/wrh-management/lockandunlock/batch-add'),
        hidden: true,
        meta: {
          title: '新建锁定解锁单',
          icon: 'table',
          permission: PermIds.STOCK_LOCK_BILL_VIEW
        }
      }
    ]
    }
  ]
}

/**
 * 运输管理
 */
const carriage = {
  path: '/carriage',
  component: Layout,
  name: 'Carriage',
  alwaysShow: true,
  meta: {
    title: '运输管理',
    icon: 'carriage'
  },
  children: [
    {
      path: "cargosequence",
      name: "Cargosequence",
      component: AModule,
      meta: {
        title: '网格仓线路设置',
        icon: 'table'
        // permission: PermIds.WMS_PICKORDER
      },
      children: [{
        path: "",
        name: "CargosequenceView",
        component: () =>
          import('@/views/carriage/cargosequence/index'),
          hidden: true,
        meta: {
          title: '网格仓线路设置',
          icon: 'table'
          // permission: PermIds.WMS_PICKORDER_VIEW 
        }
      }, {
        path: "edit",
        name: "CargosequenceEdit",
        component: () =>
          import('@/views/carriage/cargosequence/edit'),
          hidden: true,
          meta: {
            title: '编辑网格仓线路',
            icon: 'table'
            // permission: PermIds.WMS_PICKORDER_VIEW
          }
        },
        {
          path: "add",
          name: "CargosequenceAdd",
          component: () =>
            import('@/views/carriage/cargosequence/add'),
          hidden: true,
          meta: {
            title: '新建网格仓线路',
            icon: 'table'
            // permission: PermIds.WMS_PICKORDER_CREATE
          }
        }] 
    },
    {
      path: "circuitry",
      name: "Circuitry",
      component: AModule,
      meta: {
        title: '中心仓线路设置',
        icon: 'table'
        // permission: PermIds.WMS_PICKORDER
      },
      children: [{
        path: "",
        name: "CircuitryView",
        component: () =>
          import('@/views/carriage/circuitry/index'),
          hidden: true,
        meta: {
          title: '中心仓线路设置',
          icon: 'table'
          // permission: PermIds.WMS_PICKORDER_VIEW 
        }
      }, {
        path: "edit",
        name: "CircuitryEdit",
        component: () =>
          import('@/views/carriage/circuitry/edit'),
          hidden: true,
          meta: {
            title: '编辑中心仓线路',
            icon: 'table'
            // permission: PermIds.WMS_PICKORDER_VIEW
          }
        },
        {
          path: "add",
          name: "CircuitryAdd",
          component: () =>
            import('@/views/carriage/circuitry/add'),
          hidden: true,
          meta: {
            title: '新建中心仓线路',
            icon: 'table'
            // permission: PermIds.WMS_PICKORDER_CREATE
          }
        }] 
    }
]}
/**
 * 动态路由
 */
export const asyncRouterMap = [
  SystemPackage,
  BasicInfoPackage,
  StorageInfoPackage,
  ReportModule,
  warehousingAdm,
  BillManagement,
  outhousingAdm,
  carriage,
  {
    path: '*',
    redirect: '/dashboard',
    hidden: true
  }
]
