/* 
 * 上传文件相关接口 
 */
var qs = require('qs');
import request from '@/utils/request'

export default {

  /**
   * 查询上传文件
   * 
   * @param params 导出参数
   */
  query(page, pageSize, opts = {}) {
    var params = {
      page: page,
      pageSize: pageSize,
      searchCount: false,
      ...opts
    }
    return request.get('/dfs/query', {
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
   * 根据ID查询文件
   * @param id 文件id
   */
  getById(id) {
    return request.get('/dfs/getById?id=' + id);
  }

}
