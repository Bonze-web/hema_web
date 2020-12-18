/* 
 *系统配置相关接口 
 */
import request from '@/utils/request'

export default {

  /**
   * 查询系统配置
   */
  query() {
    return request.get('/sys/options/query');
  },
  /**
   * 更新系统配置
   */
  update(postData) {
    return request.put('/sys/options/update', postData)
  },
  /**
   * 批量更新系统配置
   */
  batchUpdate(postData) {
    return request.put('/sys/options/batchUpdate', postData)
  },
  /**
   * 分组查询系统配置详情
   */
  getGroupOptions() {
    return request.get('/sys/options/getGroupOptions')
  },
  /**
   * 查询系统配置
   */
  queryByKeys(keys) {
    var params = {
      keys: keys
    }
    return request.get('/sys/options/query', {
      params: params
    });
  }
}
