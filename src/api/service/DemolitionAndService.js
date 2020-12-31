/* 
 * 容器拆并单相关接口 
 */
import request from '@/utils/request'

export default {
  /**
  * 分页查询商品拆并单接口
  */
 queryContainerMergerBill(opt) {
    return request.get('/wms/containerMergerBill/query', { params: opt });
  }
}
