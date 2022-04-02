import Vuex from 'vuex';
import Vue from 'vue';
import { ResetPlugin } from './plugins/reset';
import user from './stores/user';

Vue.use(Vuex);

const store = new Vuex.Store({
  plugins: [ResetPlugin],
  modules: { user },
});

export default store;
