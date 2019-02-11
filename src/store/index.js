import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    app_Id: null,
    apiKey: null,
    appData: null,
    user: null
  },
  mutations: {
    setAppId(state, payload) {
      state.app_Id = payload
    },
    setApiKey(state, payload) {
      state.apiKey = payload
    },
    setAppData(state, payload) {
      state.appData = payload
    },
    setUser(state, payload) {
      state.user = payload
    },
  },
  actions: {

  }
})