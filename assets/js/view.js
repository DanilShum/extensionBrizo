import Vue from 'vue';
import store from './store';
import App from './App.vue';
import api from './plugins/axios';

// const DOMAIN = 'brizo.ru/api';
const DOMAIN = 'ozlaalfa.ru/api';
const ROUTE = `https://${DOMAIN}`;

const getUser = async () => {
  store.commit('user/set', { pending: true });

  try {
    const { data } = await api.get(`${ROUTE}/me`);
    store.commit('user/set', { currentUser: data });

    store.commit('set', { route: `https://${data.project.domain}.${DOMAIN}` });
  } finally {
    store.commit('user/set', { pending: false });
  }
};

getUser();

api.interceptors.request.use(async (config) => {
  config.baseURL = store.state.route;
  return config;
});

window.chrome.storage.sync.get(['contents'], (state) => {
  for (const key in state) {
    store.commit('user/set', { [key]: state[key] });
  }
});

window.chrome.storage.onChanged.addListener(function (changes) {
  for (const key in changes) {
    store.commit('user/set', { [key]: changes[key].newValue });
  }
});

new Vue({
  el: '#app',
  store,
  render: (createElement) => createElement(App),
});
