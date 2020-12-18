import Vue from 'vue'
import Router from 'vue-router'
import store from '@/store'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import {
  getToken
} from '@/utils/auth'
import {
  constantRouterMap
} from '@/router/routers'
import * as Utils from "@/utils/index";

NProgress.configure({
  showSpinner: false
}) // NProgress Configuration

Vue.use(Router)

const router = new Router({
  // mode: 'history', //后端支持可开
  scrollBehavior: () => ({
    y: 0
  }),
  routes: constantRouterMap
})
export default router

// 不重定向白名单
const whiteList = [
  '/login'
]

router.beforeEach((to, from, next) => {
  NProgress.start()
  if (process.env.PRJ === "SAAS") {
    var tenant = to.query.tenant ? to.query.tenant : "";
    if (tenant != null && tenant !== "null" && tenant !== "") {
      var newTenant = decodeURIComponent(tenant);
      var tenantName = newTenant.split("#")[0];
      console.log("tenant", tenantName)
      localStorage.setItem("_tenant_", tenantName);
    }
  }
  if (getToken()) {
    if (to.path === '/login') {
      next({
        path: '/'
      })
      NProgress.done() // if current page is dashboard will not trigger	afterEach hook, so manually handle it
    } else {
      if (!store.getters.user) {
        store.dispatch('GetUserInfo')
          .then(user => {
            store.dispatch('GenerateRoutes', user)
              .then(() => {
                router.addRoutes(store.getters.authorisedRouters)
                next({
                  ...to,
                  replace: true
                })
                // hack方法 确保addRoutes已完成 ,set the replace: true so the navigation will not leave a history record
              })
          }).catch(err => {
            console.log(err);
            if (err && err.code !== 20) {
              // 20表示session已过期，会由后面弹出确认框，所以这里不再报错
              Utils.showError(err);
            }
          })
      } else {
        next()
      }
    }
  } else {
    if (whiteList.indexOf(to.path) !== -1) {
      next()
    } else {
      var isLogOut = sessionStorage.getItem("_isLogOut_");
      next({
        path: '/login',
        query: isLogOut ? null : {
          redirect: to.fullPath
        }
      })
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  NProgress.done() // 结束Progress
})
