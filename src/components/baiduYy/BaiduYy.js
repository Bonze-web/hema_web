/**
 * 百度语音
 */
import axios from 'axios'
import Cookies from 'js-cookie'

const BAIDU_TXT2AUDIO_URL = "https://tsn.baidu.com/text2audio?lan=zh&cuid=newretail-web&ctp=1";
const BAIDU_YY_ACCESS_TOKEN_KEY = 'baidu-yy-access-token';

function getTokenFromBaidu() {
  const request = axios.create({});
  return request.get('/newretail-ws/ws/bd/getYyToken').then(resp => {
    if (!resp || !resp.data) {
      throw new Error("取百度token异常");
    }
    var data = resp.data;
    if (data.code !== 0) {
      throw new Error(data.message);
    } else {
      return data.data;
    }
  })
}

/**
 * 取得百度语音的token
 */
function getToken() {
  return new Promise(function(resolve, reject) {
    var token = Cookies.get(BAIDU_YY_ACCESS_TOKEN_KEY);
    if (token) {
      resolve(token);
    } else {
      return getTokenFromBaidu()
        .then(token => {
          Cookies.set(BAIDU_YY_ACCESS_TOKEN_KEY, token);
          return token;
        })
        .catch(err => {
          console.log(err);
        })
    }
  })
}

export default {

  /**
   * 取得语音文件的url
   * @param {*} text 
   */
  getVoiceUrl(text) {
    return getToken()
      .then(token => {
        return BAIDU_TXT2AUDIO_URL + "&tok=" + token +
          "&tex=" + encodeURI(encodeURI(text));
      }).catch(err => {
        console.log(err);
      })
  }

}
