'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',

  // 开发配置
  TITLE: '"盒马WMS"',
  BASE_API: '"/wms/api"',
  // PRJ: '"SAAS"',

  APP_DOWNLOAD_URL: {
    android: '"https://www.pgyer.com/NewMerchant_Test"',
    ios: '"https://www.pgyer.com/BZJ_Test_ipa"'
  }

})
