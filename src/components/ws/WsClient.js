/**
 * websocket 客户端
 */
import {
  ACCESS_TOKEN_KEY,
  getToken
} from "@/utils/auth";
import SockJS from "sockjs-client";
import Stomp from "webstomp-client";

var STOMP_CLIENT = null;
const WS_SERVICE = "/newretail-ws/endpoint";
const WS_TOPIC = "/topic/message";
const WS_USER_TOPIC = "/user/topic/message";

export default {

  /** 连接服务器 */
  connect() {
    var self = this;
    return new Promise(function(resolve, reject) {
      var socket = new SockJS(WS_SERVICE);
      if (STOMP_CLIENT) {
        self.disconnect();
      }
      STOMP_CLIENT = Stomp.over(socket);
      var headers = {};
      headers[ACCESS_TOKEN_KEY] = getToken();
      STOMP_CLIENT.connect(
        headers,
        function(frame) {
          console.log("ws connected: " + frame);
          resolve(frame);
        },
        function(err, a) {
          reject(err);
        }
      );
    });
  },

  /** 断开服务器 */
  disconnect() {
    if (STOMP_CLIENT) {
      var headers = {};
      headers[ACCESS_TOKEN_KEY] = getToken();
      STOMP_CLIENT.disconnect(function() {
        console.log("ws disconnected");
      }, headers);
      STOMP_CLIENT = null;
    }
  },

  /** 订阅系统通知 */
  subscribe(cb) {
    STOMP_CLIENT.subscribe(WS_TOPIC, function(respnose) {
      // 订阅系统广播/topic/getResponse 目标发送的消息。这个是在控制器的@SendTo中定义的。
      cb && cb(JSON.parse(respnose.body).data);
    });
    STOMP_CLIENT.subscribe(WS_USER_TOPIC, function(respnose) {
      // 订阅本门店消息
      cb && cb(JSON.parse(respnose.body).data);
    });
  },

  /**
   * 开始连接websocket 
   * @param {*} cb function(message)
   */
  start(cb) {
    var self = this;
    return this.connect()
      .then(() => {
        self.subscribe(cb);
      });
  }

}
