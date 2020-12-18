'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  TITLE: '"盒马WMS"',
  APP_DOWNLOAD_URL: {
    android: '"http://sj.qq.com/myapp/detail.htm?apkName=cn.freemud.app.xfsg.xfsgapp"',
    ios: '"http://url.cn/5Obox7u"'
  }
})
