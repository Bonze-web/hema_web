/**
 * 用户管理接口
 */
import request from '@/utils/request'

export default {

  /**
   * 查询用户
   * 
   * @param {int} page 
   * @param {int} pageSize 
   * @param {*} opts 
   */
  query(page, pageSize, opts = {}) {
    var params = {
      page: page,
      pageSize: pageSize,
      searchCount: true,
      ...opts
    };
    return request.get('/sys/user/query', {
      params: params
    });
  },

  /**
   * 登录
   * @param {*} username 用户名
   * @param {*} password 密码
   * @param {*} workingOrgId 登录组织，可空
   */
  login(username, password, workingOrgId) {
    var params = {
      username: username,
      password: password,
      ...(typeof (workingOrgId) === 'undefined' ? {} : {
        workingOrgId: workingOrgId
      })
    };
    return request.post('/sys/user/login', params);
  },

  /**
   * 登出
   */
  logout() {
    return request.post('/sys/user/logout', {});
  },

  /**
   * 取得当前登录用户
   */
  getLoginUser() {
    return request.get('/sys/user/getLoginUser');
  },

  /**
   * 刷新access token
   * @param {*} refreshToken 刷新令牌
   */
  refreshToken(refreshToken) {
    return request.post('/sys/user/refreshToken', {
      refreshToken: refreshToken
    });
  },

  /**
   * 取得当前用户可见的权限树
   */
  getUserMenuTree() {
    return request.get('/sys/user/getUserMenuTree');
  },

  /**
   * 创建用户
   * @param {*} user 
   */
  create(user) {
    return request.post('/sys/user/create', user);
  },

  /**
   * 更新用户
   * @param {*} user 
   */
  update(user) {
    return request.put('/sys/user/update', user);
  },

  /**
   * 根据ID查询用户
   * @param {Long} id 用户ID
   */
  getById(id) {
    return request.get('/sys/user/getById', {
      params: {
        id: id
      }
    });
  },

  /**
   * 禁用用户
   * @param {*} id 用户ID
   */
  disable(id) {
    return request.put('/sys/user/disable?id=' + id, {});
  },

  /**
   * 启用用户
   * @param {*} id 用户ID
   */
  enable(id) {
    return request.put('/sys/user/enable?id=' + id, {});
  },

  /**
   * 重置用户密码
   * @param {Long} id 用户ID
   */
  resetPassword(id) {
    return request.put('/sys/user/resetPassword?id=' + id, {});
  },

  /**
   * 修改当前用户密码
   * @param {*} oldPwd 原密码
   * @param {*} newPwd 新密码
   */
  modifyPassword(oldPwd, newPwd) {
    return request.put('/sys/user/modifyPassword', {
      oldPassword: oldPwd,
      newPassword: newPwd
    });
  },

  /**
   * 取得用户的角色列表 
   * @param {*} id 
   */
  getRoles(id) {
    return request.get('/sys/user/getRoles', {
      params: {
        id: id
      }
    });
  },

  /**
   * 保存用户角色   
   * @param {*} userId 用户ID
   * @param {*} roleIds 角色ID
   */
  updateRoles(userId, roleIds = []) {
    return request.put('/sys/user/updateRoles', {
      userId: userId,
      roleIds: roleIds
    });
  },

  /**
   * 更新用户组织Id   
   * @param {*} id 用户ID
   * @param {*} orgId 组织id
   */
  updateOrg(upostData) {
    return request.put('/sys/user/updateOrg', upostData);
  },

  /**
   * 导出用户
   */
  exportUser(page, pageSize, opts = {}) {
    var params = {
      page: page,
      pageSize: pageSize,
      searchCount: true,
      ...opts
    };
    return request.get('/sys/user/export', {
      params: params
    });
  },

  /**
   * 导入用户
   */
  importUser() {
    return request.get('/sys/user/import');
  }
}
