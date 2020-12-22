/**
 * 统一管理getters
 */
const getters = {
  sidebar: state => state.app.sidebar,

  /**
   * 当前access token
   */
  token: state => state.user.token,
  /**
   * 当前用户
   */
  user: state => state.user.user,
  /**
   * 当前用户的工作组织
   */
  workingOrg: state => state.user.user ? state.user.user.workingOrg : null,
  /**
   * 当前用户的所有权限
   */
  permissions: state =>
    state.user.user ? state.user.user.permissions : [],

  // hasPermission: (state) => (permId) => state.user.hasPermission,

  // hasAllPermissions: (state, getters) => (perms) => state.user.hasAllPermissions,

  // hasOnePermission: (state, getters) => (perms) => state.user.hasOnePermission,

  /**
   * 动态授权获得的路由
   */
  authorisedRouters: state => state.menu.authorisedRouters,
  /**
   * 静态路由+动态授权路由=用来构造菜单的路由
   */
  menuRouters: state => state.menu.routers,
  visitedViews: state => state.tagsView.visitedViews,
  cachedViews: state => state.tagsView.cachedViews
}
export default getters
