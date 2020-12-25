import request from '@/utils/request'

/**
 * 损耗类型相关接口
 */
export default {

  /**
   * 新建损耗类型
   */
  createlossType(postData) {
      return request.post('/wms/preType/create', postData)
  },
  /**
   * 查询列表
   */
  getQueryType(data) {
      return request.get('/wms/preType/query', {params: data})
  },
  /**
   * 删除类型
   */
  removeType(id, version) {
    return request.put('/wms/preType/delete?id=' + id + '&version=' + version)
  },
  /**
   * 编辑
   */
  updateType(postData) {
      return request.post('/wms/preType/update', postData)
  }
}
