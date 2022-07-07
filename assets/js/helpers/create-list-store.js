import Vue from 'vue';
import { prototypeExtension } from '@/js/plugins/extension';

/**
 * @param {Object<string, import('vuex').Module>} modules
 * @param {string} entity
 * @param {function} sorter
 * @param {function} adapter
 * @param {Object} state
 * @param {Object} getters
 * @param {Object} mutations
 * @param {Object} actions
 * @returns {import('vuex').Module}
 */
export const createListStore = ({
  modules,
  entity,
  adapter = (item) => item,
  state = {},
  getters = {},
  mutations = {},
  actions = {},
}) => ({
  modules,
  namespaced: true,
  state: {
    list: [],
    ...state,
  },
  getters: {
    ...getters,
  },
  mutations: {
    add(state, item) {
      state.list.push(item);
      prototypeExtension.storageSyncSet({ [entity]: state.list });
    },
    past(state, { item, index }) {
      state.list.splice(index, 0, item);
    },
    set(state, updatedState) {
      for (const key in updatedState) {
        state[key] = updatedState[key];
      }
    },
    del(state, index) {
      state.list.splice(index, 1);
      prototypeExtension.storageSyncSet({ [entity]: state.list });
    },
    ...mutations,
  },
  actions: {
    async fetch({ commit }, model) {
      const { data } = await Vue.http.get(entity, adapter(model));
      commit('set', { list: data.data });
    },
    async create(context, model) {
      return await Vue.http.post(entity, adapter(model));
    },
    ...actions,
  },
});
