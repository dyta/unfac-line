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
  render: h => h(App)
}).$mount('#app')