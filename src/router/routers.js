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
    icon: 'basic-info',
    permission: PermIds.REPORT_DYNAMIC
  },
  children: [{
    path: "suppliers",
    name: "Suppliers",
    component: AModule,
    meta: {
      title: '供应商列表',
      icon: 'table'
    },
    children: [{
      path: "",
      name: "SuppliersView",
      component: () =>
        import('@/views/basic-info/suppliers/index'),
      hidden: true,
      meta: {
        title: '供应商列表',
        icon: 'table'
      }
    }, {
      path: "edit",
      name: "SuppliersEdit",
      component: () =>
        import('@/views/basic-info/suppliers/edit'),
      hidden: true,
      meta: {
        title: '供应商',
        icon: 'table'
      }
    }]
  }, {
    path: "category",
    name: "Category",
    component: AModule,
    meta: {
      title: '商品类别',
      icon: 'table'
    },
    children: [{
      path: "",
      name: "CategoryView",
      component: () =>
        import('@/views/basic-info/category/index'),
      hidden: true,
      meta: {
        title: '商品类别',
        icon: 'table'
      }
    }, {
      path: "edit",
      name: "CategoryEdit",
      component: () =>
        import('@/views/basic-info/category/edit'),
      hidden: true,
      meta: {
        title: '',
        icon: 'table'
      }
    }]
  }]
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
    icon: 'storage-info',
    permission: PermIds.REPORT_DYNAMIC
  },
  children: [{
    path: "dc",
    name: "Dc",
    component: AModule,
    meta: {
      title: '物流中心',
      icon: 'table'
    },
    children: [{
      path: "",
      name: "View",
      component: () =>
        import('@/views/storage-info/dc/index'),
      hidden: true,
      meta: {
        title: '配送中心',
        icon: 'table'
      }
    }, {
      path: "edit",
      name: "Edit",
      component: () =>
        import('@/views/storage-info/dc/edit'),
      hidden: true,
      meta: {
        title: '',
        icon: 'table'
      }
    }]
  },
  {
    path: "potion",
    name: "Potion",
    component: AModule,
    meta: {
      title: '仓库',
      icon: 'table'
    },
    children: [{
      path: "",
      name: "View",
      component: () =>
        import('@/views/storage-info/potion/index'),
      hidden: true,
      meta: {
        title: '',
        icon: 'table'
      }
    }, {
      path: "edit",
      name: "Edit",
      component: () =>
        import('@/views/storage-info/potion/edit'),
      hidden: true,
      meta: {
        title: '',
        icon: 'table'
      }
    }]
  },
  {
    path: "locationtype",
    name: "LocationType",
    component: AModule,
    meta: {
      title: '货位类型',
      icon: 'table'
    },
    children: [
      {
        path: "",
        name: "View",
        component: () =>
          import('@/views/storage-info/location-type/index'),
        hidden: true,
        meta: {
          title: '',
          icon: 'table'
        }
      },
      {
        path: "edit",
        name: "Edit",
        component: () =>
          import('@/views/storage-info/location-type/edit'),
        hidden: true,
        meta: {
          title: '',
          icon: 'table'
        }
      }
    ]
  }
  ]
}

/**
 * 动态路由
 */
export const asyncRouterMap = [
  SystemPackage,
  BasicInfoPackage,
  StorageInfoPackage,
  {
    path: '*',
    redirect: '/sys',
    hidden: true
  }
]
