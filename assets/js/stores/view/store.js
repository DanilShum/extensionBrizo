import Vuex from 'vuex';
import Vue from 'vue';
import { ResetPlugin } from '../../plugins/reset';
import user from '../user';
import deals from '../deals';

Vue.use(Vuex);

// const DOMAIN = 'brizo.ru/api';
const DOMAIN = 'ozlaalfa.ru/api';

const store = new Vuex.Store({
  plugins: [ResetPlugin],
  modules: { user, deals },
  state: {
    route: `https://${DOMAIN}`,
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
