import Vue from 'vue';
import store from './store';
import ToolBar from './components/ToolBar.vue';
import api from './plugins/axios';

api();

new Vue({
  el: '#app',
  store,
  render: (createElement) => createElement(ToolBar),
});
