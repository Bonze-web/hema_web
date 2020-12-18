/**
 * 基因相关接口 
 */
import request from '@/utils/request'

export default {

  /**
   * 通过barcode返回用户信息
   */
  checkInfo(barcodes) {
    return request.post('/mbr/barcode/checkInfo?barcodes=' + barcodes, {})
  }
}
