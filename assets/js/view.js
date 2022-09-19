import Vue from 'vue';
import { instanceExtension } from '@/js/plugins/extension';
import api from '@/js/plugins/axios';
import store from '@/js/stores/view/store';
import App from '@/js/App';

store.dispatch('user/setUser');

api.interceptors.request.use(async (config) => {
  config.baseURL = store.state.route;
  return config;
});

instanceExtension.storageSyncGet(['deals'], (params) => {
  console.log(params, 'storageSyncGet');
  for (const key in params) {
    store.commit(`${key}/set`, { list: params[key] });
  }
});

instanceExtension.storageSyncOnChanged(['deals'], (params) => {
  console.log(params, 'storageSyncOnChanged');

  for (const key in params) {
    store.commit(`${key}/set`, { list: params[key] });
  }
});

instanceExtension.runtimeOnMessage(function (params, sender, response) {
  console.log(params, 'runtimeOnMessage');
  for (const key in params) {
    store.commit(`${key}/set`, { list: params[key] });
  }
});

Vue.prototype.$Extension = instanceExtension;

new Vue({
  el: '#app',
  store,
  render: (createElement) => createElement(App),
});
