import Vue from 'vue';
import App from './App.vue';
import { prototypeExtension } from './plugins/extension';
import api from './plugins/axios';
import store from './store';

store.dispatch('user/setUser');

api.interceptors.request.use(async (config) => {
  config.baseURL = store.state.route;
  return config;
});

// window.chrome.storage.onChanged.addListener(function (changes) {
//   for (const key in changes) {
//     store.commit('user/set', { [key]: changes[key].newValue });
//   }
// });

prototypeExtension.storageSyncGet(['contents'], (params) => {
  for (const key in params) {
    store.commit('user/set', { [key]: params[key] });
  }
});

prototypeExtension.runtimeOnMessage(function (req, sender, response) {
  for (const key in req) {
    store.commit('user/set', { [key]: req[key] });
  }
});

Vue.prototype.$Extension = prototypeExtension;

new Vue({
  el: '#app',
  store,
  render: (createElement) => createElement(App),
});
