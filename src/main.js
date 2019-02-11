import Vue from 'vue'
import App from './App.vue'
import router from './routes'
import store from './store'

import moment from "moment";
import axios from "axios";

import SuiVue from 'semantic-ui-vue';
import VueSweetalert2 from 'vue-sweetalert2';

import 'semantic-ui-css/semantic.min.css';
import "./assets/customize.css";

Vue.config.productionTip = false
Vue.use(SuiVue);
Vue.use(VueSweetalert2);
moment.locale("th");
Vue.prototype.$liff = window.liff;
Vue.use({
  install(Vue) {
    Vue.prototype.$api = axios.create({
      baseURL: process.env.VUE_APP_API_SERVICE
    });
  }
});
Vue.prototype.$moment = moment;

new Vue({
  router,
  store,
  render: h => h(App),
  created: async function () {
    // 1. เช็ค appid หรือ key
    // 2. state---appData
    // 3. ตรวจสอบ user
    //    3.1 สร้างหรืออัพเดท
    //    3.2 state---user
    const self = this
    const APP_ID = this.$route.query.appid
    const KEY = this.$route.query.key

    if (APP_ID && KEY) {
      store.commit("setAppId", APP_ID);
      store.commit("setApiKey", KEY);
      store.commit("setAppData", KEY);

      this.$liff.init(async () => {
        await this.$liff.getProfile().then(profile => {
          store.commit("setUser", profile);
        })
      })
    }




  },
}).$mount('#app')