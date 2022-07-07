import Vuex from 'vuex';
import Vue from 'vue';
import { ResetPlugin } from '@/js/plugins/reset';
import user from '@/js/stores/user';
import deals from '@/js/stores/deals';
import funnels from '@/js/stores/funnels';

Vue.use(Vuex);

// const DOMAIN = 'brizo.ru/api';
const DOMAIN = 'ozlaalfa.ru/api';

const store = new Vuex.Store({
  plugins: [ResetPlugin],
  modules: { user, deals, funnels },
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
  actions: {
    async initialFetch({ dispatch }) {
      await dispatch('user/fetchUser');
      dispatch('user/fetchUnreadNotificationsCount');
      dispatch('funnels/fetch');
    },
  },
});

export default store;
