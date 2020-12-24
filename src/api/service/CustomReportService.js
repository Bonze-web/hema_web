/* 
 * 自定义报表相关接口 
 */
import request from '@/utils/request'

export default {
  /**
   * 根据订单Id查询报表定义
   * 
   * @param id 报表定义id
   */
  getDefinitionById(id) {
    var params = {
      id: id
    }
    return request.get('/report/customReport/getById', {
      params: params
    })
  },

  /** 
   * 取得当前用户已授权的报表列表
   */
  getReports() {
    return request.get('/report/customReport/getAuthorized')
  },

  /**
  * 查询报表
  * 
  * @param params 导出参数
  */
  queryReport(params) {    
    return request.post('/rpt/custom/engine/query', params)
  },

  /**
   * 导出报表
   * 
   * @param params 导出参数
   */
  exportReport(params) {
    return request.post('/rpt/custom/engine/export', params)
  }

}
