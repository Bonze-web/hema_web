/**
 * 问卷调查接口
 */
import request from '@/utils/request'

export default {

  /**
   * 查询问卷调查
   */
  getAll() {
    return request.get('/mbr/question/getAll');
  },

  /**
   * 更新问题
   * @param {*} question 
   */
  update(question) {
    return request.put('/mbr/question/update', question);
  },
  /**
   * 更新选项
   */
  updateChoice(postData) {
    return request.put('/mbr/question/updateChoice', postData);
  },
  /**
   * 更新问题
   */
  updateQuestion(postData) {
    return request.put('/mbr/question/updateQuestion', postData);
  }
}
