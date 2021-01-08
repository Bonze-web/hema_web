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
  }

}

