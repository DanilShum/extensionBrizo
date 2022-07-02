import Vue from 'vue';
import App from './App.vue';
import { prototypeExtension } from './plugins/extension';
import api from './plugins/axios';
import store from './stores/view/store';

store.dispatch('user/setUser');

api.interceptors.request.use(async (config) => {
  config.baseURL = store.state.route;
  return config;
});

prototypeExtension.storageSyncGet(['deals'], (params) => {
  console.log(params, 'storageSyncGet');
  for (const key in params) {
    store.commit(`${key}/set`, { list: params[key] });
  }
});

prototypeExtension.storageSyncOnChanged(['deals'], (params) => {
  console.log(params, 'storageSyncOnChanged');

  for (const key in params) {
    store.commit(`${key}/set`, { list: params[key] });
  }
});

prototypeExtension.runtimeOnMessage(function (params, sender, response) {
  console.log(params, 'runtimeOnMessage');
  for (const key in params) {
    store.commit(`${key}/set`, { list: params[key] });
  }
});

Vue.prototype.$Extension = prototypeExtension;

new Vue({
  el: '#app',
  store,
  render: (createElement) => createElement(App),
});
