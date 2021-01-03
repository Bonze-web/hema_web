import Vue from 'vue'
import Vuex from 'vuex'
import app from './modules/app'
import user from './modules/user'
import menu from './modules/menu'
import bill from './modules/bill'
import adjustinfo from './modules/adjustinfo' // 库存信息管理单
import lockandunlock from './modules/lockandunlock' // 锁定解锁单
import getters from './getters'
import tagsView from './tagsView'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    app,
    user,
    menu,
    tagsView,
    bill,
    adjustinfo,
    lockandunlock
  },
  getters
})

export default store
