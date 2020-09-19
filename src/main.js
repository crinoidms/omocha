import Vue from 'vue';
import axios from 'axios';
import VueAxios from 'vue-axios';
import Loading from 'vue-loading-overlay';
import 'vue-loading-overlay/dist/vue-loading.css';
// VeeValidate 驗證
import VeeValidate from 'vee-validate';
import zhTW from 'vee-validate/dist/locale/zh_TW';
import VueI18n from 'vue-i18n';

import 'bootstrap';
import $ from 'jquery';

import App from './App.vue';
import router from './router';

window.$ = $;
Vue.config.productionTip = false;

Vue.prototype.$bus = new Vue();
Vue.use(VueAxios, axios);
Vue.component('Loading', Loading);

new Vue({
  router,
  render: (h) => h(App),
}).$mount('#app');

// 中文化驗證
Vue.use(VueI18n);
const i18n = new VueI18n({
  locale: 'zhTW',
});
Vue.use(VeeValidate, {
  events: 'input|blur',
  i18n,
  dictionary: {
    zhTW,
  },
});

new Vue({
  i18n,
  router,
  render: (h) => h(App),
}).$mount('#app');
