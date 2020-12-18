/**
 * 角色管理接口
 */
var qs = require('qs');
import request from '@/utils/request'

export default {

  /**
   * 查询角色
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
    return request.get('/sys/role/query', {
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
   * 新增角色
   */
  create(postData) {
    return request.post('/sys/role/create', postData);
  },

  /**
   * 修改角色权限
   */
  updatePermission(postData) {
    return request.put('/sys/role/updatePermission', postData);
  },

  /**
   * 取得角色拥有的权限
   */
  getPermission(roleId) {
    var params = {
      roleId: roleId
    }
    return request.get('/sys/role/getPermission', {
      params: params
    })
  },
  /**
   * 删除角色
   */
  remove(ids) {
    var params = {
      ids: ids
    }
    return request.delete('/sys/role/remove', {
      params: params
    })
  },
  /**
   * 修改角色
   */
  update(postData) {
    return request.put('/sys/role/update', postData);
  }

}
