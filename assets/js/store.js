import Vuex from 'vuex';
import Vue from 'vue';
import {ResetPlugin} from '../js/plugins/reset';
import user from './stores/user';
import api from './plugins/axios';

Vue.use(Vuex);

api()

const store = new Vuex.Store({
  plugins: [ResetPlugin],
  modules: {user},
});

export default store;
