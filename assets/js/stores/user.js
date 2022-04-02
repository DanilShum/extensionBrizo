import Vue from 'vue';

const DOMAIN = 'brizo.ru/api';

export default {
  namespaced: true,
  state: {
    currentUser: {},
    pending: false,
    unread_notifications_count: 0,
    isAuth: true,
  },
  mutations: {
    set(state, updatedState) {
      for (const key in updatedState) {
        state[key] = updatedState[key];
      }
    },
  },
  getters: {
    user: (state) => state.currentUser,
    isActive: (state, getters) => getters.user.is_active,
    project: (state, getters) => getters.user.project,
    avatar: (state, getters) => getters.user.avatar_url,
    subDomain: (state, getters) => getters.project?.domain,
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
  },
};
