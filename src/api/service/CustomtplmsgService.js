/* 
 * 自定义模板消息相关接口 
 */
var qs = require('qs');
import request from '@/utils/request'

export default {
  /**
   * 作废自定义服务通知
   * @param id 自定义服务通知ID
   */
  abort(id) {
    return request.post('/mbr/wxa/tplmsg/custom/abort?id=' + id, {});
  },
  /**
   * 创建自定义服务通知
   * @param id 自定义服务通知ID
   */
  create(postData) {
    return request.post('/mbr/wxa/tplmsg/custom/create', postData);
  },
  /**
   * 编辑自定义服务通知
   * @param id 自定义服务通知ID
   */
  update(postData) {
    return request.post('/mbr/wxa/tplmsg/custom/update', postData);
  },

  /**
   * 提交自定义服务通知
   * @param id 自定义服务通知ID
   */
  submit(id) {
    return request.post('/mbr/wxa/tplmsg/custom/submit?id=' + id, {});
  },
  /**
   * 分页查询自定义模板消息
   * @param statusIn 状态: CREATED, SUBMIT, ABORT
   */
  query(page, pageSize, opts = {}) {
    var params = {
      page: page,
      pageSize: pageSize,
      searchCount: true,
      ...opts
    }
    return request.get('/mbr/wxa/tplmsg/custom/query', {
      params: params,
      paramsSerializer: function(params) {
        // 用来解决axios默认将数组参数序列化成a[]=1&a[]=2...，导致后台无法识别参数
        return qs.stringify(params, {
          arrayFormat: 'repeat'
        })
      }
    });
  },
  /**
   * 取得微信系统模板消息
   */
  getAll() {
    return request.get('/mbr/wxa/tplmsg/sys/getAll');
  },
  /**
   * 禁用微信系统模板消息
   * @param id 微信系统模板消息ID
   */
  offline(id) {
    return request.post('/mbr/wxa/tplmsg/sys/offline?id=' + id, {});
  },
  /**
   * 启用微信系统模板消息
   * @param id 微信系统模板消息ID
   */
  online(id) {
    return request.post('/mbr/wxa/tplmsg/sys/online?id=' + id, {});
  },
  /**
   * 编辑自定义服务通知
   * @param id 自定义服务通知ID
   */
  templateSync(postData) {
    return request.get('/mbr/wxa/tplmsg/sync', postData);
  }
}
