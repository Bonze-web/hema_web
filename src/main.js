import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import '@/styles/index.scss' // global css

import App from './App'
import router from './router'
import store from './store'
import '@/icons' // icon
import VueAMap from 'vue-amap';

import pageStyle from '@/utils/pageStyle.js';
Vue.use(pageStyle);

window.eventBus = new Vue();

Vue.use(VueAMap);
VueAMap.initAMapApiLoader({
  key: '320f39a269badf19e08278edb75e140f',
  plugin: ['AMap.Autocomplete', 'AMap.PlaceSearch', 'AMap.Scale', 'AMap.OverView', 'AMap.ToolBar', 'AMap.MapType', 'AMap.PolyEditor', 'AMap.CircleEditor'],
  uiVersion: '1.0.11' // 版本号
});
Vue.use(ElementUI, {
  size: 'small'
});

import { codemirror } from 'vue-codemirror'
import 'codemirror/lib/codemirror.css'
Vue.use(codemirror)

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: {
    App
  }
})
