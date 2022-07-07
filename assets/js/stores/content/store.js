import Vuex from 'vuex';
import Vue from 'vue';
import { ResetPlugin } from '../../plugins/reset';
import deals from '../deals';

Vue.use(Vuex);

const store = new Vuex.Store({
  plugins: [ResetPlugin],
  modules: { deals },
  state: {
    isOpenedPopup: false,
    hideInspector: false,
  },
  mutations: {
    set(state, updatedState) {
      for (const key in updatedState) {
        state[key] = updatedState[key];
      }
    },
  },
});

export default store;
