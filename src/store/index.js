import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    app_Id: null,
    apiKey: null,
    appData: null,
    user: null,
    isLoading: true,
    passingLiff: false
  },
  mutations: {
    setAppId(state, payload) {
      state.app_Id = payload
    },
    setApiKey(state, payload) {
      state.apiKey = payload
    },
    setLiff(state, payload) {
      state.passingLiff = payload
    },
    setAppData(state, payload) {
      state.appData = payload
    },
    setUser(state, payload) {
      state.user = payload
    },
    setLoading(state, payload) {
      state.isLoading = payload
    },
  },
  actions: {

  }
})