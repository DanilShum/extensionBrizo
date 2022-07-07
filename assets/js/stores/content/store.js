import Vuex from 'vuex';
import Vue from 'vue';
import { ResetPlugin } from '@/js/plugins/reset';
import deals from '@/js/stores/deals';

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
