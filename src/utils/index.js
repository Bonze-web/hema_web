/**
 * 常用工具集合
 */
import {
  Message
} from 'element-ui';

function padLeftZero(str) {
  return ('00' + str).substr(str.length);
}

export function formatDate(date, fmt = "yyyy-MM-dd hh:mm:ss") {
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
  }
  const o = {
    'M+': date.getMonth() + 1,
    'd+': date.getDate(),
    'h+': date.getHours(),
    'm+': date.getMinutes(),
    's+': date.getSeconds()
  };
  for (const k in o) {
    if (new RegExp(`(${k})`).test(fmt)) {
      const str = o[k] + '';
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? str : padLeftZero(str));
    }
  }
  return fmt;
}

/**
 * 显示错误信息
 * 
 * @param {*} err
 * @param cb
 */
export function showError(err, cb) {
  if (err && typeof (err) === 'object') {
    if (err.message) {
      err = err.message;
    } else {
      err = err.toString();
    }
  }
  Message.error({
    message: err || '操作失败',
    onClose: function(msg) {
      cb && cb(msg)
    }
  });
}

/**
 * 显示普通消息
 * 
 * @param {*} msg 
 * @param cb
 */
export function showMessage(msg, cb) {
  Message.success({
    message: msg || "操作成功",
    onClose: function(msg) {
      cb && cb(msg)
    }
  });
}

// trimToString(s) {
//   return $.trim(s);
// },

// trimToNull(s) {
//   var v = this.trimToString(s);
//   return v || null;
// },

/**
 * 转换成百分比，保留两位小数
 */
export function percent(v) {
  return (Math.round(v * 10000) / 100).toFixed(2) + '%';
}

/**
 * 倒计时 
 */
export function timedown(endTime) {
  var tempDate = endTime.split(' ')[0].replace(/\-/g, "/"); // 年月日
  tempDate = tempDate + ' ' + endTime.split(' ')[1];
  var times = (new Date(tempDate).getTime() - new Date().getTime()) / 1000;
  var day = 0;
  var hour = 0;
  var minute = 0;
  var second = 0; // 时间默认值
  if (times > 0) {
    day = Math.floor(times / (60 * 60 * 24));
    hour = Math.floor(times / (60 * 60)) - (day * 24);
    minute = Math.floor(times / 60) - (day * 24 * 60) - (hour * 60);
    second = Math.floor(times) - (day * 24 * 60 * 60) - (hour * 60 * 60) - (minute * 60);
  }
  if (day <= 9) day = '0' + day;
  if (hour <= 9) hour = '0' + hour;
  if (minute <= 9) minute = '0' + minute;
  if (second <= 9) second = '0' + second;
  
  return {
    day: day,
    hour: hour,
    minute: minute,
    second: second
  }
}

/**
 * 下载图片二维码文件等，创建一个临时下载标签，根据url和name创建下载
 * @param {string} url 下载路径
 * @param {string} name 下载文件名称
 */
export function downloadFile(url, name) {
  // 创建隐藏的可下载链接
  var eleLink = document.createElement("a");
  eleLink.href = url;
  eleLink.download = name;
  // 触发点击
  document.body.appendChild(eleLink);
  eleLink.click();
  // 然后移除
  document.body.removeChild(eleLink);
}
