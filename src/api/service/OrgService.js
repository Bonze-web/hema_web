/** 
 * 组织相关接口 
 */
var qs = require('qs');
import request from '@/utils/request'

export default {

  /**
   * 查询组织
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
    return request.get('/sys/org/query', {
      params: params,
      paramsSerializer: function(params) {
        // 用来解决axios默认将数组参数序列化成a[]=1&a[]=2...，导致后台无法识别参数
        return qs.stringify(params, {
          arrayFormat: 'repeat'
        })
      }
    });
  },
  /**
   * 查询组织及下级组织数量
   */
  queryCount(includeDisabledOrgs, orgTypeEquals, upperOrgId) {
    var params = {
      includeDisabledOrgs: includeDisabledOrgs,
      orgTypeEquals: orgTypeEquals,
      upperOrgId: upperOrgId
    }
    return request.get('/sys/org/queryCount', {
      params: params
    });
  },
  /**
   * 取得指定组织可见的权限树
   */
  getOrgMenuTree(orgId) {
    var params = {
      orgId: orgId
    }
    return request.get('/sys/org/getOrgMenuTree', {
      params: params
    })
  },

  /**
   * 禁用组织
   * @param {*} id 组织ID
   */
  disable(id) {
    return request.put('/sys/org/disable?id=' + id, {});
  },

  /**
   * 启用组织
   * @param {*} id 组织ID
   */
  enable(id) {
    return request.put('/sys/org/enable?id=' + id, {});
  },

  /**
   * 取得组织的角色列表 
   * @param {*} id 组织标识，非空
   */
  getRoles(id) {
    return request.get('/sys/org/getRoles', {
      params: {
        orgId: id
      }
    });
  },

  /**
   * 保存组织角色   
   * @param {*} orgId 组织ID
   * @param {*} roleIds 角色ID
   */
  updateRoles(orgId, roleIds = []) {
    return request.put('/sys/org/updateRoles', {
      orgId: orgId,
      roleIds: roleIds
    });
  },
  /**
   * 新增组织
   */
  create(postData) {
    return request.post('/sys/org/create', postData);
  },
  /**
   * 修改组织
   */
  update(postData) {
    return request.put('/sys/org/update', postData);
  },
  /**
   * 根据组织id获取组织信息 
   * @param {*} id 组织标识，非空
   */
  getById(id) {
    return request.get('/sys/org/getById?id=' + id);
  },
  /**
   * 修改上级组织 
   * @param id 对象唯一标识
   * @param upperOrgId 新的上组织组织ID
   */
  updateUpper(postData) {
    return request.put('/sys/org/updateUpper', postData);
  }
}
