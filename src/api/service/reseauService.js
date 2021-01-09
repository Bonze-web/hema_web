/* 
 *基本资料相关接口 
*/
import request from '@/utils/request'

export default {
  /**
  * @param {int} pageSize
  * @param {int} page
  */
    /**
   * 取得当前登录用户
   */
  getLoginUser() {
    return request.get('/sys/user/getLoginUser');
  },
  frontQuery(postData) {
    return request.get('/sys/front/query', {params: postData});
  },
  binQueryBin(query) {
    const postData = {
      page: 1,
      pageSize: 10,
      codeLike: query
    }
    return request.get('/wms/bin/queryBin', {params: postData});
  },
  setCollectBin(postData) {
    return request.post('/sys/front/setCollectBin', postData);
  },
  getById(id) {
    return request.get('/sys/front/getById?id=' + id);
  }
}

