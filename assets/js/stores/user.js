import Vue from 'vue';
import { prototypeExtension } from '../plugins/extension';


// const DOMAIN = 'brizo.ru/api';
const DOMAIN = 'ozlaalfa.ru/api';
const ROUTE = `https://${DOMAIN}`;

export default {
  namespaced: true,
  state: {
    currentUser: null,
    pending: false,
    unread_notifications_count: 0,
    deals: [],
    contents: [],
    isOpenedPopup: false,
    hideInspector: false,
  },
  mutations: {
    set(state, updatedState) {
      for (const key in updatedState) {
        state[key] = updatedState[key];
      }
    },
    add(state, { key, value }) {
      state[key].push(value);
    },
    removeContents(state, index) {
      state.contents.splice(index, 1);
      prototypeExtension.storageSyncSet({ contents: state.contents });
    },
    setContent(state, { key, value }) {
      state[key] = value;
      prototypeExtension.storageSyncSet({ [key]: value });
    },
  },
  getters: {
    user: (state) => state.currentUser,
    isActive: (state, getters) => getters.user?.is_active,
    project: (state, getters) => getters.user?.project,
    avatar: (state, getters) => getters.user?.avatar_url,
    subDomain: (state, getters) => getters.project?.domain,
    deals: (state) => state.deals,
  },
  actions: {
    async setUser({ commit }) {
      commit('set', { pending: true });

      try {
        const { data } = await Vue.http.get(`${ROUTE}/me`);
        commit('set', { currentUser: data });
        commit('set', { route: `https://${data.project.domain}.${DOMAIN}` }, { root: true });
      } finally {
        commit('set', { pending: false });
      }
    },
    async fetchUser({ commit }) {
      commit('set', { pending: true });

      try {
        const res = await Vue.http.get('me');

        commit('set', {
          currentUser: res.data,
          unread_notifications_count: res.data.unread_notifications_count,
        });

        return res.data;
      } catch (e) {
        if (e.response?.status === 401) {
          commit('set', { currentUser: null });
        }
      } finally {
        commit('set', { pending: false });
      }
    },
    async fetchUnreadNotificationsCount({ commit, rootState }) {
      const { data } = await Vue.http.get(`notifications/unread`);

      commit('set', {
        unread_notifications_count: data.unread_notifications_count,
      });
    },

    async fetchTransactions({ rootState }) {
      const { data } = await Vue.http.get(`transactions/table`, {
        limit: 50,
        offset: 0,
        order_column: 'transacted_and_accured',
        order_by: 'desc',
      });

      return data;
    },

    createDeals({ getters, state }) {
      state.contents.forEach(async (item) => {
        try {
          const { data } = await Vue.http.post(`deals`, {
            budget: Number(item.budget?.replace(/\D/g, '')),
            description: item.description,
            currency_id: getters.project.default_currency.id,
            members: [getters.user.id],
            name: item.name,
            responsible_id: getters.user.id,
            status_id: 5425, // надо воронки подтянуть
          });

          state.deals.push(data);

          return data;
        } catch (e) {
          console.log(e);
        }
      });
    },
  },
};
