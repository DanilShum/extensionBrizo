import Vue from 'vue';

// const DOMAIN = 'brizo.ru/api';
const DOMAIN = 'ozlaalfa.ru/api';
const ROUTE = `https://${DOMAIN}`;

export default {
  namespaced: true,
  state: {
    currentUser: null,
    pending: false,
    unread_notifications_count: 0,
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
    isActive: (state, getters) => getters.user?.is_active,
    project: (state, getters) => getters.user?.project,
    projects: (state, getters) => getters.user?.projects,
    avatar: (state, getters) => getters.user?.avatar_url,
    subDomain: (state, getters) => getters.project?.domain,
  },
  actions: {
    async setUser({ commit }, project) {
      commit('set', { pending: true });

      try {
        const { data } = await Vue.http.get(`${ROUTE}/me`);
        commit('set', { currentUser: data });
        const domain = project?.domain || data.project.domain;
        commit('set', { route: `https://${domain}.${DOMAIN}` }, { root: true });
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
    async fetchUnreadNotificationsCount({ commit }) {
      const { data } = await Vue.http.get(`notifications/unread`);

      commit('set', {
        unread_notifications_count: data.unread_notifications_count,
      });
    },
    async login({ commit }, params) {
      const res = await Vue.http.post('auth', params);
      commit('set', { currentUser: res.data });
      return res;
    },
    async logout({ commit }) {
      await Vue.http.delete('auth');
      commit('set', { currentUser: null });
    },
  },
};
