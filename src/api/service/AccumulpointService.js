/* 
 *基本资料相关接口 
*/
import request from '@/utils/request'

export default {
  /**
  * @param {int} pageSize
  * @param {int} page
  */
  getStoreQuery(data) {
    return request.get('/wms/store/query', {params: data})
  }
}

