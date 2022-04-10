import Vue from 'vue';
import store from './store';
import ToolBar from './components/ToolBar.vue';
import api from './plugins/axios';

api();

window.chrome.runtime.onMessage.addListener(function (req, sender, response) {
  for (const key in req) {
    console.log(req, { [key]: req[key] });
    store.commit('user/set', { [key]: req[key] });
    window.chrome.storage.sync.set({ [key]: req[key] });
  }
});

new Vue({
  el: '#app',
  store,
  render: (createElement) => createElement(ToolBar),
});
