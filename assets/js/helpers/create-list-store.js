import Vue from 'vue';

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
    ids: [],
    ...state,
  },
  getters: {
    ...getters,
  },
  mutations: {
    add(state, id) {
      if (!state.ids.includes(id)) {
        state.ids.push(id);
      }
    },
    past(state, { item, index }) {
      if (!state.ids.includes(item.id)) {
        state.ids.splice(index, 0, item.id);
      }
    },
    set(state, updatedState) {
      for (const key in updatedState) {
        state[key] = updatedState[key];
      }
    },
    del(state, id) {
      const i = state.ids.indexOf(id);
      if (i >= 0) {
        state.ids.splice(i, 1);
      }
    },
    ...mutations,
  },
  actions: {
    async create({ commit }, model) {
      const { data } = await Vue.http.post(entity, adapter(model));

      commit('add', data.id);

      return data;
    },
    async delete({ commit }, id) {
      await Vue.http.delete(`${entity}/${id}`);
      commit('del', id);
    },
    ...actions,
  },
});
