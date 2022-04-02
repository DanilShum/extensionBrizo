import Vue from 'vue';
import store from './store';
import Popup from './components/Popup.vue';
import api from './plugins/axios';

api();

new Vue({
  el: '#app',
  store,
  render: (createElement) => createElement(Popup),
});
