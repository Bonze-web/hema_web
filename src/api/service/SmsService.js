/**
 * 短信服务
 */
import request from '@/utils/request'

export default {

  /**
   * 发送短信
   * 
   * @param {string} mobile 
   */
  sendSms(mobile) {
    return request.post('/sms/sendSms', { mobile: mobile });
  }

}
