/**
 * 系统日志相关接口
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
    return request.get('/sys/log/query', {
      params: params
    });
  }

}
