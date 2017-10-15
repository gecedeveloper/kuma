import Vue from 'vue'
import Vuex from 'vuex'
import item from './item'
import user from './user'
import shared from './shared'

Vue.use(Vuex)

export const store = new Vuex.Store({
  modules: {
    item: item,
    user: user,
    shared: shared
  }

})
