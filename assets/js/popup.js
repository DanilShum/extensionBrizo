import Vue from 'vue';
import store from './store';


import Popup from './components/Popup.vue';

const app = new Vue({
  el: '#app',
  store,
  render: createElement => createElement(Popup),
});
