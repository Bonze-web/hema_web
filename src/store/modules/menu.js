import {
  asyncRouterMap,
  constantRouterMap
} from '@/router/routers';
import router from '@/router/index';
// import Layout from '@/views/layout/Layout'
// import PermIds from "@/api/permissionIds";
import request from '@/utils/request'
import CReportService from '@/api/service/CustomReportService'

// /**
//  * 报表管理包
//  */
// const ReportModule = {
//   path: '/report',
//   component: Layout,
//   name: 'Report',
//   alwaysShow: true,
//   meta: {
//     title: '报表管理',
//     icon: 'example',
//     permission: PermIds.REPORT_DYNAMIC
//   },
//   children: [{
//     path: "designer",
//     name: "Designer",
//     // component: () =>
//     //   import ('@/views/report/designer'),
//     meta: {
//       title: '设计报表',
//       icon: 'example',
//       permission: PermIds.REPORT_DYNAMIC_DESIGNER
//     }
//   }]
// }

/**
 * 通过meta.role判断是否与当前用户权限匹配
 * @param permissions 权限列表
 * @param route
 */
function hasPermission(permissions, route) {
  if (!route.meta || !route.meta.permission) {
    return true
  } else {
    var rp = route.meta.permission;
    return permissions.some(perm => (perm === rp) || perm.indexOf(rp + ":") === 0);
  }
}

/**
 * 递归过滤异步路由表，返回符合用户角色权限的路由表
 * @param routers 路由表
 * @param permissions 权限列表
 */
function filterAsyncRouter(routers, permissions) {
  const filteredRouters = routers.filter(route => {
    if (hasPermission(permissions, route)) {
      if (route.children && route.children.length) {
        route.children = filterAsyncRouter(route.children, permissions)
      }
      return true
    }
    return false
  })
  return filteredRouters
}

function getReportModule() {
  for (var m of asyncRouterMap) {
    if (m.name === 'Report') {
      return m;
    }
  }
  return null;
}

// function buildReportModule(rptModule, reports) {
//   for (var rpt of reports) {
//     rptModule.children.push({
//       path: 'preview/' + encodeURIComponent(rpt.name),
//       props: {
//         rpt: rpt.name
//       },
//       name: rpt.name,
//       component: () =>
//         import ('@/views/report/preview'),
//       meta: {
//         title: rpt.name,
//         icon: 'example',
//         permission: PermIds.REPORT_DYNAMIC + ":" + rpt.name
//       }
//     })
//   }
// }

function buildReportModule(rptModule, reports) {
  for (var rpt of reports) {
    rptModule.children.push({
      path: 'preview/' + rpt.id,
      params: {
        id: rpt.id
      },
      name: rpt.name,
      component: () =>
        import('@/views/report/custom/customReportPreview'),
      meta: {
        title: rpt.name,
        icon: 'table'
        // permission: PermIds.REPORT_DYNAMIC + ":" + rpt.name
      }
    })
  }
}

/**
 * 报表菜单是动态计算的
 * 
 * @param {*} eportModule
 * @param {*} user 
 * @param {*} commit 
 * @param {*} state 
 */
function initReportRouter(reportModule, user, commit, state) {
  // 先过滤报表模块
  var permissions = user.permissions || [];
  filterAsyncRouter([reportModule], permissions);

  // 查询动态报表
  request.hideLoadingOnce();
  CReportService.getReports()
    .then(data => {
      buildReportModule(reportModule, data);
      var routerAry = state.authorisedRouters;
      // routerAry.push(reportModule);

      commit('SET_ROUTERS', routerAry)
      console.log(router)
      // router.addRoutes([reportModule])
    })
}

const Menu = {
  state: {
    routers: constantRouterMap,
    authorisedRouters: []
  },
  mutations: {
    SET_ROUTERS: (state, routers) => {
      state.authorisedRouters = routers
      state.routers = constantRouterMap.concat(routers)
    }
  },
  actions: {
    GenerateRoutes({
      commit,
      state
    }, user) {
      var permissions = user.permissions || [];
      var reportModule = getReportModule();
      if (reportModule) {
        // 异步算的目的是不阻塞当前线程
        setTimeout(function() {
          initReportRouter(reportModule, user, commit, state);
        }, 200)
      }

      return new Promise(resolve => {
        const accessedRouters = filterAsyncRouter(asyncRouterMap, permissions)
        commit('SET_ROUTERS', accessedRouters)
        resolve()
      })
    }
  }
}

export default Menu
