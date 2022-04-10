import Vue from 'vue';

// const DOMAIN = 'brizo.ru/api';
const DOMAIN = 'ozlaalfa.ru/api';

export default {
  namespaced: true,
  state: {
    currentUser: {},
    pending: false,
    unread_notifications_count: 0,
    isAuth: true,
    deals: [],
    contents: [],
    isOpenedPopup: false,
  },
  mutations: {
    set(state, updatedState) {
      for (const key in updatedState) {
        state[key] = updatedState[key];
      }
      console.log(state);
    },
    add(state, { key, value }) {
      state[key].push(value);
    },
  },
  getters: {
    user: (state) => state.currentUser,
    isActive: (state, getters) => getters.user.is_active,
    project: (state, getters) => getters.user.project,
    avatar: (state, getters) => getters.user.avatar_url,
    subDomain: (state, getters) => getters.project?.domain,
    deals: (state) => state.deals,
  },
  actions: {
    async fetchUser({ commit, getters, dispatch }, isSub = false) {
      commit('set', { pending: true });

      const route = isSub ? `https://${getters.subDomain}.${DOMAIN}/me` : `https://${DOMAIN}/me`;

      try {
        const res = await Vue.http.get(route);

        commit('set', {
          currentUser: res.data,
          unread_notifications_count: res.data.unread_notifications_count,
          isAuth: true,
        });

        if (!getters.isActive) {
          await dispatch('fetchUser', true);
        }

        return res.data;
      } catch (e) {
        if (e.response?.status === 401) {
          commit('set', { isAuth: false });
        }
      } finally {
        commit('set', { pending: false });
      }
    },
    async fetchUnreadNotificationsCount({ commit, getters }) {
      const { data } = await Vue.http.get(
        `https://${getters.subDomain}.${DOMAIN}/notifications/unread`
      );

      commit('set', {
        unread_notifications_count: data.unread_notifications_count,
      });
    },

    async fetchTransactions({ getters }) {
      const { data } = await Vue.http.get(
        `https://${getters.subDomain}.${DOMAIN}/transactions/table`,
        {
          limit: 50,
          offset: 0,
          order_column: 'transacted_and_accured',
          order_by: 'desc',
        }
      );

      return data;
    },

    async createDeal({ getters, state }) {
      try {
        const { data } = await Vue.http.post(`https://${getters.subDomain}.${DOMAIN}/deals`, {
          budget: 0,
          currency_id: getters.project.default_currency.id,
          members: [getters.user.id],
          name: 'Test with extension' + Math.floor(Math.random() * 10),
          responsible_id: 41,
          status_id: 4958, // надо воронки подтянуть
        });

        state.deals.push(data);

        return data;
      } catch (e) {
        alert(e.response.message);
      }
    },
  },
};
