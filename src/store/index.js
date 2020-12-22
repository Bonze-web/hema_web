import Vue from 'vue'
import Vuex from 'vuex'
import app from './modules/app'
import user from './modules/user'
import menu from './modules/menu'
import getters from './getters'
import tagsView from './tagsView'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    app,
    user,
    menu,
    tagsView
  },
  getters
})

export default store
