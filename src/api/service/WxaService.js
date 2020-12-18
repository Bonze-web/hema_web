/**
 * 小程序相关接口 
 */
import request from '@/utils/request'

export default {

  /**
   * 创建二维码
   */
  create(appid, page, scene, size) {
    var params = {
      appid: appid,
      page: page,
      scene: scene,
      size: size
    }
    return request.get('/wxa/qrcode/create', {
      params: params
    });
  },
  /**
   * 新增微信小程序账户
   */
  createAccount(postData) {
    return request.post('/wxa/account/create', postData);
  },
  /**
   * 查询微信小程序账户
   * @param appidEquals appid等于
   * @param mchIdEquals 商户ID等于
   * @param nameLike 账户名称类似于
   */
  query(page, pageSize, opts = {}) {
    var params = {
      page: page,
      pageSize: pageSize,
      searchCount: true,
      ...opts
    };
    return request.get('/wxa/account/query', {
      params: params
    });
  },
  /**
   * 新增微信小程序账户
   */
  getById(id) {
    var params = {
      id: id
    }
    return request.get('/wxa/account/getById', {
      params: params
    });
  },
  /**
   * 删除微信小程序账户
   */
  removeAccount(id) {
    return request.delete('/wxa/account/remove?id=' + id, {});
  },
  /**
   * 更新微信小程序账户
   */
  updateAccount(postData) {
    return request.put('/wxa/account/update', postData);
  },
  /**
   * 生成场景值
   * @param appid 小程序appid
   * @param scene 参数
   */
  createScene(appid, scene) {
    var params = {
      appid: appid,
      scene: scene
    }
    return request.post('/wxa/scene/create', params)
  }
}
