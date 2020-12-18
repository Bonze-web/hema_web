import * as DateUtil from "./dateUtil"

export default {

  filters: {
    /**
     * 格式化简单日期
     * 
     * @param v 日期
     */
    simpleDate(v) {
      return v ? DateUtil.formatSimpleDate(v) : '';
    },

    /**
     * 格式化简单日期+时间格式
     * 
     * @param v 日期+时间
     */
    simpleDateTime(v) {
      if (!v) {
        return '';
      } else {
        const d = new Date(v);
        return DateUtil.formatSimpleDate(v) + DateUtil.formatDate(d, " HH:mm");
      }
    },

    simpleTime(v) {
      if (!v) {
        return '';
      } else {
        const d = new Date(v);
        return DateUtil.formatDate(d, "HH:mm:ss");
      }
    },

    formatDateTime(v) {
      return v ? DateUtil.formatDate(v, 'yyyy-MM-dd HH:mm:ss') : '';
    },

    formatDate(v) {
      return v ? DateUtil.formatDate(v, 'yyyy-MM-dd') : '';
    },

    /**
     * 转换成百分比，保留两位小数
     */
    percent(v) {
      return (Math.round(v * 10000) / 100).toFixed(2) + '%';
    }
  }

}
