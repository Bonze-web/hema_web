/**
 * 缓存相关接口 
 */
import request from '@/utils/request'

export default {

  /**
   * 清除缓存
   */
  clearCache() {
    return request.put('/sys/cache/clear');
  }
}
