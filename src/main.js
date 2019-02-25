import Vue from "vue";
import App from "./App.vue";
import router from "./routes";
import store from "./store";

import moment from "moment";
import axios from "axios";

import SuiVue from "semantic-ui-vue";
import VueSweetalert2 from "vue-sweetalert2";

import "semantic-ui-css/semantic.min.css";
import "./assets/customize.css";
import VueScroller from "vue-scroller";
import ThailandAutoComplete from "vue-thailand-address-autocomplete";

Vue.component("ThailandAutoComplete", ThailandAutoComplete);
Vue.config.productionTip = false;
Vue.use(VueScroller);
Vue.use(SuiVue);
Vue.use(VueSweetalert2);
moment.locale("th");
Vue.prototype.$liff = window.liff;
Vue.prototype.$moment = moment;
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
  created: async function () {
    /* eslint-disable */
    const self = this;
    const APP_ID = await self.$route.query.appid;
    const KEY = await self.$route.query.key;

    if (APP_ID && KEY) {
      setTimeout(() => {
        store.commit("setLoading", false);
      }, 30 * 1000);

      self.$liff.init(() => {
        self.$liff.getProfile().then(async profile => {
          store.commit("setAppId", APP_ID);
          store.commit("setApiKey", KEY);
          const appData = await self.$api.get(`/app/enterprise/${APP_ID}/${KEY}`);
          if (appData.data) {
            store.commit("setAppData", appData.data);
            const user = await self.$api.get(
              `/app/employee/${profile.userId}/${APP_ID}`
            );
            if (user.data) {
              const UpdateUser = await self.$api.put(
                `/app/employee/${profile.userId}/${APP_ID}`, profile
              );
              if (UpdateUser) {
                store.commit("setLiff", true);
                store.commit("setUser", user.data);
              }
            } else {
              const createUser = await self.$api.post(
                `/app/employee/${profile.userId}/${APP_ID}`,
                profile
              );
              if (createUser.data) {
                const user = await self.$api.get(
                  `/app/employee/${profile.userId}/${APP_ID}`
                );
                store.commit("setUser", user.data);
                store.commit("setLiff", true);
              }
            }
          }

          store.commit("setLoading", false);
        });
      });
    } else {
      store.commit("setLoading", false);
    }
  },
  render: h => h(App)
}).$mount("#app");